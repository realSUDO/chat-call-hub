import { MessageSquare, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface ChatHistory {
  id: string;
  title: string;
  timestamp: Date;
}

interface ChatSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onNewChat: () => void;
  chatHistories: ChatHistory[];
  currentChatId: string;
  onSelectChat: (id: string) => void;
}

export const ChatSidebar = ({
  isOpen,
  onClose,
  onNewChat,
  chatHistories,
  currentChatId,
  onSelectChat,
}: ChatSidebarProps) => {
  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-primary/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:relative top-0 left-0 h-screen bg-sidebar text-sidebar-foreground z-50 transition-transform duration-300 ease-in-out flex flex-col",
          isOpen ? "translate-x-0 w-72" : "-translate-x-full lg:translate-x-0 lg:w-0"
        )}
      >
        {isOpen && (
          <>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
              <h2 className="text-lg font-semibold">Chat History</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="lg:hidden text-sidebar-foreground hover:bg-sidebar-accent"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* New Chat Button */}
            <div className="p-4">
              <Button
                onClick={onNewChat}
                className="w-full bg-sidebar-primary hover:bg-sidebar-primary/90 text-sidebar-primary-foreground"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Chat
              </Button>
            </div>

            {/* Chat History List */}
            <ScrollArea className="flex-1 px-2">
              <div className="space-y-1 pb-4">
                {chatHistories.map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => onSelectChat(chat.id)}
                    className={cn(
                      "w-full text-left px-3 py-3 rounded-lg transition-colors group hover:bg-sidebar-accent",
                      currentChatId === chat.id && "bg-sidebar-accent"
                    )}
                  >
                    <div className="flex items-start gap-2">
                      <MessageSquare className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {chat.title}
                        </p>
                        <p className="text-xs text-sidebar-foreground/60 mt-0.5">
                          {chat.timestamp.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </>
        )}
      </aside>
    </>
  );
};
