export interface Message {
  id: string;
  roomId: string;
  senderId: string;
  content: string;
  createdAt: string;
}

export interface MessagePayload {
  id: string;
  roomId: string;
  content: string;
}
