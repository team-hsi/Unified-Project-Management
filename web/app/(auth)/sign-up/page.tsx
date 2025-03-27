import { SignupForm } from "@/components/auth/signup-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create a new account",
};
const page = () => {
  return (
    <div className="mx-auto flex h-screen items-center justify-center">
      <SignupForm />
    </div>
  );
};

export default page;
