import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: string;
  keywords?: string;
}

export const useSEO = (props: SEOProps) => {
  useEffect(() => {
    // Update title
    document.title = props.title;
    
    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', props.description);
    
    // Update meta keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords && props.keywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    if (metaKeywords && props.keywords) {
      metaKeywords.setAttribute('content', props.keywords);
    }
    
    // Update Open Graph meta tags
    const updateOGTag = (property: string, content: string) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('property', property);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };
    
    updateOGTag('og:title', props.title);
    updateOGTag('og:description', props.description);
    if (props.image) updateOGTag('og:image', props.image);
    if (props.url) updateOGTag('og:url', props.url);
    if (props.type) updateOGTag('og:type', props.type);
    
    // Update Twitter meta tags
    const updateTwitterTag = (name: string, content: string) => {
      let tag = document.querySelector(`meta[name="${name}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('name', name);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };
    
    updateTwitterTag('twitter:title', props.title);
    updateTwitterTag('twitter:description', props.description);
    if (props.image) updateTwitterTag('twitter:image', props.image);
    
    // Update canonical URL
    const canonicalUrl = props.url || window.location.href;
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', canonicalUrl);
    
    // Scroll to top on component mount
    window.scrollTo(0, 0);
  }, [props.title, props.description, props.image, props.url, props.type, props.keywords]);
};
