'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ChevronDown, AlertCircle, RefreshCcw } from 'lucide-react'
import { ClientOrderRow } from './ClientOrders/ClientOrderRow'
import { ClientOrderHeader } from './ClientOrders/ClientOrderHeader'
import AddClientOrderRow from './ClientOrders/AddClientOrderRow'
import { BaseReferenceType } from '@/types/BaseReferenceType'
import { ClientOrderGroupContext, useClientOrderGroupContext } from '@/context/ClientOrderGroupContext'
import { useOrdersContext } from '@/context/OrdersContext'
import { useClientOrdersTableContext } from '@/context/ClientOrdersTableContext'


interface CollapsibleGroupProps {
  defaultExpanded?: boolean
  groupId: number
}


export default function CollapsibleTable({
  groupId,
  defaultExpanded = false,
}: CollapsibleGroupProps) {
  const [group, setGroup] = useState<BaseReferenceType | null  | undefined>(null)
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)
  const { references, masterClientOrders } = useOrdersContext()
  const { 
    clientOrdersByGroup, 
    groupBy, 
    groups, 
    tableErrors, 
    ordersLoading, 
    summaries, 
    selectedClientRows, 
    setSelectedClientRows,
    selectedDmrRows
  } = useClientOrdersTableContext()

  const orderGroup=clientOrdersByGroup[groupId]
  const fetchError = tableErrors[groupId]
  const summary=summaries[groupId]

  useEffect(() => {
    setGroup(groups.find(ref => ref.id == Number(groupId)))
  }, [groups, setGroup, groupId])
  return (
        <ClientOrderGroupContext.Provider
          value={{
            group, orderGroup
          }}
        >

        <div className="mb-4 relative">
            {/* Group Header */}
            <div
              className="flex items-center gap-2 py-2  cursor-pointer hover:bg-gray-50 rounded-md group select-none"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <div 
                style={{color: group?.color}}
                className={`p-1 rounded hover:bg-gray-200 transition-colors`}
              >
                {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
              </div>

              <h3
                style={{color: group?.color}}
                className={`text-sm font-medium `}
              >
                {group?.label}
              </h3>

              <span className="text-xs text-gray-400 font-normal ml-2">
                {orderGroup?.length} Client po's
              </span>

              {(!isExpanded && ordersLoading[groupId]) &&
              <span>
                <div className={`w-${3} h-${3} border-4 border-blue-500 border-t-transparent rounded-full animate-spin`} />
              </span>}

              {fetchError && 
              <span>
                <AlertCircle className='text-red-500' size={16} />
              </span>}

              
            </div>

            {/* Collapsible Content */}
            <AnimatePresence initial={false}>
              {isExpanded ? (
                <motion.div
                  initial={{
                    height: 0,
                    opacity: 0,
                  }}
                  animate={{
                    height: 'auto',
                    opacity: 1,
                  }}
                  exit={{
                    height: 0,
                    opacity: 0,
                  }}
                  transition={{
                    duration: 0.3,
                    ease: 'easeInOut',
                  }}

                  className=" border border-gray-200 rounded-lg shadow-sm bg-white "
                >
                  {ordersLoading[groupId] ?

                    <div className="flex flex-col items-center justify-center py-24 px-4 text-center bg-white">
                      <div className={`w-${10} h-${10} border-4 border-blue-500 border-t-transparent rounded-full animate-spin`} />
                      Loading
                    </div>
                  :
                  <div>

                    {fetchError ?
                    <div className="flex flex-col items-center justify-center py-24 text-center bg-white">
                      <div className="bg-red-50 p-4 rounded-full mb-4">
                        <AlertCircle className="w-8 h-8 text-red-500" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Unable to fetch orders
                      </h3>
                      <p className="text-gray-500 max-w-sm mb-6">{"Please try again later."}</p>
                    </div>
                    
                    :
                    <div 
                      style={{borderLeftColor: group?.color}}
                      className={`border-l-8 rounded-lg`}
                      >

                      <ClientOrderHeader />
                      <div 
                      // className="divide-y divide-gray-100"
                      >
                        {/* Table Row */}
                        {orderGroup?.map((orderId) => (
                          <ClientOrderRow 
                            isSelectDisabled={selectedDmrRows.length > 0}
                            checked={selectedClientRows.includes(orderId)}
                            handleOrderCheck={(dmrOrderId: number) => {
                                setSelectedClientRows(prev => prev.includes(dmrOrderId) ? prev.filter(x => x !== dmrOrderId) : [...prev, dmrOrderId])
                            }}                            key={`clientOrderRow-${orderId}`}
                            order={masterClientOrders[orderId]} 
                            expandable={true}
                          />
                        ))}

                        {/* Add Row Placeholder */}
                        <AddClientOrderRow />
                      </div>
                    </div>}
                  </div>}

                </motion.div> /* Collapsed Summary View */
              ):
              <div
                style={{borderLeftColor: group?.color}}
                className={` border-l-8 border-l-${group?.color} border rounded-lg bg-white p-0 overflow-hidden flex items-center h-14 shadow-sm`}
              
              >

                <div className="flex-1 grid grid-cols-[40px_minmax(250px,2fr)_minmax(80px,120px)_140px_150px_100px_minmax(200px,3fr)_100px_120px_100px]  gap-0 items-center h-full">
                  {/* checkbox */}
                  <div></div>

                  {/* label */}
                  <div className="px-4 text-sm text-gray-500 border-r border-gray-300">
                    {orderGroup?.length}  Client po's
                  </div>

                  {/* Owner */}
                  <div className=' border-r border-gray-300 '>
                    <span className='invisible'>.</span>
                  </div> 

                  {/* Status Bar */}
                  <div className="px-2 border-r border-gray-300">
                    <div className="flex h-6 w-full rounded overflow-hidden">
                      {Object.entries(summary?.statusDistribution || {}).map(([id, item], i) => {
                        return (
                        <div
                          key={i}
                          className={`h-full`}
                          style={{
                            backgroundColor: references.status?.find(ref => String(ref.id) == id)?.color,
                            width: `${item.percentage}%`,
                          }}
                        ></div>
                      )})}
                    </div>
                  </div>

                  {/* Due date */}
                  <div className="px-2 flex justify-center border-r border-gray-300">
                    <span className='invisible'>.</span>

                    {/* {group.summary?.dateRange && (
                      <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap">
                        {group.summary.dateRange}
                      </span>
                    )} */}
                  </div>

                  {/* Priority Bar */}
                  <div className="px-2 border-r border-gray-300">
                    <div className="flex h-6 w-full rounded overflow-hidden gap-0.5">
                      {/* {group.summary?.priorityDistribution?.map((item, i) => (
                        <div
                          key={i}
                          className={`${item.color} h-full`}
                          style={{
                            width: `${item.percentage}%`,
                          }}
                        ></div>
                      ))} */}

                      {Object.entries(summary?.priorityDistribution || {}).map(([id, item], i) => {
                        return (
                        <div
                          key={i}
                          className={`h-full`}
                          style={{
                            backgroundColor: references.priority?.find(ref => String(ref.id) == id)?.color,
                            width: `${item.percentage}%`,
                          }}
                        ></div>
                      )})}
                      
                    </div>
                  </div>

              {/* Notes */}
                  <div className="col-span-1 border-r border-gray-300">
                    <span className='invisible'>.</span>
                    
                  </div> 
      
                  {/* last updated */}
                  <div className="col-span-1 border-r border-gray-300">
                    <span className='invisible'>.</span>
                    
                  </div> 
                  {/* Value */}
                  <div className="px-4 flex flex-col items-end justify-center border-r border-gray-300">
                    <span className="text-sm font-medium text-gray-900">
                      ${summary?.totalValue?.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-gray-400">sum</span>
                  </div>

                  {/* Client type */}
                  <div className='px-2 '>
                    <div className="flex h-6 w-full rounded overflow-hidden">

                    {Object.entries(summary?.clientTypeDistribution || {}).map(([id, item], i) => {
                      return (
                      <div
                        key={i}
                        className={`h-full`}
                        style={{
                          backgroundColor: references.clientType?.find(ref => String(ref.id) == id)?.color,
                          width: `${item.percentage}%`,
                        }}
                      ></div>
                    )})}
                    </div>

                  </div>

                      
                </div>
              {/* </motion.div> */}
              </div>

            }
            </AnimatePresence>
        </div>
        </ClientOrderGroupContext.Provider>

  )
}
