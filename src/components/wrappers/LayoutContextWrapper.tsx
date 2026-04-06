'use client'

import { useOrdersContext } from "@/context/OrdersContext"

import ErrorBanner from "@/components/errors/ErrorBanner"
import { AnimatePresence } from "framer-motion"
import { OrderId } from "@/types/orders/order-types"
import { WarnDeleteModal } from "../modals/WarnDeleteModal"
import ManufacturerOrderModal from "@/components/orders/manufacturerOrder/ManufacturerOrderModal"
import EditReferencesDrawer from "../drawers/references/EditReferencesDrawer"
import HistoryDrawer from "../drawers/history/HistoryDrawer"
import DmrOrderModal from "../orders/dmrOrder/DmrOrderModal"
import ClientOrderModal from "../orders/clientOrder/ClientOrderModal"
import LinkClientOrderModal from "../orders/clientOrder/LinkClientOrderModal"

// This exists to simply wrap context around components meant to exist in the Orders layout

export default function LayoutContextWrapper () {
    const { 
        isDrawerOpen, setIsDrawerOpen,
        drawerTab,
        setIsHistoryDrawerOpen,
        clientOrderModalOptions, handleUnshowClientOrderModal,
        dmrOrderModalOptions,handleUnshowDmrOrderModal,
        manufacturerOrderModalOptions, handleUnshowManufacturerOrderModal,
        deleteOrderModalOptions,  setDeleteOrderModalOptions,
        masterClientOrders, masterDmrOrders,masterManufacturerOrders,

    } = useOrdersContext()

    return (
        <div>
            <EditReferencesDrawer
                isOpen={isDrawerOpen}
                initialTab={drawerTab}
                onClose={() => setIsDrawerOpen(false)}

            />
            <ClientOrderModal
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
            
            <ManufacturerOrderModal
                isOpen={manufacturerOrderModalOptions.visible}
                onClose={handleUnshowManufacturerOrderModal}
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
                tableName={deleteOrderModalOptions.tableName}
                isDeleting={deleteOrderModalOptions.isDeleting}
            />
        </div>
    )
}