"use client";
import React, { useRef } from "react";
import Link from "next/link";
import { Button } from "../shared/ui/button";
import Image from "next/image";

import { motion, type Variants } from "framer-motion";
import { Balloons, type BalloonsRef } from "./balloons";
import { Glow } from "../shared/components/glow";
import { AnimatedGroup } from "../shared/components/animated-group";
import { HeroHeader } from "./hero-header";
import { TextEffect } from "../shared/components/text-effect";
import { IntroTextButton } from "../shared/components/intro-text-button";

const transitionVariants = {
  item: {
    hidden: {
      opacity: 0,
      filter: "blur(12px)",
      y: 12,
    },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: {
        type: "spring",
        bounce: 0.3,
        duration: 1.5,
      },
    },
  },
};
const contentDelay = 0.3;
const itemDelayIncrement = 0.1;
const imageVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: contentDelay + itemDelayIncrement * 6,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export default function HeroSection() {
  const balloonsRef = useRef<BalloonsRef>(null);
  return (
    <>
      <HeroHeader />
      <Balloons
        ref={balloonsRef}
        type="default"
        autoLaunch={true}
        onLaunch={() => console.log("Default balloons launched!")}
      />
      <main className="overflow-hidden">
        <section>
          <div className="relative pt-24 md:pt-36">
            <Glow
              variant="bottom"
              className="animate-appear-zoom opacity-1 delay-1000"
            />
            <AnimatedGroup
              variants={{
                container: {
                  visible: {
                    transition: {
                      delayChildren: 1,
                    },
                  },
                },
                item: {
                  hidden: {
                    opacity: 0,
                    y: 20,
                  },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      type: "spring",
                      bounce: 0.3,
                      duration: 2,
                    },
                  },
                },
              }}
              className="absolute inset-0 -z-20"
            >
              <div className="border-border absolute top-0 left-0 z-0 grid h-full w-full grid-cols-[clamp(28px,10vw,120px)_auto_clamp(28px,10vw,120px)] border-b">
                {/* Decorations */}
                <div className="col-span-1 flex h-full items-center justify-center" />
                <div className="border-border col-span-1 flex h-full items-center justify-center border-x" />
                <div className="col-span-1 flex h-full items-center justify-center" />
              </div>
              {/* --- */}
              <figure className="bg-accent-500/40 pointer-events-none absolute -bottom-[70%] left-1/2 z-0 block aspect-square w-[520px] -translate-x-1/2 rounded-full blur-[200px]" />
              <figure className="bg-surface-primary dark:bg-dark-surface-primary pointer-events-none absolute top-[64px] left-[4vw] z-20 hidden aspect-square w-[32vw] rounded-full opacity-50 blur-[100px] md:block" />
              <figure className="bg-surface-primary dark:bg-dark-surface-primary pointer-events-none absolute right-[7vw] bottom-[-50px] z-20 hidden aspect-square w-[30vw] rounded-full opacity-50 blur-[100px] md:block" />
              {/* --- */}
            </AnimatedGroup>
            <div className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--color-background)_75%)]"></div>
            <div className="mx-auto max-w-7xl px-6">
              <div className="text-center sm:mx-auto lg:mt-0 lg:mr-auto">
                <AnimatedGroup variants={transitionVariants}>
                  <Link
                    href="#link"
                    className="group bg-background/40 backdrop-blur-md border border-white/10 shadow-lg hover:bg-background/60 transition-all duration-300 rounded-full px-4 py-2"
                  >
                    <IntroTextButton />
                  </Link>
                </AnimatedGroup>

                <TextEffect
                  preset="fade-in-blur"
                  speedSegment={0.3}
                  as="h1"
                  className="mt-8 text-6xl text-balance md:text-7xl lg:mt-16 xl:text-[5.25rem]"
                >
                  Your All-In-One Project Management Tool
                </TextEffect>
                <TextEffect
                  per="line"
                  preset="fade-in-blur"
                  speedSegment={0.3}
                  delay={0.5}
                  as="p"
                  className="text-md mx-auto mt-8 max-w-2xl italic not-last:text-balance"
                >
                  Highly customizable components for building modern websites
                  and applications that look and feel the way you mean it.
                </TextEffect>

                <AnimatedGroup
                  variants={{
                    container: {
                      visible: {
                        transition: {
                          staggerChildren: 0.05,
                          delayChildren: 0.75,
                        },
                      },
                    },
                    ...transitionVariants,
                  }}
                  className="mt-12 flex flex-col items-center justify-center gap-2 md:flex-row"
                >
                  <div
                    key={1}
                    className="bg-foreground/10 rounded-[calc(var(--radius-xl)+0.125rem)] border p-0.5"
                  >
                    <Button
                      asChild
                      size="lg"
                      className="rounded-xl px-5 text-base"
                    >
                      <Link href="#link">
                        <span className="text-nowrap">Start Building</span>
                      </Link>
                    </Button>
                  </div>
                  <Button
                    key={2}
                    asChild
                    size="lg"
                    variant="ghost"
                    className="h-10.5 rounded-xl px-5"
                  >
                    <Link href="#link">
                      <span className="text-nowrap">Request a demo</span>
                    </Link>
                  </Button>
                </AnimatedGroup>
              </div>
            </div>
            <motion.div
              variants={imageVariants}
              initial="hidden"
              animate="visible"
              className="mx-auto w-full max-w-4xl px-4 sm:px-0"
            >
              <div className="relative mt-8 -mr-56 overflow-hidden px-2 sm:mt-12 sm:mr-0 md:mt-20">
                <div
                  aria-hidden
                  className="to-background absolute inset-0 z-10 bg-linear-to-b from-transparent from-35%"
                />
                <div className="ring-background bg-background relative mx-auto max-w-6xl overflow-hidden rounded-2xl border p-4 shadow-lg ring-1 inset-shadow-2xs shadow-zinc-950/15 dark:inset-shadow-white/20">
                  <Image
                    className="bg-background relative hidden aspect-15/8 rounded-2xl dark:block"
                    src="/demo-light.jpg"
                    alt="app screen"
                    width="2700"
                    height="1440"
                  />
                  <Image
                    className="border-border/25 relative z-2 aspect-15/8 rounded-2xl border dark:hidden"
                    src="/demo-light.jpg"
                    alt="app screen"
                    width="2700"
                    height="1440"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </>
  );
}
