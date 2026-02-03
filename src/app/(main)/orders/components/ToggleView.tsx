import { LayoutGrid, List } from "lucide-react";

interface ToggleViewProps {
    viewMode: 'cards' | 'rows'
    onToggle: () => void
}
export default function ToggleView ({viewMode, onToggle} : ToggleViewProps) {
    return (
        <div className="flex items-center gap-1 bg-white rounded-md border border-gray-200 p-0.5">

            <button
                type='button'

                onClick={onToggle}
                className={`p-1.5 rounded transition-all ${viewMode === 'cards' ? 'bg-blue-50 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                title="Card view"
            >
                <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
                type='button'
                onClick={onToggle}
                className={`p-1.5 rounded transition-all ${viewMode === 'rows' ? 'bg-blue-50 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                title="Table view"
            >
                <List className="w-3.5 h-3.5" />
            </button>
        </div>
    )
}