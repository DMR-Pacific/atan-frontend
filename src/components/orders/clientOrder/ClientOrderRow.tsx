import React, { ReactNode, useEffect, useState } from "react";
// import { StatusBadge, PriorityBadge, ClientTypeBadge } from './ui/Badge'
import { Avatar } from "../../Avatar";
import {
  MessageSquare,
  Plus,
  Check,
  Sparkles,
  ChevronRight,
  History,
} from "lucide-react";
import { useReference } from "@/hooks/useReference";
import { FormProvider, useForm, UseFormWatch } from "react-hook-form";
import { AnimatePresence, defaultValueTypes, motion } from "framer-motion";
import { useOrdersContext } from "@/context/OrdersContext";
import TextAreaCell from "../../cells/TextAreaCell";
import { ClientOrderUpdateDto } from "@/types/orders/ClientOrderTypes";
import HoverSelect from "../../cells/HoverSelect";
import { Calendar22 } from "@/components/form/DatePicker";
import { ClientOrderDto } from "@/types/orders/ClientOrderTypes";

import AssignedToCell from "../../cells/AssignedToCell";
import ClientRowCollapsible from "./ClientRowCollapsible";
import DmrOrdersTable from "../dmrOrder/DmrOrdersSubTable";
import { Select } from "react-day-picker";
import DateCell from "../../cells/DateCell";
import { SelectCellWrapper } from "../../cells/SelectCellWrapper";
import { ClientOrderRowContext } from "@/context/ClientOrderRowContext";

import { toast } from "sonner";
import { useClientOrderGroupContext } from "@/context/ClientOrderGroupContext";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { BaseReferenceType } from "@/types/BaseReferenceType";
import { YesNo } from "@/types/msic";
import { ClientOrderMaster } from "@/types/orders/ClientOrderTypes";
import { useClientOrdersTableContext } from "@/context/ClientOrdersTableContext";
import InputCell from "@/components/cells/InputCell";
import { useAuth } from "@/context/AuthContext";
import { ROLE_PERMISSIONS } from "@/utils/utils";

interface OrderRowProps {
  order: ClientOrderMaster;
  handleOrderCheck: (orderId: number) => void;
  isSelectDisabled: boolean;
  warnUnlink?: (orderId: number) => void;
  expandable: boolean;
  checked: boolean;
  group?: BaseReferenceType;
}

const mapClientOrderToForm = (
  order: ClientOrderMaster,
): ClientOrderUpdateDto => {
  const updateDto: ClientOrderUpdateDto = {
    // assignedToId:
    label: order.label,
    assignedUserIds: order.assignedUsers?.map(
      (assignedUser) => assignedUser.id,
    ),
    priorityId: order.priorityId,
    clientTypeId: order.clientTypeId,
    statusId: order.statusId,
    categoryId: order.categoryId,
    dueDate: order.dueDate,
    notes: order.notes,
    value: order.value,

    dmrOrderIds: order.dmrOrderIds,
    // assignedToId: order.assignedTo?.id
  };
  return updateDto;
};
export function ClientOrderRow({
  order,
  warnUnlink,
  handleOrderCheck,
  isSelectDisabled: isSelectDisabledProp,
  expandable,
  checked,
}: OrderRowProps) {
  if (!order) return null;

  const { hasPermission } = useAuth();
  const {
    references,
    openHistoryDrawer,
    doUpdateClientOrder,
    assignableUsers,
    masterClientOrders,
    doAssignUserClientOrder,
    doUnassignUserClientOrder,
  } = useOrdersContext();

  const [subitemOpen, setSubitemOpen] = useState<boolean>(false);

  const methods = useForm<ClientOrderUpdateDto>({
    defaultValues: mapClientOrderToForm(order),
  });

  const {
    register,
    watch,
    formState: { errors },
    handleSubmit,
    setValue,
    getValues,
  } = methods;

  const createClientOrderDateChangeHandler = (fieldName: string) => {
    return (date: Date | string | undefined) => {
      let updateDto = {
        [fieldName]: date,
      };
      doUpdateClientOrder(order.id, updateDto);
    };
  };

  const createClientOrderChangeRefHandler = (
    fieldName: "priorityId" | "clientTypeId" | "statusId" | "categoryId",
  ) => {
    return async (optionId: number) => {
      const updateDto = {
        [fieldName]: optionId,
      };

      try {
        await doUpdateClientOrder(order.id, updateDto);

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

  const isEditAllowed = hasPermission("clientOrders", "edit");

  const isSelectDisabled = isSelectDisabledProp || !isEditAllowed
  return (
    <FormProvider {...methods}>
      <ClientOrderRowContext.Provider value={{ order }}>
        <div className="group grid min-h-[56px] grid-cols-[40px_minmax(250px,2fr)_minmax(80px,120px)_140px_150px_100px_minmax(200px,3fr)_100px_120px_100px] items-center gap-0 border-b border-gray-100 text-sm text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">
          {/* Checkbox */}
          <div className="flex h-full items-center justify-center border-r border-gray-100 dark:border-gray-700">
            <input
              checked={checked}
              disabled={isSelectDisabled}
              onChange={() => {
                handleOrderCheck(order.id);
              }}
              type="checkbox"
              className="h-4 w-4 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900"
            />
          </div>

          {/* Client PO */}
          <div className="group flex h-full items-center gap-2 border-r border-gray-100 px-4 py-2 font-medium text-gray-900 dark:border-gray-700">
            <div className="flex flex-1 items-center gap-2 truncate">
              {expandable && (
                <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded text-[10px] text-gray-900 dark:text-gray-400">
                  {/* {order?.dmrOrders.length > 0 &&  */}
                  {order.dmrOrderIds?.length > 0 ? (
                    <Tooltip>
                      <TooltipTrigger
                        onClick={() => setSubitemOpen((prev) => !prev)}
                      >
                        <ChevronRight
                          className={`transition duration-100 ${subitemOpen ? "rotate-90" : "rotate-0"}`}
                        />
                      </TooltipTrigger>
                      <TooltipContent>View DMR Orders</TooltipContent>
                    </Tooltip>
                  ) : (
                    <Tooltip>
                      <TooltipTrigger
                        onClick={() => setSubitemOpen((prev) => !prev)}
                      >
                        <ChevronRight
                          className={`opacity-0 transition duration-100 group-hover:opacity-40 ${subitemOpen ? "rotate-90 opacity-100" : "rotate-0 opacity-0"}`}
                        />
                      </TooltipTrigger>
                      <TooltipContent>Add DMR Orders</TooltipContent>
                    </Tooltip>
                  )}
                </span>
              )}
              <InputCell
                id={order.id}
                fieldName="label"
                handleUpdate={() =>
                  doUpdateClientOrder(order.id, { label: getValues("label") })
                }
                isEditAllowed={isEditAllowed}
              />
            </div>
          </div>

          {/* Owner */}
          <AssignedToCell
            isEditAllowed={isEditAllowed}
            assignedToList={order.assignedUsers}
            handleUnassign={(userIdToUnassign) => {
              doUnassignUserClientOrder(userIdToUnassign, order.id);
            }}
            handleAssign={(userIdToAssign) => {
              doAssignUserClientOrder(userIdToAssign, order.id);
            }}
          />

          {/* Status */}
          <SelectCellWrapper>
            <HoverSelect
              id={order.id}
              fieldName="statusId"
              fields={references.status}
              handleChangeSelect={createClientOrderChangeRefHandler("statusId")}
              isEditAllowed={isEditAllowed}
            />
          </SelectCellWrapper>

          {/* Due Date */}
          <DateCell
            fieldName="dueDate"
            handleChangeDate={createClientOrderDateChangeHandler("dueDate")}
            isEditAllowed={isEditAllowed}
          />

          {/* Priority */}

          <SelectCellWrapper>
            <HoverSelect
              id={order.id}
              fieldName="priorityId"
              fields={references.priority}
              handleChangeSelect={createClientOrderChangeRefHandler(
                "priorityId",
              )}
              isEditAllowed={isEditAllowed}
            />
          </SelectCellWrapper>

          {/* Notes */}

          <div className="group flex h-full items-center border-r border-gray-100 px-4 py-2 text-gray-600 dark:border-gray-700">
            <TextAreaCell
              id={order.id}
              fieldName="notes"
              handleUpdate={() =>
                doUpdateClientOrder(order.id, { notes: getValues("notes") })
              }
              isEditAllowed={isEditAllowed}
            />
            <button
              type="button"
              onClick={() =>
                openHistoryDrawer("client_orders", "notes", order.id)
              }
              className="rounded-lg p-1 hover:bg-blue-100"
            >
              <History
                className="text-blue-400 opacity-0 transition-opacity group-hover:opacity-100"
                size={20}
              />
            </button>
          </div>

          {/* Last Updated */}
          <div className="flex h-full items-center gap-2 border-r border-gray-100 px-4 py-2 text-xs text-gray-500 dark:border-gray-700">
            {/* <Avatar
            initials="RT"
            color="bg-blue-400 text-blue-900"
            className="w-5 h-5 text-[10px]"
          /> */}
            {/* <span className="truncate">{order?.lastUpdated}</span> */}
            <span>
              {new Date(order?.updatedAt).toLocaleDateString("en-CA")}
            </span>
          </div>

          {/* Value */}
          <div className="flex h-full items-center justify-end border-r border-gray-100 px-4 py-2 text-xs font-medium text-gray-900 dark:border-gray-700">
            {/* {order?.value
            ? `$${order?.value.toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}`
            : ''} */}
            $
            <InputCell
              id={order.id}
              fieldName="value"
              handleUpdate={() =>
                doUpdateClientOrder(order.id, {
                  value: getValues("value"),
                })
              }
              isEditAllowed={isEditAllowed}
            />
          </div>

          {/* Client Type */}
          <SelectCellWrapper>
            <HoverSelect
              id={order.id}
              fieldName="clientTypeId"
              fields={references.clientType}
              handleChangeSelect={createClientOrderChangeRefHandler(
                "clientTypeId",
              )}
              isEditAllowed={isEditAllowed}
            />
          </SelectCellWrapper>
        </div>
        <AnimatePresence>
          {subitemOpen && (
            <motion.div
            // initial={{
            //   height: 0,
            //   opacity: 0,
            // }}
            // animate={{
            //   height: 'auto',
            //   opacity: 1,
            // }}
            // exit={{
            //   height: 0,
            //   opacity: 0,
            // }}
            // transition={{
            //   duration: 0.2,
            //   ease: 'easeInOut',
            // }}
            // className=" bg-white"
            >
              <ClientRowCollapsible />
            </motion.div>
          )}
        </AnimatePresence>
      </ClientOrderRowContext.Provider>
    </FormProvider>
  );
}
