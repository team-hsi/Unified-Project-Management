import { MessageCircle, Kanban, Shield, UserCog, Languages, Layout } from 'lucide-react';
import { ReactNode } from 'react';
import { Card, CardContent, CardHeader } from '../shared/ui/card';

export default function Features() {
  return (
    <section className="bg-zinc-50 py-16 md:py-32 dark:bg-transparent">
      <div className="@container mx-auto max-w-5xl px-6">
        <div className="text-center">
          <h2 className="text-4xl font-semibold text-balance lg:text-5xl">
            Key Features
          </h2>
          <p className="mt-4">
            Our unified project management platform offers comprehensive tools to enhance team productivity and collaboration.
          </p>
        </div>
        <div className="mx-auto mt-8 grid max-w-sm gap-6 *:text-center md:mt-16 @min-4xl:max-w-full @min-4xl:grid-cols-3">
          <Card className="group shadow-zinc-950/5">
            <CardHeader className="pb-3">
              <CardDecorator>
                <UserCog className="size-6" aria-hidden />
              </CardDecorator>

              <h3 className="mt-6 font-medium">User Management</h3>
            </CardHeader>

            <CardContent>
              <p className="mt-3 text-sm">
                Complete user profile management with team assignments, permissions, and role customization.
              </p>
            </CardContent>
          </Card>

          <Card className="group shadow-zinc-950/5">
            <CardHeader className="pb-3">
              <CardDecorator>
                <Languages className="size-6" aria-hidden />
              </CardDecorator>

              <h3 className="mt-6 font-medium">Internationalization</h3>
            </CardHeader>

            <CardContent>
              <p className="mt-3 text-sm">
                Multi-language support with next-intl integration, making the platform accessible to global teams.
              </p>
            </CardContent>
          </Card>

          <Card className="group shadow-zinc-950/5">
            <CardHeader className="pb-3">
              <CardDecorator>
                <Layout className="size-6" aria-hidden />
              </CardDecorator>

              <h3 className="mt-6 font-medium">Responsive Design</h3>
            </CardHeader>

            <CardContent>
              <p className="mt-3 text-sm">
                Fully responsive interface that works seamlessly across desktop, tablet, and mobile devices.
              </p>
            </CardContent>
          </Card>
          <Card className="group shadow-zinc-950/5">
            <CardHeader className="pb-3">
              <CardDecorator>
                <Kanban className="size-6" aria-hidden />
              </CardDecorator>

              <h3 className="mt-6 font-medium">Project Management</h3>
            </CardHeader>

            <CardContent>
              <p className="text-sm">
                Comprehensive project tracking with task management, milestones, and drag-and-drop functionality for efficient workflow organization.
              </p>
            </CardContent>
          </Card>

          <Card className="group shadow-zinc-950/5">
            <CardHeader className="pb-3">
              <CardDecorator>
                <MessageCircle className="size-6" aria-hidden />
              </CardDecorator>

              <h3 className="mt-6 font-medium">Real-time Chat</h3>
            </CardHeader>

            <CardContent>
              <p className="mt-3 text-sm">
                Integrated communication with team chat, direct messaging, and file sharing for seamless collaboration.
              </p>
            </CardContent>
          </Card>

          <Card className="group shadow-zinc-950/5">
            <CardHeader className="pb-3">
              <CardDecorator>
                <Shield className="size-6" aria-hidden />
              </CardDecorator>

              <h3 className="mt-6 font-medium">Authentication & Authorization</h3>
            </CardHeader>

            <CardContent>
              <p className="mt-3 text-sm">
                Secure JWT-based authentication with role-based access control to protect your data and manage user permissions effectively.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

const CardDecorator = ({ children }: { children: ReactNode }) => (
  <div className="relative mx-auto size-36 duration-200 [--color-border:color-mix(in_oklab,var(--color-zinc-950)10%,transparent)] group-hover:[--color-border:color-mix(in_oklab,var(--color-zinc-950)20%,transparent)] dark:[--color-border:color-mix(in_oklab,var(--color-white)15%,transparent)] dark:group-hover:bg-white/5 dark:group-hover:[--color-border:color-mix(in_oklab,var(--color-white)20%,transparent)]">
    <div
      aria-hidden
      className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:24px_24px]"
    />
    <div
      aria-hidden
      className="to-background absolute inset-0 bg-radial from-transparent to-75%"
    />
    <div className="bg-background absolute inset-0 m-auto flex size-12 items-center justify-center border-t border-l">
      {children}
    </div>
  </div>
);
