"use client";

import React from "react";
import { Toolbar } from "@/app/workspace/[workspaceId]/components/toolbar";
import { Sidebar } from "./components/sidebar";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { WorkspaceSidebar } from "@/app/workspace/[workspaceId]/components/workspace-sidebar";
import { usePanel } from "@/hooks/use-panel";
import { Loader } from "lucide-react";
import { Thread } from "@/features/messages/components/thread";
import { Id } from "../../../../convex/_generated/dataModel";

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Props) {
  const { parentMessageId, onClose } = usePanel();

  const showPanel = !!parentMessageId;

  return (
    <div className={"h-full"}>
      <Toolbar />

      <div className={"flex h-[calc(100vh-40px)]"}>
        <Sidebar />

        <ResizablePanelGroup orientation={"horizontal"}>
          <ResizablePanel
            defaultSize={300}
            minSize={110}
            className={"bg-[#5e2c5f]"}
          >
            <WorkspaceSidebar />
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel minSize={300}>{children}</ResizablePanel>
          {showPanel && (
            <>
              <ResizableHandle withHandle />
              <ResizablePanel minSize={20} defaultSize={29}>
                {parentMessageId ? (
                  <Thread
                    messageId={parentMessageId as Id<"messages">}
                    onClose={onClose}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Loader className="size-5 animate-spin text-muted-foreground" />
                  </div>
                )}
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
