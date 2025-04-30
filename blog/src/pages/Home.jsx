import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { getPosts } from '../services/api'
import PostCard from '../components/PostCard'
import Loader from '../components/Loader'

function Home() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [activeTags, setActiveTags] = useState(searchParams.get('tag') || '')
  const [availableTags, setAvailableTags] = useState([])
  const navigate = useNavigate()
  
  useEffect(() => {
    fetchPosts()
  }, [page, activeTags])
  
  useEffect(() => {
    if (posts.length > 0) {
      const tagsSet = new Set()
      posts.forEach(post => {
        post.tags.forEach(tag => tagsSet.add(tag))
      })
      setAvailableTags(Array.from(tagsSet))
    }
  }, [posts])
  
  // Update URL when tag filter changes
  useEffect(() => {
    if (activeTags) {
      setSearchParams({ tag: activeTags })
    } else {
      setSearchParams({})
    }
  }, [activeTags, setSearchParams])
  
  const fetchPosts = async () => {
    try {
      setLoading(true)
      const data = await getPosts(page, 9, activeTags || null)
      setPosts(data.posts)
      setTotalPages(data.totalPages)
      setError(null)
    } catch (error) {
      console.error('Error fetching posts:', error)
      setError('Failed to load posts. Please try again.')
    } finally {
      setLoading(false)
    }
  }
  
  const handleTagClick = (tag) => {
    setActiveTags(tag)
    setPage(1)
  }
  
  const clearTagFilter = () => {
    setActiveTags('')
    setPage(1)
  }
  
  const handlePrevPage = () => {
    setPage(prev => Math.max(prev - 1, 1))
    window.scrollTo(0, 0)
  }
  
  const handleNextPage = () => {
    setPage(prev => Math.min(prev + 1, totalPages))
    window.scrollTo(0, 0)
  }
  
  const handlePostClick = (postId) => {
    navigate(`/posts/${postId}`)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-black">
          Welcome to BlogCraft
        </h1>
        <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
          Discover stories, ideas, and expertise from writers on any topic.
        </p>
      </div>
      
      {/* Tags filter */}
      <div className="mb-12">
        <div className="flex flex-wrap gap-2 justify-center">
          {activeTags ? (
            <div className="flex items-center bg-gradient-to-r from-rose-500/10 to-purple-600/10 dark:from-rose-500/20 dark:to-purple-600/20 text-rose-600 dark:text-purple-400 px-5 py-2.5 rounded-full">
              <span className="mr-3 font-medium">#{activeTags}</span>
              <button 
                onClick={clearTagFilter}
                className="p-1.5 rounded-full hover:bg-white/50 dark:hover:bg-black/20 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ) : (
            availableTags.map(tag => (
              <button
                key={tag}
                onClick={() => handleTagClick(tag)}
                className="px-4 py-2 rounded-full text-sm font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 hover:bg-rose-100 dark:hover:bg-purple-900/30 hover:text-rose-600 dark:hover:text-purple-400 transition-all duration-200"
              >
                #{tag}
              </button>
            ))
          )}
        </div>
      </div>
      
      {error && (
        <div className="p-6 mb-8 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-2xl text-center shadow-sm">
          <div className="flex justify-center mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="font-medium">{error}</p>
        </div>
      )}
      
      {loading ? (
        <Loader />
      ) : posts.length === 0 ? (
        <div className="text-center py-16 px-4">
          <div className="inline-flex justify-center items-center p-6 bg-neutral-100 dark:bg-neutral-800 rounded-full mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-neutral-500 dark:text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-neutral-700 dark:text-neutral-200 mb-3">
            No posts found
          </h3>
          {activeTags && (
            <p className="text-neutral-600 dark:text-neutral-400 max-w-md mx-auto">
              Try removing the tag filter or check back later for new content.
            </p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <div 
              key={post._id} 
              onClick={() => handlePostClick(post._id)}
              className="cursor-pointer"
            >
              <PostCard post={post} />
            </div>
          ))}
        </div>
      )}
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-16">
          <div className="inline-flex items-center rounded-full bg-white dark:bg-neutral-800 shadow-md p-1.5">
            <button 
              onClick={handlePrevPage}
              disabled={page === 1}
              className={`flex items-center justify-center h-10 px-4 rounded-full text-sm font-medium transition-all duration-200 ${
                page === 1 
                  ? 'text-neutral-400 cursor-not-allowed' 
                  : 'text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Prev
            </button>
            
            <div className="px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-200">
              Page {page} of {totalPages}
            </div>
            
            <button 
              onClick={handleNextPage}
              disabled={page === totalPages}
              className={`flex items-center justify-center h-10 px-4 rounded-full text-sm font-medium transition-all duration-200 ${
                page === totalPages 
                  ? 'text-neutral-400 cursor-not-allowed' 
                  : 'text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700'
              }`}
            >
              Next
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Home