import { atan_api_authorized } from "@/axios/Axios"
import { SortDirection } from "@/components/buttons/SortByDropdown"
import { BulkFieldUpdateDto } from "@/types/api/BulkFieldUpdateDto"
import { SearchRequestDto } from "@/types/api/SearchRequestDto"
import { SortByType } from "@/types/api/SortByType"
import { ClientOrderAddDto, ClientOrderDto, ClientOrderUpdateDto } from "@/types/orders/ClientOrderTypes"

const ordersBase = "/1.0/orders"
const clientOrdersBase = "/1.0/client-orders"

export const getClientOrdersByDmrOrderId = (dmrOrderId: number) => {
    return atan_api_authorized.get(`${clientOrdersBase}?dmrOrderId=${dmrOrderId}`)
}

export const searchClientOrders =  (dto: SearchRequestDto) => {

    return atan_api_authorized.post(`${clientOrdersBase}/search`, dto)
}

export const addClientOrder = (dto: ClientOrderAddDto) => {
    return atan_api_authorized.post(`${clientOrdersBase}`, dto)
}

export const updateClientOrder = (
    clientOrderId: number, 
    dto: ClientOrderUpdateDto
) => {
    return atan_api_authorized.put(`${clientOrdersBase}/${clientOrderId}`, dto)
}

export const linkDmrOrders = (
    clientOrderId: number, 
    dmrOrderIds: number[]
) => {
    return atan_api_authorized.post(`${clientOrdersBase}/${clientOrderId}/dmr-orders/link`, dmrOrderIds)
}

export const linkClientOrderDmrOrder = (clientOrderId: number, dmrOrderId: number) => {
    return linkDmrOrders(clientOrderId, [dmrOrderId])
}

export const unlinkClientOrderDmrOrder = (clientOrderId: number, dmrOrderId: number) => {
    return unlinkDmrOrders(clientOrderId, [dmrOrderId])
}

export const unlinkDmrOrders = (
    clientOrderId: number, 
    dmrOrderIds: number[]
) => {
    return atan_api_authorized.post(`${clientOrdersBase}/${clientOrderId}/dmr-orders/unlink`, dmrOrderIds)
}

export const assignUserToClientOrder = (userId: number, orderId: number) => {
    return atan_api_authorized.post(`${clientOrdersBase}/${orderId}/users/assign/${userId}`)
}

export const unassignUserFromClientOrder = (userId: number, orderId: number) => {
    return atan_api_authorized.post(`${clientOrdersBase}/${orderId}/users/unassign/${userId}`)
}

export const bulkUpdateClientOrderField = (field: string, dto: BulkFieldUpdateDto) => {
    return atan_api_authorized.post(`${clientOrdersBase}/bulk/${field}`, dto)
}

export const deleteClientOrder = (
    clientOrderId: number, 
) => {
    return atan_api_authorized.delete(`${clientOrdersBase}/${clientOrderId}`)
}

export const bulkDeleteClientOrders = (
    clientOrderIds: number[], 

) => {
    return atan_api_authorized.delete(`${clientOrdersBase}/bulk`, {data: clientOrderIds})
}


//  ----------------
// export const searchClientOrders =  (searchOrderDto: {[key: string]: any}, sortBy: SortByType, sortDir: SortDirection) => {
//     const params = new URLSearchParams()
//     if (sortBy) params.append('sortBy', sortBy)
//     if (sortDir) params.append('sortDir', sortDir)
//     return atan_api_authorized.post(`${ordersBase}/client-orders/search?${params.toString()}`, searchOrderDto)
// }

export const updateClientOrderRefColumnsByIdList = (refType: string, refId: number, clientOrderIdList: number[]) => {

    return atan_api_authorized.put(`${ordersBase}/update-client-order/list?refType=${refType}&refId=${refId}`, clientOrderIdList)
}


export const addBlankClientOrderUnderReference = (refType: string, refId: number) => {
    return atan_api_authorized.post(`${ordersBase}/client-order?refType=${refType}&refId=${refId}`)

}

// export const addClientOrderUnderReference = (refType: string, refId: number, dto: ClientOrderUpdateDto) => {
//     return atan_api_authorized.post(`${ordersBase}/client-order?refType=${refType}&refId=${refId}`, dto)

// }

// export const addClientOrder = (dto: ClientOrderAddDto) => {
//     return atan_api_authorized.post(`${ordersBase}/client-orders`, dto)
// }

// export const updateClientOrder = (
//     clientOrderId: number, 
//     clientOrderUpdateDto: ClientOrderUpdateDto
// ) => {
//     return atan_api_authorized.put(`${ordersBase}/client-orders/${clientOrderId}`, clientOrderUpdateDto)
// }
// export const assignUserToClientOrder = (userId: number, orderId: number) => {
//     return atan_api_authorized.post(`${ordersBase}/client-orders/assign-user?userId=${userId}&orderId=${orderId}`)
// }

// export const unassignUserFromClientOrder = async (userId: number, orderId: number) => {
//     return atan_api_authorized.delete(`${ordersBase}/client-orders/unassign-user?userId=${userId}&orderId=${orderId}`)
// }





// export const getClientOrdersByDmrOrderId = (dmrOrderId: number) => {
//     return atan_api_authorized.get(`${ordersBase}/client-orders?dmrOrderId=${dmrOrderId}`)
// }

// export const deleteClientOrderList = (clientOrderIdList: number[]) => {
//     console.log(clientOrderIdList)
//     return atan_api_authorized.delete(`${ordersBase}/client-orders/list`, {data: clientOrderIdList})
// }
