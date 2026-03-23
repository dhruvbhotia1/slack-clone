'use client';

import React from 'react';
import {Toolbar} from "@/app/workspace/[workspaceId]/toolbar";
import {Sidebar} from "./sidebar";

interface Props {

    children: React.ReactNode;
}

export default function Layout({children} : Props) {

    return (

        <div className={"h-full bg-red-500"}>

            <Toolbar/>

            <div className={"h-[calc(100vh-40px)]"}>

                <Sidebar/>

                {children}

            </div>

        </div>

    )
}
