// Mock API service with in-memory storage
// In a real application, this would make HTTP requests to a backend server

// In-memory storage for demo purposes
let mediaStorage = [
  {
    id: '1',
    fileName: 'sunset.jpg',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=500&fit=crop&crop=center',
    userName: 'Alice Johnson',
    userId: 'user_alice_123',
    status: 'approved',
    uploadedAt: '2025-08-10T14:30:00Z',
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
    description: 'Peaceful beach morning'
  },
  {
    id: '3',
    fileName: 'forest.jpg', 
    type: 'image',
    url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500&h=500&fit=crop&crop=center',
    userName: 'Carol Davis',
    userId: 'user_carol_789',
    status: 'approved',
    uploadedAt: '2025-08-10T12:45:00Z',
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
    description: 'City lights at night'
  },
  {
    id: '5',
    fileName: 'flowers.jpg',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=500&h=500&fit=crop&crop=center',
    userName: 'Emma Brown',
    userId: 'user_emma_345',
    status: 'approved', 
    uploadedAt: '2025-08-10T10:10:00Z',
    description: 'Spring flowers in bloom'
  },
  {
    id: '6',
    fileName: 'mountains.jpg',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=500&fit=crop&crop=center',
    userName: 'Frank Garcia',
    userId: 'user_frank_678',
    status: 'approved',
    uploadedAt: '2025-08-10T09:30:00Z',
    description: 'Majestic mountain peaks'
  }
]

// Generate a unique ID
const generateId = () => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9)
}

// Generate a user ID based on name
const generateUserId = (userName) => {
  return 'user_' + userName.toLowerCase().replace(/\s+/g, '_') + '_' + Math.random().toString(36).substr(2, 3)
}

// Simulate network delay
const delay = (ms = 1000) => new Promise(resolve => setTimeout(resolve, ms))

// Upload media (mocked)
export const uploadMedia = async (formData) => {
  await delay(1500) // Simulate upload time
  
  const file = formData.get('file')
  const userName = formData.get('userName')
  
  if (!file || !userName) {
    throw new Error('File and user name are required')
  }
  
  // Create a blob URL for the uploaded file (in real app this would be handled by the server)
  const url = URL.createObjectURL(file)
  
  const newMedia = {
    id: generateId(),
    fileName: file.name,
    type: file.type.startsWith('image/') ? 'image' : 'video',
    url: url,
    userName: userName,
    userId: generateUserId(userName),
    status: 'approved', // Auto-approve for demo purposes
    uploadedAt: new Date().toISOString(),
    description: `Shared by ${userName}`
  }
  
  // Add to storage
  mediaStorage.unshift(newMedia) // Add to beginning of array
  
  return {
    success: true,
    id: newMedia.id,
    message: 'Media uploaded successfully'
  }
}

// Get approved media
export const getApprovedMedia = async () => {
  await delay(800) // Simulate API call
  
  // Filter only approved media and sort by upload date (newest first)
  const approvedMedia = mediaStorage
    .filter(item => item.status === 'approved')
    .sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt))
  
  return approvedMedia
}

// Get all media (for admin - not used in this demo)
export const getAllMedia = async () => {
  await delay(500)
  return mediaStorage.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt))
}

// Approve media (for admin - not used in this demo)
export const approveMedia = async (mediaId) => {
  await delay(300)
  
  const media = mediaStorage.find(item => item.id === mediaId)
  if (media) {
    media.status = 'approved'
    return { success: true, message: 'Media approved successfully' }
  }
  
  throw new Error('Media not found')
}

// Reject media (for admin - not used in this demo)
export const rejectMedia = async (mediaId) => {
  await delay(300)
  
  const media = mediaStorage.find(item => item.id === mediaId)
  if (media) {
    media.status = 'rejected'
    return { success: true, message: 'Media rejected' }
  }
  
  throw new Error('Media not found')
}