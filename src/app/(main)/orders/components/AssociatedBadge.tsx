import { TableName } from "@/types/api/TableName"

export interface AssociatedBadgeProps {
    associations: number
    type: TableName
}

export default function AssociatedBadge ({associations, type}: AssociatedBadgeProps) {
    return (
        <div className="bg-indigo-100 px-2 py-0.5 rounded text-xs font-semibold text-indigo-600 uppercase tracking-wider">
            {associations} Associated {type == 'client_orders' ? "Client Orders" : "DMR Orders"}
        </div>
    )
}