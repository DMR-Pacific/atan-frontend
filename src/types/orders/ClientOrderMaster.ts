import { AssignedToDto } from "../AssignedToDto"
import { ClientOrderDto } from "./ClientOrderDto"
import { DmrOrder } from "./DmrOrder"
import { OrderId } from "./order-types"

export interface ClientOrderMaster{
    id: OrderId
    label: string
    value: number
    dueDate: string
    priorityId: number
    statusId: number
    categoryId: number
    clientTypeId: number
    updatedAt: string
    notes: string

    assignedToList: AssignedToDto[]
    dmrOrders: OrderId[]
}

export const mapClientOrderDtoToMaster = (clientOrderDto: ClientOrderDto): ClientOrderMaster => {
    return {
        ...clientOrderDto,

        // dmr orders must be changed to id's only since we will fetch them from the masterclientOrders store instead
        dmrOrders: clientOrderDto.dmrOrders?.map(order => order.id) || []
    } 
}