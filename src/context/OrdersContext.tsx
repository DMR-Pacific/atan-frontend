'use client'

import { useAssignableUsers } from "@/hooks/useAssignableUsers"
import { useReference } from "@/hooks/useReference"
import { addClientOrder, addDmrOrder, assignUserToClientOrder, assignUserToDmrOrder, deleteClientOrderList, deleteDmrOrderList, linkClientOrderDmrOrder, searchClientOrders, unassignUserFromClientOrder, unassignUserFromDmrOrder, updateClientOrder, updateDmrOrder } from "@/services/OrderService"
import { getReference } from "@/services/ReferenceService"
import { AssignedToDto } from "@/types/AssignedToDto"
import { BaseReferenceType } from "@/types/BaseReferenceType"
import { ClientOrderDto } from "@/types/orders/ClientOrderDto"
import { ColumnName } from "@/types/ColumnName"
import { ApiRefType } from "@/types/api/ApiRefType"
import React, { createContext, Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState } from "react"
import { toast } from "sonner"
import { SortByType } from "@/types/api/SortByType"
import { SortDirectionType } from "@/types/api/SortDirectionType"
import { TableName } from "@/types/api/TableName"
import { DmrOrderDto } from "@/types/orders/DmrOrderDto"
import { DmrOrder } from "@/types/orders/DmrOrder"
import { YesNo } from "@/types/msic"
import { DmrOrderUpdateDto } from "@/types/orders/DmrOrderUpdateDto"
import { ClientOrderUpdateDto } from "@/types/orders/ClientOrderUpdateDto"
import { ClientOrderAddDto } from "@/types/orders/ClientOrderAddDto"
import { DmrOrderMaster, mapDmrOrderDtoToMaster } from "@/types/orders/DmrOrderMaster"
import { ClientOrderMaster, mapClientOrderDtoToMaster } from "@/types/orders/ClientOrderMaster"
import { OrderId } from "@/types/orders/order-types"

export type GroupId = number


interface OrderModalOptions {
    visible: boolean
    orderId?: number
    linkToOrderId?: number
    mode: OrderModalMode
    onSubmit?: () => void // a function to run to update the UI
}

export interface LinkModalOptions {
    visible: boolean, 
    linkToOrderId?:  OrderId  
    onSubmit?: () => void
}

export interface DeleteOrderModalOptions {
    visible: boolean,
    orderIdListDelete: OrderId[]
    tableName: TableName
    isDeleting: boolean
    onSubmit: () => void // delete handler after confirmation
}

export type OrderModalMode = 'add' | 'edit'| 'add-link' | 'view'

interface OrdersContextType {
  

    // ======================
    // Meant for entire orders context
    // ======================
    references: {[K in ApiRefType]: BaseReferenceType[]}
    setReferences: React.Dispatch<React.SetStateAction<{[K in ApiRefType]: BaseReferenceType[]}>>
    assignableUsers: AssignedToDto[]

    masterClientOrders: {[key: OrderId]: ClientOrderMaster}
    masterDmrOrders: {[key: OrderId]: DmrOrderMaster}

    addClientDtosToMaster: (clientOrderDtos: ClientOrderDto[], overwrite: boolean, cascade: boolean) => void
    addDmrDtosToMaster: (dmrOrderDtos: DmrOrderDto[], overwrite: boolean, cascade: boolean) => void
    doAddClientOrder: (dto: ClientOrderAddDto) => Promise<void>
    updateMasterClientDmrLink: (clientId: OrderId, dmrId: OrderId) => void

    doSearchClientOrders: (searchQuery: string, sortBy: SortByType, SortDirection: SortDirectionType) => Promise<ClientOrderDto[] | undefined> 


    doAddDmrOrder: (dto: DmrOrderUpdateDto) => void
    doUpdateClientOrder: (id: number, formValues: ClientOrderUpdateDto) => Promise<void>
    doUpdateDmrOrder: (id: number, formValues: DmrOrderUpdateDto) => Promise<void>

    doAssignUserClientOrder: (userId: number, orderId: number) => void
    doUnassignUserClientOrder: (userId: number, orderId: number) => void
    doAssignUserDmrOrder: (userId: number, orderId: number) => void
    doUnassignUserDmrOrder: (userId: number, orderId: number) => void

    doLinkClientOrderDmrOrder: (clientOrderId: OrderId, dmrOrderId: OrderId) => void

    showErrorBanner: boolean
    setShowErrorBanner: React.Dispatch<React.SetStateAction<boolean>>

    linkDmrModalOptions: LinkModalOptions
    setLinkDmrModalOptions: React.Dispatch<React.SetStateAction<LinkModalOptions>>
    linkClientModalOptions: LinkModalOptions
    setLinkClientModalOptions: React.Dispatch<React.SetStateAction<LinkModalOptions>>

    dmrOrderModalOptions: OrderModalOptions
    setDmrOrderModalOptions: React.Dispatch<React.SetStateAction<OrderModalOptions>>

    clientOrderModalOptions: OrderModalOptions
    setClientOrderModalOptions: React.Dispatch<React.SetStateAction<OrderModalOptions>>

    deleteOrderModalOptions: DeleteOrderModalOptions
    setDeleteOrderModalOptions: React.Dispatch<React.SetStateAction<DeleteOrderModalOptions>>

    handleShowDmrOrderModal: (mode: OrderModalMode, orderId?: number, linkToOrderId?: number, onSubmit?: () => void) => void
    handleUnshowDmrOrderModal: () => void

    handleShowClientOrderModal: (mode: OrderModalMode, orderId?: number, linkToOrderId?: number, onSubmit?: () => void) => void
    handleUnshowClientOrderModal: () => void

    idForHistory: number | null
    setIdForHistory: React.Dispatch<React.SetStateAction<number | null>>
    isDrawerOpen: boolean
    setIsDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>
    isHistoryDrawerOpen: boolean
    setIsHistoryDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>

    drawerTab: ApiRefType
    setDrawerTab: React.Dispatch<React.SetStateAction<ApiRefType>>
    historyDrawerTab: string
    setHistoryDrawerTab: React.Dispatch<React.SetStateAction<ColumnName>>
    historyTableName: TableName
    setHistoryTableName: React.Dispatch<React.SetStateAction<TableName>>
    openHistoryDrawer: ( tableName: TableName, columnName: ColumnName, idForHistory: number) => void

    doRefetchReferences: () => void


    showErrorModal: boolean
    setShowErrorModal: React.Dispatch<React.SetStateAction<boolean>>

}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined)

export const OrdersContextProvider = ({children} : {children : ReactNode}) => {
    const [masterClientOrders, setMasterClientOrders] = useState<{[key: number]: ClientOrderMaster}>({})
    const [masterDmrOrders, setMasterDmrOrders] = useState<{[key: number]: DmrOrderMaster}>({})

    const [idsToLink, setIdsToLink] = useState<number[][]>([])
    
    
    const [idForHistory, setIdForHistory] = useState<number | null>(null)



    const [references, setReferences] = useState<{[K in ApiRefType]: BaseReferenceType[]}>({
        status: [],
        priority: [],
        category: [],
        clientType: [],
    })
    // const [assignableUsers, setAssignableUsers] = useState<AssignedToDto[]>([])
    const [showErrorBanner, setShowErrorBanner] = useState<boolean>(false)

    const [orders, setOrders] = useState<{[key: number]: any}>({})
    

    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState(false)
    const [historyTableName, setHistoryTableName] = useState<TableName>('client_orders')
    const [drawerTab, setDrawerTab] = useState<ApiRefType>('status')
    const [historyDrawerTab, setHistoryDrawerTab] = useState<ColumnName>('notes')

        

    
    const [showErrorModal, setShowErrorModal] = useState<boolean>(false)
    const [dmrOrderModalOptions, setDmrOrderModalOptions] = useState<OrderModalOptions>({
        visible: false,
        mode: 'add'        
    })
    const [clientOrderModalOptions, setClientOrderModalOptions] = useState<OrderModalOptions>({
        visible: false,
        mode: 'add'        
    })
    const [linkClientModalOptions, setLinkClientModalOptions] = useState<LinkModalOptions>({
        visible: false,
        linkToOrderId: undefined,

    })

    const [linkDmrModalOptions, setLinkDmrModalOptions] = useState<LinkModalOptions>({
        visible: false,
        linkToOrderId: undefined,

    })
    const [deleteOrderModalOptions, setDeleteOrderModalOptions] = useState<DeleteOrderModalOptions>({
        visible: false,
        orderIdListDelete: [],
        onSubmit: () => {},
        isDeleting: false,
        tableName: "client_orders",

    })


    /*
    Get references
    **/
    const { data: priorities, error: priorityError, refetch: refetchPriorities } = useReference("priority")
    const { data: statuses, error: statusError, refetch: refetchStatuses  } = useReference("status")
    const { data: categories, error: categoryError, refetch: refetchCategories } = useReference("category")
    const { data: clientTypes, error: clientTypeError, refetch: refetchClientTypes } = useReference("clientType")
    const { assignableUsers, error: assignableUsersError, refetch: refetchAssignableUsers } = useAssignableUsers()

    // Fetch references for dropdowns
    useEffect(() => {
        setReferences(prev => (
            {
                ...prev,
                priority: priorities,
                status: statuses,
                category: categories,
                clientType: clientTypes
            }
        ))

        // setAssignableUsers(assignableUsers)
    }, [priorities, statuses, categories, clientTypes, setReferences])




    // Sets errors for fetching references
    useEffect(() => {
        if (priorityError || statusError || categoryError || clientTypeError || assignableUsersError) {
            setShowErrorBanner(true)
        }
    }, [priorityError, statusError, categoryError, clientTypeError, assignableUsersError])


    useEffect(() => {
        if (idsToLink.length > 0) {
            // for each id pair pair the client order id [0] and dmr order id [1]
            idsToLink.forEach(idPair => {
                //  do it only if both exists
                if (!(masterClientOrders[idPair[0]] && masterDmrOrders[idPair[1]])) return
                updateMasterClientDmrLink(idPair[0], idPair[1]) 
            })
            
            setIdsToLink([])
        }
    }, [masterClientOrders, masterDmrOrders])
    

    const doRefetchReferences = () => {
        console.log("REFETCHING")

        refetchPriorities()
        refetchStatuses()
        refetchCategories()
        refetchClientTypes()
        refetchAssignableUsers() 

        // if (priorityError) refetchPriorities()
        // if (statusError) refetchStatuses()
        // if (categoryError) refetchCategories()
        // if (clientTypeError) refetchClientTypes()
        
    }

    






    



    const openHistoryDrawer = (tableName: TableName, columnName: ColumnName, idForHistory: number) => {
        setHistoryTableName(tableName)
        setIdForHistory(idForHistory)
        setHistoryDrawerTab(columnName)
        setIsHistoryDrawerOpen(true)

    }


    const handleShowDmrOrderModal = (mode: OrderModalMode, orderId?: number, linkToOrderId?: number, onSubmit?: () => void) => {
        setDmrOrderModalOptions({
            visible: true,
            orderId: orderId,
            mode: mode,
            linkToOrderId: linkToOrderId,
            onSubmit: onSubmit || (() => {}),

        })
    }

    const handleUnshowDmrOrderModal = () => {
        setDmrOrderModalOptions({
            visible: false,
            orderId: undefined,
            mode: 'add'
        })
    }

    const handleShowClientOrderModal = (mode: OrderModalMode, orderId?: number, linkToOrderId?: number, onSubmit?: () => void) => {
        setClientOrderModalOptions({
            visible: true,
            orderId: orderId,
            mode: mode,
            linkToOrderId: linkToOrderId,
            onSubmit: onSubmit || (() => {}),
        })
    }

    const handleUnshowClientOrderModal = () => {
        setClientOrderModalOptions({
            visible: false,
            orderId: undefined,
            mode: 'add'
        })
    }


    const doSearchClientOrders= async (searchQuery: string, sortBy: SortByType, SortDirection: SortDirectionType): Promise<ClientOrderDto[] | undefined> => {
        try {
            const searchDto: {[key: string]: any} = {

            }

            if (searchQuery) searchDto['label'] = searchQuery
            const response = await searchClientOrders(searchDto, sortBy, SortDirection) 
            console.log(response)
            return response.data.content
        
        } catch (err) {
            console.log(err)
            toast.error('Failed to fetch client orders.')
        }
    }

    /**
     * 
     * @param dmrOrderDtos updated dtos
     * This function takes dto's and sets them into masters for the entire orders layout to access and share a single normalized state per order
     */
    const addDmrDtosToMaster = (dmrOrderDtos: DmrOrderDto[], overwrite: boolean, cascade: boolean) => {
        setMasterDmrOrders(prev => {
            const tempMaster = {
                ...prev
            }

            for (const dto of dmrOrderDtos) {
                // save to master if overwrite is y or if object id doesnt exist in masters yet
                if (overwrite || !tempMaster[dto.id]) {

                    const dmrOrderMaster = mapDmrOrderDtoToMaster(dto)

                    // save client orders to master and change them to id's
                    if (cascade && dto.clientOrders)  addClientDtosToMaster(dto.clientOrders, true, false)

                    // Save to master
                    tempMaster[dto.id] = dmrOrderMaster
                } 
            }

            return tempMaster
        })

    }

    /**
     * 
     * @param clientOrderDtos updated dtos
     * This function takes dto's and sets them into masters for the entire orders layout to access and share a single normalized state per order
     */
    const addClientDtosToMaster = (clientOrderDtos: ClientOrderDto[], overwrite: boolean, cascade: boolean) => {
        setMasterClientOrders(prev => {
            const tempMaster = {
                ...prev
            }

            for (const dto of clientOrderDtos) {
                // save to master if overwrite is y or if object id doesnt exist in masters yet
                if (overwrite || !tempMaster[dto.id]) {

                    const clientOrderMaster = mapClientOrderDtoToMaster(dto)
                    if (cascade && dto.dmrOrders)  {

                        addDmrDtosToMaster(dto.dmrOrders, true, false)
                    }

                    // Save to master
                    tempMaster[dto.id] = clientOrderMaster
                } 
            }

            return tempMaster
        })


        
    }



    const updateMasterClientDmrLink = (clientId: OrderId, dmrId: OrderId) => {
        const clientOrder = masterClientOrders[clientId]
        const dmrOrder = masterDmrOrders[dmrId] 

        console.log("CLIENT", clientId, clientOrder)
        console.log("DMR", dmrId, dmrOrder)

        // if (!(clientOrder && dmrOrder)) return

        if (!clientOrder.dmrOrders.includes(dmrId)) {

            // clientOrder.dmrOrders.push(dmrId)
            setMasterClientOrders(prev => ({
                ...prev,
                [clientId]: {
                    ...prev[clientId],
                    dmrOrders: [...prev[clientId]['dmrOrders'], dmrId]
                }
            }))
        }

        if (!dmrOrder.clientOrders.includes(clientId)) {

            // dmrOrder.clientOrders.push(clientId)
            setMasterDmrOrders(prev => ({
                ...prev,
                [dmrId]: {
                    ...prev[dmrId],
                    clientOrders: [...prev[dmrId]['clientOrders'], clientId]
                }
            }))
        }



    }

    const doAddDmrOrder = async (dto: DmrOrderUpdateDto) => {
        try {
            console.log(dto)
            const response = await addDmrOrder(dto)
            

            addClientDtosToMaster([response.data], true, false)
        } catch (err) {
            toast.error('Failed to add order')
            console.log(err)
        }
    }


    const doUpdateDmrOrder = async (id: number, formValues: DmrOrderUpdateDto): Promise<void>  => {

        try {
            const response = await updateDmrOrder(id, formValues)
            addDmrDtosToMaster([response.data], true, false)
        } catch (err) {
            toast.error('Changes were not saved. Please try again later.')
            console.log(err)
        }
    }

    const doAddClientOrder = async (dto: ClientOrderAddDto) => {
        try {
            console.log(dto)
            const response = await addClientOrder(dto)
            

            addClientDtosToMaster([response.data], true, false)
            setIdsToLink(dto.dmrOrderIds.map(id => [response.data.id, id]))
        } catch (err) {
            toast.error('Failed to add order')
            console.log(err)
        }
    }

    const doUpdateClientOrder = async (id: number, formValues: ClientOrderUpdateDto): Promise<void>  => {
        try {
            const response = await updateClientOrder(id, formValues)
            console.log(response)
            addClientDtosToMaster([response.data], true, false)

        } catch (err) {
            toast.error('Changes were not saved. Please try again later.')
            console.log(err)
            
        }
    }

    const doAssignUserClientOrder = createAssignUserHandler(assignUserToClientOrder, setMasterClientOrders, assignableUsers, "client_orders")

    const doUnassignUserClientOrder = createUnassignUserHandler(unassignUserFromClientOrder, setMasterClientOrders, assignableUsers, "client_orders")

    const doAssignUserDmrOrder = createAssignUserHandler(assignUserToDmrOrder, setMasterDmrOrders, assignableUsers, "dmr_orders")

    const doUnassignUserDmrOrder = createUnassignUserHandler(unassignUserFromDmrOrder, setMasterDmrOrders, assignableUsers, "dmr_orders")

    const doLinkClientOrderDmrOrder = async (clientOrderId: OrderId, dmrOrderId: OrderId) => {

        try {
            const response = await linkClientOrderDmrOrder(clientOrderId, dmrOrderId )
            console.log(response)
            updateMasterClientDmrLink(clientOrderId, dmrOrderId)
            
        } catch (err) {
            console.log(err)
            toast.error('Failed to link client order and DMR order.')
        }
    }

    return (
        <OrdersContext.Provider
            value = {{
                masterClientOrders,
                masterDmrOrders, 

                addDmrDtosToMaster,
                addClientDtosToMaster,

                updateMasterClientDmrLink,

                doSearchClientOrders,

                doAddClientOrder,
                doUpdateClientOrder,

                doAddDmrOrder,
                doUpdateDmrOrder,

                doAssignUserClientOrder,
                doUnassignUserClientOrder,
                doAssignUserDmrOrder,
                doUnassignUserDmrOrder, 
                doLinkClientOrderDmrOrder,

                idForHistory, setIdForHistory,


                references, setReferences,
                assignableUsers, 
                // setAssignableUsers,

                showErrorModal, setShowErrorModal,
                
                isDrawerOpen, setIsDrawerOpen,
                isHistoryDrawerOpen, setIsHistoryDrawerOpen,
                historyTableName, setHistoryTableName,
                drawerTab, setDrawerTab,
                historyDrawerTab, setHistoryDrawerTab,
                showErrorBanner, setShowErrorBanner,
                linkClientModalOptions, setLinkClientModalOptions,
                linkDmrModalOptions, setLinkDmrModalOptions,



                doRefetchReferences,
                
                openHistoryDrawer,

                
                clientOrderModalOptions, setClientOrderModalOptions,
                dmrOrderModalOptions, setDmrOrderModalOptions,
                deleteOrderModalOptions, setDeleteOrderModalOptions,
                handleShowDmrOrderModal, handleUnshowDmrOrderModal,
                handleShowClientOrderModal, handleUnshowClientOrderModal
            }}
        >
            {children}
        </OrdersContext.Provider>
    )
}

export const useOrdersContext = () => {

    const context = useContext(OrdersContext)

    if (!context) {
        throw new Error("useOrdersContext must be used within a OrdersContextProvider")
    }

    return context
}

const createAssignUserHandler = (
    assignApi: (userId: number, orderId: number) => Promise<any>,
    setMaster: Dispatch<SetStateAction<{[key: OrderId]: ClientOrderMaster}>> | Dispatch<SetStateAction<{[key: OrderId]: DmrOrderMaster}>>,
    assignableUsers: AssignedToDto[],
    tableName: TableName
) => {
    return async (userId: number, orderId: number) => {
            try {
            const response = await assignApi(userId, orderId)
            console.log(response)

            // update order in masters to include new assignment
            const newUser = assignableUsers.find(user => user.id == userId)
            if (newUser) {
                setMaster((prev: any) => ({
                    ...prev,
                    [orderId]: {
                        ...prev[orderId],
                        assignedToList: [...prev[orderId]['assignedToList'], newUser]
                    }
                }))
            }
        } catch (err) {
            toast.error(`Failed to assign user (${userId}) to ${tableName == "client_orders" ? "client" : "DMR"}order (${orderId})`)
            console.log(err)
        }
    }
}

const createUnassignUserHandler = (
    unassignApi: (userId: number, orderId: number) => Promise<any>,
    setMaster: Dispatch<SetStateAction<{[key: OrderId]: ClientOrderMaster}>> | Dispatch<SetStateAction<{[key: OrderId]: DmrOrderMaster}>>,
    assignableUsers: AssignedToDto[],
    tableName: TableName
) => {
    return async (userId: number, orderId: number) => {
        try {
            const response = await unassignApi(userId, orderId)
            console.log(response)

            // update masters to remove assignment
            setMaster((prev: any) => ({
                ...prev,
                [orderId]: {
                    ...prev[orderId],
                    assignedToList: [...prev[orderId]['assignedToList'].filter((u: AssignedToDto) => u.id != userId)]
                }
            }))
        } catch (err) {
            toast.error(`Failed to unassign user (${userId}) from ${tableName == "client_orders" ? "client" : "DMR"}order (${orderId})`)
            console.log(err)        }
    }
}