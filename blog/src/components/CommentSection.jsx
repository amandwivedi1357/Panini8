import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { getCommentsByPost, createComment, likeComment, unlikeComment, deleteComment } from '../services/api'
import { format } from 'date-fns'
import Loader from './Loader'
import { Link } from 'react-router-dom'

function CommentSection({ postId }) {
  const { currentUser, isAuthenticated } = useAuth()
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  useEffect(() => {
    fetchComments()
  }, [postId])
  
  const fetchComments = async () => {
    try {
      setLoading(true)
      const data = await getCommentsByPost(postId)
      setComments(data.comments)
      setError(null)
    } catch (error) {
      console.error('Error fetching comments:', error)
      setError('Failed to load comments. Please try again.')
    } finally {
      setLoading(false)
    }
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!newComment.trim()) return
    
    try {
      const data = await createComment({
        content: newComment,
        postId
      })
      
      setComments([data.comment, ...comments])
      setNewComment('')
    } catch (error) {
      console.error('Error creating comment:', error)
      setError('Failed to post comment. Please try again.')
    }
  }
  
  const handleLike = async (commentId, isLiked) => {
    try {
      if (!isAuthenticated) return
      
      if (isLiked) {
        await unlikeComment(commentId)
      } else {
        await likeComment(commentId)
      }
      
      fetchComments()
    } catch (error) {
      console.error('Error liking/unliking comment:', error)
    }
  }
  
  const handleDelete = async (commentId) => {
    try {
      await deleteComment(commentId)
      setComments(comments.filter(comment => comment._id !== commentId))
    } catch (error) {
      console.error('Error deleting comment:', error)
      setError('Failed to delete comment. Please try again.')
    }
  }
  
  if (loading) {
    return <Loader />
  }
  
  return (
    <section className="mt-10">
      <h3 className="text-xl font-bold mb-6">Comments</h3>
      
      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="mb-4">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="form-input"
              rows={3}
              required
            />
          </div>
          <div className="flex justify-end">
            <button type="submit" className="btn btn-primary">
              Post Comment
            </button>
          </div>
        </form>
      ) : (
        <div className="p-4 mb-6 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
          <p className="text-center">
            Please <Link to="/login" className="text-primary-600 dark:text-primary-400 hover:underline">log in</Link> to add a comment.
          </p>
        </div>
      )}
      
      {error && (
        <div className="p-4 mb-6 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg">
          {error}
        </div>
      )}
      
      {comments.length === 0 ? (
        <p className="text-neutral-500 dark:text-neutral-400 text-center py-6">
          No comments yet. Be the first to comment!
        </p>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => {
            const isLiked = comment.likes?.includes(currentUser?.id);
            const isAuthor = comment.author._id === currentUser?.id;
            
            return (
              <div 
                key={comment._id} 
                className="bg-white dark:bg-neutral-800 rounded-lg p-4 shadow animate-fade-in"
              >
                <div className="flex justify-between">
                  <div className="flex items-center mb-2">
                    <img 
                      src={comment.author.avatar || "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"} 
                      alt={comment.author.username}
                      className="h-8 w-8 rounded-full mr-2" 
                    />
                    <div>
                      <h4 className="font-medium">{comment.author.name || comment.author.username}</h4>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        {format(new Date(comment.createdAt), 'MMM d, yyyy • h:mm a')}
                      </p>
                    </div>
                  </div>
                  
                  {isAuthor && (
                    <button
                      onClick={() => handleDelete(comment._id)}
                      className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
                
                <p className="my-2 text-neutral-700 dark:text-neutral-300">{comment.content}</p>
                
                <div className="flex items-center mt-2">
                  <button 
                    onClick={() => handleLike(comment._id, isLiked)}
                    className={`flex items-center text-sm ${
                      isLiked 
                        ? 'text-primary-600 dark:text-primary-400' 
                        : 'text-neutral-500 dark:text-neutral-400'
                    }`}
                    disabled={!isAuthenticated}
                  >
                    {isLiked ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    )}
                    <span>{comment.likesCount || 0}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default CommentSection;