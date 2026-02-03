"use client"
import * as React from "react"
import { ChevronDownIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import { useEffect } from "react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Controller, useFormContext } from "react-hook-form"
export function Calendar22({name} : { name: string }) {
  const [open, setOpen] = React.useState(false)
  const [date, setDate] = React.useState<Date | undefined>(undefined)

  const { control, watch} = useFormContext()

  const formValues = watch()

    useEffect(() => {

    }, [])

    const toLocalDate = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());
  return (
    <Controller
        name={name}
        control={control}
        render={({field}) => {
          // console.log(new Date(field.value))
          return (
            <div className="flex flex-col gap-3">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    id={name}
                    className=" w-full justify-between font-normal"
                >
                    {field.value instanceof Date ? field.value.toLocaleDateString() : "Date"}
                    <ChevronDownIcon />
                </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                <Calendar
                    mode="single"
                    selected={
                      field.value
                        ? toLocalDate(new Date(field.value))
                        : undefined
                    }                    
                    captionLayout="dropdown"
                    onSelect={(date) => {
                        console.log("SEL DATE" , date)
                        field.onChange(date) // update RHF state
                        setOpen(false)
                    }}
                />
                </PopoverContent>
            </Popover>
            </div>)}}
    />
  )
}