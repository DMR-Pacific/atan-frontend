import React, { HTMLAttributes } from 'react'
import { User } from 'lucide-react'
import { clsx } from 'clsx'
interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  initials?: string
  color?: string
  className?: string
}
export function Avatar({ initials, color, className, ...rest }: AvatarProps) {
  if (!initials) {
    return (
      <div
        className={clsx(
          'w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 border border-gray-200',
          className,
        )}
      >
        <User size={14} />
      </div>
    )
  }
  return (
    <div
      className={clsx(
        'w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium border border-white shadow-sm',
        color || 'bg-blue-200 text-gray-700',
        className,
      )}
      {...rest}
    >
      {initials}
    </div>
  )
}
