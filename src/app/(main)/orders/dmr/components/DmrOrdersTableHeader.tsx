import { Info } from "lucide-react"
import { DMR_ORDERS_HEADERS } from "../../components/DmrOrders/DmrOrdersSubTable"

interface DmrOrdersTableHeader {

}


export default function DmrOrdersTableHeader () {

  const HEADERS_COLUMN_SIZE_STR: string = DMR_ORDERS_HEADERS.reduce((acc, next) => {
    if (!acc) return next.width || ""
    return acc+"_"+next.width
}, "")
    
    return (

            <div 
            // 60px_250px_minmax(80px,120px)_140px__140px_150px_275px
                className={` grid grid-cols-[${HEADERS_COLUMN_SIZE_STR}] gap-0 border-y border-gray-200 bg-white text-xs text-gray-500 font-medium `}
            >
                {DMR_ORDERS_HEADERS.map((header, index) => (
                    <div
                    key={index}
                    className={`px-2 py-2 h-8 flex items-center border-r border-gray-100 last:border-r-0 ${header.align === 'center' ? 'justify-center' : ''}`}
                    >
                    <span className="truncate">{header.label}</span>
                    {/* {header.info && <Info size={12} className="ml-1 text-gray-300" />} */}
                    </div>
                ))}

            </div>

    )
}