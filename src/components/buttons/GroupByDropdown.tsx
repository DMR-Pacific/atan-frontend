import React, { useEffect, useState, useRef } from 'react'
import {
    User,
    CheckCircle,
    Calendar,
    AlertCircle,
    FileText,
    Clock,
    DollarSign,
    Layers,
    Building,
} from 'lucide-react'
import { useOrdersContext } from '@/context/OrdersContext'
import { ApiRefType } from '@/types/api/ApiRefType'
import { useClientOrdersTableContext } from '@/context/ClientOrdersTableContext'


interface ColumnOption {
    id: ApiRefType
    label: string
    icon: React.ReactNode
    iconBg: string
}


const COLUMN_OPTIONS: ColumnOption[] = [

  {
    id: 'status',
    label: 'Status',
    icon: <CheckCircle size={14} />,
    iconBg: 'bg-green-100 text-green-600',
  },

  {
    id: 'priority',
    label: 'Priority',
    icon: <AlertCircle size={14} />,
    iconBg: 'bg-red-100 text-red-600',
  },
    {
        id: 'category',
        label: 'Category',
        icon: <Layers size={14} />,
        iconBg: 'bg-blue-100 text-blue-600',
    },
    {
        id: 'clientType',
        label: 'Client Type',
        icon: <Building size={14} />,
        iconBg: 'bg-purple-100 text-purple-600',
    },
    //   {
//     id: 'owner',
//     label: 'Owner',
//     icon: <User size={14} />,
//     iconBg: 'bg-blue-100 text-blue-600',
//   },
  //   {
//     id: 'dueDate',
//     label: 'Due date',
//     icon: <Calendar size={14} />,
//     iconBg: 'bg-purple-100 text-purple-600',
//   },
//   {
//     id: 'notes',
//     label: 'Notes',
//     icon: <FileText size={14} />,
//     iconBg: 'bg-yellow-100 text-yellow-600',
//   },
//   {
//     id: 'timeline',
//     label: 'Timeline',
//     icon: <Clock size={14} />,
//     iconBg: 'bg-purple-100 text-purple-600',
//   },
//   {
//     id: 'value',
//     label: 'PO $ Value',
//     icon: <DollarSign size={14} />,
//     iconBg: 'bg-yellow-100 text-yellow-600',
//   },
]

interface GroupByDropdownProps {
    isOpen: boolean
    onClose: () => void
    selectedColumn?: string
}


export function GroupByDropdown({
    isOpen,
    onClose,
    selectedColumn = 'status',
}: GroupByDropdownProps) {
    const { setGroupBy } = useClientOrdersTableContext()
    const dropdownRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
        if (
            dropdownRef.current &&
            !dropdownRef.current.contains(event.target as Node)
        ) {
            onClose()
        }
        }
        if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isOpen, onClose])

    if (!isOpen) return null

    return (
        <div
            ref={dropdownRef}
            className="absolute top-full mt-1 right-0 bg-white  dark:bg-gray-900 dark:border-gray-700 dark:text-gray-200 rounded-lg shadow-lg border border-gray-200 w-56 py-2 z-30"
        >
            <div className="px-3 py-2 text-xs font-medium text-gray-500 border-b border-gray-100 dark:border-gray-700">
                Group Options
            </div>
            <div className="py-1 max-h-80 overflow-y-auto">
                {COLUMN_OPTIONS.map((option) => (
                <button
                    key={option.id}
                    onClick={() => {
                        setGroupBy(option.id)
                        onClose()
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-gray-50 transition-colors ${selectedColumn === option.id ? 'bg-blue-100 dark:bg-blue-100' : ''}`}
                >
                    <div
                        className={`w-6 h-6 rounded flex items-center justify-center flex-shrink-0 ${option.iconBg}`}
                    >
                        {option.icon}
                    </div>
                    <span
                        className={`text-left ${selectedColumn === option.id ? 'font-medium text-gray-900' : 'text-gray-700 dark:text-gray-200'}`}
                    >
                        {option.label}
                    </span>
                </button>))}
            </div>
        </div>
    )
}
