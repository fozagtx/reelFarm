"use client";

import { useState } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { Button } from "@/components/ui/button";
import {
  MessageSquare,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import ConversationPromptInput from "@/components/primitives/chatbot";
import { cn } from "@/lib/utils";

interface ChatbotSidebarProps {
  children: React.ReactNode;
}

export default function ChatbotSidebar({ children }: ChatbotSidebarProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="relative h-screen w-full">
      {!isSidebarOpen && (
        <Button
          onClick={() => setIsSidebarOpen(true)}
          className="fixed bottom-6 right-6 z-20 h-14 w-14 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg hover:shadow-xl transition-all hover:scale-110"
          size="icon"
        >
          <Sparkles className="h-6 w-6" />
        </Button>
      )}

      {isSidebarOpen && (
        <div className="fixed inset-0 z-30">
          <PanelGroup direction="horizontal" className="h-full">
            <Panel defaultSize={70} minSize={30}>
              <div className="relative h-full">{children}</div>
            </Panel>

            <PanelResizeHandle className="w-1 bg-gradient-to-b from-purple-500/20 via-pink-500/20 to-purple-500/20 hover:bg-gradient-to-b hover:from-purple-500 hover:via-pink-500 hover:to-purple-500 transition-colors" />

            <Panel
              defaultSize={30}
              minSize={20}
              maxSize={50}
              collapsible={true}
              onCollapse={() => setIsCollapsed(true)}
              onExpand={() => setIsCollapsed(false)}
            >
              <div className="relative h-full bg-gradient-to-br from-gray-50 to-gray-100 border-l border-gray-200">
                {/* Header */}
                <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-3 flex items-center justify-between shadow-md">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    <h3 className="font-semibold text-sm">
                      ICP & Offer Generator
                    </h3>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-white hover:bg-white/20"
                      onClick={() => setIsSidebarOpen(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Chatbot Content */}
                <div className="h-full pt-14">
                  {isCollapsed ? (
                    <div className="flex h-full items-center justify-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsCollapsed(false)}
                      >
                        <ChevronLeft className="h-6 w-6" />
                      </Button>
                    </div>
                  ) : (
                    <div className="h-full">
                      <ConversationPromptInput />
                    </div>
                  )}
                </div>

                {/* Info Banner */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-purple-100 to-pink-100 border-t border-purple-200 px-4 py-2">
                  <p className="text-xs text-purple-800">
                    💡 <strong>Tip:</strong> Describe your product to generate
                    ICPs and unique offers
                  </p>
                </div>
              </div>
            </Panel>
          </PanelGroup>
        </div>
      )}

      {!isSidebarOpen && <div className="h-full">{children}</div>}
    </div>
  );
}
