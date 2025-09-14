// Vercel API endpoint - Simple web API without server dependencies

// Mock data for web version
const mockApps = [
  {
    id: 1,
    name: 'Sample App',
    description: 'A sample application',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const mockSettings = {
  selectedModel: {
    name: 'gpt-4o-mini',
    provider: 'openai'
  },
  providerSettings: {
    openai: {
      apiKey: {
        value: process.env.OPENAI_API_KEY || '',
        encryptionType: 'plaintext'
      }
    },
    anthropic: {
      apiKey: {
        value: process.env.ANTHROPIC_API_KEY || '',
        encryptionType: 'plaintext'
      }
    }
  }
};

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Basic health check
    if (req.url === '/api/health' && req.method === 'GET') {
      return res.status(200).json({ 
        status: 'ok', 
        message: 'Dyad Web API is running',
        timestamp: new Date().toISOString()
      });
    }

    // Handle API routes
    const path = req.url.replace('/api/', '');
    
    if (path === 'apps' && req.method === 'GET') {
      return res.status(200).json({
        apps: mockApps
      });
    }

    if (path === 'settings' && req.method === 'GET') {
      return res.status(200).json(mockSettings);
    }

    // Default response for unhandled routes
    return res.status(404).json({ 
      error: 'Not found',
      message: `Route ${req.method} ${req.url} not found`
    });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
};
