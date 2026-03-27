import {Card, CardDescription, CardHeader, CardTitle, CardContent} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Separator} from "@/components/ui/separator";
import {FcGoogle} from "react-icons/fc";
import {FaGithub} from "react-icons/fa6";
import {SignInFlow} from "@/features/auth/types";
import {SubmitEventHandler, useState} from "react";
import {useAuthActions} from "@convex-dev/auth/react";
import {TriangleAlert} from "lucide-react";
import React from "react";

interface Props {

    setState: (state: SignInFlow) => void;
}

export const SignUpCard = ({setState} : Props) => {

    const {signIn} = useAuthActions();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [name, setName] = useState("");

    const [pending, setPending] = useState(false);
    const [error, setError] = useState("");

    const handlePasswordSignIn: SubmitEventHandler<HTMLFormElement> = (e) => {

        e.preventDefault();

        if(password !== confirmPassword) {
            setError("Passwords don't match");
            return;
        }
        setPending(true);

        signIn("password", {name, email, password, flow: "signUp"}).catch((error) => {
            setError(error.error.message);
        }).finally(() => setPending(false));

    }


    const handleProviderSignIn = (value: "github" | "google") => {

        setPending(true);

        signIn(value).finally(() => setPending(false));

    }



    return (
        <Card className={"w-full h-full p-8"}>

            <CardHeader className={"px-0 pt-0"}>

                <CardTitle>Sign Up to continue</CardTitle>

                <CardDescription>
                    Use your email or another service to continue

                </CardDescription>

            </CardHeader>

            {
                !!error && (
                    <>
                        <div className={"bg-destructive p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive mb-6"}>
                            <TriangleAlert className={"size-4"}/>
                            <p>{error}</p>
                        </div>
                    </>
                )
            }

            <CardContent className={"space-y-5 px-0 pb-0"}>

                <form onSubmit={handlePasswordSignIn} className={"space-y-2.5"}>

                    <Input disabled={pending} value={name} onChange={(e)=> setName(e.target.value)} placeholder={"Full Name"} required={true}/>
                    <Input disabled={pending} value={email} onChange={(e)=> setEmail(e.target.value)} placeholder={"Email"} type={"email"} required={true}/>
                    <Input disabled={pending} value={password} onChange={(e)=> setPassword(e.target.value)} placeholder={"Password"} type={"password"} required={true}/>
                    <Input disabled={pending} value={confirmPassword} onChange={(e)=> setConfirmPassword(e.target.value)} placeholder={"Confirm Password"} type={"password"} required={true}/>
                    <Button type={'submit'} className={"w-full"} size={"lg"} disabled={pending}>
                        Continue
                    </Button>

                </form>

                <Separator/>
                <div className={"flex flex-col gap-y-2.5"}>

                    <Button disabled={pending} onClick={()=>handleProviderSignIn('google')} variant={"outline"} size={"lg"} className={"w-full relative"}>
                        <FcGoogle size={5} className={"absolute top-2.5 left-2.5"}/>
                        Continue with Google
                    </Button>

                    <Button disabled={pending} onClick={()=>handleProviderSignIn('github')} variant={"outline"} size={"lg"} className={"w-full relative"}>
                        <FaGithub size={5} className={"absolute top-2.5 left-2.5"}/>
                        Continue with Github
                    </Button>
                </div>

                <p className={"text-xs text-muted-foreground"}>Already have an account? <span className={"text-sky-700 hover:underline cursor-pointer"} onClick={() => setState("signIn")}> Sign in here</span></p>

            </CardContent>

        </Card>
    )
}