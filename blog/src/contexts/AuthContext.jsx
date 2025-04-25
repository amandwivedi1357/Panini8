import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'

const AuthContext = createContext(null)

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)

  axios.defaults.baseURL = 'http://localhost:5000/api'
  
  axios.interceptors.request.use(
    config => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    error => Promise.reject(error)
  )

  useEffect(() => {
    const initAuth = async () => {
      try {
        if (token) {
          const decoded = jwtDecode(token)
          const currentTime = Date.now() / 1000
          
          if (decoded.exp < currentTime) {
            localStorage.removeItem('token')
            setToken(null)
            setCurrentUser(null)
          } else {
            const response = await axios.get('/users/me')
            setCurrentUser(response.data.user)
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
        localStorage.removeItem('token')
        setToken(null)
        setCurrentUser(null)
      } finally {
        setLoading(false)
      }
    }

    initAuth()
  }, [token])

  const login = async (email, password) => {
    try {
      const response = await axios.post('/users/login', { email, password })
      const { token, user } = response.data
      
      localStorage.setItem('token', token)
      setToken(token)
      setCurrentUser(user)
      
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      }
    }
  }

  const register = async (username, email, password) => {
    try {
      const response = await axios.post('/users/register', { 
        username, 
        email, 
        password 
      })
      
      const { token, user } = response.data
      
      localStorage.setItem('token', token)
      setToken(token)
      setCurrentUser(user)
      
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed' 
      }
    }
  }


  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setCurrentUser(null)
  }

  const updateProfile = async (userData) => {
    try {
      const response = await axios.put('/users/me', userData)
      setCurrentUser(response.data.user)
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Profile update failed' 
      }
    }
  }

  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
    loading,
    login,
    register,
    logout,
    updateProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}