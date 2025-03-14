import { toast } from "sonner";

export const showNotification = {
  rateLimitHit: (retryAfter: string, retries: number, maxRetries: number) => {
    toast.warning(
      `Rate limit reached. Retrying in ${retryAfter}s (${
        retries + 1
      }/${maxRetries})`
    );
  },

  error: (message: string) => {
    toast.error(message);
  },

  success: (message: string) => {
    toast.success(message);
  },
};
