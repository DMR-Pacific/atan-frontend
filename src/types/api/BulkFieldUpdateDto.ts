import { OrderId } from "../orders/order-types";

export interface BulkFieldUpdateDto {
    orderIds: OrderId[]
    valueId: number
}