'use client'


import { useEffect, useState } from "react"
import { useFormContext } from "react-hook-form"

interface InputCellProps {
    id: number,
    fieldName: string
    position?: "left" | "center" | "right"
    handleUpdate: () => void
    rows?: number
}

export default function InputCell ({
    id, 
    fieldName, 
    position="left", 
    handleUpdate,
    rows
}: InputCellProps) {
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
            className={`flex flex-1 h-full items-center w-full ${justifyMap[position]}} truncate`}  // border-r border-gray-100

            // className="px-2 py-2 flex justify-center h-full items-center w-full"
            onMouseEnter={() => setEditing(true)}
            onMouseLeave={() => {
                if (!focused) {
                    setEditing(false)
                }
            }}
        >

                <input
                    {...register(fieldName)}
                    onFocus={() => setFocused(true)}

                    onBlur={() => {
                        setFocused(false)
                        setEditing(false)
                        handleUpdate()
                    }}
                    className={`w-full  min-h-[60px]  text-sm text-gray-700 rounded focus:outline-none focus:border-transparent dark:text-white bg-whitedark:bg-gray-900 dark:border-gray-700`}
                    // placeholder="Add notes..."
                />


        </div>
    )
}