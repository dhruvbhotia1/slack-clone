'use client';

import {useState} from "react";
import {SignInFlow} from "@/features/auth/types";
import {SignInCard} from "@/features/auth/components/sign-in-card";
import {SignUpCard} from "@/features/auth/components/sign-up-card";

export const AuthScreen = () => {

    const [state, setState] = useState<SignInFlow>("signIn");



    return (
        <div className={"h-screen flex items-center justify-center bg-[#5c3d58]"}>

            <div className={"md:h-auto md:w-105 flex justify-center items-center"}>

                {state === "signIn" ? (<SignInCard setState={setState}/>) : (<SignUpCard setState={setState}/>)}

            </div>

        </div>
    )
}