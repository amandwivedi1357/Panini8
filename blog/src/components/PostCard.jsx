"use client"

import { Link } from "react-router-dom"
import { format } from "date-fns"

function PostCard({ post, onPostClick }) {
  const truncateText = (text, maxLength = 150) => {
    return text.length > maxLength 
      ? text.substring(0, maxLength) + '...' 
      : text
  }

  // Generate a deterministic background color based on post title
  const generateBackgroundColor = (title) => {
    let hash = 0;
    for (let i = 0; i < title.length; i++) {
      hash = title.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = hash % 360;
    return `hsl(${hue}, 70%, 80%)`;
  }

  // Fallback image generation
  const FallbackImage = ({ title }) => {
    const bgColor = generateBackgroundColor(title);
    const initials = title
      .split(' ')
      .map(word => word[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();

    return (
      <div 
        className="absolute inset-0 w-full h-full flex items-center justify-center"
        style={{ backgroundColor: bgColor }}
      >
        <span className="text-4xl font-bold text-neutral-800 opacity-70">
          {initials}
        </span>
      </div>
    )
  }

  // Handle image error with fallback
  const handleImageError = (e) => {
    e.target.style.display = 'none';
    const fallbackContainer = e.target.nextSibling;
    fallbackContainer.style.display = 'flex';
  }

  return (
    <div 
      onClick={() => onPostClick(post._id)}
      className="group relative overflow-hidden rounded-2xl bg-white border border-neutral-200 shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-2 cursor-pointer"
    >
      {/* Cover Image with Fallback */}
      <div className="relative h-48 w-full overflow-hidden">
        <img 
          src={post.coverImage || 'https://via.placeholder.com/600x400?text=Blog+Post'}
          alt={post.title}
          onError={handleImageError}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div 
          className="absolute inset-0 w-full h-full hidden"
          style={{ display: 'none' }}
        >
          <FallbackImage title={post.title} />
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-3">
        {/* Title */}
        <h3 className="text-xl font-bold text-black group-hover:text-neutral-800 transition-colors duration-300">
          {post.title}
        </h3>

        {/* Description */}
        <p className="text-neutral-600 text-sm leading-relaxed">
          {truncateText(post.content)}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-3">
          {post.tags?.slice(0, 3).map((tag, index) => (
            <Link 
              key={index} 
              to={`/?tag=${tag}`}
              onClick={(e) => e.stopPropagation()}
              className="px-2 py-1 rounded-full text-xs font-medium bg-neutral-100 text-neutral-700 hover:bg-neutral-200 transition-colors"
            >
              #{tag}
            </Link>
          ))}
        </div>

        {/* Author and Read Time */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-neutral-200">
          <div className="flex items-center space-x-3">
            <img 
              src={post.author?.avatar || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'}
              alt={post.author?.username || 'Anonymous'}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-neutral-200"
            />
            <Link 
              to={`/profile/${post.author._id}`}
              onClick={(e) => e.stopPropagation()}
              className="text-sm text-neutral-600"
            >
              {post.author?.username || 'Anonymous'}
            </Link>
            <time dateTime={post.createdAt} className="text-xs text-neutral-500 italic">
              {format(new Date(post.createdAt), "MMM d, yyyy")}
            </time>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="p-1.5 rounded-full bg-gray-100 text-rose-500 mr-1.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <span className="text-xs font-medium text-gray-600">
                {post.likesCount}
              </span>
            </div>

            <div className="flex items-center">
              <div className="p-1.5 rounded-full bg-gray-100 text-purple-500 mr-1.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <span className="text-xs font-medium text-gray-600">
                {post.commentsCount}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostCard
