import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getPostById, updatePost } from '../services/api'
import PostForm from '../components/PostForm'
import Loader from '../components/Loader'

function EditPost() {
  const { id } = useParams()
  const navigate = useNavigate()
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
      console.error('Error fetching post:', error)
      setError('Failed to load post')
    } finally {
      setLoading(false)
    }
  }
  
  const handleSubmit = async (postData) => {
    try {
      await updatePost(id, postData)
      navigate(`/posts/${id}`)
    } catch (error) {
      throw new Error(error.message || 'Failed to update post')
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
        </div>
      </div>
    )
  }
  
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-10">
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">Edit Post</h1>
        <PostForm 
          initialData={post} 
          onSubmit={handleSubmit} 
          buttonText="Update Post" 
        />
      </div>
    </div>
  )
}

export default EditPost