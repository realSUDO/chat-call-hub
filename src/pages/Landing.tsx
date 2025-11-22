import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MessageSquarePlus, Newspaper, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import CallScreen from "@/components/CallScreen";
import { useToast } from "@/hooks/use-toast";
import { joinVoiceChannel, leaveVoiceChannel } from "@/services/agoraVoice";

const Landing = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isCallActive, setIsCallActive] = useState(false);

  const handleStartChat = () => {
    navigate("/chat");
  };

  const handleCallClick = async () => {
    try {
      await joinVoiceChannel();
      setIsCallActive(true);
      toast({
        title: "Voice call started",
        description: "Connected to voice channel",
      });
    } catch (error) {
      toast({
        title: "Call failed",
        description: "Couldn't connect to voice service",
        variant: "destructive"
      });
    }
  };

  const handleEndCall = async () => {
    await leaveVoiceChannel();
    setIsCallActive(false);
    toast({
      title: "Call ended",
      description: "Voice call has been disconnected",
    });
  };

  const handleFeedClick = () => {
    navigate("/feed");
  };

  const handleComingSoon = (feature: string) => {
    toast({
      title: "Coming Soon",
      description: `${feature} feature will be available soon!`,
    });
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background animate-fade-in">
      {isCallActive && <CallScreen onEndCall={handleEndCall} />}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-12 p-8">
        <div className="text-center space-y-4 animate-fade-in">
          <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-foreground via-secondary to-foreground bg-clip-text text-transparent">
            Welcome to LaWEase
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl">
            Your intelligent legal assistant
          </p>
        </div>

        <div className="flex items-center gap-6 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <Button
            size="icon"
            variant="outline"
            className="h-16 w-16 rounded-full border-2 border-secondary/50 hover:border-secondary hover:bg-secondary/10 transition-all duration-300 hover:scale-110 glow-effect"
            onClick={handleFeedClick}
          >
            <Newspaper className="h-6 w-6 text-secondary" />
          </Button>

          <Button
            size="lg"
            className="h-16 px-12 text-lg rounded-2xl bg-gradient-to-r from-secondary to-primary hover:from-primary hover:to-secondary transition-all duration-500 shadow-lg hover:shadow-xl hover:scale-105 glow-effect"
            onClick={handleStartChat}
          >
            <MessageSquarePlus className="mr-2 h-6 w-6" />
            Start a New Chat
          </Button>

          <Button
            size="icon"
            variant="outline"
            className="h-16 w-16 rounded-full border-2 border-secondary/50 hover:border-secondary hover:bg-secondary/10 transition-all duration-300 hover:scale-110 glow-effect"
            onClick={handleCallClick}
          >
            <Phone className="h-6 w-6 text-secondary" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Landing;
