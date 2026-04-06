import { useOrdersContext } from "@/context/OrdersContext"
import { useAssignableUsers } from "@/hooks/useAssignableUsers"

import { AlertCircle, Calendar, DollarSign, Plus, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form"
import { toast } from "sonner"
import { ManufacturerOrderForm, mapManufacturerOrderFormToAddDto, mapManufacturerOrderFormToUpdateDto } from "@/types/orders/ManufacturerOrderTypes"


interface ManufacturerOrderModalProps {
    isOpen: boolean
    onClose: () => void
}

export default function ManufacturerOrderModal ({
    isOpen, 
    onClose,
    
}: ManufacturerOrderModalProps ){

    const { masterManufacturerOrders,references, manufacturerOrderModalOptions: {mode, orderId, linkToOrderId, onSubmit}, doAddManufacturerOrder, doUpdateManufacturerOrder} = useOrdersContext()
    const [isNotesExpanded, setIsNotesExpanded] = useState<boolean>(false)
    const modalRef = useRef<HTMLDivElement>(null)
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const { register, watch, control, handleSubmit, formState: { errors}, setValue, reset} = useForm<ManufacturerOrderForm>({
        defaultValues: {
            orderNumber: '',
    notes: ''
        }
    })


    // adjust text area height when notes is expanded
    useEffect(() => {
        if (!textareaRef.current) return
        if (isNotesExpanded) {

            textareaRef.current.style.height = 'auto'
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
        }
    }, [isNotesExpanded])

    // Collapse when clicking elsewhere in modal
    // Note: previously, we'd recollapse when clicking anywhere outside the textarea, 
    // however Riche often needs it to stay visible (uncollapsed) when viewing from another tab, 
    // so we restrict minimizing textarea to clicking within modal only
    useEffect(() => {   
        // only runs is notes is expanded and modal is rendered
        if (!isNotesExpanded || !modalRef.current) return
        const handleClickInModal = (e: MouseEvent) => {

            //  if textarea is rendered and you click not on it, unexpand notes
            if (textareaRef.current && !textareaRef.current.contains(e.target as Node)) {
                setIsNotesExpanded(false)
            }
        }

    }, [isNotesExpanded])

    useEffect(() => {
        if (!isOpen) return 
        if (mode == 'add') {
            if (!linkToOrderId) {
                 toast.error('An error occurred linking a manufacturer order to DMR order.')
                 return
            }

            reset({
                dmrOrderId: linkToOrderId
            })
        } else if (mode =='edit' || mode == 'view') {
            if (!orderId) {
                toast.error('An orderId is required to view or edit a manufacturer order.')
                return 
            }
            if (!masterManufacturerOrders[orderId]) {
                toast.error('Order ID not found in master')
                return
            }

            const order = masterManufacturerOrders[orderId]
            reset({
                orderNumber: order.orderNumber,
                estimatedArrival: order.estimatedArrival,
                notes: order.notes,
                statusId: order.statusId
            })

        }



    }, [isOpen])

    const submitHandler: SubmitHandler<ManufacturerOrderForm> = async (data) => {
        if (mode == 'add' || mode == 'add-link') {
            await doAddManufacturerOrder(mapManufacturerOrderFormToAddDto(data))
        } else if (mode == 'edit') {
            if (orderId == undefined) return
            await doUpdateManufacturerOrder(orderId, mapManufacturerOrderFormToUpdateDto(data))
        }
        
        // Reset form
        reset()
        onClose()

        if (onSubmit) {
            onSubmit()
        }

    }
    if (!isOpen) return null
    console.log(watch())
    return (
        <>
            <div
                className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 animate-in fade-in duration-200"
                onClick={onClose}
            />

            {/* Modal */}
            <div ref={modalRef}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none ">
                <div
                    className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh]  overflow-hidden pointer-events-auto animate-in zoom-in-95 fade-in duration-200"
                    onClick={(e) => e.stopPropagation()}
                >

                    <form
                    
                        onSubmit={handleSubmit(submitHandler)}
                    >


                            {/* Header */}
                            <div className="flex flex-shrink-0 items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradiant-to-r from-blue-50 to white">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                        <Plus className="w-5 h-5 text-blue-600"/>

                                    </div>
                                    {mode == 'view' &&
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-200">
                                            {watch('orderNumber')}
                                        </h2>
                                    </div>}
                                    {mode == 'add' &&
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-200">
                                            Add New Order
                                        </h2>
                                        <p className="text-sm text-gray-500 mt-0.5">
                                            Create a new manufacturer order
                                        </p>
                                    </div>}
                                    {mode == 'edit' &&
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-200">
                                            Edit Order
                                        </h2>
                                        <p className="text-sm text-gray-500 mt-0.5">
                                            Order: <span className="font-medium text-gray-500">{watch('orderNumber')}</span> 
                                        </p>
                                    </div>}
                                </div>
                                <button
                                    type='button'
                                    className="rounded-lg p-2 hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-white transition-colors"
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
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
                                                Order Number <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all ${errors.orderNumber ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'}`}
                                                {...register('orderNumber')}
                                                placeholder="e.g., PO# P2600152_GCC"

                                            />

                                            {errors.orderNumber && (
                                            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                                <AlertCircle className="w-3 h-3" />
                                                {errors.orderNumber.message}
                                            </p>
                                            )}
                                        </div>

              
                                        {/* Row: Status & Priority */}
                                        <div className=" grid grid-cols-2 gap-4">
                                            <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
                                                Status
                                            </label>
                                            <select
                                                {...register('statusId')}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            >
                                                    <option className="dark:bg-gray-800" value=""></option>

                                                {references.status.map((status) => (
                                                <option className="dark:bg-gray-800" key={status.id} value={status.id}>
                                                    {status.label}
                                                </option>
                                                ))}
                                            </select>
                                            </div>
                                            <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
                                                Estimated Arrival
                                            </label>
                                            <div className="relative">
                                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                <input
                                                    {...register('estimatedArrival')}
                                                    type="date"

                                                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all ${errors.estimatedArrival ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'}`}
                                                />
                                            </div>
                                            {errors.estimatedArrival && (
                                                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                                <AlertCircle className="w-3 h-3" />
                                                    {errors.estimatedArrival.message}
                                                </p>
                                            )}
                                            </div>
                                        </div>
                
                   

                                        {/* Notes */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
                                            Notes
                                            </label>
                                            <textarea
                                            onClick={() => {setIsNotesExpanded(true)}}
                                                {...register('notes')}
                                                rows={3}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none h-72"
                                                placeholder="Add any additional notes..."
                                            />
                                        </div>
                                    </div>
                                </fieldset>

                            </div>

                            {/* Footer */}
                            {mode != 'view' && <div className="flex flex-shrink-0 items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50 dark:bg-gray-950 dark:border-gray-700">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white transition-colors"
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
            
                    </form>

                </div>
            </div>
        </>

    )
}