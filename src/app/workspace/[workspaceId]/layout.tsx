'use client';

import React from 'react';
import {Toolbar} from "@/app/workspace/[workspaceId]/toolbar";
import {Sidebar} from "./sidebar";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"
import {WorkspaceSidebar} from "@/app/workspace/[workspaceId]/workspace-sidebar";

interface Props {

    children: React.ReactNode;
}

export default function Layout({children} : Props) {

    return (

        <div className={"h-full"}>

            <Toolbar/>

            <div className={"flex h-[calc(100vh-40px)]"}>

                <Sidebar/>

                <ResizablePanelGroup orientation={'horizontal'}>

                    <ResizablePanel defaultSize={300} minSize={110} className={'bg-[#5e2c5f]'}>

                        <WorkspaceSidebar/>

                    </ResizablePanel>

                    <ResizableHandle withHandle/>

                    <ResizablePanel minSize={300}>
                        {children}
                    </ResizablePanel>

                </ResizablePanelGroup>



            </div>

        </div>

    )
}
