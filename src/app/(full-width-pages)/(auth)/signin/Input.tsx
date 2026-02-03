import React, { useState, forwardRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertCircle } from 'lucide-react'
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
  rightElement?: React.ReactNode
}
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, rightElement, className = '', id, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false)
    const inputId = id || props.name || Math.random().toString(36).substr(2, 9)
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className={`block text-sm font-medium transition-colors ${isFocused ? 'text-slate-900' : 'text-slate-600'}`}
          >
            {label}
          </label>
        )}

        <div className="relative group">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-slate-900">
              {icon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            className={`
              w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none transition-all duration-200
              placeholder:text-slate-400 
              ${icon ? 'pl-10' : ''}
              ${rightElement ? 'pr-10' : ''}
              ${error ? 'border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/10' : 'border-slate-200 focus:border-slate-900 focus:ring-4 focus:ring-slate-900/10 hover:border-slate-300'}
              ${className}
            `}
            onFocus={(e) => {
              setIsFocused(true)
              props.onFocus?.(e)
            }}
            onBlur={(e) => {
              setIsFocused(false)
              props.onBlur?.(e)
            }}
            aria-invalid={!!error}
            {...props}
          />

          {rightElement && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {rightElement}
            </div>
          )}
        </div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{
                opacity: 0,
                y: -5,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -5,
              }}
              transition={{
                duration: 0.2,
              }}
              className="flex items-center text-xs text-red-500 font-medium mt-1"
            >
              <AlertCircle className="h-3 w-3 mr-1.5" />
              {error}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  },
)
Input.displayName = 'Input'
