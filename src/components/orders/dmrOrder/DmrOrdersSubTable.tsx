import { Info } from "lucide-react"
import EditableTextColumn from "../../cells/TextAreaCell"
import AddDmrOrderRow from "./AddDmrOrderRow"
import { useEffect, useState } from "react"
import { getDmrOrdersByClientOrderId } from "@/services/orders/DmrOrderService"
import { useClientOrderRowContext } from "@/context/ClientOrderRowContext"
import { DmrOrdersSubTableContext, useDmrOrdersSubTableContext } from "@/context/DmrOrdersSubTableContext"
import { toast } from "sonner"
import AddDmrOrdersMenu from "./LinkDmrOrderModal"
import { Header } from "../clientOrder/ClientOrderHeader"
import DmrOrdersTableHeader from "./DmrOrdersTableHeader"
import DmrOrderRow from "./DmrOrderRow"
import { useOrdersContext } from "@/context/OrdersContext"
import { useClientOrdersTableContext } from "@/context/ClientOrdersTableContext"

export const DMR_ORDERS_HEADERS: Header[] = [
    {
      label: '',
      width: '60px',
    },
    {
      label: 'Order #',
      width: '250px',
    },
    {
      label: 'Assigned To',
      width: 'minmax(80px,120px)',
      info: true,
    },
    {
      label: 'Status',
      width: '140px',
      info: true,
    },
    // {
    //   label: 'Priority',
    //   width: '120px',
    //   info: true,
    // },
    {
      label: 'Order date',
      width: '140px',
      info: true,
    },
    {
      label: 'Est Arrival',
      width: '150px',
    },
    {
      label: 'Notes',
      width: '275px',
    },
    // {
    //   label: 'Notes',
    //   width: '120px',
    // },

  ]


export default function DmrOrdersSubTable () {
  const { subDmrOrderIds, handleOrderCheck, isSelectDisabled, warnUnlink} = useDmrOrdersSubTableContext()
  const { order: clientOrder } = useClientOrderRowContext()
  const { masterDmrOrders } = useOrdersContext()
  const {selectedDmrRows} = useClientOrdersTableContext()

  console.log("SUBs", subDmrOrderIds)

  console.log(masterDmrOrders)

  return (
    <>

      <div 
        // className='py-4 pr-4'
      >
          
          <DmrOrdersTableHeader />
          <div className="rounded-b-lg pb-">
            {subDmrOrderIds.map((subDmrOrderId, i) => (
              <DmrOrderRow 
                key={i} 
                checked={selectedDmrRows.includes(subDmrOrderId)}
                dmrOrderMaster={masterDmrOrders[subDmrOrderId]} 
                handleOrderCheck={handleOrderCheck}
                isSelectDisabled={isSelectDisabled}
                warnUnlink={warnUnlink}
                expandable={false}
              />
            ))}

            {/* <AddDmrOrderRow 
            
            /> */}
          </div>
      </div>
    </>

  )
}