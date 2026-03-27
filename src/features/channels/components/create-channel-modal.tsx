import {

    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"


import {useCreateChannelModal} from "../store/use-create-channel-modal"
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {ChangeEventHandler, SubmitEventHandler, useState} from "react";
import {useCreateChannel} from "@/features/channels/api/use-create-channel";
import {useWorkspaceId} from "@/hooks/use-workspace-id";

export const CreateChannelModal = () => {

    const [open, setOpen] = useCreateChannelModal();

    const [name, setName] = useState("");

    const {mutate, isPending} = useCreateChannel();
    const workspaceId = useWorkspaceId();

    const handleChange:ChangeEventHandler<HTMLInputElement> = (e) => {

        const value = e.target.value.replace(/\s+/g, "-").toLowerCase()
        setName(value);
    }


    const handleClose = () => {
        setName("");
        setOpen(false);
    }

    const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();

        mutate({
            name, workspaceId
        }, {

            onSuccess: (id) => {

                handleClose();

            }
        })
    }


    return (
        <Dialog open={open} onOpenChange={handleClose}>

            <DialogContent>

                <DialogHeader>

                    <DialogTitle>
                        Add a Channel
                    </DialogTitle>

                </DialogHeader>

                <form className={"space-y-4"} onSubmit={handleSubmit}>

                    <Input value={name} disabled={isPending} onChange={handleChange} required={true} autoFocus={true} minLength={3} maxLength={60} placeholder={"New channel name"}/>
                    <div className={"flex justify-end"}>

                        <Button disabled={isPending} type="submit">

                            Create

                        </Button>

                    </div>

                </form>

            </DialogContent>

        </Dialog>
    )
}