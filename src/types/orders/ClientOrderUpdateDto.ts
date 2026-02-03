import { OrderId } from "./order-types";

export interface ClientOrderUpdateDto {
  label?: string;
  priorityId?: number;
  clientTypeId?: number;
  statusId?: number;
  categoryId?: number;
  dueDate?: string; 
  notes?: string;
  value?: number; 
  assignedToIdList: number[]
  dmrOrderIds: OrderId[]
}