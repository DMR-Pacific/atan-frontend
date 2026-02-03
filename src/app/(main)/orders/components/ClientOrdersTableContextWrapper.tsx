import ErrorBanner from "@/components/errors/ErrorBanner";
import { useClientOrdersTableContext } from "@/context/ClientOrdersTableContext";
import { useOrdersContext } from "@/context/OrdersContext";
import DeleteErrorModal from "./errors/DeleteErrorModal";
import { AnimatePresence } from "framer-motion";
import { SelectedRowToolbar } from "./SelectedRowToolbar";

export default function ClientOrdersTableContextWrapper () {
    const {
        tableErrors,
        selectedClientRows,
        selectedDmrRows,
        doDeleteClientOrderList
    } = useClientOrdersTableContext()


    const {
        showErrorModal, setShowErrorModal
    } = useOrdersContext()
    
    return ( 
        <div>
            
            {Object.keys(tableErrors).length > 0 &&
            <ErrorBanner
                message="There was an error fetching orders. Please try again later."
                onDismiss={() => {}}
            />}

            {showErrorModal &&
            <DeleteErrorModal
                count={selectedClientRows.length}
                onClose={() => setShowErrorModal(false)}
                onRetry={() => {
                    setShowErrorModal(false)
                    doDeleteClientOrderList()
                }}
            />}

            <AnimatePresence>
              {(selectedClientRows.length > 0 || selectedDmrRows.length > 0) && (
                <SelectedRowToolbar
      
                />
              )}
            </AnimatePresence>
        </div>
    )
}