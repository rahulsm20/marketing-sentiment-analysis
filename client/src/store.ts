import { create } from "zustand";
import { MessageType } from "./types";

export const useChatStore = create((set) => ({
  messages: [],
  setMessages: (messages: MessageType[]) => set({ messages }),
  addMessage: (message: MessageType) =>
    set(({ messages }) => ({ messages: [...messages, message] })),
  deleteMessage: (id: string) =>
    set(({ messages }) => ({
      messages: messages.filter((message: MessageType) => message.id !== id),
    })),
}));
