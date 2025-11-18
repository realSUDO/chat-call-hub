import { Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex gap-3 px-4 py-6 animate-in fade-in-50 duration-500",
        isUser ? "bg-background" : "bg-card"
      )}
    >
      <div
        className={cn(
          "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
          isUser ? "bg-chat-user text-white" : "bg-secondary text-white"
        )}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>
      
      <div className="flex-1 space-y-2">
        <p className="text-sm font-medium text-foreground">
          {isUser ? "You" : "AI Assistant"}
        </p>
        <div className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
          {message.content}
        </div>
        <p className="text-xs text-muted-foreground">
          {message.timestamp.toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
};
