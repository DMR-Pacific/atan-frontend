import { useClientOrderRowContext } from "@/context/ClientOrderRowContext"
import { useDmrOrdersSubTableContext } from "@/context/DmrOrdersSubTableContext"
import { useOrdersContext } from "@/context/OrdersContext"
import { addClientOrderUnderReference, createDmrOrderForClientOrder } from "@/services/OrderService"
import { BaseReferenceType } from "@/types/BaseReferenceType"
import { DmrOrderDto } from "@/types/orders/DmrOrderDto"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"
import { FolderPlus, Heart, PlusCircle } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import AddSubItemDropdown from "../AddSubItemDropdown"

interface AddDmrOrderRowProps {
}
export default function AddDmrOrderRow ({}: AddDmrOrderRowProps) {
    const {order: clientOrder} = useClientOrderRowContext()
    const { doCreateDmrOrderForClientOrder} = useDmrOrdersSubTableContext()
    const { setLinkDmrModalOptions } = useOrdersContext()


    return (
    <div 
        className="rounded-b-lg bg-white grid grid-cols-[60px_1fr] border-t border-gray-100 hover:bg-gray-50 transition-colors h-[40px] items-center text-sm text-gray-500"
    >
        <div className="flex justify-center items-center h-full border-r border-gray-100 bg-gray-50/30">
            <div className="w-4 h-4 border border-gray-300 rounded bg-white"></div>
        </div>
        <AddSubItemDropdown
            onNew={() => doCreateDmrOrderForClientOrder(clientOrder.id)}
            onExisting={() => {setLinkDmrModalOptions({
                visible: true,
                linkToOrderId: clientOrder.id,
                onSubmit: () => {}
            })}}
        />
    </div>
    )
}

