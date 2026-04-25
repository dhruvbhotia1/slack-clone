import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Id } from "../../../../convex/_generated/dataModel";
import { useGetMember } from "../api/use-get-member";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";
import { Loader } from "lucide-react";
import { AlertTriangle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { MailIcon } from "lucide-react";
import Link from "next/link";
import { useUpdateMember } from "../api/use-update-member";
import { useRemoveMember } from "../api/use-remove-member";
import { useCurrentMember } from "../api/use-current-member";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { FaChevronDown } from "react-icons/fa6";
interface Props {
  memberId: Id<"members">;
  onClose: () => void;
}

export const Profile = ({ memberId, onClose }: Props) => {
  const { data: member, isLoading: isMemberLoading } = useGetMember({
    memberId,
  });
  const workspaceId = useWorkspaceId();
  const { data: currentMember, isLoading: isLoadingCurrentMember } =
    useCurrentMember({
      workspaceId,
    });

  const { mutate: updateMember, isPending: isUpdating } = useUpdateMember();
  const { mutate: removeMember, isPending: isRemoving } = useRemoveMember();

  if (isMemberLoading || isLoadingCurrentMember) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex justify-between items-center px-4 h-12.25 border-b">
          <p className="text-lg font-bold">Profile</p>

          <Button onClick={onClose} size={"iconSm"} variant="ghost">
            <XIcon className="size-5 stroke-[1.5]" />
          </Button>
        </div>
        <div className="flex flex-col gap-y-2 h-full items-center justify-center">
          <Loader className="size-5 text-muted-foreground" />
          <p className="textsm text-muted-foreground">Not Found</p>
        </div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex justify-between items-center px-4 h-12.25 border-b">
          <p className="text-lg font-bold">Profile</p>

          <Button onClick={onClose} size={"iconSm"} variant="ghost">
            <XIcon className="size-5 stroke-[1.5]" />
          </Button>
        </div>
        <div className="flex flex-col gap-y-2 h-full items-center justify-center">
          <AlertTriangle className="size-5 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Profile Not Found</p>
        </div>
      </div>
    );
  }

  const fallback = member.user.name?.[0] ?? "M";

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center px-4 h-12.25 border-b">
        <p className="text-lg font-bold">Profile</p>

        <Button onClick={onClose} size={"iconSm"} variant="ghost">
          <XIcon className="size-5 stroke-[1.5]" />
        </Button>
      </div>
      <div className="flex flex-col items-center justify-center p-4">
        <Avatar className="max-w-64 max-h-64 size-full">
          <AvatarImage src={member.user.image} />
          <AvatarFallback className="aspect-square text-6xl">
            {fallback}
          </AvatarFallback>
        </Avatar>
      </div>
      <div className="flex flex-col p-4">
        <p className="text-xl font-bold">{member.user.name}</p>
        {currentMember?.role === "admin" && currentMember?._id !== memberId ? (
          <div className="flex items-center gap-2 mt-4">
            <Button className="w-1/2 capitalize" variant="outline">
              {member.role} <FaChevronDown className="size-4 ml-2" />
            </Button>

            <Button variant="outline" className="w-1/2 capitalize">
              Remove
            </Button>
          </div>
        ) : currentMember?._id === memberId &&
          currentMember?.role !== "admin" ? (
          <div className="mt-4">
            <Button className="w-full">Leave</Button>
          </div>
        ) : null}
      </div>

      <Separator />
      <div className="flex flex-col p-4">
        <p className="text-sm font-bold mb-4">Contact information</p>
        <div className="flex items-center gap-2">
          <div className="size-9 rounded-md bg-muted flex items-center justify-center">
            <MailIcon className="size-4" />
          </div>
          <div className="flex flex-col">
            <p className="text-[13px] font-semibold text-muted-foreground">
              Email Address
            </p>

            <Link
              href={`mailto: ${member.user.email}`}
              className="text-sm hover:underline text-[#1264a3]"
            >
              {member.user.email}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
