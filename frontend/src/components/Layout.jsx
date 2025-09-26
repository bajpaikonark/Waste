import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';
import { Link } from 'react-router-dom';
import BottomNavbar from './BottomNavbar';

const Layout = ({ children }) => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { currentUser } = useAuth();

  const Brand = () => (
    <Link to="/" className="flex items-center">
      <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-6 0H5m2 0h4M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
      <span className="ml-2 text-xl font-bold text-gray-800">SwacchConnect</span>
    </Link>
  );

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Gradient background */}
      <div
        className="absolute inset-0 blur-xl h-[580px]"
        style={{
          background:
            "linear-gradient(143.6deg, rgba(16, 185, 129, 0) 20.79%, rgba(16, 185, 129, 0.2) 40.92%, rgba(16, 185, 129, 0.1) 70.35%)",
        }}
      ></div>

      <div className="relative flex flex-col flex-grow">
        {/* Header - Simplified like reference site */}
        <header className="bg-white shadow-sm">
          <div className="max-w-screen-xl mx-auto px-4 py-3 flex items-center justify-between">
            <Brand />
            
            <div className="flex items-center space-x-4">
            
              
              {/* User profile icon (like VG in reference) */}
              {currentUser ? (
                <Link to="/profile" className="flex items-center">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {currentUser.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                </Link>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="flex items-center justify-center gap-x-1 py-2 px-4 text-white font-medium bg-green-600 hover:bg-green-700 active:bg-green-800 rounded-full"
                >
                  Sign in
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-grow pb-16">
          {children}
        </main>

        {/* Mobile Bottom Navigation */}
        {currentUser && currentUser.role !== 'admin' && (
          <BottomNavbar onReportClick={() => window.location.href = '/#report-waste'} />
        )}

        {/* Authentication modal */}
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
        />
      </div>
    </div>
  );
};

export default Layout;