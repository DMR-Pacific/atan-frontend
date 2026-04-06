import ManufacturerOrderCard from "@/components/orders/manufacturerOrder/ManufacturerOrderCard";
import { useOrdersContext } from "@/context/OrdersContext";
import { OrderId } from "@/types/orders/order-types";
import { Plus } from "lucide-react";

interface ManufacturerOrdersSubtableProps {
    manufacturerOrderIds: OrderId[]
    parentId: OrderId // DMR Order ID its attached to

}

export default function ManufacturerOrdersSubtable ({manufacturerOrderIds, parentId} : ManufacturerOrdersSubtableProps) {
    const { masterManufacturerOrders, handleShowManufacturerOrderModal  } = useOrdersContext();
    console.log(manufacturerOrderIds)

    return (
            <div className='grid grid-cols-1 md:grid-cols-2 gap-2 '>
                {manufacturerOrderIds.map((orderId, i) => (<ManufacturerOrderCard key={`mo-card-${i}`} order={masterManufacturerOrders[orderId]} />))}
            </div>
    )
}