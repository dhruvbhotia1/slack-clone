import {Button, buttonVariants} from "@/components/ui/button";

import {FaChevronDown} from "react-icons/fa6";

import {

    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogDescription,
    DialogTitle,
    DialogClose,
    DialogFooter,
} from "@/components/ui/dialog"
import {cn} from "@/lib/utils";
import {TrashIcon} from "lucide-react";
import {ChangeEventHandler, SubmitEventHandler, useState} from "react";
import {Input} from "@/components/ui/input";
import {useUpdateChannel} from "@/features/channels/api/use-update-channel";
import {useChannelId} from "@/hooks/use-channel-id";
import {toast} from "sonner";

import {useRemoveChannel} from "@/features/channels/api/use-remove-channel";

import {useConfirm} from "@/hooks/use-confirm";
import {useRouter} from "next/navigation";
import {useWorkspaceId} from "@/hooks/use-workspace-id";
import {useCurrentMember} from "@/features/members/api/use-current-member";

interface Props {

    title: string
}

export const Header = ({title}: Props) => {

    const [value, setValue] = useState(title);
    const [editOpen, setEditOpen] = useState(false);

    const channelId = useChannelId();

    const router = useRouter();



    const handleChange:ChangeEventHandler<HTMLInputElement> = (e) => {

        const value = e.target.value.replace(/\s+/g, "-").toLowerCase()
        setValue(value);
    }

    const {mutate: channelUpdate, isPending: updatePending} = useUpdateChannel();

    const handleSubmit: SubmitEventHandler<HTMLFormElement> = (e) => {

        e.preventDefault();


        channelUpdate({

            id: channelId,
            name: value,
        }, {

            onSuccess: () => {

                toast.success("Channel updated successfully.");
                setEditOpen(false);
            },

            onError: () => {

                toast.error("Failed to update channel");
            }
        })
    }


    const {mutate: channelRemove, isPending: removePending} = useRemoveChannel();

    const [ConfirmDialog, confirm] = useConfirm("Are you sure?", "This action is irreversible. You are deleting this channel?");

    const workspaceId = useWorkspaceId();


    const handleRemove = async () => {

        const ok = await confirm();

        if(!ok) return;

        channelRemove({

            id: channelId,
        }, {

            onSuccess: () => {
                toast.success("Channel removed successfully.");
                router.push(`/workspace/${workspaceId}`)
            },

            onError: () => {
                toast.error("Failed to remove channel");
                router.push(`/workspace/${workspaceId}`)
            }
        })


    }

    const {data: member} = useCurrentMember({workspaceId});

    const handleEditOpen = (value: boolean) => {

        if (member?.role !== "admin") return;

        setEditOpen(value);

    }





    return (

        <div className={"bg-white border-b h-12.25 flex items-center px-4 overflow-hidden"}>

            <ConfirmDialog/>


            <Dialog>
                <DialogTrigger className={cn(buttonVariants({variant: "ghost", size: "sm"}), "text-lg font-semibold px-2 overflow-hidden w-auto")}>

                    <span className={"truncate"}>

                       # {title}

                    </span>

                    <FaChevronDown  className={"size-2.5 ml-auto"}/>

                </DialogTrigger>


                <DialogContent className={"p-0 bg-gray-50 overflow-hidden"}>

                    <DialogHeader className={"p-4 border-b bg-white"}>

                        <DialogTitle>

                            # {title}

                        </DialogTitle>

                    </DialogHeader>


                    <div className={"px-4 pb-4 flex flex-col gap-y-3 "}>

                        <Dialog open={editOpen} onOpenChange={handleEditOpen}>

                            <DialogTrigger>

                                <div className={"px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50"}>

                                    <div className={"flex items-center justify-between"}>

                                        <p className={"text-sm font-semibold"}># {title}</p>

                                        {member?.role === "admin" && (
                                            <p className={"text-sm text-[#1264a3] hover:underline cursor-pointer font-semibold"}>Edit</p>
                                        )}



                                    </div>
                                </div>

                            </DialogTrigger>


                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Rename this channel</DialogTitle>
                                </DialogHeader>

                                <form className={"space-y-4"} onSubmit={handleSubmit}>
                                    <Input value={value} disabled={updatePending} onChange={handleChange} required={true} autoFocus={true} minLength={3} maxLength={80} placeholder={"e.g. general, reports, office, personal"}/>

                                    <DialogFooter>
                                        <DialogClose disabled={updatePending}>

                                            <div className={cn(buttonVariants({variant: "outline", size: "sm"}))}>

                                                Cancel

                                            </div>

                                        </DialogClose>

                                        <div className={cn(buttonVariants({variant: "default", size: "sm"}))}>

                                            Save

                                        </div>
                                    </DialogFooter>
                                </form>



                            </DialogContent>

                        </Dialog>

                        <div className={cn(buttonVariants({variant: "ghost", size: "sm"}), "flex items-center gap-x-2 px-5 py-4 bg-white rounded-lg cursor-pointer border hover:bg-gray-50 text-rose-600")} onClick={handleRemove}>

                            <TrashIcon className={"size-4 font-semibold"} />

                            <p className={"text-sm font-semibold "}>Delete channel</p>

                        </div>


                    </div>

                </DialogContent>
            </Dialog>


        </div>
    )

}