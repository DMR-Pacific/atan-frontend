export interface DmrOrderUpdateDto {
    label: string

    // priorityId: number,
    statusId: number
    orderDate: string
    notes: string
    value: number
    estimatedArrival: Date
    assignedToIdList: number[]
}