'use client';

import {useWorkspaceId} from "@/hooks/use-workspace-id";
import {useGetWorkspace} from "@/features/workspaces/api/use-get-workspace";
import {useRouter} from "next/navigation";
import {useCreateChannelModal} from "@/features/channels/store/use-create-channel-modal";
import {useGetChannels} from "@/features/channels/api/use-get-channels";
import {useMemo, useEffect} from "react";


const Page =  () => {

    const workspaceId = useWorkspaceId();

    const router = useRouter();

    const [open, setOpen] = useCreateChannelModal();

    const {data: workspace, isLoading: workspaceLoading} = useGetWorkspace({id: workspaceId});

    const {data: channels, isLoading: channelsLoading} = useGetChannels({workspaceId});

    const channelId = useMemo(() => channels?.[0]?._id, [channels])

    useEffect(() => {


        if(workspaceLoading || channelsLoading || !workspace) {

            return;
        }

        if(channelId) {
            router.push(`/workspace/${workspaceId}/channel/${channelId}`);
        }




    }, [channelId, workspaceLoading, channelsLoading, workspace]);









    return (

        <div>
            
        </div>
    )


}

export default Page;