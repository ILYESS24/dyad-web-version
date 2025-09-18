import React, { useState } from 'react';
import { User, Settings, Bell, CreditCard, Shield, Download, Upload, Star, Eye, Heart, Share2, Edit, Camera, Plus } from 'lucide-react';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  location: string;
  website: string;
  joinDate: string;
  stats: {
    appsCreated: number;
    totalViews: number;
    totalLikes: number;
    totalDownloads: number;
  };
  badges: string[];
  socialLinks: {
    github?: string;
    twitter?: string;
    linkedin?: string;
  };
}

interface UserApp {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  likes: number;
  views: number;
  downloads: number;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export function RorkUserProfile() {
  const [activeTab, setActiveTab] = useState<'overview' | 'apps' | 'likes' | 'settings'>('overview');
  const [isEditing, setIsEditing] = useState(false);

  const [profile] = useState<UserProfile>({
    id: '1',
    name: 'Alex Developer',
    email: 'alex@example.com',
    avatar: '/api/placeholder/120/120',
    bio: 'Full-stack developer passionate about creating amazing web applications. I love building with React, Node.js, and modern web technologies.',
    location: 'San Francisco, CA',
    website: 'https://alexdev.com',
    joinDate: '2023-06-15',
    stats: {
      appsCreated: 24,
      totalViews: 45600,
      totalLikes: 3240,
      totalDownloads: 1890
    },
    badges: ['Early Adopter', 'Top Creator', 'Community Helper', 'Bug Hunter'],
    socialLinks: {
      github: 'https://github.com/alexdev',
      twitter: 'https://twitter.com/alexdev',
      linkedin: 'https://linkedin.com/in/alexdev'
    }
  });

  const [userApps] = useState<UserApp[]>([
    {
      id: '1',
      name: 'Modern Dashboard',
      description: 'Beautiful analytics dashboard with real-time data',
      thumbnail: '/api/placeholder/300/200',
      likes: 456,
      views: 8920,
      downloads: 234,
      isPublic: true,
      createdAt: '2024-01-20',
      updatedAt: '2024-01-22'
    },
    {
      id: '2',
      name: 'E-commerce Template',
      description: 'Complete online store with payment integration',
      thumbnail: '/api/placeholder/300/200',
      likes: 789,
      views: 15600,
      downloads: 445,
      isPublic: true,
      createdAt: '2024-01-15',
      updatedAt: '2024-01-18'
    },
    {
      id: '3',
      name: 'Portfolio Website',
      description: 'Elegant portfolio template with animations',
      thumbnail: '/api/placeholder/300/200',
      likes: 234,
      views: 6780,
      downloads: 156,
      isPublic: false,
      createdAt: '2024-01-10',
      updatedAt: '2024-01-12'
    },
    {
      id: '4',
      name: 'Task Manager',
      description: 'Kanban board with team collaboration',
      thumbnail: '/api/placeholder/300/200',
      likes: 567,
      views: 12340,
      downloads: 289,
      isPublic: true,
      createdAt: '2024-01-05',
      updatedAt: '2024-01-08'
    }
  ]);

  const [likedApps] = useState<UserApp[]>([
    {
      id: '5',
      name: 'AI Chat Interface',
      description: 'Modern chat UI with AI integration',
      thumbnail: '/api/placeholder/300/200',
      likes: 1234,
      views: 23400,
      downloads: 567,
      isPublic: true,
      createdAt: '2024-01-18',
      updatedAt: '2024-01-20'
    },
    {
      id: '6',
      name: 'Weather Dashboard',
      description: 'Real-time weather with beautiful animations',
      thumbnail: '/api/placeholder/300/200',
      likes: 890,
      views: 18900,
      downloads: 345,
      isPublic: true,
      createdAt: '2024-01-12',
      updatedAt: '2024-01-15'
    }
  ]);

  const tabs = [
    { id: 'overview', name: 'Overview', icon: User },
    { id: 'apps', name: 'My Apps', icon: Upload },
    { id: 'likes', name: 'Liked Apps', icon: Heart },
    { id: 'settings', name: 'Settings', icon: Settings }
  ];

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-start space-x-6">
            {/* Avatar */}
            <div className="relative">
              <img 
                src={profile.avatar} 
                alt={profile.name}
                className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
              />
              {isEditing && (
                <button className="absolute bottom-0 right-0 p-2 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-colors">
                  <Camera className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{profile.name}</h1>
                  <p className="text-gray-600 mt-1">{profile.location}</p>
                  {profile.website && (
                    <a 
                      href={profile.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 text-sm mt-1 inline-block"
                    >
                      {profile.website}
                    </a>
                  )}
                </div>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  {isEditing ? 'Save' : 'Edit Profile'}
                </button>
              </div>

              <p className="text-gray-700 mt-4 max-w-2xl">{profile.bio}</p>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-6 mt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{profile.stats.appsCreated}</div>
                  <div className="text-sm text-gray-600">Apps Created</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{formatNumber(profile.stats.totalViews)}</div>
                  <div className="text-sm text-gray-600">Total Views</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{formatNumber(profile.stats.totalLikes)}</div>
                  <div className="text-sm text-gray-600">Total Likes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{formatNumber(profile.stats.totalDownloads)}</div>
                  <div className="text-sm text-gray-600">Downloads</div>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mt-4">
                {profile.badges.map((badge, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    {badge}
                  </span>
                ))}
              </div>

              {/* Social Links */}
              <div className="flex space-x-4 mt-4">
                {profile.socialLinks.github && (
                  <a href={profile.socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-600">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                    </svg>
                  </a>
                )}
                {profile.socialLinks.twitter && (
                  <a href={profile.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-600">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                )}
                {profile.socialLinks.linkedin && (
                  <a href={profile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-600">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Recent Activity */}
              <div className="lg:col-span-2">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Plus className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">Created new app "Modern Dashboard"</p>
                        <p className="text-xs text-gray-500">2 days ago</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <Heart className="w-4 h-4 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">Liked "AI Chat Interface" by Sarah Wilson</p>
                        <p className="text-xs text-gray-500">1 week ago</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                        <Star className="w-4 h-4 text-yellow-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">Earned "Top Creator" badge</p>
                        <p className="text-xs text-gray-500">2 weeks ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">This Month</h3>
                <div className="space-y-4">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Apps Created</span>
                      <span className="text-lg font-semibold text-gray-900">3</span>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Total Views</span>
                      <span className="text-lg font-semibold text-gray-900">12.4K</span>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">New Likes</span>
                      <span className="text-lg font-semibold text-gray-900">234</span>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Downloads</span>
                      <span className="text-lg font-semibold text-gray-900">89</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'apps' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">My Apps</h3>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center">
                <Plus className="w-4 h-4 mr-2" />
                Create New App
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userApps.map((app) => (
                <div key={app.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                    <div className="text-4xl">🚀</div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{app.name}</h4>
                      {!app.isPublic && (
                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">Private</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{app.description}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                      <div className="flex items-center space-x-3">
                        <span className="flex items-center">
                          <Eye className="w-3 h-3 mr-1" />
                          {formatNumber(app.views)}
                        </span>
                        <span className="flex items-center">
                          <Heart className="w-3 h-3 mr-1" />
                          {formatNumber(app.likes)}
                        </span>
                        <span className="flex items-center">
                          <Download className="w-3 h-3 mr-1" />
                          {formatNumber(app.downloads)}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="flex-1 px-3 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors">
                        Edit
                      </button>
                      <button className="px-3 py-2 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50 transition-colors">
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'likes' && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Liked Apps</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {likedApps.map((app) => (
                <div key={app.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                    <div className="text-4xl">🚀</div>
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">{app.name}</h4>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{app.description}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                      <div className="flex items-center space-x-3">
                        <span className="flex items-center">
                          <Eye className="w-3 h-3 mr-1" />
                          {formatNumber(app.views)}
                        </span>
                        <span className="flex items-center">
                          <Heart className="w-3 h-3 mr-1" />
                          {formatNumber(app.likes)}
                        </span>
                      </div>
                    </div>
                    <button className="w-full px-3 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors">
                      View App
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="max-w-2xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Account Settings</h3>
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h4 className="font-medium text-gray-900 mb-4">Profile Information</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input type="text" defaultValue={profile.name} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                    <textarea defaultValue={profile.bio} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input type="text" defaultValue={profile.location} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h4 className="font-medium text-gray-900 mb-4">Notifications</h4>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="ml-2 text-sm text-gray-700">Email notifications for new likes</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="ml-2 text-sm text-gray-700">Weekly activity summary</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="ml-2 text-sm text-gray-700">Marketing emails</span>
                  </label>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h4 className="font-medium text-gray-900 mb-4">Privacy</h4>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="ml-2 text-sm text-gray-700">Make profile public</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="ml-2 text-sm text-gray-700">Show email address</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
