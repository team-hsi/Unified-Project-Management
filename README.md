# Unified Project Management

A modern, feature-rich project management application built with Next.js 15, React 19, and TypeScript.

## Project Overview

This is a full-stack project management application that provides a unified platform for managing projects, tasks, and team collaboration. The application is built using modern web technologies and follows best practices for scalability and maintainability.

## Tech Stack

- **Frontend Framework**: Next.js 15 (App Router)
- **UI Library**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**:
  - **Client State**: Zustand for global state management
  - **Server State**: TanStack Query for server state management and data fetching
  - **Context API**: For component-level state sharing
- **Data Fetching**: TanStack Query
- **Form Handling**: React Hook Form with Zod validation
- **UI Components**: shadcn/ui (built on Radix UI primitives)
- **Authentication**: Stateless JWT-based authentication with secure token storage
- **Internationalization**: next-intl
- **Package Manager**: pnpm

## Project Structure

```
web/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication routes
│   ├── (protected)/       # Protected routes
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── feature/               # Feature-based modules
│   ├── auth/             # Authentication features
│   ├── chat/             # Chat functionality
│   ├── project/          # Project management
│   ├── user/             # User management
│   └── shared/           # Shared components and utilities
├── lib/                   # Utility functions and configurations
├── i18n/                  # Internationalization files
├── public/                # Static assets
└── middleware.ts          # Next.js middleware for auth
```

## Key Features

- **Authentication & Authorization**
  - JWT-based stateless authentication
  - Secure token storage and management
  - Role-based access control
  - Protected routes and API endpoints
- **Project Management**
- **Task Management**
- **Real-time Chat**
- **User Management**
- **Internationalization Support**
- **Responsive Design**
- **Drag and Drop Functionality**
- **Form Validation**
- **Error Handling**

## Getting Started

### Prerequisites

- Node.js >= 18
- pnpm >= 10.6.5

### Installation

1. Clone the repository
2. Navigate to the web directory:
   ```bash
   cd web
   ```
3. Install dependencies:
   ```bash
   pnpm install
   ```

### Development

Run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Building for Production

```bash
pnpm build
pnpm start
```

## Contributing

Please read our contributing guidelines before submitting pull requests.

## License

This project is licensed under the terms of the LICENSE file in the root of this repository.
