"use client";

import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

interface InputCellProps {
  id: number;
  fieldName: string;
  position?: "left" | "center" | "right";
  handleUpdate: () => void;
  isEditAllowed: boolean;
  rows?: number;
}

export default function InputCell({
  id,
  fieldName,
  position = "left",
  handleUpdate,
  isEditAllowed,
  rows,
}: InputCellProps) {
  const [editing, setEditing] = useState(false);
  const [focused, setFocused] = useState(false);
  const { register, watch } = useFormContext();

  const justifyMap = {
    left: "justify-start",
    center: "justify-center",
    right: "justify-end",
  };

  return (
    <div
      className={`flex h-full w-full flex-1 items-center ${justifyMap[position]}} truncate`} // border-r border-gray-100
      // className="px-2 py-2 flex justify-center h-full items-center w-full"
      onMouseEnter={() => setEditing(true)}
      onMouseLeave={() => {
        if (!focused) {
          setEditing(false);
        }
      }}
    >
      <input
        disabled={!isEditAllowed}
        {...register(fieldName)}
        onFocus={() => setFocused(true)}
        onBlur={() => {
          setFocused(false);
          setEditing(false);
          handleUpdate();
        }}
        className={`bg-whitedark:bg-gray-900 min-h-[60px] w-full rounded text-sm text-gray-700 focus:border-transparent focus:outline-none dark:border-gray-700 dark:text-white`}
        // placeholder="Add notes..."
      />
    </div>
  );
}
