import React, { ButtonHTMLAttributes } from 'react'
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'destructive' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
}
export const  Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({
  className = '',
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  disabled,
  ...props
}, ref) =>  {
    const baseStyles =
        'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-white'
    const variants = {
        primary:
        'bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-600',
        secondary:
        'bg-gray-100 text-gray-900 hover:bg-gray-200 focus-visible:ring-gray-500',
        destructive:
        'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600',
        outline:
        'border border-gray-300 bg-transparent hover:bg-gray-50 text-gray-700 focus-visible:ring-gray-500',
        ghost:
        'hover:bg-gray-100 text-gray-700 hover:text-gray-900 focus-visible:ring-gray-500',
    }
    const sizes = {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4 py-2 text-sm',
        lg: 'h-12 px-6 text-base',
    }
    const variantStyles = variants[variant]
    const sizeStyles = sizes[size]
    return (
        <button
        className={`${baseStyles} ${variantStyles} ${sizeStyles} ${className}`}
        disabled={disabled || isLoading}
        {...props}
        >
        {isLoading ? (
            <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : null}
        {children}
        </button>
    )
    }
)