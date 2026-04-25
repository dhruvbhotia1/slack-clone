import dynamic from "next/dynamic";
import { Id, Doc } from "../../convex/_generated/dataModel";
import { format, isToday, isYesterday } from "date-fns";
import { Hint } from "./hint";
import { Button } from "./ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Thumbnail } from "./thumbnail";
import { Toolbar } from "./toolbar";
import { useUpdateMessage } from "@/features/messages/api/use-update-message";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useRemoveMessage } from "@/features/messages/api/use-remove-message";
import { useConfirm } from "@/hooks/use-confirm";
import { useToggleReaction } from "@/features/reactions/api/use-toggle-reaction";
import { Reactions } from "./reactions";
import { usePanel } from "@/hooks/use-panel";
import { ThreadBar } from "./thread-bar";

const formatFullTime = (date: Date) => {
  return `${isToday(date) ? "Today" : isYesterday(date) ? "Yesterday" : format(date, "MMM d, yyyy")} at ${format(date, "hh:mm")}`;
};

const Renderer = dynamic(() => import("@/components/renderer"), { ssr: false });

const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

interface Props {
  id: Id<"messages">;
  memberId: Id<"members">;
  authorImage?: string;
  authorName?: string;
  isAuthor: boolean;
  reactions: Array<
    Omit<Doc<"reactions">, "memberId"> & {
      count: number;
      memberIds: Id<"members">[];
    }
  >;
  body: Doc<"messages">["body"];
  image: string | null | undefined;
  createdAt: Doc<"messages">["_creationTime"];
  updatedAt: Doc<"messages">["updatedAt"];
  isEditing: boolean;
  isCompact?: boolean;
  setEditingId: (id: Id<"messages">) => void;
  hideThreadButton?: boolean;
  threadCount?: number;
  threadImage?: string;
  threadName?: string;
  threadTimestamp?: number;
}

export const Message = ({
  id,
  memberId,
  authorImage,
  authorName = "Member",
  isAuthor,
  reactions,
  body,
  image,
  createdAt,
  updatedAt,
  isEditing,
  isCompact,
  setEditingId,
  hideThreadButton,
  threadCount,
  threadImage,
  threadName,
  threadTimestamp,
}: Props) => {
  const { parentMessageId, onOpenMessage, onClose, onOpenProfile } = usePanel();

  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure ?",
    "Doing this will remove the message permanently.",
  );
  const { mutate: updateMessage, isPending: isUpdatingMessage } =
    useUpdateMessage();

  const { mutate: removeMessage, isPending: isRemovingMessage } =
    useRemoveMessage();

  const { mutate: toggleReaction, isPending: isTogglingReaction } =
    useToggleReaction();

  const isPending = isUpdatingMessage || isTogglingReaction;

  const handleReaction = (reaction: string) => {
    toggleReaction(
      { messageId: id, value: reaction },
      {
        onSuccess: () => {
          // toast.success("Reaction added");
        },
        onError: () => {
          // toast.error("Failed to add your reaction, please try again.");
        },
      },
    );
  };

  const handleRemove = async () => {
    const ok = await confirm();

    if (!ok) {
      return;
    }

    removeMessage(
      { id },
      {
        onSuccess: () => {
          toast.success("Message removed");

          // TODO: close thread if exists
          if (parentMessageId === id) {
            onClose();
          }
        },

        onError: () => {
          toast.error("Failed to remove message");
        },
      },
    );
  };

  const handleUpdate = ({ body }: { body: string }) => {
    updateMessage(
      { id, body },
      {
        onSuccess: () => {
          toast.success("Message updated");
          setEditingId(null);
        },
        onError: () => {
          toast.error("Failed to update message");
        },
      },
    );
  };

  const avatarFallback = authorName.charAt(0).toUpperCase();

  if (isCompact) {
    return (
      <>
        <ConfirmDialog />
        <div
          className={cn(
            "flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative",
            isEditing && "bg-[#f2c74433] hover:bg-[#f2c74433]",
            isRemovingMessage &&
              "bg-rose-500/50 transform transition-all scale-y-0 origin-bottom duration-400",
          )}
        >
          <div className="flex items-start gap-2">
            {isEditing ? (
              <div className="w-full h-full">
                <Editor
                  onSubmit={handleUpdate}
                  disabled={isPending}
                  defaultValue={JSON.parse(body)}
                  onCancel={() => setEditingId(null)}
                  variant={"update"}
                />
              </div>
            ) : (
              <div className="flex flex-col w-full translate-x-10 overflow-x-auto">
                <Renderer value={body} />
                <Thumbnail url={image} />

                {updatedAt ? (
                  <span className="text-xs text-muted-foreground">
                    (edited)
                  </span>
                ) : null}
                <Reactions data={reactions} onChange={handleReaction} />
                <ThreadBar
                  count={threadCount}
                  image={threadImage}
                  timestamp={threadTimestamp}
                  onClick={() => onOpenMessage(id)}
                  name={threadName}
                />
              </div>
            )}

            <Hint label={formatFullTime(new Date(createdAt))}>
              <button className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 w-10 leading-5.5 text-center hover:underline ">
                {format(new Date(createdAt), "hh:mm")}
              </button>
            </Hint>
          </div>
          {!isEditing && (
            <Toolbar
              isAuthor={isAuthor}
              isPending={false}
              handleEdit={() => setEditingId(id)}
              handleThread={() => onOpenMessage(id)}
              handleDelete={handleRemove}
              handleReaction={handleReaction}
              hideThreadButton={hideThreadButton}
            />
          )}
        </div>
      </>
    );
  }

  return (
    <>
      <ConfirmDialog />
      <div
        className={cn(
          "flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative",
          isEditing && "bg-[#f2c74433] hover:bg-[#f2c74433]",
          isRemovingMessage &&
            "bg-rose-500/50 transform transition-all scale-y-0 origin-bottom duration-400",
        )}
      >
        <div className="flex items-start gap-2">
          <button onClick={() => onOpenProfile(memberId)}>
            <Avatar className={"rounded-md"}>
              <AvatarImage className={"rounded-md"} src={authorImage} />

              <AvatarFallback
                className={"rounded-md bg-sky-700 text-white font-semibold"}
              >
                {avatarFallback}
              </AvatarFallback>
            </Avatar>
          </button>
          {isEditing ? (
            <div className="w-full h-full">
              <Editor
                onSubmit={handleUpdate}
                disabled={isPending}
                defaultValue={JSON.parse(body)}
                onCancel={() => setEditingId(null)}
                variant={"update"}
              />
            </div>
          ) : (
            <div className="flex flex-col w-full overflow-hidden">
              <div className="text-sm">
                <button
                  className="font-bold text-primary hover:underline"
                  onClick={() => onOpenProfile(memberId)}
                >
                  {authorName}
                </button>
                <span>&nbsp;&nbsp;</span>
                <Hint label={formatFullTime(new Date(createdAt))}>
                  <button className="text-xs text-muted-foreground hover:underline">
                    {format(new Date(createdAt), "hh:mm")}
                  </button>
                </Hint>
              </div>
              <Renderer value={body} />

              <Thumbnail url={image} />

              {updatedAt ? (
                <span className="text-xs text-muted-foreground">(edited)</span>
              ) : null}
              <Reactions data={reactions} onChange={handleReaction} />
              <ThreadBar
                count={threadCount}
                image={threadImage}
                timestamp={threadTimestamp}
                onClick={() => onOpenMessage(id)}
                name={threadName}
              />
            </div>
          )}
        </div>
        {!isEditing && (
          <Toolbar
            isAuthor={isAuthor}
            isPending={isPending}
            handleEdit={() => setEditingId(id)}
            handleThread={() => onOpenMessage(id)}
            handleDelete={handleRemove}
            handleReaction={handleReaction}
            hideThreadButton={hideThreadButton}
          />
        )}
      </div>
    </>
  );
};
