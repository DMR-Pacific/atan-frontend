import { atlas_api, atlas_api_authorized } from "@/axios/Axios"
import { ApiRefType } from "@/types/api/ApiRefType"
import { RefUpdateDto } from "@/types/RefUpdateDto"

const referencesBase = "/1.0/references"

export const getReference = (refType: ApiRefType) => {
    return atlas_api_authorized.get(`${referencesBase}/${refType}`)
}


export const getAssignableUsers = () => {
    return atlas_api_authorized.get(`${referencesBase}/assignable-users`)
}

export const createReference = (refType: ApiRefType) => {
    return atlas_api_authorized.post(`${referencesBase}/${refType}`)
}

export const updateReference = (refType: ApiRefType, refId: number, refUpdateDto: RefUpdateDto) => {
    return atlas_api_authorized.put(`${referencesBase}/${refType}/${refId}`, refUpdateDto)
}

export const deleteReference = (refType: ApiRefType, refId: number) => {
    return atlas_api_authorized.delete(`${referencesBase}/${refType}/${refId}`)
}

export const swapReferenceOrder = (refType: ApiRefType, refId1: number, refId2: number) => {
    return atlas_api_authorized.put(`${referencesBase}/${refType}/swap-order/${refId1}/${refId2}`)
}