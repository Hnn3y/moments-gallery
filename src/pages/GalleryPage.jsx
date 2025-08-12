import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { getApprovedMedia } from '../services/api'
import MediaCard from '../components/MediaCard'

function GalleryPage() {
  const [media, setMedia] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const loadMedia = async () => {
      try {
        setLoading(true)
        const approvedMedia = await getApprovedMedia()
        setMedia(approvedMedia)
        setError(null)
      } catch (err) {
        console.error('Failed to load media:', err)
        setError('Failed to load gallery. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    loadMedia()
  }, [])

  // Animation variants for different users
  const getAnimationVariant = (userId, index) => {
    const variants = [
      // Magical appear
      {
        initial: { opacity: 0, scale: 0.3, rotate: -180 },
        animate: { opacity: 1, scale: 1, rotate: 0 },
        transition: { 
          delay: index * 0.1, 
          duration: 0.8, 
          type: "spring",
          bounce: 0.5
        }
      },
      // Slide from cosmos
      {
        initial: { opacity: 0, x: -100, y: -50, scale: 0.5 },
        animate: { opacity: 1, x: 0, y: 0, scale: 1 },
        transition: { 
          delay: index * 0.1, 
          duration: 0.9, 
          type: "spring",
          stiffness: 100
        }
      },
      // Float from sky
      {
        initial: { opacity: 0, y: -100, scale: 0.8, rotate: 15 },
        animate: { opacity: 1, y: 0, scale: 1, rotate: 0 },
        transition: { 
          delay: index * 0.1, 
          duration: 0.7,
          type: "spring",
          bounce: 0.3
        }
      },
      // Bubble pop
      {
        initial: { opacity: 0, scale: 0.1 },
        animate: { 
          opacity: 1, 
          scale: [0.1, 1.2, 1],
        },
        transition: { 
          delay: index * 0.1, 
          duration: 0.6,
          times: [0, 0.7, 1]
        }
      },
      // Spiral entrance
      {
        initial: { opacity: 0, rotate: 360, scale: 0.2, x: 50 },
        animate: { opacity: 1, rotate: 0, scale: 1, x: 0 },
        transition: { 
          delay: index * 0.1, 
          duration: 1,
          type: "spring",
          bounce: 0.4
        }
      }
    ]
    
    const variantIndex = userId ? userId.length % variants.length : index % variants.length
    return variants[variantIndex]
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-32 h-32 rounded-full"
              style={{
                background: `conic-gradient(from ${i * 60}deg, #8b5cf6, #a855f7, #ec4899, #8b5cf6)`,
                left: `${15 + i * 15}%`,
                top: `${20 + (i % 2) * 40}%`,
                filter: 'blur(40px)',
                opacity: 0.1
              }}
              animate={{
                rotate: 360,
                scale: [1, 1.2, 1],
              }}
              transition={{
                rotate: { duration: 10 + i * 2, repeat: Infinity, ease: "linear" },
                scale: { duration: 4 + i, repeat: Infinity, ease: "easeInOut" }
              }}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center relative z-10"
        >
          <motion.div
            animate={{ 
              rotate: 360,
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              rotate: { duration: 2, repeat: Infinity, ease: "linear" },
              scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
            }}
            className="w-20 h-20 mx-auto mb-6 relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full blur-sm"></div>
            <div className="absolute inset-2 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full blur-sm"></div>
            <div className="absolute inset-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"></div>
          </motion.div>
          <motion.h2
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-2xl font-bold hero-text mb-2"
          >
            Loading magical moments...
          </motion.h2>
          <motion.p
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-gray-600"
          >
            ✨ Preparing something beautiful ✨
          </motion.p>
        </motion.div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="text-center card max-w-md"
        >
          <motion.div 
            animate={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-6xl mb-6"
          >
            😔
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-600 mb-8">{error}</p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <button
              onClick={() => window.location.reload()}
              className="btn-primary flex-1"
            >
              🔄 Try Again
            </button>
            <button
              onClick={() => navigate('/upload')}
              className="btn-accent"
            >
              📸 Upload Moment
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute top-10 left-10 w-64 h-64 bg-gradient-to-br from-violet-300/10 to-purple-300/10 rounded-full blur-3xl"
          animate={{ 
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 15, repeat: Infinity }}
        />
        <motion.div 
          className="absolute top-1/3 right-10 w-48 h-48 bg-gradient-to-br from-pink-300/10 to-rose-300/10 rounded-full blur-3xl"
          animate={{ 
            x: [0, -80, 0],
            y: [0, 60, 0],
            scale: [1, 0.8, 1]
          }}
          transition={{ duration: 12, repeat: Infinity, delay: 2 }}
        />
        <motion.div 
          className="absolute bottom-20 left-1/4 w-36 h-36 bg-gradient-to-br from-cyan-300/10 to-blue-300/10 rounded-full blur-3xl"
          animate={{ 
            x: [0, 60, 0],
            y: [0, -40, 0],
            scale: [1, 1.3, 1]
          }}
          transition={{ duration: 18, repeat: Infinity, delay: 4 }}
        />
      </div>

      <div className="relative z-10 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
            className="text-center mb-16"
          >
            <motion.div
              animate={{ 
                rotate: [0, 5, -5, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity,
                ease: "easeInOut" 
              }}
              className="text-7xl mb-6"
            >
              🎨✨📸
            </motion.div>
            
            <motion.h1 
              className="text-5xl md:text-6xl font-black hero-text mb-6"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.8, type: "spring" }}
            >
              Moments Gallery
            </motion.h1>
            
            <motion.p 
              className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              A beautiful collection of life's most precious moments, shared by amazing people like you ✨
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <button
                onClick={() => navigate('/upload')}
                className="btn-accent text-lg relative overflow-hidden group"
              >
                <motion.span 
                  className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full"
                  transition={{ duration: 0.6 }}
                />
                <span className="relative z-10">✨ Add Your Magical Moment</span>
              </button>
            </motion.div>
          </motion.div>

          {/* Gallery Content */}
          {media.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-center py-20"
            >
              <motion.div 
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity,
                  ease: "easeInOut" 
                }}
                className="text-8xl mb-8"
              >
                📸🌟
              </motion.div>
              
              <motion.h3 
                className="text-4xl font-bold hero-text mb-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                No moments yet...
              </motion.h3>
              
              <motion.p 
                className="text-xl text-gray-600 mb-10 max-w-md mx-auto"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                Be the first to share a beautiful moment and start this amazing gallery! 🚀
              </motion.p>
              
              <motion.button
                onClick={() => navigate('/upload')}
                className="btn-primary text-lg"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.9 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                🌟 Upload First Moment
              </motion.button>
            </motion.div>
          ) : (
            <>
              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="text-center mb-12"
              >
                <div className="inline-flex items-center space-x-8 bg-white/60 backdrop-blur-xl rounded-3xl px-8 py-4 shadow-xl border border-white/20">
                  <div className="text-center">
                    <div className="text-2xl font-bold hero-text">{media.length}</div>
                    <div className="text-sm text-gray-600">Beautiful Moments</div>
                  </div>
                  <div className="w-px h-8 bg-gray-300"></div>
                  <div className="text-center">
                    <div className="text-2xl font-bold hero-text">
                      {new Set(media.map(m => m.userName)).size}
                    </div>
                    <div className="text-sm text-gray-600">Amazing People</div>
                  </div>
                  <div className="w-px h-8 bg-gray-300"></div>
                  <div className="text-center">
                    <div className="text-2xl">❤️</div>
                    <div className="text-sm text-gray-600">Made with Love</div>
                  </div>
                </div>
              </motion.div>

              {/* Gallery Grid */}
              <AnimatePresence>
                <motion.div 
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1, duration: 0.6 }}
                >
                  {media.map((item, index) => (
                    <motion.div
                      key={item.id}
                      {...getAnimationVariant(item.userId, index)}
                      whileHover={{ 
                        y: -8,
                        scale: 1.02,
                        transition: { duration: 0.3 }
                      }}
                      className="group"
                    >
                      <MediaCard media={item} index={index} />
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </>
          )}

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            className="text-center mt-20"
          >
            <div className="card max-w-2xl mx-auto">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="text-5xl mb-4"
              >
                🎭✨
              </motion.div>
              <h3 className="text-2xl font-bold hero-text mb-4">
                Ready to Share Your Story?
              </h3>
              <p className="text-gray-600 mb-6">
                Every moment has magic. Share yours and inspire others! 🌟
              </p>
              <button
                onClick={() => navigate('/upload')}
                className="btn-primary"
              >
                📱 Share Your Moment
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default GalleryPage