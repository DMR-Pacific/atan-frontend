
import { Calendar } from "@/components/ui/calendar"

import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import { useFormContext } from "react-hook-form"

export interface DateCellProps {
    fieldName: string
    handleChangeDate: (date: Date ) => void
}

export default function DateCell ({fieldName, handleChangeDate} : DateCellProps) {
    const dropdownRef = useRef<HTMLDivElement>(null)
    const {watch, setValue} = useFormContext()
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)

    const formValues = watch()

    const fieldValue = watch(fieldName)

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
            className="relative px-4 py-2 cursor-pointer border-r border-gray-100  dark:border-gray-700 h-full flex items-center text-xs text-gray-500"
            onClick={(e) => setIsMenuOpen(prev => !prev)}
        >
          {fieldValue && (
            <div className="flex items-center gap-2">
 
              <span className="">{new Date(fieldValue).toLocaleDateString("en-CA")}</span>

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
                    className="absolute top-full left-1/2 mt-1  bg-white rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50 transform -translate-x-1/2 flex items-center justify-center dark:bg-gray-900 dark:border-gray-700"
                    onClick={(e) => e.stopPropagation()}
                >
                    

                            <Calendar
                                mode="single"
                                selected={new Date(fieldValue)}
                                captionLayout="dropdown"
                                onSelect={(date) => {
                                    if (!date) return
                                    setValue(fieldName, toLocalISOString(date || new Date()))
                                    handleChangeDate(new Date(date.toLocaleDateString("en-CA")))
                                    setIsMenuOpen(false)
                                }}
                            />
                    


                </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

function toLocalISOString(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0")

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T` +
         `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}