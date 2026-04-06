import { useOrdersContext } from "@/context/OrdersContext"
import { ApiRefType } from "@/types/api/ApiRefType"
import { BaseReferenceType } from "@/types/BaseReferenceType"
import { useEffect, useState } from "react"

interface RefBadgeProps {
    refType: ApiRefType
    className?: string
    refId: number | null
}
export function RefBadge({
    refType,
    className,
    refId,
}: RefBadgeProps) {
    const { references } = useOrdersContext()
    const [ref, setRef] = useState<BaseReferenceType>({
        id: -1,
        orderIndex: -1,
        label: '',
        color: '',
    })
    let baseClasses =
        'px-3 py-1 rounded-sm text-xs font-medium text-white text-center w-full block truncate'

    useEffect(() => {
        const ref = references[refType].find((ref) => {
            return ref.id == refId
        })
        console.log(ref, refId)
        if (ref) setRef(ref)
    }, [references, refId])

    if (!refId) return (
        <div>
            {/* Return empty */}
        </div>
        // <div className="bg-gray-50 px-4 py-2 w-full flex items-center justify-center rounded-lg">
        //     <span className="text-gray-300 text-xs">No status</span>

            
        // </div>
    )


    return (
        <span 
            style={{
                backgroundColor: ref.color
            }}
            className={`${baseClasses} ${ref ? '' : 'bg-gray-500'} ${className}`}
        >
            {ref.label}
        </span>
    )
}
