import { useOrdersContext } from "@/context/OrdersContext"
import { ApiRefType } from "@/types/api/ApiRefType"
import { BaseReferenceType } from "@/types/BaseReferenceType"
import { useEffect, useState } from "react"

interface RefBadgeProps {
    refType: ApiRefType
    className?: string
    refId: number
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
