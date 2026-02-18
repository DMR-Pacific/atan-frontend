'use client'


import { useState } from "react"
import { useFormContext } from "react-hook-form"

interface EditableTextCellProps {
    id: number,
    fieldName: string
    position?: "left" | "center" | "right"
    handleUpdate: () => void
    rows?: number
}

export default function EditableTextCell ({
    id, 
    fieldName, 
    position="left", 
    handleUpdate,
    rows
}: EditableTextCellProps) {
    const [editing, setEditing] = useState(false)
    const [focused, setFocused] = useState(false)
    const { register, watch } = useFormContext()


    const justifyMap = {
        left: "justify-start",
        center: "justify-center",
        right: "justify-end",
    };


    return (
        <div 
            className={`px-2 py-2 flex flex-1 h-full items-center w-full ${justifyMap[position]}} truncate`}  // border-r border-gray-100

            // className="px-2 py-2 flex justify-center h-full items-center w-full"
            onMouseEnter={() => setEditing(true)}
            onMouseLeave={() => {
                if (!focused) {
                    setEditing(false)
                }
            }}
        >

            {focused ? (
                <textarea
                    autoFocus
                    {...register(fieldName)}
                    onFocus={() => setFocused(true)}

                    onBlur={() => {
                        setFocused(false)
                        setEditing(false)
                        handleUpdate()
                    }}
                    rows={rows ? rows : 1}
                    className="w-full min-h-[60px] p-2 text-sm text-gray-700 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y dark:text-white bg-white shadow-sm dark:bg-gray-900 dark:border-gray-700"
                    // placeholder="Add notes..."
                />
            ) : (
                <div
                    onClick={() =>
                        setFocused(true)
                    }
                    className="w-full text-gray-500 truncate cursor-text hover:bg-gray-100 dark:hover:bg-gray-700 p-1 rounded transition-colors dark:text-gray-200"
                //   title={displayNote}
                >
                    {watch(fieldName) || (
                    <span className="text-gray-400 italic dark:text-gray-300">
                        Click ...
                    </span>
                    )}
                </div>
            )}
            

        </div>
    )
}