import { FormProvider, useForm } from "react-hook-form";
import TextAreaCell from "../../cells/TextAreaCell";
import AssignedToCell from "../../cells/AssignedToCell";
import HoverSelect from "../../cells/HoverSelect";
import { useOrdersContext } from "@/context/OrdersContext";
import { DmrOrderDto } from "@/types/orders/DmrOrderTypes";
import { SelectCellWrapper } from "../../cells/SelectCellWrapper";
import DateCell from "../../cells/DateCell";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Building2,
  ChevronRight,
  Clock,
  DollarSign,
  History,
  PersonStanding,
  Plus,
  Unlink,
} from "lucide-react";

import { DmrOrderMaster } from "@/types/orders/DmrOrderTypes";
import { DMR_ORDERS_HEADERS } from "./DmrOrdersSubTable";
import ManufacturerOrdersSubtable from "../manufacturerOrder/ManufacturerOrdersSubTable";
import AssociatedBadge from "../../badges/AssociatedBadge";
import { TableName } from "@/types/api/TableName";
import InputCell from "@/components/cells/InputCell";
import { getValueAsType } from "framer-motion";
import ClientOrdersSubtable from "./ClientOrdersSubtable";
import { useAuth } from "@/context/AuthContext";

interface DmrOrderRowProps {
  dmrOrderMaster: DmrOrderMaster;
  handleOrderCheck: (orderId: number) => void;
  isSelectDisabled: boolean;
  warnUnlink?: (orderId: number) => void;
  expandable: boolean;
  checked: boolean;
}

const mapDmrOrderToForm = (dmrOrderMaster: DmrOrderMaster): any => {
  const updateDto: any = {
    label: dmrOrderMaster.label,
    statusId: dmrOrderMaster.statusId,

    orderDate: dmrOrderMaster.orderDate,
    dueDate: dmrOrderMaster.dueDate,

    estimatedArrival: dmrOrderMaster.estimatedArrival,

    notes: dmrOrderMaster.notes,

    value: dmrOrderMaster.value,

    assignedUsers: dmrOrderMaster.assignedUsers.map((userDto) => userDto.id),
  };
  return updateDto;
};

export default function DmrOrderRow({
  dmrOrderMaster,
  warnUnlink,
  handleOrderCheck,
  isSelectDisabled,
  expandable,
  checked,
}: DmrOrderRowProps) {
  const { hasPermission } = useAuth();
  const {
    openHistoryDrawer,
    references,
    doUpdateDmrOrder,
    doAssignUserDmrOrder,
    doUnassignUserDmrOrder,
    handleShowManufacturerOrderModal,
  } = useOrdersContext();
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [subtableMode, setSubtableMode] = useState<TableName>(
    "manufacturer_orders",
  );
  const methods = useForm({
    defaultValues: mapDmrOrderToForm(dmrOrderMaster),
  });
  const { watch, setValue, getValues } = methods;

  useEffect(() => {
    methods.reset(mapDmrOrderToForm(dmrOrderMaster));
  }, [dmrOrderMaster]);

  useEffect(() => {
    if (dmrOrderMaster.id == 405) {
      console.log("DMRORDERMASTERz", dmrOrderMaster);
    }
  }, [subtableMode, dmrOrderMaster]);

  const createDmrOrderDateChangeHandler = (fieldName: string) => {
    return (date: Date | string | undefined) => {
      let updateDto = {
        [fieldName]: date,
      };
      doUpdateDmrOrder(dmrOrderMaster.id, updateDto);
    };
  };

  const createDmrOrderChangeRefHandler = (
    fieldName: "statusId" | "priorityId",
  ) => {
    return async (optionId: number) => {
      const updateDto = {
        [fieldName]: optionId,
      };

      try {
        await doUpdateDmrOrder(dmrOrderMaster.id, updateDto);

        setValue(fieldName, optionId, {
          shouldDirty: true,
          shouldTouch: true,
          shouldValidate: true,
        });
      } catch (err) {
        toast.error(
          `Changes were not saved (${fieldName}). Please try again later.`,
        );

        console.log(err);
      }
    };
  };

  const toggleSubtableMode = () => {
    if (subtableMode == "client_orders") {
      setSubtableMode("manufacturer_orders");
    } else {
      setSubtableMode("client_orders");
    }
  };

  const HEADERS_COLUMN_SIZE_STR: string = DMR_ORDERS_HEADERS.reduce(
    (acc, next) => {
      if (!acc) return next.width || "";
      return acc + "_" + next.width;
    },
    "",
  );

  const isEditAllowed = hasPermission("dmrOrders", "edit");
  const isManufacturerAddAllowed = hasPermission("manufacturerOrders", "edit");

  console.log(isEditAllowed)
  const showAddButton =
    subtableMode == "manufacturer_orders" && isManufacturerAddAllowed;
  return (
    <FormProvider {...methods}>
      {/* Row */}
      <div
        className={`grid grid-cols-[${HEADERS_COLUMN_SIZE_STR}] gap-0 border-y border-gray-200 text-xs font-medium text-gray-500 dark:border-gray-700`}
      >
        {/* Checkbox */}
        <div className="flex h-full items-center justify-center gap-2 border-r border-gray-100 dark:border-gray-700">
          <input
            checked={checked}
            onChange={() => handleOrderCheck(dmrOrderMaster.id)}
            disabled={isSelectDisabled || !isEditAllowed}
            type="checkbox"
            className="h-4 w-4 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          {warnUnlink && isEditAllowed && (
            <button
              onClick={() => warnUnlink(dmrOrderMaster.id)}
              className="transition-colors hover:text-red-600"
            >
              <Unlink size={16} />
            </button>
          )}
        </div>
        <div className="group flex flex-1 items-center gap-1 truncate border-r border-gray-100 px-2 dark:border-gray-700">
          {/* Expandable */}
          {expandable && (
            <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded text-[10px] text-gray-900 dark:text-gray-200">
              {dmrOrderMaster.clientOrderIds &&
              dmrOrderMaster.clientOrderIds.length > 0 ? (
                <Tooltip>
                  <TooltipTrigger
                    onClick={() => setIsExpanded((prev) => !prev)}
                  >
                    <ChevronRight
                      className={`transition duration-100 ${isExpanded ? "rotate-90" : "rotate-0"}`}
                    />
                  </TooltipTrigger>
                  <TooltipContent>View Client Orders</TooltipContent>
                </Tooltip>
              ) : (
                <Tooltip>
                  <TooltipTrigger
                    onClick={() => setIsExpanded((prev) => !prev)}
                  >
                    <ChevronRight
                      className={`opacity-0 transition duration-100 group-hover:opacity-40 ${isExpanded ? "rotate-90 opacity-100" : "rotate-0 opacity-0"}`}
                    />
                  </TooltipTrigger>
                  <TooltipContent>Add Client Orders</TooltipContent>
                </Tooltip>
              )}
            </span>
          )}
          <InputCell
            id={dmrOrderMaster.id}
            fieldName="label"
            handleUpdate={() =>
              doUpdateDmrOrder(dmrOrderMaster.id, { label: getValues("label") })
            }
            isEditAllowed={isEditAllowed}
          />
        </div>

        <div className="flex h-full items-center justify-center border-r border-gray-100 px-2 py-2 dark:border-gray-700">
          <AssignedToCell
            assignedToList={dmrOrderMaster.assignedUsers}
            handleUnassign={(userIdToUnassign: number) => {
              doUnassignUserDmrOrder(userIdToUnassign, dmrOrderMaster.id);
            }}
            handleAssign={(userIdToAssign: number) => {
              doAssignUserDmrOrder(userIdToAssign, dmrOrderMaster.id);
            }}
            isEditAllowed={isEditAllowed}
          />
        </div>

        {/* Status */}
        <SelectCellWrapper>
          <HoverSelect
            id={dmrOrderMaster.id}
            fieldName="statusId"
            fields={references.status}
            handleChangeSelect={createDmrOrderChangeRefHandler("statusId")}
            isEditAllowed={isEditAllowed}
          />
        </SelectCellWrapper>

        {/* Order Date */}
        <DateCell
          fieldName="orderDate"
          handleChangeDate={createDmrOrderDateChangeHandler("orderDate")}
          isEditAllowed={isEditAllowed}
        />

        {/* Estimated arrival */}
        <DateCell
          fieldName="estimatedArrival"
          handleChangeDate={createDmrOrderDateChangeHandler("estimatedArrival")}
          isEditAllowed={isEditAllowed}
        />

        {/* notes  */}
        <div className="group flex items-center">
          <TextAreaCell
            id={dmrOrderMaster.id}
            fieldName="notes"
            handleUpdate={() =>
              doUpdateDmrOrder(dmrOrderMaster.id, { notes: getValues("notes") })
            }
            rows={2}
            isEditAllowed={isEditAllowed}
          />
          <button
            type="button"
            onClick={() =>
              openHistoryDrawer("dmr_orders", "notes", dmrOrderMaster.id)
            }
          >
            <History
              className="text-blue-400 opacity-0 transition-opacity group-hover:opacity-100"
              size={20}
            />
          </button>
        </div>
      </div>

      {/* Collapsible */}
      {expandable && (
        <div>
          {isExpanded && (
            <div className="bg-opacity-80 grid grid-cols-[40px_1fr] border-t border-gray-100">
              <div className="relative flex-shrink-0 border-r border-gray-100 dark:border-gray-400">
                <div
                  style={{ backgroundColor: "gray" }}
                  className="absolute top-0 bottom-4 left-1/2 h-full w-[2px] -translate-x-1/2 rounded-b-full bg-gray-200 opacity-30"
                />
              </div>
              <div className="px-4 py-6">
                <div className="flex items-center justify-between">
                  <div className="mb-3 flex items-center gap-2">
                    <div className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white p-0.5 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200">
                      <button
                        type="button"
                        onClick={toggleSubtableMode}
                        className={`rounded p-1.5 transition-all ${subtableMode === "manufacturer_orders" ? "bg-blue-50 text-blue-600" : "text-gray-400 hover:text-gray-600"}`}
                        title="Card view"
                      >
                        <Building2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={toggleSubtableMode}
                        className={`rounded p-1.5 transition-all ${subtableMode === "client_orders" ? "bg-blue-50 text-blue-600" : "text-gray-400 hover:text-gray-600"}`}
                        title="Table view"
                      >
                        <PersonStanding className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <AssociatedBadge
                      associations={((): number => {
                        if (subtableMode == "client_orders")
                          return dmrOrderMaster.clientOrderIds.length;
                        else return dmrOrderMaster.manufacturerOrderIds.length;
                      })()}
                      type={subtableMode}
                    />
                  </div>
                  <div>
                    {showAddButton && (
                      <button
                        className="flex gap-2 rounded-lg bg-blue-500 px-4 py-2 text-xs text-white transition-colors hover:bg-blue-600"
                        onClick={() =>
                          handleShowManufacturerOrderModal(
                            "add",
                            undefined,
                            dmrOrderMaster.id,
                            () => {},
                          )
                        }
                      >
                        <Plus size={14} />
                      </button>
                    )}
                  </div>
                </div>

                {subtableMode == "client_orders" && (
                  <ClientOrdersSubtable
                    subOrderIds={dmrOrderMaster.clientOrderIds}
                    parentId={dmrOrderMaster.id}
                  />
                )}
                {subtableMode == "manufacturer_orders" && (
                  <ManufacturerOrdersSubtable
                    manufacturerOrderIds={dmrOrderMaster.manufacturerOrderIds}
                    parentId={dmrOrderMaster.id}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </FormProvider>
  );
}
