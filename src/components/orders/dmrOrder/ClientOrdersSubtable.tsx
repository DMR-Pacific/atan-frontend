import { ViewMode } from "@/types/ViewMode";
import ToggleView from "../../buttons/ToggleView";
import { useState } from "react";
import { ClientOrderHeader } from "../clientOrder/ClientOrderHeader";
import { ClientOrderRow } from "../clientOrder/ClientOrderRow";
import { useOrdersContext } from "@/context/OrdersContext";
import { OrderId } from "@/types/orders/order-types";
import ClientOrderCard from "../clientOrder/ClientOrderCard";
import { Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import AddSubItemDropdown from "../../buttons/AddSubItemDropdown";
import AssociatedBadge from "../../badges/AssociatedBadge";
import { useDmrOrdersSubTableContext } from "@/context/DmrOrdersSubTableContext";
import { useDmrOrdersTableContext } from "@/context/DmrOrdersTableContext";
import { useAuth } from "@/context/AuthContext";

export interface ClientOrdersSubtableProps {
  subOrderIds: OrderId[];
  parentId: number;
}
export default function ClientOrdersSubtable({
  subOrderIds,
  parentId,
}: ClientOrdersSubtableProps) {
  const { hasPermission } = useAuth();
  const [viewMode, setViewMode] = useState<ViewMode>("rows");
  const {
    masterClientOrders,
    handleShowClientOrderModal,
    setLinkClientModalOptions,
  } = useOrdersContext();

  const { selectedClientRows, setSelectedClientRows, selectedDmrRows } =
    useDmrOrdersTableContext();

  const showAddButton = hasPermission("clientOrders", "add");
  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-2 text-xs font-semibold tracking-wider text-indigo-600 uppercase">
        <div className="flex items-center gap-2">
          <ToggleView
            viewMode={viewMode}
            onToggle={() => setViewMode(viewMode == "rows" ? "cards" : "rows")}
          />
        </div>

        {showAddButton && (
          <AddSubItemDropdown
            onNew={() => {
              handleShowClientOrderModal("add-link", undefined, parentId);
            }}
            onExisting={() => {
              setLinkClientModalOptions({
                visible: true,
                linkToOrderId: parentId,
                onSubmit: () => {},
              });
            }}
          />
        )}
      </div>

      {subOrderIds.length == 0 ? (
        <div className="flex w-full items-center text-center text-gray-400">
          No associations yet.
        </div>
      ) : (
        <div>
          {viewMode == "cards" && (
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
              {subOrderIds.map((clientOrderId) => (
                <ClientOrderCard
                  key={`client-${clientOrderId}`}
                  order={masterClientOrders[clientOrderId]}
                  isClickable={true}
                />
              ))}
            </div>
          )}
          {viewMode == "rows" && (
            <div className="dark:border dark:border-gray-700">
              <ClientOrderHeader />
              {subOrderIds.map((clientOrderId) => (
                <ClientOrderRow
                  checked={selectedClientRows.includes(clientOrderId)}
                  isSelectDisabled={selectedDmrRows.length > 0}
                  handleOrderCheck={(clientOrderId: number) => {
                    setSelectedClientRows((prev) =>
                      prev.includes(clientOrderId)
                        ? prev.filter((x) => x !== clientOrderId)
                        : [...prev, clientOrderId],
                    );
                  }}
                  key={`client-${clientOrderId}`}
                  order={masterClientOrders[clientOrderId]}
                  expandable={false}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
