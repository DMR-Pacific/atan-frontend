import { ViewMode } from "@/types/ViewMode";
import ToggleView from "../../buttons/ToggleView";
import { useState } from "react";
import { ClientOrderHeader } from "../clientOrder/ClientOrderHeader";
import { ClientOrderRow } from "../clientOrder/ClientOrderRow";
import { useOrdersContext } from "@/context/OrdersContext";
import { OrderId } from "@/types/orders/order-types";
import ClientOrderCard from "../clientOrder/ClientOrderCard";
import { Plus } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import AddSubItemDropdown from "../../buttons/AddSubItemDropdown";
import AssociatedBadge from "../../badges/AssociatedBadge";
import { useDmrOrdersSubTableContext } from "@/context/DmrOrdersSubTableContext";
import { useDmrOrdersTableContext } from "@/context/DmrOrdersTableContext";

export interface SubClientOrdersCollapsibleProps{
    subOrderIds: OrderId[]
    parentId: number
}
export default function SubClientOrdersCollapsible ({subOrderIds, parentId} : SubClientOrdersCollapsibleProps) {
    const [viewMode, setViewMode] = useState<ViewMode>('rows')
    const { 
        masterClientOrders, 
        handleShowClientOrderModal, 
        setLinkClientModalOptions,
    } = useOrdersContext()

    const { 
        selectedClientRows,setSelectedClientRows,
        selectedDmrRows
    } = useDmrOrdersTableContext()
    return (
        <div >
      

                <div className="mb-3 flex items-center justify-between gap-2 text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                    <div className="flex items-center  gap-2">

                        <ToggleView
                            viewMode={viewMode}
                            onToggle={() => setViewMode(viewMode == 'rows' ? 'cards' : 'rows')}
                        />

  
                    </div>

                    <AddSubItemDropdown
                        onNew={() => {handleShowClientOrderModal('add-link', undefined, parentId)}}
                        onExisting={() => {setLinkClientModalOptions({
                            visible: true,
                            linkToOrderId: parentId,
                            onSubmit: () => {}
                        })}}
                    />

                        
                </div>

                {subOrderIds.length == 0 ?
                (
                    <div className="w-full text-gray-400 flex items-center text-center">
                        No associations yet.
                    </div>
                )
                :
                (
                    <div>
                        {viewMode == 'cards' && 
                        <div className="grid gap-3 grid-cols-1 lg:grid-cols-2">
                            {subOrderIds.map((clientOrderId) => (
                                <ClientOrderCard
                                    key={`client-${clientOrderId}`}
                                    order={masterClientOrders[clientOrderId]}
                                />

                            ))}
                        </div>}
                        {viewMode == 'rows' && 
                        <div className="  dark:border-gray-700 dark:border">
                            <ClientOrderHeader />
                            {subOrderIds.map((clientOrderId) => (
                                <ClientOrderRow
                                    checked={selectedClientRows.includes(clientOrderId)}
                                    isSelectDisabled={selectedDmrRows.length > 0}
                                    handleOrderCheck={(clientOrderId: number) => {
                                        setSelectedClientRows(prev => prev.includes(clientOrderId) ? prev.filter(x => x !== clientOrderId) : [...prev, clientOrderId])
                                    }}
                                    key={`client-${clientOrderId}`}
                                    order={masterClientOrders[clientOrderId]}
                                    expandable={false}
                                />

                            ))}
                        </div>}
                    </div>

                )}

        </div>
    )
}