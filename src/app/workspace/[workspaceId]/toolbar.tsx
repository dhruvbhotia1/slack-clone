import {Button} from "@/components/ui/button";
import {Info, SearchIcon} from "lucide-react";
import {useWorkspaceId} from "@/hooks/use-workspace-id";
import {useGetWorkspace} from "@/features/workspaces/api/use-get-workspace";



export const Toolbar = () => {


    const workspaceId = useWorkspaceId();

    const {data} = useGetWorkspace({id: workspaceId});





    return (
        <nav className={"bg-[#481349] flex items-center justify-between h-10 p-1.5"}>

            <div className={"flex-1"}/>

            <div className={"min-w-70 max-w-160.5 grow-2 shrink"}>

                <Button className={"bg-accent/25 hover:bg-accent/25 w-full justify-start h-8 px-2 cursor-pointer"}>

                    <SearchIcon size={4} className={"text-white mr-2"}/>
                    <span className={"text-white text-xs font-semibold"}>Search {data?.name}</span>

                </Button>

            </div>

            <div className={"ml-suto flex-1 flex items-center justify-end"}>

                <Button variant={"transparent"}>
                    <Info size={5} className={"text-white"}/>
                </Button>


            </div>





        </nav>
    )
}