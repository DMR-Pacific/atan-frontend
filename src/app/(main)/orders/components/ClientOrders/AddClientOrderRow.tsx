import { useClientOrderGroupContext } from "@/context/ClientOrderGroupContext"
import { useClientOrdersTableContext } from "@/context/ClientOrdersTableContext"
import { useOrdersContext } from "@/context/OrdersContext"
import { addBlankClientOrderUnderReference } from "@/services/OrderService"
import { BaseReferenceType } from "@/types/BaseReferenceType"
import { useState } from "react"
import { toast } from "sonner"

interface AddClientOrderRowProps {
}
export default function AddClientOrderRow ({}: AddClientOrderRowProps) {
    const { handleShowClientOrderModal} = useOrdersContext()
    const { doGetAllOrdersByGroup } = useClientOrdersTableContext()


    return (
    <div className="grid grid-cols-[40px_1fr] border-t border-gray-100 hover:bg-gray-50 transition-colors h-[40px] items-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-200">
        <div className="flex justify-center items-center h-full border-r border-gray-100 bg-gray-50/30">
            <div className="w-4 h-4 border border-gray-300 rounded bg-white dark:bg-gray-900 dark:border-gray-700"></div>
        </div>
        <div 
            className='cursor-pointer'
            // onClick={doAddClientOrderUnderRef}
            onClick={() => {handleShowClientOrderModal('add', undefined, undefined, doGetAllOrdersByGroup)}}
        >
            <span className="px-4 flex items-center">
                + Add client po #
            </span>

        </div>

    </div>
    )
}
