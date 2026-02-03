'use client'
import { DmrOrdersTableContextProvider } from "@/context/DmrOrdersTableContext";
import { ReactNode } from "react";

export default function Layout ({children} : {children: ReactNode}) {
    return (
        <DmrOrdersTableContextProvider>
            {children}
        </DmrOrdersTableContextProvider>
    )
}