import { ReactNode } from "react"

export const SelectCellWrapper = ({children} : {children: ReactNode}) => {
  return (
    <div className="border-r border-gray-100 h-full flex items-center">
      {children}
    </div>
  )
}
