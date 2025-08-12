import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getAllMedia, approveMedia, rejectMedia, getStats } from '../services/api'
import AdminMediaCard from '../components/AdminMediaCard'

function AdminDashboard() {
  const [media, setMedia] = useState([])
  const [filteredMedia, setFilteredMedia] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all, pending, approved, rejected
  const [stats, setStats] = useState({})
  const [selectedItems, setSelectedItems] = useState([])
  const [bulkAction, setBulkAction] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    filterMedia()
  }, [media, filter])

  const loadData = async () => {
    try {
      setLoading(true)
      const [allMedia, statsData] = await Promise.all([
        getAllMedia(),
        getStats()
      ])
      setMedia(allMedia)
      setStats(statsData)
    } catch (error) {
      console.error('Failed to load admin data:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterMedia = () => {
    if (filter === 'all') {
      setFilteredMedia(media)
    } else {
      setFilteredMedia(media.filter(item => item.status === filter))
    }
  }

  const handleStatusChange = async (mediaId, newStatus) => {
    try {
      if (newStatus === 'approved') {
        await approveMedia(mediaId)
      } else {
        await rejectMedia(mediaId)
      }
      
      // Update local state
      setMedia(prev => 
        prev.map(item => 
          item.id === mediaId 
            ? { ...item, status: newStatus, updatedAt: new Date().toISOString() }
            : item
        )
      )
      
      // Refresh stats
      const newStats = await getStats()
      setStats(newStats)
      
    } catch (error) {
      console.error('Failed to update status:', error)
      alert('Failed to update status. Please try again.')
    }
  }

  const handleBulkAction = async () => {
    if (!bulkAction || selectedItems.length === 0) return
    
    try {
      for (const mediaId of selectedItems) {
        if (bulkAction === 'approve') {
          await approveMedia(mediaId)
        } else if (bulkAction === 'reject') {
          await rejectMedia(mediaId)
        }
      }
      
      // Refresh data
      await loadData()
      setSelectedItems([])
      setBulkAction('')
      
    } catch (error) {
      console.error('Bulk action failed:', error)
      alert('Bulk action failed. Please try again.')
    }
  }

  const toggleSelection = (mediaId) => {
    setSelectedItems(prev => 
      prev.includes(mediaId) 
        ? prev.filter(id => id !== mediaId)
        : [...prev, mediaId]
    )
  }

  const getFilterCount = (filterType) => {
    if (filterType === 'all') return media.length
    return media.filter(item => item.status === filterType).length
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-white"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-xl">Loading admin dashboard...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                🛡️ Admin Dashboard
              </h1>
              <p className="text-purple-200">
                Manage uploads and keep the community amazing
              </p>
            </div>
            <motion.button
              onClick={() => window.location.href = '/gallery'}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
              whileHover={{ scale: 1.05 }}
            >
              👀 View Gallery
            </motion.button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Uploads', value: stats.total || 0, icon: '📊', color: 'from-blue-500 to-cyan-500' },
              { label: 'Pending Review', value: stats.pending || 0, icon: '⏳', color: 'from-yellow-500 to-orange-500' },
              { label: 'Approved', value: stats.approved || 0, icon: '✅', color: 'from-green-500 to-emerald-500' },
              { label: 'Rejected', value: stats.rejected || 0, icon: '❌', color: 'from-red-500 to-pink-500' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-gradient-to-r ${stat.color} p-6 rounded-2xl text-white shadow-xl`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-sm">{stat.label}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                  <div className="text-4xl">{stat.icon}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Filters and Bulk Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'all', label: 'All', icon: '📋' },
                { key: 'pending', label: 'Pending', icon: '⏳' },
                { key: 'approved', label: 'Approved', icon: '✅' },
                { key: 'rejected', label: 'Rejected', icon: '❌' },
              ].map((filterOption) => (
                <button
                  key={filterOption.key}
                  onClick={() => setFilter(filterOption.key)}
                  className={`px-4 py-2 rounded-xl font-medium transition-all ${
                    filter === filterOption.key
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  {filterOption.icon} {filterOption.label} ({getFilterCount(filterOption.key)})
                </button>
              ))}
            </div>

            {/* Bulk Actions */}
            {selectedItems.length > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center space-x-3"
              >
                <span className="text-white">
                  {selectedItems.length} selected
                </span>
                <select
                  value={bulkAction}
                  onChange={(e) => setBulkAction(e.target.value)}
                  className="bg-white/20 text-white rounded-lg px-3 py-2 backdrop-blur-sm"
                >
                  <option value="">Choose action</option>
                  <option value="approve">Approve All</option>
                  <option value="reject">Reject All</option>
                </select>
                <button
                  onClick={handleBulkAction}
                  disabled={!bulkAction}
                  className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-4 py-2 rounded-lg font-medium disabled:opacity-50"
                >
                  Apply
                </button>
                <button
                  onClick={() => setSelectedItems([])}
                  className="bg-gray-600 text-white px-3 py-2 rounded-lg"
                >
                  Clear
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Media Grid */}
        {filteredMedia.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-4">🤷‍♂️</div>
            <h3 className="text-2xl font-bold text-white mb-2">
              No {filter !== 'all' ? filter : ''} uploads found
            </h3>
            <p className="text-purple-200">
              {filter === 'pending' ? 'All caught up! No pending reviews.' : 'Check back later for new uploads.'}
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <AnimatePresence>
              {filteredMedia.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <AdminMediaCard
                    media={item}
                    onStatusChange={handleStatusChange}
                    isSelected={selectedItems.includes(item.id)}
                    onToggleSelection={toggleSelection}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard