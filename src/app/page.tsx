'use client';

import {useAuthActions} from "@convex-dev/auth/react";
import {UserButton} from "@/features/auth/components/user-button";
import {useGetWorkspaces} from "@/features/workspaces/api/use-get-workspaces";
import {useMemo} from "react";
import {useEffect, useState} from "react";
import {useCreateWorkspaceModal} from "@/features/workspaces/store/use-create-workspace-modal";
import {useRouter} from "next/navigation";

export default function Home() {

    const [open, setOpen] = useCreateWorkspaceModal();

    const {signOut} = useAuthActions();
    const {data, isLoading} = useGetWorkspaces();

    const router = useRouter();

    const workspaceId = useMemo(() => data?.[0]?._id, [data]);

    useEffect(() => {

        if(isLoading) {
            return ;
        }

        if(workspaceId) {
            console.log("redirect to workspace")
            router.replace(`/workspace/${workspaceId}`);
        }else if (!open){
            console.log("open modal")
            setOpen(true);
        }

    }, [workspaceId, isLoading, open, setOpen, router]);



  return (
    <div>
      this is home

        <UserButton/>
    </div>
  );
}
