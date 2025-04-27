interface RoomUser {
  id: string;
  name: string;
}

export interface Room {
  id: string;
  name: string;
  type: string; // Consider using a more specific literal type like 'GROUP' | 'DIRECT' if applicable
  owner: RoomUser;
  members: RoomUser[];
  spaceId: string;
}

export interface RoomPayload {
  id: string;
  name: string;
}
