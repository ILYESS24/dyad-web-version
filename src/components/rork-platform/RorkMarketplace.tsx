import React, { useState } from 'react';
import { Search, Filter, Star, Eye, Download, Heart, ExternalLink, TrendingUp, Clock, Users } from 'lucide-react';

interface MarketplaceApp {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  tags: string[];
  likes: number;
  downloads: number;
  views: number;
  author: string;
  authorAvatar: string;
  price: number;
  isFree: boolean;
  rating: number;
  category: string;
  featured: boolean;
  trending: boolean;
  createdAt: string;
  updatedAt: string;
}

export function RorkMarketplace() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('trending');
  const [priceFilter, setPriceFilter] = useState('all');

  const categories = [
    { id: 'all', name: 'All Categories', icon: '📦' },
    { id: 'ecommerce', name: 'E-commerce', icon: '🛒' },
    { id: 'portfolio', name: 'Portfolio', icon: '💼' },
    { id: 'blog', name: 'Blog & CMS', icon: '📝' },
    { id: 'dashboard', name: 'Dashboard', icon: '📊' },
    { id: 'landing', name: 'Landing Page', icon: '🚀' },
    { id: 'saas', name: 'SaaS', icon: '⚡' },
    { id: 'mobile', name: 'Mobile App', icon: '📱' }
  ];

  const [apps] = useState<MarketplaceApp[]>([
    {
      id: '1',
      name: 'Modern E-commerce Store',
      description: 'Complete online store with payment integration, inventory management, and admin dashboard',
      thumbnail: '/api/placeholder/400/250',
      tags: ['React', 'Stripe', 'Admin', 'Responsive'],
      likes: 1247,
      downloads: 892,
      views: 15680,
      author: 'DesignStudio Pro',
      authorAvatar: '/api/placeholder/40/40',
      price: 49,
      isFree: false,
      rating: 4.8,
      category: 'ecommerce',
      featured: true,
      trending: true,
      createdAt: '2024-01-15',
      updatedAt: '2024-01-20'
    },
    {
      id: '2',
      name: 'Portfolio Showcase',
      description: 'Elegant portfolio template with dark mode, animations, and contact form',
      thumbnail: '/api/placeholder/400/250',
      tags: ['Next.js', 'Tailwind', 'Animation', 'SEO'],
      likes: 892,
      downloads: 634,
      views: 12890,
      author: 'Creative Dev',
      authorAvatar: '/api/placeholder/40/40',
      price: 0,
      isFree: true,
      rating: 4.9,
      category: 'portfolio',
      featured: false,
      trending: true,
      createdAt: '2024-01-10',
      updatedAt: '2024-01-18'
    },
    {
      id: '3',
      name: 'Analytics Dashboard',
      description: 'Professional dashboard with charts, tables, and real-time data visualization',
      thumbnail: '/api/placeholder/400/250',
      tags: ['Vue.js', 'Charts.js', 'Dashboard', 'Analytics'],
      likes: 2156,
      downloads: 1456,
      views: 23400,
      author: 'DataViz Studio',
      authorAvatar: '/api/placeholder/40/40',
      price: 79,
      isFree: false,
      rating: 4.7,
      category: 'dashboard',
      featured: true,
      trending: false,
      createdAt: '2024-01-08',
      updatedAt: '2024-01-22'
    },
    {
      id: '4',
      name: 'Startup Landing Page',
      description: 'High-converting landing page template perfect for SaaS startups',
      thumbnail: '/api/placeholder/400/250',
      tags: ['React', 'Landing', 'SaaS', 'Conversion'],
      likes: 743,
      downloads: 523,
      views: 9870,
      author: 'Startup Templates',
      authorAvatar: '/api/placeholder/40/40',
      price: 29,
      isFree: false,
      rating: 4.6,
      category: 'landing',
      featured: false,
      trending: true,
      createdAt: '2024-01-05',
      updatedAt: '2024-01-19'
    },
    {
      id: '5',
      name: 'Blog & CMS Platform',
      description: 'Headless CMS with markdown support, comments, and SEO optimization',
      thumbnail: '/api/placeholder/400/250',
      tags: ['Nuxt.js', 'CMS', 'Markdown', 'SEO'],
      likes: 634,
      downloads: 412,
      views: 8760,
      author: 'Content Creators',
      authorAvatar: '/api/placeholder/40/40',
      price: 39,
      isFree: false,
      rating: 4.5,
      category: 'blog',
      featured: false,
      trending: false,
      createdAt: '2024-01-03',
      updatedAt: '2024-01-17'
    },
    {
      id: '6',
      name: 'Task Management App',
      description: 'Kanban board with real-time collaboration and team management',
      thumbnail: '/api/placeholder/400/250',
      tags: ['React', 'Real-time', 'Collaboration', 'Tasks'],
      likes: 1456,
      downloads: 987,
      views: 18760,
      author: 'Productivity Co',
      authorAvatar: '/api/placeholder/40/40',
      price: 0,
      isFree: true,
      rating: 4.8,
      category: 'saas',
      featured: true,
      trending: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-21'
    }
  ]);

  const filteredApps = apps.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         app.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         app.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || app.category === selectedCategory;
    
    const matchesPrice = priceFilter === 'all' || 
                        (priceFilter === 'free' && app.isFree) ||
                        (priceFilter === 'paid' && !app.isFree);
    
    return matchesSearch && matchesCategory && matchesPrice;
  });

  const sortedApps = [...filteredApps].sort((a, b) => {
    switch (sortBy) {
      case 'trending':
        return b.downloads - a.downloads;
      case 'popular':
        return b.likes - a.likes;
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'rating':
        return b.rating - a.rating;
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">App Marketplace</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover and deploy pre-built applications created by our community. 
              Find the perfect template for your next project.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-lg">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search apps, templates, or developers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                aria-label="Select category"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.icon} {category.name}
                  </option>
                ))}
              </select>

              <select
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Prices</option>
                <option value="free">Free Only</option>
                <option value="paid">Paid Only</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="trending">Trending</option>
                <option value="popular">Most Popular</option>
                <option value="newest">Newest</option>
                <option value="rating">Highest Rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Section */}
      <div className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Featured Apps</h2>
            <button className="text-blue-600 hover:text-blue-700 font-medium">View All</button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedApps.filter(app => app.featured).map((app) => (
              <div key={app.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden border border-gray-200">
                {/* Thumbnail */}
                <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-6xl">🚀</div>
                  </div>
                  <div className="absolute top-3 left-3 flex space-x-2">
                    {app.featured && (
                      <span className="bg-yellow-500 text-white px-2 py-1 rounded text-xs font-medium">
                        Featured
                      </span>
                    )}
                    {app.trending && (
                      <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                        Trending
                      </span>
                    )}
                  </div>
                  <div className="absolute top-3 right-3">
                    <button className="p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
                      <Heart className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{app.name}</h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <img src={app.authorAvatar} alt={app.author} className="w-5 h-5 rounded-full" />
                        <span>{app.author}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">
                        {app.isFree ? 'Free' : `$${app.price}`}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Star className="w-4 h-4 text-yellow-400 mr-1" />
                        {app.rating}
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{app.description}</p>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {app.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        {tag}
                      </span>
                    ))}
                    {app.tags.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        +{app.tags.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        {app.views.toLocaleString()}
                      </span>
                      <span className="flex items-center">
                        <Download className="w-4 h-4 mr-1" />
                        {app.downloads.toLocaleString()}
                      </span>
                      <span className="flex items-center">
                        <Heart className="w-4 h-4 mr-1" />
                        {app.likes.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <button className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-medium">
                      {app.isFree ? 'Use Template' : 'Buy Now'}
                    </button>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* All Apps Section */}
      <div className="px-6 py-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">All Apps</h2>
            <span className="text-gray-500">{sortedApps.length} apps found</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedApps.map((app) => (
              <div key={app.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden border border-gray-200">
                {/* Thumbnail */}
                <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-4xl">🚀</div>
                  </div>
                  <div className="absolute top-2 left-2 flex space-x-1">
                    {app.trending && (
                      <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                        <TrendingUp className="w-3 h-3 inline mr-1" />
                        Trending
                      </span>
                    )}
                  </div>
                  <div className="absolute top-2 right-2">
                    <button className="p-1.5 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
                      <Heart className="w-3 h-3 text-gray-600" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">{app.name}</h3>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">
                        {app.isFree ? 'Free' : `$${app.price}`}
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-600 text-xs mb-3 line-clamp-2">{app.description}</p>
                  
                  {/* Author */}
                  <div className="flex items-center space-x-2 mb-3">
                    <img src={app.authorAvatar} alt={app.author} className="w-4 h-4 rounded-full" />
                    <span className="text-xs text-gray-500">{app.author}</span>
                    <div className="flex items-center text-xs text-gray-500">
                      <Star className="w-3 h-3 text-yellow-400 mr-1" />
                      {app.rating}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <span className="flex items-center">
                      <Download className="w-3 h-3 mr-1" />
                      {app.downloads.toLocaleString()}
                    </span>
                    <span className="flex items-center">
                      <Heart className="w-3 h-3 mr-1" />
                      {app.likes.toLocaleString()}
                    </span>
                  </div>

                  {/* Actions */}
                  <button className="w-full px-3 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 text-sm font-medium">
                    {app.isFree ? 'Use Template' : 'Buy Now'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {sortedApps.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No apps found</h3>
              <p className="text-gray-600">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
