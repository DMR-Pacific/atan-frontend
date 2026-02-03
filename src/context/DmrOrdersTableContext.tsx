import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState } from "react";
import { DmrOrdersSubTableContext } from "./DmrOrdersSubTableContext";
import { toast } from "sonner";
import { deleteClientOrderList, deleteDmrOrderList } from "@/services/OrderService";
import { DmrOrderDto } from "@/types/orders/DmrOrderDto";
import { doSearchDmrOrders } from "@/utils/dmrOrders/doSearchDmrOrders";
import { SortByType } from "@/types/api/SortByType";
import { SortDirectionType } from "@/types/api/SortDirectionType";
import { ViewMode } from "@/types/ViewMode";
import { useOrdersContext } from "./OrdersContext";
import { OrderId } from "@/types/orders/order-types";

export interface DmrOrdersTableContext {

    dmrOrderIds: OrderId[]

    viewMode: ViewMode,
    setViewMode: React.Dispatch<React.SetStateAction<ViewMode>>
    sortBy: SortByType
    setSortBy: React.Dispatch<React.SetStateAction<SortByType>>
    sortDirection: SortDirectionType
    setSortDirection: React.Dispatch<React.SetStateAction<SortDirectionType>>

    idForHistory: number | null
    setIdForHistory: React.Dispatch<React.SetStateAction<number | null>>

    searchValue: string
    setSearchValue: Dispatch<SetStateAction<string>>

    searchLoading: boolean
    setSearchLoading: Dispatch<SetStateAction<boolean>>

    selectedClientRows: any[]
    setSelectedClientRows: React.Dispatch<React.SetStateAction<any[]>>
    selectedDmrRows: any[]
    setSelectedDmrRows: React.Dispatch<React.SetStateAction<any[]>>

    doDeleteClientOrderList: () => void
    doDeleteDmrOrderList: () => void

    fetchDmrOrders: () => {}

    handleOrderCheck: (dmrOrderId: number) => void
    
}

export const DmrOrdersTableContext = createContext<DmrOrdersTableContext | undefined>(undefined)

export const useDmrOrdersTableContext = () => {
    const context = useContext(DmrOrdersTableContext)

    if(!context) {
        toast.error("useDmrOrdersTableContext must be used within DmrOrdersTableContext.Provider")
        throw new Error("useDmrOrdersSubTableContext must be used within DmrOrdersSubTableContext.Provider")
    }
    return context
}

export const DmrOrdersTableContextProvider =({children} : {children: ReactNode}) => {
    const { masterDmrOrders, addDmrDtosToMaster } = useOrdersContext()

    const [dmrOrderIds, setDmrOrderIds] = useState<OrderId[]>([])
    
    const [viewMode, setViewMode] = useState<ViewMode>('rows')
    const [sortBy, setSortBy] = useState<SortByType>("createdAt") 
    const [sortDirection, setSortDirection] = useState<SortDirectionType>("desc") 
        
    
    const [searchValue, setSearchValue] = useState<string>("")
    const [searchLoading, setSearchLoading] = useState<boolean>(false)

    const [idForHistory, setIdForHistory] = useState<number | null>(null)
    
    const [selectedClientRows, setSelectedClientRows] = useState<any[]>([])
    const [selectedDmrRows, setSelectedDmrRows] = useState<any[]>([])

    useEffect(() => {
        const debounce = setTimeout(fetchDmrOrders, 500)
    return () => clearTimeout(debounce)
    }, [searchValue])

    useEffect(() => {
        fetchDmrOrders()
    }, [sortBy, sortDirection])

    
    const fetchDmrOrders = async () => {
        const tempOrders = await doSearchDmrOrders(searchValue, sortBy, sortDirection)
        
        if (tempOrders) {
            setDmrOrderIds(tempOrders.map(order => order.id))
            addDmrDtosToMaster(tempOrders, true, true)
        }
        setSearchLoading(false)
    }

    const doDeleteClientOrderList = async ( ) => {
        try {
            const response = await deleteClientOrderList(selectedClientRows)
            toast.success(`Deleted client orders (${selectedClientRows.length}) successfully.`)
            // doGetAllOrdersByGroup()
            setSelectedClientRows([])
        } catch (err) {
            toast.error(`Failed to delete client orders (${selectedClientRows.length}). Please try again later.`)
            console.log(err)
            // setShowErrorModal(true)
        }
    }

    const doDeleteDmrOrderList = async () => {
        try {
            const response = await deleteDmrOrderList(selectedDmrRows)
            toast.success(`Deleted DMR orders (${selectedDmrRows.length}) successfully.`)
            fetchDmrOrders()
            setSelectedDmrRows([])
            
        } catch (err) {
            toast.error(`Failed to delete DMR orders (${selectedDmrRows.length}). Please try again later.`)
            console.log(err)
            
        }
    }

    const handleOrderCheck = (dmrOrderId: number) => {
      setSelectedDmrRows(prev => prev.includes(dmrOrderId) ? prev.filter(x => x !== dmrOrderId) : [...prev, dmrOrderId])
    }

    return (
        <DmrOrdersTableContext.Provider
            value={{
                dmrOrderIds,

                viewMode, setViewMode,
                sortBy, setSortBy,
                sortDirection, setSortDirection,
    

                idForHistory, setIdForHistory,
                searchValue, setSearchValue,
                searchLoading, setSearchLoading,

                selectedClientRows, setSelectedClientRows,
                selectedDmrRows, setSelectedDmrRows,

                doDeleteClientOrderList,
                doDeleteDmrOrderList,

                fetchDmrOrders,

                handleOrderCheck
            }}
        >
            {children}
        </DmrOrdersTableContext.Provider>
    )
}