import { ApiRefType } from "@/types/api/ApiRefType"
import { SortByType } from "@/types/api/SortByType"
import { SortDirectionType } from "@/types/api/SortDirectionType"
import { BaseReferenceType } from "@/types/BaseReferenceType"
import { createContext, ReactNode, useContext, useEffect, useState } from "react"
import { GroupId, useOrdersContext } from "./OrdersContext"
import { deleteClientOrderList, deleteDmrOrderList, searchClientOrders } from "@/services/OrderService"
import { toast } from "sonner"
import { getReference } from "@/services/ReferenceService"
import { OrderId } from "@/types/orders/order-types"
import { summarizeClientOrders, Summary } from "@/utils/summary/summarizeClientOrders"
import { ClientOrderDto } from "@/types/orders/ClientOrderDto"
import { Page } from "@/types/Page"



export interface Orders {
    // key is the groupId
    [key: GroupId]: Page<ClientOrderDto>
}

interface ClientOrdersTableContextType {
    groupBy: ApiRefType
    setGroupBy: React.Dispatch<React.SetStateAction<ApiRefType>>
    groups: BaseReferenceType[] 
    setGroups: React.Dispatch<React.SetStateAction<BaseReferenceType[]>>

    sortBy: SortByType
    setSortBy: React.Dispatch<React.SetStateAction<SortByType>>
    sortDirection: SortDirectionType
    setSortDirection: React.Dispatch<React.SetStateAction<SortDirectionType>>
    searchValue: string
    setSearchValue: React.Dispatch<React.SetStateAction<string>>
    searchLoading: boolean
    setSearchLoading: React.Dispatch<React.SetStateAction<boolean>>

    ordersLoading: {[key: number]: boolean}
    setOrdersLoading:  React.Dispatch<React.SetStateAction<{[key: number]: boolean}>>

    selectedClientRows: any[]
    setSelectedClientRows: React.Dispatch<React.SetStateAction<any[]>>
    selectedDmrRows: any[]
    setSelectedDmrRows: React.Dispatch<React.SetStateAction<any[]>>
    

    summaries:{[key: GroupId]: Summary}

    doSearchOrders: (groupId: number) => void
    doGetAllOrdersByGroup: () => void
    doDeleteClientOrderList: () => void
    doDeleteDmrOrderList: () => void

    // ========================

    tableErrors: {[key: number]: any}
    setTableErrors: React.Dispatch<React.SetStateAction<{[key: number]: any}>>

    clientOrdersByGroup: {[key: number]: OrderId[]}
}


const ClientOrdersTableContext = createContext<ClientOrdersTableContextType | undefined>(undefined)


export const ClientOrdersTableContextProvider = ({children} : {children : ReactNode}) => {
    const { 

        setShowErrorModal, addClientDtosToMaster,
    } = useOrdersContext()

    const [groupBy, setGroupBy] = useState<ApiRefType>("category") // the variable that determines the separation of orders
    const [groups, setGroups] = useState<BaseReferenceType[]>([]) // the groups that the orders will be separated into
    
    const [sortBy, setSortBy] = useState<SortByType>("createdAt") 
    const [sortDirection, setSortDirection] = useState<SortDirectionType>("asc") 


    const [searchValue, setSearchValue] = useState<string>("")
    const [searchLoading, setSearchLoading] = useState<boolean>(false)
    const [ordersLoading, setOrdersLoading] = useState<{[key: number]: boolean}>({})
    const [summaries, setSummaries] = useState<{[key: number]: any}>({})
    
    
    const [selectedClientRows, setSelectedClientRows] = useState<any[]>([])

    const [selectedDmrRows, setSelectedDmrRows] = useState<any[]>([])
    const [tableErrors, setTableErrors] = useState({})
    

    // The client orders are grouped differently depending on group by. The key is the name of the group
    // Example: If groupBy is priority, the groupId's would be 1 == 'Critical' , 2 == 'High', etc
    // Client orders are grouped. The key of the object is the id of 
    const [clientOrdersByGroup, setClientOrdersByGroup] = useState<{[key: number]: OrderId[]}>({})


    
    const doSearchOrders = async ( groupId: number) => {
        /**
         * Map groupBy value to column 
         * For each table group, filter it by 
        */
        let column = ""
        if (groupBy == "priority") column = "priorityId"
        else if (groupBy == "status") column = "statusId"
        else if (groupBy == "category") column = "categoryId"
        else if (groupBy == "clientType") column = "clientTypeId"

        try { 
            setSearchLoading(true)

            setOrdersLoading(prev => ({
                ...prev,
                [groupId]: true
            }))

            let searchDto: {[key:string]: any} = {
                [column]: groupId,
            }
            if (searchValue) searchDto['label'] = searchValue
            const res = await searchClientOrders(searchDto, sortBy, sortDirection)
            const data: Page<ClientOrderDto> = res.data
            console.log("SEACH RES", res)
            addClientDtosToMaster(data.content, true, true)

            // put the id's in groups and the pages will reference the masterStore for the full clientOrder record
            setClientOrdersByGroup(prev => {
                return ({
                    ...prev,
                    [groupId]: data.content.map((order: ClientOrderDto) => order.id)
                })
            })
            
            setSummaries(prev => {
                return ({
                    ...prev,
                    [groupId]: summarizeClientOrders(data.content)
                })
            })

        } catch (err) {
            console.log(err)
            setTableErrors(prev => ({
                ...prev,
                [groupId]: err
            }))
            toast.error(`Failed to get orders (${groupBy}) (${groupId}).`)
        } finally {
            setOrdersLoading(prev => ({
                ...prev,
                [groupId]: false
            }))

            setSearchLoading(false)
        }
    }
    
    const doGetAllOrdersByGroup = async () => {
        /**
         * Reset orders
         */
        setClientOrdersByGroup({})

        try {
            for (const group of groups) {
                await doSearchOrders(group.id)
            }

        } catch (err) {
            console.log(err)
        } finally {
            setSearchLoading(false)
        }

    }

    const doDeleteClientOrderList = async ( ) => {
        try {

            const response = await deleteClientOrderList(selectedClientRows)
            toast.success(`Deleted client orders (${selectedClientRows.length}) successfully.`)
            
            setSelectedClientRows([])
        } catch (err) {
            toast.error(`Failed to delete client orders (${selectedClientRows.length}). Please try again later.`)
            console.log(err)
            setShowErrorModal(true)
        }
    }

    const doDeleteDmrOrderList = async () => {
        try {
            const response = await deleteDmrOrderList(selectedDmrRows)
            toast.success(`Deleted DMR orders (${selectedDmrRows.length}) successfully.`)

            setSelectedDmrRows([])
            
        } catch (err) {
            toast.error(`Failed to delete DMR orders (${selectedDmrRows.length}). Please try again later.`)
            console.log(err)
            
        }
    }



    const doGetGroupOptions = async () => {
          try {
            const response = await getReference(groupBy)
            setGroups(response.data)
          } catch (err) {
            console.log(err)
          }
        }
    
     /**
     * when user chooses to group tables by a new column, retrieve the options for that group
     **/
    useEffect(() => {
      doGetGroupOptions()
    }, [groupBy])

    // when there are a new set of group options, fetch tables by group 
    useEffect(() => {
        // console.log("GETTING ORDERS FOR", {
        //     groupBy: groupBy,
        //     search: searchValue,
        //     sortBy: sortBy,
        //     sortDirection: sortDirection,
        // })
        doGetAllOrdersByGroup() 
    }, [groups, searchValue, sortBy, sortDirection])
        
    return (
        <ClientOrdersTableContext.Provider
            value={{
                clientOrdersByGroup,

                groupBy, setGroupBy,
                groups, setGroups,
                sortBy, setSortBy,
                sortDirection, setSortDirection,
                searchValue, setSearchValue, 
                searchLoading, setSearchLoading, 
                ordersLoading, setOrdersLoading, 

                tableErrors, setTableErrors,


                summaries,

                                
                selectedClientRows, setSelectedClientRows,
                selectedDmrRows, setSelectedDmrRows,
                doDeleteClientOrderList, doDeleteDmrOrderList,
                
                doSearchOrders,
                doGetAllOrdersByGroup,


            }}
        >
            {children}
        </ClientOrdersTableContext.Provider>
    )
}

export const useClientOrdersTableContext = () => {

    const context = useContext(ClientOrdersTableContext)

    if (!context) {
        throw new Error("useClientOrdersTableContext must be used within a ClientOrdersTableContextProvider")
    }

    return context
}