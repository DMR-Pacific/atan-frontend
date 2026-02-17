import { atlas_api_authorized } from "@/axios/Axios"
import { ClientOrderUpdateDto } from "@/types/orders/ClientOrderUpdateDto"
import { DmrOrderUpdateDto } from "@/types/orders/DmrOrderUpdateDto"
import { SortByType } from "@/types/api/SortByType"
import { SortDirection } from "@/app/(main)/orders/components/SortByDropdown"
import { ClientOrderAddDto } from "@/types/orders/ClientOrderAddDto"

const ordersBase = "/1.0/orders"


export const searchClientOrders =  (searchOrderDto: {[key: string]: any}, sortBy: SortByType, sortDir: SortDirection) => {
    const params = new URLSearchParams()
    if (sortBy) params.append('sortBy', sortBy)
    if (sortDir) params.append('sortDir', sortDir)
    return atlas_api_authorized.post(`${ordersBase}/client-orders/search?${params.toString()}`, searchOrderDto)
}

export const searchDmrOrders =  (searchOrderDto: {[key: string]: any}, sortBy: SortByType, sortDir: SortDirection) => {
    const params = new URLSearchParams()
    if (sortBy) params.append('sortBy', sortBy)
    if (sortDir) params.append('sortDir', sortDir)
    return atlas_api_authorized.post(`${ordersBase}/dmr-orders/search?${params.toString()}`, searchOrderDto)
}

export const addDmrOrder = (dto: DmrOrderUpdateDto) => {
    return atlas_api_authorized.post(`${ordersBase}/dmr-orders`, dto)
}


export const updateDmrOrder = (
    dmrOrderId: number, 
    dmrOrderUpdateDto: DmrOrderUpdateDto
) => {
    return atlas_api_authorized.put(`${ordersBase}/dmr-orders/${dmrOrderId}`, dmrOrderUpdateDto)
}


export const updateClientOrderRefColumnsByIdList = (refType: string, refId: number, clientOrderIdList: number[]) => {

    return atlas_api_authorized.put(`${ordersBase}/update-client-order/list?refType=${refType}&refId=${refId}`, clientOrderIdList)
}


export const addBlankClientOrderUnderReference = (refType: string, refId: number) => {
    return atlas_api_authorized.post(`${ordersBase}/client-order?refType=${refType}&refId=${refId}`)

}

export const addClientOrderUnderReference = (refType: string, refId: number, dto: ClientOrderUpdateDto) => {
    return atlas_api_authorized.post(`${ordersBase}/client-order?refType=${refType}&refId=${refId}`, dto)

}

export const addClientOrder = (dto: ClientOrderAddDto) => {
    return atlas_api_authorized.post(`${ordersBase}/client-orders`, dto)
}

export const updateClientOrder = (
    clientOrderId: number, 
    clientOrderUpdateDto: ClientOrderUpdateDto
) => {
    return atlas_api_authorized.put(`${ordersBase}/client-orders/${clientOrderId}`, clientOrderUpdateDto)
}
export const assignUserToClientOrder = (userId: number, orderId: number) => {
    return atlas_api_authorized.post(`${ordersBase}/client-orders/assign-user?userId=${userId}&orderId=${orderId}`)
}

export const unassignUserFromClientOrder = async (userId: number, orderId: number) => {
    return atlas_api_authorized.delete(`${ordersBase}/client-orders/unassign-user?userId=${userId}&orderId=${orderId}`)
}

export const assignUserToDmrOrder = (userId: number, orderId: number) => {
    return atlas_api_authorized.post(`${ordersBase}/dmr-orders/assign-user?userId=${userId}&orderId=${orderId}`)
}

export const unassignUserFromDmrOrder = (userId: number, orderId: number) => {
    return atlas_api_authorized.delete(`${ordersBase}/dmr-orders/unassign-user?userId=${userId}&orderId=${orderId}`)
}

export const createDmrOrder = () => {
    return atlas_api_authorized.post(`${ordersBase}/dmr-orders`)
}


export const createDmrOrderForClientOrder = (clientOrderId: number) => {
    return atlas_api_authorized.post(`${ordersBase}/client-orders/add-blank-dmr-order?clientOrderId=${clientOrderId}`)
}

export const getDmrOrdersByClientOrderId = (clientOrderId: number) => {
    return atlas_api_authorized.get(`${ordersBase}/dmr-orders?clientOrderId=${clientOrderId}`)
}

export const getClientOrdersByDmrOrderId = (dmrOrderId: number) => {
    return atlas_api_authorized.get(`${ordersBase}/client-orders?dmrOrderId=${dmrOrderId}`)
}


export const deleteClientOrderList = (clientOrderIdList: number[]) => {
    console.log(clientOrderIdList)
    return atlas_api_authorized.delete(`${ordersBase}/client-orders/list`, {data: clientOrderIdList})
}

export const deleteDmrOrderList = (dmrOrderIdList: number[]) => {
    console.log(dmrOrderIdList)
    return atlas_api_authorized.delete(`${ordersBase}/dmr-orders/list`, {data: dmrOrderIdList})
}

export const getDmrOrders = () => {
    return atlas_api_authorized.get(`${ordersBase}/dmr-orders/all`)

}

export const linkClientOrderDmrOrder = (clientOrderId: number, dmrOrderId: number) => {
    return atlas_api_authorized.post(`${ordersBase}/link/client-order/${clientOrderId}/dmr-order/${dmrOrderId}`)
}

export const unlinkClientOrderDmrOrder = (clientOrderId: number, dmrOrderId: number) => {
    return atlas_api_authorized.post(`${ordersBase}/unlink/client-order/${clientOrderId}/dmr-order/${dmrOrderId}`)
}

export const getHistoryForItem = (tableName: string, columnName: string, clientOrderId: number, ) => {
    // return atlas_api_authorized.get(`${ordersBase}/client-orders/by-id/${clientOrderId}/history?columnName=${columnName}`)
    return atlas_api_authorized.get(`${ordersBase}/history/by-table-name/${tableName}/by-id/${clientOrderId}?columnName=${columnName}`)

}


