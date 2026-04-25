"use client";

import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useMemberId } from "@/hooks/use-member-id";
import { useCreateOrGetConversation } from "@/features/conversations/api/use-create-or-get-conversation";
import { useEffect } from "react";
import { AlertTriangle, Loader } from "lucide-react";
import { useState } from "react";
import { Id } from "../../../../../../convex/_generated/dataModel";
import { toast } from "sonner";
import { Conversation } from "./conversation";
const Page = () => {
  const workspaceId = useWorkspaceId();
  const memberId = useMemberId();

  const [conversationId, setConversationId] =
    useState<Id<"conversations"> | null>(null);

  const { data, mutate, isPending } = useCreateOrGetConversation();

  useEffect(() => {
    mutate(
      {
        workspaceId,
        memberId,
      },
      {
        onSuccess: (data) => {
          setConversationId(data);
          toast.success("Conversation opened successfully");
        },
        onError: () => {
          toast.error("Failed to create or get conversation");
        },
      },
    );
  }, [memberId, workspaceId, mutate]);

  if (isPending) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!conversationId) {
    return (
      <div className="h-full flex items-center justify-center">
        <AlertTriangle className="size-6 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">
          Conversation not found
        </span>
      </div>
    );
  }

  return <Conversation id={conversationId} />;
};

export default Page;
