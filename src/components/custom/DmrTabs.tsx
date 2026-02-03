'use client'

import React, { createContext, ReactNode, useContext, useState } from "react"

const TabsContext = createContext<{
    active: number,
    setActive: (index: number) => void
    forceMount: boolean
} | null>(null)

export const DmrTabs = ({children, defaultIndex = 0, forceMount} : { children: ReactNode, defaultIndex?: number, forceMount: boolean}) => {

    const [active, setActive] = useState(defaultIndex)

    return (
        <TabsContext.Provider
            value={{
                active, setActive, forceMount
            }}
        >
            {children}
        </TabsContext.Provider>
    )
}

export const DmrTabsList = ({children} : {children: ReactNode}) => {

    return (
    <div className="flex border-b border-border overflow-x-auto">
      {React.Children.map(children, (child, index) =>
        React.cloneElement(child as any, { index })
      )}
    </div>
    )
}

export const DmrTab = ({
  children,
  index,
}: {
  children: ReactNode;
  index?: number;
}) => {

    const ctx = useContext(TabsContext);
    if (!ctx) throw new Error("Tabs.Tab must be used inside <Tabs>");

    const isActive = ctx.active === index;


    return (
        <button
            type="button"
            onClick={() => ctx.setActive(index!)}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors 
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 
                ${isActive ? 'text-foreground border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'}
            `}
            
            // className={`px-4 py-2 border-b-2 transition-all
            //     ${
            //     isActive
            //         ? "border-blue-600 text-blue-600"
            //         : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            //     }`}
            >
            {children}
        </button>
    )
}

export const DmrPanels = ({ children }: { children: ReactNode }) => {
  return (
    <div className="mt-4">
      {React.Children.map(children, (child, index) =>
        React.cloneElement(child as any, { index })
      )}
    </div>
  )
}

export const DmrPanel = (
    {
        children,
        index,
    }: 
    {
        children: ReactNode;
        index?: number | string;
    }
) => {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error("Tabs.Panel must be used inside <Tabs>");

  if (!ctx.forceMount && ctx.active !== index) return null;

  return <div style={{display: ctx.active == index ? 'block' : 'none'}}>{children}</div>;
};