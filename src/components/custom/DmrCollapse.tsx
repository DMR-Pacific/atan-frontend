import { ReactNode, useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface DmrCollapseProps {
  children: ReactNode;
  visible?: boolean;               // whether it starts open
  className?: string;           // optional wrapper class
  duration?: number;            // animation duration in ms
}

export default function DmrCollapse({
  children,
  visible = false,
  className,
  duration = 300,
}: DmrCollapseProps) {
  const [isOpen, setIsOpen] = useState(visible);
  const [height, setHeight] = useState<string | number>(visible ? "auto" : 0);
  const contentRef = useRef<HTMLDivElement>(null);

  // Update height on open/close
  useEffect(() => {
    if (!contentRef.current) return;

    if (isOpen) {
      const scrollHeight = contentRef.current.scrollHeight;
      setHeight(scrollHeight);
      const timer = setTimeout(() => setHeight("auto"), duration);
      return () => clearTimeout(timer);
    } else {
      const scrollHeight = contentRef.current.scrollHeight;
      setHeight(scrollHeight);
      requestAnimationFrame(() => setHeight(0));
    }
  }, [isOpen, duration]);

  return (
    <div className={cn("overflow-hidden transition-all duration-300", className)} style={{ height }}>
      <div ref={contentRef}>{children}</div>
    </div>
  );
}
