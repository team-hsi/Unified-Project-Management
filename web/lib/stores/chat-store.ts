import { create } from "zustand";

export type ChatState = {
  selectedChatId: string | null;
};

export type ChatActions = {
  selectChat: (id: string | null) => void;
};

export type ChatStore = ChatState & ChatActions;

// export const defaultInitState: ChatState = {
//   selectedChatId: null,
// };

export const useChatStore = create<ChatStore>((set) => ({
  selectedChatId: null,
  selectChat: (id) => set({ selectedChatId: id }),
}));
