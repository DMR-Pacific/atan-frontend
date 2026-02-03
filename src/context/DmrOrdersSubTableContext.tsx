import { BaseReferenceType } from "@/types/BaseReferenceType";
import { DmrOrderDto } from "@/types/orders/DmrOrderDto";
import { OrderId } from "@/types/orders/order-types";
import { createContext, Dispatch, SetStateAction, useContext } from "react";

export interface DmrOrdersSubTableContext {
    subDmrOrderIds: OrderId[]
    fetchDmrOrdersByClientOrderId: () => void
    handleOrderCheck: (dmrOrderId: number) => void  // handles check state of dmr orders
    
    warnUnlink: (dmrOrderId: number) => void
    handleUnlink: (dmrOrderId: number, clientOrderId: number) => void // function that unlinks all selected dmr orders from client order
    unlinkOrderId: number | null
    setUnlinkOrderId: Dispatch<SetStateAction<number | null>>
    
    isSelectDisabled: boolean
    setIsSelectDisabled: Dispatch<SetStateAction<boolean>>

    doCreateDmrOrderForClientOrder:  (orderId: number) => void
}

export const DmrOrdersSubTableContext = createContext<DmrOrdersSubTableContext | undefined>(undefined)

export const useDmrOrdersSubTableContext = () => {
    
    const context = useContext(DmrOrdersSubTableContext)

    if(!context) throw new Error("useDmrOrdersSubTableContext must be used within DmrOrdersSubTableContext.Provider")

    return context
}