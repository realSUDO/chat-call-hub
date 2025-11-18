import { useState } from "react";
import { ChatSidebar } from "@/components/ChatSidebar";
import { ChatHeader } from "@/components/ChatHeader";
import { ChatInterface } from "@/components/ChatInterface";
import { ChatInput } from "@/components/ChatInput";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatHistory {
  id: string;
  title: string;
  timestamp: Date;
}

const Index = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatHistories, setChatHistories] = useState<ChatHistory[]>([
    {
      id: "1",
      title: "Getting started with AI",
      timestamp: new Date(Date.now() - 86400000),
    },
    {
      id: "2",
      title: "Project planning discussion",
      timestamp: new Date(Date.now() - 172800000),
    },
    {
      id: "3",
      title: "Code review questions",
      timestamp: new Date(Date.now() - 259200000),
    },
  ]);
  const [currentChatId, setCurrentChatId] = useState("current");
  const { toast } = useToast();

  const handleSendMessage = (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "I'm a demo AI assistant. In a real application, I would process your message and provide a helpful response. This interface is designed to look and feel like ChatGPT!",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    }, 1000);
  };

  const handleNewChat = () => {
    setMessages([]);
    setCurrentChatId(Date.now().toString());
    toast({
      title: "New chat started",
      description: "Ready for a fresh conversation!",
    });
  };

  const handleSelectChat = (id: string) => {
    setCurrentChatId(id);
    setMessages([]);
    toast({
      title: "Chat loaded",
      description: "Previous conversation loaded",
    });
  };

  const handleCallClick = () => {
    toast({
      title: "Call feature",
      description: "Voice call feature coming soon!",
    });
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <ChatSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onNewChat={handleNewChat}
        chatHistories={chatHistories}
        currentChatId={currentChatId}
        onSelectChat={handleSelectChat}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <ChatHeader
          onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
          onCallClick={handleCallClick}
        />

        <ChatInterface messages={messages} />

        <ChatInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
};

export default Index;
