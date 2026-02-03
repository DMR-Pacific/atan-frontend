import { getDashboardStats } from "@/services/OrderStatsService"
import { DashboardStats } from "@/types/stats/DashboardStats"
import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"

export const useDashboardStats = () => {

    const [stats, setStats] = useState<DashboardStats>()
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState(null)

    const doGetDashboardStats = useCallback(() => {
        setLoading(true)
        let mounted = true 

        setLoading(true)

        getDashboardStats().then(res => {
            if (mounted) setStats(res.data)
        }).catch(err => {
            console.log(err)
            toast.error('Failed to get dashboard statistics.')
            if (mounted) setError(err)

        }).finally(() => {
            if (mounted) setLoading(false)

        })

        
        return () => {
            mounted = false
        }
    }, [])

    useEffect(() => {
        const cleanup = doGetDashboardStats()

        return cleanup
    }, [doGetDashboardStats])

    return {
        stats, 
        loading, 
        error, 
        refetch: doGetDashboardStats
    }
}