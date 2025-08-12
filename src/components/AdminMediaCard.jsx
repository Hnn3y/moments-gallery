import { motion } from 'framer-motion'
import { useState } from 'react'

function AdminMediaCard({ media, onStatusChange, isSelected, onToggleSelection }) {
  const [isLoading, setIsLoading] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'from-green-500 to-emerald-600'
      case 'rejected':
        return 'from-red-500 to-pink-600'
      case 'pending':
        return 'from-yellow-500 to-orange-600'
      default:
        return 'from-gray-500 to-gray-600'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return '✅'
      case 'rejected':
        return '❌'
      case 'pending':
        return '⏳'
      default:
        return '❓'
    }
  }

  const handleStatusChange = async (newStatus) => {
    setIsLoading(true)
    await onStatusChange(media.id, newStatus)
    setIsLoading(false)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <>
      <motion.div
        className={`bg-white/10 backdrop-blur-xl rounded-2xl overflow-hidden shadow-xl border-2 transition-all ${
          isSelected ? 'border-purple-400 shadow-purple-500/50' : 'border-white/20'
        }`}
        whileHover={{ y: -5, shadow: '0 20px 40px rgba(0,0,0,0.3)' }}
        layout
      >
        {/* Selection Checkbox */}
        <div className="p-4 pb-2">
          <div className="flex items-center justify-between">
            <motion.button
              onClick={() => onToggleSelection(media.id)}
              className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center ${
                isSelected 
                  ? 'bg-purple-600 border-purple-600 text-white' 
                  : 'border-white/40 hover:border-purple-400'
              }`}
              whileTap={{ scale: 0.9 }}
            >
              {isSelected && '✓'}
            </motion.button>
            <div className={`px-3 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r ${getStatusColor(media.status)}`}>
              {getStatusIcon(media.status)} {media.status.toUpperCase()}
            </div>
          </div>
        </div>

        {/* Media Preview */}
        <div className="aspect-square relative overflow-hidden mx-4 rounded-xl">
          <motion.button
            onClick={() => setShowPreview(true)}
            className="w-full h-full"
            whileHover={{ scale: 1.02 }}
          >
            {media.type === 'video' ? (
              <video
                src={media.url}
                className="w-full h-full object-cover"
                muted
              />
            ) : (
              <img
                src={media.url}
                alt={`Upload by ${media.userName}`}
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-black/20 hover:bg-black/10 transition-colors flex items-center justify-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                <div className="text-white text-2xl">
                  {media.type === 'video' ? '🎥' : '🖼️'}
                </div>
              </div>
            </div>
          </motion.button>
        </div>

        {/* Media Info */}
        <div className="p-4">
          <h3 className="text-white font-bold text-lg mb-2">{media.userName}</h3>
          <p className="text-white/70 text-sm mb-3">{media.fileName}</p>
          <p className="text-white/60 text-xs mb-4">
            Uploaded: {formatDate(media.uploadedAt)}
          </p>
          
          {media.description && (
            <p className="text-white/80 text-sm mb-4 line-clamp-2">
              {media.description}
            </p>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-2">
            {media.status !== 'approved' && (
              <motion.button
                onClick={() => handleStatusChange('approved')}
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-2 px-3 rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50"
                whileTap={{ scale: 0.98 }}
              >
                {isLoading ? '...' : '✅ Approve'}
              </motion.button>
            )}
            
            {media.status !== 'rejected' && (
              <motion.button
                onClick={() => handleStatusChange('rejected')}
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-red-600 to-pink-600 text-white py-2 px-3 rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50"
                whileTap={{ scale: 0.98 }}
              >
                {isLoading ? '...' : '❌ Reject'}
              </motion.button>
            )}
          </div>

          {/* Additional Info */}
          <div className="mt-3 pt-3 border-t border-white/20">
            <div className="flex items-center justify-between text-xs text-white/60">
              <span>Type: {media.type}</span>
              <span>ID: {media.id.slice(0, 8)}...</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Preview Modal */}
      {showPreview && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowPreview(false)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="max-w-4xl max-h-[90vh] relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowPreview(false)}
              className="absolute -top-12 right-0 text-white text-2xl hover:text-gray-300"
            >
              ✕
            </button>
            
            {media.type === 'video' ? (
              <video
                src={media.url}
                controls
                className="max-w-full max-h-full rounded-2xl"
                autoPlay
              />
            ) : (
              <img
                src={media.url}
                alt={`Upload by ${media.userName}`}
                className="max-w-full max-h-full rounded-2xl object-contain"
              />
            )}
            
            <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm text-white p-4 rounded-b-2xl">
              <h4 className="font-bold text-lg">{media.userName}</h4>
              <p className="text-white/80">{media.description}</p>
              <p className="text-white/60 text-sm mt-1">
                {formatDate(media.uploadedAt)}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  )
}

export default AdminMediaCard