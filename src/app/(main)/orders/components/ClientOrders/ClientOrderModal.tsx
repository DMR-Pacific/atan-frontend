import { useOrdersContext } from "@/context/OrdersContext"
import { useAssignableUsers } from "@/hooks/useAssignableUsers"
import { addClientOrder } from "@/services/OrderService"
import { ClientOrderAddDto } from "@/types/orders/ClientOrderAddDto"
import { ClientOrderDto } from "@/types/orders/ClientOrderDto"
import { ClientOrderFormData, mapFormToAddDto, mapFormToUpdateDto } from "@/types/orders/ClientOrderFormData"
import { AnimatePresence, motion } from "framer-motion"
import { AlertCircle, Calendar, DollarSign, Plus, X } from "lucide-react"
import { useEffect } from "react"
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form"
import { toast } from "sonner"

interface ClientOrderModalProps {
    isOpen: boolean
    onClose: () => void
}

const DEFAULT_FORM = {
    label: '',
    assignedToIdList: [],
    dueDate: '',
    notes: '',
    value: 0,
}


export default function ClientOrderModal ({
    isOpen, 
    onClose,
}: ClientOrderModalProps ){
    const { 
        masterDmrOrders,
        masterClientOrders, 
        clientOrderModalOptions: {orderId, mode, linkToOrderId, onSubmit}, 
        assignableUsers, 
        references, 
        doAddClientOrder,
        doUpdateClientOrder,
    } = useOrdersContext()

    const { register, watch, control, handleSubmit, formState: { errors}, setValue, reset} = useForm<ClientOrderFormData>({
        defaultValues: DEFAULT_FORM
    })

    const assignedToIdList = watch('assignedToIdList')

    useEffect(() => {
        if (mode == 'add-link') {
            reset({
                ...DEFAULT_FORM,
                dmrOrderIds: [linkToOrderId]
        })
        }
        if (!orderId || !(mode =='edit' || mode == 'add-link')) return
        if (orderId && !masterClientOrders[orderId]) return

        const order = masterClientOrders[orderId]

        const tempDmrOrderIds = [...order.dmrOrders]
        if (linkToOrderId) tempDmrOrderIds.push(linkToOrderId)
        reset({
            label: order.label,
            assignedToIdList: order.assignedToList.map(assignedU => (assignedU.id)),
            dueDate: order.dueDate,
            statusId: order.statusId,
            priorityId: order.priorityId,
            categoryId: order.categoryId,
            clientTypeId: order.clientTypeId,
            notes: order.notes,
            value: order.value,
            dmrOrderIds: tempDmrOrderIds || []
        })


    }, [isOpen, orderId, mode, linkToOrderId])

    const handleUserClick = (clickedId: number) => {
        
        if (!assignedToIdList.includes(clickedId)) setValue('assignedToIdList', [...assignedToIdList, clickedId]) // add to assignments

        else setValue('assignedToIdList', assignedToIdList.filter(assignedId => assignedId != clickedId)) // remove from assignments

    }


    const submitHandler: SubmitHandler<ClientOrderFormData> = async (data) => {
        console.log(data)

        if (mode == 'add' || mode == 'add-link') {
            await doAddClientOrder(mapFormToAddDto(data))

        } else if (mode == 'edit') {
            if (orderId == undefined) return
            await doUpdateClientOrder(orderId, mapFormToUpdateDto(data))
        }

        // Reset form

        if (onSubmit) onSubmit()
        reset()
        onClose()


    }


    if (!isOpen) return null
    if (mode =='edit' && orderId == undefined) return <div>No client order id to edit</div>
    if (mode =='add-link' && !linkToOrderId) return  <div>No dmr order id passed to link</div>

    return (
        <>
            <div
                className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 animate-in fade-in duration-200"
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
                    className="relative w-full max-w-3xl bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                    >
                        <form
                        
                            onSubmit={handleSubmit(submitHandler)}
                        >

                            {/* Header */}
                            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradiant-to-r from-blue-50 to white">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                        <Plus className="w-5 h-5 text-blue-600"/>

                                    </div>
                                    {mode == 'add' &&
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900">
                                            Add New Order
                                        </h2>
                                        <p className="text-sm text-gray-500 mt-0.5">
                                            Create a new client order
                                        </p>
                                    </div>}
                                    {mode == 'add-link' &&
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900">
                                            Link New Client Order
                                        </h2>
                                        <p className="text-sm text-gray-500 mt-0.5">
                                            Create a new client order to link
                                        </p>
                                    </div>}
                                    {mode == 'edit' &&
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900">
                                            Edit Order
                                        </h2>
                                        <p className="text-sm text-gray-500 mt-0.5">
                                            Order: <span className="font-medium text-gray-500">{watch('label')}</span> 
                                        </p>
                                    </div>}
                                </div>
                                <button
                                    type='button'
                                    className="rounded-lg p-2 hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
                                    onClick={onClose}
                                >
                                    <X className="w-5 h-5" />

                                </button>

                            </div>
                            {/* Form */}
                            
                            <div 
                                className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]"
                            >
                                <div className='space-y-5'>

                                    {/* Order Number */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Order Number <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all ${errors.label ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'}`}
                                            {...register('label')}
                                            placeholder="e.g., PO# P2600152_GCC"

                                        />

                                        {errors.label && (
                                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                            <AlertCircle className="w-3 h-3" />
                                            {errors.label.message}
                                        </p>
                                        )}
                                    </div>

                                    {/* Owners */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Assigned To    
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {assignableUsers.map((u, i) => (
                                                <button
                                                    type='button'

                                                    key={i}
                                                    onClick={() => {handleUserClick(u.id)}}
                                                    className={`px-3 py-1.5 rounded-full font-medium text-sm transition-all ${assignedToIdList.includes(u.id) ? 'bg-blue-100 ring-2 ring-offset-2 ring-blue-500' : 'text-gray-600 bg-gray-100 hover:bg-gray-200'}`}
                                                >
                                                    {(u.firstName.charAt(0) + u.lastName.charAt(0))}
                                                </button>
                                            ))

                                            }
                                        </div>
                                        {errors.assignedToIdList && (
                                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                            <AlertCircle className="w-3 h-3" />
                                            {errors.assignedToIdList.message}
                                        </p>
                                        )}
                                    </div>
                                    {/* Row: Status & Priority */}
                                    <div className=" grid grid-cols-2 gap-4">
                                        <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Status
                                        </label>
                                        <select
                                            {...register('statusId')}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                                <option value=""></option>

                                            {references.status.map((status) => (
                                            <option key={status.id} value={status.id}>
                                                {status.label}
                                            </option>
                                            ))}
                                        </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Priority
                                            </label>
                                            <select
                                                {...register('priorityId')}
                                    
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            >
                                                <option value=""></option>

                                                {references.priority.map((priority) => (
                                                <option key={priority.id} value={priority.id}>
                                                    {priority.label}
                                                </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Category
                                            </label>
                                            <select
                                                {...register('categoryId')}
                                    
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            >
                                                <option value=""></option>

                                                {references.category.map((category) => (
                                                <option key={category.id} value={category.id}>
                                                    {category.label}
                                                </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Client Type
                                            </label>
                                            <select
                                                {...register('clientTypeId')}
                                    
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            >
                                                <option value=""></option>

                                                {references.clientType.map((clientType) => (
                                                <option key={clientType.id} value={clientType.id}>
                                                    {clientType.label}
                                                </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
            
                                    {/* Row: Due Date & Value */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Due Date <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input
                                                {...register('dueDate')}
                                                type="date"

                                                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all ${errors.dueDate ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'}`}
                                            />
                                        </div>
                                        {errors.dueDate && (
                                            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                            <AlertCircle className="w-3 h-3" />
                                                {errors.dueDate.message}
                                            </p>
                                        )}
                                        </div>

                                        <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Value ($) <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input
                                                type="number"
                                                step="0.01"
                                                {...register('value')}
                                                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all ${errors.value ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'}`}
                                                placeholder="0.00"
                                            />
                                        </div>
                                        {errors.value && (
                                            <p className=" text-sm text-red-600 flex items-center gap-1">
                                            <AlertCircle className="w-3 h-3" />
                                            {errors.value.message}
                                            </p>
                                        )}
                                        </div>
                                    </div>

                                    {/* Notes */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Notes
                                        </label>
                                        <textarea
                                            {...register('notes')}
                                            rows={3}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                                            placeholder="Add any additional notes..."
                                        />
                                    </div>

                                </div>

                            </div>
                            {/* Footer */}
                            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type='submit'
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors shadow-sm hover:shadow-md"
                                >
                                    {mode == 'edit' && 'Update Order'}
                                    {mode == 'add' && 'Create Order'}
                                    {mode == 'add-link' && 'Link Order'}


                                </button>
                            </div>
                        </form>

                    </motion.div>
                </div>
    </AnimatePresence>
        </>

    )
}