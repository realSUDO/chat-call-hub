import { useState } from "react";
import { ChatSidebar } from "@/components/ChatSidebar";
import { ChatHeader } from "@/components/ChatHeader";
import { ChatInterface } from "@/components/ChatInterface";
import { ChatInput } from "@/components/ChatInput";
import CallScreen from "@/components/CallScreen";
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
  const [isCallActive, setIsCallActive] = useState(false);
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

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    // Add loading message
    const loadingId = (Date.now() + 1).toString();
    const loadingMessage: Message = {
      id: loadingId,
      role: "assistant",
      content: "...",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, loadingMessage]);

    try {
      const response = await fetch('http://localhost:3001/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: content, lawyerMode: true })
      });

      if (!response.ok) throw new Error('Server error');

      const data = await response.json();
      
      // Replace loading message with actual response
      setMessages((prev) => 
        prev.map(msg => 
          msg.id === loadingId 
            ? { ...msg, content: data.reply }
            : msg
        )
      );
    } catch (error) {
      // Replace loading message with error
      setMessages((prev) => 
        prev.map(msg => 
          msg.id === loadingId 
            ? { ...msg, content: "Couldn't connect to the server. Try again later" }
            : msg
        )
      );
    }
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

  const handleCallClick = async () => {
    try {
      const response = await fetch('http://localhost:3001/voice/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      
      // Use Web Speech API
      const utterance = new SpeechSynthesisUtterance(data.message);
      const voices = speechSynthesis.getVoices();
      utterance.voice = voices.find(voice => voice.lang === 'en-US') || voices[0];
      utterance.rate = 0.9;
      utterance.pitch = 1.2;
      speechSynthesis.speak(utterance);
      
      setIsCallActive(true);
    } catch (error) {
      toast({
        title: "Call failed",
        description: "Couldn't connect to voice service",
        variant: "destructive"
      });
    }
  };

  const handleEndCall = async () => {
    try {
      await fetch('http://localhost:3001/voice/stop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      speechSynthesis.cancel();
    } catch (error) {
      speechSynthesis.cancel();
    }
    
    setIsCallActive(false);
    toast({
      title: "Call ended",
      description: "Voice call has been disconnected",
    });
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {isCallActive && <CallScreen onEndCall={handleEndCall} />}
      
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
