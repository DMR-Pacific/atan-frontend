import { CollapsibleTrigger } from "@/components/ui/collapsible";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface DmrCollapsibleTriggerProps extends React.ComponentProps<typeof CollapsibleTrigger> {
  children: ReactNode;
  className?: string;
}

export function DmrCollapsibleTrigger({ children, className, ...props }: DmrCollapsibleTriggerProps) {
  return (
    <CollapsibleTrigger
      className={
        cn(
          "w-full text-left px-4 py-2 font-medium rounded-md bg-gray-100 hover:bg-gray-200 transition-colors",
          className
        )
      }
      {...props}
    >
      {children}
    </CollapsibleTrigger>
  );
}
