'use client'


import Menu from "@/components/orders/dmrOrder/Menu";
import DmrOrderRow from "../../../../components/orders/dmrOrder/DmrOrderRow";
import { DmrOrdersTableContext, useDmrOrdersTableContext } from "@/context/DmrOrdersTableContext";
import { SelectedRowToolbar } from "../../../../components/orders/dmrOrder/SelectedRowToolbar";
import DmrOrderCard from "@/components/orders/dmrOrder/DmrOrderCard";
import DmrOrdersTableHeader from "@/components/orders/dmrOrder/DmrOrdersTableHeader";
import { useOrdersContext } from "@/context/OrdersContext";

export default function DmrOrders () {
    const { masterDmrOrders,} = useOrdersContext()

    const { 
        selectedDmrRows, 
        dmrOrderIds, 
        viewMode, 
        handleOrderCheck
    } = useDmrOrdersTableContext()




    return (

        <div className='relative'>
            <Menu />
            <div className='mb-4'>

                
                {viewMode == 'rows' &&
                <div className='overflow-x-scroll min-w-max'>

                    <DmrOrdersTableHeader />
                    <div>

                        {dmrOrderIds.map((dmrId) => (
                            <div key={`dmrRow-${dmrId}`}>

                                <DmrOrderRow 
                                    dmrOrderMaster={masterDmrOrders[dmrId]} 
                                    checked={selectedDmrRows.includes(dmrId)}
                                    handleOrderCheck={handleOrderCheck}
                                    isSelectDisabled={false}
                                    expandable={true}
                                />

                            </div>
                        ))}

                        {/* <AddDmrOrderRow /> */}
                    </div>
                </div>}
                {viewMode == 'cards' &&
                <div className='grid grid-cols-3 gap-2'>
                    {dmrOrderIds.map((dmrId) => (
                    <DmrOrderCard 
                        key={`dmrCard-${dmrId}`}
                        order={masterDmrOrders[dmrId]} 
                        isSelectDisabled={false}
                        handleOrderCheck={() => handleOrderCheck(dmrId)}
                        showChildren={true}
                    />))}
                </div>}
            </div>
            {selectedDmrRows.length > 0 && <SelectedRowToolbar />}
        </div>


    )
}