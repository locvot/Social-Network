
# 📌 Social Network Pet Project

A backend server inspired by Twitter, built with **Node.js, Express, and MongoDB**.

## 🚀 Features
- 🔹 **User Authentication** (JWT-based)  
- 🔹 **Tweeting System** (Tweets, Replies, Retweets, Quotes)  
- 🔹 **Hashtags & Mentions**  
- 🔹 **Media Uploads**  
- 🔹 **Follow/Unfollow System**  
- 🔹 **Like & Bookmark Tweets**  
- 🔹 **Real-time Chat (WebSockets)**  

## 🛠️ Tech Stack  
| **Technology** | **Purpose** |
|--------------|------------|
| **Node.js & Express.js** | Backend framework |
| **MongoDB & Mongoose** | Database & ODM |
| **Swagger (OpenAPI)** | API Documentation |
| **Socket.io** | Real-time Notifications |

## ⚡ Installation & Setup  
### 1️⃣ Clone the Repository  
```bash
git clone https://github.com/your-username/twitter-backend.git
cd twitter
```

### 2️⃣ Install Dependencies  
```bash
npm install
```

### 3️⃣ Configure Environment Variables  
Create a `.env` file and add the following:
```
PORT=
HOST=""
DB_NAME=""
DB_USERNAME=""
DB_PASSWORD=""
DB_USERS_COLLECTION=""
DB_REFRESH_TOKENS_COLLECTION=''
DB_FOLLOWERS_COLLECTION=''
DB_VIDEO_STATUS_COLLECTION=''
DB_TWEETS_COLLECTION=''
DB_HASHTAGS_COLLECTION=''
DB_BOOKMARKS_COLLECTION=''
DB_LIKES_COLLECTION=''
DB_CONVERSATIONS_COLLECTION=''

PASSWORD_SECRET=""
JWT_SECRET_ACCESS_TOKEN=""
JWT_SECRET_REFRESH_TOKEN=""
JWT_SECRET_EMAIL_VERIFY_TOKEN=""
JWT_SECRET_FORGOT_PASSWORD_TOKEN=""
ACCESS_TOKEN_EXPIRES_IN=""
REFRESH_TOKEN_EXPIRES_IN=""
EMAIL_VERIFY_TOKEN_EXPIRES_IN=""
FORGOT_PASSWORD_TOKEN_EXPIRES_IN=""

GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GOOGLE_REDIRECT_URI=""
CLIENT_REDIRECT_CALLBACK=""
CLIENT_URL=""

AWS_ACCESS_KEY_ID=''
AWS_SECRET_ACCESS_KEY=''
AWS_REGION=''
SES_FROM_ADDRESS=''
S3_BUCKET_NAME=''

```

### 4️⃣ Start the Server  
```bash
npm run dev
```

## 📌 API Endpoints  
| **Method** | **Endpoint** | **Description** |
|------------|--------------|-----------------|
| `POST`     | `/auth/register`   | Register a new user |
| `POST`     | `/auth/login`      | Login & get JWT token |
| `GET`      | `/users/:user_id`  | Get user profile |
| `POST`     | `/tweets`          | Create a new tweet |
| `GET`      | `/tweets/:tweet_id` | Get tweet details |
| `POST`     | `/tweets/:tweet_id/like`  | Like a tweet |
| `POST`     | `/tweets/:tweet_id/retweet` | Retweet a tweet |

