// components/ui/BaseCollapsible.tsx
import { Collapsible as ShadCollapsible, Collapsible } from "@/components/ui/collapsible";
import { ReactNode } from "react";

interface DmrCollapsibleProps extends React.ComponentProps<typeof Collapsible> {
  children: ReactNode;
}

export function DmrCollapsible({ children, ...props }: DmrCollapsibleProps) {
  return (
    <ShadCollapsible {...props} className="border border-gray-200 rounded-md shadow-sm">
      {children}
    </ShadCollapsible>
  );
}