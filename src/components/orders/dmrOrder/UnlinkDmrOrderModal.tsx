import {AnimatePresence, motion} from 'framer-motion'
import { AlertCircle, Info, Link2Off, Loader2, RefreshCcw } from 'lucide-react'

const UnlinkDmrOrderModal = ({
  onClose,
  onUnlink
}: {
  onClose: () => void
  onUnlink: () => void

}) => {
  return (
//   <motion.div
//     initial={{
//       opacity: 0,
//     }}
//     animate={{
//       opacity: 1,
//     }}
//     exit={{
//       opacity: 0,
//     }}
<div
    className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-gray-900/20 backdrop-blur-sm"
    onClick={onClose}
  >
    <AnimatePresence>

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
      className="bg-white dark:bg-gray-900 dark:text-gray-200 rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-amber-100"
    >
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-amber-50 rounded-full flex-shrink-0">
            <Link2Off className="w-6 h-6 text-amber-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-200">
              Unlink DMR Order
            </h3>
            <p className="text-sm text-gray-600 mt-2 dark:text-gray-400">

                Are you sure you want to unlink this DMR order from the client order?

            </p>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200 dark:border-gray-700 shadow-sm dark:text-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={onUnlink}
                className="px-4 py-2 text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors shadow-sm flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                Unlink
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-500  dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200">
        <Info className="w-4 h-4" />
        <span>This will remove the association, but neither item will be deleted.</span>
      </div>
    </motion.div>
    {/* </div> */}
    </AnimatePresence>

    </div>
)}

export default UnlinkDmrOrderModal