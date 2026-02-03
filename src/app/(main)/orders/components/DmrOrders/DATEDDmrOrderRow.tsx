// import { FormProvider, useForm } from "react-hook-form";
// import EditableTextColumn from "../cells/EditableTextCell";
// import AssignedToCell from "../cells/AssignedToCell";
// import HoverSelect from "../cells/HoverSelect";
// import { useOrdersContext } from "@/context/OrdersContext";
// import { DmrOrderDto } from "@/types/orders/DmrOrderDto";
// import { SelectCellWrapper } from "../cells/SelectCellWrapper";
// import DateCell from "../cells/DateCell";
// import { doUpdateDmrOrder } from "@/utils/dmrOrders/doUpdateDmrOrder";
// import { doUnassignUserDmrOrder } from "@/utils/dmrOrders/doUnassignUserDmrOrder";
// import { doAssignUserDmrOrder } from "@/utils/dmrOrders/doAssignUserDmrOrder";
// import { DmrOrder } from "@/types/orders/DmrOrder";
// import { toast } from "sonner";
// import { Link2Off, Unlink } from "lucide-react";
// import { useClientOrderRowContext } from "@/context/ClientOrderRowContext";
// import { doUnlinkClientOrderDmrOrder } from "@/utils/dmrOrders/doUnlinkClientOrderDmrOrder";
// import UnlinkDmrOrderModal from "./UnlinkDmrOrderModal";
// import { useEffect, useState } from "react";
// import { useDmrOrdersSubTableContext } from "@/context/DmrOrdersSubTableContext";

// const mapDmrOrderToForm =(dmrOrder: DmrOrderDto): any => {

//     const updateDto: any = {
//       label: dmrOrder.label,
//       priorityId: dmrOrder.priorityId,
//       statusId: dmrOrder.statusId,

//       orderDate: dmrOrder.orderDate,
//       dueDate: dmrOrder.dueDate,

//       estimatedArrival: dmrOrder.estimatedArrival,

//       notes: dmrOrder.notes,

//       value: dmrOrder.value, 

      

//     }
//     return updateDto
// }


// export default function DmrOrderRow ({dmrOrder} : {dmrOrder: DmrOrderDto}) {
//     const { selectedDmrRows, setSelectedDmrRows, selectedClientRows, references } = useOrdersContext()
//     // const { fetchDmrOrdersByClientOrderId, handleOrderCheck, isSelectDisabled, warnUnlink} = useDmrOrdersSubTableContext()
//     const methods = useForm({
//       defaultValues: mapDmrOrderToForm(dmrOrder)
//     })

//     useEffect(() => {
//         methods.reset(mapDmrOrderToForm(dmrOrder))
//     }, [dmrOrder])

//     const { watch, setValue } = methods
    

//     const createDmrOrderDateChangeHandler = (fieldName: string) => {
//       return (date: Date) => {
//         let updateDto = {
//             ...watch(),
//             [fieldName]: date
//         }
//         doUpdateDmrOrder(dmrOrder.id, updateDto)
//       }

//     }

//     const createDmrOrderChangeRefHandler = (fieldName: "statusId" | "priorityId") => {
//         return async (optionId: number) => {
//         const updateDto = {
//             ...watch(),
//             [fieldName]: optionId
//         }


//         try {
//             await doUpdateDmrOrder(dmrOrder.id, updateDto)

//             setValue(fieldName, optionId, {
//                 shouldDirty: true,
//                 shouldTouch: true,
//                 shouldValidate: true,
//             })
//         } catch (err) {
//             toast.error(`Changes were not saved (${fieldName}). Please try again later.`)

//             console.log(err)
//         }


//         }
//     }

        



//     return (

//         <FormProvider {...methods} >

//             <div  className="grid grid-cols-[60px_250px_minmax(80px,120px)_140px_140px_150px_275px] gap-0 border-y border-gray-200 bg-white text-xs text-gray-500 font-medium shadow-sm">
//                 {/* Checkbox */}
//                 <div className="flex gap-2 justify-center items-center h-full border-r border-gray-100 bg-gray-50/30">
//                     <input
//                         onChange={() => handleOrderCheck(dmrOrder.id)}
//                         disabled={isSelectDisabled}
//                         type="checkbox"
//                         className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
//                     />
//                     <button 
//                         onClick={() => warnUnlink(dmrOrder.id)}
//                         className='hover:text-red-600 transition-colors'
//                     >
//                         <Unlink size={16} />

//                     </button>
//                 </div>
//                 <div className='border-r border-gray-100'>

//                     <EditableTextColumn
//                         id={dmrOrder.id}
//                         fieldName='label'
//                         handleUpdate={() => doUpdateDmrOrder(dmrOrder.id, watch())}
//                     />
//                 </div>

//                 <div className="px-2 py-2 flex justify-center border-r border-gray-100 h-full items-center">

//                     <AssignedToCell 
//                         assignedToList={dmrOrder.assignedToList} 
//                         handleUnassign={(userIdToUnassign) => {doUnassignUserDmrOrder(userIdToUnassign, dmrOrder.id)}}
//                         handleAssign={(userIdToAssign) => {doAssignUserDmrOrder(userIdToAssign, dmrOrder.id)}}
//                     />
                
//                 </div>

//                 {/* Status */}
//                 <SelectCellWrapper>

//                     <HoverSelect
//                         id={dmrOrder.id}
//                         fieldName='statusId'
//                         fields={references.status}
//                         handleChangeSelect={createDmrOrderChangeRefHandler('statusId')}
//                     />
//                 </SelectCellWrapper>

//                 {/* Priority */}
//                 {/* <SelectCellWrapper>

//                     <HoverSelect
//                         id={dmrOrder.id}
//                         fieldName='priorityId'
//                         fields={statuses}
//                         handleChangeSelect={createDmrOrderChangeRefHandler('priorityId')}

//                     />
//                 </SelectCellWrapper> */}

//                 {/* Order Date */}
//                 <DateCell 
//                     fieldName="orderDate"
//                     handleChangeDate={createDmrOrderDateChangeHandler('orderDate')}
//                 />

//                 {/* Estimated arrival */}
//                 <DateCell 
//                     fieldName="estimatedArrival"
//                     handleChangeDate={createDmrOrderDateChangeHandler('estimatedArrival')}
//                 />

//                 {/* notes 1 */}
//                 <EditableTextColumn
//                     id={dmrOrder.id}
//                     fieldName='notes_1'
//                     handleUpdate={() => doUpdateDmrOrder(dmrOrder.id, watch())}

//                 />


//                 {/* notes 2 */}

//                 {/* <EditableTextColumn
//                     id={dmrOrder.id}
//                     fieldName='notes_2'
//                     handleUpdate={() => doUpdateDmrOrder(dmrOrder.id, watch())}

//                 /> */}



//             </div>

//         </FormProvider>

//     )
// }