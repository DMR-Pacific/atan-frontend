import { getAssignableUsers } from "@/services/ReferenceService";
import { AssignedUserDto } from "@/types/AssignedUserDto";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export function useAssignableUsers () {

    const [assignableUsers, setAssignableUsers] = useState<AssignedUserDto[]>([])

    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState(null)

    const fetchData = useCallback(() => {
        setError(null)

        let mounted = true
        setLoading(true)

        getAssignableUsers()
        .then((res) => {
            if (mounted) setAssignableUsers(res.data)
        }).catch(err => {
            toast.error('Failed to fetch assignable users.')
            if (mounted) setError(err)
        }).finally(() => {
            if (mounted) setLoading(false)
        })

        return () => {
            mounted = false
        }

    }, [])
    
    useEffect(() => {
        const cleanup = fetchData() 

        return cleanup
    }, [fetchData])

    return {
        assignableUsers,
        loading,
        error,
        refetch: fetchData
    }
}