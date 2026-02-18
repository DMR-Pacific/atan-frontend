import React, { ReactNode, useEffect, useState } from 'react'
// import { StatusBadge, PriorityBadge, ClientTypeBadge } from './ui/Badge'
import { Avatar } from '../../../../../components/Avatar'
import { MessageSquare, Plus, Check, Sparkles, ChevronRight, History } from 'lucide-react'
import { useReference } from '@/hooks/useReference'
import { FormProvider, useForm, UseFormWatch } from 'react-hook-form'
import { AnimatePresence, defaultValueTypes, motion} from 'framer-motion'
import { useOrdersContext } from '@/context/OrdersContext'
import EditableTextCell from '../cells/EditableTextCell'
import { ClientOrderUpdateDto } from '@/types/orders/ClientOrderUpdateDto'
import HoverSelect from '../cells/HoverSelect'
import { Calendar22 } from '@/components/form/DatePicker'
import { ClientOrderDto } from '@/types/orders/ClientOrderDto'

import AssignedToCell from '../cells/AssignedToCell'
import ClientRowCollapsible from './ClientRowCollapsible'
import DmrOrdersTable from '../DmrOrders/DmrOrdersSubTable'
import { Select } from 'react-day-picker'
import DateCell from '../cells/DateCell'
import { SelectCellWrapper } from '../cells/SelectCellWrapper'
import { ClientOrderRowContext } from '@/context/ClientOrderRowContext'

import { toast } from 'sonner'
import { useClientOrderGroupContext } from '@/context/ClientOrderGroupContext'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { BaseReferenceType } from '@/types/BaseReferenceType'
import { YesNo } from '@/types/msic'
import { ClientOrderMaster } from '@/types/orders/ClientOrderMaster'
import { useClientOrdersTableContext } from '@/context/ClientOrdersTableContext'

interface OrderRowProps {
  order: ClientOrderMaster,
  handleOrderCheck: (orderId: number) => void
  isSelectDisabled: boolean
  warnUnlink?: (orderId: number) => void
  expandable: boolean
  checked: boolean
  group?: BaseReferenceType,

}



const mapClientOrderToForm =(order: ClientOrderMaster): ClientOrderUpdateDto => {

    const updateDto: ClientOrderUpdateDto = {
      // assignedToId: 
      label: order.label,
      assignedToIdList: order.assignedToList.map(assignedTo => assignedTo.id),
      priorityId: order.priorityId,
      clientTypeId: order.clientTypeId,
      statusId: order.statusId,
      categoryId: order.categoryId,
      dueDate: order.dueDate,
      notes: order.notes,
      value: order.value, 

      dmrOrderIds: order.dmrOrders,
      // assignedToId: order.assignedTo?.id
    }
    return updateDto
}
export function ClientOrderRow({ 
    order, 
    warnUnlink,
    handleOrderCheck,
    isSelectDisabled, 
    expandable,
    checked
}: OrderRowProps) {
    if (!order) return null
    const { 
      references, 
      openHistoryDrawer, 
      doUpdateClientOrder,
      assignableUsers,
      masterClientOrders
    } = useOrdersContext()

    const [subitemOpen, setSubitemOpen] = useState<boolean>(false)
    const { doAssignUserClientOrder, doUnassignUserClientOrder} =  useOrdersContext()

    const methods = useForm<ClientOrderUpdateDto>({
      defaultValues: mapClientOrderToForm(order)

    })


    const { register, watch, formState: { errors }, handleSubmit, setValue } = methods

    const createClientOrderDateChangeHandler = (fieldName: string) => {
      return (date: Date | string | undefined) => {
        console.log("DATE", date)
        let updateDto = {
            ...watch(),
            [fieldName]: date
        }
        doUpdateClientOrder(order.id, updateDto)
      }

    }

    const createClientOrderChangeRefHandler = (fieldName: "priorityId" | "clientTypeId" | "statusId" | "categoryId" ) => {
      return async (optionId: number) => {
        const updateDto = {
            ...watch(),
            [fieldName]: optionId
        }


        try {
            await doUpdateClientOrder(order.id, updateDto)

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


    return (
    <FormProvider {...methods}>
      <ClientOrderRowContext.Provider
        value={{order}}
      >


      <div className="group grid grid-cols-[40px_minmax(250px,2fr)_minmax(80px,120px)_140px_150px_100px_minmax(200px,3fr)_100px_120px_100px] gap-0 border-b border-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors items-center min-h-[56px] text-sm text-gray-700  dark:border-gray-700">
        {/* Checkbox */}
        <div className="flex justify-center items-center h-full border-r border-gray-100 dark:border-gray-700 ">
          <input
            checked={checked}
            disabled={isSelectDisabled}
            onChange={() => {handleOrderCheck(order.id)}}
            type="checkbox"
            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer dark:bg-gray-900 dark:border-gray-700"
          />
        </div>

        {/* Client PO */}
        <div className="group px-4 py-2 flex items-center gap-2 border-r border-gray-100 h-full font-medium text-gray-900 dark:border-gray-700">
          <div className="flex items-center gap-2 flex-1 truncate">
            
              {expandable && <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center text-[10px] text-gray-900 rounded dark:text-gray-400">
                {/* {order?.dmrOrders.length > 0 &&  */}
                {order.dmrOrders.length > 0 ?

                <Tooltip>
                  <TooltipTrigger
                      onClick={() => setSubitemOpen(prev => !prev)}
                  >
                
                      <ChevronRight
                        className={`transition duration-100 ${subitemOpen ? 'rotate-90': 'rotate-0'}`}
                      />
                  </TooltipTrigger>
                  <TooltipContent>
                    View DMR Orders
                  </TooltipContent>
                </Tooltip>:
                <Tooltip>
                  <TooltipTrigger
                      onClick={() => setSubitemOpen(prev => !prev)}              
                  >
           
                      <ChevronRight
                        className={`opacity-0 group-hover:opacity-40 transition duration-100 ${subitemOpen ? 'rotate-90 opacity-100': 'rotate-0 opacity-0'}`}
                      />
                  </TooltipTrigger>
                  <TooltipContent>
                    Add DMR Orders
                  </TooltipContent>
                </Tooltip>

                
                }
              </span>}
              <EditableTextCell
                id={order.id}
                fieldName='label'
                handleUpdate={() => doUpdateClientOrder(order.id, watch())}
              />
   
          </div>
        </div>

        {/* Owner */}
        <AssignedToCell 
          assignedToList={order.assignedToList} 
          handleUnassign={(userIdToUnassign) => {
            doUnassignUserClientOrder(userIdToUnassign, order.id)
          }}
          handleAssign={(userIdToAssign) => {

            doAssignUserClientOrder(userIdToAssign, order.id)


          }}
        />
        
        {/* Status */}
        <SelectCellWrapper>
          <HoverSelect
            id={order.id}
            fieldName='statusId'
            fields={references.status}
            handleChangeSelect={createClientOrderChangeRefHandler('statusId')}

          />
        </SelectCellWrapper>

        {/* Due Date */}
        <DateCell 
          fieldName='dueDate'
          handleChangeDate={createClientOrderDateChangeHandler('dueDate')}
        />

        {/* Priority */}

        <SelectCellWrapper>

          <HoverSelect
            id={order.id}
            fieldName="priorityId"
            fields={references.priority}
            handleChangeSelect={createClientOrderChangeRefHandler('priorityId')}
          />
        </SelectCellWrapper>

        {/* Notes */}

         <div className="px-4 py-2 border-r border-gray-100 dark:border-gray-700 h-full flex items-center text-gray-600 group ">

          <EditableTextCell
            id={order.id}
            fieldName="notes"
            handleUpdate={() => doUpdateClientOrder(order.id, watch())}
          />
          <button
            type="button"
            onClick={() => openHistoryDrawer("client_orders", 'notes',  order.id)}
            className="hover:bg-blue-100 p-1 rounded-lg"
          >
            <History className="text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" size={20} />
          </button>

        </div>

        {/* Last Updated */}
        <div className="px-4 py-2 border-r border-gray-100 dark:border-gray-700 h-full flex items-center gap-2 text-xs text-gray-500">
          {/* <Avatar
            initials="RT"
            color="bg-blue-400 text-blue-900"
            className="w-5 h-5 text-[10px]"
          /> */}
          {/* <span className="truncate">{order?.lastUpdated}</span> */}
          <span>{new Date(order?.updatedAt).toLocaleDateString("en-CA")}</span>
        </div>

        {/* Value */}
        <div className="px-4 py-2 border-r border-gray-100 dark:border-gray-700 h-full flex items-center justify-end text-gray-900 font-medium text-xs">
          {/* {order?.value
            ? `$${order?.value.toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}`
            : ''} */}
            $
            <EditableTextCell
              id={order.id}
              fieldName='value'
              handleUpdate={() => doUpdateClientOrder(order.id, watch())}

            />
        </div>

        {/* Client Type */}
        <SelectCellWrapper>

              <HoverSelect
                id={order.id}
                fieldName="clientTypeId"
                fields={references.clientType}
                handleChangeSelect={createClientOrderChangeRefHandler('clientTypeId')}

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
          </motion.div>)}
        </AnimatePresence>
      </ClientOrderRowContext.Provider>

    </FormProvider>

  )
}

