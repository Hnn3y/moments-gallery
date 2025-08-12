import { motion } from 'framer-motion'
import { useState } from 'react'

function MediaCard({ media, index }) {
  const [imageError, setImageError] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isImageLoaded, setIsImageLoaded] = useState(false)

  // Enhanced color variations based on user
  const getCardStyle = (userId, index) => {
    const colorSchemes = [
      {
        gradient: 'from-violet-400 via-purple-500 to-indigo-600',
        accent: 'bg-violet-500',
        glow: 'shadow-violet-500/25'
      },
      {
        gradient: 'from-emerald-400 via-teal-500 to-cyan-600', 
        accent: 'bg-emerald-500',
        glow: 'shadow-emerald-500/25'
      },
      {
        gradient: 'from-pink-400 via-rose-500 to-red-600',
        accent: 'bg-pink-500',
        glow: 'shadow-pink-500/25'
      },
      {
        gradient: 'from-amber-400 via-orange-500 to-red-500',
        accent: 'bg-amber-500',
        glow: 'shadow-amber-500/25'
      },
      {
        gradient: 'from-purple-400 via-pink-500 to-rose-600',
        accent: 'bg-purple-500',
        glow: 'shadow-purple-500/25'
      },
      {
        gradient: 'from-blue-400 via-indigo-500 to-purple-600',
        accent: 'bg-blue-500',
        glow: 'shadow-blue-500/25'
      },
      {
        gradient: 'from-teal-400 via-cyan-500 to-blue-600',
        accent: 'bg-teal-500',
        glow: 'shadow-teal-500/25'
      },
      {
        gradient: 'from-rose-400 via-pink-500 to-fuchsia-600',
        accent: 'bg-rose-500',
        glow: 'shadow-rose-500/25'
      }
    ]
    
    const schemeIndex = userId ? userId.length % colorSchemes.length : index % colorSchemes.length
    return colorSchemes[schemeIndex]
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now - date) / (1000 * 60 * 60)
    
    if (diffInHours < 1) return 'Just now ✨'
    if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const cardStyle = getCardStyle(media.userId, index)

  return (
    <motion.div
      className={`glass-card group cursor-pointer relative overflow-hidden ${isHovered ? cardStyle.glow + ' shadow-2xl' : 'shadow-lg'}`}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ 
        scale: 1.03,
        rotateY: 5,
        transition: { duration: 0.3 }
      }}
      whileTap={{ scale: 0.98 }}
      layout
    >
      {/* Magical border effect */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-r ${cardStyle.gradient} opacity-0 group-hover:opacity-20 rounded-3xl`}
        transition={{ duration: 0.4 }}
      />
      
      {/* Sparkle effects */}
      <motion.div
        className="absolute top-4 right-4 text-yellow-300 text-lg z-20"
        animate={{ 
          rotate: [0, 360],
          scale: [1, 1.2, 1],
          opacity: [0.7, 1, 0.7]
        }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        ✨
      </motion.div>

      {/* Media Container */}
      <div className="aspect-square relative overflow-hidden rounded-t-3xl">
        {/* Loading shimmer */}
        {!isImageLoaded && !imageError && (
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        )}

        {/* Gradient overlay on hover */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-t ${cardStyle.gradient} z-10`}
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 0.3 : 0 }}
          transition={{ duration: 0.3 }}
        />
        
        {media.type === 'video' ? (
          <video
            src={media.url}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            muted
            loop
            playsInline
            onMouseEnter={(e) => e.target.play()}
            onMouseLeave={(e) => e.target.pause()}
            onLoadedData={() => setIsImageLoaded(true)}
          />
        ) : (
          <img
            src={media.url}
            alt={`Moment by ${media.userName}`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={() => setImageError(true)}
            onLoad={() => setIsImageLoaded(true)}
          />
        )}

        {imageError && (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="text-center text-gray-400">
              <motion.div 
                className="text-5xl mb-3"
                animate={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                📷
              </motion.div>
              <p className="text-sm">Image not available</p>
            </div>
          </div>
        )}

        {/* Hover overlay content */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center z-20"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: isHovered ? 1 : 0,
            scale: isHovered ? 1 : 0.8
          }}
          transition={{ duration: 0.2 }}
        >
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-2 text-center">
            <div className="text-2xl mb-1">
              {media.type === 'video' ? '🎥' : '📸'}
            </div>
            <div className="text-sm font-medium text-gray-700 capitalize">
              {media.type}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Content */}
      <div className="p-6 relative z-10">
        <motion.div
          animate={{ y: isHovered ? -2 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center justify-between mb-3">
            <motion.h3 
              className="font-bold text-gray-800 truncate text-lg"
              animate={{ 
                color: isHovered ? '#4c1d95' : '#1f2937'
              }}
            >
              {media.userName}
            </motion.h3>
            
            <motion.div
              className={`w-4 h-4 rounded-full bg-gradient-to-r ${cardStyle.gradient} shadow-lg`}
              animate={{ 
                scale: isHovered ? 1.2 : 1,
                boxShadow: isHovered ? '0 0 20px rgba(139, 92, 246, 0.4)' : '0 0 0px rgba(139, 92, 246, 0)'
              }}
              transition={{ duration: 0.3 }}
            />
          </div>
          
          <div className="flex items-center space-x-2 mb-3">
            <div className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {formatDate(media.uploadedAt)}
            </div>
            <motion.div 
              className="text-lg"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, delay: index * 0.5 }}
            >
              ❤️
            </motion.div>
          </div>
          
          {media.description && (
            <motion.p 
              className="text-sm text-gray-600 leading-relaxed line-clamp-2"
              animate={{ opacity: isHovered ? 0.8 : 0.6 }}
            >
              {media.description}
            </motion.p>
          )}
        </motion.div>

        {/* Magic footer */}
        <motion.div
          initial={{ opacity: 0, height: 0, marginTop: 0 }}
          animate={{ 
            opacity: isHovered ? 1 : 0,
            height: isHovered ? 'auto' : 0,
            marginTop: isHovered ? 16 : 0
          }}
          transition={{ duration: 0.3 }}
          className="pt-4 border-t border-gray-100"
        >
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2 text-gray-500">
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                ✨
              </motion.span>
              <span>Made with love</span>
            </div>
            <motion.button
              className={`${cardStyle.accent} text-white px-3 py-1 rounded-full text-xs font-medium hover:opacity-80 transition-opacity`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              💝 Like
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Corner decoration */}
      <motion.div
        className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl ${cardStyle.gradient} opacity-10`}
        animate={{ 
          scale: isHovered ? 1.1 : 1,
          opacity: isHovered ? 0.2 : 0.1
        }}
        style={{
          clipPath: 'polygon(100% 0%, 0% 100%, 100% 100%)'
        }}
      />
    </motion.div>
  )
}

export default MediaCard