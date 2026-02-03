import { ClientOrder } from "@/types/orders/ClientOrder";
import { ClientOrderMaster } from "@/types/orders/ClientOrderMaster";
import { createContext, useContext } from "react";

export interface ClientOrderRowContext {
    order: ClientOrderMaster
}

export const ClientOrderRowContext = createContext<ClientOrderRowContext | undefined>(undefined)

export const useClientOrderRowContext = () => {
    
    const context = useContext(ClientOrderRowContext)

    if(!context) throw new Error("useClientOrderRowContext must be used within ClientOrderRowContext.Provider")

    return context
}