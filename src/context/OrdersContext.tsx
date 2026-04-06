'use client'

import { useAssignableUsers } from "@/hooks/useAssignableUsers"
import { useReference } from "@/hooks/useReference"
import { getReference } from "@/services/ReferenceService"
import { AssignedUserDto } from "@/types/AssignedUserDto"
import { BaseReferenceType } from "@/types/BaseReferenceType"
import { ColumnName } from "@/types/ColumnName"
import { ApiRefType } from "@/types/api/ApiRefType"
import React, { createContext, Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState } from "react"
import { toast } from "sonner"
import { SortByType } from "@/types/api/SortByType"
import { SortDirectionType } from "@/types/api/SortDirectionType"
import { TableName } from "@/types/api/TableName"
import { YesNo } from "@/types/msic"
import { ClientOrderChildDto, ClientOrderUpdateDto } from "@/types/orders/ClientOrderTypes"

import { OrderId } from "@/types/orders/order-types"

import { addManufacturerOrder, deleteManufacturerOrder, updateManufacturerOrder } from "@/services/orders/ManufacturerOrderService"
import { ManufacturerOrderAddDto, ManufacturerOrderChildDto, ManufacturerOrderDto, ManufacturerOrderMaster, ManufacturerOrderUpdateDto, mapManufacturerOrderDtoToMaster } from "@/types/orders/ManufacturerOrderTypes"
import { DmrOrderChildDto, DmrOrderDto, DmrOrderMaster, DmrOrderUpdateDto, mapDmrOrderDtoToMaster } from "@/types/orders/DmrOrderTypes"
import { ClientOrderAddDto, ClientOrderDto, ClientOrderMaster, mapClientOrderDtoToMaster } from "@/types/orders/ClientOrderTypes"
import { addClientOrder, assignUserToClientOrder, linkClientOrderDmrOrder, searchClientOrders, unassignUserFromClientOrder, unlinkClientOrderDmrOrder, updateClientOrder } from "@/services/orders/ClientOrderService"
import { addDmrOrder, assignUserToDmrOrder, createDmrOrderForClientOrder, unassignUserFromDmrOrder, updateDmrOrder } from "@/services/orders/DmrOrderService"
import { GlobalOperator, SearchRequestDto } from "@/types/api/SearchRequestDto"
import { Operation } from "@/types/api/FilterCriteriaDto"
// import { linkClientOrderDmrOrder } from "@/services/orders/OrderService"

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
    assignableUsers: AssignedUserDto[]

    masterClientOrders: {[key: OrderId]: ClientOrderMaster}
    masterDmrOrders: {[key: OrderId]: DmrOrderMaster}
    masterManufacturerOrders: Record<OrderId, ManufacturerOrderMaster>


    addClientDtosToMaster: (clientOrderDtos: ClientOrderDto[], overwrite: boolean, cascade: boolean) => void
    addDmrDtosToMaster: (dmrOrderDtos: DmrOrderDto[], overwrite: boolean, cascade: boolean) => void
    addManufacturerDtosToMaster: (manufacturerOrderDtos: ManufacturerOrderDto[], overwrite: boolean, cascade: boolean) => void

    doAddClientOrder: (dto: ClientOrderAddDto) => Promise<void>
    updateMasterClientDmrLink: (clientId: OrderId, dmrId: OrderId) => void

    doSearchClientOrders: (searchRequestDto: SearchRequestDto) => Promise<ClientOrderDto[] | undefined> 


    doAddDmrOrder: (dto: DmrOrderUpdateDto) => void
    doCreateDmrOrderForClientOrder: (orderId: number) => void
    doAddManufacturerOrder: (dto: ManufacturerOrderAddDto) => void
    doUpdateClientOrder: (id: OrderId, formValues: ClientOrderUpdateDto) => Promise<void>

    doUpdateDmrOrder: (id: OrderId, formValues: DmrOrderUpdateDto) => Promise<void>
    doUpdateManufacturerOrder: (id: OrderId, formValues: ManufacturerOrderUpdateDto) => Promise<void>
    doDeleteManufacturerOrder: (id: OrderId) => Promise<void>


    doAssignUserClientOrder: (userId: number, orderId: number) => void
    doUnassignUserClientOrder: (userId: number, orderId: number) => void
    doAssignUserDmrOrder: (userId: number, orderId: number) => void
    doUnassignUserDmrOrder: (userId: number, orderId: number) => void

    doLinkClientOrderDmrOrder: (clientOrderId: OrderId, dmrOrderId: OrderId) => void
    doUnlinkClientOrderDmrOrder: (clientOrderId: OrderId, dmrOrderId: OrderId) => void

    showErrorBanner: boolean
    setShowErrorBanner: React.Dispatch<React.SetStateAction<boolean>>

    linkDmrModalOptions: LinkModalOptions
    setLinkDmrModalOptions: React.Dispatch<React.SetStateAction<LinkModalOptions>>
    linkClientModalOptions: LinkModalOptions
    setLinkClientModalOptions: React.Dispatch<React.SetStateAction<LinkModalOptions>>

    
    clientOrderModalOptions: OrderModalOptions
    setClientOrderModalOptions: React.Dispatch<React.SetStateAction<OrderModalOptions>>

    dmrOrderModalOptions: OrderModalOptions
    setDmrOrderModalOptions: React.Dispatch<React.SetStateAction<OrderModalOptions>>

    
    manufacturerOrderModalOptions: OrderModalOptions
    setManufacturerOrderModalOptions: React.Dispatch<React.SetStateAction<OrderModalOptions>>


    deleteOrderModalOptions: DeleteOrderModalOptions
    setDeleteOrderModalOptions: React.Dispatch<React.SetStateAction<DeleteOrderModalOptions>>

    handleShowDmrOrderModal: (mode: OrderModalMode, orderId?: number, linkToOrderId?: number, onSubmit?: () => void) => void
    handleUnshowDmrOrderModal: () => void

    handleShowClientOrderModal: (mode: OrderModalMode, orderId?: number, linkToOrderId?: number, onSubmit?: () => void) => void
    handleUnshowClientOrderModal: () => void

    handleShowManufacturerOrderModal: (mode: OrderModalMode, orderId?: number, linkToOrderId?: number, onSubmit?: () => void) => void
    handleUnshowManufacturerOrderModal: () => void

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
    const [masterClientOrders, setMasterClientOrders] = useState<Record<OrderId, ClientOrderMaster>>({})
    const [masterDmrOrders, setMasterDmrOrders] = useState<Record<OrderId, DmrOrderMaster>>({})
    const [masterManufacturerOrders, setMasterManufacturerOrders] = useState<Record<OrderId, ManufacturerOrderMaster>>({})

    const [idsToLink, setIdsToLink] = useState<OrderId[][]>([])
    const [dmrAndManufacturerIdsToLink, setDmrAndManufacturerIdsToLink] = useState<OrderId[][]>([])

    
    
    const [idForHistory, setIdForHistory] = useState<OrderId | null>(null)



    const [references, setReferences] = useState<{[K in ApiRefType]: BaseReferenceType[]}>({
        status: [],
        priority: [],
        category: [],
        clientType: [],
    })
    // const [assignableUsers, setAssignableUsers] = useState<AssignedToDto[]>([])
    const [showErrorBanner, setShowErrorBanner] = useState<boolean>(false)

    
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState(false)
    const [historyTableName, setHistoryTableName] = useState<TableName>('client_orders')
    const [drawerTab, setDrawerTab] = useState<ApiRefType>('status')
    const [historyDrawerTab, setHistoryDrawerTab] = useState<ColumnName>('notes')

        

    
    const [showErrorModal, setShowErrorModal] = useState<boolean>(false)

    const [clientOrderModalOptions, setClientOrderModalOptions] = useState<OrderModalOptions>({
        visible: false,
        mode: 'add'        
    })
    const [dmrOrderModalOptions, setDmrOrderModalOptions] = useState<OrderModalOptions>({
        visible: false,
        mode: 'add'        
    })
    const [manufacturerOrderModalOptions, setManufacturerOrderModalOptions] = useState<OrderModalOptions>({
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

    useEffect(() => {
     if (dmrAndManufacturerIdsToLink.length > 0) {
            // for each id pair pair the client order id [0] and dmr order id [1]
            dmrAndManufacturerIdsToLink.forEach(idPair => {
                //  do it only if both exists
                if (!(masterDmrOrders[idPair[0]] && masterManufacturerOrders[idPair[1]])) return
                updateMasterDmrManufacturerLink(idPair[0], idPair[1]) 
            })
            
            setDmrAndManufacturerIdsToLink([])
        }
    }, [masterManufacturerOrders, masterDmrOrders])
    

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

        const handleShowManufacturerOrderModal = (mode: OrderModalMode, orderId?: number, linkToOrderId?: number, onSubmit?: () => void) => {
        setManufacturerOrderModalOptions({
            visible: true,
            orderId: orderId,
            mode: mode,
            linkToOrderId: linkToOrderId,
            onSubmit: onSubmit || (() => {}),
        })
    }

    const handleUnshowManufacturerOrderModal = () => {
        setManufacturerOrderModalOptions({
            visible: false,
            orderId: undefined,
            mode: 'add'
        })
    }


    const doSearchClientOrders= async (searchRequestDto: SearchRequestDto): Promise<ClientOrderDto[] | undefined> => {
        try {

            const response = await searchClientOrders(searchRequestDto) 
            console.log(response)
            addClientDtosToMaster(response.data, true, true)
            return response.data
        
        } catch (err) {
            console.log(err)
            toast.error('Failed to fetch client orders.')
        }
    }

    const addManufacturerDtosToMaster = (manufacturerOrderDtos: (ManufacturerOrderDto | ManufacturerOrderChildDto)[], overwrite: boolean, cascade: boolean) => {
        setMasterManufacturerOrders(prev => {
            const tempMaster = {
                ...prev
            }

            
            for (const dto of manufacturerOrderDtos) {
                // save to master if overwrite is y or if object id doesnt exist in masters yet
                if (overwrite || !tempMaster[dto.id]) {

                    const manufacturerOrderMaster = mapManufacturerOrderDtoToMaster(dto)


                    if (cascade && "dmrOrder" in dto) {
                        if (dto.dmrOrder) addDmrDtosToMaster([dto.dmrOrder], true, false)
                    }
                    // Save to master
                    tempMaster[dto.id] = manufacturerOrderMaster
                } 
            }

            return tempMaster
        })
    }


    const addDmrDtosToMaster = (dmrOrderDtos: (DmrOrderDto | DmrOrderChildDto)[], overwrite: boolean, cascade: boolean) => {
        setMasterDmrOrders(prev => {
            const tempMaster = {
                ...prev
            }

            for (const dto of dmrOrderDtos) {
       
                // save to master if overwrite is y or if object id doesnt exist in masters yet
                if (overwrite || !tempMaster[dto.id]) {

                    const dmrOrderMaster = mapDmrOrderDtoToMaster(dto)

                    // save client orders to master and change them to id's
                    if (cascade && "clientOrders" in dto )  {
                        if (dto.clientOrders) addClientDtosToMaster(dto.clientOrders, true, false)
                        if (dto.manufacturerOrders) addManufacturerDtosToMaster(dto.manufacturerOrders, true, false)
                    }

                    // Save to master
                    tempMaster[dto.id] = dmrOrderMaster
                } 
            }

            return tempMaster
        })

    }

    const addClientDtosToMaster = (clientOrderDtos: (ClientOrderDto | ClientOrderChildDto)[], overwrite: boolean, cascade: boolean) => {
        setMasterClientOrders(prev => {
            const tempMaster = {
                ...prev
            }

            for (const dto of clientOrderDtos) {
                // save to master if overwrite is y or if object id doesnt exist in masters yet
                if (overwrite || !tempMaster[dto.id]) {

                    const clientOrderMaster = mapClientOrderDtoToMaster(dto)
                    if (cascade && "dmrOrders" in dto)  {

                        addDmrDtosToMaster(dto.dmrOrders, true, false)
                    }

                    // Save to master
                    tempMaster[dto.id] = clientOrderMaster
                } 
            }

            return tempMaster
        })


        
    }

    const updateMasterDmrManufacturerLink = (dmrId: OrderId, manufacturerId: OrderId) => {
        const dmrOrder = masterDmrOrders[dmrId] 
        const manufacturerOrder = masterManufacturerOrders[manufacturerId]

        if (!dmrOrder.manufacturerOrderIds.includes(dmrId)) {

            setMasterDmrOrders(prev => ({
                ...prev,
                [dmrId]: {
                    ...prev[dmrId],
                    manufacturerOrders: [...prev[dmrId]['manufacturerOrderIds'], manufacturerId]
                }
            }))
        }

        if (!manufacturerOrder.dmrOrderId) {

            setMasterManufacturerOrders(prev => ({
                ...prev,
                [manufacturerId]: {
                    ...prev[manufacturerId],
                    dmrOrder: dmrId
                }
            }))            
 
        }

    }

    const updateMasterClientDmrLink = (clientId: OrderId, dmrId: OrderId) => {
        const clientOrder = masterClientOrders[clientId]
        const dmrOrder = masterDmrOrders[dmrId] 

        console.log("CLIENT", clientId, clientOrder)
        console.log("DMR", dmrId, dmrOrder)

        // if (!(clientOrder && dmrOrder)) return

        if (!clientOrder.dmrOrderIds.includes(dmrId)) {

            // clientOrder.dmrOrders.push(dmrId)
            setMasterClientOrders(prev => ({
                ...prev,
                [clientId]: {
                    ...prev[clientId],
                    dmrOrders: [...prev[clientId]['dmrOrderIds'], dmrId]
                }
            }))
        }

        if (!dmrOrder.clientOrderIds.includes(clientId)) {

            // dmrOrder.clientOrders.push(clientId)
            setMasterDmrOrders(prev => ({
                ...prev,
                [dmrId]: {
                    ...prev[dmrId],
                    clientOrders: [...prev[dmrId]['clientOrderIds'], clientId]
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

    const doCreateDmrOrderForClientOrder = async (orderId: number) => {
        try {
            const response = await createDmrOrderForClientOrder(orderId)
            
            addDmrDtosToMaster([response.data], true, true)
        } catch (err) {
            toast.error('Failed to add a dmr order. Please try again later')

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
            

            addClientDtosToMaster([response.data], true, true)
            // setIdsToLink(dto.dmrOrderIds.map(id => [response.data.id, id]))
        } catch (err) {
            toast.error('Failed to add order')
            console.log(err)
        }
    }

    const doUpdateClientOrder = async (id: number, formValues: ClientOrderUpdateDto): Promise<void>  => {
        try {
            const response = await updateClientOrder(id, formValues)
            addClientDtosToMaster([response.data], true, false)

        } catch (err) {
            toast.error('Changes were not saved. Please try again later.')
            console.log(err)
        }
    }

    const doAddManufacturerOrder = async (dto: ManufacturerOrderAddDto) => {
        try {
            console.log(dto)
            const response = await addManufacturerOrder(dto)
            
            console.log("MO", response.data)
            addManufacturerDtosToMaster([response.data], true, true)
            // setDmrAndManufacturerIdsToLink([[dto.dmrOrderId, response.data.id]])
        } catch (err) {
            toast.error('Failed to add order')
            console.log(err)
        }
    }

    const doUpdateManufacturerOrder = async (id: OrderId, formValues: ManufacturerOrderUpdateDto): Promise<void>  => {
        try {
            const response = await updateManufacturerOrder(id, formValues)
            console.log(response)
            addManufacturerDtosToMaster([response.data], true, false)

        } catch (err) {
            toast.error('Changes were not saved. Please try again later.')
            console.log(err)
            
        }
    }

    const doDeleteManufacturerOrder = async (id: OrderId): Promise<void> => {
        try {
            console.log("BEF DELETE", masterManufacturerOrders[id])
            const response = await deleteManufacturerOrder(id) 
            setMasterManufacturerOrders(prev => {
                const { [id]: _, ...rest} = prev
                return rest
            })

        } catch (err) {
            toast.error('An error occurred deleting manufacturer order. Please try again later.')
            console.log(err)
        }
    }


    const doAssignUserClientOrder = createAssignUserHandler(assignUserToClientOrder, addClientDtosToMaster, "client_orders")

    const doUnassignUserClientOrder = createUnassignUserHandler(unassignUserFromClientOrder, addClientDtosToMaster, "client_orders")

    const doAssignUserDmrOrder = createAssignUserHandler(assignUserToDmrOrder, addDmrDtosToMaster, "dmr_orders")

    const doUnassignUserDmrOrder = createUnassignUserHandler(unassignUserFromDmrOrder, addDmrDtosToMaster, "dmr_orders")

    const doLinkClientOrderDmrOrder = async (clientOrderId: OrderId, dmrOrderId: OrderId) => {

        try {
            const response = await linkClientOrderDmrOrder(clientOrderId, dmrOrderId )

            // we set cascade to true to update the relationship for the new child dmr order as well
            addClientDtosToMaster([response.data], true, true)

            // updateMasterClientDmrLink(clientOrderId, dmrOrderId)
            
        } catch (err) {
            console.log(err)
            toast.error('Failed to link client order and DMR order.')
        }
    }



    const doUnlinkClientOrderDmrOrder = async (clientOrderId: number, dmrOrderId: number)=> {

        try {
            const response = await unlinkClientOrderDmrOrder(clientOrderId, dmrOrderId)
            // we set cascade to true to update the relationship for the new child dmr order as well
            addClientDtosToMaster([response.data], true, true)

        } catch (err) {
            toast.error(`Failed to unlink DMR order (${dmrOrderId}) from client order (${clientOrderId}).`)

            console.log(err)
        }

    }


    return (
        <OrdersContext.Provider
            value = {{
                masterClientOrders,
                masterDmrOrders, 
                masterManufacturerOrders,

                addDmrDtosToMaster,
                addClientDtosToMaster,
                addManufacturerDtosToMaster,

                updateMasterClientDmrLink,

                doSearchClientOrders,

                
                doAddClientOrder,
                doUpdateClientOrder,

                doAddDmrOrder,
                doCreateDmrOrderForClientOrder,
                doUpdateDmrOrder,

                doAddManufacturerOrder,
                doUpdateManufacturerOrder,
                doDeleteManufacturerOrder,

                doAssignUserClientOrder,
                doUnassignUserClientOrder,
                doAssignUserDmrOrder,
                doUnassignUserDmrOrder, 

                doLinkClientOrderDmrOrder,
                doUnlinkClientOrderDmrOrder,

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

                // Modal Options
                clientOrderModalOptions, setClientOrderModalOptions,
                dmrOrderModalOptions, setDmrOrderModalOptions,
                manufacturerOrderModalOptions, setManufacturerOrderModalOptions,

                deleteOrderModalOptions, setDeleteOrderModalOptions,
                handleShowDmrOrderModal, handleUnshowDmrOrderModal,
                handleShowClientOrderModal, handleUnshowClientOrderModal,
                handleShowManufacturerOrderModal, handleUnshowManufacturerOrderModal,
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

const createAssignUserHandler = <T, >(
    assignUserToOrderApiCall: (userId: number, orderId: number) => Promise<any>,
    addDtosToMaster: (dtos: T[], overwrite: boolean, cascade: boolean) => void,
    tableName: TableName
) => {
    return async (userId: number, orderId: number) => {
            try {
            const response = await assignUserToOrderApiCall(userId, orderId)

            console.log("DTO POST ASSIGN" , response.data)
            addDtosToMaster([response.data], true, true)

        } catch (err) {
            toast.error(`Failed to assign user (${userId}) to ${tableName == "client_orders" ? "client" : "DMR"}order (${orderId})`)
            console.log(err)
        }
    }
}

const createUnassignUserHandler = <T,>(
    unassignUserToOrderApiCall: (userId: number, orderId: number) => Promise<any>,
    addDtosToMaster: (dtos: T[], overwrite: boolean, cascade: boolean) => void,
    tableName: TableName
) => {
    return async (userId: number, orderId: number) => {
        try {
            const response = await unassignUserToOrderApiCall(userId, orderId)

            addDtosToMaster([response.data], true, true)

        } catch (err) {
            toast.error(`Failed to unassign user (${userId}) from ${tableName == "client_orders" ? "client" : "DMR"}order (${orderId})`)
            console.log(err)        }
    }
}