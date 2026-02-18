import { AssignedToDto } from "@/types/AssignedToDto";
import { Avatar } from "@/components/Avatar";
import { useOrdersContext } from "@/context/OrdersContext";
import { useEffect, useRef, useState } from "react";
import { PlusIcon, X } from "lucide-react";

export interface AssignedToCellProps {
    assignedToList: AssignedToDto[]
    handleAssign: (userIdToAssign: number) => void
    handleUnassign: (userIdToUnassign: number) => void 
}


export default function AssignedToCell ({assignedToList, handleAssign, handleUnassign} : AssignedToCellProps) {
    const dropdownRef = useRef<HTMLDivElement>(null)
    const { assignableUsers } =  useOrdersContext()
    const [ isMenuOpen, setIsMenuOpen ] = useState<boolean>(false)
    const [editing, setEditing] = useState<boolean>(false)

    const onClose = () => {
        setIsMenuOpen(false)
    }

    useEffect(() => {
        if (!isMenuOpen) return

   

        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                onClose?.()
            }
        }

        document.addEventListener('mousedown', handleClickOutside)

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isMenuOpen, onClose])


    return (


        <div 
            className="relative cursor-pointer px-2 py-2 "
            ref={dropdownRef}
            onClick={() => setIsMenuOpen(prev => !prev)}
            onMouseEnter={() => setEditing(true)}
            onMouseLeave={() => setEditing(false)}

        >
            <div
                className='w-full px-2 flex flex-row items-center group'
            >
   
                <button className={`w-5 h-5 rounded-full ${editing && 'bg-blue-800'} flex items-center justify-center transition opacity-0 group-hover:opacity-100`}>
                    {editing && <PlusIcon size={16} className="text-white" />}
                </button>
                <div 
                    className='flex -space-x-2'
                >

                    {assignedToList.length > 0 &&
                    assignedToList.map((assignedUser, i) => {
                        return (
                            <Avatar 
                                key={i}
                                initials={assignedUser?.firstName[0] + assignedUser?.lastName[0] }
                                className=""
                            />
                        )
                    })}
                </div>
            </div>

            {isMenuOpen &&
            <div className="absolute top-full left-1/2 mt-1 z-50 bg-white border rounded shadow-lg p-4 transform -translate-x-1/2 w-100 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-200">
                {/* Current assignments */}
                <div className="flex gap-4">
                    {assignedToList.map((assignedUser, i) => {
                        return (
                            <div 
                                key={i}
                                className="bg-blue-100 px-2 py-1 flex items-center rounded"
                            >
                                <Avatar 
                                    key={i}
                                    initials={assignedUser?.firstName[0] + assignedUser?.lastName[0] }
                                />
                                <span className="me-2 ms-1">
                                    {assignedUser.fullName}

                                </span>
                                <button
                                    onClick={() => {
                                        // doUnassignUserClientOrder(assignedUser.id, clientOrder.id)
                                        handleUnassign(assignedUser.id)
                                    }}
                                >
                                    <X size={17}/>
                                </button>
                            </div>
                        )
                    })

                }
                </div>
                <div className="mt-4">
                    <div className="mb-2">
                        Assign to 
                    </div>
                    <div className='flex flex-col gap-2 cursor-pointer'>

                        {assignableUsers.filter(assignable => !assignedToList.find(assignedTo => assignedTo.id == assignable.id)).map((user, i) => {
                            return (
                                <button 
                                    key={i} 
                                    className='flex items-center py-2 px-2 rounded hover:bg-gray-100'
                                    onClick={() => {
                                        // doAssignUserClientOrder(user.id, clientOrder.id)
                                        handleAssign(user.id)
                                    }}
                                >
                                    <Avatar 
                                        key={i}
                                        initials={user?.firstName[0] + user?.lastName[0] }
                                        onClick={() => {setIsMenuOpen(prev => (!prev))}}
                                    />
                                    <span className='ms-3 leading-none '>
                                        {user.firstName} {user.lastName}
                                    </span>
                                </button>
                            )
                        })}
                    </div>
                </div>

            </div>}
        </div>

    )
}