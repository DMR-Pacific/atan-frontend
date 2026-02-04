import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Info,
  Copy,
  Upload,
  Archive,
  Trash2,
  RefreshCw,
  ArrowRight,
  Sparkles,
  Grid3x3,
  X,
} from 'lucide-react'
import { useOrdersContext } from '@/context/OrdersContext'
import { Button } from "@/components/ui/button"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { group } from 'console'
import { updateClientOrderRefColumnsByIdList } from '@/services/OrderService'
import { toast } from 'sonner'
import { doUnlinkClientOrderDmrOrder } from '@/utils/dmrOrders/doUnlinkClientOrderDmrOrder'
import { useClientOrderGroupContext } from '@/context/ClientOrderGroupContext'
import { useClientOrdersTableContext } from '@/context/ClientOrdersTableContext'
interface SelectedRowToolbarProps {

}
export function SelectedRowToolbar({

}: SelectedRowToolbarProps) {
    const { groups, groupBy, doGetAllOrdersByGroup , selectedDmrRows, selectedClientRows,  setSelectedDmrRows, setSelectedClientRows, doDeleteClientOrderList, doDeleteDmrOrderList } = useClientOrdersTableContext()
    const { setDeleteOrderModalOptions } = useOrdersContext() 
    const onClose = () => {
        setSelectedClientRows([])
        setSelectedDmrRows([])
        return 
    }

    const [loadingDelete, setLoadingDelete] = useState<boolean>(false)

    const handleMoveClientOrdersToGroupId = async (groupId: number) => {

        const moveToGroup = groups.find(group => (group.id == groupId))
        if (!moveToGroup) toast.error(`Group with id ${groupId} does not exist`)

        try {
            const response = await updateClientOrderRefColumnsByIdList(groupBy, groupId, selectedClientRows)
            toast.success(`Orders moved to ${moveToGroup?.label}`)

            setSelectedClientRows([]) // empty selected rows

            doGetAllOrdersByGroup() // refresh all tables to update

        } catch(err) {
            toast.error(`Failed to move orders (${selectedClientRows.length}). Please try again later.`)
            console.log(err)
        }
    }

    const handleDelete = async  () => {
        if (selectedClientRows.length > 0 && selectedDmrRows.length > 0 ) {
            toast.error('Please do not select client and DMR orders together.')
        } else if (selectedClientRows.length > 0) {
            await doDeleteClientOrderList()
            doGetAllOrdersByGroup()
        } else if (selectedDmrRows.length > 0) {
            await doDeleteDmrOrderList()
            doGetAllOrdersByGroup()

        } else {
            toast.error('Please select a row to delete.')
        }

        setDeleteOrderModalOptions({
            visible: false,
            orderIdListDelete: [],
            onSubmit: () => {},
            tableName: "client_orders",
            isDeleting: false,
        })
    }
    

    return (
        <motion.div
            initial={{
                y: 100,
                opacity: 0,
            }}
            animate={{
                y: 0,
                opacity: 1,
            }}
            exit={{
                y: 100,
                opacity: 0,
            }}
            transition={{
                type: 'spring',
                damping: 25,
                stiffness: 300,
            }}
            className="fixed bottom-10 left-0 right-0 z-50"
        >
            <div 
                className="rounded-xl max-w-7xl w-lg mx-auto px-6 py-4 flex items-center justify-between bg-gray-50 border-gray-200 shadow-xl"
            
            >
                {/* Left side - Selection info */}
                <div className="flex items-center gap-3">
                    {/* <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
                        <Info size={18} />
                    </div> */}
                    {selectedClientRows.length > 0 &&
                    <span className="text-sm font-medium text-gray-900">
                        <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-blue-500 text-white text-sm font-medium me-3">
                            {selectedClientRows.length} 

                        </span>
                        <span>
                            Client po's selected
                        </span>
                    </span>}

                    {selectedDmrRows.length > 0 &&
                    <span className="text-sm font-medium text-gray-900">
                        <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-blue-500 text-white text-sm font-medium me-3">
                            {selectedDmrRows.length} 

                        </span>
                        <span>
                            DMR po's selected
                        </span>
                    </span>}
                </div>

                {/* Center - Actions */}
                <div className="flex items-center gap-6">
           
       

                    <button 
                        className="flex flex-col items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors group"
                        onClick={() => {setDeleteOrderModalOptions({
                            visible: true,
                            onSubmit: handleDelete,
                            tableName: selectedClientRows.length > 0 ? "client_orders" : "dmr_orders",
                            orderIdListDelete: selectedClientRows.length > 0 ? selectedClientRows  : selectedDmrRows,
                            isDeleting: loadingDelete
                        })}}     
                    >
                        <Trash2
                            size={20}
                            className="group-hover:scale-110 transition-transform"
                        />
                        <span className="text-xs">Delete</span>
                    </button>

                    {selectedDmrRows.length == 0 && 
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                    
                            <button className="flex flex-col items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors group">
                                <ArrowRight
                                size={20}
                                className="group-hover:scale-110 transition-transform"
                                />
                                <span className="text-xs">Move to</span>
                            </button>

                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="start">
                            <DropdownMenuLabel>Other Group Options</DropdownMenuLabel>
                            {groups.map((group, i) => (
                                <DropdownMenuItem 
                                    key={i} 
                                    className="cursor-pointer"
                                    onClick={() => {handleMoveClientOrdersToGroupId(group.id)}}
                                >
                                    {group.label}
                                </DropdownMenuItem>
                            ))}

                        </DropdownMenuContent>
                    </DropdownMenu>}
                  
                </div>

                {/* Right side - Close button */}
                <button
                    onClick={(onClose)}
                    className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                >
                    <X size={20} />
                </button>
            </div>
        </motion.div>
    )
}
