import {JSX, useState} from "react";

import {
    DialogTitle,
    Dialog,
    DialogContent,
    DialogHeader,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";

import {Button, buttonVariants} from "@/components/ui/button"
import {cn} from "@/lib/utils";

export const useConfirm = (title: string, message: string): [() => JSX.Element, () => Promise<unknown>] => {

    const [promise, setPromise] = useState<{resolve: (value: boolean) => void} | null>(null);

    const confirm = () => new Promise((resolve, reject) => {
       setPromise({resolve});
    });

    const handleClose = () => {
        setPromise( null);
    }

    const handleCancel = () => {

        promise?.resolve(false);
        handleClose()
    }

    const handleConfirm = () => {
        promise?.resolve(true);
        handleClose();
    }

    const ConfirmDialog = () => (

        <Dialog open={promise !== null} onOpenChange={handleClose}>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{message}</DialogDescription>
                </DialogHeader>

                <DialogFooter className={"pt-2"}>
                    <div className={cn(buttonVariants({variant: "outline"}))} onClick={handleCancel}>

                        Cancel

                    </div>

                    <div className={cn(buttonVariants({variant: "default"}))} onClick={handleConfirm}>

                        Confirm

                    </div>

                </DialogFooter>

            </DialogContent>

        </Dialog>
    )

    return [ConfirmDialog, confirm];


}