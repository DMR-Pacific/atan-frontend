'use client'

import { useEffect, useState } from "react"
import { ApiRefType } from "@/types/api/ApiRefType"
import { GripVertical, Plus, Trash2, X } from "lucide-react"
import { useOrdersContext } from "@/context/OrdersContext"
import ColorPicker from "./ColorPicker"
import { createReference, deleteReference, swapReferenceOrder, updateReference } from "@/services/ReferenceService"
import { RefUpdateDto } from "@/types/RefUpdateDto"
import { useForm } from "react-hook-form"
import { sortByOrderIndexDesc } from "@/utils/sort/sortOrderIndex"
import { toast } from "sonner"

export type Color = string

export interface BaseReferenceType {
  id: string
  name: string
  color: Color
}


export interface LabelConfig {
  status: BaseReferenceType[]
  priority: BaseReferenceType[]
  client: BaseReferenceType[]
}

interface EditLabelsDrawerProps {
  isOpen: boolean
  initialTab: ApiRefType
  onClose: () => void
}


export default function EditReferencesDrawer ({
    isOpen,
    initialTab,
    onClose,
}: EditLabelsDrawerProps) {
    const { references, doRefetchReferences } = useOrdersContext()
    const [activeTab, setActiveTab] = useState<ApiRefType>(initialTab)
    const [activeColorPicker, setActiveColorPicker] = useState<number | null>(
        null
    )
    const [draggedItem, setDraggedItem] = useState<number | null>(null)
    const [dragOverItem, setDragOverItem] = useState<number | null>(null)
    const [editingValue, setEditingValue] = useState<{[key in ApiRefType]: {[key: number]: string}}>({
        status: {},
        priority: {},
        category: {},
        clientType: {},
    })

    useEffect(() => {
        
        for (const ref of references[activeTab] || []) {
            setEditingValue(prev => ({
                ...prev,
                [activeTab]: {
                    ...prev[activeTab],
                    [ref.id]: ref.label
                }
            }))
        }
    }, [activeTab, initialTab, setActiveTab, references])

    // Update active tab when drawer opens with a specific intent
    useEffect(() => {
        if (isOpen) {
        setActiveTab(initialTab)
        }
    }, [isOpen, initialTab])


    const tabs: {
        id: ApiRefType
        label: string
    }[] = [
        {
        id: 'status',
        label: 'Status',
        },
        {
        id: 'priority',
        label: 'Priority',
        },
        {
        id: 'clientType',
        label: 'Client Type',
        },
        {
        id: 'category',
        label: 'Category',
        },
    ]
 
    const handleDragStart = (e: React.DragEvent, refId: number) => {
        setDraggedItem(refId)
        e.dataTransfer.effectAllowed = 'move'
    }

    const handleDragOver = (e: React.DragEvent, refId: number) => {
        e.preventDefault()
        e.dataTransfer.dropEffect = 'move'
        if (draggedItem && draggedItem !== refId) {
        setDragOverItem(refId)
        }
    }

    const handleDragLeave = () => {
        setDragOverItem(null)
    }

    const handleDrop = async (e: React.DragEvent, targetRefId: number) => {
        e.preventDefault()
        console.log("DROP")
        console.log(draggedItem, dragOverItem)

        const draggedRef = references[activeTab].find(ref => ref.id == draggedItem)
        const draggedOverRef = references[activeTab].find(ref => ref.id == dragOverItem)

        console.log("order", draggedRef?.orderIndex, draggedOverRef?.orderIndex)

        try {
            if (draggedItem == null || dragOverItem == null) return
            const response = await swapReferenceOrder(activeTab, draggedItem, dragOverItem)
            console.log(response)
        } catch (err) {
            toast.error('Failed to swap orders. Please try again.')

            console.log(err)
        }
        doRefetchReferences()

        // if (!draggedItem || draggedItem === targetRefId) {
        //     setDraggedItem(null)
        //     setDragOverItem(null)
        //     return
        // }


        // const currentLabels = [...labels[activeTab]]
        // const draggedIndex = currentLabels.findIndex((l) => l.id === draggedItem)
        // const targetIndex = currentLabels.findIndex((l) => l.id === targetRefId)
        // if (draggedIndex === -1 || targetIndex === -1) return
        // // Remove dragged item and insert at target position
        // const [removed] = currentLabels.splice(draggedIndex, 1)
        // currentLabels.splice(targetIndex, 0, removed)
        // // onReorderLabels(activeTab, currentLabels)
        // setDraggedItem(null)
        // setDragOverItem(null)
    }

    const handleDragEnd = () => {
        setDraggedItem(null)
        setDragOverItem(null)
    }


    const handleUpdateRef = async (refId: number, updateDto: RefUpdateDto) => {
        console.log(updateDto)
        try {
            const response = await updateReference(activeTab, refId, updateDto)
            doRefetchReferences()
            console.log(response)
        } catch (err) {
            toast.error('Failed to update reference. Please try again.')

            console.log(err)

        }
    }

    const handleAddRef = async () => {
        try {
            const response = await createReference(activeTab)
            toast.success('Reference added successfully')
            doRefetchReferences()

        } catch (err) {
            toast.error('Failed to add reference. Please try again.')
            console.log(err)

        }
    }
    const handleDeleteRef = async (refId: number) => {
        try { 
            const response = await deleteReference(activeTab, refId)
            toast.success('Reference deleted successfully')
            doRefetchReferences()

        } catch (err) {
            toast.error('Failed to delete reference. Please try again.')

            console.log(err)
        }
    }
    if (!isOpen) return null
    return (
        <>
        {/* Backdrop */}
        <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-75 transition-opacity"
            onClick={onClose}
        />

        {/* Drawer */}
        <div className="fixed inset-y-0 right-0 w-[400px] bg-white  dark:bg-gray-900 dark:border-gray-700 dark:text-gray-200 shadow-2xl z-100 flex flex-col transform transition-transform duration-300 ease-in-out animate-in slide-in-from-right">
     
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900  dark:text-gray-200">Edit References</h2>
            <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white rounded-full transition-colors"
            >
                <X className="w-5 h-5" />
            </button>
            </div>

            {/* Tabs */}
            <div className="flex px-6 border-b border-gray-100 dark:border-gray-700">
            {tabs.map((tab) => (
                <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-200'}`}
                >
                {tab.label}
                </button>
            ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-3">
                {references[activeTab].sort(sortByOrderIndexDesc).map((ref) => {
                    const isDragging = draggedItem === ref.id
                    const isDragOver = dragOverItem === ref.id

                    return (
                    <div
                        key={ref.id}
                        className="group flex items-center gap-3 p-2  border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all"
                        draggable
                        onDragStart={(e) => handleDragStart(e, ref.id)}
                        onDragOver={(e) => handleDragOver(e, ref.id)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, ref.id)}
                        onDragEnd={handleDragEnd}
                    >
                        <div className="text-gray-300 cursor-move">
                            <GripVertical className="w-4 h-4" />
                        </div>
                        <div className="flex row">O: <span>{ref.orderIndex}</span></div>

                        {/* Color Circle */}
                        <div className="relative">
                            <button
                                onClick={() =>
                                setActiveColorPicker(
                                    activeColorPicker === ref.id ? null : ref.id,
                                )
                                }
                                className="w-6 h-6 rounded-full border border-gray-200 shadow-sm transition-transform hover:scale-110"
                                style={{
                                    backgroundColor: ref.color,
                                }}
                            />
                            {activeColorPicker === ref.id && (
                                <ColorPicker
                                    selectedColor={ref.color}
                                    onSelect={(color) => {
                                        // onUpdateLabel(activeTab, {
                                        // ...label,
                                        // color,
                                        // })
                            
                                        handleUpdateRef(ref.id, {
                                            ...ref,
                                            color
                                        })
                                    }}
                                    onClose={() => setActiveColorPicker(null)}
                                />
                            )}
                        </div>

                        {/* Name Input */}
                        <input
                            type="text"
                            value={editingValue[activeTab]?.[ref.id] || ""}
                            onChange={(e) => {
                                setEditingValue(prev => {
                                    return {
                                        ...prev,
                                        [activeTab]: {
                                            ...prev[activeTab],
                                            [ref.id]: e.target.value
                                        }
                                    }
                                })
                            }}
                            onBlur={(e) => {

                                handleUpdateRef(ref.id, {
                                    ...ref,
                                    label: e.target.value
                                })
                            }}
                        // onChange={(e) => 
                            // onUpdateLabel(activeTab, {
                            // ...label,
                            // name: e.target.value,
                            // })
                        // }
                        className="flex-1 px-2 py-1 text-sm text-gray-900 bg-transparent border-none focus:ring-0 focus:bg-gray-50 rounded transition-colors dark:text-gray-200"
                        placeholder="Label name"
                        />

                        {/* Delete Button */}
                        <button
                            onClick={() => handleDeleteRef(ref.id)}
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md opacity-0 group-hover:opacity-100 transition-all"
                            title="Delete label"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                )})}

            </div>

            <button
                onClick={handleAddRef}
                className="mt-4 w-full py-2.5 border-2 border-dashed border-gray-200 rounded-lg text-sm font-medium text-gray-500 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
            >
                <Plus className="w-4 h-4" />
                Add New Label
            </button>
            </div>

            {/* Footer */}
            <div className="p-6 bg-gray-50 dark:bg-gray-950 dark:border-gray-700 border-t border-gray-100">
            <p className="text-xs text-gray-500 text-center">
                Changes are saved automatically
            </p>
            </div>
        </div>
        </>
    )
}

                // {INITIAL_LABELS[activeTab].map((label) => (
                // <div
                //     key={label.id}
                //     className="group flex items-center gap-3 p-2 bg-white border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all"
                // >
                //     <div className="text-gray-300 cursor-move">
                //     <GripVertical className="w-4 h-4" />
                //     </div>

                //     {/* Color Circle */}
                //     <div className="relative">
                //     <button
                //         onClick={() =>
                //         setActiveColorPicker(
                //             activeColorPicker === label.id ? null : label.id,
                //         )
                //         }
                //         className="w-6 h-6 rounded-full border border-gray-200 shadow-sm transition-transform hover:scale-110"
                //         style={{
                //         backgroundColor: label.color,
                //         }}
                //     />
                //     {activeColorPicker === label.id && (
                //         <ColorPicker
                //         selectedColor={label.color}
                //         onSelect={(color) =>
                //             onUpdateLabel(activeTab, {
                //             ...label,
                //             color,
                //             })
                //         }
                //         onClose={() => setActiveColorPicker(null)}
                //         />
                //     )}
                //     </div>

                //     {/* Name Input */}
                //     <input
                //     type="text"
                //     value={label.name}
                //     onChange={(e) =>
                //         onUpdateLabel(activeTab, {
                //         ...label,
                //         name: e.target.value,
                //         })
                //     }
                //     className="flex-1 px-2 py-1 text-sm text-gray-900 bg-transparent border-none focus:ring-0 focus:bg-gray-50 rounded transition-colors"
                //     placeholder="Label name"
                //     />

                //     {/* Delete Button */}
                //     <button
                //     onClick={() => onDeleteLabel(activeTab, label.id)}
                //     className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md opacity-0 group-hover:opacity-100 transition-all"
                //     title="Delete label"
                //     >
                //     <Trash2 className="w-4 h-4" />
                //     </button>
                // </div>
                // ))}