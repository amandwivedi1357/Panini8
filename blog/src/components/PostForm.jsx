import { useState } from 'react'

function PostForm({ onSubmit, buttonText = 'Submit', initialData = {} }) {
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    content: initialData.content || '',
    tags: initialData.tags ? initialData.tags.join(', ') : '',
    coverImage: initialData.coverImage || ''
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [previewImage, setPreviewImage] = useState(initialData.coverImage || '')
  
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }
  
  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters'
    }
    
    if (!formData.content.trim()) {
      newErrors.content = 'Content is required'
    }
    
    if (formData.tags && formData.tags.length > 0) {
      const tagsArray = formData.tags.split(',').map(tag => tag.trim())
      if (tagsArray.some(tag => tag.length > 20)) {
        newErrors.tags = 'Each tag must be less than 20 characters'
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleImageChange = (e) => {
    const imageUrl = e.target.value
    setFormData(prev => ({
      ...prev,
      coverImage: imageUrl
    }))
    setPreviewImage(imageUrl)
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    try {
      setIsSubmitting(true)
      

      const processedTags = formData.tags
        ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
        : []
      
  
      const postData = {
        ...formData,
        tags: processedTags
      }
      
      await onSubmit(postData)
    } catch (error) {
      console.error('Form submission error:', error)
      setErrors(prev => ({
        ...prev,
        form: error.message || 'Something went wrong. Please try again.'
      }))
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.form && (
        <div className="p-4 rounded-xl bg-rose-50 text-rose-600 text-sm">
          {errors.form}
        </div>
      )}
      
      <div className="space-y-2">
        <label htmlFor="title" className="block text-sm font-medium text-neutral-700">
          Title <span className="text-rose-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter a catchy title..."
          className={`w-full px-4 py-3 rounded-xl border ${
            errors.title 
              ? 'border-rose-500' 
              : 'border-neutral-200'
          } bg-white text-neutral-900 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-200`}
        />
        {errors.title && (
          <p className="mt-1 text-sm text-rose-600">{errors.title}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <label htmlFor="coverImage" className="block text-sm font-medium text-neutral-700">
          Cover Image URL
        </label>
        <input
          type="url"
          id="coverImage"
          name="coverImage"
          value={formData.coverImage}
          onChange={handleImageChange}
          placeholder="https://example.com/image.jpg"
          className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-white text-neutral-900 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-200"
        />
        
        {previewImage && (
          <div className="mt-3">
            <p className="text-sm text-neutral-500 mb-2">Preview:</p>
            <div className="relative h-48 overflow-hidden rounded-xl border border-neutral-200">
              <img 
                src={previewImage || "/placeholder.svg"} 
                alt="Cover preview" 
                className="w-full h-full object-cover"
                onError={() => setPreviewImage('')} 
              />
            </div>
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <label htmlFor="content" className="block text-sm font-medium text-neutral-700">
          Content <span className="text-rose-500">*</span>
        </label>
        <textarea
          id="content"
          name="content"
          value={formData.content}
          onChange={handleChange}
          placeholder="Write your post content here..."
          rows="8"
          className={`w-full px-4 py-3 rounded-xl border ${
            errors.content 
              ? 'border-rose-500' 
              : 'border-neutral-200'
          } bg-white text-neutral-900 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-200 resize-y`}
        />
        {errors.content && (
          <p className="mt-1 text-sm text-rose-600">{errors.content}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <label htmlFor="tags" className="block text-sm font-medium text-neutral-700">
          Tags (comma separated)
        </label>
        <input
          type="text"
          id="tags"
          name="tags"
          value={formData.tags}
          onChange={handleChange}
          placeholder="technology, programming, web development"
          className={`w-full px-4 py-3 rounded-xl border ${
            errors.tags 
              ? 'border-rose-500' 
              : 'border-neutral-200'
          } bg-white text-neutral-900 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-200`}
        />
        {errors.tags && (
          <p className="mt-1 text-sm text-rose-600">{errors.tags}</p>
        )}
        
        {formData.tags && (
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.tags.split(',').map((tag, index) => 
              tag.trim() && (
                <div 
                  key={index}
                  className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-neutral-100 text-neutral-700"
                >
                  {tag.trim()}
                </div>
              )
            )}
          </div>
        )}
      </div>
      
      <div className="mt-6">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-6 py-3 rounded-xl bg-black text-white hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-200 disabled:opacity-50"
        >
          {buttonText}
        </button>
      </div>
    </form>
  )
}

export default PostForm