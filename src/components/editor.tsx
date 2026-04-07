import Quill, {type QuillOptions} from 'quill'
import  "quill/dist/quill.snow.css";
import {RefObject, useEffect, useRef, useState} from "react";
import {Button} from "@/components/ui/button";
import {PiTextAa} from "react-icons/pi";
import {ImageIcon, Smile} from "lucide-react";
import {MdSend} from "react-icons/md";
import {Hint} from "@/components/hint";
import {useLayoutEffect} from "react";
import {Delta, Op} from "quill/core";
import {cn} from "@/lib/utils";



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



    const isEmpty = text.replace(/<(.|\n)*?>/g, "").trim().length === 0;

    const toggleToolbar = () => {

        setIsToolbarVisible((current) => !current );

        const toolbarElement = containerRef?.current?.querySelector(".ql-toolbar");

        if(toolbarElement) {

            toolbarElement.classList.toggle("hidden");
        }
    }




    return (

        <div className={"flex flex-col"}>

            <div className={"flex flex-col border border-slate-200 rounded-md overflow-hidden focus-within:border-slate-300 focus-within:shadow:sm transition bg-white "}>

                <div ref={containerRef} className={"h-full ql-custom"}/>

                <div className={"flex px-2 pb-2 z-5 gap-x-3"}>

                    <Hint label={isToolbarVisible ? "Show Formatting" : "Hide Formatting"}>

                            <Button asChild disabled={disabled} size={"iconSm"} variant={"ghost"} onClick={toggleToolbar} className={"h-6 w-6"}>
                                <PiTextAa className={"size-4"}/>
                            </Button>

                    </Hint>

                   <Hint label={"Emojis"}>

                       <Button asChild disabled={disabled} size={"iconSm"} variant={"ghost"} onClick={() => {}} className={"h-6 w-6"}>
                           <Smile className={"size-4"}/>
                       </Button>

                   </Hint>

                    {

                        variant === "create" && (


                           <Hint label={"Image"}>


                                   <Button asChild disabled={disabled} size={"iconSm"} variant={"ghost"} onClick={() => {}} className={"h-6 w-6"}>
                                       <ImageIcon className={"size-4"}/>
                                   </Button>


                           </Hint>
                        )

                    }


                    {

                        variant === "update" && (

                            <div className={"ml-auto  flex items-center gap-x-2"}>

                                <Button variant={"outline"} size={'sm'} onClick={() => {}} disabled={false}>
                                    Cancel
                                </Button>

                                <Button variant={"outline"} size={'sm'} onClick={() => {}} disabled={false}>
                                    Save
                                </Button>

                            </div>
                        )
                    }

                    {
                        variant === "create" && (

                            <Button className={cn("ml-auto", isEmpty ?  "bg-[#007a5a] hover:bg-[#007a5a] text-white" : "bg-white hover:bg-white text-muted-foreground")} disabled={disabled || isEmpty} onClick={() => {}}>

                                <MdSend className={"size-4 "}/>

                            </Button>
                        )
                    }

                </div>

            </div>

            <div className={"p-3 text-[10px] text-muted-forground flex justify-end"}>

                <p className={"text-md"}><strong>SHIFT + RETURN</strong> to add a new line</p>

            </div>

        </div>
    )
}


export default Editor;