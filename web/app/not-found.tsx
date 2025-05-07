import { Button } from "@/feature/shared/ui/button";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 - Not Found",
  description: "The page you are looking for could not be found.",
};

const NotFoundPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ type?: "workspace" | "project"; redirect?: string }>;
}) => {
  const type = (await searchParams)?.type;
  const redirect = (await searchParams)?.redirect;

  const isWorkspaceError = type === "workspace";
  const isProjectError = type === "project";
  const redirectPath = redirect || "/";

  const getErrorMessage = () => {
    if (isWorkspaceError) {
      return {
        title: "Workspace Not Found",
        message:
          "The workspace you're trying to access no longer exists or you don't have access to it.",
        buttonText: "Choose Workspace",
      };
    }
    if (isProjectError) {
      return {
        title: "Project Not Found",
        message:
          "The project you're trying to access no longer exists or you don't have access to it.",
        buttonText: "Go to Workspace",
      };
    }
    return {
      title: "Look like you're lost",
      message: "The page you are looking for is not available!",
      buttonText: "Take me home",
    };
  };

  const notFoundInfo = getErrorMessage();

  return (
    <section className="bg-white font-serif min-h-screen flex items-center justify-center">
      <div className="container mx-auto">
        <div className="flex justify-center">
          <div className="w-full sm:w-10/12 md:w-8/12 text-center">
            <div
              className="bg-[url(https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif)] h-[250px] sm:h-[350px] md:h-[400px] bg-center bg-no-repeat bg-contain"
              aria-hidden="true"
            >
              <h1 className="text-center text-black text-6xl sm:text-7xl md:text-8xl pt-6 sm:pt-8">
                404
              </h1>
            </div>

            <div className="mt-[-50px]">
              <h3 className="text-2xl text-black sm:text-3xl font-bold mb-4">
                {notFoundInfo.title}
              </h3>
              <p className="mb-6 text-black sm:mb-5">{notFoundInfo.message}</p>
              <Link href={redirectPath}>
                <Button className="my-5">{notFoundInfo.buttonText}</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NotFoundPage;
