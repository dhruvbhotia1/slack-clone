import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogHeader,
    DialogTitle,
    DialogClose,
    DialogFooter,
} from "@/components/ui/dialog"
import {SubmitEventHandler, useState} from "react";
import {TrashIcon} from "lucide-react";
import {useUpdateWorkspace} from "@/features/workspaces/api/use-update-workspace";
import {useRemoveWorkspace} from "@/features/workspaces/api/use-remove-workspace";
import {Input} from "@/components/ui/input";
import {cn} from "@/lib/utils";
import {Button, buttonVariants} from "@/components/ui/button";
import {useWorkspaceId} from "@/hooks/use-workspace-id";
import {toast} from "sonner";
import {useRouter} from "next/navigation";
import {useConfirm} from "@/hooks/use-confirm";

interface Props {

    open: boolean;
    setOpen: (open: boolean) => void;
    initialValues: string;
}

export const PreferencesModal = ({open, setOpen, initialValues}: Props ) => {

    const workspaceId = useWorkspaceId();
    const router = useRouter();


    const [value, setValue] = useState(initialValues);

    const [editOpen, setEditOpen] = useState(false);

    const {mutate: updateWorkspace, isPending: isUpdatingWorkspace} = useUpdateWorkspace();
    const {mutate: removeWorkspace, isPending: isRemovingWorkspace} = useRemoveWorkspace();

    const handleRemove= async () => {

        const ok = await confirm();
        if(!ok) return;


        removeWorkspace({id: workspaceId}, {

            onSuccess: () => {

                toast.success("Workspace removed successfully.");
                router.replace(`/`);

            },

            onError: () => {

                toast.success("Failed to removing workspace.");
            }
        })



    }

    const handleEdit: SubmitEventHandler<HTMLFormElement> = (e) => {

        e.preventDefault();

        updateWorkspace({

            id: workspaceId,
            name: value
        }, {

            onSuccess: () => {
                setEditOpen(false);
                toast.success("workspace updated successfully.");
            },

            onError: () => {

                toast.error("Failed to update workspace.");
            }
        })

    }

    const [ConfirmDialog, confirm] = useConfirm("Are you sure?", "This action is irreversible.");





    return (

        <>
            <ConfirmDialog/>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className={"p-0 bg-gray-50 overflow-hidden"}>

                    <DialogHeader className={"p-4 border--b bg-white"}>
                        <DialogTitle>{initialValues}</DialogTitle>
                    </DialogHeader>

                    <div className={"px-4 pb-4 flex flex-col gap-y-2"}>


                        <Dialog open={editOpen} onOpenChange={setEditOpen}>

                            <DialogTrigger>
                                <div className={"px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50"}>

                                    <div className={"flex items-center justify-between"}>

                                        <p className={"text-sm font-semibold"}>

                                            Workspace name

                                        </p>

                                        <p className={"text-sm text-[#1264a3] hover:underline font-semibold"}>

                                            Edit

                                        </p>

                                    </div>

                                </div>
                            </DialogTrigger>

                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>
                                        Rename this Workspace
                                    </DialogTitle>
                                </DialogHeader>
                                <form className={"space-y-4"} onSubmit={handleEdit}>

                                    <Input value={value} disabled={isUpdatingWorkspace} onChange={(e) => setValue(e.target.value)} required={true} autoFocus={true} minLength={3} maxLength={80} placeholder={"New name"}/>

                                    <DialogFooter>
                                        <DialogClose className={cn(buttonVariants({variant: "outline"}))} disabled={isUpdatingWorkspace}>

                                            Cancel

                                        </DialogClose>

                                        <Button disabled={isUpdatingWorkspace} type="submit">
                                            Save
                                        </Button>


                                    </DialogFooter>

                                </form>
                            </DialogContent>



                        </Dialog>

                        <Button disabled={isRemovingWorkspace} onClick={() => handleRemove()} className={"flex items-center gap-x-2 px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50 text-rose-600"}>
                            <TrashIcon className={'size-5'}/>
                            <p>Delete workspace</p>
                        </Button>

                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}