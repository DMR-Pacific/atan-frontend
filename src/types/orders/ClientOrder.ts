import { AssignedToDto } from "../AssignedToDto";
import { DmrOrder } from "./DmrOrder";

export interface ClientOrder {
  id: number;
  label?: string;
  assignedTo?: AssignedToDto; 
  priorityId?: number;
  clientTypeId?: number;
  statusId?: number;
  categoryId?: number;
  dueDate?: string; 
  notes?: string;
  value?: number; 
  createdAt?: string; 
  updatedAt?: string; 
  dmrOrders?: DmrOrder[];
}