import { DmrOrderDto } from "@/types/orders/DmrOrderTypes";
import { Calendar, Pencil, Square, Truck, Unlink } from "lucide-react";
import { RefBadge } from "@/components/badges/RefBadge";
import { useOrdersContext } from "@/context/OrdersContext";
import { OwnerStack } from "@/components/badges/OwnerStack";
import { DmrOrderMaster } from "@/types/orders/DmrOrderTypes";
import { useAuth } from "@/context/AuthContext";

interface DmrOrderCardProps {
  order: DmrOrderMaster;
  handleOrderCheck: (orderId: number) => void;
  isSelectDisabled: boolean;
  warnUnlink?: (orderId: number) => void;
  showChildren: boolean;
}

export default function DmrOrderCard({
  order,
  handleOrderCheck,
  isSelectDisabled,
  warnUnlink,
  showChildren,
}: DmrOrderCardProps) {
  const { handleShowDmrOrderModal } = useOrdersContext();
  const { hasPermission } = useAuth();

  const isEditAllowed = hasPermission("dmrOrders", "edit");
  const isViewAllowed = hasPermission("dmrOrders", "view");

  return (
    <div
      className="group cursor-pointer rounded-lg border border-gray-200 p-3 transition-all hover:border-blue-300 hover:shadow-sm dark:border-gray-700"
      onClick={() => {
        if (isEditAllowed) handleShowDmrOrderModal("edit", order.id);
        else if (isViewAllowed) handleShowDmrOrderModal("view", order.id);
        else console.error("Opening DMR Order Modal with no permissions");
      }}
    >
      <div className="flex flex-col items-start gap-3">
        {isEditAllowed && (
          <div className="w-full border-b border-gray-200 pt-0.5 pb-4 dark:border-gray-700">
            <div className="flex h-full items-center justify-between gap-2 border-r border-gray-100">
              <div className="flex gap-2">
                <input
                  onChange={(e) => {
                    e.stopPropagation();
                    handleOrderCheck(order.id);
                  }}
                  disabled={isSelectDisabled}
                  type="checkbox"
                  className="h-4 w-4 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <button
                  type="button"
                  className="transition-colors hover:text-blue-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShowDmrOrderModal("edit", order.id);
                  }}
                >
                  <Pencil size={16} />
                </button>
              </div>

              {warnUnlink && (
                <button
                  onClick={() => warnUnlink(order.id)}
                  className="transition-colors hover:text-red-600"
                >
                  <Unlink size={16} />
                </button>
              )}
            </div>
          </div>
        )}
        <div className="w-full min-w-0 flex-1">
          <div className="mb-2 flex items-start justify-between gap-2">
            <h4 className="line-clamp-2 text-sm font-medium text-gray-900 dark:text-gray-200">
              {order.label}
            </h4>
            {/* <GripVertical className="w-3.5 h-3.5 text-gray-300 cursor-move flex-shrink-0" /> */}
          </div>

          <div className="mb-2 flex items-center gap-2">
            <RefBadge
              className="flex-1 origin-left"
              refType="status"
              refId={order.statusId}
            />
          </div>
          <div className="flex-shrink-0">
            <OwnerStack
              owners={order.assignedUsers.map((u) => ({
                initials: u.firstName.charAt(0) + u.lastName.charAt(0),
                color: "blue",
              }))}
            />
          </div>
          <div className="my-4 grid grid-cols-2 gap-2 text-xs text-gray-500">
            <div className="grid gap-2">
              <div className="flex items-center gap-2">
                <Calendar size={14} />
                <span className="text-gray-400">Order Date:</span>{" "}
                {order.orderDate}
              </div>
              <div className="flex items-center gap-2">
                <Truck size={14} />
                <span className="text-gray-400">Estimated Arrival:</span>{" "}
                {order.estimatedArrival}
              </div>
            </div>
            <div>Value: ${order.value}</div>
          </div>

          {order.notes && (
            <p className="w-full rounded border border-gray-100 bg-gray-50 p-2 text-xs break-words whitespace-pre-wrap text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
              {order.notes}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
