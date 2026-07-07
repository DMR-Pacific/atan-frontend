import { useOrdersContext } from "@/context/OrdersContext";
import {
  ClientOrderFormData,
  mapFormToAddDto,
  mapFormToUpdateDto,
} from "@/types/orders/ClientOrderTypes";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, Calendar, DollarSign, Plus, X } from "lucide-react";
import { useEffect } from "react";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";

interface ClientOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DEFAULT_FORM = {
  label: "",
  assignedUserIds: [],
  dueDate: "",
  notes: "",
  value: 0,
  categoryId: 1,
};

export default function ClientOrderModal({
  isOpen,
  onClose,
}: ClientOrderModalProps) {
  const {
    masterDmrOrders,
    masterClientOrders,
    clientOrderModalOptions: { orderId, mode, linkToOrderId, onSubmit },
    assignableUsers,
    references,
    doAddClientOrder,
    doUpdateClientOrder,
  } = useOrdersContext();

  const {
    register,
    watch,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<ClientOrderFormData>({
    defaultValues: DEFAULT_FORM,
  });

  const assignedUserIds = watch("assignedUserIds");

  useEffect(() => {
    if (mode == "add-link") {
      reset({
        ...DEFAULT_FORM,
        dmrOrderIds: [linkToOrderId],
      });
    }
    if (!orderId || !(mode == "edit" || mode == "add-link" || mode == "view"))
      return;
    if (orderId && !masterClientOrders[orderId]) return;

    const order = masterClientOrders[orderId];

    const tempDmrOrderIds = [...order.dmrOrderIds];
    if (linkToOrderId) tempDmrOrderIds.push(linkToOrderId);

    reset({
      label: order.label,
      assignedUserIds: order.assignedUsers.map(
        (assignedUser) => assignedUser.id,
      ),
      dueDate: order.dueDate,
      statusId: order.statusId,
      priorityId: order.priorityId,
      categoryId: order.categoryId,
      clientTypeId: order.clientTypeId,
      notes: order.notes,
      value: order.value,
      dmrOrderIds: tempDmrOrderIds || [],
    });
  }, [isOpen, orderId, mode, linkToOrderId]);

  const handleUserClick = (clickedId: number) => {
    if (!assignedUserIds.includes(clickedId))
      setValue("assignedUserIds", [...assignedUserIds, clickedId]); // add to assignments
    else
      setValue(
        "assignedUserIds",
        assignedUserIds.filter((assignedId) => assignedId != clickedId),
      ); // remove from assignments
  };

  const submitHandler: SubmitHandler<ClientOrderFormData> = async (data) => {
    console.log(data);

    if (mode == "add" || mode == "add-link") {
      await doAddClientOrder(mapFormToAddDto(data));
    } else if (mode == "edit") {
      if (orderId == undefined) return;
      await doUpdateClientOrder(orderId, mapFormToUpdateDto(data));
    }

    // Reset form

    if (onSubmit) onSubmit();
    reset();
    onClose();
  };

  if (!isOpen) return null;
  if (mode == "edit" && orderId == undefined)
    return <div>No client order id to edit</div>;
  if (mode == "add-link" && !linkToOrderId)
    return <div>No dmr order id passed to link</div>;
  console.log();
  return (
    <>
      <div
        className="animate-in fade-in fixed inset-0 z-50 bg-black/30 backdrop-blur-sm duration-200"
        onClick={onClose}
      />

      <AnimatePresence>
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.95,
              y: 20,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.95,
              y: 20,
            }}
            className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900"
          >
            <form onSubmit={handleSubmit(submitHandler)}>
              {/* Header */}
              <div className="bg-gradiant-to-r from-blue-50-to-white flex items-center justify-between border-b border-gray-200 p-6 dark:border-gray-700">
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
                        New Client Order
                      </h2>
                      <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                        Create a new client order
                      </p>
                    </div>
                  )}
                  {mode == "add-link" && (
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-200">
                        Link New Client Order
                      </h2>
                      <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                        Create a new client order to link
                      </p>
                    </div>
                  )}
                  {mode == "edit" && (
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-200">
                        Edit Client Order
                      </h2>
                      <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
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
                  className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-white"
                  onClick={onClose}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              {/* Form */}

              <div className="max-h-[calc(90vh-140px)] overflow-y-auto p-6">
                <div className="space-y-5">
                  {/* Order Number */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-500">
                      Order Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      disabled={mode == "view"}
                      className={`w-full rounded-lg border px-3 py-2 transition-all focus:ring-2 focus:outline-none ${errors.label ? "border-red-300 focus:border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"}`}
                      {...register("label", {
                        required: "Order number is required.",
                      })}
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
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-500">
                      Assigned To
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {assignableUsers.map((u, i) => (
                        <button
                          disabled={mode == "view"}
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
                      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-500">
                        Status
                      </label>
                      <select
                        disabled={mode == "view"}
                        {...register("statusId")}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      >
                        <option className="dark:bg-gray-950" value=""></option>

                        {references.status.map((status) => (
                          <option
                            className="dark:bg-gray-950"
                            key={status.id}
                            value={status.id}
                          >
                            {status.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-500">
                        Priority
                      </label>
                      <select
                        disabled={mode == "view"}
                        {...register("priorityId")}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      >
                        <option className="dark:bg-gray-950" value=""></option>

                        {references.priority.map((priority) => (
                          <option
                            className="dark:bg-gray-950"
                            key={priority.id}
                            value={priority.id}
                          >
                            {priority.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-500">
                        Category
                      </label>
                      <select
                        disabled={mode == "view"}
                        {...register("categoryId", {
                          required: "Category is required.",
                        })}
                        className={`w-full rounded-lg border border-gray-300 px-3 py-2 ${errors.label ? "border-red-300 focus:border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"}`}
                      >
                        {/* <option className="dark:bg-gray-950" value=""></option> */}

                        {references.category.map((category) => (
                          <option
                            className="dark:bg-gray-950"
                            key={category.id}
                            value={category.id}
                          >
                            {category.label}
                          </option>
                        ))}
                      </select>
                      {errors.categoryId && (
                        <p className="mt-1 flex items-center gap-1 text-sm text-red-600">
                          <AlertCircle className="h-3 w-3" />
                          {errors.categoryId.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-500">
                        Client Type
                      </label>
                      <select
                        disabled={mode == "view"}
                        {...register("clientTypeId")}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      >
                        <option className="dark:bg-gray-950" value=""></option>

                        {references.clientType.map((clientType) => (
                          <option
                            className="dark:bg-gray-950"
                            key={clientType.id}
                            value={clientType.id}
                          >
                            {clientType.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Row: Due Date & Value */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-500">
                        Due Date <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Calendar className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                          disabled={mode == "view"}
                          {...register("dueDate")}
                          type="date"
                          className={`w-full rounded-lg border py-2 pr-3 pl-10 transition-all focus:ring-2 focus:outline-none ${errors.dueDate ? "border-red-300 focus:border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"}`}
                        />
                      </div>
                      {errors.dueDate && (
                        <p className="mt-1 flex items-center gap-1 text-sm text-red-600">
                          <AlertCircle className="h-3 w-3" />
                          {errors.dueDate.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-500">
                        Value ($) <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                          disabled={mode == "view"}
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
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-500">
                      Notes
                    </label>
                    <textarea
                      disabled={mode == "view"}
                      {...register("notes")}
                      rows={3}
                      className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="Add any additional notes..."
                    />
                  </div>
                </div>
              </div>
              {/* Footer */}

              {mode != "view" && (
                <div className="flex items-center justify-end gap-3 border-t border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-900">
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-600 hover:shadow-md"
                  >
                    {mode == "edit" && "Update Order"}
                    {mode == "add" && "Create Order"}
                    {mode == "add-link" && "Link Order"}
                  </button>
                </div>
              )}
            </form>
          </motion.div>
        </div>
      </AnimatePresence>
    </>
  );
}
