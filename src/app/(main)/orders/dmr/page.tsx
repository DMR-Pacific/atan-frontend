'use client'

import { Clock, DollarSign, Info } from "lucide-react";
import { DMR_ORDERS_HEADERS } from "../components/DmrOrders/DmrOrdersSubTable";
import { DmrOrderDto } from "@/types/orders/DmrOrderDto";
import { useEffect, useState } from "react";
import Menu from "./components/Menu";
import { doSearchDmrOrders } from "@/utils/dmrOrders/doSearchDmrOrders";
import DmrOrderRow from "./components/DmrOrderRow";
import { DmrOrdersTableContext, useDmrOrdersTableContext } from "@/context/DmrOrdersTableContext";
import { SelectedRowToolbar } from "./components/SelectedRowToolbar";
import DmrOrderCard from "./components/DmrOrderCard";
import DmrOrdersTableHeader from "./components/DmrOrdersTableHeader";
import ClientOrderCard from "../components/ClientOrders/ClientOrderCard";
import { useOrdersContext } from "@/context/OrdersContext";
import AddDmrOrderRow from "../components/DmrOrders/AddDmrOrderRow";

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
                <div>

                    <DmrOrdersTableHeader />
                    <div>
                        {dmrOrderIds.map((dmrId) => (
                            <div key={`dmrRow-${dmrId}`}>

                                <DmrOrderRow 
                                    dmrOrder={masterDmrOrders[dmrId]} 
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