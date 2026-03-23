import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface Props {
  /** Progress 0–100 (preferred) */
  progress?: number;
  /** @deprecated use `progress` — kept for Sidebar and existing callers */
  percentage?: number;
  className?: string;
  heightClass?: string;
}

export default function ProgressBar({
  progress,
  percentage,
  className,
  heightClass = "h-2 rounded-full",
}: Props) {
  const value = progress ?? percentage ?? 0;
  const clamped = Math.min(Math.max(value, 0), 100);

  return (
    <div
      className={twMerge(clsx("w-full overflow-hidden bg-gray-200", className, heightClass))}
    >
      <div
        className={clsx(
          "rounded-full bg-purple-500 transition-all duration-500 ease-out",
          heightClass
        )}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
