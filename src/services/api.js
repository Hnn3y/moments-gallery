// Enhanced API service with real persistent storage
// Using localStorage for demo - in production this would be a real backend

// Storage keys
const MEDIA_STORAGE_KEY = 'moments_gallery_media'
const USER_STORAGE_KEY = 'moments_gallery_users'

// Initialize with sample data if empty
const initializeStorage = () => {
  const existingMedia = localStorage.getItem(MEDIA_STORAGE_KEY)
  if (!existingMedia) {
    const sampleData = [
      {
        id: '1',
        fileName: 'sunset.jpg',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=500&fit=crop&crop=center',
        userName: 'Alice Johnson',
        userId: 'user_alice_123',
        status: 'approved',
        uploadedAt: '2025-08-10T14:30:00Z',
        updatedAt: '2025-08-10T14:35:00Z',
        description: 'Beautiful sunset over the mountains'
      },
      {
        id: '2', 
        fileName: 'beach.jpg',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&h=500&fit=crop&crop=center',
        userName: 'Bob Smith',
        userId: 'user_bob_456',
        status: 'approved',
        uploadedAt: '2025-08-10T13:15:00Z',
        updatedAt: '2025-08-10T13:20:00Z',
        description: 'Peaceful beach morning'
      },
      {
        id: '3',
        fileName: 'forest.jpg', 
        type: 'image',
        url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500&h=500&fit=crop&crop=center',
        userName: 'Carol Davis',
        userId: 'user_carol_789',
        status: 'pending',
        uploadedAt: '2025-08-10T12:45:00Z',
        updatedAt: '2025-08-10T12:45:00Z',
        description: 'Deep forest trail'
      },
      {
        id: '4',
        fileName: 'city.jpg',
        type: 'image', 
        url: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=500&h=500&fit=crop&crop=center',
        userName: 'David Wilson',
        userId: 'user_david_012',
        status: 'approved',
        uploadedAt: '2025-08-10T11:20:00Z',
        updatedAt: '2025-08-10T11:25:00Z',
        description: 'City lights at night'
      },
      {
        id: '5',
        fileName: 'flowers.jpg',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=500&h=500&fit=crop&crop=center',
        userName: 'Emma Brown',
        userId: 'user_emma_345',
        status: 'rejected', 
        uploadedAt: '2025-08-10T10:10:00Z',
        updatedAt: '2025-08-10T10:15:00Z',
        description: 'Spring flowers in bloom'
      }
    ]
    localStorage.setItem(MEDIA_STORAGE_KEY, JSON.stringify(sampleData))
  }

  const existingUsers = localStorage.getItem(USER_STORAGE_KEY)
  if (!existingUsers) {
    const sampleUsers = [
      { id: 'user_alice_123', name: 'Alice Johnson', joinedAt: '2025-08-05T10:00:00Z', totalUploads: 1 },
      { id: 'user_bob_456', name: 'Bob Smith', joinedAt: '2025-08-06T11:00:00Z', totalUploads: 1 },
      { id: 'user_carol_789', name: 'Carol Davis', joinedAt: '2025-08-07T12:00:00Z', totalUploads: 1 },
      { id: 'user_david_012', name: 'David Wilson', joinedAt: '2025-08-08T13:00:00Z', totalUploads: 1 },
      { id: 'user_emma_345', name: 'Emma Brown', joinedAt: '2025-08-09T14:00:00Z', totalUploads: 1 }
    ]
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(sampleUsers))
  }
}

// Initialize storage on load
initializeStorage()

// Helper functions for localStorage operations
const getMediaFromStorage = () => {
  try {
    const data = localStorage.getItem(MEDIA_STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error('Error reading media from storage:', error)
    return []
  }
}

const saveMediaToStorage = (mediaArray) => {
  try {
    localStorage.setItem(MEDIA_STORAGE_KEY, JSON.stringify(mediaArray))
  } catch (error) {
    console.error('Error saving media to storage:', error)
  }
}

const getUsersFromStorage = () => {
  try {
    const data = localStorage.getItem(USER_STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error('Error reading users from storage:', error)
    return []
  }
}

const saveUsersToStorage = (usersArray) => {
  try {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(usersArray))
  } catch (error) {
    console.error('Error saving users to storage:', error)
  }
}

// Generate unique IDs
const generateId = () => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9)
}

const generateUserId = (userName) => {
  return 'user_' + userName.toLowerCase().replace(/\s+/g, '_') + '_' + Math.random().toString(36).substr(2, 3)
}

// Simulate network delay for realistic experience
const delay = (ms = 1000) => new Promise(resolve => setTimeout(resolve, ms))

// Create or update user record
const createOrUpdateUser = (userId, userName) => {
  const users = getUsersFromStorage()
  const existingUserIndex = users.findIndex(u => u.id === userId)
  
  if (existingUserIndex >= 0) {
    users[existingUserIndex].totalUploads += 1
    users[existingUserIndex].lastUpload = new Date().toISOString()
  } else {
    users.push({
      id: userId,
      name: userName,
      joinedAt: new Date().toISOString(),
      totalUploads: 1,
      lastUpload: new Date().toISOString()
    })
  }
  
  saveUsersToStorage(users)
}

// Upload media
export const uploadMedia = async (formData) => {
  await delay(1500) // Simulate upload time
  
  const file = formData.get('file')
  const userName = formData.get('userName')
  
  if (!file || !userName) {
    throw new Error('File and user name are required')
  }
  
  // Create blob URL for the uploaded file
  const url = URL.createObjectURL(file)
  
  const userId = generateUserId(userName)
  const newMedia = {
    id: generateId(),
    fileName: file.name,
    type: file.type.startsWith('image/') ? 'image' : 'video',
    url: url,
    userName: userName,
    userId: userId,
    status: 'pending', // Changed to pending for admin approval
    uploadedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    description: `Shared by ${userName}`
  }
  
  // Save to storage
  const mediaStorage = getMediaFromStorage()
  mediaStorage.unshift(newMedia) // Add to beginning
  saveMediaToStorage(mediaStorage)
  
  // Update user record
  createOrUpdateUser(userId, userName)
  
  return {
    success: true,
    id: newMedia.id,
    message: 'Media uploaded successfully and is pending approval'
  }
}

// Get approved media only (for public gallery)
export const getApprovedMedia = async () => {
  await delay(800)
  
  const mediaStorage = getMediaFromStorage()
  const approvedMedia = mediaStorage
    .filter(item => item.status === 'approved')
    .sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt))
  
  return approvedMedia
}

// Get all media (for admin dashboard)
export const getAllMedia = async () => {
  await delay(500)
  
  const mediaStorage = getMediaFromStorage()
  return mediaStorage.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt))
}

// Approve media
export const approveMedia = async (mediaId) => {
  await delay(300)
  
  const mediaStorage = getMediaFromStorage()
  const mediaIndex = mediaStorage.findIndex(item => item.id === mediaId)
  
  if (mediaIndex >= 0) {
    mediaStorage[mediaIndex].status = 'approved'
    mediaStorage[mediaIndex].updatedAt = new Date().toISOString()
    saveMediaToStorage(mediaStorage)
    return { success: true, message: 'Media approved successfully' }
  }
  
  throw new Error('Media not found')
}

// Reject media
export const rejectMedia = async (mediaId) => {
  await delay(300)
  
  const mediaStorage = getMediaFromStorage()
  const mediaIndex = mediaStorage.findIndex(item => item.id === mediaId)
  
  if (mediaIndex >= 0) {
    mediaStorage[mediaIndex].status = 'rejected'
    mediaStorage[mediaIndex].updatedAt = new Date().toISOString()
    saveMediaToStorage(mediaStorage)
    return { success: true, message: 'Media rejected' }
  }
  
  throw new Error('Media not found')
}

// Get stats for admin dashboard
export const getStats = async () => {
  await delay(200)
  
  const mediaStorage = getMediaFromStorage()
  const users = getUsersFromStorage()
  
  const stats = {
    total: mediaStorage.length,
    pending: mediaStorage.filter(item => item.status === 'pending').length,
    approved: mediaStorage.filter(item => item.status === 'approved').length,
    rejected: mediaStorage.filter(item => item.status === 'rejected').length,
    totalUsers: users.length,
    recentUploads: mediaStorage.filter(item => {
      const uploadDate = new Date(item.uploadedAt)
      const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
      return uploadDate > dayAgo
    }).length
  }
  
  return stats
}

// Get all users (for admin)
export const getAllUsers = async () => {
  await delay(400)
  
  const users = getUsersFromStorage()
  return users.sort((a, b) => new Date(b.joinedAt) - new Date(a.joinedAt))
}

// Delete media (for admin)
export const deleteMedia = async (mediaId) => {
  await delay(300)
  
  const mediaStorage = getMediaFromStorage()
  const filteredMedia = mediaStorage.filter(item => item.id !== mediaId)
  
  if (filteredMedia.length === mediaStorage.length) {
    throw new Error('Media not found')
  }
  
  saveMediaToStorage(filteredMedia)
  return { success: true, message: 'Media deleted successfully' }
}

// Clear all data (for testing)
export const clearAllData = () => {
  localStorage.removeItem(MEDIA_STORAGE_KEY)
  localStorage.removeItem(USER_STORAGE_KEY)
  initializeStorage()
  return { success: true, message: 'All data cleared and reset' }
}