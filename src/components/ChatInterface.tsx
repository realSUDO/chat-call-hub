import { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "./ChatMessage";
import { Sparkles } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  messages: Message[];
}

export const ChatInterface = ({ messages }: ChatInterfaceProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <ScrollArea className="flex-1" ref={scrollRef}>
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full text-center px-4">
          <div className="max-w-2xl space-y-6 animate-fade-in">
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-secondary to-primary/50 rounded-full blur-2xl opacity-50 animate-pulse"></div>
                <Sparkles className="h-16 w-16 text-secondary relative z-10" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-foreground bg-gradient-to-r from-secondary via-primary to-secondary bg-clip-text text-transparent">
              Welcome to AI Assistant
            </h2>
            <p className="text-muted-foreground text-lg">
              Start a conversation, ask questions, or upload a PDF to analyze. I'm here to help!
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-4 max-w-xl mx-auto">
              {[
                "Explain a complex topic",
                "Help with code debugging",
                "Analyze a document",
                "Creative brainstorming"
              ].map((suggestion, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl bg-card/50 border border-border/50 hover:border-secondary/50 transition-all duration-200 hover:scale-105 cursor-pointer backdrop-blur-sm"
                >
                  <p className="text-sm text-foreground/80">{suggestion}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div>
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
        </div>
      )}
    </ScrollArea>
  );
};
