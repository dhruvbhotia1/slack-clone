import {Id} from "../../../../convex/_generated/dataModel";
import {LucideIcon} from "lucide-react";
import {IconType} from "react-icons";
import { buttonVariants} from "@/components/ui/button";
import Link from "next/link"
import {useWorkspaceId} from "@/hooks/use-workspace-id";
import {cn} from "@/lib/utils";
import {cva, type VariantProps} from "class-variance-authority";

const sidebarItemVariants = cva(
    "flex  items-center gap-1.5 justify-center font-normal h-7 px-[18px] text-sm overflow-hidden",
    {
        variants: {
            variant: {

                default: "text-[#fcfcfc] hover:bg-[#fcfcfc]/20",
                active: "text-[#481349] bg-white/90 hover:bg-white/90",

            }
        }
    }
)

interface Props {

    label: string;
    id: string//change to channel
    icon: LucideIcon | IconType;
    variant: VariantProps<typeof sidebarItemVariants>["variant"];



}


export const SidebarItem = ({label, id, icon: Icon, variant,}: Props) => {

    const workspaceId = useWorkspaceId();

    return (
        <div className={cn(sidebarItemVariants({variant: variant}), "flex justify-start gap-y-2 rounded-md")}>
            <Link href={`/workspaces/${workspaceId}/channel/${id}`} className={"flex gap-x-2 items-center justify-center"}>

                <Icon className={'size-4'}/>

                <span className={"text-sm"}>{label}</span>

            </Link>
        </div>
    )

}