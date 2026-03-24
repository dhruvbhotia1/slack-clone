'use client';

import {useWorkspaceId} from "@/hooks/use-workspace-id";
import {useGetWorkspace} from "@/features/workspaces/api/use-get-workspace";

const Page =  () => {

    const workspaceId = useWorkspaceId();

    const {data} = useGetWorkspace({id: workspaceId});




    return (

        <div className={"text-black font-semibold"}>
            ID: { JSON.stringify(data?._id, null, 2) };
        </div>
    )


}

export default Page;