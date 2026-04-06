import { TableName } from "@/types/api/TableName"

export interface AssociatedBadgeProps {
    associations: number
    type: TableName
}

export default function AssociatedBadge ({associations, type}: AssociatedBadgeProps) {
    const mapTableNameToReadable: Record<TableName, String> = {
        "client_orders" : "Client Orders",
        "dmr_orders": "DMR Orders",
        "manufacturer_orders": "Manufacturer Orders"
    }
    return (
        <div className="bg-indigo-100 px-2 py-0.5 rounded text-xs font-semibold text-indigo-600 uppercase tracking-wider">
            {associations} Associated {mapTableNameToReadable[type]}
        </div>
    )
}