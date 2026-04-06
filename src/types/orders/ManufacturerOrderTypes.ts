import { DmrOrderChildDto, DmrOrderDto } from "./DmrOrderTypes"
import { OrderId } from "./order-types"

interface ManufacturerOrderBase {
    id: number
    orderNumber: string
    statusId: number
    notes: string 
    estimatedArrival: Date // Date
    createdAt: Date // DateTime
    updatedAt: Date // DateTime 
}

export interface ManufacturerOrderDto extends ManufacturerOrderBase{
    dmrOrder: DmrOrderChildDto
}

export interface ManufacturerOrderChildDto extends ManufacturerOrderBase {
    dmrOrderId: number
}

export interface ManufacturerOrderMaster {
    id: number
    orderNumber: string
    statusId: number
    notes: string 
    estimatedArrival: Date // Date
    dmrOrderId: OrderId
    createdAt: Date // DateTime
    updatedAt: Date // DateTime 
}

export const mapManufacturerOrderChildDtoToMaster = (manufacturerOrderChildDto: ManufacturerOrderChildDto): ManufacturerOrderMaster => {

    let temp: ManufacturerOrderMaster = {
        ...manufacturerOrderChildDto,

        // client orders must be changed to id's only since we will fetch them from the masterClientOrders store instead
        dmrOrderId: manufacturerOrderChildDto.dmrOrderId
    } 

    return temp
}

export const mapManufacturerOrderDtoToMaster = (dto: ManufacturerOrderDto | ManufacturerOrderChildDto): ManufacturerOrderMaster => {

    let extractedDmrOrderId: number

    let otherFields: ManufacturerOrderBase 

    if (hasDmrOrderDto(dto)) {
        // dto is of type ManufacturerOrderDto
        extractedDmrOrderId =  dto.dmrOrder.id
        const { dmrOrder, ...rest } = dto;
        otherFields = rest

    } else {
        // dto is of type ManufacturerOrderChildDto
        extractedDmrOrderId =  dto.dmrOrderId
        const { dmrOrderId, ...rest } = dto;
        otherFields = rest
    } 

    let temp: ManufacturerOrderMaster = {
        ...otherFields,
        dmrOrderId: extractedDmrOrderId
    } 

    return temp
}

export interface ManufacturerOrderAddDto {

    orderNumber: string
    statusId: number| null
    notes: string
    estimatedArrival: Date | null

    dmrOrderId: number 

}

export interface ManufacturerOrderUpdateDto {

    orderNumber: string
   statusId: number | null
    notes: string
   estimatedArrival: Date | null

}

export interface ManufacturerOrderForm {
    orderNumber: string
    statusId?: number
    notes: string
    estimatedArrival?: Date

    dmrOrderId?: number 
}

export const mapManufacturerOrderFormToAddDto = (form: ManufacturerOrderForm): ManufacturerOrderAddDto=> {
    if (!form.dmrOrderId) {
        throw new Error('Every manufacturer order must have a dmr order') 
    }


    return {
        orderNumber: form.orderNumber,
        notes: form.notes,
        estimatedArrival: form.estimatedArrival || null,
        statusId: form.statusId || null,
        dmrOrderId: form.dmrOrderId
    }
}


export const mapManufacturerOrderFormToUpdateDto = (form: ManufacturerOrderForm): ManufacturerOrderUpdateDto=> {

    return {
        orderNumber: form.orderNumber,
        notes: form.notes,
        estimatedArrival: form.estimatedArrival || null,
        statusId: form.statusId || null,
    }
}

export const hasDmrOrderDto = (dto: ManufacturerOrderDto | ManufacturerOrderChildDto): dto is ManufacturerOrderDto => {
    return "dmrOrder" in dto && dto.dmrOrder != null
}
