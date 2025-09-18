import React, { useState } from 'react';
import { Plus, Code, Eye, Play, Download, Share2, Settings } from 'lucide-react';

export function RorkAppBuilder() {
  const [activeTab, setActiveTab] = useState<'code' | 'preview'>('code');
  const [code, setCode] = useState(`// Welcome to Dyad Web Builder
import React from 'react';

function MyApp() {
  return (
    <div className="p-8 bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          🚀 Hello World!
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Start building your AI-powered app here.
        </p>
        <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200">
          Get Started
        </button>
      </div>
    </div>
  );
}

export default MyApp;`);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Build Apps Like Never Before
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Create stunning applications with our visual builder, AI assistance, and instant deployment.
          </p>
        </div>

        {/* App Builder Interface */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Toolbar */}
          <div className="bg-gray-900 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <span className="text-gray-300 text-sm font-medium">Dyad Web Builder</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-400 hover:text-white transition-colors">
                <Settings className="w-4 h-4" />
              </button>
              <button className="p-2 text-gray-400 hover:text-white transition-colors">
                <Share2 className="w-4 h-4" />
              </button>
              <button className="p-2 text-gray-400 hover:text-white transition-colors">
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex">
            {/* Sidebar */}
            <div className="w-64 bg-gray-50 border-r border-gray-200 p-4">
              <div className="space-y-4">
                <button className="w-full flex items-center space-x-3 px-4 py-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <Plus className="w-5 h-5 text-blue-500" />
                  <span className="font-medium">New Project</span>
                </button>
                
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Components</h3>
                  <div className="space-y-1">
                    <div className="px-3 py-2 text-sm text-gray-600 hover:bg-white hover:rounded cursor-pointer">Button</div>
                    <div className="px-3 py-2 text-sm text-gray-600 hover:bg-white hover:rounded cursor-pointer">Input</div>
                    <div className="px-3 py-2 text-sm text-gray-600 hover:bg-white hover:rounded cursor-pointer">Card</div>
                    <div className="px-3 py-2 text-sm text-gray-600 hover:bg-white hover:rounded cursor-pointer">Modal</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">AI Tools</h3>
                  <div className="space-y-1">
                    <div className="px-3 py-2 text-sm text-gray-600 hover:bg-white hover:rounded cursor-pointer">Generate Code</div>
                    <div className="px-3 py-2 text-sm text-gray-600 hover:bg-white hover:rounded cursor-pointer">Fix Bugs</div>
                    <div className="px-3 py-2 text-sm text-gray-600 hover:bg-white hover:rounded cursor-pointer">Add Features</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Editor */}
            <div className="flex-1 flex flex-col">
              {/* Tabs */}
              <div className="bg-gray-100 border-b border-gray-200 flex">
                <button
                  onClick={() => setActiveTab('code')}
                  className={`px-6 py-3 text-sm font-medium transition-colors ${
                    activeTab === 'code'
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Code className="w-4 h-4 inline mr-2" />
                  Code
                </button>
                <button
                  onClick={() => setActiveTab('preview')}
                  className={`px-6 py-3 text-sm font-medium transition-colors ${
                    activeTab === 'preview'
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Eye className="w-4 h-4 inline mr-2" />
                  Preview
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 flex">
                {activeTab === 'code' ? (
                  <div className="flex-1 p-6">
                    <div className="bg-gray-900 rounded-lg overflow-hidden">
                      <div className="bg-gray-800 px-4 py-2 border-b border-gray-700 flex items-center justify-between">
                        <span className="text-gray-300 text-sm">App.jsx</span>
                        <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors">
                          <Play className="w-3 h-3 inline mr-1" />
                          Run
                        </button>
                      </div>
                      <textarea
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="w-full h-96 bg-gray-900 text-green-400 p-4 font-mono text-sm resize-none focus:outline-none"
                        style={{ fontFamily: 'Monaco, Consolas, monospace' }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 p-6 bg-white">
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="bg-gray-100 px-4 py-2 border-b border-gray-200 flex items-center justify-between">
                        <span className="text-gray-600 text-sm">Preview</span>
                        <div className="flex space-x-2">
                          <button className="p-1 text-gray-500 hover:text-gray-700">
                            <Settings className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="h-96 bg-white p-8 overflow-auto">
                        <div className="max-w-4xl mx-auto">
                          <h1 className="text-4xl font-bold text-gray-900 mb-4">
                            🚀 Hello World!
                          </h1>
                          <p className="text-xl text-gray-600 mb-8">
                            Start building your AI-powered app here.
                          </p>
                          <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200">
                            Get Started
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
