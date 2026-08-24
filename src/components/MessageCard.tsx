"use client";
import { X } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { formatDistanceToNow } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { IMessage } from "@/models/message.model";
import { useToast } from "./ui/use-toast";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import React from "react";
interface MessageCardProps {
  message: IMessage;
  onDelete: (messageId: string) => void;
}
const MessageCard: React.FC<MessageCardProps> = ({ message, onDelete }) => {
  const { toast } = useToast();
  const deleteMessage = async () => {
    onDelete((message._id || message.id) as string);
    try {
      await axios.delete(`/api/delete-message/${message._id || message.id}`);
      toast({
        title: "Message deleted",
        description: "Message has been deleted successfully",
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description: axiosError.response?.data.message,
      });
      console.log("Error deleting message: ", error);
    }
  };
  return (
    <Card className="bg-card/50 backdrop-blur border-border/50 hover:bg-card hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-lg group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors">{message.title || "Anonymous Message"}</CardTitle>
            <p className="text-xs text-muted-foreground mt-1.5">
              {message.createdAt ? formatDistanceToNow(new Date(message.createdAt), { addSuffix: true }) : "Just now"}
            </p>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
                <X className="w-4 h-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="border-border/50">
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Are you absolutely sure?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will
                  permanently delete this message from our
                  servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={deleteMessage} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Delete Message
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground leading-relaxed">{message.content}</p>
      </CardContent>
    </Card>
  );
};

export default MessageCard;
