'use client' 
import { OrdersContextProvider } from "@/context/OrdersContext";
import { ReactNode, useEffect } from "react";
import HistoryDrawer from "../../../components/drawers/history/HistoryDrawer";
import LayoutContextWrapper from "@/components/wrappers/LayoutContextWrapper";
import { redirect } from "next/navigation";

export default function Layout ({children} : {children: ReactNode}) {
        useEffect(() => {
          if (localStorage.getItem('accessToken') == '' || ( localStorage.getItem('expiration') && new Date(localStorage.getItem('expiration') as string) < new Date()) ) redirect('/signin')
        }, [])

    
    return (
        <OrdersContextProvider>
            <LayoutContextWrapper />
    
            {children}
        </OrdersContextProvider>
        
    )
}