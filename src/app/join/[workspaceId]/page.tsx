'use client';

import Image from "next/image";

import VerificationInput from "react-verification-input";
import Link from "next/link";
import {cn} from "@/lib/utils";
import {buttonVariants} from "@/components/ui/button";
import {useJoin} from "@/features/workspaces/api/use-join";
import {useWorkspaceId} from "@/hooks/use-workspace-id";
import {useGetWorkspaceInfo} from "@/features/workspaces/api/use-get-workspace-info";
import {Loader} from "lucide-react"
import {toast} from "sonner";
import {useRouter} from "next/navigation";
import {useEffect, useMemo} from "react";

const Page = () => {


    const workspaceId = useWorkspaceId();

    const {data, isLoading} = useGetWorkspaceInfo({id: workspaceId});

    const router = useRouter();

    const {mutate, isPending} = useJoin();

    const handleJoin = (value: string) => {

        mutate({

            workspaceId, joinCode: value
        }, {

            onSuccess: (id) => {

                router.replace(`/workspace/${id}`);

                toast.success("Joined successfully.")


            },
            onError: () => {
                toast.error("Error while joining the workspace");
            }
        })


    }

    const isMember = useMemo(() => data?.isMember, [data?.isMember]);

    useEffect(() => {
        if(isMember) {
            router.push(`/workspace/${workspaceId}`);
        }
    }, [isMember, router, workspaceId]);


    if(isLoading) {

        return (
            <div className={"h-full flex items-center justify-center"}>

                <Loader className={"size-6 animate-spin text-muted-foreground"}/>

            </div>
        )
    }


    return (
        <div className={"h-full flex flex-col gap-y-8 items-center justify-center bg-white p-8 rounded-lg shadow-md"}>

            <Image src={"/logo.svg"} alt={"logo"} width={70} height={70}/>

            <div className={"flex flex-col gap-y-4 items-center justify-center max-w-md"}>

                <div className={"flex flex-col gap-y-2 items-center justify-center"}>

                    <h1 className={"text-2xl font-bold"}>
                        Join {data?.name}
                    </h1>

                    <p className={"text-md text-muted-foreground"}>
                        Enter the workspace code to join.
                    </p>


                </div>


                <VerificationInput classNames={{
                    container: cn("flex gap-x-2", isPending && "opacity-50 cursor-not-allowed"),
                    character: "uppercase h-auto rounded-md border border-gray-300 flex items-center justify-center text-lg font-medium text-gray-500",
                    characterInactive: "bg-muted",
                    characterSelected: "bg-white text-black",
                    characterFilled: "bg-white text-black"
                }} autoFocus={true} onComplete={handleJoin}/>

            </div>

            <div className={"flex gap-x-4"}>

                <Link className={cn(buttonVariants({variant: "outline", size: "lg"}), "flex gap-x-4 items-center justify-center")} href={"/"}>

                    Back to home

                </Link>

            </div>
        </div>
    )

}

export default Page;