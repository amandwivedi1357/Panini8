import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'


import MainLayout from './layouts/MainLayout'


import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import CreatePost from './pages/CreatePost'
import EditPost from './pages/EditPost'
import PostDetail from './pages/PostDetail'
import NotFound from './pages/NotFound'


import PrivateRoute from './components/PrivateRoute'
import Loader from './components/Loader'

function App() {
  const { isAuthenticated, loading } = useAuth()
  const [appReady, setAppReady] = useState(false)

  useEffect(() => {
     
    const timer = setTimeout(() => {
      setAppReady(true)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  if (loading || !appReady) {
    return <Loader fullScreen />
  }

  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        {/* Public Routes */}
        <Route index element={<Home />} />
        <Route path="login" element={
          isAuthenticated ? <Navigate to="/" /> : <Login />
        } />
        <Route path="register" element={
          isAuthenticated ? <Navigate to="/" /> : <Register />
        } />
        <Route path="posts/:id" element={<PostDetail />} />
        
        {/* Protected Routes */}
        <Route path="create" element={
          <PrivateRoute>
            <CreatePost />
          </PrivateRoute>
        } />
        <Route path="posts/:id/edit" element={
          <PrivateRoute>
            <EditPost />
          </PrivateRoute>
        } />
        <Route path="profile" element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        } />
        <Route path="profile/:id" element={<Profile />} />
        
        {/* Catch-all Route */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default App