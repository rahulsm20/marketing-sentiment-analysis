import { MessageType } from "@/types";
import { ArrowUpCircle } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import ChatMessage from "./ChatMessage";
import Layout from "./Layout";

//---------------------------------------------

const ChatUI = ({ messages = [] }: { messages: MessageType[] }) => {
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
      <div className="fixed bottom-10 w-2/3 md:w-1/3 flex border items-end justify-center gap-2 p-4 bg-background backdrop-blur-lg rounded-[--radius] border-border">
        <Input className="border-0 focus:border-0 focus:ring-0 focus-visible:ring-0 shadow-none bg-background backdrop-blur-lg focus-within:border-0 focus-within:ring-0" />
        <Button variant="ghost" size="icon">
          <ArrowUpCircle className="bottom-10 right-10 block" />
        </Button>
      </div>
    </Layout>
  );
};

export default ChatUI;
