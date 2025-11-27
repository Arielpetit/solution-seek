import { toast as sonnerToast } from "sonner";

type Toast = {
  id?: string;
  title?: string;
  description?: string;
  variant?: "default" | "destructive" | "success" | "warning";
  duration?: number;
};

export function useToast() {
  const toast = ({ title, description, variant, duration, ...props }: Toast) => {
    switch (variant) {
      case "destructive":
        sonnerToast.error(title, {
          description: description,
          duration: duration,
          ...props,
        });
        break;
      case "success":
        sonnerToast.success(title, {
          description: description,
          duration: duration,
          ...props,
        });
        break;
      case "warning":
        sonnerToast.warning(title, {
          description: description,
          duration: duration,
          ...props,
        });
        break;
      default:
        sonnerToast.message(title, {
          description: description,
          duration: duration,
          ...props,
        });
    }
  };

  return {
    toast,
  };
}

export const toast = ({ title, description, variant, duration, ...props }: Toast) => {
  switch (variant) {
    case "destructive":
      sonnerToast.error(title, {
        description: description,
        duration: duration,
        ...props,
      });
      break;
    case "success":
      sonnerToast.success(title, {
        description: description,
        duration: duration,
        ...props,
      });
      break;
    case "warning":
      sonnerToast.warning(title, {
        description: description,
        duration: duration,
        ...props,
      });
      break;
    default:
      sonnerToast.message(title, {
        description: description,
        duration: duration,
        ...props,
      });
  }
};
