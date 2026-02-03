'use client'

import { getReference } from "@/services/ReferenceService"
import { ApiRefType } from "@/types/api/ApiRefType"
import { BaseReferenceType } from "@/types/BaseReferenceType"
import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"


export function useReference(refType: ApiRefType) {
    const [data, setData] = useState<BaseReferenceType[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState(null)

    const fetchData = useCallback(() => {
        // reset error 
        setError(null)

        let mounted = true
        setLoading(true)

        getReference(refType)
            .then(res => {
                if (mounted) setData(res.data)

            })
            .catch(err => {
                if (mounted) setError(err)
                    toast.error(`Failed to fetch reference (${refType}).`)
            })
            .finally(() => {
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
        data,
        loading,
        error,
        refetch: fetchData
    }
}