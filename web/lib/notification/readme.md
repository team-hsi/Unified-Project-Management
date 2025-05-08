# Real-time Notification System

## Overview

A real-time notification system built with Socket.IO, React, and Zustand that handles various types of notifications (chat messages, project updates, workspace invites) with a clean UI and persistent storage.

## Architecture

### 1. Core Components

```
web/feature/notification/
├── @types/
│   └── notification.ts         # Type definitions
├── components/
│   ├── notification-bell.tsx   # Bell icon with unread count
│   ├── notification-item.tsx   # Individual notification display
│   └── notification-list.tsx   # List of notifications
├── hooks/
│   └── use-notification.ts     # Main notification hook
├── store/
│   └── notification-store.ts   # Zustand store
└── notification.tsx            # Main notification component
```

### 2. Socket Management

```
web/lib/notification/
├── socket.ts           # Base socket connection
└── socket-manager.ts   # Socket event management
```

## How It Works

### 1. Socket Connection

The system uses a singleton pattern for socket management to ensure only one connection exists at a time. The socket manager handles:

- Connection and disconnection
- Event subscription and unsubscription
- Event broadcasting to registered handlers

```typescript
// Example usage
socketManager.connect(token);
socketManager.subscribe("new-message", handleNewMessage);
```

### 2. Notification Store

The notification store (using Zustand) manages:

- List of notifications
- Unread count
- Adding new notifications
- Marking notifications as read
- Filtering notifications by type

```typescript
// Example usage
const { notifications, unreadCount, addNotification } = useNotificationStore();
```

### 3. Event Handling

The system handles different types of events:

- Chat messages
- Project updates
- Workspace invites

Each event type has its own handler that:

1. Creates a notification object
2. Adds it to the store
3. Shows a toast notification

## Usage

### 1. Basic Setup

Add the Notification component to your layout:

```tsx
// In your layout
<Notification />
```

### 2. Handling Events

Subscribe to events in your components:

```typescript
useEffect(() => {
  socketManager.subscribe("new-message", (message) => {
    // Handle new message
  });
}, []);
```

### 3. Managing Notifications

Access notification state in your components:

```typescript
const { notifications, markAsRead } = useNotificationStore();
```

## Event Types

### 1. Chat Messages

```typescript
interface ChatMessage {
  id: string;
  content: string;
  roomId: string;
  senderId: string;
  createdAt: string;
}
```

### 2. Project Updates

```typescript
interface ProjectUpdate {
  id: string;
  projectId: string;
  message: string;
}
```

### 3. Workspace Invites

```typescript
interface WorkspaceInvite {
  id: string;
  workspaceId: string;
  workspaceName: string;
}
```

## UI Components

### 1. Notification Bell

- Shows unread count badge
- Opens notification panel on click
- Displays connection status

### 2. Notification List

- Scrollable list of notifications
- Clear all button
- Empty state message

### 3. Notification Item

- Title and message
- Relative timestamp
- Read/unread state
- Click to mark as read

## Best Practices

1. **Socket Connection**

   - Always check for existing connection
   - Handle disconnection gracefully
   - Reconnect on token refresh

2. **Event Handling**

   - Use typed event handlers
   - Clean up subscriptions
   - Handle errors properly

3. **State Management**

   - Keep notifications ordered
   - Update unread count accurately
   - Clear old notifications

4. **UI/UX**
   - Show immediate feedback
   - Clear visual indicators
   - Handle loading states

## Common Issues and Solutions

1. **Socket Connection Issues**

   - Verify token validity
   - Check socket URL
   - Handle reconnection

2. **Event Not Received**

   - Check event subscription
   - Verify event name
   - Check data format

3. **UI Not Updating**
   - Verify store updates
   - Check component re-renders
   - Verify event handlers

## Future Improvements

1. **Persistence**

   - Local storage for notifications
   - Backend sync
   - Offline support

2. **Features**

   - Notification grouping
   - Type filtering
   - Search functionality
   - User preferences

3. **Performance**
   - Optimize re-renders
   - Implement pagination
   - Add caching

## Contributing

When adding new features or fixing bugs:

1. Follow the existing architecture
2. Add proper TypeScript types
3. Update documentation
4. Add tests if applicable

## License

MIT License
