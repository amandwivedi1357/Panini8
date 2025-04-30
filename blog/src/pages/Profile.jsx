"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { getUserById, getPostsByUser } from "../services/api"
import PostCard from "../components/PostCard"
import Loader from "../components/Loader"

export default function Profile() {
  const { id } = useParams()
  const { currentUser, updateProfile } = useAuth()
  const [user, setUser] = useState(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    avatar: "",
  })
  const [previewImage, setPreviewImage] = useState("")
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
          name: userData.name || "",
          bio: userData.bio || "",
          avatar: userData.avatar || "",
        })
        setPreviewImage(userData.avatar || "")
      }

      const postsData = await getPostsByUser(isOwnProfile ? currentUser.id : id)
      setPosts(postsData.posts)

      setError(null)
    } catch (error) {
      console.error("Error fetching profile:", error)
      setError("Failed to load profile data")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    if (name === "avatar") {
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
      console.error("Error updating profile:", error)
      setError("Failed to update profile")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return <Loader />
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="bg-white p-8 rounded-lg border border-gray-100 shadow-sm text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 mx-auto mb-4 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h2 className="text-xl font-medium mb-2 text-gray-900">Error Loading Profile</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="bg-white p-8 rounded-lg border border-gray-100 shadow-sm text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 mx-auto mb-4 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          <h2 className="text-xl font-medium mb-4 text-gray-900">User not found</h2>
          <Link
            to="/"
            className="inline-block px-5 py-2 rounded-md text-sm font-medium bg-black text-white hover:bg-gray-800 transition-colors"
          >
            Return to home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden mb-10">
        {/* Cover Photo */}
        <div className="h-48 bg-gray-50"></div>

        <div className="px-6 sm:px-8 pb-8 relative">
          {/* Avatar and Basic Info */}
          <div className="flex flex-col sm:flex-row sm:items-end -mt-16 mb-6">
            <div className="h-32 w-32 rounded-full overflow-hidden border-4 border-white shadow-sm mb-4 sm:mb-0 bg-white">
              <img
                src={user.avatar || "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"}
                alt={user.name || user.username}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="sm:ml-6 sm:mb-2">
              <h1 className="text-2xl font-bold text-gray-900">{user.name || user.username}</h1>
              <p className="text-gray-500 text-sm">@{user.username}</p>
            </div>

            {isOwnProfile && !editing && (
              <button
                onClick={() => setEditing(true)}
                className="mt-4 sm:mt-0 sm:ml-auto px-4 py-2 rounded-md text-sm font-medium bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 transition-colors"
              >
                Edit Profile
              </button>
            )}
          </div>

          {/* Bio */}
          {user.bio && <p className="text-gray-600 max-w-2xl">{user.bio}</p>}
        </div>
      </div>

      {/* Edit Profile Form */}
      {editing && (
        <div className="bg-white border border-black rounded-lg shadow-sm border border-gray-100 p-6 sm:p-8 mb-10">
          <h2 className="text-xl font-bold mb-6 text-gray-900">Edit Profile</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/20 transition-all"
                  placeholder="Your name"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="avatar" className="block text-sm font-medium text-gray-700">
                  Avatar URL
                </label>
                <input
                  type="url"
                  id="avatar"
                  name="avatar"
                  value={formData.avatar}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/20 transition-all"
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/20 transition-all resize-y"
                rows="3"
                placeholder="Tell us about yourself"
              />
            </div>

            {previewImage && (
              <div className="mt-3">
                <p className="text-sm text-gray-500 mb-2">Avatar Preview:</p>
                <div className="h-24 w-24 rounded-full overflow-hidden border border-gray-200">
                  <img
                    src={previewImage || "/placeholder.svg"}
                    alt="Avatar preview"
                    className="h-full w-full object-cover"
                    onError={() => setPreviewImage("")}
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="px-4 py-2 rounded-md text-sm font-medium border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 rounded-md text-sm font-medium bg-black text-white hover:bg-gray-800 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Saving...
                  </div>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Posts Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Posts</h2>

          {isOwnProfile && (
            <Link
              to="/create"
              className="px-4 py-2 rounded-md text-sm font-medium bg-black text-white hover:bg-gray-800 transition-colors"
            >
              Create New Post
            </Link>
          )}
        </div>

        {posts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto mb-4 text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1M19 8l-7 5-7-5M5 19h14a2 2 0 002-2v-5"
              />
            </svg>
            <h3 className="text-lg font-medium mb-2 text-gray-900">No posts yet</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              {isOwnProfile
                ? "You haven't created any posts yet. Start sharing your thoughts with the world!"
                : "This user hasn't created any posts yet."}
            </p>

            {isOwnProfile && (
              <Link
                to="/create"
                className="inline-block px-4 py-2 rounded-md text-sm font-medium bg-black text-white hover:bg-gray-800 transition-colors"
              >
                Create your first post
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
