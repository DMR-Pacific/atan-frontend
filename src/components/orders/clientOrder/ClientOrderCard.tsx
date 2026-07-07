import { ClientOrderDto } from "@/types/orders/ClientOrderTypes";
import { Clock, DollarSign } from "lucide-react";
import { RefBadge } from "../../badges/RefBadge";
import { ClientOrderMaster } from "@/types/orders/ClientOrderTypes";
import { useOrdersContext } from "@/context/OrdersContext";
import { OwnerStack } from "../../badges/OwnerStack";
import { useAuth } from "@/context/AuthContext";

interface ClientORderCardProps {
  order: ClientOrderMaster;
  isClickable: boolean;
}

export default function ClientOrderCard({
  order,
  isClickable,
}: ClientORderCardProps) {
  const { handleShowClientOrderModal } = useOrdersContext();
  const { hasPermission } = useAuth();

  const isEditAllowed = hasPermission("clientOrders", "edit");
  const isViewAllowed = hasPermission("clientOrders", "view");

  if (!order) return <div>NULL_ORDER</div>;
  return (
    <div
      className={`flex ${isClickable && "cursor-pointer"} flex-col gap-3 rounded-md border border-gray-200 bg-white p-4 shadow-sm transition-colors hover:border-indigo-200 dark:border-gray-700 dark:bg-gray-900`}
      onClick={() => {
        if (!isClickable) return;

        if (isEditAllowed) handleShowClientOrderModal("edit", order.id);
        else if (isViewAllowed) handleShowClientOrderModal("view", order.id);
        else console.error("Opening Client Order Modal with no permissions");

      }}
    >
      <div className="flex items-start justify-between">
        <div>
          <span className="mb-1 block text-sm font-medium text-gray-900 dark:text-gray-200">
            {order.label}
          </span>
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <Clock className="h-3 w-3" />
            <span>Due: {order.dueDate}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 font-medium text-gray-900 dark:text-gray-200">
          <DollarSign className="h-3.5 w-3.5 text-gray-400" />
          {order.value}
        </div>
      </div>

      <div className="h-px w-full bg-gray-100"></div>
      <OwnerStack
        owners={order.assignedUsers.map((u) => ({
          initials: u.firstName.charAt(0) + u.lastName.charAt(0),
          color: "blue",
        }))}
      />
      <div className="flex items-center gap-3">
        <div className="w-100">
          <RefBadge refType="category" refId={order.categoryId} className="" />
        </div>
        <div className="w-100">
          <RefBadge refType="status" refId={order.statusId} className="" />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="w-100">
          <RefBadge refType="priority" refId={order.priorityId} className="" />
        </div>

        <div className="w-100">
          <RefBadge
            refType="clientType"
            refId={order.clientTypeId}
            className=""
          />
        </div>
      </div>

      {order.notes && (
        <p className="w-full rounded border border-gray-100 bg-gray-50 p-2 text-xs break-words whitespace-pre-wrap text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
          {order.notes}
        </p>
      )}
    </div>
  );
}
