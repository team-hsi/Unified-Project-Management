# Actions Architecture Documentation

## Overview

This directory contains the core API infrastructure for the application. It follows a functional programming approach with clear separation of concerns and type safety, leveraging Next.js's built-in fetch caching mechanism.

## Directory Structure

```
actions/
├── core/                         # Core services
│   ├── api-client.ts            # HTTP request handler with built-in caching
│   ├── cache-config.ts          # Centralized cache configuration
│   ├── dal.ts                   # Data access layer
│   ├── locale.ts                # Localization utilities
│   └── session.ts               # Session management
└── api/                         # Domain-specific APIs
    ├── bucket/                  # Bucket-related API
    │   ├── mutations/           # Mutation operations
    │   └── queries/             # Query operations
    ├── item/                    # Item-related API
    ├── label/                   # Label-related API
    ├── message/                 # Message-related API
    ├── project/                 # Project-related API
    ├── room/                    # Room-related API
    ├── user/                    # User-related API
    └── workspace/               # Workspace-related API
```

## Core Services

### 1. API Client (`api-client.ts`)

The API client provides a set of server actions for handling HTTP requests with built-in caching and error handling using a functional approach.

```typescript
// Usage Example
const result = await get<Data>("/endpoint", {
  next: {
    tags: ["data-tag"],
    revalidate: 60 * 2, // 2 minutes
  }
});
```

**Key Features:**

- Server-side functions with "use server" directive
- Automatic session management
- Type-safe requests and responses
- Built-in Next.js fetch caching
- Centralized error handling

**Functions:**

- `get<T>(endpoint, options)`: GET request with caching
- `post<T>(endpoint, data)`: POST request for data mutations
- `put<T>(endpoint, data)`: PUT request for data updates
- `del<T>(endpoint, data?)`: DELETE request for data removal
- `auth<T>(endpoint, data)`: Special POST request for authentication

## Caching Strategy

### 1. Centralized Cache Configuration

We use a centralized cache configuration (`cache-config.ts`) that defines standardized cache durations:

```typescript
// Example of cache configuration
export const CACHE_DURATION = {
  REALTIME: 30,           // 30 seconds
  VERY_SHORT: 3 * 60,     // 3 minutes
  SHORT: 5 * 60,          // 5 minutes
  MEDIUM: 15 * 60,        // 15 minutes
  LONG: 30 * 60,          // 30 minutes
  HOUR: 60 * 60,          // 60 minutes
  EXTENDED: 6 * 60 * 60,  // 6 hours
};
```

### 2. Tag-based Cache Invalidation

We implement a hierarchical tag structure for precise cache invalidation:

```typescript
// Example of cache tags hierarchy
export const CACHE_TAGS = {
  USER: {
    WORKSPACES: 'user.workspaces',
  },
  WORKSPACE: {
    ALL: 'workspaces.all',
    ONE: (id: string) => `workspace.${id}`,
    MEMBERS: (id: string) => `workspace.${id}.members`,
    PROJECTS: (id: string) => `workspace.${id}.projects`,
    ROOMS: (id: string) => `workspace.${id}.rooms`,
  },
  PROJECT: {
    ALL: 'projects.all',
    ONE: (id: string) => `project.${id}`,
    BUCKETS: (id: string) => `project.${id}.buckets`,
    ITEMS: (id: string) => `project.${id}.items`,
    LABELS: (id: string) => `project.${id}.labels`,
  },
  BUCKET: {
    ALL: 'buckets.all',
    ONE: (id: string) => `bucket.${id}`,
    ITEMS: (id: string) => `bucket.${id}.items`,
  },
  ITEM: {
    ALL: 'items.all',
    ONE: (id: string) => `item.${id}`,
  },
  ROOM: {
    ALL: 'rooms.all',
    ONE: (id: string) => `room.${id}`,
    MEMBERS: (id: string) => `room.${id}.members`,
    MESSAGES: (id: string) => `room.${id}.messages`,
  },
};
```

### 3. Built-in Fetch Caching

We use Next.js's built-in fetch caching mechanism, which provides:

- Automatic caching of HTTP responses
- Tag-based cache invalidation
- Configurable revalidation times
- Type safety

### 4. Cache Implementation

```typescript
// Example of using fetch caching
const getData = async () => {
  return await get<Data>("/endpoint", {
    next: {
      tags: ["data-tag"],
      revalidate: 60 * 2, // 2 minutes
    }
  });
};
```

### 5. Cache Invalidation

Cache invalidation is handled through `revalidateTag`:

```typescript
// In API methods
const updateData = async (payload) => {
  const result = await post("/endpoint", payload);
  revalidateTag("data-tag");
  return result;
};
```
