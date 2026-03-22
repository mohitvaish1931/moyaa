import React from 'react';
import { useSEO } from '../utils/useSEO';

const AboutUs = () => {
  useSEO({
    title: 'About Us - MORAA JEWELS',
    description: 'Discover the story of MORAA JEWELS. Our heritage, craftsmanship, and commitment to luxury jewelry.',
    keywords: 'about us, brand story, jewelry heritage, craftsmanship, MORAA JEWELS',
    url: 'https://moraajewles.com/about-us',
    type: 'website'
  });

  return (
    <div className="min-h-screen bg-luxury-dark py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 text-center">
          <h1 className="luxury-serif text-5xl md:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-gold-primary to-rose-gold mb-6">
            Our Story
          </h1>
          <p className="text-text-secondary text-lg italic luxury-serif">
            "Timeless elegance, modern craftsmanship."
          </p>
        </div>

        {/* Content */}
        <div className="prose max-w-none text-text-primary space-y-12">
          {/* Heritage Section */}
          <section className="bg-white/50 p-8 rounded-2xl border border-gold-primary/30 backdrop-blur-sm shadow-sm">
            <h2 className="luxury-serif text-3xl text-primary-red mb-6 uppercase tracking-wider">The Legacy of MORAA</h2>
            <p className="leading-relaxed text-text-secondary font-medium">
              Founded on the principles of exquisite artistry and uncompromising quality, MORAA JEWELS has emerged as a beacon of luxury in the world of high jewelry. Our journey began with a simple vision: to create pieces that don't just adorn, but tell a story of heritage and sophistication.
            </p>
            <p className="mt-4 leading-relaxed text-text-secondary font-medium">
              Every piece in our collection is a testament to the skill of our master artisans, who blend traditional techniques passed down through generations with contemporary design sensibilities.
            </p>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center py-12">
            <div>
              <h2 className="luxury-serif text-3xl text-primary-red mb-6 uppercase tracking-wider">Meticulous Craftsmanship</h2>
              <p className="leading-relaxed text-text-secondary font-medium">
                We believe that true luxury lies in the details. From the initial hand-drawn sketch to the final polish, each creation undergoes a rigorous process of quality control.
              </p>
              <ul className="mt-6 space-y-3">
                <li className="flex items-center gap-3">
                  <span className="text-primary-red">✦</span>
                  <span className="text-text-primary font-bold">Hand-selected precious stones</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-gold-primary">✦</span>
                  <span className="text-text-primary font-bold">Conflict-free diamonds and ethically sourced metals</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-primary-red">✦</span>
                  <span className="text-text-primary font-bold">Intricate settings that maximize brilliance</span>
                </li>
              </ul>
            </div>
            <div className="aspect-square rounded-2xl overflow-hidden border border-gold-primary/30 shadow-glow-gold">
               <img 
                src="https://images.unsplash.com/photo-1573408302355-08e1687f8776?auto=format&fit=crop&q=80&w=800" 
                alt="Craftsmanship" 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
            </div>
          </section>

          <section className="text-center py-12 border-y border-gold-primary/20">
            <h2 className="luxury-serif text-3xl text-primary-red mb-6 uppercase tracking-wider">Our Mission</h2>
            <p className="text-xl text-text-primary max-w-2xl mx-auto leading-relaxed italic luxury-serif">
              To inspire moments of happiness and celebration by providing exceptional jewelry that resonates with the unique personality of every wearer.
            </p>
          </section>

          {/* Founder Section */}
          <section className="flex flex-col md:flex-row gap-12 items-center">
             <div className="w-48 h-48 rounded-full overflow-hidden border-2 border-gold-primary p-2">
               <div className="w-full h-full rounded-full overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&q=80&w=400" 
                  alt="Founder" 
                  className="w-full h-full object-cover"
                />
               </div>
            </div>
            <div className="flex-1">
              <h2 className="luxury-serif text-3xl text-primary-red mb-4 uppercase tracking-wider">A Note from the Founder</h2>
              <p className="italic text-text-secondary leading-relaxed mb-4 text-lg">
                "Jewelry is more than just an accessory; it's a reflection of one's journey and achievements. At MORAA JEWELS, we are honored to be a part of your smallest joys and biggest milestones."
              </p>
              <p className="font-bold text-text-primary uppercase tracking-widest text-sm">— Trivani, Creative Director</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
