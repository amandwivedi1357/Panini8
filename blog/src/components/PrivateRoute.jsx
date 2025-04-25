import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Loader from './Loader'

function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  
  if (loading) {
    return <Loader />
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />
}

export default PrivateRoute