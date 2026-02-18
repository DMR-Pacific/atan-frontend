import { ClientOrderDto } from "@/types/orders/ClientOrderDto"
import { Clock, DollarSign } from "lucide-react"
import { RefBadge } from "../RefBadge"
import { ClientOrderMaster } from "@/types/orders/ClientOrderMaster"
import { useOrdersContext } from "@/context/OrdersContext"
import { OwnerStack } from "../OwnerStack"

interface ClientORderCardProps {
    order: ClientOrderMaster
}

export default function ClientOrderCard ({ 
    order 
} : ClientORderCardProps) {
    const { handleShowClientOrderModal} = useOrdersContext()
    return (
        <div
            className="cursor-pointer bg-white p-4 rounded-md border border-gray-200 shadow-sm hover:border-indigo-200 transition-colors flex flex-col gap-3 dark:bg-gray-900 dark:border-gray-700"
            onClick={() => {handleShowClientOrderModal('edit', order.id)}}
        >
        <div className="flex justify-between items-start">
            <div>
            <span className="text-sm font-medium text-gray-900 block mb-1 dark:text-gray-200">
                {order.label}
            </span>
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <Clock className="w-3 h-3" />
                <span>Due: {order.dueDate}</span>
            </div>
            </div>
            <RefBadge
                refType='status'
                refId={order.statusId}
                className="scale-90 origin-top-right"
            />
        </div>

        <div className="h-px bg-gray-100 w-full"></div>

        <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-3">
            <OwnerStack 
                owners={order.assignedToList.map(u => ({
                    initials: u.firstName.charAt(0) + u.lastName.charAt(0),
                    color: 'blue'
            }))} />
            <RefBadge
                refType='priority'
                refId={order.priorityId}
                className="scale-90"
            />
            </div>
            <div className="font-medium text-gray-900 flex items-center gap-1 dark:text-gray-200">
            <DollarSign className="w-3.5 h-3.5 text-gray-400" />
                {order.value}
            </div>
        </div>
        </div>
    )
}