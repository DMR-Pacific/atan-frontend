import React from 'react'

export interface Owner {
  initials: string
  color?: string
}

interface OwnerStackProps {
  owners: Owner[]
}
export function OwnerStack({ owners }: OwnerStackProps) {
  if (!owners || owners.length === 0)
    return <span className="text-gray-300 text-xs">-</span>
  return (
    <div className="flex -space-x-1 overflow-hidden">
      {owners.map((owner, index) => (
        <div
          key={index}
          // style={{backgroundColor: owner.color ? owner.color : 'blue'}}
          className={`inline-flex items-center justify-center h-6 w-6 rounded-full ring-1 ring-white text-[10px] font-medium bg-blue-100 `}
          title={owner.initials}
        >
          {owner.initials}
        </div>
      ))}
    </div>
  )
}
