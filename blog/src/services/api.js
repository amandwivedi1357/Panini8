import axios from 'axios'

const API_URL = 'http://localhost:5000/api'


export const getPosts = async (page = 1, limit = 10, tag = null) => {
  try {
    const params = { page, limit }
    if (tag) params.tag = tag
    
    const response = await axios.get(`${API_URL}/posts`, { params })
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch posts')
  }
}

export const getPostById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/posts/${id}`)
    return response.data.post
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch post')
  }
}

export const getPostsByUser = async (userId, page = 1, limit = 10) => {
  try {
    const response = await axios.get(`${API_URL}/posts/user/${userId}`, {
      params: { page, limit }
    })
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch user posts')
  }
}

export const createPost = async (postData) => {
  try {
    const response = await axios.post(`${API_URL}/posts`, postData)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create post')
  }
}

export const updatePost = async (id, postData) => {
  try {
    const response = await axios.put(`${API_URL}/posts/${id}`, postData)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update post')
  }
}

export const deletePost = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/posts/${id}`)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete post')
  }
}

export const likePost = async (id) => {
  try {
    const response = await axios.post(`${API_URL}/posts/${id}/like`)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to like post')
  }
}

export const unlikePost = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/posts/${id}/like`)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to unlike post')
  }
}

export const getCommentsByPost = async (postId, page = 1, limit = 20) => {
  try {
    const response = await axios.get(`${API_URL}/comments/post/${postId}`, {
      params: { page, limit }
    })
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch comments')
  }
}

export const createComment = async (commentData) => {
  try {
    const response = await axios.post(`${API_URL}/comments`, commentData)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create comment')
  }
}

export const updateComment = async (id, content) => {
  try {
    const response = await axios.put(`${API_URL}/comments/${id}`, { content })
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update comment')
  }
}

export const deleteComment = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/comments/${id}`)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete comment')
  }
}

export const likeComment = async (id) => {
  try {
    const response = await axios.post(`${API_URL}/comments/${id}/like`)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to like comment')
  }
}

export const unlikeComment = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/comments/${id}/like`)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to unlike comment')
  }
}

export const getUserById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/users/${id}`)
    return response.data.user
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch user')
  }
}