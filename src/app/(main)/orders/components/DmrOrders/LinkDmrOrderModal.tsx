import { useClientOrderRowContext } from "@/context/ClientOrderRowContext";
import { useDmrOrdersSubTableContext } from "@/context/DmrOrdersSubTableContext";
import { useOrdersContext } from "@/context/OrdersContext";
import { getDmrOrders, linkClientOrderDmrOrder, searchDmrOrders } from "@/services/OrderService";
import { DmrOrderDto } from "@/types/orders/DmrOrderDto";
import { OrderId } from "@/types/orders/order-types";
import { doSearchDmrOrders } from "@/utils/dmrOrders/doSearchDmrOrders";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";



export default function LinkDmrOrderModal ( ) {
    const { 
      linkDmrModalOptions: {visible, linkToOrderId, onSubmit}, 
      setLinkDmrModalOptions, 
      references, 
      doLinkClientOrderDmrOrder,
      addDmrDtosToMaster,
      masterDmrOrders,
    } = useOrdersContext()
    const {subDmrOrderIds: linkedDmrOrderIds} = useDmrOrdersSubTableContext()
    const [allDmrOrderIds, setAllDmrOrderIds] = useState<OrderId[]>([])
    // const {order: clientOrder} = useClientOrderRowContext()

    const [searchQuery, setSearchQuery] = useState<string>("")


    useEffect(() => {
      if (!visible) return 
      
      const debounce = setTimeout(async () => {
        // store dmr orders into master and keep the id's locally to reference
        const dmrOrders = await doSearchDmrOrders(searchQuery, 'createdAt', 'asc')
        addDmrDtosToMaster(dmrOrders || [], true, true)
        setAllDmrOrderIds((dmrOrders || []).map(order => order.id))

      }, 500)

      return () => clearTimeout(debounce)
    }, [searchQuery, visible])
    
    const onClose = () => {
      setLinkDmrModalOptions({
        visible: false,
        linkToOrderId: undefined
      })    
    }

    const handleLink = (dmrOrderId: OrderId) => {
      if (linkToOrderId == null) {
          toast.error('There is no client order selected to add a DMR order to.')
          return
      }
      doLinkClientOrderDmrOrder(linkToOrderId, dmrOrderId)

      if (onSubmit) onSubmit() 
      onClose()
    }


    // console.log("OUTER", allDmrOrderIds)
    if (!visible) return null
    return (
         <AnimatePresence>
        { (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              transition={{
                duration: 0.2,
              }}
              className="fixed inset-0 bg-black/50 z-50 flex "
              onClick={onClose}
            />

            {/* Modal */}
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.95,
                y: 20,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.95,
                y: 20,
              }}
              transition={{
                duration: 0.2,
              }}
              className="fixed inset-4 md:inset-8 lg:inset-16 bg-white rounded-xl shadow-2xl z-50 flex flex-col overflow-hidden"


            >
              
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    All DMR Orders
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Select a DMR order to add to client order
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Search Bar */}
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search subitems by name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    autoFocus
                  />
                </div>
              </div>

              {/* Subitems List */}
              <div className="flex-1 overflow-y-auto">
                {allDmrOrderIds.length > 0 ? (
                  <div className="divide-y divide-gray-100">

                    {allDmrOrderIds.filter(orderId => {
                      // filter out already linked DMR orders from choices
                      return !linkedDmrOrderIds.find(linkedOrderId => linkedOrderId == orderId)
                    }).map((orderId, idx) => {
                        const order = masterDmrOrders[orderId]
                        const statusRef = references.status.find(statRef => statRef.id == order.statusId)
                        return (
                        <div
                            key={`${order.id}-${idx}`}
                            className="px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer"
                            onClick={() => handleLink(order.id)}
                        >
                            <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-sm font-semibold text-gray-800">
                                    {order.label}
                                </h3>
                                <span
                                    style={{
                                        backgroundColor: statusRef?.color
                                    }}
                                    className={`
                                    px-2 py-0.5 text-[10px] font-medium rounded text-white
                     
                                  `}
                                >
                                    {statusRef?.label}
                                </span>
                                </div>
              
                                {order.notes && (
                                <p className="text-xs text-gray-600 line-clamp-2">
                                    {order.notes}
                                </p>
                                )}
                            </div>
                            <div className="flex flex-col items-end gap-1 text-xs text-gray-500 flex-shrink-0">
                                <div>Order: {order.orderDate}</div>
                                <div>Est. Arrival: {order.estimatedArrival}</div>
                            </div>
                            </div>
                        </div>
                        )
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center p-8">
                    <div className="text-gray-300 mb-3">
                      <Search className="w-12 h-12 mx-auto" />
                    </div>
                    <h3 className="text-sm font-medium text-gray-700 mb-1">
                      No subitems found
                    </h3>
                    <p className="text-xs text-gray-500">
                      {searchQuery
                        ? 'Try adjusting your search'
                        : 'No subitems have been added yet'}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    )
}