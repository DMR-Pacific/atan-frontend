import { useReference } from "@/hooks/useReference"
import { BaseReferenceType } from "@/types/BaseReferenceType"
import { ChevronDown, ChevronDownIcon, Edit2 } from "lucide-react"
import { updateTag } from "next/cache"
import { useEffect, useRef, useState } from "react"
import { Chevron } from "react-day-picker"
import { useFormContext, useWatch } from "react-hook-form"
import { AnimatePresence, motion } from "framer-motion"
import { useOrdersContext } from "@/context/OrdersContext"
import { ApiRefType } from "@/types/api/ApiRefType"
import { sortByOrderIndexDesc } from "@/utils/sort/sortOrderIndex"

export interface HoverSelectProps     { 
        id: number,
        fieldName: string,
        fields: BaseReferenceType[]
        handleChangeSelect: (optionId: number) => void | Promise<void>
}
export default function HoverSelect ({ id, fieldName, fields, handleChangeSelect}: HoverSelectProps) {

    const dropdownRef = useRef<HTMLDivElement>(null)

    const [isMenuOpen, setIsMenuOpen] = useState<boolean>()
    const { register, watch, setValue} = useFormContext()
    const { setIsDrawerOpen, setDrawerTab } = useOrdersContext()
    const [editing, setEditing] = useState<boolean>(false)
    const formValues = watch()

    const value = watch(fieldName)

    const fieldMap: {[key: string]: ApiRefType} = {
        clientTypeId: 'clientType',
        priorityId: 'priority',
        statusId: 'status',
    }

    const onClose = () => {
        setIsMenuOpen(false)
    }

    useEffect(() => {
        if (!isMenuOpen) return

        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                onClose?.()
            }
        }

        document.addEventListener('mousedown', handleClickOutside)

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isMenuOpen, onClose])


    
    return (
        <div 
            ref={dropdownRef}
            onClick={() => {setIsMenuOpen(prev => !prev)}}
            style={{backgroundColor: fields?.find(field => field.id == value)?.color}}
            className={`h-full w-full relative cursor-pointer`}
            onMouseEnter={() => {
                setEditing(true)
            }}
            onMouseLeave={() => {
                setEditing(false)
            }}
        >
            <div
            className={`absolute top-0 right-0 w-0 h-0 border-t-[14px] border-t-white border-l-[14px] border-l-transparent
                transition-opacity duration-200
                 dark:border-gray-700
                ${editing ? "opacity-100" : "opacity-0"}
            `}
            />
            <div className="w-full h-full flex items-center justify-center text-white">
                <div>

                {fields?.find((field) => field.id == value)?.label || <ChevronDownIcon className="text-gray-900"/>}
                </div>

            </div>

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
            className="absolute top-full left-1/2 mt-1 w-48 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-200 p-6  transform -translate-x-1/2 dark:bg-gray-900 dark:border-gray-700"
          >
            <div
                className='flex flex-col gap-2'
            >

                {fields?.sort(sortByOrderIndexDesc).map((option) => (
                <button
                    key={option.label}
                    onClick={(e) => {

                        e.stopPropagation();

                        // Handle status change here
                        handleChangeSelect(option.id)
                        onClose?.()
                    }}
                    style={{
                        backgroundColor: option.color
                    }}
                    className={`
                        w-full 
                        px-4 py-2.5 text-white text-sm font-medium text-left transition-colors
                        rounded
                        hover:brightness-90 transition
                        dark:text-gray-200
                    `}
                >
                    {option.label}
                </button>
                ))}
            </div>
            {/* Edit Labels Option */}
            <div
                className='mt-4'
            >
                <hr />
                <button
                    onClick={(e) => {
                        e.stopPropagation()
                        onClose?.()
                        // setIsMenuOpen(false)

                        // Handle edit labels
                        setIsDrawerOpen(true)
                        setDrawerTab(fieldMap[fieldName])
                    }}
                    className="rounded w-full mt-2 px-4 py-2 text-gray-700 text-sm font-medium text-left hover:bg-gray-100 transition-colors flex items-center gap-2 "
                    >
                    <Edit2 className="w-3.5 h-3.5" />
                    Edit Options
                </button>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
        </div>
    )
}

            {/* <select
                {...register(
                    fieldName,
                    
                )}
                onChange={handleChange}
            >
                <option></option>
                {fields.map((field, i) => {
                return (
                    <option 
                        key={i} 
                        className={`text-${field.color}`} 
                        value={field.id}
                    >
                        {field.label}
                    </option>
                )
                })}
            </select> */}