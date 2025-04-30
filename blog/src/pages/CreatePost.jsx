import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createPost } from '../services/api'
import PostForm from '../components/PostForm'

function CreatePost() {
  const navigate = useNavigate()
  const [error, setError] = useState(null)
  
  const handleSubmit = async (postData) => {
    try {
      setError(null)
      const response = await createPost(postData)
      navigate(`/posts/${response.post._id}`)
    } catch (error) {
      console.error('Error creating post:', error)
      setError(error.message || 'Failed to create post. Please try again.')
      throw new Error(error.message || 'Failed to create post')
    }
  }
  
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
      <div className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-3 text-black">
          Create New Post
        </h1>
        <p className="text-neutral-600">
          Share your thoughts, ideas, and stories with the world
        </p>
      </div>
      
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-rose-50 text-rose-600 text-center">
          {error}
        </div>
      )}
      
      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-neutral-200">
        <PostForm onSubmit={handleSubmit} buttonText="Create Post" />
      </div>
    </div>
  )
}

export default CreatePost