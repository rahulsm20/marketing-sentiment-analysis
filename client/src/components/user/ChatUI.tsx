import { MessageType } from "@/types";
import { ArrowUpCircle } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import ChatMessage from "./ChatMessage";
import Layout from "./Layout";

//---------------------------------------------

const ChatUI = ({ messages = [] }: { messages: MessageType[] }) => {
  const suggestions = [
    "What is the most liked product?",
    "What is the least liked product?",
    "What is the most expensive product?",
    "What is the cheapest product?",
  ];
  return (
    <Layout className="flex-1 flex flex-col items-center justify-center pb-36">
      <div className="flex flex-col w-2/3 lg:w-1/2 gap-4">
        {messages.length > 0 ? (
          messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))
        ) : (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">No messages yet</p>
          </div>
        )}
      </div>
      <div className="fixed bottom-10 w-2/3 md:w-1/3 flex flex-col border justify-center gap-2 p-4 bg-background backdrop-blur-lg rounded-[--radius] border-border">
        <div className="flex">
          <Input
            className="border-0 focus:border-0 focus:ring-0 focus-visible:ring-0 shadow-none bg-background backdrop-blur-lg focus-within:border-0 focus-within:ring-0"
            placeholder="Ask anything regarding your report"
          />
          <Button variant="ghost" size="icon" className="rounded-full p-0">
            <ArrowUpCircle className="bottom-10 right-10 block" />
          </Button>
        </div>
        <Separator />
        <div className="flex gap-2 flex-wrap items-start w-full">
          {suggestions.map((suggestion, index) => (
            <Button
              key={index}
              variant="outline"
              size="icon"
              className="dark:bg-zinc-900 rounded-xl dark:hover:bg-zinc-800 p-2 backdrop-blur-lg w-auto justify-start"
            >
              <p className="text-muted-foreground text-xs">{suggestion}</p>
            </Button>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default ChatUI;
