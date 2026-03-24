'use client'
import React from 'react';
import {

    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

interface Props {

    label: string;
    children: React.ReactNode;
    side?: "left" | "right" | "bottom" | "top";
    align?: "start" | "center" | "end";
}


export const Hint = ({label, children, side, align}: Props) => {

    return (
        <TooltipProvider delay={50}>
            <Tooltip >

                <TooltipTrigger>
                    {children}
                </TooltipTrigger>

                <TooltipContent side={side} align={align} className={"bg-black text-white border-white/5 "}>

                    <p className={"font-medium text-xs"}>{label}</p>


                </TooltipContent>

            </Tooltip>
        </TooltipProvider>
    )

}