// THistory with raw JSON for oldVal and newVal

export interface THistory {
    id: number
    tstamp: Date
    schemaName: string
    tabName: string
    rowId: string
    operation: string
    dbUser: string
    appUserId: string
    updatedByUsername: string
    oldVal: any // stringified json object
    newVal: any // stringified json object
}