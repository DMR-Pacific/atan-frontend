import { FormProvider, useForm } from "react-hook-form";
import EditableTextCell from "../../cells/TextAreaCell";
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
} from "@/components/ui/tooltip"
import { Building2, ChevronRight, Clock, DollarSign, History, PersonStanding, Plus, Unlink } from "lucide-react";

import SubClientOrdersCollapsible from "./SubClientOrdersCollapsible";
import { DmrOrderMaster } from "@/types/orders/DmrOrderTypes";
import { DMR_ORDERS_HEADERS } from "./DmrOrdersSubTable";
import ManufacturerOrdersSubtable from "../manufacturerOrder/ManufacturerOrdersSubTable";
import AssociatedBadge from "../../badges/AssociatedBadge";
import { TableName } from "@/types/api/TableName";
import InputCell from "@/components/cells/InputCell";
import { getValueAsType } from "framer-motion";

interface DmrOrderRowProps {
    dmrOrderMaster: DmrOrderMaster
    handleOrderCheck: (orderId: number) => void
    isSelectDisabled: boolean
    warnUnlink?: (orderId: number) => void
    expandable: boolean
    checked: boolean

}


    

const mapDmrOrderToForm =(dmrOrderMaster: DmrOrderMaster): any => {

    const updateDto: any = {
        label: dmrOrderMaster.label,
        statusId: dmrOrderMaster.statusId,

        orderDate: dmrOrderMaster.orderDate,
        dueDate: dmrOrderMaster.dueDate,

        estimatedArrival: dmrOrderMaster.estimatedArrival,

        notes: dmrOrderMaster.notes,

        value: dmrOrderMaster.value, 

        assignedUsers: dmrOrderMaster.assignedUsers.map((userDto) => userDto.id)
      

    }
    return updateDto
}


export default function DmrOrderRow ({
    dmrOrderMaster, 
    warnUnlink,
    handleOrderCheck,
    isSelectDisabled, 
    expandable,
    checked
} : DmrOrderRowProps) {

    const { 
        openHistoryDrawer, 
        references, 
        doUpdateDmrOrder,
        doAssignUserDmrOrder,
        doUnassignUserDmrOrder,
        handleShowManufacturerOrderModal,
    } = useOrdersContext()
    const [isExpanded, setIsExpanded] = useState<boolean>(false)
    const [subtableMode, setSubtableMode] = useState<TableName>('manufacturer_orders')
    const methods = useForm({
      defaultValues: mapDmrOrderToForm(dmrOrderMaster)
    })
    const { watch, setValue, getValues } = methods

    useEffect(() => {

        methods.reset(mapDmrOrderToForm(dmrOrderMaster))
    }, [dmrOrderMaster])

    useEffect(() => {
        if (dmrOrderMaster.id == 405) {
            console.log("DMRORDERMASTERz", dmrOrderMaster)

        }
    }, [subtableMode, dmrOrderMaster])


    const createDmrOrderDateChangeHandler = (fieldName: string) => {
      return (date: Date | string | undefined) => {
        let updateDto = {
            [fieldName]: date
        }
        doUpdateDmrOrder(dmrOrderMaster.id, updateDto)
      }
    }

    const createDmrOrderChangeRefHandler = (fieldName: "statusId" | "priorityId") => {
        return async (optionId: number) => {
        const updateDto = {
            [fieldName]: optionId
        }


        try {
            await doUpdateDmrOrder(dmrOrderMaster.id, updateDto)

            setValue(fieldName, optionId, {
                shouldDirty: true,
                shouldTouch: true,
                shouldValidate: true,
            })
        } catch (err) {
            toast.error(`Changes were not saved (${fieldName}). Please try again later.`)

            console.log(err)
        }


        }
    }

    const toggleSubtableMode = () => {
        if (subtableMode == "client_orders") {
            setSubtableMode("manufacturer_orders") 
        } else {
            setSubtableMode("client_orders")
        }
    }

    const HEADERS_COLUMN_SIZE_STR: string = DMR_ORDERS_HEADERS.reduce((acc, next) => {
        if (!acc) return next.width || ""
        return acc+"_"+next.width
    }, "")


    return (

        <FormProvider {...methods} >

                {/* Row */}
                <div  className={`grid grid-cols-[${HEADERS_COLUMN_SIZE_STR}] gap-0 border-y border-gray-200 dark:border-gray-700 text-xs text-gray-500 font-medium`}>
                    {/* Checkbox */}
                    <div className="flex gap-2 justify-center items-center h-full border-r border-gray-100 dark:border-gray-700 ">
                        <input
                            checked={checked}
                            onChange={() => handleOrderCheck(dmrOrderMaster.id)}
                            disabled={isSelectDisabled}
                            type="checkbox"
                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                        {warnUnlink &&
                        <button 
                            onClick={() => warnUnlink(dmrOrderMaster.id)}
                            className='hover:text-red-600 transition-colors'
                        >
                            <Unlink size={16} />

                        </button>}
                    </div>
                    <div className='group border-r border-gray-100  dark:border-gray-700 flex items-center gap-1 flex-1 truncate px-2'>
                        {/* Expandable */}
                        {expandable &&
                        <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center text-[10px] text-gray-900 dark:text-gray-200 rounded">
                            {(dmrOrderMaster.clientOrderIds && dmrOrderMaster.clientOrderIds.length > 0) ?

                            <Tooltip>
                            <TooltipTrigger
                                onClick={() => setIsExpanded(prev => !prev)}
                            >
                            
                                <ChevronRight
                                    className={`transition duration-100 ${isExpanded ? 'rotate-90': 'rotate-0'}`}
                                />
                            </TooltipTrigger>
                            <TooltipContent>
                                View Client Orders
                            </TooltipContent>
                            </Tooltip>:
                            <Tooltip>
                            <TooltipTrigger
                                onClick={() => setIsExpanded(prev => !prev)}              
                            >
                    
                                <ChevronRight
                                    className={`opacity-0 group-hover:opacity-40 transition duration-100 ${isExpanded ? 'rotate-90 opacity-100': 'rotate-0 opacity-0'}`}
                                />
                            </TooltipTrigger>
                            <TooltipContent>
                                Add Client Orders
                            </TooltipContent>
                            </Tooltip>

                            
                            }
                        </span>}
                        <InputCell
                            id={dmrOrderMaster.id}
                            fieldName='label'
                            handleUpdate={() => doUpdateDmrOrder(dmrOrderMaster.id, {label: getValues("label")})}
                        />
                    </div>

                    <div className="px-2 py-2 flex justify-center border-r border-gray-100  dark:border-gray-700 h-full items-center">

                        <AssignedToCell 
                            assignedToList={dmrOrderMaster.assignedUsers} 
                            handleUnassign={(userIdToUnassign: number) => {
                                doUnassignUserDmrOrder(userIdToUnassign, dmrOrderMaster.id)
                            }}
                            handleAssign={(userIdToAssign: number) => {
                                doAssignUserDmrOrder(userIdToAssign, dmrOrderMaster.id)

                            }}
                        />
                    
                    </div>

                    {/* Status */}
                    <SelectCellWrapper>

                        <HoverSelect
                            id={dmrOrderMaster.id}
                            fieldName='statusId'
                            fields={references.status}
                            handleChangeSelect={createDmrOrderChangeRefHandler('statusId')}
                        />
                    </SelectCellWrapper>


                    {/* Order Date */}
                    <DateCell 
                        fieldName="orderDate"
                        handleChangeDate={createDmrOrderDateChangeHandler('orderDate')}
                    />

                    {/* Estimated arrival */}
                    <DateCell 
                        fieldName="estimatedArrival"
                        handleChangeDate={createDmrOrderDateChangeHandler('estimatedArrival')}
                    />

                    {/* notes  */}
                    <div
                        className="group flex items-center"
                    >

                        <EditableTextCell
                            id={dmrOrderMaster.id}
                            fieldName='notes'
                            handleUpdate={() => doUpdateDmrOrder(dmrOrderMaster.id, {notes: getValues("notes")})}
                            rows={2}
                        />
                        <button
                            type="button"
                            onClick={() => openHistoryDrawer('dmr_orders','notes', dmrOrderMaster.id )}
                        >
                            <History className="text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" size={20} />
                        </button>
                    </div>


                </div>


                {/* Collapsible */}
                {expandable &&
                <div>
                    {isExpanded && (
                    <div className="bg-opacity-80 border-t border-gray-100   grid grid-cols-[40px_1fr]">
                        <div className=" flex-shrink-0 border-r border-gray-100 dark:border-gray-400 relative">
                            <div 
                                style={{backgroundColor: 'gray'}}
                                className="h-full absolute top-0 bottom-4 left-1/2 w-[2px] bg-gray-200 opacity-30 -translate-x-1/2 rounded-b-full"
                            />
                        </div>
                        <div className='px-4 py-6'>
                            <div className='flex items-center justify-between'>

                                <div className = "flex items-center gap-2 mb-3">
                                
                                    <div className="inline-flex items-center gap-1 bg-white  dark:bg-gray-900 dark:border-gray-700 dark:text-gray-200 rounded-md border border-gray-200 p-0.5">
                                        <button
                                            type='button'

                                            onClick={toggleSubtableMode}
                                            className={`p-1.5 rounded transition-all ${subtableMode === 'manufacturer_orders' ? 'bg-blue-50 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                                            title="Card view"
                                        >
                                            <Building2 className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                            type='button'
                                            onClick={toggleSubtableMode}
                                            className={`p-1.5 rounded transition-all ${subtableMode === 'client_orders' ? 'bg-blue-50 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                                            title="Table view"
                                        >
                                            <PersonStanding className="w-3.5 h-3.5" />
                                        </button>
                                    </div>

                                    <AssociatedBadge
                                        associations={((): number => {
                                            if (subtableMode == "client_orders") return dmrOrderMaster.clientOrderIds.length
                                            else return dmrOrderMaster.manufacturerOrderIds.length
                                        })()}
                                        type={subtableMode}
                                    />
                                
                                </div>
                                <div>
                                    
                                    {subtableMode == 'manufacturer_orders' && 
                                    <button 
                                        className=" py-2 px-4 text-xs bg-blue-500 hover:bg-blue-600 rounded-lg text-white gap-2 flex transition-colors"
                                        onClick={() => handleShowManufacturerOrderModal('add', undefined, dmrOrderMaster.id, () => {} )}
                                    >
                                        <Plus size={14}/>
                                    </button>}
                                </div>
                            </div>

                            {subtableMode == 'client_orders' && 
                            <SubClientOrdersCollapsible
                                subOrderIds={dmrOrderMaster.clientOrderIds}
                                parentId={dmrOrderMaster.id}
                                />}
                            {subtableMode == 'manufacturer_orders' && 
                            <ManufacturerOrdersSubtable 
                                manufacturerOrderIds={dmrOrderMaster.manufacturerOrderIds}
                                parentId={dmrOrderMaster.id}
                            />
                            }
                        </div>
                    </div>
                        
                    )}

                </div>}

        </FormProvider>

    )
}

