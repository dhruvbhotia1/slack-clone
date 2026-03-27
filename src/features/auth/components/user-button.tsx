import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Avatar, AvatarImage, AvatarFallback} from "@/components/ui/avatar";
import {useCurrentUser} from "@/features/auth/api/use-current-user";
import {Loader, LogOut} from "lucide-react";
import {useAuthActions} from "@convex-dev/auth/react";
import {useRouter} from "next/navigation";

export const UserButton = () => {

    const {signOut} = useAuthActions()
    const router = useRouter();

    const SignOut = () => {
        signOut();
        router.replace("/auth");
    }

    const {data, isLoading} = useCurrentUser();

    if(isLoading) {

        return <Loader className={"size-4 animate-spine text-muted-foreground"}/>;
    }

    if(!data) {

        return null;
    }


    const {image, name, email} = data;

    const avatarFallback = name!.charAt(0).toUpperCase();





    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger className={"outline-none relative"}>

                <Avatar className={'size-10 hover:opacity-75 transition'}>

                    <AvatarImage alt={name} src={image}/>
                    <AvatarFallback className={"bg-sky-700 text-white font-semibold rounded-md"}>

                        {avatarFallback}

                    </AvatarFallback>
                </Avatar>


            </DropdownMenuTrigger>

            <DropdownMenuContent align={'center'} side={'right'} className={'w-60'}>
                <DropdownMenuItem onClick={() => SignOut()}>

                    <LogOut className={"size-4 nmr-2"}/>
                    Logout

                </DropdownMenuItem>
            </DropdownMenuContent>

        </DropdownMenu>
    )
}