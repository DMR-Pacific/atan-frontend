"use client";

import Menu from "@/components/orders/dmrOrder/Menu";
import DmrOrderRow from "../../../../components/orders/dmrOrder/DmrOrderRow";
import {
  DmrOrdersTableContext,
  useDmrOrdersTableContext,
} from "@/context/DmrOrdersTableContext";
import { SelectedRowToolbar } from "../../../../components/orders/dmrOrder/SelectedRowToolbar";
import DmrOrderCard from "@/components/orders/dmrOrder/DmrOrderCard";
import DmrOrdersTableHeader from "@/components/orders/dmrOrder/DmrOrdersTableHeader";
import { useOrdersContext } from "@/context/OrdersContext";
import { useAuth } from "@/context/AuthContext";

export default function DmrOrders() {
  const { masterDmrOrders } = useOrdersContext();

  const { selectedDmrRows, dmrOrderIds, viewMode, handleOrderCheck } =
    useDmrOrdersTableContext();

  const { hasPermission } = useAuth();

  const isEditAllowed = hasPermission("dmrOrders", "edit");

  return (
    <div className="relative">
      <Menu />
      <div className="mb-4">
        {viewMode == "rows" && (
          <div className="min-w-max overflow-x-scroll">
            <DmrOrdersTableHeader />
            <div>
              {dmrOrderIds.map((dmrId) => (
                <div key={`dmrRow-${dmrId}`}>
                  <DmrOrderRow
                    dmrOrderMaster={masterDmrOrders[dmrId]}
                    checked={selectedDmrRows.includes(dmrId)}
                    handleOrderCheck={handleOrderCheck}
                    isSelectDisabled={false}
                    expandable={true}
                  />
                </div>
              ))}

              {/* <AddDmrOrderRow /> */}
            </div>
          </div>
        )}
        {viewMode == "cards" && (
          <div className="grid grid-cols-3 gap-2">
            {dmrOrderIds.map((dmrId) => (
              <DmrOrderCard
                key={`dmrCard-${dmrId}`}
                order={masterDmrOrders[dmrId]}
                isSelectDisabled={false}
                handleOrderCheck={() => handleOrderCheck(dmrId)}
                showChildren={true}
              />
            ))}
          </div>
        )}
      </div>
      {selectedDmrRows.length > 0 && <SelectedRowToolbar />}
    </div>
  );
}
