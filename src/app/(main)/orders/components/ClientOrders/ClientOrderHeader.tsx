import React from 'react'
import { Info, Plus } from 'lucide-react'

export interface Header { 
  label?: string; 
  width?: string; 
  info?: boolean; 
  align?: string;
}

export function ClientOrderHeader() {
  const headers: Header[] = [
    {
      label: '',
      width: '40px',
    },
    {
      label: 'Order #',
      width: 'minmax(250px,2fr)',
    },
    {
      label: 'Assigned To',
      width: '80px',
      info: true,
    },
    {
      label: 'Status',
      width: '120px',
      info: true,
    },
    {
      label: 'Due date',
      width: '120px',
      info: true,
    },
    {
      label: 'Priority',
      width: '120px',
    },
    {
      label: 'Notes',
      width: 'minmax(200px,3fr)',
    },
    {
      label: 'Last updated',
      width: '120px',
    },
    {
      label: 'PO $ Value',
      width: '100px',
    },
    {
      label: 'Client Type',
      width: '80px',
    },
  ]
  return (
    <div className="grid grid-cols-[40px_minmax(250px,2fr)_minmax(80px,120px)_140px_150px_100px_minmax(200px,3fr)_100px_120px_100px] gap-0 border-y border-gray-200 bg-white text-xs text-gray-500 font-medium sticky top-0 z-10 shadow-sm">
      {headers.map((header, index) => (
        <div
          key={`header-${index}`}
          className={`px-2 py-2 h-8 flex items-center border-r border-gray-100 last:border-r-0 ${header.align === 'center' ? 'justify-center' : ''}`}
        >
          <span className="truncate">{header.label}</span>
          {/* {header.info && <Info size={12} className="ml-1 text-gray-300" />} */}
        </div>
      ))}
    </div>
  )
}
