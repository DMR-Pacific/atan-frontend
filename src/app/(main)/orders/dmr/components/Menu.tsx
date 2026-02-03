'use client'
import React, { HTMLInputAutoCompleteAttribute, useEffect, useRef, useState } from 'react'
import {
  Search,
  LayoutGrid,
  X,
  Plus,
} from 'lucide-react'
import { useForm } from "react-hook-form"
import { useDmrOrdersTableContext } from "@/context/DmrOrdersTableContext"
import { SortByDropdown } from "../../components/SortByDropdown"
import { SortByType } from "@/types/api/SortByType"
import { SortDirectionType } from "@/types/api/SortDirectionType"
import ToggleView from '../../components/ToggleView'
import { useOrdersContext } from '@/context/OrdersContext'


const dmrOrderSortOptions: {
  value: SortByType
  label: string
}[] = [
  {
    value: 'orderDate',
    label: 'Order Date',
  },
  {
    value: 'updatedAt',
    label: 'Last Updated',
  },
  {
    value: 'estimatedArrival',
    label: 'Estimated Arrival',
  },
  {
    value: 'createdAt',
    label: 'Creation Date',
  },
]


export default function Menu () {
  const {
    handleShowDmrOrderModal
  } = useOrdersContext()
  const { 
    searchValue, setSearchValue, 
    searchLoading, setSearchLoading,
    sortBy, setSortBy,
    sortDirection, setSortDirection,
    viewMode, setViewMode,
    fetchDmrOrders
  } = useDmrOrdersTableContext()
  const [isGroupByOpen, setIsGroupByOpen] = useState(false)
  const { register, watch, formState, setValue } = useForm<{ search: string }>({
    defaultValues: { search: "" },
  })
  const searchInput = watch("search")
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {

    const delayBounceFn = setTimeout(() => {
      triggerSearch()

    }, 500)

    return () => clearTimeout(delayBounceFn)
  }, [searchInput])



  const triggerSearch = () => {
    setSearchLoading(true)
    setSearchValue(searchInput)
  }

  const onSortChange = (sortBy: SortByType, sortDirection: SortDirectionType) => {
    setSortDirection(sortDirection)
    setSortBy(sortBy)
  }
  
  return (
    <div className=" bg-white text-gray-900 font-sans mb-4">
 
      {/* Action Toolbar */}
      <div className="border-gray-200 bg-white py-3 flex flex-col items-start gap-4 rounded-lg">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            DMR Orders
          </h1>
          {/* <div className="h-6 w-px bg-gray-300 mx-2 hidden md:block"></div> */}
          {/* <span className="text-sm text-gray-500 font-medium bg-white px-3 py-1 rounded-full border border-gray-200 shadow-sm">
              X Total Orders
          </span> */}
        </div>
        <div className="w-full flex items-center justify-between gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-4">

              <ToggleView
                viewMode={viewMode}
                onToggle={() => setViewMode(viewMode == 'rows' ? 'cards' : 'rows')}
              />
            <SortByDropdown
                  sortBy={sortBy}
                  sortDirection={sortDirection}            
                  options={dmrOrderSortOptions}
                  onChange={onSortChange}
                />
              <div className="flex items-center bg-white border border-gray-200 rounded-lg px-2 py-1.5 gap-2 text-sm text-gray-500 hover:border-gray-300 transition-colors cursor-text w-70">
    
                <button
                  className='cursor-pointer'
                  onClick={triggerSearch}
                >
                  <Search 
                    className="w-4 h-4" 
                  />
                </button>
      
                <input
                  className="appearance-none bg-transparent border-none outline-none focus:outline-none focus:ring-0"
                  value={searchInput}
                  placeholder="Search"
                  {...register('search')}

                />
                <div>
                  <div className={`ms-3 w-3 h-3 border-3 border-blue-500 border-t-transparent rounded-full animate-spin ${searchLoading ? 'visible' : 'invisible'}`}></div>

                </div>
  
                {searchInput &&
                <button
                  className='cursor-pointer'
                  onClick={() => {
                    setValue("search", "", { shouldDirty: false })  // reset input
                    triggerSearch() // reset the search results immediately
                  }}
                >
                  <X 

                    size={16} 
                  />
                </button>}

              </div>
            </div>
            <div>
                  <button
                    type='button'
                    className="flex items-center gap-2 text-white px-4 py-2 bg-blue-500 transition-colors hover:bg-blue-600 rounded-lg text-sm"
                    onClick={() => handleShowDmrOrderModal('add', undefined, undefined, () => fetchDmrOrders())}
                  >
                    <Plus size={14} />
                    Add Order
                  </button>
            </div>

        </div>
      </div>

    </div>
  )
}
