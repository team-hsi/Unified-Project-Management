import { Message } from "./message";
import { Member, User } from "./user";

export interface Room {
  id: string;
  name: string;
  type: string; // Consider using a more specific literal type like 'GROUP' | 'DIRECT' if applicable
  owner: User;
  members: Member[];
  spaceId: string;
}

export interface RoomPayload {
  id: string;
  name: string;
  userId: string;
  role: string;
  spaceId: string;
}

export interface Chat extends Room {
  messages: Message[] | [];
}
