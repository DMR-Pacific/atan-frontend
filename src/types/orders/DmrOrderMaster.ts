import { AssignedToDto } from "../AssignedToDto";
import { ClientOrderDto } from "./ClientOrderDto";
import { DmrOrderDto } from "./DmrOrderDto";
import { OrderId } from "./order-types";

export interface DmrOrderMaster {
  id: OrderId;
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

  clientOrders: OrderId[]
}

export const mapDmrOrderDtoToMaster = (dmrOrderDto: DmrOrderDto): DmrOrderMaster => {
    return {
        ...dmrOrderDto,

        // client orders must be changed to id's only since we will fetch them from the masterClientOrders store instead
        clientOrders: dmrOrderDto.clientOrders?.map(order => order.id) || []
    } 
}