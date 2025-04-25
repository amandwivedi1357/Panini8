import { Link } from 'react-router-dom'
import { format } from 'date-fns'

function PostCard({ post }) {
  const { _id, title, content, author, createdAt, tags, likesCount, commentsCount, coverImage } = post
  
  
  const truncatedContent = content.length > 150 
    ? content.substring(0, 150) + '...' 
    : content
  
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-neutral-800 shadow-md hover:shadow-xl dark:shadow-neutral-900/30 transition-all duration-300 hover:translate-y-[-8px]">
      {coverImage && (
        <div className="h-52 overflow-hidden">
          <img 
            src={coverImage || "/placeholder.svg"} 
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
          />
        </div>
      )}
      
      <div className="p-6">
        <div className="mb-4 flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <Link 
              key={index} 
              to={`/?tag=${tag}`}
              onClick={(e) => e.stopPropagation()}
              className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 hover:bg-rose-100 dark:hover:bg-purple-900/50 transition-colors duration-200"
            >
              #{tag}
            </Link>
          ))}
        </div>
        
        <Link to={`/posts/${_id}`}>
          <h3 className="text-xl font-bold mb-3 text-neutral-800 dark:text-white group-hover:text-rose-600 dark:group-hover:text-purple-400 transition-colors duration-200">
            {title}
          </h3>
        </Link>
        
        <p className="text-neutral-600 dark:text-neutral-300 mb-5 line-clamp-3">
          {truncatedContent}
        </p>
        
        <div className="flex justify-between items-center mt-5 pt-5 border-t border-neutral-100 dark:border-neutral-700">
          <div className="flex items-center">
            <Link 
              to={`/profile/${author._id}`} 
              onClick={(e) => e.stopPropagation()}
              className="flex items-center group/author"
            >
              <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-white dark:border-neutral-700 shadow-sm mr-3">
                <img 
                  src={author.avatar || "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"} 
                  alt={author.name || author.username}
                  className="h-full w-full object-cover" 
                />
              </div>
              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-200 group-hover/author:text-rose-600 dark:group-hover/author:text-purple-400 transition-colors">
                {author.name || author.username}
              </span>
            </Link>
          </div>
          
          <div className="text-sm text-neutral-500 dark:text-neutral-400">
            <time dateTime={createdAt} className="italic">
              {format(new Date(createdAt), 'MMM d, yyyy')}
            </time>
          </div>
        </div>
        
        <div className="flex items-center mt-4 text-sm text-neutral-500 dark:text-neutral-400">
          <div className="flex items-center mr-5">
            <div className="p-1.5 rounded-full bg-rose-50 dark:bg-rose-900/20 text-rose-500 dark:text-rose-400 mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            {likesCount}
          </div>
          
          <div className="flex items-center">
            <div className="p-1.5 rounded-full bg-purple-50 dark:bg-purple-900/20 text-purple-500 dark:text-purple-400 mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            {commentsCount}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostCard