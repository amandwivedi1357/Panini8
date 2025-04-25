import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

function Navbar({ scrolled }) {
  const { currentUser, isAuthenticated, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  
 
  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])
  
  const handleLogout = () => {
    logout()
    navigate('/')
  }
  
  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'backdrop-blur-md bg-white/80 dark:bg-neutral-900/90 shadow-lg' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center group">
              <span className="text-2xl font-extrabold bg-gradient-to-r from-rose-500 to-purple-600 bg-clip-text text-transparent transition-all duration-300 group-hover:from-purple-600 group-hover:to-rose-500">
                BlogCraft
              </span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Link to="/" className="px-4 py-2 rounded-full text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100/80 dark:hover:bg-neutral-800/50 transition-all duration-200">
              Home
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/create" className="px-4 py-2 rounded-full text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100/80 dark:hover:bg-neutral-800/50 transition-all duration-200">
                  Create Post
                </Link>
                <Link to="/profile" className="px-4 py-2 rounded-full text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100/80 dark:hover:bg-neutral-800/50 transition-all duration-200">
                  Profile
                </Link>
                <button 
                  onClick={handleLogout}
                  className="ml-2 px-4 py-2 rounded-full text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2 rounded-full text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100/80 dark:hover:bg-neutral-800/50 transition-all duration-200">
                  Login
                </Link>
                <Link to="/register" className="ml-2 px-5 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-rose-500 to-purple-600 text-white hover:shadow-lg hover:shadow-rose-500/20 dark:hover:shadow-purple-600/20 transition-all duration-300 hover:translate-y-[-1px]">
                  Register
                </Link>
              </>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-full text-neutral-600 dark:text-neutral-200 hover:bg-neutral-100/80 dark:hover:bg-neutral-800/50 focus:outline-none transition-all duration-200"
              aria-expanded={menuOpen}
            >
              <span className="sr-only">Open main menu</span>
              <div className="relative w-6 h-6">
                <span 
                  className={`absolute block h-0.5 w-6 bg-current transform transition duration-300 ease-in-out ${
                    menuOpen ? 'rotate-45 translate-y-1.5' : 'translate-y-0'
                  }`} 
                  style={{top: '35%'}}
                />
                <span 
                  className={`absolute block h-0.5 w-6 bg-current transform transition duration-300 ease-in-out ${
                    menuOpen ? 'opacity-0' : 'opacity-100'
                  }`} 
                  style={{top: '50%'}}
                />
                <span 
                  className={`absolute block h-0.5 w-6 bg-current transform transition duration-300 ease-in-out ${
                    menuOpen ? '-rotate-45 -translate-y-1.5' : 'translate-y-0'
                  }`} 
                  style={{top: '65%'}}
                />
              </div>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <div 
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          menuOpen 
            ? 'max-h-[300px] opacity-100' 
            : 'max-h-0 opacity-0'
        }`}
      >
        <div className="backdrop-blur-md bg-white/90 dark:bg-neutral-900/95 px-4 py-3 space-y-2 shadow-lg">
          <Link 
            to="/" 
            className="block px-4 py-3 rounded-xl text-base font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100/80 dark:hover:bg-neutral-800/50 transition-all duration-200"
          >
            Home
          </Link>
          {isAuthenticated ? (
            <>
              <Link 
                to="/create" 
                className="block px-4 py-3 rounded-xl text-base font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100/80 dark:hover:bg-neutral-800/50 transition-all duration-200"
              >
                Create Post
              </Link>
              <Link 
                to="/profile" 
                className="block px-4 py-3 rounded-xl text-base font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100/80 dark:hover:bg-neutral-800/50 transition-all duration-200"
              >
                Profile
              </Link>
              <button 
                onClick={handleLogout}
                className="block w-full text-left px-4 py-3 rounded-xl text-base font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all duration-200"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="grid grid-cols-2 gap-3 pt-2 pb-3">
              <Link 
                to="/login" 
                className="flex justify-center items-center px-4 py-3 rounded-xl text-base font-medium border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100/80 dark:hover:bg-neutral-800/50 transition-all duration-200"
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="flex justify-center items-center px-4 py-3 rounded-xl text-base font-medium bg-gradient-to-r from-rose-500 to-purple-600 text-white hover:shadow-lg hover:shadow-rose-500/20 dark:hover:shadow-purple-600/20 transition-all duration-300"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar