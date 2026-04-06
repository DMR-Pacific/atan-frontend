import { atan_api, atan_api_authorized } from "@/axios/Axios"
import { ManufacturerOrderAddDto, ManufacturerOrderUpdateDto } from "@/types/orders/ManufacturerOrderTypes"

import { OrderId } from "@/types/orders/order-types"

const manufacturerOrdersBase = "/1.0/manufacturer-orders"

export const addManufacturerOrder = (addDto: ManufacturerOrderAddDto) => {
    return atan_api_authorized.post(manufacturerOrdersBase, addDto)
}

export const updateManufacturerOrder = (orderId: OrderId, addDto: ManufacturerOrderUpdateDto) => {
    return atan_api_authorized.put(`${manufacturerOrdersBase}/${orderId}`, addDto)
}

export const deleteManufacturerOrder = (orderId: OrderId) => {
    return atan_api_authorized.delete(`${manufacturerOrdersBase}/${orderId}`)
}