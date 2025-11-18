import { Menu, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatHeaderProps {
  onMenuClick: () => void;
  onCallClick: () => void;
}

export const ChatHeader = ({ onMenuClick, onCallClick }: ChatHeaderProps) => {
  return (
    <header className="bg-primary text-primary-foreground border-b border-primary/20 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="text-primary-foreground hover:bg-primary-foreground/10"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold">AI Assistant</h1>
      </div>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={onCallClick}
        className="text-primary-foreground hover:bg-primary-foreground/10"
      >
        <Phone className="h-5 w-5" />
      </Button>
    </header>
  );
};
