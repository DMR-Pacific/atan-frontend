import { useEffect, useState } from 'react'
import CollapsibleTable from './CollapsibleTable'
import { getReference } from '@/services/ReferenceService'
import { group } from 'console'
import { atlas_api_authorized } from '@/axios/Axios'
import { useOrdersContext } from '@/context/OrdersContext'
import { AnimatePresence } from 'framer-motion'
import { SelectedRowToolbar } from './SelectedRowToolbar'
import { BaseReferenceType } from '@/types/BaseReferenceType'
import { searchClientOrders } from '@/services/OrderService'
import { ClientOrderGroupContext } from '@/context/ClientOrderGroupContext'
import { sortByOrderIndexDesc } from '@/utils/sort/sortOrderIndex'
import { useClientOrdersTableContext } from '@/context/ClientOrdersTableContext'

export default function Tables () {
  const { groups } = useClientOrdersTableContext()
    return (
        <div className="w-full pb-20">
          {groups.sort(sortByOrderIndexDesc).map((group, i) => {
            return(
              <CollapsibleTable
                key={group.id}
                groupId={group.id}

                defaultExpanded={i == 0 ? true : false}
              />


            )
            })
          }


        </div>
    )
}