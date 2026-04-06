import { searchDmrOrders } from "@/services/orders/DmrOrderService"
import { Operation } from "@/types/api/FilterCriteriaDto"
import { GlobalOperator, SearchRequestDto } from "@/types/api/SearchRequestDto"
import { SortByType } from "@/types/api/SortByType"
import { SortDirectionType } from "@/types/api/SortDirectionType"
import { DmrOrderDto } from "@/types/orders/DmrOrderTypes"
import { toast } from "sonner"

export const doSearchDmrOrders = async (searchRequestDto: SearchRequestDto): Promise<DmrOrderDto[] | undefined> => {
        try {

            const response = await searchDmrOrders(searchRequestDto) 
            console.log(response)
            return response.data
        
        } catch (err) {
            console.log(err)
            toast.error('Failed to fetch DMR orders.')
        }
    }

// export const doSearchDmrOrders = async (searchQuery: string, sortBy: SortByType, SortDirection: SortDirectionType): Promise<DmrOrderDto[] | undefined> => {
//         try {
//             const searchDto: {[key: string]: any} = {

//             }

//             if (searchQuery) searchDto['label'] = searchQuery
//             const response = await searchDmrOrders(searchDto, sortBy, SortDirection) 
//             console.log(response)
//             return response.data.content
        
//         } catch (err) {
//             console.log(err)
//             toast.error('Failed to fetch DMR orders.')
//         }
//     }