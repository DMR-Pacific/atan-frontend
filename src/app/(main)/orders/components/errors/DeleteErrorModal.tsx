import {motion} from 'framer-motion'
import { AlertCircle, Info, Loader2, RefreshCcw } from 'lucide-react'

const DeleteErrorModal = ({
  count,
  onRetry,
  onClose,
  isRetrying,
}: {
  count: number
  onRetry: () => void
  onClose: () => void
  isRetrying?: boolean
}) => (
  <motion.div
    initial={{
      opacity: 0,
    }}
    animate={{
      opacity: 1,
    }}
    exit={{
      opacity: 0,
    }}
    className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-gray-900/20 backdrop-blur-sm"
  >
    <motion.div
      initial={{
        scale: 0.95,
        opacity: 0,
        y: 10,
      }}
      animate={{
        scale: 1,
        opacity: 1,
        y: 0,
      }}
      exit={{
        scale: 0.95,
        opacity: 0,
        y: 10,
      }}
      className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-red-100"
    >
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-red-50 rounded-full flex-shrink-0">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">
              Failed to delete items
            </h3>
            <p className="text-sm text-gray-600 mt-2">
              We encountered an error while attempting to delete{' '}
              <span className="font-medium text-gray-900">
                {count} selected items
              </span>
              . This might be due to a network issue or server constraint.
            </p>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200 shadow-sm"
              >
                Cancel
              </button>
              <button
                onClick={onRetry}
                disabled={isRetrying}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-sm flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isRetrying ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Retrying...
                  </>
                ) : (
                  <>
                    <RefreshCcw className="w-4 h-4" />
                    Retry Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-500">
        <Info className="w-4 h-4" />
        {/* <span>Error code: BULK_DELETE_TIMEOUT_504</span> */}
      </div>
    </motion.div>
  </motion.div>
)

export default DeleteErrorModal