import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import {useCreateWorkspaceModal} from "@/features/workspaces/store/use-create-workspace-modal";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useCreateWorkspace} from "@/features/workspaces/api/use-create-workspace";
import {useState} from "react";
import {useRouter} from "next/navigation";
import {toast} from "sonner"


export const CreateWorkSpaceModal = () => {

    const [open, setOpen] = useCreateWorkspaceModal();

    const [name,setName] = useState("");

    const {mutate} = useCreateWorkspace();

    const router = useRouter();


    const handleClose = () => {
        setOpen(false);
        setName("");
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault();

        const data = await mutate({name},

           {

              onSuccess: (Id) => {
                  toast.success("workspace created successfully.");
                  console.log(Id);
                  router.push(`/workspace/${Id}`);
                  handleClose();
              },

              onError: () => {},

              onSettled: () => {}

           }
        )
    }

    return (
        <Dialog open={open} onOpenChange={handleClose}>

            <DialogContent>
                <DialogHeader>

                    <DialogTitle>
                        Add a workspace
                    </DialogTitle>

                </DialogHeader>

                <form className={"space-y-4"} onSubmit={handleSubmit}>

                    <Input value={name} onChange={(e) => setName(e.target.value)} disabled={false} required={true} autoFocus={true} minLength={3} placeholder={"My workspace"} />

                    <div className={"flex justify-end"}>

                        <Button disabled={false}>
                            Create
                        </Button>

                    </div>

                </form>
            </DialogContent>

        </Dialog>
    )
}