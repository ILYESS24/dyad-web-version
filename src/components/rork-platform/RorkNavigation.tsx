import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Store, 
  Plus, 
  User, 
  Search, 
  Bell, 
  Settings, 
  Menu, 
  X,
  Code,
  Palette,
  Layers,
  Zap
} from 'lucide-react';

interface NavigationProps {
  currentUser?: {
    name: string;
    avatar: string;
    notifications: number;
  };
}

export function RorkNavigation({ currentUser }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Marketplace', href: '/marketplace', icon: Store },
    { name: 'Builder', href: '/builder', icon: Code },
    { name: 'Templates', href: '/templates', icon: Layers },
  ];

  const userMenuItems = [
    { name: 'Profile', href: '/profile', icon: User },
    { name: 'Settings', href: '/settings', icon: Settings },
    { name: 'Sign out', href: '/logout', icon: null, divider: true }
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">R</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Rork</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="hidden sm:block">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search apps..."
                  className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
            </div>

            {/* Create Button */}
            <Link
              to="/builder"
              className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span className="font-medium">Create</span>
            </Link>

            {/* Notifications */}
            {currentUser && (
              <button className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg">
                <Bell className="w-5 h-5" />
                {currentUser.notifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {currentUser.notifications > 9 ? '9+' : currentUser.notifications}
                  </span>
                )}
              </button>
            )}

            {/* User Menu */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 p-1 rounded-lg hover:bg-gray-50"
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-full border-2 border-gray-200"
                  />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{currentUser.name}</p>
                      <p className="text-xs text-gray-500">View profile</p>
                    </div>
                    {userMenuItems.map((item, index) => (
                      <div key={index}>
                        {item.divider && <div className="border-t border-gray-100 my-1" />}
                        <Link
                          to={item.href}
                          className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          {item.icon && <item.icon className="w-4 h-4" />}
                          <span>{item.name}</span>
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium"
                >
                  Sign in
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                >
                  Sign up
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-base font-medium transition-colors ${
                    isActive(item.href)
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>

            {/* Mobile Search */}
            <div className="mt-4 px-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search apps..."
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
            </div>

            {/* Mobile Create Button */}
            <div className="mt-4 px-3">
              <Link
                to="/builder"
                className="flex items-center justify-center space-x-2 w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Plus className="w-4 h-4" />
                <span>Create New App</span>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Backdrop for mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-25 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </nav>
  );
}
