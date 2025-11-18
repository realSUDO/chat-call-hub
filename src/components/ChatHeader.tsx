import { Menu, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatHeaderProps {
  onMenuClick: () => void;
  onCallClick: () => void;
}

export const ChatHeader = ({ onMenuClick, onCallClick }: ChatHeaderProps) => {
  return (
    <header className="bg-gradient-to-r from-primary via-primary to-primary/95 text-primary-foreground border-b border-primary/20 px-6 py-4 flex items-center justify-between shadow-lg backdrop-blur-sm">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="text-primary-foreground hover:bg-primary-foreground/10 rounded-xl transition-all duration-200 hover:scale-105"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-lg font-bold">AI Assistant</h1>
          <p className="text-xs text-primary-foreground/70">Always here to help</p>
        </div>
      </div>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={onCallClick}
        className="text-primary-foreground hover:bg-primary-foreground/10 rounded-xl transition-all duration-200 hover:scale-105 relative group"
      >
        <Phone className="h-5 w-5" />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-secondary rounded-full animate-pulse"></span>
      </Button>
    </header>
  );
};
