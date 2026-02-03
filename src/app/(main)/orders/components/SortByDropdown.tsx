import React, { useEffect, useState, useRef } from 'react'
import { ArrowUpDown, Check, ChevronDown } from 'lucide-react'
import { SortByType } from '@/types/api/SortByType'
import { SortDirectionType } from '@/types/api/SortDirectionType'
export type SortOption = 'dueDate' | 'lastUpdated' | 'value' | 'creation'
export type SortDirection = 'asc' | 'desc'
interface SortByDrodownProps {
    sortBy: SortByType
    sortDirection: SortDirectionType
    options: {
        value: SortByType
        label: string
    }[]
    onChange: (sortBy: SortByType, sortDirection: SortDirectionType) => void
}

export function SortByDropdown({ sortBy, sortDirection, options, onChange}: SortByDrodownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const currentLabel =
    options.find((opt) => opt.value === sortBy)?.label || 'Sort'

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleOptionClick = (option: SortByType) => {
    if (option === sortBy) {
      // Toggle direction if clicking the same option
      onChange(option, sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      // New option, default to desc
      onChange(option, 'desc')

    }
    setIsOpen(false)
  }
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-md border border-gray-200 transition-colors"
      >
        <ArrowUpDown className="w-4 h-4" />
        <span>{currentLabel}</span>
        <ChevronDown
          className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="px-3 py-2 text-xs font-medium text-gray-500 border-b border-gray-100">
                Sort By
            </div>

            {options.map((option) => {
                const isSelected = option.value === sortBy
                return (
                <button
                    key={option.value}
                    onClick={() => handleOptionClick(option.value)}
                    className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                    <span className={isSelected ? 'font-medium text-blue-600' : ''}>
                    {option.label}
                    </span>

                    <div className="flex items-center gap-2">
                    {isSelected && (
                        <>
                        <span className="text-xs text-gray-500">
                            {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                        <Check className="w-4 h-4 text-blue-600" />
                        </>
                    )}
                    </div>
                </button>
                )
            })}

          <div className="border-t border-gray-100 mt-1 pt-1 px-3 py-2">
            <div className="text-xs text-gray-500">
              Click again to reverse order
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
