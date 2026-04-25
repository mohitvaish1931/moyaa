export default async (request: any, response: any) => {
  try {
    const { email, password, name } = request.body;

    if (!email || !password) {
      return response.status(400).json({ error: 'Email and password required' });
    }

    if (password.length < 6) {
      return response.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Mock user creation - in production, connect to MongoDB
    const newUser = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name: name || '',
      isAdmin: false
    };

    return response.status(201).json({ user: newUser });
  } catch (error) {
    console.error('Registration error:', error);
    return response.status(500).json({ error: 'Internal server error' });
  }
};
