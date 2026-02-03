import { searchDmrOrders } from "@/services/OrderService"
import { SortByType } from "@/types/api/SortByType"
import { SortDirectionType } from "@/types/api/SortDirectionType"
import { DmrOrderDto } from "@/types/orders/DmrOrderDto"
import { toast } from "sonner"

export const doSearchDmrOrders = async (searchQuery: string, sortBy: SortByType, SortDirection: SortDirectionType): Promise<DmrOrderDto[] | undefined> => {
        try {
            const searchDto: {[key: string]: any} = {

            }

            if (searchQuery) searchDto['label'] = searchQuery
            const response = await searchDmrOrders(searchDto, sortBy, SortDirection) 
            console.log(response)
            return response.data.content
        
        } catch (err) {
            console.log(err)
            toast.error('Failed to fetch DMR orders.')
        }
    }