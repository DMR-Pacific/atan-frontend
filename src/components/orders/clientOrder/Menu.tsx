"use client";
import { useOrdersContext } from "@/context/OrdersContext";
import React, {
  HTMLInputAutoCompleteAttribute,
  useEffect,
  useRef,
  useState,
} from "react";
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
} from "lucide-react";
import { GroupByDropdown } from "../../buttons/GroupByDropdown";
import { delay } from "framer-motion";
import { useForm } from "react-hook-form";
import { SortByDropdown } from "../../buttons/SortByDropdown";
import { SortByType } from "@/types/api/SortByType";
import { SortDirectionType } from "@/types/api/SortDirectionType";
import ToggleView from "../../buttons/ToggleView";
import { ViewMode } from "@/types/ViewMode";
import { useClientOrdersTableContext } from "@/context/ClientOrdersTableContext";
import { useAuth } from "@/context/AuthContext";

const clientOrderSortOptions: {
  value: SortByType;
  label: string;
}[] = [
  {
    value: "dueDate",
    label: "Due Date",
  },
  {
    value: "updatedAt",
    label: "Last Updated",
  },
  {
    value: "value",
    label: "Value",
  },
  {
    value: "createdAt",
    label: "Creation Date",
  },
];

export default function Menu() {
  const [viewMode, setViewMode] = useState<ViewMode>("rows");
  const { handleShowClientOrderModal } = useOrdersContext();

  const { hasPermission } = useAuth();
  const {
    groupBy,
    setGroupBy,
    setSearchValue,
    searchLoading,
    sortBy,
    setSortBy,
    sortDirection,
    setSortDirection,
    doGetAllOrdersByGroup,
  } = useClientOrdersTableContext();
  const [isGroupByOpen, setIsGroupByOpen] = useState(false);
  const [isSortByOpen, setIsSortByOpen] = useState<boolean>(false);

  const { register, watch, formState, setValue } = useForm<{ search: string }>({
    defaultValues: { search: "" },
  });
  const searchInput = watch("search");

  useEffect(() => {
    const delayBounceFn = setTimeout(() => {
      triggerSearch();
    }, 500);

    return () => clearTimeout(delayBounceFn);
  }, [searchInput]);

  const triggerSearch = () => {
    setSearchValue(searchInput);
  };

  const onSortChange = (
    sortBy: SortByType,
    sortDirection: SortDirectionType,
  ) => {
    setSortDirection(sortDirection);
    setSortBy(sortBy);
  };

  const showAddButton = hasPermission("clientOrders", "add");
  return (
    <div className="bg-white font-sans text-gray-900 dark:bg-gray-900">
      {/* Action Toolbar */}
      <div className="flex flex-col gap-4 rounded-lg border-gray-200 py-3">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-200">
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
            <div className="relative">
              <button
                onClick={() => setIsGroupByOpen((prev) => !prev)}
                className="flex cursor-pointer items-center gap-2 rounded-md border border-blue-100 bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-200"
              >
                <LayoutGrid className="h-4 w-4" />
                <span>Group by</span>
                <span className="rounded border border-blue-100 bg-white px-2 py-0.5 text-xs text-gray-700 shadow-sm">
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

          <div>
            {showAddButton && (
              <button
                type="button"
                className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-600"
                onClick={() => {
                  handleShowClientOrderModal(
                    "add",
                    undefined,
                    undefined,
                    doGetAllOrdersByGroup,
                  );
                }}
              >
                <Plus size={14} />
                Add Order
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
