import { useState } from "react";
import { FileText, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export const ChatInput = ({ onSendMessage, disabled }: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleUploadPDF = () => {
    toast({
      title: "Upload PDF",
      description: "PDF upload feature coming soon!",
    });
  };

  return (
    <div className="border-t border-border bg-card/30 backdrop-blur-sm p-4">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        <div className="relative">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message here..."
            disabled={disabled}
            className="min-h-[80px] max-h-[200px] resize-none bg-chat-input border-border/50 focus:border-secondary pr-24 pl-4 py-4 text-[15px] rounded-2xl shadow-lg transition-all duration-200 focus:shadow-secondary/20"
            rows={1}
          />
          
          <div className="absolute right-2 bottom-2 flex gap-2">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleUploadPDF}
              className="h-10 w-10 rounded-xl hover:bg-accent text-muted-foreground hover:text-foreground transition-all duration-200"
            >
              <FileText className="h-5 w-5" />
            </Button>
            
            <Button
              type="submit"
              disabled={!message.trim() || disabled}
              size="icon"
              className="h-10 w-10 rounded-xl bg-gradient-to-br from-secondary to-secondary/80 hover:from-secondary/90 hover:to-secondary/70 shadow-lg shadow-secondary/20 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Press Enter to send, Shift + Enter for new line
        </p>
      </form>
    </div>
  );
};
