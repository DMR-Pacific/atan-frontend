import { DmrOrderDto } from "@/types/orders/DmrOrderDto";
import { Calendar, Pencil, Square, Truck, Unlink } from "lucide-react";
import { useDmrOrdersSubTableContext } from "@/context/DmrOrdersSubTableContext";
import { RefBadge } from "../../components/RefBadge";
import { useOrdersContext } from "@/context/OrdersContext";
import { OwnerStack } from "../../components/OwnerStack";
import { DmrOrderMaster } from "@/types/orders/DmrOrderMaster";

interface DmrOrderCardProps {
    order: DmrOrderMaster
    handleOrderCheck: (orderId: number) => void
    isSelectDisabled: boolean
    warnUnlink?: (orderId: number) => void
    showChildren: boolean

}

export default function DmrOrderCard ({
    order,
    handleOrderCheck, 
    isSelectDisabled, 
    warnUnlink,
    showChildren,
} :DmrOrderCardProps) {
    const {handleShowDmrOrderModal} = useOrdersContext()
    return (
        <div
            className="cursor-pointer bg-white border border-gray-200 rounded-lg p-3 hover:border-blue-300 hover:shadow-sm transition-all group"
            onClick={() => handleShowDmrOrderModal('view', order.id)}
        >
            <div
                className="flex items-start flex-col gap-3"
            >
                <div className="pt-0.5 border-b border-gray-200 pb-2 w-full">
                    <div className="flex gap-2 justify-between items-center h-full border-r border-gray-100 bg-gray-50/30">
                        <div className="gap-2 flex">
                            <input
                                onChange={(e) => {
                                    e.stopPropagation()
                                    handleOrderCheck(order.id)
                                }}
                                disabled={isSelectDisabled}
                                type="checkbox"
                                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                            />
                            <button
                                type='button'
                                className='hover:text-blue-600 transition-colors'
                                onClick={(e) => {
                                    e.stopPropagation()
                                    handleShowDmrOrderModal('edit', order.id)
                                }}
                            >
                                <Pencil size={16} />
                            </button>
                        </div>

                        {warnUnlink && <button 
                            onClick={() => warnUnlink(order.id)}
                            className='hover:text-red-600 transition-colors'
                        >
                            <Unlink size={16} />

                        </button>}
                    </div>            
                </div>
                <div className="flex-1 min-w-0 w-full">
                    <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="font-medium text-sm text-gray-900 line-clamp-2">
                        {order.label}
                    </h4>
                    {/* <GripVertical className="w-3.5 h-3.5 text-gray-300 cursor-move flex-shrink-0" /> */}
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                        <div className="flex-shrink-0">

                            <OwnerStack owners={order.assignedToList.map(u => ({
                                initials: u.firstName.charAt(0) + u.lastName.charAt(0),
                                color: 'blue'
                            }))} />
                        </div>

                        <RefBadge
                            className="flex-1 origin-left"
                            refType="status"
                            refId={order.statusId}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 my-4">
                        <div className="grid gap-2">

                            <div className='flex items-center gap-2'>
                                <Calendar
                                    size={14}
                                />
                                <span className="text-gray-400">
                                Order Date:
                                </span>{' '}
                                {order.orderDate}
                            </div>
                            <div className='flex items-center gap-2'>
                                <Truck
                                    size={14}
                                />
                                <span className="text-gray-400">
                                Estimated Arrival:
                                </span>{' '}
                                {order.estimatedArrival}
                            </div>
                        </div>
                        {/* <div
                        >
                            Value: ${order.value}
                        </div> */}

                    </div>

                    {order.notes && (
                    <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded border border-gray-100 line-clamp-4">
                        {order.notes}
                    </p>
                    )}
                </div>
            </div>
        </div>
    )
}