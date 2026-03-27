
import {

    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription, DialogClose,
} from "@/components/ui/dialog"

import {Button, buttonVariants} from "@/components/ui/button";
import {CopyIcon, RefreshCcw} from "lucide-react";
import {useWorkspaceId} from "@/hooks/use-workspace-id";
import {toast} from "sonner";
import {useNewJoinCode} from "@/features/workspaces/api/use-new-join-code";
import {cn} from "@/lib/utils";
import {useConfirm} from "@/hooks/use-confirm";

interface Props {

    open: boolean;
    setOpen: (open: boolean) => void;
    name: string;
    joinCode: string;
}


export const InviteModal = ({open, setOpen, name, joinCode} : Props) => {

    const workspaceId = useWorkspaceId();


    const handleCopy = () => {

        const inviteLink = `${window.location.origin}/join/${workspaceId}`

        navigator.clipboard.writeText(inviteLink).then(() => toast.success("Copied!"));

    }

    const {mutate, isPending} = useNewJoinCode();

    const handleNewCode = async () => {

        const ok = await confirm();

        if(!ok) return;

        mutate({

            workspaceId
        }, {
            onSuccess: () => {
                toast.success("Successfully generated a new join code!");
            },
            onError: () => {
                toast.error("Failed to generate a new code.")
            }
        })

    }

    const [ConfirmDialog, confirm] = useConfirm(
        "Are you sure?",
        "This will deactivate the current invite code and generate a new one."
    )




    return (
        <>

            <ConfirmDialog />

            <Dialog open={open} onOpenChange={setOpen}>

                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>

                            Invite people to your {name}

                        </DialogTitle>

                        <DialogDescription>
                            Use the code to invite people to your workspace
                        </DialogDescription>
                    </DialogHeader>

                    <div className={"flex flex-col gap-y-4 items-center justify-center py-10"}>

                        <p className={"text-4xl font-bold tracking-widest uppercase"}>{joinCode}</p>

                        <Button variant={"ghost"} size={"sm"} onClick={handleCopy}>

                            Copy Link
                            <CopyIcon className={"size-4 ml-2"}/>

                        </Button>

                    </div>

                    <div className={"flex items-center justify-between w-full"}>

                        <Button onClick={handleNewCode} disabled={isPending} variant={"outline"} >
                            New Code
                            <RefreshCcw className={'size-4 animate-spin ml-2'}/>
                        </Button>

                        <DialogClose className={cn(buttonVariants({variant: "destructive"}))}>
                            <p>Close</p>
                        </DialogClose>

                    </div>


                </DialogContent>
            </Dialog>
        </>
    )
}