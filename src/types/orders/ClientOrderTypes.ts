import { AssignedUserDto } from "../AssignedUserDto";
import { DmrOrderDto } from "./DmrOrderTypes";
import { OrderId } from "./order-types";

interface ClientOrderBase {
  id: number

  label: string
  notes: string
  value: number
  dueDate: string
  orderDate: string


  priorityId: number
  clientTypeId: number
  statusId: number
  categoryId: number

  updatedAt: string

}

export interface ClientOrderDto extends ClientOrderBase {
    assignedUsers: AssignedUserDto[]
    dmrOrders: DmrOrderDto[]
}

export interface ClientOrderChildDto extends ClientOrderBase {
    assignedUsers: AssignedUserDto[]
    dmrOrderIds: OrderId[]
}

export interface ClientOrderMaster{
    id: OrderId
    label: string
    value: number
    dueDate: string
    priorityId: number
    statusId: number
    categoryId: number
    clientTypeId: number
    updatedAt: string
    notes: string

    assignedUsers: AssignedUserDto[]
    dmrOrderIds: OrderId[]
}

export const mapClientOrderDtoToMaster = (dto: ClientOrderDto | ClientOrderChildDto): ClientOrderMaster => {
    
  let extractedDmrOrderIds: OrderId[]
  

  if (hasDmrOrderDto(dto)) {
      // dto is of type ClientOrderDto
      extractedDmrOrderIds =  dto.dmrOrders?.map(order => order.id) || []

  } else {
      // dto is of type ClientOrderChildDto
      extractedDmrOrderIds=  dto.dmrOrderIds
  } 

  let temp: ClientOrderMaster = {
      ...dto,
      dmrOrderIds: extractedDmrOrderIds
  } 

  return temp
}


export interface ClientOrderFormData {
  label: string;
  assignedUserIds: number[];
  // dmrOrders?: DmrOrderAddDto[] // only use when adding dmrOrders that dont exist yet
  dmrOrderIds: number[];       // only used for Add
  priorityId?: number | null;
  clientTypeId?: number | null;
  statusId?: number | null;
  categoryId?: number | null;
  dueDate?: string;
  notes?: string;
  value?: number;
}

export interface ClientOrderAddDto {
    label?: string;
    assignedUserIds?: number[];
    dmrOrderIds?: number[];
    // dmrOrders?: DmrOrderDto[];

    priorityId?: number | null
    clientTypeId?: number | null
    statusId?: number | null
    categoryId?: number | null
    dueDate?: string; 
    notes?: string;
    value?: number; 
}

export interface ClientOrderUpdateDto {
  label?: string;
  priorityId?: number | null;
  clientTypeId?: number | null;
  statusId?: number | null;
  categoryId?: number | null;
  dueDate?: string; 
  notes?: string;
  value?: number;

  assignedUserIds?: number[]
  dmrOrderIds?: OrderId[]
}


export const mapFormToAddDto = (formData: ClientOrderFormData): ClientOrderAddDto => ({
  label: formData.label,
  assignedUserIds: formData.assignedUserIds,
  dmrOrderIds: formData.dmrOrderIds || [],
  priorityId: formData.priorityId ?? null,
  clientTypeId: formData.clientTypeId ?? null,
  statusId: formData.statusId ?? null,
  categoryId: formData.categoryId ?? null,
  dueDate: formData.dueDate ?? '',
  notes: formData.notes ?? '',
  value: formData.value ?? 0,
  // dmrOrders: formData.dmrOrders || [],
});

export const mapFormToUpdateDto = (formData: ClientOrderFormData): ClientOrderUpdateDto => ({
  label: formData.label, 
  assignedUserIds: formData.assignedUserIds,
  priorityId: formData.priorityId ?? null,
  clientTypeId: formData.clientTypeId ?? null,
  statusId: formData.statusId ?? null,
  categoryId: formData.categoryId ?? null,
  dueDate: formData.dueDate,
  notes: formData.notes,
  value: formData.value,
  dmrOrderIds: formData.dmrOrderIds,
});

export const hasDmrOrderDto = (dto: ClientOrderDto | ClientOrderChildDto): dto is ClientOrderDto => {
    return "dmrOrders" in dto && dto.dmrOrders != null
}
