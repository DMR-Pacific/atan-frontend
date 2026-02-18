import { FolderPlus, GripVertical, LayoutGrid, List, Plus, PlusCircle, Square } from "lucide-react"
import DmrOrdersSubTable from "../DmrOrders/DmrOrdersSubTable"
import { useEffect, useState } from "react"
import { createDmrOrderForClientOrder, getDmrOrdersByClientOrderId } from "@/services/OrderService"
import { toast } from "sonner"
import { useClientOrderRowContext } from "@/context/ClientOrderRowContext"
import { DmrOrdersSubTableContext, useDmrOrdersSubTableContext } from "@/context/DmrOrdersSubTableContext"
import { DmrOrderDto } from "@/types/orders/DmrOrderDto"
import DmrOrderCard from "../../dmr/components/DmrOrderCard"
import { useOrdersContext } from "@/context/OrdersContext"
import UnlinkDmrOrderModal from "../DmrOrders/UnlinkDmrOrderModal"
import { unlink } from "fs"
import ToggleView from "../ToggleView"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"
import AddDmrOrdersMenu from "../DmrOrders/LinkDmrOrderModal"
import { useClientOrderGroupContext } from "@/context/ClientOrderGroupContext"
import { doUnlinkClientOrderDmrOrder } from "@/utils/dmrOrders/doUnlinkClientOrderDmrOrder"
import { OrderId } from "@/types/orders/order-types"
import AddSubItemDropdown from "../AddSubItemDropdown"
import { useClientOrdersTableContext } from "@/context/ClientOrdersTableContext"
import AssociatedBadge from "../AssociatedBadge"

export default function ClientRowCollapsible () {
    const [subDmrOrderIds, setSubDmrOrderIds] = useState<OrderId[]>([])
    const [showUnlinkModal, setShowUnlinkModal] = useState<boolean>(false)
    const [unlinkOrderId, setUnlinkOrderId] = useState<number | null>(null)
    const [isSelectDisabled, setIsSelectDisabled] = useState<boolean>(false) 
    const [viewMode, setViewMode] = useState<'cards' | 'rows'>('rows')


    const { order: clientOrder} = useClientOrderRowContext()
    const {group} = useClientOrderGroupContext()
    const { masterDmrOrders, addDmrDtosToMaster, setLinkDmrModalOptions } = useOrdersContext()
    const { setSelectedDmrRows, selectedClientRows } = useClientOrdersTableContext()

    useEffect(() => {
    fetchDmrOrdersByClientOrderId()
    
    }, [clientOrder])

    // Disabled subtable from selecting if there are selected client rows
    useEffect(() => {
        if (selectedClientRows.length > 0) setIsSelectDisabled(true)
        else setIsSelectDisabled(false)
    }, [selectedClientRows])


    const toggleSubtableView = () => {
        if (viewMode == 'cards') setViewMode('rows')
        else setViewMode('cards')
    }

    const fetchDmrOrdersByClientOrderId = async () => {
        try {
            const response = await getDmrOrdersByClientOrderId(clientOrder.id)

            addDmrDtosToMaster(response.data, true, true)
            setSubDmrOrderIds(response.data.map((order: DmrOrderDto) => order.id))

        } catch (err) {
            toast.error(`Failed to fetch DMR orders for client order ${clientOrder.id}`)
            console.log(err)
        }
    }

    const handleOrderCheck = (dmrOrderId: number) => {
      setSelectedDmrRows(prev => prev.includes(dmrOrderId) ? prev.filter(x => x !== dmrOrderId) : [...prev, dmrOrderId])
    }

    const handleUnlink = async (dmrOrderId: number, clientOrderId: number) => {
        // remove from selected rows if it exists 
        setSelectedDmrRows(prev => prev.includes(dmrOrderId) ? prev.filter(x => x !== dmrOrderId) : prev)

        const response = await doUnlinkClientOrderDmrOrder(clientOrderId, dmrOrderId)
        if (response) {fetchDmrOrdersByClientOrderId()}
        setUnlinkOrderId(null)
    }

    const warnUnlink = (dmrOrderId: number) => {
        setShowUnlinkModal(true)
        setUnlinkOrderId(dmrOrderId)
    }

    const doCreateDmrOrderForClientOrder = async (orderId: number) => {
        try {
            const response = await createDmrOrderForClientOrder(orderId)

            const dmrOrderDto: DmrOrderDto = response.data
            fetchDmrOrdersByClientOrderId()
        } catch (err) {
            toast.error('Failed to add a dmr order. Please try again later')

            console.log(err)
        }
    }
    
    return (
        <DmrOrdersSubTableContext.Provider
            value={{
                fetchDmrOrdersByClientOrderId,
                subDmrOrderIds,
                handleOrderCheck,
                warnUnlink,
                handleUnlink,
                isSelectDisabled, setIsSelectDisabled,
                unlinkOrderId, setUnlinkOrderId,
                doCreateDmrOrderForClientOrder
            }}
        >
            {showUnlinkModal &&
            <UnlinkDmrOrderModal 
                onClose={() => setShowUnlinkModal(false)}
                onUnlink={() => {
                    if (unlinkOrderId) handleUnlink(unlinkOrderId, clientOrder.id)
                }}
            />}
            <AddDmrOrdersMenu />

            <div className='bg-gray-50/50 group grid grid-cols-[40px_1fr] border-b-3 border-gray-200 dark:bg-gray-600 dark:border-gray-700'>
                <div className="w-10 flex-shrink-0 border-r border-gray-100 relative dark:border-gray-700">
                    <div 
                        style={{backgroundColor: group?.color}}
                        className="h-full absolute top-0 bottom-4 left-1/2 w-[2px] bg-gray-200 opacity-30 -translate-x-1/2 rounded-b-full"
                    />
                </div>

                <div className='p-4'>
                    <div className='border rounded  border-gray-200 dark:border-gray-700 '>

                        {/* Subheader */}
                        <div className=" bg-gray-100 px-4 py-2 border-b border-gray-200 dark:bg-gray-700 dark:border-gray-700 flex items-center justify-between gap-4">
                                <div className='flex items-center gap-4'>
                                    <ToggleView
                                        viewMode={viewMode}
                                        onToggle={toggleSubtableView}

                                        />

                                    <AssociatedBadge
                                        associations={subDmrOrderIds.length}
                                        type={"client_orders"}
                                    />
                                </div>
                                <div className='flex gap-2'>
                                    <AddSubItemDropdown
                                        onNew={() => doCreateDmrOrderForClientOrder(clientOrder.id)}
                                        onExisting={() => { 
                                            setLinkDmrModalOptions({
                                                visible: true, 
                                                linkToOrderId: clientOrder.id, 
                                                onSubmit: () => fetchDmrOrdersByClientOrderId()
                                            })
                                  
                                        }}
                                    />
                                </div>

                        </div>

                        {/* Dmr Orders Table */}
                        {viewMode == 'rows' &&
                        <DmrOrdersSubTable />}

                        {viewMode == 'cards' &&
                        <div className="p-4 bg-white dark:bg-gray-900 dark:border-gray-700">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {subDmrOrderIds.map((orderId) => (
                                <DmrOrderCard
                                    key={`dmr-${orderId}`}
                                    order={masterDmrOrders[orderId]}
                                    handleOrderCheck={handleOrderCheck}
                                    isSelectDisabled={isSelectDisabled}
                                    warnUnlink={warnUnlink}
                                    showChildren={false}
                                />
                                ))}
                            </div>


                        </div>}
                    </div>

                </div>


            </div>
        </DmrOrdersSubTableContext.Provider>

    )
}