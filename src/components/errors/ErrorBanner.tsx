import { motion } from 'framer-motion'
import { AlertTriangle, X } from 'lucide-react'



const ErrorBanner = ({
  message,
  onDismiss,
  onRetry,
}: {
  message: string
  onDismiss: () => void
  onRetry?: () => void
}) => (
  <motion.div
    initial={{
      height: 0,
      opacity: 0,
    }}
    animate={{
      height: 'auto',
      opacity: 1,
    }}
    exit={{
      height: 0,
      opacity: 0,
    }}
    className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-6 rounded-r shadow-sm flex items-start justify-between"
  >
    <div className="flex items-start gap-3">
      <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
      <div>
        <h3 className="text-sm font-medium text-amber-800">Warning</h3>
        <p className="text-sm text-amber-700 mt-1">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-2 text-sm font-medium text-amber-800 hover:text-amber-900 underline decoration-amber-800/30 hover:decoration-amber-900/50 underline-offset-2 transition-all"
          >
            Try again
          </button>
        )}
      </div>
    </div>
    <button
      onClick={onDismiss}
      className="text-amber-400 hover:text-amber-600 transition-colors p-1 rounded-full hover:bg-amber-100"
    >
      <X className="w-4 h-4" />
    </button>
  </motion.div>
)

export default ErrorBanner