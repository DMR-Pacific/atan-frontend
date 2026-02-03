// components/ui/BaseCollapsibleContent.tsx
import { CollapsibleContent } from "@/components/ui/collapsible";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface DmrCollapsibleContentProps extends React.ComponentProps<typeof CollapsibleContent> {
  children: ReactNode;
  className?: string;
}

export function DmrCollapsibleContent({ children, className, ...props }: DmrCollapsibleContentProps) {
  return (
    <CollapsibleContent
      className={cn(
        "p-4 bg-gray-50 text-gray-700 rounded-b-md mt-1 border-t border-gray-200",
        className
      )}
      {...props}
    >
      {children}
    </CollapsibleContent>
  );
}