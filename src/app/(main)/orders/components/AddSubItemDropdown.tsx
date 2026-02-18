import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"
import { FolderPlus, Plus, PlusCircle } from "lucide-react"

interface AddSubItemDropdownProps {
    onNew: () => void
    onExisting: () => void
}
export default function AddSubItemDropdown ({onNew, onExisting} : AddSubItemDropdownProps ) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className=" py-2 px-4 text-xs bg-blue-500 hover:bg-blue-600 rounded-lg text-white gap-2 flex transition-colors">
                    <Plus size={14}/>
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="start"
                className="bg-white dark:bg-gray-900 border dark:border-gray-700 dark:text-gray-200 shadow-md rounded-md w-48 py-1 z-100"
            >
                <DropdownMenuItem
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 text-green-600 flex gap-2 items-center"
                    onClick={onNew}
                >
                    <PlusCircle size={14} />
                    <span>
                        New
                    </span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 text-blue-600 flex gap-2 items-center"
                    onClick={onExisting}
                >
                    <FolderPlus size={14} />
                    <span>
                        Add Existing 
                    </span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}