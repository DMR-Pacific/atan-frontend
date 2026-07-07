import { useOrdersContext } from "@/context/OrdersContext";
import {
  DmrOrderFormData,
  DmrOrderUpdateDto,
} from "@/types/orders/DmrOrderTypes";
import { AlertCircle, Calendar, DollarSign, Plus, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import ClientOrderCard from "../clientOrder/ClientOrderCard";
import AssociatedBadge from "../../badges/AssociatedBadge";

interface DmrOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DmrOrderModal({ isOpen, onClose }: DmrOrderModalProps) {
  const {
    masterDmrOrders,
    masterClientOrders,
    dmrOrderModalOptions: { mode, orderId, onSubmit },
    doAddDmrOrder,
    doUpdateDmrOrder,
  } = useOrdersContext();
  const [isNotesExpanded, setIsNotesExpanded] = useState<boolean>(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const {
    register,
    watch,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<DmrOrderFormData>({
    defaultValues: {
      label: "",
      assignedUserIds: [],
      orderDate: "",
      notes: "",
      value: 0,
    },
  });

  const assignedUserIds = watch("assignedUserIds");

  // adjust text area height when notes is expanded
  useEffect(() => {
    if (!textareaRef.current) return;
    if (isNotesExpanded) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [isNotesExpanded]);

  // Collapse when clicking elsewhere in modal
  // Note: previously, we'd recollapse when clicking anywhere outside the textarea,
  // however Riche often needs it to stay visible (uncollapsed) when viewing from another tab,
  // so we restrict minimizing textarea to clicking within modal only
  useEffect(() => {
    // only runs is notes is expanded and modal is rendered
    if (!isNotesExpanded || !modalRef.current) return;
    const handleClickInModal = (e: MouseEvent) => {
      //  if textarea is rendered and you click not on it, unexpand notes
      if (
        textareaRef.current &&
        !textareaRef.current.contains(e.target as Node)
      ) {
        setIsNotesExpanded(false);
      }
    };
  }, [isNotesExpanded]);

  useEffect(() => {
    if (!orderId || !(mode == "edit" || mode == "view")) return;
    if (!masterDmrOrders[orderId]) return;

    const order = masterDmrOrders[orderId];
    reset({
      label: order.label,
      assignedUserIds: order.assignedUsers.map((assignedU) => assignedU.id),
      orderDate: order.orderDate,
      notes: order.notes,
      value: order.value,
    });
  }, [isOpen]);

  const handleUserClick = (clickedId: number) => {
    if (!assignedUserIds.includes(clickedId))
      setValue("assignedUserIds", [...assignedUserIds, clickedId]); // add to assignments
    else
      setValue(
        "assignedUserIds",
        assignedUserIds.filter((assignedId) => assignedId != clickedId),
      ); // remove from assignments
  };

  const { assignableUsers, references } = useOrdersContext();
  const submitHandler: SubmitHandler<DmrOrderUpdateDto> = async (data) => {
    console.log("DMR UPDATE", data);
    if (mode == "add" || mode == "add-link") {
      await doAddDmrOrder(data);
    } else if (mode == "edit") {
      if (orderId == undefined) return;
      await doUpdateDmrOrder(orderId, data);
    }

    // Reset form
    reset();
    onClose();

    if (onSubmit) {
      onSubmit();
    }
  };
  if (!isOpen) return null;
  return (
    <>
      <div
        className="animate-in fade-in fixed inset-0 z-50 bg-black/30 backdrop-blur-sm duration-200"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        ref={modalRef}
        className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div
          className="animate-in zoom-in-95 fade-in pointer-events-auto max-h-[90vh] w-full max-w-2xl overflow-y-scroll rounded-xl bg-white shadow-2xl duration-200 dark:bg-gray-900"
          onClick={(e) => e.stopPropagation()}
        >
          <form onSubmit={handleSubmit(submitHandler)}>
            {/* Header */}
            <div className="bg-gradiant-to-r to white flex flex-shrink-0 items-center justify-between border-b border-gray-200 from-blue-50 p-6 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                  <Plus className="h-5 w-5 text-blue-600" />
                </div>
                {mode == "view" && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-200">
                      {watch("label")}
                    </h2>
                  </div>
                )}
                {mode == "add" && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-200">
                      Add New Order
                    </h2>
                    <p className="mt-0.5 text-sm text-gray-500">
                      Create a new dmr order
                    </p>
                  </div>
                )}
                {mode == "edit" && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-200">
                      Edit Order
                    </h2>
                    <p className="mt-0.5 text-sm text-gray-500">
                      Order:{" "}
                      <span className="font-medium text-gray-500">
                        {watch("label")}
                      </span>
                    </p>
                  </div>
                )}
              </div>
              <button
                type="button"
                className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-white"
                onClick={onClose}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {/* Form */}

            <div className="max-h-[calc(90vh-140px)] flex-shrink-0 overflow-y-auto p-6">
              <fieldset disabled={mode == "view"}>
                <div className="space-y-5">
                  {/* Order Number */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-400">
                      Order Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className={`w-full rounded-lg border px-3 py-2 transition-all focus:ring-2 focus:outline-none ${errors.label ? "border-red-300 focus:border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"}`}
                      {...register("label")}
                      placeholder="e.g., PO# P2600152_GCC"
                    />

                    {errors.label && (
                      <p className="mt-1 flex items-center gap-1 text-sm text-red-600">
                        <AlertCircle className="h-3 w-3" />
                        {errors.label.message}
                      </p>
                    )}
                  </div>

                  {/* Owners */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-400">
                      Assigned To
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {assignableUsers.map((u, i) => (
                        <button
                          type="button"
                          key={i}
                          onClick={() => {
                            handleUserClick(u.id);
                          }}
                          className={`rounded-full px-3 py-1.5 text-sm font-medium transition-all ${assignedUserIds.includes(u.id) ? "bg-blue-100 ring-2 ring-blue-500 ring-offset-2" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                        >
                          {u.firstName.charAt(0) + u.lastName.charAt(0)}
                        </button>
                      ))}
                    </div>
                    {errors.assignedUserIds && (
                      <p className="mt-1 flex items-center gap-1 text-sm text-red-600">
                        <AlertCircle className="h-3 w-3" />
                        {errors.assignedUserIds.message}
                      </p>
                    )}
                  </div>
                  {/* Row: Status & Priority */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-400">
                        Status
                      </label>
                      <select
                        {...register("statusId")}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      >
                        <option className="dark:bg-gray-800" value=""></option>

                        {references.status.map((status) => (
                          <option
                            className="dark:bg-gray-800"
                            key={status.id}
                            value={status.id}
                          >
                            {status.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Row: Due Date & Value */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-400">
                        Order Date <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Calendar className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                          {...register("orderDate")}
                          type="date"
                          className={`w-full rounded-lg border py-2 pr-3 pl-10 transition-all focus:ring-2 focus:outline-none ${errors.orderDate ? "border-red-300 focus:border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"}`}
                        />
                      </div>
                      {errors.orderDate && (
                        <p className="mt-1 flex items-center gap-1 text-sm text-red-600">
                          <AlertCircle className="h-3 w-3" />
                          {errors.orderDate.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-400">
                        Value ($) <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                          type="number"
                          step="0.01"
                          {...register("value")}
                          className={`w-full rounded-lg border py-2 pr-3 pl-10 transition-all focus:ring-2 focus:outline-none ${errors.value ? "border-red-300 focus:border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"}`}
                          placeholder="0.00"
                        />
                      </div>
                      {errors.value && (
                        <p className="flex items-center gap-1 text-sm text-red-600">
                          <AlertCircle className="h-3 w-3" />
                          {errors.value.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-400">
                      Notes
                    </label>
                    <textarea
                      onClick={() => {
                        setIsNotesExpanded(true);
                      }}
                      {...register("notes")}
                      rows={3}
                      className="h-72 w-full resize-none rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="Add any additional notes..."
                    />
                  </div>
                </div>
              </fieldset>
            </div>

            {/* Footer */}
            {mode != "view" && (
              <div className="flex flex-shrink-0 items-center justify-end gap-3 border-t border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-950">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-600 hover:shadow-md"
                >
                  {mode == "add" && "Create Order"}
                  {mode == "edit" && "Update Order"}
                </button>
              </div>
            )}
            {orderId && mode == "view" && (
              <div className="flex flex-1 flex-col gap-4 p-4">
                <AssociatedBadge
                  associations={masterDmrOrders[orderId].clientOrderIds.length}
                  type={"client_orders"}
                />
                <div className="grid grid-cols-2 gap-2 overflow-y-auto">
                  {masterDmrOrders[orderId].clientOrderIds.map((clientId) => (
                    <ClientOrderCard
                      key={`clientId-${clientId}`}
                      order={masterClientOrders[clientId]}
                      isClickable={false}
                    />
                  ))}
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </>
  );
}
