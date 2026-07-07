import { Calendar } from "@/components/ui/calendar";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";

export interface DateCellProps {
  fieldName: string;
  handleChangeDate: (date: Date) => void;
  isEditAllowed: boolean;
}

export default function DateCell({
  fieldName,
  handleChangeDate,
  isEditAllowed,
}: DateCellProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { watch, setValue } = useFormContext();
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const formValues = watch();

  const fieldValue = watch(fieldName);

  const onClose = () => {
    setIsMenuOpen(false);
  };

  useEffect(() => {
    if (!isMenuOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose?.();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen, onClose]);

  return (
    <div ref={dropdownRef}>
      <button
        disabled={!isEditAllowed}
        className={`relative flex h-full ${isEditAllowed && "cursor-pointer"} items-center border-r border-gray-100 px-4 py-2 text-xs text-gray-500 dark:border-gray-700`}
        onClick={(e) => {
          if (!isEditAllowed) return;
          setIsMenuOpen((prev) => !prev);
        }}
      >
        {fieldValue && (
          <div className="flex items-center gap-2">
            <span className="">
              {new Date(fieldValue).toLocaleDateString("en-CA")}
            </span>
          </div>
        )}
        {/* <Calendar22
            name="dueDate"
          /> */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{
                opacity: 0,
                y: -10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -10,
              }}
              transition={{
                duration: 0.15,
              }}
              className="absolute top-full left-1/2 z-50 mt-1 flex -translate-x-1/2 transform items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-900"
              onClick={(e) => e.stopPropagation()}
            >
              <Calendar
                mode="single"
                selected={new Date(fieldValue)}
                captionLayout="dropdown"
                onSelect={(date) => {
                  if (!date) return;
                  setValue(fieldName, toLocalISOString(date || new Date()));
                  handleChangeDate(new Date(date.toLocaleDateString("en-CA")));
                  setIsMenuOpen(false);
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    </div>
  );
}

function toLocalISOString(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T` +
    `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
  );
}
