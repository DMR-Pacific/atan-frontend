import { atan_api_authorized } from "@/axios/Axios"
import { SortDirection } from "@/components/buttons/SortByDropdown"
import { SearchRequestDto } from "@/types/api/SearchRequestDto"
import { SortByType } from "@/types/api/SortByType"
import { DmrOrderAddDto, DmrOrderUpdateDto } from "@/types/orders/DmrOrderTypes"

const ordersBase = "/1.0/orders"
const dmrOrdersBase = "/1.0/dmr-orders"

export const getDmrOrdersByClientOrderId = (clientOrderId: number) => {
    return atan_api_authorized.get(`${dmrOrdersBase}?clientOrderId=${clientOrderId}`)
}

export const searchDmrOrders =  (dto: SearchRequestDto) => {

    return atan_api_authorized.post(`${dmrOrdersBase}/search`, dto)
}


export const addDmrOrder = (dto: DmrOrderAddDto) => {
    return atan_api_authorized.post(`${dmrOrdersBase}`, dto)
}

export const createDmrOrderForClientOrder = (clientOrderId: number) => {
    return addDmrOrder({clientOrderIds: [clientOrderId]})
}

export const updateDmrOrder = (
    dmrOrderId: number, 
    dto: DmrOrderUpdateDto
) => {
    return atan_api_authorized.put(`${dmrOrdersBase}/${dmrOrderId}`, dto)
}

export const linlClientOrders = (
    dmrOrderId: number, 
    clientOrderIds: number[]
) => {
    return atan_api_authorized.post(`${dmrOrdersBase}/${dmrOrderId}/client-orders/link`, clientOrderIds)
}

export const unlinkDmrOrders = (
    dmrOrderId: number, 
    clientOrderIds: number[]
) => {
    return atan_api_authorized.post(`${dmrOrdersBase}/${dmrOrderId}/client-orders/unlink`, clientOrderIds)
}

export const assignUserToDmrOrder = (userId: number, orderId: number) => {
    return atan_api_authorized.post(`${dmrOrdersBase}/${orderId}/users/assign/${userId}`)
}

export const unassignUserFromDmrOrder = (userId: number, orderId: number) => {
    return atan_api_authorized.post(`${dmrOrdersBase}/${orderId}/users/unassign/${userId}`)
}

export const deleteDmrOrder = (
    dmrOrder: number, 
) => {
    return atan_api_authorized.delete(`${dmrOrdersBase}/${dmrOrder}`)
}

export const bulkDeleteDmrOrders = (
    dmrOrders: number[], 

) => {
    return atan_api_authorized.delete(`${dmrOrdersBase}/bulk`, {data: dmrOrders})
}
//  ----------------

// export const searchDmrOrders =  (searchOrderDto: {[key: string]: any}, sortBy: SortByType, sortDir: SortDirection) => {
//     const params = new URLSearchParams()
//     if (sortBy) params.append('sortBy', sortBy)
//     if (sortDir) params.append('sortDir', sortDir)
//     return atan_api_authorized.post(`${ordersBase}/dmr-orders/search?${params.toString()}`, searchOrderDto)
// }


// export const getDmrOrdersByClientOrderId = (clientOrderId: number) => {
//     return atan_api_authorized.get(`${ordersBase}/dmr-orders?clientOrderId=${clientOrderId}`)
// }

// export const addDmrOrder = (dto: DmrOrderUpdateDto) => {
//     return atan_api_authorized.post(`${ordersBase}/dmr-orders`, dto)
// }


// export const updateDmrOrder = (
//     dmrOrderId: number, 
//     dmrOrderUpdateDto: DmrOrderUpdateDto
// ) => {
//     return atan_api_authorized.put(`${ordersBase}/dmr-orders/${dmrOrderId}`, dmrOrderUpdateDto)
// }


// export const assignUserToDmrOrder = (userId: number, orderId: number) => {
//     return atan_api_authorized.post(`${ordersBase}/dmr-orders/assign-user?userId=${userId}&orderId=${orderId}`)
// }

// export const unassignUserFromDmrOrder = (userId: number, orderId: number) => {
//     return atan_api_authorized.delete(`${ordersBase}/dmr-orders/unassign-user?userId=${userId}&orderId=${orderId}`)
// }

// export const createDmrOrder = () => {
//     return atan_api_authorized.post(`${ordersBase}/dmr-orders`)
// }


// export const deleteDmrOrderList = (dmrOrderIdList: number[]) => {
//     console.log(dmrOrderIdList)
//     return atan_api_authorized.delete(`${ordersBase}/dmr-orders/list`, {data: dmrOrderIdList})
// }

// export const getDmrOrders = () => {
//     return atan_api_authorized.get(`${ordersBase}/dmr-orders/all`)

// }