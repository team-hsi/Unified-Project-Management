# Actions Architecture Documentation

## Overview

This directory contains the core API infrastructure for the application. It follows a functional programming approach with clear separation of concerns and type safety, leveraging Next.js's built-in fetch caching mechanism.

## Directory Structure

```
actions/
├── core/                    # Core services
│   └── api-client.ts       # HTTP request handler with built-in caching
├── api/                    # Domain-specific APIs
│   ├── workspace/         # Workspace-related API
│   ├── project/          # Project-related API
│   ├── bucket/           # Bucket-related API
│   └── item/             # Item-related API
└── @types/               # Type definitions
    └── project.ts        # Shared type definitions
```

## Core Services

### 1. API Client (`api-client.ts`)

The API client handles all HTTP requests with built-in caching and error handling.

```typescript
// Usage Example
const result = await apiClient.get<Data>("/endpoint", {
  tags: ["data-tag"],
  revalidate: 60 * 2, // 2 minutes
});
```

**Key Features:**

- Automatic session management
- Type-safe requests and responses
- Built-in Next.js fetch caching
- Centralized error handling

**Methods:**

- `get<T>(endpoint, options)`: GET request with caching
- `post<T>(endpoint, data, options)`: POST request with caching
- `put<T>(endpoint, data, options)`: PUT request with caching
- `delete<T>(endpoint, options)`: DELETE request with caching

## Caching Strategy

### 1. Built-in Fetch Caching

We use Next.js's built-in fetch caching mechanism, which provides:

- Automatic caching of HTTP responses
- Tag-based cache invalidation
- Configurable revalidation times
- Type safety

### 2. Cache Implementation

```typescript
// Example of using fetch caching
const getData = async () => {
  return await apiClient.get<Data>("/endpoint", {
    tags: ["data-tag"],
    revalidate: 60 * 2, // 2 minutes
  });
};
```

### 3. Cache Invalidation

Cache invalidation is handled through `revalidateTag`:

```typescript
// In API methods
const updateData = async (payload) => {
  const result = await apiClient.post("/endpoint", payload, {
    tags: ["data-tag"],
  });
  revalidateTag("data-tag");
  return result;
};
```

## API Layer

### Domain-Specific APIs

Each domain (workspace, project, bucket, item) has its own API implementation:

```typescript
// Example: Project API
export const createProjectAPI = () => {
  const getAllProjects = async () => {
    return await apiClient.get<ProjectPayload[]>("/v1/projects/getAll", {
      tags: [CACHE_TAGS.PROJECTS],
    });
  };

  const createProject = async (payload) => {
    const result = await apiClient.post("/v1/projects/create", payload, {
      tags: [CACHE_TAGS.PROJECTS],
    });
    revalidateTag(CACHE_TAGS.PROJECTS);
    return result;
  };

  return { getAllProjects, createProject };
};
```

## Best Practices

### 1. Caching

- Use meaningful cache tags
- Set appropriate revalidation times
- Invalidate related caches on mutations
- Use consistent tag naming conventions

### 2. Error Handling

- Let errors propagate to the UI layer
- Use try-catch blocks in API methods
- Provide meaningful error messages
- Handle cache invalidation errors gracefully

### 3. Type Safety

- Define proper types for payloads and responses
- Use generics for API responses
- Validate data before sending
- Use TypeScript's strict mode

### 4. Performance

- Cache frequently accessed data
- Use appropriate revalidation times
- Batch related operations
- Minimize unnecessary API calls

## Common Patterns

### 1. CRUD Operations with Caching

```typescript
const createDomainAPI = () => {
  // Create
  const create = async (payload) => {
    const result = await apiClient.post('/endpoint', payload, {
      tags: ['domain']
    });
    revalidateTag('domain');
    return result;
  };

  // Read with caching
  const getAll = async () => {
    return await apiClient.get('/endpoint', {
      tags: ['domain'],
      revalidate: 60 * 5
    });
  };

  // Update with cache invalidation
  const update = async (payload) => {
    const result = await apiClient.put(`/endpoint/${payload.id}`, payload, {
      tags: ['domain']
    });
    revalidateTag('domain');
    return result;
  };

  // Delete with cache invalidation
  const delete = async (id) => {
    const result = await apiClient.delete(`/endpoint/${id}`, {
      tags: ['domain']
    });
    revalidateTag('domain');
    return result;
  };

  return { create, getAll, update, delete };
};
```

### 2. Batch Operations with Cache Management

```typescript
const batchUpdate = async (items) => {
  const results = await Promise.all(
    items.map((item) =>
      apiClient.put(`/endpoint/${item.id}`, item, {
        tags: ["domain"],
      })
    )
  );
  revalidateTag("domain");
  return results;
};
```

## Troubleshooting

### Common Issues

1. **Cache Not Updating:**

   - Verify cache tags are correctly set
   - Check revalidateTag calls
   - Verify revalidation times
   - Check for cache key collisions

2. **Type Errors:**

   - Verify payload and response types
   - Check generic type parameters
   - Update type definitions as needed

3. **API Errors:**
   - Check error handling implementation
   - Verify API endpoints
   - Check authentication
   - Review error messages

## Testing

### API Tests

```typescript
describe("DomainAPI", () => {
  it("should fetch and cache data", async () => {
    const result = await domainAPI.getAll();
    expect(result).toBeDefined();
  });

  it("should invalidate cache on update", async () => {
    await domainAPI.update({ id: "1", name: "test" });
    // Verify cache invalidation
  });
});
```

### Cache Tests

```typescript
describe("Cache", () => {
  it("should cache data with tags", async () => {
    const data = await apiClient.get("/endpoint", {
      tags: ["test"],
    });
    expect(data).toBeDefined();
  });
});
```
