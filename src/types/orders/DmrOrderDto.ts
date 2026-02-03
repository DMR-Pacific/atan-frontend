import { AssignedToDto } from "../AssignedToDto";
import { ClientOrderDto } from "./ClientOrderDto";

export interface DmrOrderDto {
  id: number;
  label: string;

  assignedToList: AssignedToDto[];

  priorityId: number;
  statusId: number;

  orderDate: string;        // ISO date (YYYY-MM-DD)
  dueDate: string;          // ISO datetime

  notes: string

  estimatedArrival: string; // ISO date
  value: number;

  updatedAt: string;        // ISO datetime

  clientOrders: ClientOrderDto[]
  hasClientOrders?: boolean
}