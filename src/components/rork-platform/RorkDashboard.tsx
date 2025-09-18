import React, { useState } from 'react';
import { Plus, Search, Filter, Grid, List, Star, Eye, Share2, MoreVertical, Download, Edit, Trash2 } from 'lucide-react';

interface App {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  tags: string[];
  likes: number;
  views: number;
  author: string;
  createdAt: string;
  isPublic: boolean;
  isTemplate: boolean;
}

export function RorkDashboard() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Mock data for apps
  const [apps] = useState<App[]>([
    {
      id: '1',
      name: 'E-commerce Store',
      description: 'Complete online store with payment integration',
      thumbnail: '/api/placeholder/300/200',
      tags: ['React', 'E-commerce', 'Payment'],
      likes: 142,
      views: 2840,
      author: 'John Doe',
      createdAt: '2024-01-15',
      isPublic: true,
      isTemplate: true
    },
    {
      id: '2',
      name: 'Portfolio Website',
      description: 'Modern portfolio with dark mode and animations',
      thumbnail: '/api/placeholder/300/200',
      tags: ['Next.js', 'Portfolio', 'Animation'],
      likes: 89,
      views: 1560,
      author: 'Jane Smith',
      createdAt: '2024-01-10',
      isPublic: true,
      isTemplate: false
    },
    {
      id: '3',
      name: 'Task Management App',
      description: 'Kanban board with real-time collaboration',
      thumbnail: '/api/placeholder/300/200',
      tags: ['Vue.js', 'Tasks', 'Collaboration'],
      likes: 203,
      views: 4520,
      author: 'Mike Johnson',
      createdAt: '2024-01-08',
      isPublic: true,
      isTemplate: true
    },
    {
      id: '4',
      name: 'Blog Platform',
      description: 'Headless CMS with markdown support',
      thumbnail: '/api/placeholder/300/200',
      tags: ['Nuxt', 'CMS', 'Markdown'],
      likes: 67,
      views: 1230,
      author: 'Sarah Wilson',
      createdAt: '2024-01-05',
      isPublic: false,
      isTemplate: false
    }
  ]);

  const filteredApps = apps.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         app.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         app.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFilter = selectedFilter === 'all' || 
                         (selectedFilter === 'public' && app.isPublic) ||
                         (selectedFilter === 'templates' && app.isTemplate);
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Apps</h1>
            <p className="text-gray-600">Create, manage, and deploy your applications</p>
          </div>
          <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center">
            <Plus className="w-5 h-5 mr-2" />
            New App
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search apps..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-80"
              />
            </div>

            {/* Filter */}
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              aria-label="Filter apps"
            >
              <option value="all">All Apps</option>
              <option value="public">Public</option>
              <option value="templates">Templates</option>
            </select>
          </div>

          {/* View Mode */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Apps Grid/List */}
      <div className="p-6">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredApps.map((app) => (
              <div key={app.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden border border-gray-200">
                {/* Thumbnail */}
                <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-4xl">🚀</div>
                  </div>
                  {app.isTemplate && (
                    <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
                      Template
                    </div>
                  )}
                  {!app.isPublic && (
                    <div className="absolute top-2 right-2 bg-gray-500 text-white px-2 py-1 rounded text-xs font-medium">
                      Private
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1">{app.name}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{app.description}</p>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {app.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        {tag}
                      </span>
                    ))}
                    {app.tags.length > 2 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        +{app.tags.length - 2}
                      </span>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                    <div className="flex items-center space-x-3">
                      <span className="flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        {app.views}
                      </span>
                      <span className="flex items-center">
                        <Star className="w-4 h-4 mr-1" />
                        {app.likes}
                      </span>
                    </div>
                    <span>by {app.author}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-2">
                      <button className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded text-sm font-medium">
                        Open
                      </button>
                      {app.isPublic && (
                        <button className="px-3 py-1 text-gray-600 hover:bg-gray-50 rounded text-sm">
                          <Share2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="divide-y divide-gray-200">
              {filteredApps.map((app) => (
                <div key={app.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {/* Thumbnail */}
                      <div className="w-16 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                        <div className="text-lg">🚀</div>
                      </div>
                      
                      {/* Info */}
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold text-gray-900">{app.name}</h3>
                          {app.isTemplate && (
                            <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium">
                              Template
                            </span>
                          )}
                          {!app.isPublic && (
                            <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium">
                              Private
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{app.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>by {app.author}</span>
                          <span className="flex items-center">
                            <Eye className="w-3 h-3 mr-1" />
                            {app.views}
                          </span>
                          <span className="flex items-center">
                            <Star className="w-3 h-3 mr-1" />
                            {app.likes}
                          </span>
                          <span>{new Date(app.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      <button className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded text-sm font-medium">
                        Open
                      </button>
                      <button className="p-1 text-gray-400 hover:text-gray-600">
                        <Edit className="w-4 h-4" />
                      </button>
                      {app.isPublic && (
                        <button className="p-1 text-gray-400 hover:text-gray-600">
                          <Share2 className="w-4 h-4" />
                        </button>
                      )}
                      <button className="p-1 text-gray-400 hover:text-gray-600">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {filteredApps.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🚀</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No apps found</h3>
            <p className="text-gray-600 mb-6">Start building your first application</p>
            <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200">
              Create Your First App
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
