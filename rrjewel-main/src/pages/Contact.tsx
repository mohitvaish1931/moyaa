import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    // Reset form
    setFormData({ name: '', email: '', subject: '', message: '' });
    alert('Thank you for your message! We will get back to you soon.');
  };

  return (
    <div className="min-h-screen bg-luxury-dark">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-gold-primary/20 via-ruby-luxury/10 to-gold-primary/20 py-16 shadow-[inset_0_1px_0_rgba(255,215,0,0.1)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold-primary to-rose-gold mb-6 luxury-serif">CONTACT US</h1>
          <p className="text-xl text-platinum/80 leading-relaxed">
            We'd love to hear from you. Get in touch with our team for any questions, 
            custom orders, or jewelry consultations.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-gold-primary mb-6 luxury-serif">Get In Touch</h2>
              <p className="text-platinum/70 text-lg leading-relaxed mb-8">
                Whether you have questions about our jewelry collection, need assistance with an order, 
                or want to discuss custom designs, our team is here to help. Reach out to us through 
                any of the channels below.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start space-x-4 group">
                <div className="bg-gradient-to-r from-gold-primary to-rose-gold p-3 rounded-lg shadow-glow-gold">
                  <Mail className="h-6 w-6 text-luxury-dark" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gold-primary mb-1">Email Us</h3>
                  <p className="text-platinum/70">radiantreflection.customercare@gmail.com</p>
                  <p className="text-platinum/70">support@radiantreflection.com</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 group">
                <div className="bg-gradient-to-r from-emerald-luxury to-sapphire-luxury p-3 rounded-lg shadow-glow-emerald">
                  <Phone className="h-6 w-6 text-platinum" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-emerald-luxury mb-1">Call Us</h3>
                  <p className="text-platinum/70">+91 98765 43210</p>
                  <p className="text-platinum/70">+91 87654 32109</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 group">
                <div className="bg-gradient-to-r from-ruby-luxury to-amethyst-luxury p-3 rounded-lg shadow-glow-ruby">
                  <MapPin className="h-6 w-6 text-platinum" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-ruby-luxury mb-1">Visit Our Store</h3>
                  <p className="text-platinum/70">
                    123 Jewelry District<br />
                    Mumbai, Maharashtra 400001<br />
                    India
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 group">
                <div className="bg-gradient-to-r from-sapphire-luxury to-gold-primary p-3 rounded-lg shadow-glow-sapphire">
                  <Clock className="h-6 w-6 text-platinum" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-sapphire-luxury mb-1">Business Hours</h3>
                  <p className="text-platinum/70">
                    Monday - Saturday: 10:00 AM - 8:00 PM<br />
                    Sunday: 11:00 AM - 6:00 PM
                  </p>
                </div>
              </div>
            </div>

            {/* Services */}
            <div className="glass-card-emerald border border-emerald-luxury/40 p-6 rounded-lg shadow-glow-emerald">
              <h3 className="text-xl font-bold text-gold-primary mb-4 luxury-serif">Our Services</h3>
              <ul className="space-y-2 text-platinum/80">
                <li className="flex items-center space-x-2">
                  <span className="text-gold-primary">✨</span>
                  <span>Custom Jewelry Design</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-emerald-luxury">✨</span>
                  <span>Jewelry Repair & Maintenance</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-ruby-luxury">✨</span>
                  <span>Personal Shopping Consultation</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-sapphire-luxury">✨</span>
                  <span>Gift Wrapping Services</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-gold-primary">✨</span>
                  <span>Jewelry Authentication</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact Form */}
          <div className="glass-card-sapphire border border-sapphire-luxury/40 p-8 rounded-lg shadow-glow-sapphire">
            <h2 className="text-2xl font-bold text-gold-primary mb-6 luxury-serif">Send Us a Message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-platinum mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-luxury-secondary border border-sapphire-luxury/30 rounded-lg text-platinum placeholder-platinum/40 focus:ring-2 focus:ring-sapphire-luxury/60 focus:border-transparent outline-none transition-all duration-300"
                    placeholder="Your full name"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-platinum mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-luxury-secondary border border-sapphire-luxury/30 rounded-lg text-platinum placeholder-platinum/40 focus:ring-2 focus:ring-sapphire-luxury/60 focus:border-transparent outline-none transition-all duration-300"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-platinum mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-luxury-secondary border border-sapphire-luxury/30 rounded-lg text-platinum placeholder-platinum/40 focus:ring-2 focus:ring-sapphire-luxury/60 focus:border-transparent outline-none transition-all duration-300"
                  placeholder="What is this regarding?"
                  required
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-platinum mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={6}
                  className="w-full px-4 py-3 bg-luxury-secondary border border-sapphire-luxury/30 rounded-lg text-platinum placeholder-platinum/40 focus:ring-2 focus:ring-sapphire-luxury/60 focus:border-transparent outline-none resize-none transition-all duration-300"
                  placeholder="Tell us how we can help you..."
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full btn-premium-gold text-luxury-dark py-3 px-6 rounded-lg font-medium hover:shadow-glow transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <Send className="h-5 w-5" />
                <span>Send Message</span>
              </button>
            </form>

            <div className="mt-6 p-4 glass-card-ruby border border-ruby-luxury/30 rounded-lg shadow-glow-ruby">
              <p className="text-sm text-platinum">
                <strong>Response Time:</strong> We typically respond to all inquiries within 24 hours during business days.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;