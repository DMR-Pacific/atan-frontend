import { useOrdersContext } from "@/context/OrdersContext"
import { THistory } from "@/types/THistory"
import { getRelativeTime } from "@/utils/utils"
import { Clock } from "lucide-react"

export default function HistoryRow ({entry, index} : { entry: THistory, index: number}) {
    const isLast = index === history.length - 1
    const { historyDrawerTab} = useOrdersContext()
    console.log("ENTRY", entry.operation)
    

    const deletedHistoryEntry = entry.oldVal && !entry.newVal
    return (        

      <div key={entry.id} className="relative pl-12">
        {/* Timeline dot */}
        <div
          className={`absolute left-0 top-2 w-11 h-11 rounded-full border-4 border-white shadow-md flex items-center justify-center ${index === 0 ? 'bg-blue-500' : 'bg-gray-300'}`}
        >
          <Clock className="w-5 h-5 text-white" />
        </div>

        {/* Entry card */}
        <div
          className={`bg-white  dark:bg-gray-900 dark:border-gray-700 dark:text-gray-200 border rounded-lg shadow-sm hover:shadow-md transition-all duration-200 ${index === 0 ? 'ring-2 ring-blue-100' : ''}`}
        >
          <div className="p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-400">
                    {entry.updatedByUsername}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div
                  className="text-xs text-gray-500"
                  title={new Date(entry.tstamp).toLocaleString()}
                >
                  {getRelativeTime(new Date(entry.tstamp))}
                </div>
                <div className="text-xs text-gray-400 mt-0.5">
                  {new Date(entry.tstamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
            {/* Content preview */}
          {!deletedHistoryEntry ?

            <div className="mb-3">
                <p className="text-sm text-gray-700  bg-gray-50  dark:bg-gray-900 dark:border-gray-700 dark:text-gray-200 p-3 rounded border border-gray-100">
                  
                   {entry.newVal[historyDrawerTab]}
                </p>
            </div>:
            <div className="px-4 py-2 bg-red-200 text-red-900 border border-red-900 rounded-lg">
              Entity Deleted {entry.operation}
            </div>}



          </div>
        </div>
      </div>
                    
    )
}