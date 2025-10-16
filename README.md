# Waifu Hub - Premium Anime Collection Platform

A modern, dark-themed web application for downloading and managing anime images with real-time activity tracking and comprehensive user management.

## ✨ Features

### 🎨 Design
- **Dark Red Theme**: Sleek, modern dark red aesthetic
- **Animated Sidebar**: Compact sidebar with dynamic animations
- **Glass Morphism**: Beautiful glass card effects throughout
- **Responsive Design**: Mobile-first responsive layout

### 🔐 Authentication
- **User Registration**: Complete sign-up flow with validation
- **Secure Login**: Session-based authentication
- **Persistent Storage**: User preferences saved locally
- **Account Management**: Profile, billing, and notifications

### ⚡ Real-Time Features
- **Live Activity Feed**: WebSocket-powered real-time updates
- **User Actions Tracking**: See what all users are doing
- **Instant Notifications**: Toast notifications for important events

### 📥 Download Management
- **Multiple API Sources**: waifu.im, waifu.pics, nekos.best, wallhaven, femboyfinder
- **Batch Downloads**: Download multiple images at once
- **Progress Tracking**: Real-time download progress
- **Queue Management**: Organized download queue

### 🗂️ Collection Management
- **Favorites**: Mark and organize favorite images
- **Collections**: Create custom image collections
- **Gallery View**: Beautiful grid layout for browsing
- **Search & Filter**: Advanced search capabilities

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Clone the repository**
\`\`\`bash
git clone <repository-url>
cd waifu-downloader
\`\`\`

2. **Install dependencies**
\`\`\`bash
npm install
\`\`\`

3. **Set up environment variables**

Create a `.env.local` file in the root directory:
\`\`\`env
NEXT_PUBLIC_WS_URL=ws://localhost:3001
NEXT_PUBLIC_WALLHAVEN_API_KEY=your_api_key_here
NEXT_PUBLIC_WAIFU_IM_API_KEY=your_api_key_here
\`\`\`

4. **Start the WebSocket server**
\`\`\`bash
npm run ws-server
\`\`\`

5. **Start the development server**
\`\`\`bash
npm run dev
\`\`\`

6. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

\`\`\`
waifu-downloader/
├── app/
│   ├── globals.css          # Dark red theme styles
│   ├── layout.tsx            # Root layout with providers
│   ├── page.tsx              # Main dashboard page
│   ├── login/                # Authentication pages
│   ├── gallery/              # Image gallery
│   ├── favorites/            # Favorites page
│   ├── collections/          # Collections management
│   └── settings/             # Settings page
├── components/
│   ├── app-sidebar.tsx       # Animated sidebar component
│   ├── activity-feed.tsx     # Real-time activity feed
│   ├── home-dashboard.tsx    # Dashboard with stats
│   ├── ui/                   # shadcn/ui components
│   └── ...
├── context/
│   ├── activityContext.tsx   # Activity state management
│   ├── settingsContext.tsx   # Settings state management
│   ├── storageContext.tsx    # Storage management
│   └── downloadContext.tsx   # Download state management
├── lib/
│   ├── auth.ts               # Authentication service
│   ├── websocket.ts          # WebSocket client service
│   └── utils.ts              # Utility functions
├── server/
│   └── websocket-server.js   # WebSocket server
├── services/
│   ├── waifuApi.ts           # External API integrations
│   └── enhanced-waifu-api.ts # Enhanced API service
├── types/
│   └── waifu.ts              # TypeScript type definitions
└── utils/
    ├── localStorage.ts       # Local storage utilities
    ├── secureStorage.ts      # Secure storage for API keys
    ├── urlValidator.ts       # URL validation
    └── rateLimiter.ts        # API rate limiting
\`\`\`

## 🎯 Key Technologies

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS v4**: Utility-first CSS with dark red theme
- **shadcn/ui**: Beautiful, accessible UI components
- **Framer Motion**: Smooth animations
- **WebSocket**: Real-time communication
- **date-fns**: Date formatting utilities

## 🔧 Configuration

### Theme Customization

The dark red theme is configured in `app/globals.css`. Key color variables:

\`\`\`css
--primary: hsl(355 85% 55%)        /* Main red accent */
--sidebar-background: hsl(355 30% 12%)  /* Sidebar red tint */
--accent: hsl(355 70% 45%)         /* Secondary accent */
\`\`\`

### API Configuration

Configure API keys in your user settings or environment variables:

- **Wallhaven**: Requires API key for full access
- **waifu.im**: Optional API key for higher rate limits
- **waifu.pics**: No API key required
- **nekos.best**: No API key required
- **femboyfinder**: No API key required

## 🌟 Features in Detail

### Real-Time Activity Feed

The activity feed uses WebSocket for instant updates:

\`\`\`typescript
// Components automatically subscribe to activity updates
const { addActivity } = useActivity()

// Track user actions
addActivity({
  userId: user.id,
  username: user.username,
  action: 'downloaded image',
  details: 'anime_girl_001.jpg',
  type: 'download'
})
\`\`\`

### User Authentication

Complete authentication system with persistent storage:

\`\`\`typescript
// Register new user
const result = await authService.register(username, email, password)

// Login existing user
const result = await authService.login(email, password)

// Get current user
const user = authService.getCurrentUser()

// Update preferences
authService.updatePreferences({ theme: 'dark', notifications: true })
\`\`\`

### Download Management

Multi-source API integration with fallbacks:

\`\`\`typescript
// Fetch from multiple sources
const images = await fetchImagesFromMultipleSources(
  category,
  limit,
  isNsfw,
  sortBy,
  page,
  minWidth,
  minHeight,
  settings,
  apiSource
)
\`\`\`

## 🎨 UI Components

### Animated Sidebar

Compact sidebar with smooth animations and state management:

- **Collapsible**: Icon-only mode for more screen space
- **Glow Effects**: Red glow on hover and active states
- **User Menu**: Quick access to account, billing, and settings
- **Pro Badge**: Visual indicator for premium users

### Glass Cards

Beautiful glass morphism effect throughout the UI:

\`\`\`css
.glass-card {
  background: rgba(20, 10, 10, 0.6);
  backdrop-filter: blur(16px);
  border: 1px solid var(--color-border);
  box-shadow: 0 8px 32px 0 rgba(220, 38, 38, 0.2);
}
\`\`\`

### Animated Borders

Dynamic gradient borders that rotate:

\`\`\`css
.animated-border::before {
  background: linear-gradient(45deg, 
    var(--color-primary), 
    var(--color-accent), 
    var(--color-primary)
  );
  animation: borderRotate 3s linear infinite;
}
\`\`\`

## 🔒 Security Features

- **Secure Storage**: API keys encrypted in localStorage
- **URL Validation**: Prevents XSS attacks via malicious URLs
- **Rate Limiting**: Token bucket algorithm prevents API abuse
- **Session Management**: 7-day session expiry
- **Input Sanitization**: All user inputs validated

## 📱 Responsive Design

Fully responsive with mobile-first approach:

- **Mobile**: Single column layout, hamburger menu
- **Tablet**: Two column layout, collapsible sidebar
- **Desktop**: Three column layout, persistent sidebar
- **4K**: Optimized spacing and typography

## 🚀 Performance

- **Code Splitting**: Dynamic imports for heavy components
- **Image Optimization**: Lazy loading with blur placeholders
- **CSS Purging**: Unused styles removed in production
- **Tree Shaking**: Dead code elimination
- **Caching**: Smart caching strategy for API responses

## 🛠️ Development

### Available Scripts

\`\`\`bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run ws-server    # Start WebSocket server
\`\`\`

### Adding New Features

1. Create component in `components/`
2. Add types in `types/waifu.ts`
3. Update context if needed
4. Add routing in `app/`
5. Update sidebar navigation in `app-sidebar.tsx`

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for beautiful components
- [Lucide](https://lucide.dev/) for icons
- [Tailwind CSS](https://tailwindcss.com/) for styling
- API providers: waifu.im, waifu.pics, nekos.best, wallhaven, femboyfinder

## 📞 Support

For issues and feature requests, please open an issue on GitHub.

---

**Built with ❤️ by the Waifu Hub team**
