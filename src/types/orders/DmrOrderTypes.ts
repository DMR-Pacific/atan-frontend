
import { AssignedUserDto } from "../AssignedUserDto";
import { ClientOrderChildDto } from "./ClientOrderTypes";
import { ManufacturerOrderChildDto } from "./ManufacturerOrderTypes";
import { OrderId } from "./order-types";


export interface DmrOrderBase {
  label: string;

  statusId: number | null

  estimatedArrival: string
  orderDate: string;
  dueDate: string; 

  notes: string;
  value: number; 
  createdAt: string;
  updatedAt: string; 
 
}

export interface DmrOrderDto extends DmrOrderBase {

  id: number;

  assignedUsers: AssignedUserDto[];
  clientOrders: ClientOrderChildDto[]
  manufacturerOrders: ManufacturerOrderChildDto[]

}

export interface DmrOrderChildDto extends DmrOrderBase{
  id: number;

  assignedUsers: AssignedUserDto[];
  manufacturerOrderIds: OrderId[]
  clientOrderIds: OrderId[]
}

export interface DmrOrderMaster extends DmrOrderBase{
  id: number;

  assignedUsers: AssignedUserDto[];
  clientOrderIds: OrderId[]
  manufacturerOrderIds: OrderId[]
}

export const hasClientOrderDto = (dto: DmrOrderDto | DmrOrderChildDto): dto is DmrOrderDto => {
    return "clientOrders" in dto && dto.clientOrders != null
}


export const mapDmrOrderDtoToMaster = (dto: DmrOrderDto | DmrOrderChildDto): DmrOrderMaster => {
  let extractedClientOrderIds: OrderId[]
  let extractedManufacturerOrderIds: OrderId[]
  

  if (hasClientOrderDto(dto)) {
      // dto is of type DmrOrderDto
      extractedClientOrderIds =  dto.clientOrders?.map(order => order.id) || []
      extractedManufacturerOrderIds =  dto.manufacturerOrders?.map(order => order.id) || []

  } else {
      // dto is of type DmrOrderChildDto
      extractedClientOrderIds=  dto.clientOrderIds
      extractedManufacturerOrderIds = dto.manufacturerOrderIds
  } 

  let temp: DmrOrderMaster = {
      ...dto,
      clientOrderIds: extractedClientOrderIds,
      manufacturerOrderIds: extractedManufacturerOrderIds
  } 

  return temp

}

export interface DmrOrderFormData {
    label: string
    statusId: number | null

    orderDate: string
    notes: string
    value: number
    estimatedArrival: Date
    assignedUserIds: number[]
}

export interface DmrOrderUpdateDto {
    label?: string
    statusId?: number | null

    orderDate?: string
    notes?: string
    value?: number
    estimatedArrival?: Date
    assignedUserIds?: number[]
}

export interface DmrOrderAddDto {
    label?: string
    statusId?: number | null

    orderDate?: string
    notes?: string
    value?: number
    estimatedArrival?: Date
    assignedUserIds?: number[]
    clientOrderIds?: OrderId[]
    manufacturerOrderIds?: OrderId[]

}