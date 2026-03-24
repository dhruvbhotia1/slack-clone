"use client";
import React from 'react';
import {Provider} from "jotai";

interface Props {

    children: React.ReactNode;
}

export const JotaiProvider = ({children}: Props) => {

    return (

        <Provider>
            {children}
        </Provider>
    )

}