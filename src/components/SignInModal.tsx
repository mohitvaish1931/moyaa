import React, { useState } from 'react';
import { X, Mail, Lock, User } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { API_BASE_URL } from '../utils/api';

const SignInModal = () => {
  const { state, dispatch } = useAppContext();
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleClose = () => {
    dispatch({ type: 'TOGGLE_SIGNIN', payload: false });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    (async () => {
      try {
        const url = `${API_BASE_URL}/api/auth/${isSignUp ? 'register' : 'login'}`;
        const body = isSignUp
          ? { email: formData.email, password: formData.password, name: formData.name }
          : { email: formData.email, password: formData.password };
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        const data = await res.json();
        if (!res.ok) {
          alert(data.error || 'Authentication failed');
          return;
        }
        // Save user in context
        dispatch({ type: 'SET_USER', payload: { id: data.user.id, email: data.user.email, name: data.user.name } });
        dispatch({ type: 'TOGGLE_SIGNIN', payload: false });
        setFormData({ name: '', email: '', password: '' });
      } catch (e) {
        alert('Authentication error');
      }
    })();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (!state.isSignInOpen) return null;

  return (
    <div className="fixed inset-0 bg-luxury-dark/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="glass-card-emerald border border-emerald-luxury/40 rounded-lg p-8 max-w-md w-full mx-4 shadow-glow-emerald">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gold-primary luxury-serif">
            {isSignUp ? 'Create Account' : 'Sign In'}
          </h2>
          <button
            onClick={handleClose}
            className="text-platinum/60 hover:text-gold-primary transition-all duration-300"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-sm font-medium text-platinum mb-2 luxury-serif">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gold-primary/60" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 bg-luxury-secondary border border-emerald-luxury/30 rounded-lg text-platinum placeholder-platinum/40 focus:ring-2 focus:ring-emerald-luxury/60 focus:border-transparent outline-none transition-all duration-300"
                  placeholder="Enter your full name"
                  required={isSignUp}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-platinum mb-2 luxury-serif">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gold-primary/60" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 bg-luxury-secondary border border-emerald-luxury/30 rounded-lg text-platinum placeholder-platinum/40 focus:ring-2 focus:ring-emerald-luxury/60 focus:border-transparent outline-none transition-all duration-300"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-platinum mb-2 luxury-serif">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gold-primary/60" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 bg-luxury-secondary border border-emerald-luxury/30 rounded-lg text-platinum placeholder-platinum/40 focus:ring-2 focus:ring-emerald-luxury/60 focus:border-transparent outline-none transition-all duration-300"
                placeholder="Enter your password"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full btn-premium-gold text-luxury-dark py-3 px-6 rounded-lg font-medium hover:shadow-glow transition-all duration-300"
          >
            {isSignUp ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-platinum/70">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="ml-2 text-gold-primary hover:text-gold-highlight font-medium transition-colors duration-300"
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignInModal;
