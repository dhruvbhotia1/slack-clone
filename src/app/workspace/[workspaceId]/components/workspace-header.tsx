import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import {Button, buttonVariants} from "@/components/ui/button";
import {Doc} from "../../../../../convex/_generated/dataModel";
import {ChevronDown, ListFilter, SquarePen} from "lucide-react";
import {Hint} from "@/components/hint"
import {PreferencesModal} from "@/app/workspace/[workspaceId]/components/preferences-modal";
import {useState} from "react";
import {InviteModal} from "@/app/workspace/[workspaceId]/components/invite-modal";
import {cn} from "@/lib/utils";

interface Props {

    workspace: Doc<"workspaces">;
    isAdmin: boolean;
}

export const WorkspaceHeader = ({workspace, isAdmin}: Props) => {

    const [preferencesOpen, setPreferencesOpen] = useState<boolean>(false);
    const [inviteOpen, setInviteOpen] = useState<boolean>(false);







    return (
        <>
            <PreferencesModal open={preferencesOpen} setOpen={setPreferencesOpen} initialValues={workspace.name}/>

            <InviteModal open={inviteOpen} setOpen={setInviteOpen} name={workspace.name} joinCode={workspace.joinCode}/>

            <div className={"flex items-center justify-between px-4 h-12.25 gap-0.5"}>

                <DropdownMenu>
                    <DropdownMenuTrigger className={cn(buttonVariants({variant: "transparent", size: "sm"}), "font-semibold text-lg w-auto p-1.5 overflow-hidden")}>


                        <span className={"truncate"}>{workspace?.name}</span>

                        <ChevronDown className={"size-4 ml-1 shrink-0"}/>

                    </DropdownMenuTrigger>

                    <DropdownMenuContent side={"bottom"} align={"start"} className={"w-64"}>

                        <DropdownMenuItem className={"cursor-pointer capitalize"}>

                            <div className={"size-9 relative overflow-hidden bg-[#616061] text-white font-semibold text-xl rounded-md flex items-center justify-center mr-2"}>

                                {workspace.name.charAt(0).toUpperCase()}

                            </div>

                            <div className={"flex flex-col items-start"}>

                                <p className={"font-bold"}>{workspace.name}</p>
                                <p className={"text-xs text-muted-foreground"}>Active workspace</p>

                            </div>

                        </DropdownMenuItem>

                        {
                            isAdmin && (
                                <>
                                    <DropdownMenuSeparator />

                                    <DropdownMenuItem className={"cursor-pointer py-2"} onClick={() => setInviteOpen(true)}>

                                        Invite people to {workspace.name}

                                    </DropdownMenuItem>

                                    <DropdownMenuSeparator />

                                    <DropdownMenuItem className={"cursor-pointer py-2"} onClick={() => setPreferencesOpen(true)}>

                                        Preferences

                                    </DropdownMenuItem>
                                </>
                            )
                        }

                    </DropdownMenuContent>

                </DropdownMenu>

                <div className={"flex items-center gap-0.5"}>

                    <Hint label={"Filter conversations"} side={"bottom"}>

                        <div className={cn(buttonVariants({variant: "transparent", size: "iconSm"}), "cursor-pointer")}>

                            <ListFilter size={4}/>

                        </div>

                    </Hint>


                    <Hint label={"New message"} side={'bottom'}>


                        <div className={cn(buttonVariants({variant: "transparent", size: "iconSm"}), "cursor-pointer")}>

                            <SquarePen size={4}/>

                        </div>

                    </Hint>

                </div>

            </div>
        </>
    )
}