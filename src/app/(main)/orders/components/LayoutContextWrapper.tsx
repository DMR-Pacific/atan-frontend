'use client'

import { useOrdersContext } from "@/context/OrdersContext"
import HistoryDrawer from "./historyDrawer/HistoryDrawer"
import EditReferencesDrawer from "./referencesDrawer/EditReferencesDrawer"
import AddClientOrderModal from "./ClientOrders/ClientOrderModal"
import DmrOrderModal from "../dmr/components/DmrOrderModal"
import ErrorBanner from "@/components/errors/ErrorBanner"
import { AnimatePresence } from "framer-motion"
import { SelectedRowToolbar } from "./SelectedRowToolbar"
import LinkClientOrderModal from "./ClientOrders/LinkClientOrderModal"
import { OrderId } from "@/types/orders/order-types"
import { WarnDeleteModal } from "./WarnDeleteModal"

// This exists to simply wrap context around components meant to exist in the Orders layout

export default function LayoutContextWrapper () {
    const { 
        isDrawerOpen, setIsDrawerOpen,
        drawerTab,
        setIsHistoryDrawerOpen,
        clientOrderModalOptions, handleUnshowClientOrderModal,
        dmrOrderModalOptions,handleUnshowDmrOrderModal,
        deleteOrderModalOptions,  setDeleteOrderModalOptions,
        masterClientOrders, masterDmrOrders,

    } = useOrdersContext()

    return (
        <div>
            <EditReferencesDrawer
                isOpen={isDrawerOpen}
                initialTab={drawerTab}
                onClose={() => setIsDrawerOpen(false)}

            />
            <AddClientOrderModal
                isOpen={clientOrderModalOptions.visible}
                onClose={handleUnshowClientOrderModal}
            />

            <HistoryDrawer
                onClose={() => setIsHistoryDrawerOpen(false)}

            />

            <DmrOrderModal
                isOpen={dmrOrderModalOptions.visible}
                onClose={handleUnshowDmrOrderModal}
            />
            
            <LinkClientOrderModal />

            <WarnDeleteModal 
                onClose={() => {
                    setDeleteOrderModalOptions({
                        visible: false,
                        orderIdListDelete: [],
                        onSubmit: () => {},
                        tableName: "client_orders",
                        isDeleting: false,
                    })

                }}
                visible={deleteOrderModalOptions.visible}
                orderIds={deleteOrderModalOptions.orderIdListDelete}
                onSubmit={deleteOrderModalOptions.onSubmit}
                getOrderDetails={(id: OrderId) => {
                    if (deleteOrderModalOptions.tableName == "client_orders")
                    return masterClientOrders[id]
                    else if (deleteOrderModalOptions.tableName == "dmr_orders") 
                    return masterDmrOrders[id]

                }}
                isDeleting={deleteOrderModalOptions.isDeleting}
            />
        </div>
    )
}