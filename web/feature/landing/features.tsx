// import {
//   Gemini,
//   Replit,
//   MagicUI,
//   VSCodium,
//   MediaWiki,
//   GooglePaLM,
// } from '@/components/logos';
// import { LogoIcon } from '@/components/logo';

import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  Code,
  Flag,
  Highlighter,
  MessageCircle,
  Origami,
  Tags,
  ThermometerSnowflake,
} from "lucide-react";
import { Button } from "../shared/ui/button";

export function IntegrationsSection() {
  return (
    <section>
      <div className="py-24 md:py-32">
        <div className="mx-auto max-w-5xl px-6">
          <div className="group relative mx-auto flex aspect-16/10 max-w-[22rem] items-center justify-between sm:max-w-sm">
            <div
              role="presentation"
              className="border-foreground/5 absolute inset-0 z-10 aspect-square animate-spin items-center justify-center rounded-full border-t bg-linear-to-b from-lime-500/15 to-transparent to-25% opacity-0 duration-[3.5s] group-hover:opacity-100 dark:from-white/5"
            ></div>
            <div
              role="presentation"
              className="border-foreground/5 absolute inset-16 z-10 aspect-square scale-90 animate-spin items-center justify-center rounded-full border-t bg-linear-to-b from-blue-500/15 to-transparent to-25% opacity-0 duration-[3.5s] group-hover:opacity-100"
            ></div>
            <div className="from-muted-foreground/15 absolute inset-0 flex aspect-square items-center justify-center rounded-full border-t bg-linear-to-b to-transparent to-25%">
              <IntegrationCard className="absolute top-1/4 left-0 -translate-x-1/6 -translate-y-1/4">
                <Origami />
              </IntegrationCard>
              <IntegrationCard className="absolute top-0 -translate-y-1/2">
                <Flag />
              </IntegrationCard>
              <IntegrationCard className="absolute top-1/4 right-0 translate-x-1/6 -translate-y-1/4">
                <Tags />
              </IntegrationCard>
            </div>
            <div className="from-muted-foreground/15 absolute inset-16 flex aspect-square scale-90 items-center justify-center rounded-full border-t bg-linear-to-b to-transparent to-25%">
              <IntegrationCard className="absolute top-0 -translate-y-1/2">
                <Code />
              </IntegrationCard>
              <IntegrationCard className="absolute top-1/4 left-0 -translate-x-1/4 -translate-y-1/4">
                <ThermometerSnowflake />
              </IntegrationCard>
              <IntegrationCard className="absolute top-1/4 right-0 translate-x-1/4 -translate-y-1/4">
                <MessageCircle />
              </IntegrationCard>
            </div>
            <div className="absolute inset-x-0 bottom-0 mx-auto my-2 flex w-fit justify-center gap-2">
              <div className="bg-muted relative z-20 rounded-full border p-1">
                <IntegrationCard
                  className="shadow-black-950/10 dark:bg-background size-16 border-black/20 shadow-xl dark:border-white/25 dark:shadow-white/15"
                  isCenter={true}
                >
                  <Highlighter className="text-blue-500" />
                </IntegrationCard>
              </div>
            </div>
          </div>
          <div className="from-background relative z-20 mx-auto mt-12 max-w-lg space-y-6 bg-linear-to-t from-55% text-center">
            <h2 className="text-3xl font-semibold text-balance md:text-4xl">
              Integrate with your favorite tools
            </h2>
            <p className="text-muted-foreground">
              Connect seamlessly with popular platforms and services to enhance
              your workflow.
            </p>

            <Button variant="outline" size="sm" asChild>
              <Link href="#">Get Started</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

const IntegrationCard = ({
  children,
  className,
  isCenter = false,
}: {
  children: React.ReactNode;
  className?: string;
  position?:
    | "left-top"
    | "left-middle"
    | "left-bottom"
    | "right-top"
    | "right-middle"
    | "right-bottom";
  isCenter?: boolean;
}) => {
  return (
    <div
      className={cn(
        "relative z-30 flex size-12 rounded-full border bg-white shadow-sm shadow-black/5 dark:bg-white/5 dark:backdrop-blur-md",
        className
      )}
    >
      <div className={cn("m-auto size-fit *:size-5", isCenter && "*:size-8")}>
        {children}
      </div>
    </div>
  );
};

export default function IntegrationsSection2() {
  return (
    <section>
      <div className="bg-muted dark:bg-background py-24 md:py-32">
        <div className="mx-auto flex flex-col px-6 md:grid md:max-w-5xl md:grid-cols-2 md:gap-12">
          <div className="order-last mt-6 flex flex-col gap-12 md:order-first">
            <div className="space-y-6">
              <h2 className="text-3xl font-semibold text-balance md:text-4xl lg:text-5xl">
                Integrate with your favorite LLMs
              </h2>
              <p className="text-muted-foreground">
                Connect seamlessly with popular platforms and services to
                enhance your workflow.
              </p>
              <Button variant="outline" size="sm" asChild>
                <Link href="#">Get Started</Link>
              </Button>
            </div>

            <div className="mt-auto grid grid-cols-[auto_1fr] gap-3">
              <div className="bg-background flex aspect-square items-center justify-center border">
                <Highlighter className="size-9" />
              </div>
              <blockquote>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Quisquam, quos.
                </p>
                <div className="mt-2 flex gap-2 text-sm">
                  <cite>John Doe</cite>
                  <p className="text-muted-foreground">Founder, MediaWiki</p>
                </div>
              </blockquote>
            </div>
          </div>

          <div className="-mx-6 px-6 [mask-image:radial-gradient(ellipse_100%_100%_at_50%_0%,#000_70%,transparent_100%)] sm:mx-auto sm:max-w-md md:-mx-6 md:mr-0 md:ml-auto">
            <div className="bg-background dark:bg-muted/50 rounded-2xl border p-3 shadow-lg md:pb-12">
              <div className="grid grid-cols-2 gap-2">
                <Integration
                  icon={<Code />}
                  name="Gemini"
                  description="The AI model that powers Google's search engine."
                />
                <Integration
                  icon={<Flag />}
                  name="Replit"
                  description="The AI model that powers Google's search engine."
                />
                <Integration
                  icon={<Origami />}
                  name="GooglePaLM"
                  description="The AI model that powers Google's search engine."
                />
                <Integration
                  icon={<MessageCircle />}
                  name="MagicUI"
                  description="The AI model that powers Google's search engine."
                />
                <Integration
                  icon={<Tags />}
                  name="VSCodium"
                  description="The AI model that powers Google's search engine."
                />
                <Integration
                  icon={<ThermometerSnowflake />}
                  name="MediaWiki"
                  description="The AI model that powers Google's search engine."
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const Integration = ({
  icon,
  name,
  description,
}: {
  icon: React.ReactNode;
  name: string;
  description: string;
}) => {
  return (
    <div className="hover:bg-muted dark:hover:bg-muted/50 space-y-4 rounded-lg border p-4 transition-colors">
      <div className="flex size-fit items-center justify-center">{icon}</div>
      <div className="space-y-1">
        <h3 className="text-sm font-medium">{name}</h3>
        <p className="text-muted-foreground line-clamp-1 text-sm md:line-clamp-2">
          {description}
        </p>
      </div>
    </div>
  );
};
