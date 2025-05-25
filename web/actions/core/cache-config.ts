export const CACHE_TIME = (min: number) => 60 * min;
export const CACHE_TIME_MS = (min: number) => 60 * 1000 * min;

// Next.js revalidate time (s)
export const CACHE_LIFE = {
  REALTIME: CACHE_TIME(0.5),
  MINUTE: CACHE_TIME(1),
  VERY_SHORT: CACHE_TIME(3),
  SHORT: CACHE_TIME(5),
  MEDIUM: CACHE_TIME(15), // 15 minutes
  LONG: CACHE_TIME(30), // 30 minutes
  HOUR: CACHE_TIME(60), // 1 hour
  EXTENDED: CACHE_TIME(360), // 6 hours
};
// React Query cache time (ms)
export const CACHE_LIFE_MS = {
  REALTIME: CACHE_TIME_MS(0.5),
  MINUTE: CACHE_TIME_MS(1),
  VERY_SHORT: CACHE_TIME_MS(3),
  SHORT: CACHE_TIME_MS(5),
  MEDIUM: CACHE_TIME_MS(15),
  LONG: CACHE_TIME_MS(30),
  HOUR: CACHE_TIME_MS(60),
  EXTENDED: CACHE_TIME_MS(360),
};
export const CACHE_TAGS = {
  USER: {
    WORKSPACES: (id: string) => `user-${id}-workspaces`,
    ROOMS: (id: string) => `user-${id}-rooms`,
  },
  WORKSPACE: {
    ALL: "workspaces",
    ONE: (id: string) => `workspace-${id}`,
    MEMBERS: (id: string) => `workspace-${id}-members`,
    PROJECTS: (id: string) => `workspace-${id}-projects`,
    ROOMS: (id: string) => `workspace-${id}-rooms`,
  },
  ROOM: {
    ALL: "rooms",
    ONE: (id: string) => `room-${id}`,
    MEMBERS: (id: string) => `room-${id}-members`,
    MESSAGES: (id: string) => `room-${id}-messages`,
  },
  PROJECT: {
    ALL: "projects",
    ONE: (id: string) => `project-${id}`,
    BUCKETS: (id: string) => `project-${id}-buckets`,
    ITEMS: (id: string) => `project-${id}-items`,
    LABELS: (id: string) => `project-${id}-labels`,
    DOCUMENTS: (id: string) => `project-${id}-documents`,
    MEMBERS: (id: string) => `project-${id}-members`,
  },
  DOCUMENT: {
    ALL: "documents",
    ONE: (id: string) => `document-${id}`,
  },
  BUCKET: {
    ALL: "buckets",
    ONE: (id: string) => `bucket-${id}`,
    ITEMS: (id: string) => `bucket-${id}-items`,
  },
  ITEM: {
    ALL: "items",
    ONE: (id: string) => `item-${id}`,
  },
};
