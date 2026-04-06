import { atan_api_authorized } from "@/axios/Axios"
import { DmrOrderUpdateDto } from "@/types/orders/DmrOrderTypes"
import { SortByType } from "@/types/api/SortByType"
import { SortDirection } from "@/components/buttons/SortByDropdown"
import { ClientOrderAddDto, ClientOrderUpdateDto} from "@/types/orders/ClientOrderTypes"
import { SearchRequestDto } from "@/types/api/SearchRequestDto"

const ordersBase = "/1.0/orders"



// export const linkClientOrderDmrOrder = (clientOrderId: number, dmrOrderId: number) => {
//     return atan_api_authorized.post(`${ordersBase}/link/client-order/${clientOrderId}/dmr-order/${dmrOrderId}`)
// }

// export const unlinkClientOrderDmrOrder = (clientOrderId: number, dmrOrderId: number) => {
//     return atan_api_authorized.post(`${ordersBase}/unlink/client-order/${clientOrderId}/dmr-order/${dmrOrderId}`)
// }

export const getHistoryForItem = (tableName: string, columnName: string, clientOrderId: number, ) => {
    // return atan_api_authorized.get(`${ordersBase}/client-orders/by-id/${clientOrderId}/history?columnName=${columnName}`)
    return atan_api_authorized.get(`${ordersBase}/history/by-table-name/${tableName}/by-id/${clientOrderId}?columnName=${columnName}`)

}


