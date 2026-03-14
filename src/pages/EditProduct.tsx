import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { API_ENDPOINTS } from '../utils/api';

const EditProduct = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state, dispatch } = useAppContext();
  
  const [form, setForm] = useState<any>({
    name: '',
    category: '',
    price: 0,
    originalPrice: '',
    description: '',
    soldOut: false,
    images: [],
    videos: []
  });
  
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [videoFiles, setVideoFiles] = useState<File[]>([]);
  const [videoUrls, setVideoUrls] = useState<string[]>(['', '']);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // Find product in state
    const product = state.products.find(p => (p as any)._id === id || String(p.id) === id);
    if (product) {
      const productAny = product as any;
      // Convert soldOut to boolean - handle both boolean and string values
      let soldOutValue = false;
      if (productAny.soldOut !== undefined && productAny.soldOut !== null) {
        if (typeof productAny.soldOut === 'string') {
          soldOutValue = productAny.soldOut === 'true';
        } else {
          soldOutValue = !!productAny.soldOut;
        }
      }
      
      setForm({
        id: product.id || productAny._id,
        name: product.name || '',
        category: product.category || '',
        price: product.price || 0,
        originalPrice: product.originalPrice || '',
        description: product.description || '',
        soldOut: soldOutValue,
        images: product.images || [],
        videos: productAny.videos || []
      });
      setVideoUrls((productAny.videos && productAny.videos.length > 0) ? productAny.videos : ['', '']);
      console.log('Loaded product:', { name: product.name, soldOut: soldOutValue, original: productAny.soldOut });
    }
  }, [id, state.products]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImageFiles(files);
    const previews = files.map(file => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setVideoFiles(files);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const fd = new FormData();
      
      // Add form fields
      Object.keys(form).forEach(k => {
        if (form[k] !== undefined && form[k] !== null && k !== 'images' && k !== 'image' && k !== 'videos') {
          fd.append(k, form[k]);
        }
      });
      
      // Handle video files
      videoFiles.forEach((file) => {
        fd.append('videos_file', file);
      });
      
      // Handle videos (URLs and file placeholders)
      let finalVideos: string[] = [];
      if (videoUrls && videoUrls.length > 0) {
        finalVideos = videoUrls.filter(url => url && url.trim());
      }
      if (videoFiles.length > 0) {
        finalVideos = [...finalVideos, ...videoFiles.map((_, i) => `__file_${i}__`)];
      }
      if (finalVideos.length > 0) {
        fd.append('videos', JSON.stringify(finalVideos));
      }
      
      // Handle image upload if new images were selected
      if (imageFiles.length > 0) {
        imageFiles.forEach(file => {
          fd.append('image', file);
        });
      }
      
      const url = `${API_ENDPOINTS.PRODUCTS}/${form.id}`;
      const res = await fetch(url, { method: 'PUT', body: fd });
      
      if (!res.ok) throw new Error('Update failed');
      
      const updated = await res.json();
      dispatch({ type: 'UPDATE_PRODUCT', payload: updated });
      setSuccess('✅ Product updated successfully!');
      
      setTimeout(() => {
        navigate('/admin');
      }, 1500);
    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : 'Failed to update product');
      
      // Fallback: update locally
      const updated = {
        ...form,
        id: form.id,
        name: form.name,
        category: form.category,
        price: Number(form.price) || 0,
        originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
        description: form.description || '',
        soldOut: !!form.soldOut,
      };
      dispatch({ type: 'UPDATE_PRODUCT', payload: updated });
      setSuccess('✅ Product updated locally!');
      
      setTimeout(() => {
        navigate('/admin');
      }, 1500);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-luxury-dark py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/admin')}
            className="flex items-center space-x-2 text-gold-primary hover:text-rose-gold transition-colors mb-4"
          >
            <ChevronLeft className="h-5 w-5" />
            <span>Back to Admin</span>
          </button>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold-primary to-rose-gold">
            Edit Product
          </h1>
          <p className="text-platinum/70 mt-2">{form.name || 'Loading...'}</p>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-emerald-luxury/20 border border-emerald-luxury/50 rounded-lg text-emerald-luxury">
            {success}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="glass-card-sapphire border border-sapphire-luxury/40 p-8 rounded-lg shadow-glow-sapphire space-y-6">
          
          {/* Basic Info */}
          <div>
            <h3 className="text-lg font-bold text-platinum mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-platinum mb-2">Product Name</label>
                <input
                  type="text"
                  value={form.name || ''}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 bg-luxury-secondary border border-sapphire-luxury/30 rounded text-platinum placeholder-platinum/40 focus:ring-2 focus:ring-sapphire-luxury/60 outline-none"
                  placeholder="Product name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-platinum mb-2">Category</label>
                <select
                  value={form.category || ''}
                  onChange={e => setForm({ ...form, category: e.target.value })}
                  className="w-full px-3 py-2 bg-luxury-secondary border border-sapphire-luxury/30 rounded text-platinum focus:ring-2 focus:ring-sapphire-luxury/60 outline-none"
                >
                  <option value="">Select category</option>
                  <option value="earrings">Earrings</option>
                  <option value="bracelets">Bracelets</option>
                  <option value="necklaces">Necklaces</option>
                </select>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div>
            <h3 className="text-lg font-bold text-platinum mb-4">Pricing</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-platinum mb-2">Current Price (₹)</label>
                <input
                  type="number"
                  value={form.price || 0}
                  onChange={e => setForm({ ...form, price: e.target.value })}
                  className="w-full px-3 py-2 bg-luxury-secondary border border-sapphire-luxury/30 rounded text-platinum placeholder-platinum/40 focus:ring-2 focus:ring-sapphire-luxury/60 outline-none"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-platinum mb-2">Original Price (₹)</label>
                <input
                  type="number"
                  value={form.originalPrice || ''}
                  onChange={e => setForm({ ...form, originalPrice: e.target.value })}
                  className="w-full px-3 py-2 bg-luxury-secondary border border-sapphire-luxury/30 rounded text-platinum placeholder-platinum/40 focus:ring-2 focus:ring-sapphire-luxury/60 outline-none"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-platinum mb-2">Description</label>
            <textarea
              value={form.description || ''}
              onChange={e => setForm({ ...form, description: e.target.value })}
              rows={5}
              className="w-full px-3 py-2 bg-luxury-secondary border border-sapphire-luxury/30 rounded text-platinum placeholder-platinum/40 focus:ring-2 focus:ring-sapphire-luxury/60 outline-none"
              placeholder="Product description"
            />
          </div>

          {/* Images */}
          <div>
            <h3 className="text-lg font-bold text-platinum mb-4">Images</h3>
            {form.images && form.images.length > 0 && (
              <div className="mb-4">
                <p className="text-sm text-platinum/70 mb-2">Current Images:</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {form.images.map((img: string, idx: number) => (
                    <img key={idx} src={img} alt={`Current ${idx + 1}`} className="w-24 h-24 object-cover rounded border border-sapphire-luxury/40" />
                  ))}
                </div>
              </div>
            )}
            <label className="block text-sm font-medium text-platinum mb-2">Upload New Images (Multiple)</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-3 py-2 bg-luxury-secondary border border-sapphire-luxury/30 rounded text-platinum placeholder-platinum/40 focus:ring-2 focus:ring-sapphire-luxury/60 outline-none"
            />
            {previewImages.length > 0 && (
              <div className="mt-3">
                <p className="text-sm text-platinum/70 mb-2">New Images ({previewImages.length}):</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {previewImages.map((preview, idx) => (
                    <img key={idx} src={preview} alt={`Preview ${idx + 1}`} className="w-24 h-24 object-cover rounded border border-emerald-luxury/40" />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Videos */}
          <div>
            <h3 className="text-lg font-bold text-platinum mb-4">Videos</h3>
            {form.videos && form.videos.length > 0 && (
              <div className="mb-4">
                <p className="text-sm text-platinum/80 mb-2">Current Videos:</p>
                <div className="space-y-1">
                  {form.videos.map((vid: string, idx: number) => (
                    <p key={idx} className="text-xs text-gold-primary">✓ {vid.substring(0, 70)}...</p>
                  ))}
                </div>
              </div>
            )}
            <div className="mb-4">
              <label className="block text-sm font-medium text-platinum mb-2">Upload Video Files</label>
              <input
                type="file"
                multiple
                accept="video/*"
                onChange={handleVideoChange}
                className="w-full px-3 py-2 bg-luxury-secondary border border-sapphire-luxury/30 rounded text-platinum placeholder-platinum/40 focus:ring-2 focus:ring-sapphire-luxury/60 outline-none"
              />
              {videoFiles.length > 0 && (
                <div className="mt-2 space-y-1">
                  {videoFiles.map((file, idx) => (
                    <p key={idx} className="text-xs text-gold-primary">✓ {file.name}</p>
                  ))}
                </div>
              )}
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-platinum mb-2">Or Add Video URLs</label>
              <input
                type="text"
                placeholder="Video 1 URL (YouTube, Vimeo, or MP4 link)"
                value={videoUrls[0] || ''}
                onChange={(e) => {
                  const newUrls = [...videoUrls];
                  newUrls[0] = e.target.value;
                  setVideoUrls(newUrls);
                }}
                className="w-full px-3 py-2 bg-luxury-secondary border border-sapphire-luxury/30 rounded text-platinum placeholder-platinum/40 focus:ring-2 focus:ring-sapphire-luxury/60 outline-none"
              />
              <input
                type="text"
                placeholder="Video 2 URL (optional)"
                value={videoUrls[1] || ''}
                onChange={(e) => {
                  const newUrls = [...videoUrls];
                  newUrls[1] = e.target.value;
                  setVideoUrls(newUrls);
                }}
                className="w-full px-3 py-2 bg-luxury-secondary border border-sapphire-luxury/30 rounded text-platinum placeholder-platinum/40 focus:ring-2 focus:ring-sapphire-luxury/60 outline-none"
              />
            </div>
          </div>

          {/* Availability */}
          <div>
            <h3 className="text-lg font-bold text-platinum mb-4">Availability</h3>
            <div className="flex items-center space-x-6">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="availability"
                  checked={!form.soldOut}
                  onChange={(e) => {
                    if (e.target.checked) {
                      console.log('Toggled to In Stock');
                      setForm({ ...form, soldOut: false });
                    }
                  }}
                  className="w-5 h-5 accent-emerald-luxury cursor-pointer"
                />
                <span className="text-lg text-emerald-luxury font-semibold">✓ In Stock</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="availability"
                  checked={!!form.soldOut}
                  onChange={(e) => {
                    if (e.target.checked) {
                      console.log('Toggled to Out of Stock');
                      setForm({ ...form, soldOut: true });
                    }
                  }}
                  className="w-5 h-5 accent-ruby-luxury cursor-pointer"
                />
                <span className="text-lg text-ruby-luxury font-semibold">✗ Out of Stock</span>
              </label>
            </div>
            <p className="text-xs text-platinum/50 mt-2">Current state: {form.soldOut ? 'Out of Stock' : 'In Stock'}</p>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-4 pt-6">
            <button
              type="button"
              onClick={() => navigate('/admin')}
              className="px-6 py-2 bg-luxury-secondary text-platinum rounded border border-sapphire-luxury/30 hover:shadow-glow-sapphire transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 btn-premium-gold text-luxury-dark rounded hover:shadow-glow-gold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '⏳ Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;
