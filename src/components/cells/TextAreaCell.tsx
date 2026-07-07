"use client";

import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

interface TextAreaCellProps {
  id: number;
  fieldName: string;
  position?: "left" | "center" | "right";
  handleUpdate: () => void;
  isEditAllowed: boolean;
  rows?: number;
  placeholder?: string;
}

export default function TextAreaCell({
  id,
  fieldName,
  position = "left",
  handleUpdate,
  isEditAllowed,
  rows,
  placeholder,
}: TextAreaCellProps) {
  const [editing, setEditing] = useState(false);
  const [focused, setFocused] = useState(false);
  const { register, watch } = useFormContext();

  useEffect(() => {
    const handleVisibility = () => {
      console.log("VIS CHANGE -----");
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, []);
  const justifyMap = {
    left: "justify-start",
    center: "justify-center",
    right: "justify-end",
  };

  return (
    <div
      className={`flex h-full w-full flex-1 items-center p-1 ${justifyMap[position]}} truncate`} // border-r border-gray-100
      // className="px-2 py-2 flex justify-center h-full items-center w-full"
      onMouseEnter={() => setEditing(true)}
      onMouseLeave={() => {
        if (!focused) {
          setEditing(false);
        }
      }}
    >
      <textarea
        disabled={!isEditAllowed}
        {...register(fieldName)}
        onFocus={() => setFocused(true)}
        onBlur={() => {
          setFocused(false);
          setEditing(false);
          handleUpdate();
        }}
        rows={rows ? rows : 1}
        className={`min-h-[60px] w-full p-2 text-sm text-gray-700 ${focused ? "border border-blue-300 shadow-sm" : "border-gray-300 text-gray-400"} bg-whitedark:bg-gray-900 resize-y rounded focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-700 dark:text-white`}
        placeholder={placeholder}
      />
    </div>
  );
}
