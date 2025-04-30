"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { XMarkIcon, Bars3Icon } from '@heroicons/react/24/outline'

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
    navigate("/")
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 
        ${scrolled 
          ? "bg-white/95 backdrop-blur-md shadow-md border-b border-neutral-100" 
          : "bg-white border-b border-neutral-50"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center group">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neutral-200 to-neutral-100 flex items-center justify-center mr-2 shadow-sm">
                <span className="text-black font-bold text-lg">B</span>
              </div>
              <span className="text-black font-semibold text-lg">BlogCraft</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-center flex-1 space-x-1">
            <div className="flex items-center space-x-1 px-2 py-1 rounded-full bg-neutral-100/50">
              <Link
                to="/"
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  location.pathname === "/"
                    ? "bg-neutral-200 text-black"
                    : "text-neutral-600 hover:bg-neutral-100"
                }`}
              >
                Home
              </Link>

              {isAuthenticated ? (
                <>
                  <Link
                    to="/create"
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      location.pathname === "/create"
                        ? "bg-neutral-200 text-black"
                        : "text-neutral-600 hover:bg-neutral-100"
                    }`}
                  >
                    Create
                  </Link>

                  
                </>
              ) : (
                <></>
              )}
            </div>

            <div className="flex items-center space-x-2">
              {isAuthenticated ? (
                <>
                  {currentUser && (
                    <Link
                      to={`/profile/${currentUser.id}`}
                      className="flex items-center px-3 py-2 rounded-full text-sm font-medium text-neutral-600 hover:bg-neutral-100 transition-all duration-200"
                    >
                      <img
                        src={currentUser.avatar || "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"}
                        alt="Profile"
                        className="w-6 h-6 rounded-full mr-2"
                      />
                      {currentUser.name || currentUser.username}
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="ml-2 px-4 py-2 rounded-full text-sm font-medium text-neutral-600 hover:bg-neutral-100 transition-all duration-200"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-4 py-2 rounded-full text-sm font-medium text-neutral-600 hover:bg-neutral-100 transition-all duration-200"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="ml-2 px-5 py-2 rounded-full text-sm font-medium text-black hover:shadow-lg hover:shadow-purple-600/20 transition-all duration-300 hover:-translate-y-0.5"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>

          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={() => setMenuOpen(!menuOpen)} 
              className="text-black hover:bg-neutral-100 p-2 rounded-md"
            >
              {menuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          menuOpen ? "max-h-[300px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-gray-800 shadow-lg px-2 pt-2 pb-3 space-y-1">
          <Link
            to="/"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              location.pathname === "/"
                ? "bg-neutral-200 text-black"
                : "text-neutral-600 hover:bg-neutral-100"
            }`}
          >
            Home
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to="/create"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname === "/create"
                    ? "bg-neutral-200 text-black"
                    : "text-neutral-600 hover:bg-neutral-100"
                }`}
              >
                Create Post
                <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-purple-500/20 text-purple-300">
                  New
                </span>
              </Link>

              <Link
                to="/profile"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname === "/profile"
                    ? "bg-neutral-200 text-black"
                    : "text-neutral-600 hover:bg-neutral-100"
                }`}
              >
                Profile
              </Link>

              <button
                onClick={handleLogout}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-neutral-600 hover:bg-neutral-100 transition-all duration-200"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="grid grid-cols-2 gap-2 mt-3">
              <Link
                to="/login"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname === "/login"
                    ? "bg-neutral-200 text-black"
                    : "text-neutral-600 hover:bg-neutral-100"
                }`}
              >
                Login
              </Link>

              <Link
                to="/register"
                className="block px-3 py-2 rounded-md text-base font-medium text-white bg-black hover:bg-neutral-800 transition-all duration-200"
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
