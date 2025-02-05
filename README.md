# Social Network

This project implements the core backend functionalities of a **social network** inspired by Twitter. Built using modern web technologies, it provides RESTful APIs for key social features such as user authentication, tweet creation and retrieval, user interactions (following, commenting, liking), real-time chat, and media handling.

## 🚀 Tech Stack
- **Node.js & Express.js**: For server-side logic and API routing.
- **MongoDB**: A flexible, scalable NoSQL database for efficient data storage.
- **AWS S3**: For secure and efficient media storage (images, videos).
- **Socket.io**: For real-time communication and chat functionality.
- **JWT & Google OAuth 2.0**: For user authentication.

## 🔧 Features

### User Authentication:
- **JWT-based Authentication**: Secure login and registration with JWT tokens.
- **Google OAuth 2.0 Integration**: Login using Google credentials.

### Social Interactions:
- **Create Posts**: Users can create posts, including text, images, and videos.
  - Support for **hashtags** and **mentions** within posts.
- **Follow/Unfollow**: Users can follow and unfollow others to see their posts.
- **Comments**: Anyone can comment on posts to engage in discussions.
- **Like & Bookmark**: Users can like and bookmark posts they enjoy.
- **Retweeting**: Users can share posts from others with their followers.

### User Profiles:
- View user profiles with the following details:
  - **Name**
  - **Follower count**
  - **Bio**
  - **Last 10 tweets**
  - **Avatar**
  - **Website**
  - **Location**
  - **Date-of-birth**

### Additional Features:
- **Post Visibility**: Every post is visible to all users, with personalized feeds based on who they follow.
- **Pagination**: Support for paginated tweets to manage large sets of data efficiently.
- **Real-time Chat**: Enable instant communication between users with WebSockets.

### Search Functionality:
- **Search for User Profiles**: Users can search for profiles based on usernames.

## 📚 API Documentation with Swagger

This project uses **Swagger** (OpenAPI) to document and test the RESTful APIs. Swagger UI provides an interactive interface to explore and test API endpoints directly from the browser, making it easy to understand the routes and parameters.

