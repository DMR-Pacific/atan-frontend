import { ClientOrderDto } from "@/types/orders/ClientOrderDto"

type Distribution = Record<number, { count: number, percentage: number}>

export interface Summary {
    count: number
    totalValue: number
    statusDistribution: Distribution
    categoryDistribution: Distribution
    clientTypeDistribution: Distribution
    priorityDistribution: Distribution
}

export     const summarizeClientOrders = (orders: ClientOrderDto[]) => {
        const statusDistribution: Distribution = {}
        const categoryDistribution: Distribution = {}
        const clientTypeDistribution: Distribution = {}
        const priorityDistribution: Distribution = {}
        let totalValue = 0


        // Count and sum
        for (const order of orders) {
            if (!statusDistribution[order.statusId]) statusDistribution[order.statusId] = { count: 0, percentage: 0 }
            statusDistribution[order.statusId].count++

            if (!categoryDistribution[order.categoryId]) categoryDistribution[order.categoryId] = { count: 0, percentage: 0 }
            categoryDistribution[order.categoryId].count++

            if (!clientTypeDistribution[order.clientTypeId]) clientTypeDistribution[order.clientTypeId] = { count: 0, percentage: 0 }
            clientTypeDistribution[order.clientTypeId].count++

            if (!priorityDistribution[order.priorityId]) priorityDistribution[order.priorityId] = { count: 0, percentage: 0 }
            priorityDistribution[order.priorityId].count++

            if (order.value) totalValue += order.value
        }

        // Compute percentages
        const totalOrders = orders.length
        if (totalOrders > 0) {
            for (const entry of Object.values(statusDistribution)) entry.percentage = Math.floor((entry.count / totalOrders) * 100)
            for (const entry of Object.values(categoryDistribution)) entry.percentage = Math.floor((entry.count / totalOrders) * 100)
            for (const entry of Object.values(clientTypeDistribution)) entry.percentage = Math.floor((entry.count / totalOrders) * 100)
            for (const entry of Object.values(priorityDistribution)) entry.percentage = Math.floor((entry.count / totalOrders) * 100)
        }



        return {
            count: totalOrders,
            totalValue,
            statusDistribution,
            categoryDistribution,
            clientTypeDistribution,
            priorityDistribution
        }
    }
