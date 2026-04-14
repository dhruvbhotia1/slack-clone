import { GetMessagesReturnType } from "@/features/messages/api/use-get-messages";
import { format, isToday, isYesterday } from "date-fns";

interface Props {
  memberName?: string;
  memberImage?: string;
  channelName?: string;
  channelCreationTime?: number;
  variant?: "channel" | "thread" | "conversation";
  data: GetMessagesReturnType;
  loadMore: () => void;
  isLoadingMore: boolean;
  canLoadMore: boolean;
}

const formatDateLabel = (dateStamp: number) => {
  const date = new Date(dateStamp);

  if (isToday(date)) {
    return "Today";
  }

  if (isYesterday(date)) {
    return "Yesterday";
  }

  return format(date, "EEEE, MMMM d");
};

export const MessageList = ({
  memberName,
  memberImage,
  channelName,
  channelCreationTime,
  variant,
  data,
  loadMore,
  isLoadingMore,
  canLoadMore,
}: Props) => {
  const groupedMessages = data?.reduce(
    (groups, message) => {
      const date = new Date(message._creationTime);
      const dateKey = format(date, "yyyy-MM-dd");

      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }

      groups[dateKey].unshift(message);

      return groups;
    },
    {} as Record<string, typeof data>,
  );

  return (
    <div className="flex-1 flex flex-col-reverse pb-4 overflow-y-auto messages-scrollbar">
      {Object.entries(groupedMessages || {}).map(([dateKey, messages]) => (
        <div key={dateKey}>
          <div className="text-center my-2 relative">
            <hr className="absolute top-1/2 left-0 right-0 border-t border-gray-300 " />

            <span className="relative inline-block bg-white px-4 py-1 rounded-full text-sm border border-gray-300 shadow-sm">
              {formatDateLabel(messages[0]._creationTime)}
            </span>
          </div>

          {messages.map((message, index) => {
            return (
              <div key={message._id}>
                <div>{JSON.stringify(message)}</div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};
