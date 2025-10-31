import React, { Suspense, lazy, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Button } from './components/Button';
import eventBus, { EVENTS } from './utils/eventBus';

// @ts-ignore
const ChatApp = lazy(() => import('chatApp/ChatApp'));
// @ts-ignore
const EmailApp = lazy(() => import('emailApp/EmailApp'));

// Loading component with modern animation
const Loading = () => (
  <div className="flex items-center justify-center h-full bg-linear-to-br from-blue-50 to-indigo-100">
    <div className="text-center">
      <div className="relative">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-8 w-8 rounded-full bg-blue-600 opacity-75 animate-pulse"></div>
        </div>
      </div>
      <p className="mt-6 text-gray-700 font-medium text-lg">Loading amazing content...</p>
    </div>
  </div>
);

// Error Boundary
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-full bg-linear-to-br from-red-50 to-pink-100">
          <div className="text-center p-10 bg-white rounded-2xl shadow-2xl max-w-md border-t-4 border-red-500">
            <div className="text-6xl mb-4">😕</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-3">Oops!</h2>
            <p className="text-gray-600 mb-6">{this.state.error?.message || 'Something went wrong'}</p>
            <Button onClick={() => window.location.reload()} size="lg">
              🔄 Reload Page
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Modern Navigation Component
const Navigation = () => {
  const location = useLocation();
  const [notifications, setNotifications] = useState(0);

  React.useEffect(() => {
    const unsubscribe = eventBus.on(EVENTS.NOTIFICATION, () => {
      setNotifications(prev => prev + 1);
    });

    return unsubscribe;
  }, []);

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-linear-to-r from-teal-500 via-cyan-500 to-blue-500 shadow-lg">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="bg-white p-2 rounded-lg group-hover:scale-110 transition-transform duration-200">
                <span className="text-2xl">🚀</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">MicroFront</h1>
                <p className="text-xs text-teal-100">Architecture POC</p>
              </div>
            </Link>
            
            <div className="flex space-x-3">
              <Link to="/">
                <button
                  className={`px-5 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                    isActive('/') 
                      ? 'bg-white text-teal-600 shadow-lg scale-105' 
                      : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm'
                  }`}
                >
                  🏠 Home
                </button>
              </Link>
              
              <Link to="/chat">
                <button
                  className={`px-5 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                    isActive('/chat') 
                      ? 'bg-white text-teal-600 shadow-lg scale-105' 
                      : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm'
                  }`}
                >
                  💬 Chat
                </button>
              </Link>
              
              <Link to="/email">
                <button
                  className={`px-5 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                    isActive('/email') 
                      ? 'bg-white text-teal-600 shadow-lg scale-105' 
                      : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm'
                  }`}
                >
                  📧 Email
                </button>
              </Link>
            </div>
          </div>

          {notifications > 0 && (
            <div className="relative">
              <div className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg animate-bounce">
                {notifications} New
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-400 rounded-full animate-ping"></div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

// Stunning Home Page
const HomePage = () => {
  return (
    <div className="min-h-full bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-auto">
      <div className="max-w-6xl mx-auto p-8">
        {/* Hero Section */}
        <div className="text-center mb-16 pt-12">
          <div className="inline-block mb-6">
            <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
              ✨ Built with Module Federation
            </span>
          </div>
          <h2 className="text-6xl font-bold bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
            Micro Frontend Architecture
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Experience the power of modular, scalable, and independently deployable frontend applications
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <Link to="/chat" className="group">
            <div className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-blue-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-blue-400 to-indigo-500 rounded-full -mr-16 -mt-16 opacity-10 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="relative">
                <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-300">💬</div>
                <h3 className="text-2xl font-bold mb-3 text-gray-800">Chat Application</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Real-time messaging with beautiful UI, contact management, and instant notifications
                </p>
                <div className="flex items-center text-blue-600 font-semibold">
                  <span>Explore Chat</span>
                  <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>

          <Link to="/email" className="group">
            <div className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-purple-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-purple-400 to-pink-500 rounded-full -mr-16 -mt-16 opacity-10 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="relative">
                <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-300">📧</div>
                <h3 className="text-2xl font-bold mb-3 text-gray-800">Email Application</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Full-featured email client with smart filters, compose, and seamless inbox management
                </p>
                <div className="flex items-center text-purple-600 font-semibold">
                  <span>Explore Email</span>
                  <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Architecture Highlights */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <h3 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
            <span className="bg-linear-to-r from-blue-600 to-purple-600 text-white p-2 rounded-lg mr-3">🏗️</span>
            Architecture Highlights
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <span className="text-2xl">⚡</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-1">Module Federation</h4>
                <p className="text-gray-600 text-sm">Dynamic runtime integration with Vite</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <span className="text-2xl">🎨</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-1">Shared Design System</h4>
                <p className="text-gray-600 text-sm">Consistent UI components across apps</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <span className="text-2xl">🔄</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-1">Event-Driven Communication</h4>
                <p className="text-gray-600 text-sm">Real-time inter-app messaging</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="bg-pink-100 p-3 rounded-lg">
                <span className="text-2xl">🚀</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-1">Independent Deployment</h4>
                <p className="text-gray-600 text-sm">Deploy and scale separately</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Wrapper components
const ChatWrapper = () => {
  return (
    <div className="h-full w-full">
      <ErrorBoundary>
        <Suspense fallback={<Loading />}>
          <ChatApp />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

const EmailWrapper = () => {
  return (
    <div className="h-full w-full">
      <ErrorBoundary>
        <Suspense fallback={<Loading />}>
          <EmailApp />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        
        <main className="h-[calc(100vh-5rem)]">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/chat" element={<ChatWrapper />} />
            <Route path="/email" element={<EmailWrapper />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;