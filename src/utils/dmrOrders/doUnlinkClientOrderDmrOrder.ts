import { unlinkClientOrderDmrOrder,  } from "@/services/OrderService"
import { toast } from "sonner"

export const doUnlinkClientOrderDmrOrder = async (clientOrderId: number, dmrOrderId: number)=> {

    try {
        const response = await unlinkClientOrderDmrOrder(clientOrderId, dmrOrderId)
        console.log(response)
        return true
    } catch (err) {
        toast.error(`Failed to unlink DMR order (${dmrOrderId}) from client order (${clientOrderId}).`)

        console.log(err)
        return false
    }

}