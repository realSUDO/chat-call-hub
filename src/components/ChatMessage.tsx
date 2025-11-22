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
  const isLoading = message.content === "...";

  return (
    <div
      className={cn(
        "flex gap-4 px-6 py-8 message-hover animate-fade-in",
        isUser ? "bg-background justify-end" : "bg-card/50 justify-start"
      )}
    >
      {!isUser && (
        <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/20">
          <Bot className="h-5 w-5 text-white" />
        </div>
      )}
      
      <div className={cn("flex-1 space-y-3 min-w-0 max-w-3xl", isUser && "flex flex-col items-end")}>
        <p className="text-sm font-semibold text-foreground">
          {isUser ? "You" : "LaWEase"}
        </p>
        <div className={cn(
          "text-[15px] text-foreground/90 leading-relaxed whitespace-pre-wrap break-words",
          isUser && "text-right"
        )}>
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
              <span className="text-sm text-muted-foreground">Thinking...</span>
            </div>
          ) : (
            message.content
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>

      {isUser && (
        <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 bg-gradient-to-br from-secondary to-secondary/80 shadow-lg shadow-secondary/20">
          <User className="h-5 w-5 text-white" />
        </div>
      )}
    </div>
  );
};
