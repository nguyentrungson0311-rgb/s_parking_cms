import { Toaster as SonnerToaster, toast } from "sonner";

type ToastDescription = string | undefined;

export const toastMessage = {
  success: (message: string, description?: ToastDescription) =>
    toast.success(message, { description }),
  error: (message: string, description?: ToastDescription) =>
    toast.error(message, { description }),
  info: (message: string, description?: ToastDescription) =>
    toast.info(message, { description }),
};

export function Toaster() {
  return (
    <SonnerToaster
      closeButton
      richColors
      position="top-right"
      toastOptions={{
        classNames: {
          toast: "font-sans text-base",
          title: "font-semibold",
          description: "text-sm",
        },
      }}
    />
  );
}

export { toast };
