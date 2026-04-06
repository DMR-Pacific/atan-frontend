import { atan_api, atan_api_authorized } from "@/axios/Axios"

const orderStatsBase = "/1.0/order-stats"


export const getDashboardStats = () => {
    return atan_api_authorized.get(`${orderStatsBase}`)
}