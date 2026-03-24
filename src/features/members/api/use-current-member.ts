import {useQuery} from "convex/react";
import {api} from "../../../../convex/_generated/api";
import {useWorkspaceId} from "@/hooks/use-workspace-id";
import {Id} from "../../../../convex/_generated/dataModel";

interface Props {
    workspaceId: Id<"workspaces">
}

export const useCurrentMember = ({workspaceId}: Props) => {

    const data = useQuery(api.members.current, {workspaceId: workspaceId});
    const isLoading = data === undefined;

    return {data, isLoading};

}