'use client'

import { useEffect, useState } from "react"
import { ApiRefType } from "@/types/api/ApiRefType"
import { Clock, GripVertical, Plus, RotateCcw, Trash2, X } from "lucide-react"
import { useOrdersContext } from "@/context/OrdersContext"
import { createReference, deleteReference, swapReferenceOrder, updateReference } from "@/services/ReferenceService"
import { RefUpdateDto } from "@/types/RefUpdateDto"
import { useForm } from "react-hook-form"
import { sortByOrderIndexDesc } from "@/utils/sort/sortOrderIndex"
import { toast } from "sonner"
import { getHistoryForItem } from "@/services/OrderService"
import { THistory } from "@/types/THistory"
import HistoryRow from "./HistoryRow"
import { ColumnName } from "@/types/ColumnName"
export type Color = string

export interface BaseReferenceType {
  id: string
  name: string
  color: Color
}


export interface LabelConfig {
  status: BaseReferenceType[]
  priority: BaseReferenceType[]
  client: BaseReferenceType[]
}

interface HistoryDrawerProps {

  onClose: () => void
}


export default function HistoryDrawer ({

    onClose,
}: HistoryDrawerProps) {

    const { 
        historyTableName, setHistoryTableName,
        historyDrawerTab, setHistoryDrawerTab,
        isHistoryDrawerOpen, idForHistory,
        masterClientOrders, masterDmrOrders
    } = useOrdersContext()

    const [historyEntries, setHistoryEntries] = useState([])
    
    const tabs: {
            id: ColumnName
            label: string
        }[] = [
            {
            id: 'notes',
            label: 'Notes',
            },
            // {
            // id: 'assignedTo',
            // label: 'Assigned To',
            // },
    ]




    // if (!isHistoryDrawerOpen) return null

    useEffect(() => {
        doGetHistoryByClientOrderIdColumnName()
    }, [idForHistory, historyDrawerTab, isHistoryDrawerOpen, historyTableName])

    const doGetHistoryByClientOrderIdColumnName = async () => {
        if (!idForHistory) return
        try {
            const response = await getHistoryForItem(historyTableName, historyDrawerTab, idForHistory )
            console.log("history", response)
            
            const result = response.data.map((hist: THistory) => {
                hist.newVal = JSON.parse(hist.newVal)
                hist.oldVal = JSON.parse(hist.oldVal)
                console.log(new Date(hist.tstamp))
                return hist

            })
            setHistoryEntries(result)
            console.log("history", result)

        } catch (err) {
            console.log(err)
            toast.error('Failed to fetch history.')
        }
    }

    return (
        <>
        
            {/* Backdrop */}
            {isHistoryDrawerOpen &&
            <div>

                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-75 transition-opacity"
                    onClick={onClose}
                />

                {/* Drawer */}
                <div className="fixed inset-y-0 right-0 w-[400px] bg-white shadow-2xl z-100 flex flex-col transform transition-transform duration-300 ease-in-out animate-in slide-in-from-right">
            
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">History</h2>
                            {(idForHistory) &&
                            <p className="text-sm text-gray-500 mt01">
                                {(historyTableName == "client_orders" && masterClientOrders[idForHistory]) && masterClientOrders[idForHistory].label}
                                {(historyTableName == "dmr_orders" && masterClientOrders[idForHistory]) && masterClientOrders[idForHistory].label}

                            </p>}
                        </div>

                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="flex px-6 border-b border-gray-100">
                    {tabs.map((tab) => (
                        <button
                        key={tab.id}
                        onClick={() => setHistoryDrawerTab(tab.id)}
                        className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${historyDrawerTab === tab.id ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                        >
                        {tab.label}
                        </button>
                    ))}
                    </div>



                    {/* Timeline Content */}
                    <div className="flex-1 overflow-y-auto p-6">
                    {historyEntries.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                        <Clock className="w-12 h-12 mb-3" />
                        <p className="text-sm">No history yet</p>
                        </div>
                    ) : (
                        <div className="relative">
                        {/* Timeline line */}
                        <div className="absolute left-[21px] top-8 bottom-8 w-0.5 bg-gradient-to-b from-blue-200 via-gray-200 to-transparent" />

                        <div className="space-y-6">
                            {historyEntries.map((entry, index) => {
                                console.log("ETNRY" ,entry)
                            return (
                                <HistoryRow
                                    key={index}
                                    entry={entry}
                                    index={index}
                                />
                            )
                            })}
                        </div>
                        </div>
                    )}
                    </div>

                    {/* Footer */}
                    <div className="p-6 bg-gray-50 border-t border-gray-100">
                    <p className="text-xs text-gray-500 text-center">
                    </p>
                    </div>
                </div>
            </div>}
        </>
    )
}

