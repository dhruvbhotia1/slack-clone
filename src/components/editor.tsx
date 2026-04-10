import Quill, {type QuillOptions} from 'quill'
import  "quill/dist/quill.snow.css";
import {RefObject, useEffect, useRef, useState} from "react";
import {Button} from "@/components/ui/button";
import {PiTextAa} from "react-icons/pi";
import {ImageIcon, Smile, XIcon} from "lucide-react";
import {MdSend} from "react-icons/md";
import {Hint} from "@/components/hint";
import {useLayoutEffect} from "react";
import {Delta, Op} from "quill/core";
import {cn} from "@/lib/utils";
import {EmojiPopover} from "./emoji-popover"
import Image from "next/image";


type EditorValue = {

    image: File | null;
    body: string;

}


interface Props {

    onSubmit: ({image, body}: EditorValue) => void;

    onCancel?: () => void;

    placeholder?: string;

    defaultValue?: Delta | Op[];

    disabled?: boolean;

    innerRef?: RefObject<Quill | null>;

    variant?: "create" | "update";


}



const Editor = ({variant = "create", onCancel, onSubmit, placeholder="Write something...", defaultValue = [], innerRef, disabled}: Props) => {

    const containerRef = useRef<HTMLDivElement>(null);

    const submitRef = useRef(onSubmit);

    const placeholderRef = useRef(placeholder);

    const defaultValueRef = useRef(defaultValue);
    const disabledRef = useRef(disabled);
    const quillRef = useRef<Quill | null>(null);

    const [text, setText] = useState("");

    const [image, setImage] = useState<File | null>(null);

    const imageElementRef = useRef<HTMLInputElement | null>(null);



    const [isToolbarVisible, setIsToolbarVisible] = useState(false);

    useLayoutEffect(() => {


        submitRef.current = onSubmit;

        placeholderRef.current = placeholder;

        defaultValueRef.current = defaultValue;

        disabledRef.current = disabled;


    });



    useEffect(() => {
        if(!containerRef.current) return;

        const container = containerRef.current;

        const editorContainer = container.appendChild(
            container.ownerDocument.createElement("div")
        );

        const options: QuillOptions = {

            theme: "snow",
            placeholder: placeholderRef.current,
            modules: {

                toolbar: [
                    ["bold", "italic", "underline", "strike",],
                    ["link"],
                    [{list: "ordered"}, {list: "bullet"}]
                ],
                keyboard: {
                    bindings: {
                        enter: {
                            key: "Enter",
                            handler: () => {

                                // submit the message to send
                                const text = quill.getText();
                                const addedImage = imageElementRef.current?.files?.[0] || null;

                                const isEmpty = !addedImage && text.replace(/<(.|\n)*?>/g, "").trim().length === 0;

                                if(isEmpty) return;

                                const body = JSON.stringify(quill.getContents())

                                submitRef.current?.({body, image: addedImage})

                                return;
                            }
                        },
                        shift_enter: {

                            key: "Enter",
                            shiftKey: true,
                            handler: () => {
                                quill.insertText(quill.getSelection()?.index || 0, "\n");
                            }
                        }
                    }
                }
            }


        }


        const quill = new Quill(editorContainer, options);

        quillRef.current = quill;
        quillRef.current.focus();

        if(innerRef) {

            innerRef.current = quill;
        }

        quill.setContents(defaultValueRef.current);
        setText(quill.getText());

        quill.on(Quill.events.TEXT_CHANGE, () => {
            setText(quill.getText());

        })



        return () => {

            quill.off(Quill.events.TEXT_CHANGE)

            if(container) {

                container.innerHTML = "";
            }

            if(quillRef.current) {

                quillRef.current = null;
            }

            if(innerRef) {
                innerRef.current = null;
            }
        }

    }, [innerRef])

    const toggleToolbar = () => {

        setIsToolbarVisible((current) => !current );

        const toolbarElement = containerRef.current?.querySelector(".ql-toolbar");

        if(toolbarElement) {

            toolbarElement.classList.toggle("hidden");
        }
    }

    const onEmojiSelect = (emoji: any) => {

        const quill = quillRef.current;

        quill?.insertText(quill?.getSelection()?.index || 0, emoji.native)


    }



    const isEmpty = !image && text.replace(/<(.|\n)*?>/g, "").trim().length === 0;






    return (

        <div className={"flex flex-col"}>

            <input type={"file"} accept={"image/*"} ref={imageElementRef} onChange={(event) => setImage(event.target.files![0])} className={"hidden"}/>

            <div className={cn("flex flex-col border border-slate-200 rounded-md overflow-hidden focus-within:border-slate-300 focus-within:shadow:sm transition bg-white ", disabled && "opacity-50")}>

                <div ref={containerRef} className={"h-full ql-custom"}/>

                {!!image && (
                    <>
                        <div className={"p-2"}>

                            <div className={"relative size-15.5 flex items-center justify-center group/image"}>

                                    <Button onClick={() => {setImage(null); imageElementRef.current!.value = ""}} className={"hidden group-hover/image:flex rounded-full bg-black/70 hover:bg-black absolute -top-2.5 -right-2.5 text-white size-6 z-4 border-2 border-white items-center justify-center  "}>

                                        <XIcon className={"size-3.5"}/>

                                    </Button>


                                <Image src={URL.createObjectURL(image)} alt={"uploaded"} fill className={"rounded-xl overflow-hidden border object-cover"}/>


                            </div>

                        </div>
                    </>
                )}

                <div className={"flex px-2 pb-2 z-5 gap-x-3 items-center"}>

                    <Hint label={isToolbarVisible ? "Show Formatting" : "Hide Formatting"}>

                            <Button asChild disabled={disabled} size={"iconSm"} variant={"ghost"} onClick={toggleToolbar} className={"h-5 w-5"}>
                                <PiTextAa className={"size-4"}/>
                            </Button>

                    </Hint>

                    <EmojiPopover onEmojiSelect={onEmojiSelect} >

                        <Button asChild disabled={disabled} size={"iconSm"} variant={"ghost"} className={"h-5 w-5"}>
                            <Smile className={"size-4"}/>
                        </Button>

                    </EmojiPopover>



                    {

                        variant === "create" && (


                           <Hint label={"Image"}>


                                   <Button asChild disabled={disabled} size={"iconSm"} variant={"ghost"} onClick={() => imageElementRef?.current?.click()} className={"h-5 w-5"}>
                                       <ImageIcon className={"size-4"}/>
                                   </Button>


                           </Hint>
                        )

                    }


                    {

                        variant === "update" && (

                            <div className={"ml-auto  flex items-center gap-x-2"}>

                                <Button variant={"outline"} size={'sm'} className={"cursor-pointer"} onClick={onCancel} disabled={disabled || isEmpty}>
                                    Cancel
                                </Button>

                                <Button variant={"transparent"} className={"bg-[#007a5a] hover:bg-[#007a5a]/80 cursor-pointer"} size={'sm'} onClick={() => {onSubmit({body: JSON.stringify(quillRef.current?.getContents()), image})}} disabled={disabled || isEmpty}>
                                    Save
                                </Button>

                            </div>
                        )
                    }

                    {
                        variant === "create" && (

                            <Button className={cn("ml-auto cursor-pointer", isEmpty ?  "bg-white hover:bg-white text-muted-foreground" : "bg-[#007a5a] hover:bg-[#007a5a]/80 text-white")} disabled={disabled || isEmpty} size={"iconSm"} onClick={() => {onSubmit({body: JSON.stringify(quillRef.current?.getContents()), image})}}>

                                <MdSend className={"size-4 "}/>

                            </Button>
                        )
                    }

                </div>

            </div>

            {
                variant === "create" && (

                    <>

                        <div className={cn("p-3 text-[10px] text-muted-foreground flex justify-end opacity-0 transition", !isEmpty && "opacity-100" )}>

                            <p className={"text-md"}><strong>SHIFT + RETURN</strong> to add a new line</p>

                        </div>

                    </>
                )
            }

        </div>
    )
}


export default Editor;