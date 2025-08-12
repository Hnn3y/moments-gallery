import { Navigate } from 'react-router-dom'
import { isAdminAuthenticated } from '../services/auth'

function ProtectedRoute({ children }) {
  const isAuthenticated = isAdminAuthenticated()

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />
  }

  return children
}

export default ProtectedRoute