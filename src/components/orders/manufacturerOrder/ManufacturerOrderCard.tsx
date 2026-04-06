import { RefBadge } from "@/components/badges/RefBadge"
import { useOrdersContext } from "@/context/OrdersContext"
import { ManufacturerOrderMaster } from "@/types/orders/ManufacturerOrderTypes"
import { Pencil, Trash2, Truck } from "lucide-react"
import { useState } from "react"

interface ManufacturerOrderCarddProps {
    order: ManufacturerOrderMaster
}

export default function ManufacturerOrderCard ({ 
    order 
} : ManufacturerOrderCarddProps) {
    const { handleShowManufacturerOrderModal, doDeleteManufacturerOrder, setDeleteOrderModalOptions} = useOrdersContext()
    const [loadDelete, setLoadDelete] = useState<boolean>(false)
    console.log("ORDER", order)

    const handleDelete = () => {
        setLoadDelete(true)
        doDeleteManufacturerOrder(order.id)

        // hide modal upon deletion
        setDeleteOrderModalOptions({
            visible: false,
            orderIdListDelete: [],
            onSubmit: () => {},
            tableName: "client_orders",
            isDeleting: false,
        })
        setLoadDelete(false)
    }

    if (!order) return null

    return (
         <div
            className="cursor-pointer border border-gray-200 dark:border-gray-700 rounded-lg p-3 hover:border-blue-300 hover:shadow-sm transition-all group"
            onClick={() => handleShowManufacturerOrderModal('edit', order.id)}
        >
            <div
                className="flex items-start flex-col gap-3"
            >
                <div className="pt-0.5 border-b border-gray-200 pb-4 dark:border-gray-700 w-full">
                    <div className="flex gap-2 justify-between items-center h-full border-r border-gray-100">
                        <div className="gap-2 flex">

                            <button
                                type='button'
                                className='hover:text-blue-600 transition-colors'
                                onClick={(e) => {
                                    e.stopPropagation()
                                    handleShowManufacturerOrderModal('edit', order.id)
                                }}
                            >
                                <Pencil size={16} />
                            </button>
                            <button
                                type='button'
                                className='hover:text-red-600 transition-colors'
                                onClick={(e) => {
                                    e.stopPropagation()

                                    setDeleteOrderModalOptions({
                                        visible: true,
                                        onSubmit: handleDelete,
                                        tableName: "manufacturer_orders",
                                        orderIdListDelete: [order.id],
                                        isDeleting: loadDelete
                                    })
                                }}
                            >
                                <Trash2 size={16} />
                            </button>                        </div>

                    </div>            
                </div>
                <div className="flex-1 min-w-0 w-full">
                    <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="font-medium text-sm text-gray-900 dark:text-gray-200 line-clamp-2">
                        {order.orderNumber}
                    </h4>
                    {/* <GripVertical className="w-3.5 h-3.5 text-gray-300 cursor-move flex-shrink-0" /> */}
                    </div>

                    <div className="flex items-center gap-2 mb-2">
       

                        <RefBadge
                            className="flex-1 origin-left"
                            refType="status"
                            refId={order.statusId}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 my-4">
                        <div className="grid gap-2">


                            <div className='flex items-center gap-2'>
                                <Truck
                                    size={14}
                                />
                                <span className="text-gray-400">
                                Estimated Arrival:
                                </span>{' '}
                                {new Date(order.estimatedArrival).toLocaleDateString()}
                            </div>
                        </div>
                        {/* <div
                        >
                            Value: ${order.value}
                        </div> */}

                    </div>

                    <div>

                        {order.notes && (
                        <p className="w-full break-words whitespace-pre-wrap text-xs text-gray-600 bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700 p-2 rounded border border-gray-100 ">
                            {order.notes}
                        </p>
                        )}
                    </div>

                </div>
            </div>
        </div>
    )
}