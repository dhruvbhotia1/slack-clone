import { Button } from "@/components/ui/button";
import { Info, SearchIcon } from "lucide-react";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { useState } from "react";
import { useGetChannels } from "@/features/channels/api/use-get-channels";
import { useGetMembers } from "@/features/members/api/use-get-members";
import Link from "next/link";
import { useRouter } from "next/navigation";

export const Toolbar = () => {
  const workspaceId = useWorkspaceId();

  const { data } = useGetWorkspace({ id: workspaceId });

  const { data: channels } = useGetChannels({ workspaceId });

  const { data: members } = useGetMembers({ workspaceId });

  const [open, setOpen] = useState(false);

  const router = useRouter();

  const onChannelClick = (channelId: string) => {
    setOpen(false);
    router.push(`/workspace/${workspaceId}/channel/${channelId}`);
  };

  const onMemberClick = (memberId: string) => {
    setOpen(false);
    router.push(`/workspace/${workspaceId}/member/${memberId}`);
  };

  return (
    <nav
      className={"bg-[#481349] flex items-center justify-between h-10 p-1.5"}
    >
      <div className={"flex-1"} />

      <div className={"min-w-70 max-w-160.5 grow-2 shrink"}>
        <Button
          onClick={() => setOpen(true)}
          className={
            "bg-accent/25 hover:bg-accent/25 w-full justify-start h-8 px-2 cursor-pointer"
          }
        >
          <SearchIcon size={4} className={"text-white mr-2"} />
          <span className={"text-white text-xs font-semibold"}>
            Search {data?.name}
          </span>
        </Button>

        <Command className="bg-[#481349]">
          <CommandDialog open={open} onOpenChange={setOpen}>
            <CommandInput placeholder="Type a command or search..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="Channels">
                {channels?.map((channel) => (
                  <CommandItem
                    key={channel._id}
                    onSelect={() => onChannelClick(channel._id)}
                  >
                    {channel.name}
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup heading="Members">
                {members?.map((member) => (
                  <CommandItem
                    key={member._id}
                    onSelect={() => onMemberClick(member._id)}
                  >
                    {member.user.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </CommandDialog>
        </Command>
      </div>

      <div className={"ml-suto flex-1 flex items-center justify-end"}>
        <Button variant={"transparent"}>
          <Info size={5} className={"text-white"} />
        </Button>
      </div>
    </nav>
  );
};
