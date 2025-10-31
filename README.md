# Micro-Frontend Architecture POC

A Proof of Concept demonstrating a micro-frontend architecture using React, Vite, and Module Federation.

## 🎯 Project Overview

This project showcases a modular micro-frontend architecture with three independent applications:

1. **Host Application** - Main container and design system provider
2. **Chat Application** - Standalone messaging micro-frontend
3. **Email Application** - Standalone email client micro-frontend

## 🛠️ Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Module Federation** - Micro-frontend architecture
- **Tailwind CSS** - Styling
- **React Router** - Navigation

## 🏗️ Architecture

```
┌─────────────────────────────────────────┐
│         HOST APPLICATION                │
│  (localhost:3000)                       │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │   Design System & Shared        │   │
│  │   Components                    │   │
│  │   - Button, Input, Card         │   │
│  │   - Theme Configuration         │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌──────────────┐  ┌──────────────┐   │
│  │   Chat MFE   │  │  Email MFE   │   │
│  │ (port 3001)  │  │ (port 3002)  │   │
│  └──────────────┘  └──────────────┘   │
└─────────────────────────────────────────┘
```

### Key Features

- **Module Federation**: Seamless runtime integration of micro-frontends
- **Design System**: Shared UI components consumed by all applications
- **Event Bus**: Cross-application communication
- **Independent Deployment**: Each app can be developed and deployed separately
- **Type Safety**: Full TypeScript support across all applications
- **Lazy Loading**: Micro-frontends loaded on demand

## 📦 Project Structure

```
micro-frontend-poc/
├── host-app/               # Main container application
│   ├── src/
│   │   ├── components/     # Shared design system components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   └── Card.tsx
│   │   ├── utils/
│   │   │   └── eventBus.ts # Inter-app communication
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── package.json
│
├── chat-app/               # Chat micro-frontend
│   ├── src/
│   │   ├── App.tsx
│   │   ├── App.css
│   │   └── main.tsx
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── package.json
│
├── email-app/              # Email micro-frontend
│   ├── src/
│   │   ├── App.tsx
│   │   ├── App.css
│   │   └── main.tsx
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── package.json
│
├── run-all.sh             # Script to run all apps (Linux/Mac)
├── run-all.bat            # Script to run all apps (Windows)
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd micro-frontend-poc
```

2. **Install dependencies for all applications**
```bash
# Host App
cd host-app
npm install
cd ..

# Chat App
cd chat-app
npm install
cd ..

# Email App
cd email-app
npm install
cd ..
```

### Running the Applications

#### Option 1: Run all apps at once (Recommended)

**Linux/Mac:**
```bash
chmod +x run-all.sh
./run-all.sh
```

**Windows:**
```bash
run-all.bat
```

#### Option 2: Run apps individually

Open three separate terminal windows:

**Terminal 1 - Chat App:**
```bash
cd chat-app
npm run dev
```

**Terminal 2 - Email App:**
```bash
cd email-app
npm run dev
```

**Terminal 3 - Host App:**
```bash
cd host-app
npm run dev
```

### Access the Applications

- 🏠 **Host App**: http://localhost:3000 (Main application)
- 💬 **Chat App**: http://localhost:3001 (Can run standalone)
- 📧 **Email App**: http://localhost:3002 (Can run standalone)

## 🎨 Design System

The host application provides a shared design system that is consumed by all micro-frontends:

### Components

- **Button**: Primary, secondary, and outline variants
- **Input**: Text input with label and error states
- **Card**: Container component with hover effects

### Theme

- Primary color: Blue (#3b82f6)
- Font: System fonts
- Consistent spacing and sizing

## 🔄 Inter-App Communication

Applications communicate using a custom Event Bus:

```typescript
// Emit event
eventBus.emit('notification', { message: 'New message' });

// Listen to event
const unsubscribe = eventBus.on('notification', (data) => {
  console.log(data);
});

// Cleanup
unsubscribe();
```

### Available Events

- `new_message`: Triggered when a chat message is sent
- `new_email`: Triggered when an email is composed
- `notification`: Generic notification event
- `user_updated`: User profile updates

## 📱 Features

### Chat Application

- ✅ Contact list with online status
- ✅ Real-time message interface
- ✅ Message timestamps
- ✅ Unread message indicators
- ✅ Send and receive messages
- ✅ Auto-scroll to latest message

### Email Application

- ✅ Inbox with email preview
- ✅ Filter by All, Unread, Starred
- ✅ Full email view
- ✅ Compose new emails
- ✅ Star/unstar emails
- ✅ Mark as read functionality

## 🏗️ Build for Production

```bash
# Build all applications
cd host-app && npm run build && cd ..
cd chat-app && npm run build && cd ..
cd email-app && npm run build && cd ..
```

## 🚢 Deployment

### Deploy to Vercel

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
```

2. **Deploy each app separately on Vercel:**
   - Import your GitHub repository
   - Deploy host-app with root directory: `host-app`
   - Deploy chat-app with root directory: `chat-app`
   - Deploy email-app with root directory: `email-app`

3. **Update Module Federation URLs:**
   - After deployment, update the remote URLs in `host-app/vite.config.ts`:
   ```typescript
   remotes: {
     chatApp: 'https://your-chat-app.vercel.app/assets/remoteEntry.js',
     emailApp: 'https://your-email-app.vercel.app/assets/remoteEntry.js',
   }
   ```

## 🎯 Key Architectural Decisions

### Module Federation

**Why:** Enables runtime integration of independently deployed applications without requiring a monolith build.

**Trade-offs:**
- ✅ Independent deployments
- ✅ Team autonomy
- ⚠️ Slightly larger initial bundle
- ⚠️ Network dependency for remote modules

### Vite over Webpack

**Why:** Faster development experience with HMR and modern ESM-based architecture.

**Trade-offs:**
- ✅ Lightning-fast dev server
- ✅ Optimized production builds
- ⚠️ Newer ecosystem
- ⚠️ Different from traditional Webpack MF

### Event Bus for Communication

**Why:** Simple, decoupled communication between micro-frontends.

**Trade-offs:**
- ✅ Loose coupling
- ✅ Easy to implement
- ⚠️ No type safety across boundaries
- ⚠️ Potential for event conflicts

### Shared Design System

**Why:** Consistent UI/UX across all micro-frontends.

**Trade-offs:**
- ✅ Visual consistency
- ✅ Faster development
- ⚠️ Design system versioning complexity
- ⚠️ Potential breaking changes

## 🔮 Future Enhancements

- [ ] Add authentication and user management
- [ ] Implement state management (Redux/Zustand)
- [ ] Add unit and integration tests
- [ ] Implement CI/CD pipeline
- [ ] Add more shared components
- [ ] Real-time WebSocket communication
- [ ] Add error monitoring (Sentry)
- [ ] Implement feature flags
- [ ] Add analytics tracking
- [ ] Performance monitoring

## 🐛 Known Issues

- Module Federation requires all apps to be running for the host app to work
- Hot module replacement may require manual refresh when updating shared components
- TypeScript types are not automatically shared between micro-frontends

## 🤝 Contributing

This is a POC project. Feel free to fork and experiment!

## 📝 License

MIT

## 👤 Author

Laxman Suthar

## 🙏 Acknowledgments

- React Team for amazing framework
- Vite team for blazing-fast tooling
- Module Federation team for the architecture pattern
- Bluebash for the opportunity

---

**Built with ❤️ using Micro-Frontend Architecture**