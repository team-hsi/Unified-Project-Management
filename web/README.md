# Unified Project Management - Web

A web-based platform for unified project management.

---

## 1. Installation and Configuration

### Prerequisites

- **Node.js** (v16+ recommended)
- **npm** or **yarn** or **pnpm**
- **Git** (for version control)
- **Playwright** (for end-to-end testing)

### Setup Steps

1. **Clone the repository:**

   ```sh
   git clone https://github.com/your-org/Unified-Project-Management.git
   cd Unified-Project-Management/web
   ```

2. **Install dependencies:**

   ```sh
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Environment configuration:**

   - Copy `.env.example` to `.env` and update environment variables as needed (e.g., database URLs, API keys).

4. **Start the development server:**

   ```sh
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Run tests:**
   ```sh
   npx playwright test
   ```

### Version Control

- The project uses **Git** for version control.
- Follow the [Git Flow](https://nvie.com/posts/a-successful-git-branching-model/) branching model:
  - `main` for production-ready code
  - `develop` for ongoing development
  - Feature branches: `feature/your-feature`
  - Bugfix branches: `bugfix/your-bug`
- Commit messages should be clear and follow the [Conventional Commits](https://www.conventionalcommits.org/) standard.

---

## 2. Development

### Coding Practices

- **TypeScript** is used for type safety.
- **ESLint** and **Prettier** are configured for code quality and formatting.
- Use semantic HTML and accessible components.
- All UI components are tested with Playwright.

### Integration Strategies

- **Continuous Integration (CI):** Automated tests run on every pull request.
- **API Integration:** The frontend communicates with the backend via RESTful APIs.
- **Component Reuse:** Shared components are placed in a common directory for reuse.

### Challenges Faced

- **Authentication Flows:** Ensuring secure and user-friendly login/logout with proper error handling.
- **Testing Asynchronous UI:** Handling timing issues in Playwright tests, especially for redirects and dynamic content.
- **Environment Management:** Managing different configurations for development, testing, and production environments.
- **Merge Conflicts:** Occasionally, parallel feature development led to merge conflicts, resolved through regular communication and rebasing.

---

## 3. Code Snippets

### Task Management (Frontend)

This snippet extends the provided Page.tsx to demonstrate task fetching and rendering in a kanban view.

```tsx
// web/app/(protected)/[workspaceId]/[projectId]/page.tsx
import { getProjectById } from "@/actions/api/project/queries";
import { ProjectHeader } from "@/feature/project/layout/project-header";
import { ViewContainer } from "@/feature/project/views/view-container";
import { Metadata } from "next";

type Props = {
  params: Promise<{ projectId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { projectId } = await params;

  const project = await getProjectById({ id: projectId });
  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  return {
    title: project.name || projectId,
  };
}

const Page = async (props: Props) => {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const view = (searchParams.view as string) || "kanban";
  const project = await getProjectById({ id: params.projectId });

  return (
    <div className="p-4 flex flex-col gap-4 overflow-hidden h-full">
      <ProjectHeader project={project} />
      <ViewContainer view={view} />
    </div>
  );
};

export default Page;
```

### Real-Time Chat (Frontend Client)

This React component handles sending and receiving chat messages via Socket.IO.

```tsx
// web/feature/chat/components/chat-input.tsx
"use client";
import { useState, KeyboardEvent, useRef } from "react";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { useChat } from "@/lib/stores/chat-provider";

export function ChatInput() {
  const { sendMessage } = useChat(); // Assuming you have a sendMessage function in your context
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      await sendMessage(message); // Call the sendMessage function from context
      setMessage("");
    }
  };

  const handleKeyDown = async (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (message.trim()) {
        await sendMessage(message); // Call the sendMessage function from context
        setMessage("");
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMessage(value);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center relative p-4 pt-1 bg-transparent"
    >
      <div className="flex-1 flex gap-2 relative bg-muted">
        <input
          ref={inputRef}
          type="text"
          value={message}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className="w-full bg-background border border-input rounded-md py-2.5 px-3 text-sm focus:outline-none focus:ring-2"
        />
      </div>
      <button
        type="submit"
        className={cn(
          "rounded-full p-1.5 flex items-center justify-center transition-all",
          !message.trim()
            ? "opacity-50 cursor-not-allowed"
            : "hover:scale-110 hover:bg-accent"
        )}
        disabled={!message.trim()}
      >
        <Send className="h-4 w-4" />
      </button>
    </form>
  );
}
```

---

## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes.
4. Push to your fork and submit a pull request.

---

## License

[MIT](LICENSE)
