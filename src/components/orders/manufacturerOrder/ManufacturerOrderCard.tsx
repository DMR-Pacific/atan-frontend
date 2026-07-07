import { RefBadge } from "@/components/badges/RefBadge";
import { useAuth } from "@/context/AuthContext";
import { useOrdersContext } from "@/context/OrdersContext";
import { ManufacturerOrderMaster } from "@/types/orders/ManufacturerOrderTypes";
import { Pencil, Trash2, Truck } from "lucide-react";
import { useState } from "react";

interface ManufacturerOrderCarddProps {
  order: ManufacturerOrderMaster;
}

export default function ManufacturerOrderCard({
  order,
}: ManufacturerOrderCarddProps) {
  const { hasPermission } = useAuth();
  const {
    handleShowManufacturerOrderModal,
    doDeleteManufacturerOrder,
    setDeleteOrderModalOptions,
  } = useOrdersContext();
  const [loadDelete, setLoadDelete] = useState<boolean>(false);

  const handleDelete = () => {
    setLoadDelete(true);
    doDeleteManufacturerOrder(order.id);

    // hide modal upon deletion
    setDeleteOrderModalOptions({
      visible: false,
      orderIdListDelete: [],
      onSubmit: () => {},
      tableName: "client_orders",
      isDeleting: false,
    });
    setLoadDelete(false);
  };

  if (!order) return null;

  const isViewAllowed = hasPermission("manufacturerOrders", "view");
  const isEditAllowed = hasPermission("manufacturerOrders", "edit");
  const isDeleteAllowed = hasPermission("manufacturerOrders", "delete");

  return (
    <div
      className="group cursor-pointer rounded-lg border border-gray-200 p-3 transition-all hover:border-blue-300 hover:shadow-sm dark:border-gray-700"
      onClick={() => {
        if (isEditAllowed) handleShowManufacturerOrderModal("edit", order.id);
        else if (isViewAllowed)
          handleShowManufacturerOrderModal("view", order.id);
        else console.error("Opening DMR Order Modal with no permissions");
      }}
    >
      <div className="flex flex-col items-start gap-3">
        <div className="w-full border-b border-gray-200 pt-0.5 pb-4 dark:border-gray-700">
          <div className="flex h-full items-center justify-between gap-2 border-r border-gray-100">
            <div className="flex gap-2">
              {isEditAllowed && (
                <button
                  type="button"
                  className="transition-colors hover:text-blue-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShowManufacturerOrderModal("edit", order.id);
                  }}
                >
                  <Pencil size={16} />
                </button>
              )}
              {isDeleteAllowed && (
                <button
                  type="button"
                  className="transition-colors hover:text-red-600"
                  onClick={(e) => {
                    e.stopPropagation();

                    setDeleteOrderModalOptions({
                      visible: true,
                      onSubmit: handleDelete,
                      tableName: "manufacturer_orders",
                      orderIdListDelete: [order.id],
                      isDeleting: loadDelete,
                    });
                  }}
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="w-full min-w-0 flex-1">
          <div className="mb-2 flex items-start justify-between gap-2">
            <h4 className="line-clamp-2 text-sm font-medium text-gray-900 dark:text-gray-200">
              {order.orderNumber}
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

          <div className="my-4 grid grid-cols-2 gap-2 text-xs text-gray-500">
            <div className="grid gap-2">
              <div className="flex items-center gap-2">
                <Truck size={14} />
                <span className="text-gray-400">Estimated Arrival:</span>{" "}
                {new Date(order.estimatedArrival).toLocaleDateString()}
              </div>
            </div>
            {/* <div
                        >
                            Value: ${order.value}
                        </div> */}
          </div>

          <div>
            {order.notes && (
              <p className="w-full rounded border border-gray-100 bg-gray-50 p-2 text-xs break-words whitespace-pre-wrap text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
                {order.notes}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
