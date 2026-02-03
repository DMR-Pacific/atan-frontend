import { OrdersContextProvider } from "@/context/OrdersContext";
import { ReactNode } from "react";
import HistoryDrawer from "./components/historyDrawer/HistoryDrawer";
import LayoutContextWrapper from "./components/LayoutContextWrapper";

export default function Layout ({children} : {children: ReactNode}) {
    return (
                <OrdersContextProvider>
                    <LayoutContextWrapper />
            
                    {children}
                </OrdersContextProvider>
        
    )
}