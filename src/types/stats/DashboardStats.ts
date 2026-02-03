import { ClientOrderDto } from "../orders/ClientOrderDto"
import { CountDto } from "./CountDto"
import { SumByClientTypeDto } from "./SumByTypeDto"

export interface DashboardStats {
    totalOrders: number
    totalSales: number

    highestValueActiveOrders: ClientOrderDto[]
    salesByClientType: SumByClientTypeDto[]

    priorityStats: CountDto[]
    statusStats: CountDto[]
    clientTypeStats: CountDto[]
    categoryStats: CountDto[]

}