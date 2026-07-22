import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export function LoadingOverlay({
  label = "Đang xử lý...",
  className,
  contentClassName,
}: {
  label?: string;
  className?: string;
  contentClassName?: string;
}) {
  return (
    <div
      className={cn(
        "absolute inset-0 z-[160] grid place-items-center bg-surface/80 backdrop-blur-[2px]",
        className,
      )}
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <div
        className={cn(
          "flex items-center gap-3 rounded-lg border border-border bg-surface px-5 py-4 text-base font-medium text-strong shadow-[0_18px_50px_rgba(18,32,51,0.18)]",
          contentClassName,
        )}
      >
        <Loader2 className="size-5 animate-spin text-theme" aria-hidden="true" />
        {label}
      </div>
    </div>
  );
}
