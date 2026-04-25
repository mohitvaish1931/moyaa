export default async (request: any, response: any) => {
  try {
    const { email, password } = request.body;

    if (!email || !password) {
      return response.status(400).json({ error: 'Email and password required' });
    }

    // Mock authentication - in production, connect to MongoDB
    if (email === 'admin@moraa.com' && password === 'changeme') {
      return response.json({
        user: {
          id: 'admin123',
          email: 'admin@moraa.com',
          name: 'Admin',
          isAdmin: true
        }
      });
    }

    return response.status(400).json({ error: 'Invalid credentials' });
  } catch (error) {
    console.error('Login error:', error);
    return response.status(500).json({ error: 'Internal server error' });
  }
};

