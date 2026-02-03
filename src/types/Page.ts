export interface Page<T> {
        content: T[]
        empty: boolean
        first: boolean
        last: boolean
        number: number
        numberOfElements: number
        pageable: any
        size: number
        sort: any
        totalElement: number
        totalPages: number
}