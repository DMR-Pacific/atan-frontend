import { AssignedToDto } from "../AssignedToDto"
import { DmrOrder } from "./DmrOrder"
import { DmrOrderDto } from "./DmrOrderDto"

export interface ClientOrderDto{
    id: number
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
    dmrOrders: DmrOrderDto[]
    hasDmrOrders: boolean
}