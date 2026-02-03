export interface DmrOrder {
  id?: number;
  priorityId?: number;
  statusId?: number;
  dueDate?: string; 
  notes?: string;
  value?: number; 
  createdAt?: string;
  updatedAt?: string; 
 
  estimatedArrival: string
//   clientOrders?: ClientOrder[]; 
}