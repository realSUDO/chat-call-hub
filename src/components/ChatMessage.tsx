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
        "group flex gap-4 px-6 py-8 message-hover animate-fade-in",
        isUser ? "bg-background" : "bg-card/50"
      )}
    >
      <div
        className={cn(
          "flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110",
          isUser 
            ? "bg-gradient-to-br from-secondary to-secondary/80 shadow-lg shadow-secondary/20" 
            : "bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/20"
        )}
      >
        {isUser ? <User className="h-5 w-5 text-white" /> : <Bot className="h-5 w-5 text-white" />}
      </div>
      
      <div className="flex-1 space-y-3 min-w-0">
        <p className="text-sm font-semibold text-foreground">
          {isUser ? "You" : "AI Assistant"}
        </p>
        <div className="text-[15px] text-foreground/90 leading-relaxed whitespace-pre-wrap break-words">
          {message.content}
        </div>
        <p className="text-xs text-muted-foreground">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
};
