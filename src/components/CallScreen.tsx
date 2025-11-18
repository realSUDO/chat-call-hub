import { Mic, MicOff, PhoneOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface CallScreenProps {
  onEndCall: () => void;
}

const CallScreen = ({ onEndCall }: CallScreenProps) => {
  const [isMuted, setIsMuted] = useState(false);

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center animate-fade-in">
      {/* Animated waves background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="w-64 h-64 rounded-full bg-secondary/20 animate-[ping_3s_ease-in-out_infinite]" />
          <div className="absolute inset-0 w-64 h-64 rounded-full bg-secondary/15 animate-[ping_3s_ease-in-out_infinite_1s]" />
          <div className="absolute inset-0 w-64 h-64 rounded-full bg-secondary/10 animate-[ping_3s_ease-in-out_infinite_2s]" />
        </div>
      </div>

      {/* Center circle with gradient */}
      <div className="relative z-10 flex flex-col items-center gap-8">
        <div className="relative">
          <div className="w-48 h-48 rounded-full bg-gradient-to-br from-secondary via-primary to-secondary flex items-center justify-center shadow-2xl glow-effect">
            <div className="w-44 h-44 rounded-full bg-background flex items-center justify-center">
              <div className="w-40 h-40 rounded-full bg-gradient-to-br from-secondary/50 to-primary/50 flex items-center justify-center">
                <Mic className="w-16 h-16 text-foreground" />
              </div>
            </div>
          </div>
          
          {/* Pulsing ring */}
          <div className="absolute inset-0 w-48 h-48 rounded-full border-4 border-secondary/30 animate-[ping_2s_ease-in-out_infinite]" />
        </div>

        <div className="text-center space-y-2">
          <h2 className="text-2xl font-semibold text-foreground">Voice Call Active</h2>
          <p className="text-muted-foreground">Speak naturally with AI assistant</p>
        </div>
      </div>

      {/* Control buttons at bottom */}
      <div className="absolute bottom-16 flex items-center gap-8 z-10">
        <Button
          size="icon"
          variant={isMuted ? "destructive" : "outline"}
          className="h-16 w-16 rounded-full border-2 transition-all duration-300 hover:scale-110 glow-effect"
          onClick={() => setIsMuted(!isMuted)}
        >
          {isMuted ? (
            <MicOff className="h-7 w-7" />
          ) : (
            <Mic className="h-7 w-7" />
          )}
        </Button>

        <Button
          size="icon"
          variant="destructive"
          className="h-20 w-20 rounded-full transition-all duration-300 hover:scale-110 bg-destructive hover:bg-destructive/90 shadow-xl"
          onClick={onEndCall}
        >
          <PhoneOff className="h-8 w-8" />
        </Button>
      </div>
    </div>
  );
};

export default CallScreen;
