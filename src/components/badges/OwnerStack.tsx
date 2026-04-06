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
    return (
      <div className="bg-gray-100 px-4 py-2 rounded-lg flex items-center justify-center">
        <span className="text-gray-300 text-xs">Unassigned</span>
      </div>
    )

  return (
    <div className="bg-gray-100 rounded-lg px-4 py-2 space-x-1 overflow-hidden flex items-center justify-center">
      {owners.map((owner, index) => (
        <div
          key={index}
          // style={{backgroundColor: owner.color ? owner.color : 'blue'}}
          className={`inline-flex items-center justify-center h-6 w-6 rounded-full ring-1 ring-blue-500 text-[10px] font-medium bg-blue-100 text-blue-900 `}
          title={owner.initials}
        >
          {owner.initials}
        </div>
      ))}
    </div>
  )
}
