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
        dispatch({ type: 'SET_USER', payload: { id: data.user.id, email: data.user.email, name: data.user.name, isAdmin: data.user.isAdmin } });
        dispatch({ type: 'TOGGLE_SIGNIN', payload: false });
        setFormData({ name: '', email: '', password: '' });
      } catch {
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
    <div className="fixed inset-0 bg-primary-red/10 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white border-2 border-gold-primary/30 rounded-3xl p-10 max-w-md w-full shadow-2xl relative overflow-hidden group">
        
        {/* Decorative corner element */}
        <div className="absolute -top-12 -right-12 w-24 h-24 bg-primary-red/5 rounded-full blur-2xl group-hover:bg-primary-red/10 transition-colors duration-700" />

        <div className="flex items-center justify-between mb-10">
          <div className="text-left">
            <h2 className="text-3xl font-bold text-text-primary luxury-serif tracking-tight">
              {isSignUp ? 'Join the Legacy' : 'Welcome Back'}
            </h2>
            <p className="text-text-secondary text-xs font-light italic mt-1">
              {isSignUp ? 'Experience the pinnacle of luxury' : 'Access your private collection'}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="w-10 h-10 rounded-full border border-gold-primary/20 flex items-center justify-center text-text-primary hover:bg-primary-red hover:text-white transition-all duration-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {isSignUp && (
            <div className="animate-fade-in">
              <label className="block text-[10px] font-bold text-text-muted mb-2 tracking-[0.2em] luxury-serif uppercase">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gold-primary" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-6 py-4 bg-luxury-dark border border-gold-primary/20 rounded-full text-text-primary placeholder:text-text-muted outline-none transition-all duration-300 focus:border-primary-red"
                  placeholder="E.g. John Doe"
                  required={isSignUp}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[10px] font-bold text-text-muted mb-2 tracking-[0.2em] luxury-serif uppercase">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gold-primary" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full pl-12 pr-6 py-4 bg-luxury-dark border border-gold-primary/20 rounded-full text-text-primary placeholder:text-text-muted outline-none transition-all duration-300 focus:border-primary-red"
                placeholder="email@example.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-text-muted mb-2 tracking-[0.2em] luxury-serif uppercase">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gold-primary" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full pl-12 pr-6 py-4 bg-luxury-dark border border-gold-primary/20 rounded-full text-text-primary placeholder:text-text-muted outline-none transition-all duration-300 focus:border-primary-red"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-primary-red text-white py-4 rounded-full font-bold luxury-serif tracking-[0.3em] text-xs hover:bg-text-primary transition-all duration-300 shadow-lg hover:shadow-primary-red/20 transform hover:-translate-y-0.5"
          >
            {isSignUp ? 'CREATE ACCOUNT' : 'SIGN IN'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-xs text-text-secondary font-light">
            {isSignUp ? 'PREVIOUSLY REGISTERED?' : "FIRST VISIT?"}
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="ml-3 text-primary-red hover:text-gold-primary font-bold transition-colors duration-300 luxury-serif tracking-widest text-[10px]"
            >
              {isSignUp ? 'SIGN IN' : 'CREATE ACCOUNT'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignInModal;
