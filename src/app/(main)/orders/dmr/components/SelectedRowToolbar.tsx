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
import { Button } from "@/components/ui/button"


import { updateClientOrderRefColumnsByIdList } from '@/services/OrderService'
import { toast } from 'sonner'
import { doUnlinkClientOrderDmrOrder } from '@/utils/dmrOrders/doUnlinkClientOrderDmrOrder'
import { useDmrOrdersTableContext } from '@/context/DmrOrdersTableContext'
import { useOrdersContext } from '@/context/OrdersContext'
interface SelectedRowToolbarProps {

}
export function SelectedRowToolbar({

}: SelectedRowToolbarProps) {
    const { 
        selectedDmrRows, 
        selectedClientRows, 
        doDeleteClientOrderList, 
        doDeleteDmrOrderList,
        fetchDmrOrders,
        setSelectedDmrRows,
        setSelectedClientRows,
        
    } = useDmrOrdersTableContext()
    
    const { setDeleteOrderModalOptions } = useOrdersContext()
    const [loadDelete, setLoadDelete] = useState<boolean>(false)
    const onClose = () => {
        setSelectedClientRows([])
        setSelectedDmrRows([])

        return 
    }

    const handleDelete = () => {
        setLoadDelete(true)
        if (selectedClientRows.length > 0 && selectedDmrRows.length > 0 ) {
            toast.error('Please do not select client and DMR orders together.')
        } else if (selectedClientRows.length > 0) {
            doDeleteClientOrderList()
        } else if (selectedDmrRows.length > 0) {
            doDeleteDmrOrderList()
        } else {
            toast.error('Please select a row to delete.')
        }


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
            className="sticky bottom-10 left-0 right-0 z-50"
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
                            isDeleting: loadDelete
                        })}}    
                    >
                        <Trash2
                            size={20}
                            className="group-hover:scale-110 transition-transform"
                        />
                        <span className="text-xs">Delete</span>
                    </button>

                  
                </div>

                {/* Right side - Close button */}
                <button
                    onClick={onClose}
                    className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                >
                    <X size={20} />
                </button>
            </div>
        </motion.div>
    )
}
