"use client";
import React, {
  HTMLInputAutoCompleteAttribute,
  useEffect,
  useRef,
  useState,
} from "react";
import { Search, LayoutGrid, X, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { useDmrOrdersTableContext } from "@/context/DmrOrdersTableContext";
import { SortByDropdown } from "@/components/buttons/SortByDropdown";
import { SortByType } from "@/types/api/SortByType";
import { SortDirectionType } from "@/types/api/SortDirectionType";
import ToggleView from "@/components/buttons/ToggleView";
import { useOrdersContext } from "@/context/OrdersContext";
import { useAuth } from "@/context/AuthContext";

const dmrOrderSortOptions: {
  value: SortByType;
  label: string;
}[] = [
  {
    value: "orderDate",
    label: "Order Date",
  },
  {
    value: "updatedAt",
    label: "Last Updated",
  },
  {
    value: "estimatedArrival",
    label: "Estimated Arrival",
  },
  {
    value: "createdAt",
    label: "Creation Date",
  },
];

export default function Menu() {
  const { hasPermission } = useAuth();
  const { handleShowDmrOrderModal } = useOrdersContext();
  const {
    searchValue,
    setSearchValue,
    searchLoading,
    setSearchLoading,
    sortBy,
    setSortBy,
    sortDirection,
    setSortDirection,
    viewMode,
    setViewMode,
    fetchDmrOrders,
  } = useDmrOrdersTableContext();
  const [isGroupByOpen, setIsGroupByOpen] = useState(false);
  const { register, watch, formState, setValue } = useForm<{ search: string }>({
    defaultValues: { search: "" },
  });
  const searchInput = watch("search");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const delayBounceFn = setTimeout(() => {
      triggerSearch();
    }, 500);

    return () => clearTimeout(delayBounceFn);
  }, [searchInput]);

  const triggerSearch = () => {
    setSearchLoading(true);
    setSearchValue(searchInput);
  };

  const onSortChange = (
    sortBy: SortByType,
    sortDirection: SortDirectionType,
  ) => {
    setSortDirection(sortDirection);
    setSortBy(sortBy);
  };

  const showAddButton = hasPermission("dmrOrders", "add");

  return (
    <div className="mb-4 font-sans text-gray-900">
      {/* Action Toolbar */}
      <div className="flex flex-col items-start gap-4 rounded-lg border-gray-200 py-3">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-200">
            DMR Orders
          </h1>
          {/* <div className="h-6 w-px bg-gray-300 mx-2 hidden md:block"></div> */}
          {/* <span className="text-sm text-gray-500 font-medium bg-white px-3 py-1 rounded-full border border-gray-200 shadow-sm">
              X Total Orders
          </span> */}
        </div>
        <div className="flex w-full items-center justify-between gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-4">
            <ToggleView
              viewMode={viewMode}
              onToggle={() =>
                setViewMode(viewMode == "rows" ? "cards" : "rows")
              }
            />
            <SortByDropdown
              sortBy={sortBy}
              sortDirection={sortDirection}
              options={dmrOrderSortOptions}
              onChange={onSortChange}
            />
            <div className="flex w-70 cursor-text items-center gap-2 rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-sm text-gray-500 transition-colors hover:border-gray-300">
              <button className="cursor-pointer" onClick={triggerSearch}>
                <Search className="h-4 w-4" />
              </button>

              <input
                className="appearance-none border-none bg-transparent outline-none focus:ring-0 focus:outline-none"
                value={searchInput}
                placeholder="Search"
                {...register("search")}
              />
              <div>
                <div
                  className={`ms-3 h-3 w-3 animate-spin rounded-full border-3 border-blue-500 border-t-transparent ${searchLoading ? "visible" : "invisible"}`}
                ></div>
              </div>

              {searchInput && (
                <button
                  className="cursor-pointer"
                  onClick={() => {
                    setValue("search", "", { shouldDirty: false }); // reset input
                    triggerSearch(); // reset the search results immediately
                  }}
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
          {showAddButton && (
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-600"
              onClick={() =>
                handleShowDmrOrderModal("add", undefined, undefined, () =>
                  fetchDmrOrders(),
                )
              }
            >
              <Plus size={14} />
              Add Order
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
