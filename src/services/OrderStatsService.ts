import { atlas_api, atlas_api_authorized } from "@/axios/Axios"

const orderStatsBase = "/api/1.0/order-stats"


export const getDashboardStats = () => {
    return atlas_api_authorized.get(`${orderStatsBase}`)
}