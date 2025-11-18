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
    <div className="border-t border-border bg-chat-input p-4">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        <div className="flex gap-2 items-end">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleUploadPDF}
            className="flex-shrink-0 border-border hover:bg-accent"
          >
            <FileText className="h-4 w-4" />
          </Button>
          
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message here..."
            disabled={disabled}
            className="min-h-[60px] max-h-[200px] resize-none bg-background border-border focus:border-secondary"
            rows={1}
          />
          
          <Button
            type="submit"
            disabled={!message.trim() || disabled}
            size="icon"
            className="flex-shrink-0 bg-secondary hover:bg-secondary/90"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};
