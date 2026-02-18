'use client'

import React, { useEffect, useRef } from 'react'
import { AlertTriangle, X, Trash2 } from 'lucide-react'
import { Button } from './Button'
import { useOrdersContext } from '@/context/OrdersContext'
import { OrderId } from '@/types/orders/order-types'
import { DmrOrderMaster } from '@/types/orders/DmrOrderMaster'
import { ClientOrderMaster } from '@/types/orders/ClientOrderMaster'

interface WarnDeleteModalProps {
    visible: boolean    
    onClose: () => void
    orderIds: OrderId[]
    getOrderDetails: (id: OrderId) => DmrOrderMaster | ClientOrderMaster | undefined
    onSubmit: () => void
    isDeleting?: boolean
}
export function WarnDeleteModal({
  visible,
  onClose,
  orderIds,
  getOrderDetails,
  onSubmit,
  isDeleting = false,
}: WarnDeleteModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const confirmButtonRef = useRef<HTMLButtonElement>(null)

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!visible) return
      if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [visible, onClose])
  // Focus management
  useEffect(() => {
    if (visible) {
      // Small delay to ensure render
      setTimeout(() => {
        confirmButtonRef.current?.focus()
      }, 50)
      // Prevent body scroll
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [visible])
  if (!visible) return null
  const orderCount = orderIds.length
  // Calculate total value for summary
  const totalValue = orderIds.reduce((sum, id) => {
    const details = getOrderDetails(id)
    return sum + (details?.value || 0)
  }, 0)
  // Get currency from first order or default to USD
  const currency = 'USD'
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(value)
  }
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={() => onClose()}
        aria-hidden="true"
      />

      {/* Modal Panel */}
      <div
        ref={modalRef}
        className="relative w-full max-w-lg transform overflow-hidden rounded-xl bg-white border dark:bg-gray-900 dark:border-gray-700 dark:text-gray-200 shadow-2xl transition-all animate-in zoom-in-95 duration-200 sm:my-8"
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-gray-100 px-6 py-5 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h3
                className="text-lg font-semibold leading-6 text-gray-900 dark:text-gray-200"
                id="modal-title"
              >
                Delete Orders
              </h3>
              <p className="text-sm text-gray-500">
                This action cannot be undone.
              </p>
            </div>
          </div>
          <button
            type="button"
            className="rounded-md p-2 dark:hover:bg-gray-800 dark:text-white transition-colors text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            onClick={() => onClose()}
          >
            <span className="sr-only">Close</span>
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          <div className="mb-4 rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Warning</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>
                    You are about to permanently delete{' '}
                    <span className="font-bold">{orderCount}</span>{' '}
                    {orderCount === 1 ? 'order' : 'orders'} totaling{' '}
                    <span className="font-bold">
                      {formatCurrency(totalValue)}
                    </span>
                    .
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Orders to be deleted:
            </label>
            <div className="max-h-60 overflow-y-auto rounded-md border border-gray-200 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 shadow-inner">
              <ul role="list" className="divide-y divide-gray-200">
                {orderIds.map((id) => {
                  const details = getOrderDetails(id)
                  if (!details) return null
                  return (
                    <li
                      key={id}
                      className="flex items-center justify-between px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 dark:border-gray-700 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded bg-white dark:bg-gray-950 dark:border-gray-700 border border-gray-200 text-gray-400">
                          <Trash2 className="h-4 w-4" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-900 dark:text-gray-200">
                            #{details.label}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            ID: {id}
                          </span>
                        </div>
                      </div>
                      <span className="text-sm font-mono font-medium text-gray-900 dark:text-gray-400">
                        {formatCurrency(details.value)}
                      </span>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex flex-col-reverse sm:flex-row sm:justify-end gap-3 border-t border-gray-100 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-200">
          <Button
            variant="outline"
            onClick={() => onClose()}
            disabled={isDeleting}
            className="w-full sm:w-auto dark:border-gray-700 dark:text-gray-200 hover:bg-gray-800"
          >
            Cancel
          </Button>
          <Button
            ref={confirmButtonRef}
            variant="destructive"
            onClick={onSubmit}
            isLoading={isDeleting}
            className="w-full sm:w-auto"
          >
            Delete {orderCount} {orderCount === 1 ? 'Order' : 'Orders'}
          </Button>
        </div>
      </div>
    </div>
  )
}
