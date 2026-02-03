'use client'

import Tables from "./components/Tables";
import Menu from "./components/Menu";
import { useReference } from "@/hooks/useReference";
import { useEffect, useState } from "react";
import { useOrdersContext } from "@/context/OrdersContext";
import { useAssignableUsers } from "@/hooks/useAssignableUsers";
import ErrorBanner from "@/components/errors/ErrorBanner";
import DeleteErrorModal from "./components/errors/DeleteErrorModal";
import EditReferencesDrawer from "./components/referencesDrawer/EditReferencesDrawer";
import { Toaster, toast } from "sonner";
import AddDmrOrdersMenu from "./components/DmrOrders/LinkDmrOrderModal";
import HistoryDrawer from "./components/historyDrawer/HistoryDrawer";
import { ClientOrdersTableContextProvider } from "@/context/ClientOrdersTableContext";
import ClientOrdersTableContextWrapper from "./components/ClientOrdersTableContextWrapper";
export default function MainView () {

  

    const { 
        showErrorBanner, setShowErrorBanner,
        doRefetchReferences,
    } = useOrdersContext()

    


    const handleRefetch = () => {
        setShowErrorBanner(false)
        doRefetchReferences()
        
    }

    
    return (
        <div className="relative">
            <ClientOrdersTableContextProvider>
                <ClientOrdersTableContextWrapper />




                {showErrorBanner &&
                <ErrorBanner 
                    message="Failed to fetch references. Some features may be unavailable."
                    onDismiss={() => {
                        setShowErrorBanner(false)
                    }}
                    onRetry={handleRefetch}
                />}



                <Menu />
                <Tables />

                {/* Loads classes classNames for dynamic */}
                <div className="border-l-green-600 border-l-red-600 border-l-yellow-600 border-l-purple-600 border-l-blue-600 border-l-gray-600 border-l-green-400 border-l-red-800 border-green-400"></div>
                <div className="bg-gray-100 bg-red-800 bg-blue-800 bg-green-400 bg-yellow-300 bg-gray-600 bg-purple-600 bg-yellow-600 bg-green-600 bg-red-600 bg-gray-100">
                </div>
            </ClientOrdersTableContextProvider>
        
        </div>
    )
}