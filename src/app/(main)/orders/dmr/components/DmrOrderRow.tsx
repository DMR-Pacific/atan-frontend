import { FormProvider, useForm } from "react-hook-form";
import EditableTextCell from "../../components/cells/EditableTextCell";
import AssignedToCell from "../../components/cells/AssignedToCell";
import HoverSelect from "../../components/cells/HoverSelect";
import { useOrdersContext } from "@/context/OrdersContext";
import { DmrOrderDto } from "@/types/orders/DmrOrderDto";
import { SelectCellWrapper } from "../../components/cells/SelectCellWrapper";
import DateCell from "../../components/cells/DateCell";

import { DmrOrder } from "@/types/orders/DmrOrder";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ChevronRight, Clock, DollarSign, History, Unlink } from "lucide-react";
import { useDmrOrdersTableContext } from "@/context/DmrOrdersTableContext";
import { ClientOrderDto } from "@/types/orders/ClientOrderDto";
import { ClientOrder } from "@/types/orders/ClientOrder";
import DmrOrderCard from "./DmrOrderCard";
import ClientOrderCard from "../../components/ClientOrders/ClientOrderCard";
import ToggleView from "../../components/ToggleView";
import { ViewMode } from "@/types/ViewMode";
import { ClientOrderRow } from "../../components/ClientOrders/ClientOrderRow";
import { ClientOrderHeader } from "../../components/ClientOrders/ClientOrderHeader";
import SubClientOrdersCollapsible from "./SubClientOrdersCollapsible";
import { DmrOrderMaster } from "@/types/orders/DmrOrderMaster";
import { DMR_ORDERS_HEADERS } from "../../components/DmrOrders/DmrOrdersSubTable";

interface DmrOrderRowProps {
    dmrOrder: DmrOrderMaster
    handleOrderCheck: (orderId: number) => void
    isSelectDisabled: boolean
    warnUnlink?: (orderId: number) => void
    expandable: boolean
    checked: boolean

}


    

const mapDmrOrderToForm =(dmrOrder: DmrOrderMaster): any => {

    const updateDto: any = {
      label: dmrOrder.label,
      priorityId: dmrOrder.priorityId,
      statusId: dmrOrder.statusId,

      orderDate: dmrOrder.orderDate,
      dueDate: dmrOrder.dueDate,

      estimatedArrival: dmrOrder.estimatedArrival,

      notes: dmrOrder.notes,

      value: dmrOrder.value, 

      assignedToIdList: dmrOrder.assignedToList.map((assignedToDto) => assignedToDto.id)
      

    }
    return updateDto
}


export default function DmrOrderRow ({
    dmrOrder, 
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
    } = useOrdersContext()
    const [isExpanded, setIsExpanded] = useState<boolean>(false)
    const methods = useForm({
      defaultValues: mapDmrOrderToForm(dmrOrder)
    })
    const { watch, setValue } = methods

    useEffect(() => {
        methods.reset(mapDmrOrderToForm(dmrOrder))
    }, [dmrOrder])



    const createDmrOrderDateChangeHandler = (fieldName: string) => {
      return (date: Date | string | undefined) => {
        let updateDto = {
            ...watch(),
            [fieldName]: date
        }
        doUpdateDmrOrder(dmrOrder.id, updateDto)
      }
    }

    const createDmrOrderChangeRefHandler = (fieldName: "statusId" | "priorityId") => {
        return async (optionId: number) => {
        const updateDto = {
            ...watch(),
            [fieldName]: optionId
        }


        try {
            await doUpdateDmrOrder(dmrOrder.id, updateDto)

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

const HEADERS_COLUMN_SIZE_STR: string = DMR_ORDERS_HEADERS.reduce((acc, next) => {
    if (!acc) return next.width || ""
    return acc+"_"+next.width
    }, "")


    return (

        <FormProvider {...methods} >

                {/* Row */}
                <div  className={`grid grid-cols-[${HEADERS_COLUMN_SIZE_STR}] gap-0 border-y border-gray-200 bg-white text-xs text-gray-500 font-medium`}>
                    {/* Checkbox */}
                    <div className="flex gap-2 justify-center items-center h-full border-r border-gray-100 bg-gray-50/30">
                        <input
                            checked={checked}
                            onChange={() => handleOrderCheck(dmrOrder.id)}
                            disabled={isSelectDisabled}
                            type="checkbox"
                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                        {warnUnlink &&
                        <button 
                            onClick={() => warnUnlink(dmrOrder.id)}
                            className='hover:text-red-600 transition-colors'
                        >
                            <Unlink size={16} />

                        </button>}
                    </div>
                    <div className='group border-r border-gray-100 flex items-center gap-1 flex-1 truncate px-2'>
                        {/* Expandable */}
                        {expandable &&
                        <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center text-[10px] text-gray-900 rounded">
                            {(dmrOrder.clientOrders && dmrOrder.clientOrders.length > 0) ?

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
                        <EditableTextCell
                            id={dmrOrder.id}
                            fieldName='label'
                            handleUpdate={() => doUpdateDmrOrder(dmrOrder.id, watch())}
                        />
                    </div>

                    <div className="px-2 py-2 flex justify-center border-r border-gray-100 h-full items-center">

                        <AssignedToCell 
                            assignedToList={dmrOrder.assignedToList} 
                            handleUnassign={(userIdToUnassign: number) => {
                                doUnassignUserDmrOrder(userIdToUnassign, dmrOrder.id)
                            }}
                            handleAssign={(userIdToAssign: number) => {
                                doAssignUserDmrOrder(userIdToAssign, dmrOrder.id)

                            }}
                        />
                    
                    </div>

                    {/* Status */}
                    <SelectCellWrapper>

                        <HoverSelect
                            id={dmrOrder.id}
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
                            id={dmrOrder.id}
                            fieldName='notes'
                            handleUpdate={() => doUpdateDmrOrder(dmrOrder.id, watch())}
                            rows={2}
                        />
                        <button
                            type="button"
                            onClick={() => openHistoryDrawer('dmr_orders','notes', dmrOrder.id )}
                        >
                            <History className="text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" size={20} />
                        </button>
                    </div>


                </div>
                {/* Collapsible */}
                {expandable &&
                <div>
                    {isExpanded && dmrOrder.clientOrders && (
                    <SubClientOrdersCollapsible
                        subOrderIds={dmrOrder.clientOrders}
                        parentId={dmrOrder.id}
                    />)}
                </div>}

        </FormProvider>

    )
}

