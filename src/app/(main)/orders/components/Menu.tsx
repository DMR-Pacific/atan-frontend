'use client'
import { useOrdersContext } from "@/context/OrdersContext"
import React, { HTMLInputAutoCompleteAttribute, useEffect, useRef, useState } from 'react'
import {
  Search,
  User,
  Filter,
  ArrowUpDown,
  EyeOff,
  LayoutGrid,
  MoreHorizontal,
  Plus,
  ChevronDown,
  Sparkles,
  Zap,
  MessageCircle,
  Settings,
  X,
} from 'lucide-react'
import { GroupByDropdown } from "./GroupByDropdown"
import { delay } from "framer-motion"
import { useForm } from "react-hook-form"
import { SortByDropdown } from "./SortByDropdown"
import { SortByType } from "@/types/api/SortByType"
import { SortDirectionType } from "@/types/api/SortDirectionType"
import ToggleView from "./ToggleView"
import { ViewMode } from "@/types/ViewMode"
import { useClientOrdersTableContext } from "@/context/ClientOrdersTableContext"


const clientOrderSortOptions: {
  value: SortByType
  label: string
}[] = [
  {
    value: 'dueDate',
    label: 'Due Date',
  },
  {
    value: 'updatedAt',
    label: 'Last Updated',
  },
  {
    value: 'value',
    label: 'Value',
  },
  {
    value: 'createdAt',
    label: 'Creation Date',
  },
]

export default function Menu () {
  const [viewMode,setViewMode] = useState<ViewMode>('rows')
  const {

    handleShowClientOrderModal
  } = useOrdersContext()

  const {
    groupBy, setGroupBy, 
    setSearchValue, 
    searchLoading, 
    sortBy, setSortBy,
    sortDirection, setSortDirection, doGetAllOrdersByGroup
  } = useClientOrdersTableContext()
  const [isGroupByOpen, setIsGroupByOpen] = useState(false)
  const [isSortByOpen, setIsSortByOpen] = useState<boolean>(false)

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
    setSearchValue(searchInput)
  }

  const onSortChange = (sortBy: SortByType, sortDirection: SortDirectionType) => {
    setSortDirection(sortDirection)
    setSortBy(sortBy)
  }
  
  return (
    <div className=" bg-white dark:bg-gray-900 text-gray-900 font-sans">
 
      {/* Action Toolbar */}
      <div className="border-gray-200  py-3 flex flex-col gap-4 rounded-lg">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-200 tracking-tight">
            Client Orders
          </h1>
          {/* <div className="h-6 w-px bg-gray-300 mx-2 hidden md:block"></div> */}

          {/* <span className="text-sm text-gray-500 font-medium bg-white px-3 py-1 rounded-full border border-gray-200 shadow-sm">
              X Total Orders
          </span> */}
        </div>

        <div className="flex items-center justify-between gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-4">

              {/* <ToggleView
                viewMode={viewMode}
                onToggle={() => setViewMode(viewMode == 'rows' ? 'cards' : 'rows')}
              /> */}

              {/* Group By */}
              <div className='relative'>
                <button 
                  onClick={() => setIsGroupByOpen(prev => (!prev))}
                
                  className="flex items-center gap-2  px-3 py-1.5 rounded-md border border-blue-100 text-sm text-blue-700 font-medium cursor-pointer bg-blue-50  hover:bg-blue-200 transition-colors"
                >
                  <LayoutGrid className="w-4 h-4" />
                  <span>Group by</span>
                  <span className="bg-white px-2 py-0.5 rounded text-xs border border-blue-100 shadow-sm text-gray-700">
                    {groupBy}
                  </span>
                </button>
                <GroupByDropdown 
                  isOpen={isGroupByOpen}
                  onClose={() => setIsGroupByOpen(false)}
                  selectedColumn={groupBy}
                />
                
              </div>

              <SortByDropdown 
                sortBy={sortBy}
                sortDirection={sortDirection}            
                options={clientOrderSortOptions}
                onChange={onSortChange}
              />
              {/* Search */}
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

                {searchInput && <button
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
              className='bg-blue-500 transition-colors hover:bg-blue-600 rounded-lg text-sm gap-2 px-4 py-2 text-white flex items-center'
              onClick={() => {handleShowClientOrderModal('add', undefined, undefined, doGetAllOrdersByGroup )}}
            >
              <Plus size={14}/>
              Add Order
            </button>
          </div>

        </div>


      </div>


    </div>
  )
}
