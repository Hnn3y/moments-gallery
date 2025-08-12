// Admin authentication service
// In production, this would connect to a real authentication system

const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'moments2024'
}

const AUTH_KEY = 'moments_admin_auth'

// Simulate network delay
const delay = (ms = 800) => new Promise(resolve => setTimeout(resolve, ms))

// Admin login
export const adminLogin = async (username, password) => {
  await delay()
  
  if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
    const authToken = {
      isAdmin: true,
      loginTime: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
    }
    
    localStorage.setItem(AUTH_KEY, JSON.stringify(authToken))
    return true
  }
  
  return false
}

// Check if user is authenticated admin
export const isAdminAuthenticated = () => {
  try {
    const authData = localStorage.getItem(AUTH_KEY)
    if (!authData) return false
    
    const auth = JSON.parse(authData)
    const now = new Date()
    const expiresAt = new Date(auth.expiresAt)
    
    if (now > expiresAt) {
      localStorage.removeItem(AUTH_KEY)
      return false
    }
    
    return auth.isAdmin === true
  } catch (error) {
    localStorage.removeItem(AUTH_KEY)
    return false
  }
}

// Admin logout
export const adminLogout = () => {
  localStorage.removeItem(AUTH_KEY)
  return true
}

// Get admin session info
export const getAdminSession = () => {
  try {
    const authData = localStorage.getItem(AUTH_KEY)
    if (!authData) return null
    
    return JSON.parse(authData)
  } catch (error) {
    return null
  }
}