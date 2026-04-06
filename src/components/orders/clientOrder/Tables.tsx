import { useEffect, useState } from 'react'
import CollapsibleTable from './CollapsibleTable'

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