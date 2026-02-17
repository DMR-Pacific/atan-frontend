import { useOrdersContext } from "@/context/OrdersContext"
import { useAssignableUsers } from "@/hooks/useAssignableUsers"
import { addClientOrder, updateDmrOrder } from "@/services/OrderService"
import { DmrOrderUpdateDto } from "@/types/orders/DmrOrderUpdateDto"
import { ClientOrderAddDto } from "@/types/orders/ClientOrderAddDto"
import { DmrOrderDto } from "@/types/orders/DmrOrderDto"
import { AlertCircle, Calendar, DollarSign, Plus, X } from "lucide-react"
import { useEffect } from "react"
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form"
import { toast } from "sonner"
import SubClientOrdersCollapsible from "./SubClientOrdersCollapsible"
import ClientOrderCard from "../../components/ClientOrders/ClientOrderCard"
import AssociatedBadge from "../../components/AssociatedBadge"

interface DmrOrderModalProps {
    isOpen: boolean
    onClose: () => void
    dmrOrderDto?: DmrOrderDto
}

export default function DmrOrderModal ({
    isOpen, 
    onClose,
    
}: DmrOrderModalProps ){
    const { masterDmrOrders, masterClientOrders, dmrOrderModalOptions: {mode, orderId, onSubmit}, doAddDmrOrder, doUpdateDmrOrder} = useOrdersContext()
    const { register, watch, control, handleSubmit, formState: { errors}, setValue, reset} = useForm<DmrOrderUpdateDto>({
        defaultValues: {
            label: '',
            assignedToIdList: [],
            orderDate: '',
            notes: '',
            value: 0,
        }
    })

    const assignedToIdList = watch('assignedToIdList')

    useEffect(() => {
        if (!orderId || !(mode =='edit' || mode == 'view')) return
        if (!masterDmrOrders[orderId]) return

        const order = masterDmrOrders[orderId]
        reset({
            label: order.label,
            assignedToIdList: order.assignedToList.map(assignedU => (assignedU.id)),
            orderDate: order.orderDate,
            notes: order.notes,
            value: order.value
        })
    }, [isOpen])

    const handleUserClick = (clickedId: number) => {
        
        if (!assignedToIdList.includes(clickedId)) setValue('assignedToIdList', [...assignedToIdList, clickedId]) // add to assignments

        else setValue('assignedToIdList', assignedToIdList.filter(assignedId => assignedId != clickedId)) // remove from assignments

    }


    const {assignableUsers, references} = useOrdersContext()
    const submitHandler: SubmitHandler<DmrOrderUpdateDto> = async (data) => {
        console.log("DMR UPDATE" , data)
        if (mode == 'add' || mode == 'add-link') {
            await doAddDmrOrder((data))
        } else if (mode == 'edit') {
            if (orderId == undefined) return
            await doUpdateDmrOrder(orderId, (data))
        }
        
        // Reset form
        reset()
        onClose()

        if (onSubmit) {
            onSubmit()
        }

    }
    if (!isOpen) return null
    return (
        <>
            <div
                className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 animate-in fade-in duration-200"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none ">
                <div
                    className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh]  overflow-hidden pointer-events-auto animate-in zoom-in-95 fade-in duration-200"
                    onClick={(e) => e.stopPropagation()}
                >

                    <form
                    
                        onSubmit={handleSubmit(submitHandler)}
                    >


                            {/* Header */}
                            <div className="flex flex-shrink-0 items-center justify-between p-6 border-b border-gray-200 bg-gradiant-to-r from-blue-50 to white">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                        <Plus className="w-5 h-5 text-blue-600"/>

                                    </div>
                                    {mode == 'view' &&
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900">
                                            {watch('label')}
                                        </h2>
                                    </div>}
                                    {mode == 'add' &&
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900">
                                            Add New Order
                                        </h2>
                                        <p className="text-sm text-gray-500 mt-0.5">
                                            Create a new dmr order
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
                                className="flex-shrink-0 p-6 overflow-y-auto max-h-[calc(90vh-140px)]"
                            >
                                <fieldset disabled={mode == 'view'} >

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
                                        </div>
                
                                        {/* Row: Due Date & Value */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Order Date <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                <input
                                                    {...register('orderDate')}
                                                    type="date"

                                                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all ${errors.orderDate ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'}`}
                                                />
                                            </div>
                                            {errors.orderDate && (
                                                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                                <AlertCircle className="w-3 h-3" />
                                                    {errors.orderDate.message}
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
                                </fieldset>

                            </div>

                            {/* Footer */}
                            {mode != 'view' && <div className="flex flex-shrink-0 items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
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
                                    {mode == 'add' && 'Create Order'}
                                    {mode == 'edit' && 'Update Order'}

                                </button>
                            </div>}
                        {(orderId && mode == 'view') && 
                        <div className='p-4 flex flex-col flex-1 gap-4 '>
                            <AssociatedBadge
                                associations={masterDmrOrders[orderId].clientOrders.length}
                                type={"client_orders"}
                            />
                            <div className='grid grid-cols-2 gap-2 overflow-y-auto' >

                                {masterDmrOrders[orderId].clientOrders.map(clientId => (
                                    <ClientOrderCard 
                                        key={`clientId-${clientId}`}
                                        order={masterClientOrders[clientId]}
                                    />
                                ))}
                            </div>
                        </div>}
                    </form>

                </div>
            </div>
        </>

    )
}