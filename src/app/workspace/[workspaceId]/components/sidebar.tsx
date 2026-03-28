import {UserButton} from "@/features/auth/components/user-button";
import {WorkspaceSwitcher} from "@/app/workspace/[workspaceId]/components/workspace-switcher";
import {SidebarButton} from "@/app/workspace/[workspaceId]/components/sidebar-button";
import {BellIcon, Home, MessagesSquareIcon, MoreHorizontalIcon} from "lucide-react";
import {usePathname} from "next/navigation";

export const Sidebar = () => {

    const pathName = usePathname();


    return (
        <aside className={"w-17.5 h-full bg-[#481349] flex flex-col gap-y-4 items-center pt-2.25 pb-1 "}>

            <WorkspaceSwitcher/>

            <SidebarButton icon={Home} label={"Home"} isActive={true} />
            <SidebarButton icon={MessagesSquareIcon} label={"DMs"} isActive={true}/>
            <SidebarButton icon={BellIcon} label={"Activity"} isActive={true}/>
            <SidebarButton icon={MoreHorizontalIcon} label={"More"} isActive={true}/>


            <div className={"flex flex-col items-center justify-center gap-y-1 mt-auto "}>
                <UserButton />
            </div>



        </aside>
    );
};
