import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { uploadMedia } from '../services/api'

function UploadPage() {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [userName, setUserName] = useState('')
  const [dragActive, setDragActive] = useState(false)
  const navigate = useNavigate()

  const handleFileSelect = (selectedFile) => {
    if (selectedFile && (selectedFile.type.startsWith('image/') || selectedFile.type.startsWith('video/'))) {
      setFile(selectedFile)
      
      // Create preview URL
      const previewURL = URL.createObjectURL(selectedFile)
      setPreview(previewURL)
    } else {
      alert('Please select an image or video file')
    }
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    handleFileSelect(selectedFile)
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDragIn = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(true)
  }

  const handleDragOut = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    const files = e.dataTransfer.files
    if (files && files[0]) {
      handleFileSelect(files[0])
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!file || !userName.trim()) {
      alert('Please select a file and enter your name')
      return
    }

    setIsUploading(true)
    
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('userName', userName.trim())
      
      await uploadMedia(formData)
      
      // Clean up preview URL
      if (preview) {
        URL.revokeObjectURL(preview)
      }
      
      // Redirect to gallery
      navigate('/gallery')
    } catch (error) {
      console.error('Upload failed:', error)
      alert('Upload failed. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  const clearFile = () => {
    setFile(null)
    if (preview) {
      URL.revokeObjectURL(preview)
      setPreview(null)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-violet-400/20 to-purple-400/20 rounded-full blur-xl"
          animate={{ 
            x: [0, 50, 0],
            y: [0, -30, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div 
          className="absolute top-40 right-32 w-24 h-24 bg-gradient-to-br from-pink-400/20 to-rose-400/20 rounded-full blur-xl"
          animate={{ 
            x: [0, -40, 0],
            y: [0, 40, 0],
            scale: [1, 0.9, 1]
          }}
          transition={{ duration: 6, repeat: Infinity, delay: 1 }}
        />
        <motion.div 
          className="absolute bottom-32 left-32 w-20 h-20 bg-gradient-to-br from-cyan-400/20 to-blue-400/20 rounded-full blur-xl"
          animate={{ 
            x: [0, 30, 0],
            y: [0, -20, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 7, repeat: Infinity, delay: 2 }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
        className="w-full max-w-lg relative z-10"
      >
        <div className="card">
          {/* Header */}
          <motion.div 
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-center mb-8"
          >
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
              className="text-6xl mb-4"
            >
              📸✨
            </motion.div>
            <h1 className="text-4xl font-bold hero-text mb-2">
              Moments Gallery
            </h1>
            <p className="text-gray-600 text-lg">
              Share your beautiful moments with the world
            </p>
          </motion.div>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Name Input */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="relative"
            >
              <label htmlFor="userName" className="block text-sm font-semibold text-gray-700 mb-3">
                👋 What's your name?
              </label>
              <input
                type="text"
                id="userName"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="input-field"
                placeholder="Enter your beautiful name"
                required
              />
              <motion.div 
                className="absolute -right-2 -top-2 text-yellow-400 text-2xl sparkle"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
              >
                ⭐
              </motion.div>
            </motion.div>

            {/* File Upload */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                📱 Upload your amazing moment
              </label>
              
              <div
                className={`upload-zone ${dragActive ? 'active' : ''}`}
                onDragEnter={handleDragIn}
                onDragLeave={handleDragOut}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*,video/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                
                {preview ? (
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="space-y-4"
                  >
                    <div className="relative inline-block">
                      {file.type.startsWith('image/') ? (
                        <img
                          src={preview}
                          alt="Preview"
                          className="max-w-full max-h-48 mx-auto rounded-2xl object-cover shadow-lg"
                        />
                      ) : (
                        <video
                          src={preview}
                          controls
                          className="max-w-full max-h-48 mx-auto rounded-2xl shadow-lg"
                        />
                      )}
                      <motion.div 
                        className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        ✓
                      </motion.div>
                    </div>
                    <div className="text-sm text-gray-600 font-medium">
                      {file.name}
                    </div>
                    <button
                      type="button"
                      onClick={clearFile}
                      className="text-rose-500 hover:text-rose-600 text-sm font-medium transition-colors"
                    >
                      🗑️ Remove file
                    </button>
                  </motion.div>
                ) : (
                  <motion.div 
                    className="space-y-4"
                    animate={{ y: dragActive ? -5 : 0 }}
                  >
                    <motion.div 
                      className="text-6xl floating-element"
                      animate={{ 
                        rotate: dragActive ? [0, -10, 10, 0] : 0 
                      }}
                      transition={{ duration: 0.5 }}
                    >
                      {dragActive ? '🌟' : '📁'}
                    </motion.div>
                    <div className="text-gray-700">
                      <span className="font-bold text-lg bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                        {dragActive ? 'Drop it like it\'s hot! 🔥' : 'Click to upload'}
                      </span>
                      <br />
                      <span className="text-gray-500">or drag and drop your moment here</span>
                    </div>
                    <div className="text-sm text-gray-500 flex items-center justify-center space-x-2">
                      <span>📷</span>
                      <span>Images</span>
                      <span>•</span>
                      <span>🎥</span>
                      <span>Videos</span>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4"
            >
              <motion.button
                type="submit"
                disabled={!file || !userName.trim() || isUploading}
                className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden"
                whileTap={{ scale: 0.98 }}
              >
                {isUploading && (
                  <motion.div 
                    className="absolute inset-0 bg-white/20"
                    initial={{ x: '-100%' }}
                    animate={{ x: '100%' }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  />
                )}
                <span className="relative z-10">
                  {isUploading ? '✨ Uploading Magic...' : '🚀 Upload & View Gallery'}
                </span>
              </motion.button>
              
              <motion.button
                type="button"
                onClick={() => navigate('/gallery')}
                className="btn-secondary"
                whileTap={{ scale: 0.98 }}
              >
                🎨 View Gallery
              </motion.button>
            </motion.div>
          </form>

          {/* Fun encouragement text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="text-center mt-6 text-sm text-gray-500"
          >
            ✨ Every moment is worth sharing ✨
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

export default UploadPage