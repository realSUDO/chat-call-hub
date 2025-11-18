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
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:relative top-0 left-0 h-screen bg-sidebar text-sidebar-foreground z-50 transition-all duration-300 ease-in-out flex flex-col border-r border-sidebar-border shadow-2xl",
          isOpen ? "translate-x-0 w-80" : "-translate-x-full lg:translate-x-0 lg:w-0"
        )}
      >
        {isOpen && (
          <>
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-sidebar-border">
              <h2 className="text-lg font-bold">Conversations</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="lg:hidden text-sidebar-foreground hover:bg-sidebar-accent rounded-xl transition-all duration-200"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* New Chat Button */}
            <div className="p-4">
              <Button
                onClick={onNewChat}
                className="w-full bg-gradient-to-r from-sidebar-primary to-sidebar-primary/80 hover:from-sidebar-primary/90 hover:to-sidebar-primary/70 text-sidebar-primary-foreground rounded-xl shadow-lg shadow-sidebar-primary/20 transition-all duration-200 hover:scale-[1.02] h-12"
              >
                <Plus className="h-5 w-5 mr-2" />
                New Chat
              </Button>
            </div>

            {/* Chat History List */}
            <ScrollArea className="flex-1 px-3">
              <div className="space-y-2 pb-4">
                {chatHistories.map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => onSelectChat(chat.id)}
                    className={cn(
                      "w-full text-left px-4 py-4 rounded-xl transition-all duration-200 group hover:bg-sidebar-accent hover:scale-[1.02]",
                      currentChatId === chat.id && "bg-sidebar-accent shadow-lg"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <MessageSquare className={cn(
                        "h-5 w-5 mt-0.5 flex-shrink-0 transition-colors",
                        currentChatId === chat.id ? "text-sidebar-primary" : "text-sidebar-foreground/60 group-hover:text-sidebar-foreground"
                      )} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {chat.title}
                        </p>
                        <p className="text-xs text-sidebar-foreground/50 mt-1">
                          {chat.timestamp.toLocaleDateString([], { month: 'short', day: 'numeric' })}
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
