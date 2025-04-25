import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { getUserById, getPostsByUser } from '../services/api'
import PostCard from '../components/PostCard'
import Loader from '../components/Loader'

function Profile() {
  const { id } = useParams()
  const { currentUser, updateProfile } = useAuth()
  const [user, setUser] = useState(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    avatar: ''
  })
  const [previewImage, setPreviewImage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const isOwnProfile = !id || (currentUser && id === currentUser.id)
  
  useEffect(() => {
    fetchProfileData()
  }, [id, currentUser])
  
  const fetchProfileData = async () => {
    try {
      setLoading(true)
      
      
      const userData = isOwnProfile ? currentUser : await getUserById(id)
      setUser(userData)
      
      
      if (isOwnProfile) {
        setFormData({
          name: userData.name || '',
          bio: userData.bio || '',
          avatar: userData.avatar || ''
        })
        setPreviewImage(userData.avatar || '')
      }
    
      const postsData = await getPostsByUser(isOwnProfile ? currentUser.id : id)
      setPosts(postsData.posts)
      
      setError(null)
    } catch (error) {
      console.error('Error fetching profile:', error)
      setError('Failed to load profile data')
    } finally {
      setLoading(false)
    }
  }
  
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    if (name === 'avatar') {
      setPreviewImage(value)
    }
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      setIsSubmitting(true)
      const result = await updateProfile(formData)
      
      if (result.success) {
        setEditing(false)
        await fetchProfileData()
      } else {
        setError(result.message)
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      setError('Failed to update profile')
    } finally {
      setIsSubmitting(false)
    }
  }
  
  if (loading) {
    return <Loader />
  }
  
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        <div className="p-6 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-xl border border-rose-100 dark:border-rose-800/30 text-center">
          <div className="flex justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold mb-2">Error Loading Profile</h2>
          <p>{error}</p>
        </div>
      </div>
    )
  }
  
  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        <div className="text-center py-16">
          <div className="inline-flex justify-center items-center p-6 bg-neutral-100 dark:bg-neutral-800 rounded-full mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-neutral-500 dark:text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-4 text-neutral-800 dark:text-white">User not found</h2>
          <Link to="/" className="inline-block px-5 py-2.5 rounded-xl text-sm font-medium bg-gradient-to-r from-rose-500 to-purple-600 text-white hover:shadow-lg hover:shadow-rose-500/20 dark:hover:shadow-purple-600/20 transition-all duration-300 hover:translate-y-[-1px]">
            Return to home
          </Link>
        </div>
      </div>
    )
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
      <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-lg border border-neutral-100 dark:border-neutral-700 overflow-hidden mb-12">
        <div className="h-40 bg-gradient-to-r from-rose-500/90 to-purple-600/90 relative">
        
        </div>
        
        <div className="px-6 md:px-8 pb-8 -mt-16 relative">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between">
            <div className="flex flex-col md:flex-row md:items-end">
              <div className="h-32 w-32 rounded-xl overflow-hidden border-4 border-white dark:border-neutral-800 shadow-lg mb-4 md:mb-0">
                <img
                  src={user.avatar || "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"}
                  alt={user.name || user.username}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="md:ml-6 md:mb-2">
                <h1 className="text-2xl md:text-3xl font-bold text-neutral-800 dark:text-white">
                  {user.name || user.username}
                </h1>
                {user.bio && (
                  <p className="text-neutral-600 dark:text-neutral-300 mt-2 max-w-2xl">
                    {user.bio}
                  </p>
                )}
              </div>
            </div>
            
            {isOwnProfile && !editing && (
              <button
                onClick={() => setEditing(true)}
                className="mt-4 md:mt-0 px-5 py-2.5 rounded-xl text-sm font-medium bg-white dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-600 border border-neutral-200 dark:border-neutral-600 transition-all duration-200 shadow-sm"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
      
      {editing && (
        <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-lg border border-neutral-100 dark:border-neutral-700 p-6 md:p-8 mb-12">
          <h2 className="text-xl font-bold mb-6 text-neutral-800 dark:text-white">Edit Profile</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-neutral-700 dark:text-neutral-200">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 dark:focus:ring-purple-400/50 transition-all duration-200"
                  placeholder="Your name"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="avatar" className="block text-sm font-medium text-neutral-700 dark:text-neutral-200">
                  Avatar URL
                </label>
                <input
                  type="url"
                  id="avatar"
                  name="avatar"
                  value={formData.avatar}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 dark:focus:ring-purple-400/50 transition-all duration-200"
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="bio" className="block text-sm font-medium text-neutral-700 dark:text-neutral-200">
                Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 dark:focus:ring-purple-400/50 transition-all duration-200 resize-y"
                rows="3"
                placeholder="Tell us about yourself"
              />
            </div>
            
            {previewImage && (
              <div className="mt-3">
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">Avatar Preview:</p>
                <div className="h-24 w-24 rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-700">
                  <img 
                    src={previewImage || "/placeholder.svg"} 
                    alt="Avatar preview" 
                    className="h-full w-full object-cover"
                    onError={() => setPreviewImage('')} 
                  />
                </div>
              </div>
            )}
            
            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="px-5 py-2.5 rounded-xl text-sm font-medium border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-all duration-200"
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl text-sm font-medium bg-gradient-to-r from-rose-500 to-purple-600 text-white hover:shadow-lg hover:shadow-rose-500/20 dark:hover:shadow-purple-600/20 transition-all duration-300 hover:translate-y-[-1px] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </div>
                ) : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      )}
      
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-neutral-800 dark:text-white">Posts</h2>
          
          {isOwnProfile && (
            <Link 
              to="/create" 
              className="px-5 py-2.5 rounded-xl text-sm font-medium bg-gradient-to-r from-rose-500 to-purple-600 text-white hover:shadow-lg hover:shadow-rose-500/20 dark:hover:shadow-purple-600/20 transition-all duration-300 hover:translate-y-[-1px]"
            >
              Create New Post
            </Link>
          )}
        </div>
        
        {posts.length === 0 ? (
          <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-md border border-neutral-100 dark:border-neutral-700 p-12 text-center">
            <div className="inline-flex justify-center items-center p-6 bg-neutral-100 dark:bg-neutral-700 rounded-full mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-neutral-500 dark:text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1M19 8l-7 5-7-5M5 19h14a2 2 0 002-2v-5" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3 text-neutral-700 dark:text-neutral-200">No posts yet</h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6 max-w-md mx-auto">
              {isOwnProfile 
                ? "You haven't created any posts yet. Start sharing your thoughts with the world!"
                : "This user hasn't created any posts yet."}
            </p>
            
            {isOwnProfile && (
              <Link 
                to="/create" 
                className="inline-block px-5 py-2.5 rounded-xl text-sm font-medium bg-gradient-to-r from-rose-500 to-purple-600 text-white hover:shadow-lg hover:shadow-rose-500/20 dark:hover:shadow-purple-600/20 transition-all duration-300 hover:translate-y-[-1px]"
              >
                Create your first post
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map(post => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile