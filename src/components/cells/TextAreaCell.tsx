'use client'


import { useEffect, useState } from "react"
import { useFormContext } from "react-hook-form"

interface TextAreaCellProps {
    id: number,
    fieldName: string
    position?: "left" | "center" | "right"
    handleUpdate: () => void
    rows?: number
    placeholder?: string
}

export default function TextAreaCell ({
    id, 
    fieldName, 
    position="left", 
    handleUpdate,
    rows,
    placeholder
}: TextAreaCellProps) {
    const [editing, setEditing] = useState(false)
    const [focused, setFocused] = useState(false)
    const { register, watch, } = useFormContext()


    useEffect(() => {
        const handleVisibility = () => {console.log("VIS CHANGE -----")}
        document.addEventListener("visibilitychange",handleVisibility )
        return () => document.removeEventListener("visibilitychange", handleVisibility)

    }, [])
    const justifyMap = {
        left: "justify-start",
        center: "justify-center",
        right: "justify-end",
    };


    return (
        <div 
            className={`p-1 flex flex-1 h-full items-center w-full ${justifyMap[position]}} truncate`}  // border-r border-gray-100

            // className="px-2 py-2 flex justify-center h-full items-center w-full"
            onMouseEnter={() => setEditing(true)}
            onMouseLeave={() => {
                if (!focused) {
                    setEditing(false)
                }
            }}
        >
                <textarea
                    {...register(fieldName)}
                    onFocus={() => setFocused(true)}

                    onBlur={() => {
                        setFocused(false)
                        setEditing(false)
                        handleUpdate()
                    }}
                    rows={rows ? rows : 1}
                    className={`w-full p-2 min-h-[60px] text-sm text-gray-700 ${focused ? "border border-blue-300 shadow-sm " : "border-gray-300 text-gray-400"} rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y dark:text-white bg-whitedark:bg-gray-900 dark:border-gray-700`}
                    placeholder={placeholder}
                />
        </div>
    )
}