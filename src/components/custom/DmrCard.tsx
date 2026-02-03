import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface DmrCardProps {
  children: ReactNode;
  className?: string;
  outlined?: boolean;   // optional outline style
  shadow?: boolean;     // optional shadow
  rounded?: boolean;    // optional border-radius
  p?: string;           // padding override
}

export function DmrCard({
  children,
  className,
  outlined = true,
  shadow = true,
  rounded = true,
  p = "p-4",
}: DmrCardProps) {
  return (
    <div
      className={cn(
        "bg-white",
        outlined && "border border-gray-200",
        shadow && "shadow-sm",
        rounded && "rounded-lg",
        p,
        className
      )}
    >
      {children}
    </div>
  );
}

interface DmrCardBodyProps {
  children: ReactNode;
  className?: string;
  p?: string; // optional padding override
}

export function DmrCardBody({ children, className, p = "p-4" }: DmrCardBodyProps) {
  return <div className={cn(p, className)}>{children}</div>;
}