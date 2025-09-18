import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, Star, Users, Zap, Shield, Code, Palette, Layers } from 'lucide-react';
import { RorkNavigation } from '@/components/rork-platform/RorkNavigation';

export default function RorkHomePage() {
  const features = [
    {
      icon: Code,
      title: 'Visual App Builder',
      description: 'Build applications visually with drag-and-drop components and real-time preview.',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Palette,
      title: 'Beautiful Templates',
      description: 'Choose from hundreds of professionally designed templates for any use case.',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: Zap,
      title: 'Instant Deployment',
      description: 'Deploy your applications with a single click to our global CDN.',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Work together with your team in real-time on shared projects.',
      color: 'from-orange-500 to-orange-600'
    }
  ];

  const stats = [
    { number: '50K+', label: 'Apps Created' },
    { number: '2M+', label: 'Downloads' },
    { number: '100K+', label: 'Active Users' },
    { number: '99.9%', label: 'Uptime' }
  ];

  const templates = [
    {
      name: 'E-commerce Store',
      description: 'Complete online store with payment integration',
      image: '/api/placeholder/400/250',
      category: 'E-commerce',
      rating: 4.9,
      downloads: '2.3K'
    },
    {
      name: 'Portfolio Website',
      description: 'Modern portfolio with animations and dark mode',
      image: '/api/placeholder/400/250',
      category: 'Portfolio',
      rating: 4.8,
      downloads: '1.8K'
    },
    {
      name: 'Dashboard App',
      description: 'Analytics dashboard with real-time data',
      image: '/api/placeholder/400/250',
      category: 'Dashboard',
      rating: 4.7,
      downloads: '3.1K'
    },
    {
      name: 'Landing Page',
      description: 'High-converting landing page template',
      image: '/api/placeholder/400/250',
      category: 'Marketing',
      rating: 4.9,
      downloads: '4.2K'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <RorkNavigation currentUser={{
        name: 'Alex Developer',
        avatar: '/api/placeholder/32/32',
        notifications: 3
      }} />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Build Apps That
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Matter</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Create, deploy, and scale web applications without writing a single line of code. 
              Join thousands of developers building the future with Rork.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/builder"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium text-lg"
              >
                <Play className="w-5 h-5 mr-2" />
                Start Building
              </Link>
              <Link
                to="/marketplace"
                className="inline-flex items-center px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 font-medium text-lg"
              >
                Browse Templates
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </div>

          {/* Hero Image/Demo */}
          <div className="mt-16 relative">
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 border-b border-gray-200 p-4 flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-8xl mb-4">🚀</div>
                  <p className="text-xl font-semibold text-gray-700">Your App Preview</p>
                  <p className="text-gray-500">Build and see changes in real-time</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Build
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From idea to deployment, Rork provides all the tools you need to create amazing web applications.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Popular Templates
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Start with professionally designed templates and customize them to match your vision.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {templates.map((template, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden border border-gray-200">
                <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                  <div className="text-6xl">🚀</div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-blue-600 font-medium">{template.category}</span>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 mr-1" />
                      <span className="text-sm text-gray-600">{template.rating}</span>
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{template.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{template.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{template.downloads} downloads</span>
                    <Link
                      to="/marketplace"
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      View Template
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/marketplace"
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 font-medium"
            >
              View All Templates
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Start Building?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of developers who are already building amazing applications with Rork.
          </p>
          <Link
            to="/builder"
            className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl font-medium text-lg"
          >
            <Play className="w-5 h-5 mr-2" />
            Start Building Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">R</span>
                </div>
                <span className="text-xl font-bold">Rork</span>
              </div>
              <p className="text-gray-400">
                The platform for building, deploying, and scaling web applications.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/builder" className="hover:text-white">App Builder</Link></li>
                <li><Link to="/marketplace" className="hover:text-white">Marketplace</Link></li>
                <li><Link to="/templates" className="hover:text-white">Templates</Link></li>
                <li><Link to="/deployment" className="hover:text-white">Deployment</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/docs" className="hover:text-white">Documentation</Link></li>
                <li><Link to="/tutorials" className="hover:text-white">Tutorials</Link></li>
                <li><Link to="/community" className="hover:text-white">Community</Link></li>
                <li><Link to="/support" className="hover:text-white">Support</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/about" className="hover:text-white">About</Link></li>
                <li><Link to="/blog" className="hover:text-white">Blog</Link></li>
                <li><Link to="/careers" className="hover:text-white">Careers</Link></li>
                <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Rork. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
