# Waifu Hub - Premium Anime Collection Platform

A modern, feature-rich web application for downloading and managing anime image collections with real-time activity tracking, advanced filtering, and comprehensive user management.

## 🌟 Features

### Core Features
- 🎨 **Dark Red Theme** - Sleek dark aesthetic with red accents and smooth animations
- 🔐 **User Authentication** - Complete registration and login system with persistent storage
- ⚡ **Real-Time Activity Feed** - Live tracking of all user actions (optional WebSocket)
- 🖼️ **Multi-API Integration** - Access to 5+ anime image APIs
- 📱 **Fully Responsive** - Works seamlessly on desktop, tablet, and mobile devices

### Advanced Features
- 💾 **Smart Caching** - Intelligent image caching for faster loading
- ⭐ **Favorites System** - Save and organize your favorite images
- 📁 **Collections** - Create custom collections to organize downloads
- 🎯 **Advanced Filtering** - Filter by tags, categories, and more
- 📊 **Analytics Dashboard** - Track your downloads and activity
- 🎨 **AI Upscaling** - Enhance image quality with AI (coming soon)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

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

3. **Start the development server**
\`\`\`bash
npm run dev
\`\`\`

4. **(Optional) Start WebSocket server for real-time features**

Open a new terminal and run:
\`\`\`bash
npm run ws-server
\`\`\`

> **Note:** The WebSocket server is optional. The app will work in offline mode if the server isn't running, storing activities locally.

5. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000)

## 📝 Usage Guide

### First Time Setup

1. **Register an Account**
   - Click "Sign Up" on the login page
   - Enter username, email, and password
   - Your account will be created and stored locally

2. **Explore the Dashboard**
   - View recent downloads and statistics
   - Check the activity feed for real-time updates
   - Navigate through different sections using the sidebar

3. **Download Images**
   - Go to the Download section
   - Select your preferred API and filters
   - Click download to save images

4. **Manage Your Collection**
   - Browse downloaded images in the Gallery
   - Add favorites by clicking the heart icon
   - Create collections to organize your images

### Features Overview

#### Activity Feed
- **Real-Time Updates**: See what you and others are doing live (when WebSocket is connected)
- **Offline Mode**: Activities are still tracked locally when WebSocket is unavailable
- **Activity Types**: Downloads, favorites, collections, settings changes, and more

#### API Integration
The app connects to multiple anime image APIs:
- Wallhaven
- Waifu.im
- Waifu.pics
- Nekos.best
- And more...

#### User Settings
- Theme preferences
- Notification settings
- Auto-download options
- Account management

## 🛠️ Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS v4 with custom animations
- **UI Components**: shadcn/ui
- **State Management**: React Context API
- **Real-Time**: WebSocket (optional)
- **Storage**: localStorage (IndexedDB for images)
- **TypeScript**: Full type safety

## 📁 Project Structure

\`\`\`
waifu-downloader/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Home/Dashboard page
│   ├── login/             # Authentication pages
│   ├── gallery/           # Gallery view
│   ├── favorites/         # Favorites page
│   ├── collections/       # Collections management
│   └── settings/          # User settings
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── app-sidebar.tsx   # Main navigation sidebar
│   ├── activity-feed.tsx # Real-time activity feed
│   └── ...               # Other components
├── context/              # React contexts
│   ├── activityContext.tsx
│   ├── settingsContext.tsx
│   └── ...
├── lib/                  # Utility libraries
│   ├── auth.ts          # Authentication service
│   ├── websocket.ts     # WebSocket client
│   └── utils.ts         # Helper functions
├── server/              # Backend services
│   └── websocket-server.js  # WebSocket server
└── public/              # Static assets
\`\`\`

## 🔧 Configuration

### Environment Variables (Optional)

Create a `.env.local` file in the root directory:

\`\`\`env
# WebSocket Configuration (optional)
NEXT_PUBLIC_WS_URL=ws://localhost:3001

# API Keys (add your own)
WALLHAVEN_API_KEY=your_key_here
WAIFU_API_KEY=your_key_here
\`\`\`

### WebSocket Server

The WebSocket server runs separately and provides real-time activity updates. It's completely optional - the app works perfectly without it.

**To start the WebSocket server:**
\`\`\`bash
npm run ws-server
\`\`\`

**Default port:** 3001

## 🐛 Troubleshooting

### WebSocket Connection Issues

If you see WebSocket connection errors in the console:
- This is normal if the WebSocket server isn't running
- The app will automatically run in offline mode
- Activities will still be tracked locally
- No functionality is lost

**To fix:** Start the WebSocket server with `npm run ws-server`

### Storage Issues

If you encounter storage errors:
- Clear browser cache and localStorage
- Make sure cookies are enabled
- Try using a different browser

### Build Errors

If you encounter build errors:
\`\`\`bash
# Clear cache and reinstall
rm -rf .next node_modules
npm install
npm run dev
\`\`\`

## 🎨 Customization

### Theme Colors

Edit `app/globals.css` to customize the color scheme:

\`\`\`css
@theme {
  --color-primary: oklch(0.58 0.25 350); /* Red accent */
  --color-background: oklch(0.12 0.02 265); /* Dark background */
  /* ... more colors */
}
\`\`\`

### Animations

Animations are defined in `app/globals.css` and can be customized:
- `glow` - Glowing effect
- `pulse-slow` - Slow pulsing
- `slide-in` - Slide animations
- `fade-in` - Fade effects

## 📄 License

This project is for educational purposes. Please respect the API terms of service and image copyrights.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📞 Support

If you encounter any issues or have questions:
1. Check the troubleshooting section
2. Search existing issues
3. Create a new issue with detailed information

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
- APIs from various anime image providers

---

**Made with ❤️ for anime enthusiasts**
