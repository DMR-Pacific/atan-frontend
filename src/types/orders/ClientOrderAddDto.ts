import { DmrOrderDto } from "./DmrOrderDto";

export interface ClientOrderAddDto {
    label: string;
    assignedToIdList: number[];
    dmrOrderIds: number[];
    dmrOrders: DmrOrderDto[];

    priorityId: number | null
    clientTypeId: number | null
    statusId: number | null
    categoryId: number | null
    dueDate: string; 
    notes: string;
    value: number; 
}