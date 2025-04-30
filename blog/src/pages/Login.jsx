import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }
    
    try {
      setError('')
      setLoading(true)
      
      const result = await login(email, password)
      
      if (result.success) {
        navigate('/')
      } else {
        setError(result.message)
      }
    } catch (error) {
      console.error('Login error:', error)
      setError('Failed to log in. Please try again.')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="max-w-md mx-auto mt-24 mb-16 px-4">
      <div className="card p-8">
        <h1 className="text-2xl font-bold text-center mb-6">Log In</h1>
        
        {error && (
          <div className="p-3 mb-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="form-input"
              required
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="form-input"
              required
            />
          </div>
          
          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-black ">
            Don't have an account?{' '}
            <Link 
              to="/register" 
              className="text-primary-600 dark:text-primary-400 hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login