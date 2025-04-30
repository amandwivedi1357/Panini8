# BlogCraft - Modern Blog Platform

[![Live Demo](https://img.shields.io/badge/demo-live-green.svg)](https://blogcraft-panini8.vercel.app/)
[![React](https://img.shields.io/badge/react-18.3.1-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/node-20.x-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/mongodb-6.x-green.svg)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

BlogCraft is a full-featured blog platform built with React, Node.js, and MongoDB. It provides a modern, responsive interface for creating and sharing blog posts with features like user authentication, comments, and real-time interactions.

## 🌟 Features

- **User Authentication**
  - Secure JWT-based authentication
  - User registration and login
  - Protected routes and API endpoints

- **Blog Management**
  - Create, read, update, and delete blog posts
  - Rich text content with markdown support
  - Tag-based categorization
  - Cover image support

- **Social Features**
  - Comment on posts
  - Like/unlike posts and comments
  - User profiles with bio and avatar
  - Follow other users

- **Modern UI/UX**
  - Responsive design for all devices
  - Dark mode support
  - Smooth animations and transitions
  - Intuitive navigation

## 🚀 Live Demo

Visit the live demo: [BlogCraft](https://blogcraft-panini8.vercel.app/)

## 🛠️ Tech Stack

- **Frontend**
  - React 18.3
  - React Router v6
  - Tailwind CSS
  - Axios for API calls
  - JWT for authentication

- **Backend**
  - Node.js
  - Express.js
  - MongoDB with Mongoose
  - JWT for authentication
  - bcrypt for password hashing

## 📦 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/blogcraft.git
   cd blogcraft
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```env
   PORT=5000
   JWT_SECRET=your-secret-key-change-in-production
   MONGODB_URI=mongodb://localhost:27017/blog-platform
   NODE_ENV=development
   ```

4. Start the development server:
   ```bash
   # Start both frontend and backend
   npm run dev:all

   # Or start them separately
   npm run dev        # Frontend
   npm run server     # Backend
   ```

## 🗄️ Project Structure

```
blogcraft/
├── src/                    # Frontend source files
│   ├── components/         # Reusable React components
│   ├── contexts/          # React context providers
│   ├── pages/             # Page components
│   ├── services/          # API service functions
│   └── layouts/           # Layout components
├── server/                # Backend source files
│   ├── controllers/       # Route controllers
│   ├── models/           # Mongoose models
│   ├── routes/           # Express routes
│   └── middleware/       # Custom middleware
└── public/               # Static assets
```

## 🔑 API Endpoints

### Authentication
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `GET /api/users/me` - Get current user

### Posts
- `GET /api/posts` - Get all posts
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post

### Comments
- `GET /api/comments/post/:postId` - Get post comments
- `POST /api/comments` - Create comment
- `PUT /api/comments/:id` - Update comment
- `DELETE /api/comments/:id` - Delete comment

## 🎨 UI Components

BlogCraft includes a rich set of UI components:

- **Navigation**
  - Responsive navbar with mobile menu
  - User authentication status
  - Create post button

- **Post Components**
  - Post cards with cover images
  - Tag filtering system
  - Like and comment counters
  - Author information

- **Forms**
  - User registration
  - Login
  - Post creation/editing
  - Comment submission

## 🔒 Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Protected API endpoints
- Input validation and sanitization
- CORS protection
- Rate limiting

## 📱 Responsive Design

The platform is fully responsive and optimized for:
- Desktop computers
- Tablets
- Mobile phones
- Different screen orientations



