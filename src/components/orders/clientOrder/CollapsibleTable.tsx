"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  ChevronDown,
  AlertCircle,
  RefreshCcw,
} from "lucide-react";
import { ClientOrderRow } from "./ClientOrderRow";
import { ClientOrderHeader } from "./ClientOrderHeader";
import AddClientOrderRow from "./AddClientOrderRow";
import { BaseReferenceType } from "@/types/BaseReferenceType";
import {
  ClientOrderGroupContext,
  useClientOrderGroupContext,
} from "@/context/ClientOrderGroupContext";
import { useOrdersContext } from "@/context/OrdersContext";
import { useClientOrdersTableContext } from "@/context/ClientOrdersTableContext";
import { useAuth } from "@/context/AuthContext";
import { ROLE_PERMISSIONS } from "@/utils/utils";

interface CollapsibleGroupProps {
  defaultExpanded?: boolean;
  groupId: number;
}

export default function CollapsibleTable({
  groupId,
  defaultExpanded = false,
}: CollapsibleGroupProps) {
  const [group, setGroup] = useState<BaseReferenceType | null | undefined>(
    null,
  );
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const { roles, hasPermission } = useAuth();
  const { references, masterClientOrders } = useOrdersContext();
  const {
    clientOrdersByGroup,
    groupBy,
    groups,
    tableErrors,
    ordersLoading,
    summaries,
    selectedClientRows,
    setSelectedClientRows,
    selectedDmrRows,
  } = useClientOrdersTableContext();

  const orderGroup = clientOrdersByGroup[groupId];
  const fetchError = tableErrors[groupId];
  const summary = summaries[groupId];

  useEffect(() => {
    setGroup(groups.find((ref) => ref.id == Number(groupId)));
  }, [groups, setGroup, groupId]);

  const isEditAllowed = hasPermission("clientOrders", "edit");
  const isClientOrdersSelectDisabled = selectedDmrRows.length > 0 || !isEditAllowed

  return (
    <ClientOrderGroupContext.Provider
      value={{
        group,
        orderGroup,
      }}
    >
      <div className="relative mb-4 overflow-x-auto">
        {/* Group Header */}
        <div
          className="group mb-2 flex cursor-pointer items-center gap-2 rounded-md py-2 select-none hover:bg-gray-50 dark:hover:bg-gray-800"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div
            style={{ color: group?.color }}
            className={`rounded p-1 transition-colors`}
          >
            {isExpanded ? (
              <ChevronDown size={18} />
            ) : (
              <ChevronRight size={18} />
            )}
          </div>

          <h3 style={{ color: group?.color }} className={`text-sm font-medium`}>
            {group?.label}
          </h3>

          <span className="ml-2 text-xs font-normal text-gray-400">
            {orderGroup?.length} Client po's
          </span>

          {!isExpanded && ordersLoading[groupId] && (
            <span>
              <div
                className={`w-${3} h-${3} animate-spin rounded-full border-4 border-blue-500 border-t-transparent`}
              />
            </span>
          )}

          {fetchError && (
            <span>
              <AlertCircle className="text-red-500" size={16} />
            </span>
          )}
        </div>

        {/* Collapsible Content */}
        <AnimatePresence initial={false}>
          {isExpanded ? (
            <motion.div
              initial={{
                height: 0,
                opacity: 0,
              }}
              animate={{
                height: "auto",
                opacity: 1,
              }}
              exit={{
                height: 0,
                opacity: 0,
              }}
              transition={{
                duration: 0.3,
                ease: "easeInOut",
              }}
              className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
            >
              {ordersLoading[groupId] ? (
                <div className="flex flex-col items-center justify-center px-4 py-24 text-center">
                  <div
                    className={`w-${10} h-${10} animate-spin rounded-full border-4 border-blue-500 border-t-transparent`}
                  />
                  Loading
                </div>
              ) : (
                <div>
                  {fetchError ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                      <div className="mb-4 rounded-full bg-red-50 p-4">
                        <AlertCircle className="h-8 w-8 text-red-500" />
                      </div>
                      <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-200">
                        Unable to fetch orders
                      </h3>
                      <p className="mb-6 max-w-sm text-gray-500 dark:text-gray-400">
                        {"Please try again later."}
                      </p>
                    </div>
                  ) : (
                    <div
                      style={{ borderLeftColor: group?.color }}
                      className={`overflow-x-scroll rounded-lg border-l-8`}
                    >
                      <ClientOrderHeader />
                      <div
                      // className="divide-y divide-gray-100"
                      >
                        {/* Table Row */}
                        <div>
                          {orderGroup?.map((orderId) => (
                            <ClientOrderRow
                              isSelectDisabled={isClientOrdersSelectDisabled}
                              checked={selectedClientRows.includes(orderId)}
                              handleOrderCheck={(dmrOrderId: number) => {
                                setSelectedClientRows((prev) =>
                                  prev.includes(dmrOrderId)
                                    ? prev.filter((x) => x !== dmrOrderId)
                                    : [...prev, dmrOrderId],
                                );
                              }}
                              key={`clientOrderRow-${orderId}`}
                              order={masterClientOrders[orderId]}
                              expandable={true}
                            />
                          ))}

                          {/* Add Row Placeholder */}
                          <AddClientOrderRow />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </motion.div> /* Collapsed Summary View */
          ) : (
            <div
              style={{ borderLeftColor: group?.color }}
              className={`border-l-8 border-l-${group?.color} flex h-14 items-center overflow-hidden rounded-lg border p-0 shadow-sm`}
            >
              <div className="grid h-full flex-1 grid-cols-[40px_minmax(250px,2fr)_minmax(80px,120px)_140px_150px_100px_minmax(200px,3fr)_100px_120px_100px] items-center gap-0">
                {/* checkbox */}
                <div></div>

                {/* label */}
                <div className="border-r border-gray-300 px-4 text-sm text-gray-500 dark:border-gray-700">
                  {orderGroup?.length} Client po's
                </div>

                {/* Owner */}
                <div className="border-r border-gray-300 dark:border-gray-700">
                  <span className="invisible">.</span>
                </div>

                {/* Status Bar */}
                <div className="border-r border-gray-300 px-2 dark:border-gray-700">
                  <div className="flex h-6 w-full overflow-hidden rounded">
                    {Object.entries(summary?.statusDistribution || {}).map(
                      ([id, item], i) => {
                        return (
                          <div
                            key={i}
                            className={`h-full`}
                            style={{
                              backgroundColor: references.status?.find(
                                (ref) => String(ref.id) == id,
                              )?.color,
                              width: `${item.percentage}%`,
                            }}
                          ></div>
                        );
                      },
                    )}
                  </div>
                </div>

                {/* Due date */}
                <div className="flex justify-center border-r border-gray-300 px-2 dark:border-gray-700">
                  <span className="invisible">.</span>

                  {/* {group.summary?.dateRange && (
                      <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap">
                        {group.summary.dateRange}
                      </span>
                    )} */}
                </div>

                {/* Priority Bar */}
                <div className="border-r border-gray-300 px-2 dark:border-gray-700">
                  <div className="flex h-6 w-full gap-0.5 overflow-hidden rounded">
                    {/* {group.summary?.priorityDistribution?.map((item, i) => (
                        <div
                          key={i}
                          className={`${item.color} h-full`}
                          style={{
                            width: `${item.percentage}%`,
                          }}
                        ></div>
                      ))} */}

                    {Object.entries(summary?.priorityDistribution || {}).map(
                      ([id, item], i) => {
                        return (
                          <div
                            key={i}
                            className={`h-full`}
                            style={{
                              backgroundColor: references.priority?.find(
                                (ref) => String(ref.id) == id,
                              )?.color,
                              width: `${item.percentage}%`,
                            }}
                          ></div>
                        );
                      },
                    )}
                  </div>
                </div>

                {/* Notes */}
                <div className="col-span-1 border-r border-gray-300 dark:border-gray-700">
                  <span className="invisible">.</span>
                </div>

                {/* last updated */}
                <div className="col-span-1 border-r border-gray-300 dark:border-gray-700">
                  <span className="invisible">.</span>
                </div>
                {/* Value */}
                <div className="flex flex-col items-end justify-center border-r border-gray-300 px-4 dark:border-gray-700">
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-200">
                    ${summary?.totalValue?.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-gray-400">sum</span>
                </div>

                {/* Client type */}
                <div className="px-2">
                  <div className="flex h-6 w-full overflow-hidden rounded">
                    {Object.entries(summary?.clientTypeDistribution || {}).map(
                      ([id, item], i) => {
                        return (
                          <div
                            key={i}
                            className={`h-full`}
                            style={{
                              backgroundColor: references.clientType?.find(
                                (ref) => String(ref.id) == id,
                              )?.color,
                              width: `${item.percentage}%`,
                            }}
                          ></div>
                        );
                      },
                    )}
                  </div>
                </div>
              </div>
              {/* </motion.div> */}
            </div>
          )}
        </AnimatePresence>
      </div>
    </ClientOrderGroupContext.Provider>
  );
}
