import { toast } from "sonner";
import { BaseError, isErrorResponse } from "@/lib/errors";

export const useUtils = () => {
  const toastUnknownError = (error: BaseError) => {
    toast.error(error.displayName, {
      description: error.message,
    });
  };

  const isValidResponse = (response: unknown) => {
    if (isErrorResponse(response)) {
      toast.error(response.error.displayName, {
        description: response.error.message,
      });
      return false;
    }
    return true;
  };

  return {
    toastUnknownError,
    isValidResponse,
  };
};
