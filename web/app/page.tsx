import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/feature/shared/ui/button";
import { CountdownTimer } from "@/feature/shared/ui/countdown-timer";

const LandingPage = () => {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-zinc-950">
      <div className="relative z-10 w-full max-w-2xl px-4 py-16 sm:px-6 lg:py-24">
        <div className="text-center">
          <div className="mb-4 inline-flex items-center justify-center rounded-full border border-zinc-800 bg-zinc-900/50 px-3 py-1 text-sm font-medium text-zinc-400">
            <span>Project in Development</span>
          </div>

          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
            <span className="block">Cool Stuff</span>
            <span className="block text-zinc-400">Coming Soon</span>
          </h1>

          <p className="mx-auto mt-6 max-w-md text-base text-zinc-400 sm:text-lg md:mt-8 md:max-w-lg md:text-xl">
            We&apos;re working hard to bring you something incredible. Stay
            tuned for our launch.
          </p>

          <div className="mt-10">
            <CountdownTimer targetDate={new Date("2025-04-30T23:59:59")} />
          </div>

          <div className="mt-12">
            <Link href="/projects">
              <Button className="h-12 px-8 bg-white text-black hover:bg-zinc-200 transition-colors">
                Have a glimpse
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <p className="mt-3 text-xs text-zinc-500">
              Early preview of what we&apos;re building
            </p>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 bg-[linear-gradient(to_right,#080808_1px,transparent_1px),linear-gradient(to_bottom,#080808_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
    </div>
  );
};

export default LandingPage;
