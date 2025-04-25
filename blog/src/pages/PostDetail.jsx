"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { format } from "date-fns"
import { useAuth } from "../contexts/AuthContext"
import { getPostById, deletePost, likePost, unlikePost } from "../services/api"
import CommentSection from "../components/CommentSection"
import Loader from "../components/Loader"

function PostDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { currentUser, isAuthenticated } = useAuth()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchPost()
  }, [id])

  const fetchPost = async () => {
    try {
      setLoading(true)
      const postData = await getPostById(id)
      setPost(postData)
      setError(null)
    } catch (error) {
      console.error("Error fetching post:", error)
      setError("Failed to load post")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) {
      return
    }

    try {
      await deletePost(id)
      navigate("/")
    } catch (error) {
      console.error("Error deleting post:", error)
      setError("Failed to delete post")
    }
  }

  const handleLike = async () => {
    if (!isAuthenticated) {
      navigate("/login")
      return
    }

    try {
      const isLiked = post.likes.includes(currentUser.id)

      if (isLiked) {
        await unlikePost(id)
      } else {
        await likePost(id)
      }

      await fetchPost()
    } catch (error) {
      console.error("Error liking/unliking post:", error)
    }
  }

  if (loading) {
    return <Loader />
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-10">
        <div className="p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg text-center">
          {error}
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-10">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Post not found</h2>
          <Link to="/" className="text-blue-600 dark:text-blue-400 hover:underline">
            Return to home
          </Link>
        </div>
      </div>
    )
  }

  const isAuthor = currentUser && post.author._id === currentUser.id
  const isLiked = currentUser && post.likes.includes(currentUser.id)

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-10">
      <article className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        {post.coverImage && (
          <div className="h-64 md:h-96 overflow-hidden">
            <img src={post.coverImage || "/placeholder.svg"} alt={post.title} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="p-6">
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag, index) => (
              <Link
                key={index}
                to={`/?tag=${tag}`}
                className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition"
              >
                #{tag}
              </Link>
            ))}
          </div>

          <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">{post.title}</h1>

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Link to={`/profile/${post.author._id}`}>
                <img
                  src={
                    post.author.avatar || "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
                  }
                  alt={post.author.name || post.author.username}
                  className="h-10 w-10 rounded-full mr-3 border border-gray-200 dark:border-gray-700"
                />
              </Link>
              <div>
                <Link
                  to={`/profile/${post.author._id}`}
                  className="font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
                >
                  {post.author.name || post.author.username}
                </Link>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {format(new Date(post.createdAt), "MMM d, yyyy")}
                </p>
              </div>
            </div>

            {isAuthor && (
              <div className="flex space-x-2">
                <Link
                  to={`/posts/${id}/edit`}
                  className="px-3 py-1 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition"
                >
                  Edit
                </Link>
                <button
                  onClick={handleDelete}
                  className="px-3 py-1 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-md transition"
                >
                  Delete
                </button>
              </div>
            )}
          </div>

          <div className="text-gray-800 dark:text-gray-200 max-w-none mb-6 leading-relaxed">
            {post.content.split("\n").map((paragraph, index) => (
              <p key={index} className="mb-4">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="flex items-center space-x-4 border-t dark:border-gray-700 pt-4">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-1 px-3 py-1 rounded-md transition ${
                isLiked
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill={isLiked ? "currentColor" : "none"}
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={isLiked ? "0" : "2"}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <span>{post.likesCount}</span>
              <span>likes</span>
            </button>
            <span className="text-gray-600 dark:text-gray-400 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              {post.commentsCount} comments
            </span>
          </div>
        </div>
      </article>

      <CommentSection postId={id} />
    </div>
  )
}

export default PostDetail
