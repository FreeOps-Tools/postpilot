# PostPilot - Open Source Social Media Posting App 🚀

PostPilot is a powerful platform that allows you to post content to multiple social media platforms simultaneously. Write once, post everywhere!

## ✨ Features

- **Multi-Platform Support**: Post to LinkedIn, Twitter/X, Facebook, Instagram, and TikTok
- **Smart Content Validation**: Automatically validates and adapts your content for each platform's requirements
- **OAuth Authentication**: Secure authentication for all supported platforms
- **Media Support**: Upload images and videos with platform-specific handling
- **Content Adaptation**: 
  - Auto-threading for long Twitter posts
  - Platform-specific media rules (e.g., LinkedIn: video OR images, not both)
  - Character limit validation
- **Beautiful UI**: Modern, responsive design

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- OAuth credentials for the platforms you want to use

### Installation

1. Clone the repository:
```bash
git clone git@github.com:FreeOps-Tools/postpilot.git
cd postpilot
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your OAuth credentials for each platform you want to use.

### Getting OAuth Credentials

#### LinkedIn
1. Go to [LinkedIn Developers](https://www.linkedin.com/developers/)
2. Create a new app
3. Add redirect URI: `http://localhost:3001/auth/linkedin/callback`
4. Request permissions: `r_liteprofile`, `r_emailaddress`, `w_member_social`

#### Twitter/X
1. Go to [Twitter Developer Portal](https://developer.twitter.com/)
2. Create a new app
3. Set callback URL: `http://localhost:3001/auth/twitter/callback`
4. Enable OAuth 2.0

#### Facebook
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app
3. Add Facebook Login product
4. Set redirect URI: `http://localhost:3001/auth/facebook/callback`
5. Request permissions: `pages_manage_posts`, `pages_read_engagement`, `instagram_basic`, `instagram_content_publish`

#### Instagram
- Uses Facebook OAuth (same app)
- Requires Instagram Business Account
- Set redirect URI: `http://localhost:3001/auth/instagram/callback`

#### TikTok
1. Go to [TikTok Developers](https://developers.tiktok.com/)
2. Create a new app
3. Set redirect URI: `http://localhost:3001/auth/tiktok/callback`
4. Request permissions: `user.info.basic`, `video.upload`

### Running the Application

Start both frontend and backend:
```bash
npm run dev
```

Or run them separately:
```bash
# Backend only
npm run dev:server

# Frontend only
npm run dev:client
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

### Building for Production

```bash
npm run build
npm run build:server
npm start
```

## 📁 Project Structure

```
postpilot/
├── server/              # Backend server
│   ├── routes/          # API routes
│   ├── services/        # Platform posting services
│   ├── database.ts      # Database setup
│   └── index.ts         # Server entry point
├── src/                 # Frontend React app
│   ├── components/      # React components
│   ├── services/        # API client
│   ├── utils/           # Utilities
│   └── types/           # TypeScript types
└── data/                # SQLite database (created automatically)
```

## 🔧 How It Works

1. **Authenticate**: Connect your social media accounts via OAuth
2. **Create Content**: Write your post and upload media
3. **Select Platforms**: Choose which platforms to post to
4. **Validate**: System validates content against platform rules
5. **Post**: Content is posted to all selected platforms

## 🎯 Platform-Specific Rules

### LinkedIn
- ✅ Long text supported
- ✅ One video OR multiple images (not both)
- ✅ No character limit

### Twitter/X
- ✅ 280 character limit (free tier)
- ✅ Auto-threading for long content
- ✅ Up to 4 images or 1 video

### Facebook
- ✅ Flexible media support
- ✅ Can combine video and images
- ✅ No character limit

### Instagram
- ✅ Up to 10 images or 1 video
- ✅ 2,200 character caption limit
- ✅ Requires business account

### TikTok
- ✅ Video-only platform
- ✅ 2,200 character description limit

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Submit a Pull Request

## 📄 License

This project is licensed under the [MIT License](LICENSE).

## 🙏 Acknowledgments

We appreciate your contribution to PostPilot. Together, we can make this project even better!

If you have any questions or need assistance, don't hesitate to reach out to [rufilboy@gmail.com](mailto:rufilboy@gmail.com).

Happy coding! 🚀
