import {Id} from "../../../../convex/_generated/dataModel";
import {Button} from "@/components/ui/button";
import {cva, type VariantProps} from "class-variance-authority";
import {cn} from "@/lib/utils";
import Link from "next/link";
import {useWorkspaceId} from "@/hooks/use-workspace-id";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";

interface Props {

    id: Id<"members">;
    label?: string;
    image?: string;
    variant?: VariantProps<typeof userItemVariants>["variant"];
}

const userItemVariants = cva(
    "flex  items-center gap-1.5 justify-center font-normal h-7 px-4 text-sm overflow-hidden",
    {
        variants: {
            variant: {

                default: "text-[#fcfcfc] hover:bg-[#fcfcfc]/20",
                active: "text-[#481349] bg-white/90 hover:bg-white/90",

            }
        }
    }
)

export const UserButton = ({id, label = "Member", image, variant}: Props) => {

    const workspaceId = useWorkspaceId();

    const avatarFallback = label.charAt(0).toUpperCase();



    return (

        <div className={cn(userItemVariants({variant: variant}), "flex justify-start gap-y-2 rounded-md")}>

            <Link href={`/workspace/${workspaceId}/member/${id}`} className={"flex gap-x-2 items-center justify-center"}>

                <Avatar className={"size-5 rounded-md mr-1"}>

                    <AvatarImage className={"rounded-md"} src={image}/>

                    <AvatarFallback className={"rounded-md bg-sky-700 text-white font-semibold"}>
                        {avatarFallback}
                    </AvatarFallback>


                </Avatar>

                <span className={"text-sm truncate"}>{label}</span>


            </Link>

        </div>
    )

}