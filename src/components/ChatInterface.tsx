import { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "./ChatMessage";


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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <ScrollArea className="flex-1">
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full text-center px-4">
          <div className="max-w-2xl space-y-8 animate-fade-in">
            <div className="space-y-4">
              <h2 className="text-5xl font-bold bg-gradient-to-r from-secondary via-primary to-secondary bg-clip-text text-transparent leading-tight">
                Welcome to LaWEase
              </h2>
              <p className="text-muted-foreground text-xl font-light">
                Your intelligent legal assistant
              </p>
            </div>
            <p className="text-foreground/70 text-base leading-relaxed">
              Ask me about Indian Constitution, legal rights, or any legal matter!
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-4 max-w-xl mx-auto">
              {[
                "What are fundamental rights?",
                "Explain Article 21",
                "Legal remedies available",
                "Constitutional amendments"
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
        <div className="max-w-5xl mx-auto px-4">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      )}
    </ScrollArea>
  );
};
