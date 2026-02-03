import { BaseReferenceType } from "@/types/BaseReferenceType";
import { createContext, useContext } from "react";

export interface ClientOrderGroupContext {
    group: BaseReferenceType | null | undefined
    orderGroup: {}
}

export const ClientOrderGroupContext = createContext<ClientOrderGroupContext | undefined>(undefined)

export const useClientOrderGroupContext = () => {
    
    const context = useContext(ClientOrderGroupContext)

    if(!context) throw new Error("useTableContext must be used within TableContext.Provider")

    return context
}