import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <div className=" h-screen grid items-center justify-center">
      <div className="w-screen flex flex-col items-center justify-center gap-2">
        <Image
          width={200}
          height={200}
          src="/turborepo-light.svg"
          className="imgLight"
          alt="Turborepo logo"
        />
        <p className="text-lg">
          <i>Turbo Monorepo Starter!</i>
        </p>
        <Button
          size="lg"
          className="bg-gradient-to-r from-blue-500 to-red-500 shadow-lg transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-xl"
        >
          Get Started
        </Button>
      </div>
    </div>
  );
}
