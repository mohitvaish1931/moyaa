import React, { useState } from 'react';
import { Plus, Edit, Trash2, Eye, Package, Users, ShoppingBag, TrendingUp } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { API_ENDPOINTS } from '../utils/api';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const { state, dispatch } = useAppContext();
  const [editProduct, setEditProduct] = useState<any>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const stats = [
    { name: 'Total Products', value: state.products.length, icon: Package, color: 'bg-blue-500' },
    { name: 'Total Orders', value: '0', icon: ShoppingBag, color: 'bg-green-500' },
    { name: 'Total Customers', value: '0', icon: Users, color: 'bg-purple-500' },
    { name: 'Revenue', value: '₹0', icon: TrendingUp, color: 'bg-brand' },
  ];

  const recentOrders: any[] = [];

  const ProductForm = () => {
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [previewImages, setPreviewImages] = useState<string[]>([]);
    const [videoFiles, setVideoFiles] = useState<File[]>([]);
    const [videoUrls, setVideoUrls] = useState<string[]>(['', '']);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      setImageFiles(files);
      const previews = files.map(file => URL.createObjectURL(file));
      setPreviewImages(previews);
      setError('');
    };

    const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      setVideoFiles(files);
    };

    return (
      <div className="glass-card-sapphire border border-sapphire-luxury/40 p-6 rounded-lg shadow-glow-sapphire">
        <h3 className="text-lg font-bold text-platinum mb-4">Add New Product</h3>
        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm">
            {error}
          </div>
        )}
        <form className="space-y-4" onSubmit={async (e) => {
          e.preventDefault();
          setIsLoading(true);
          setError('');
          
          const form = e.target as HTMLFormElement;
          const fd = new FormData(form);
          
          // Remove default image field from FormData
          fd.delete('image');
          
          // Explicitly append image files from state
          imageFiles.forEach((file) => {
            fd.append('image', file);
          });
          
          // Handle video files
          videoFiles.forEach((file) => {
            fd.append('videos_file', file);
          });
          
          // Collect video URLs (only non-empty ones)
          const validUrls = videoUrls.filter(url => url.trim());
          if (validUrls.length > 0 || videoFiles.length > 0) {
            const finalVideos = [...validUrls, ...videoFiles.map((_, i) => `__file_${i}__`)];
            fd.append('videos', JSON.stringify(finalVideos));
          }
          
          try {
            const res = await fetch(API_ENDPOINTS.PRODUCTS, { method: 'POST', body: fd });
            if (!res.ok) {
              let message = 'Create failed';
              try {
                const payload = await res.json();
                message = payload?.error || payload?.message || message;
              } catch {
                // Keep fallback message if response is not JSON
              }
              throw new Error(message);
            }
            const created = await res.json();
            dispatch({ type: 'ADD_PRODUCT', payload: created });
            alert('✅ Product added successfully!');
          } catch (err) {
            console.error('API error:', err);
            const message = err instanceof Error ? err.message : 'Failed to add product';
            alert(`❌ Error adding product: ${message}`);
            setError(message);
          } finally {
            setIsLoading(false);
          }
          setShowAddProduct(false);
          setImageFiles([]);
          setPreviewImages([]);
          setVideoFiles([]);
          setVideoUrls(['', '']);
        }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="product-name" className="block text-sm font-medium text-platinum mb-2">Product Name</label>
              <input
                id="product-name"
                name="name"
                type="text"
                autoComplete="off"
                className="w-full px-3 py-2 bg-luxury-secondary border border-sapphire-luxury/30 rounded-lg text-platinum placeholder-platinum/40 focus:ring-2 focus:ring-sapphire-luxury/60 focus:border-transparent outline-none"
                placeholder="Enter product name"
              />
            </div>
            <div>
              <label htmlFor="product-category" className="block text-sm font-medium text-platinum mb-2">Category</label>
              <select id="product-category" name="category" className="w-full px-3 py-2 bg-luxury-secondary border border-sapphire-luxury/30 rounded-lg text-platinum focus:ring-2 focus:ring-sapphire-luxury/60 focus:border-transparent outline-none">
                <option value="">Select category</option>
                <option value="earrings">Earrings</option>
                <option value="bracelets">Bracelets</option>
                <option value="necklaces">Necklaces</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="product-price" className="block text-sm font-medium text-platinum mb-2">Price (₹)</label>
              <input
                id="product-price"
                name="price"
                type="number"
                autoComplete="off"
                className="w-full px-3 py-2 bg-luxury-secondary border border-sapphire-luxury/30 rounded-lg text-platinum placeholder-platinum/40 focus:ring-2 focus:ring-sapphire-luxury/60 focus:border-transparent outline-none"
                placeholder="0"
              />
            </div>
            <div>
              <label htmlFor="product-original-price" className="block text-sm font-medium text-platinum mb-2">Original Price (₹)</label>
              <input
                id="product-original-price"
                name="originalPrice"
                type="number"
                autoComplete="off"
                className="w-full px-3 py-2 bg-luxury-secondary border border-sapphire-luxury/30 rounded-lg text-platinum placeholder-platinum/40 focus:ring-2 focus:ring-sapphire-luxury/60 focus:border-transparent outline-none"
                placeholder="0"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-platinum mb-2">Description</label>
            <textarea
              name="description"
              rows={4}
              className="w-full px-3 py-2 bg-luxury-secondary border border-sapphire-luxury/30 rounded-lg text-platinum placeholder-platinum/40 focus:ring-2 focus:ring-sapphire-luxury/60 focus:border-transparent outline-none"
              placeholder="Enter product description"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-platinum mb-2">Product Images (Multiple)</label>
            <input
              name="image"
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-3 py-2 bg-luxury-secondary border border-sapphire-luxury/30 rounded-lg text-platinum placeholder-platinum/40 focus:ring-2 focus:ring-sapphire-luxury/60 focus:border-transparent outline-none"
            />
            {previewImages.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-platinum/70 mb-2">Selected images ({previewImages.length}):</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {previewImages.map((preview, idx) => (
                    <img key={idx} src={preview} alt={`Preview ${idx + 1}`} className="w-20 h-20 object-cover rounded border border-sapphire-luxury/40" />
                  ))}
                </div>
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-platinum mb-2">Product Videos (Max 2 - Upload or URLs)</label>
            <p className="text-xs text-platinum/60 mb-3">You can upload video files (MP4, WebM) OR paste URLs (YouTube, Vimeo, or direct video links)</p>
            
            {/* Video File Upload */}
            <div className="mb-4">
              <label className="block text-sm text-platinum/80 mb-2">Upload Video Files</label>
              <input
                type="file"
                multiple
                accept="video/*"
                onChange={handleVideoChange}
                className="w-full px-3 py-2 bg-luxury-secondary border border-sapphire-luxury/30 rounded-lg text-platinum placeholder-platinum/40 focus:ring-2 focus:ring-sapphire-luxury/60 focus:border-transparent outline-none"
              />
              {videoFiles.length > 0 && (
                <div className="mt-2 space-y-1">
                  {videoFiles.map((file, idx) => (
                    <p key={idx} className="text-xs text-gold-primary">✓ {file.name}</p>
                  ))}
                </div>
              )}
            </div>

            {/* Video URLs */}
            <div className="space-y-2">
              <label className="block text-sm text-platinum/80">Or Add Video URLs</label>
              <input
                type="text"
                placeholder="Video 1 URL (YouTube, Vimeo, or MP4 link)"
                value={videoUrls[0]}
                onChange={(e) => {
                  const newUrls = [...videoUrls];
                  newUrls[0] = e.target.value;
                  setVideoUrls(newUrls);
                }}
                className="w-full px-3 py-2 bg-luxury-secondary border border-sapphire-luxury/30 rounded-lg text-platinum placeholder-platinum/40 focus:ring-2 focus:ring-sapphire-luxury/60 focus:border-transparent outline-none"
              />
              <input
                type="text"
                placeholder="Video 2 URL (optional)"
                value={videoUrls[1]}
                onChange={(e) => {
                  const newUrls = [...videoUrls];
                  newUrls[1] = e.target.value;
                  setVideoUrls(newUrls);
                }}
                className="w-full px-3 py-2 bg-luxury-secondary border border-sapphire-luxury/30 rounded-lg text-platinum placeholder-platinum/40 focus:ring-2 focus:ring-sapphire-luxury/60 focus:border-transparent outline-none"
              />
            </div>
          </div>
          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={isLoading}
              className="btn-premium-gold text-luxury-dark px-6 py-2 rounded-lg hover:shadow-glow-gold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '⏳ Adding...' : 'Add Product'}
            </button>
            <button
              type="button"
              disabled={isLoading}
              onClick={() => { 
                setShowAddProduct(false); 
                setImageFiles([]);
                setPreviewImages([]); 
                setVideoFiles([]); 
                setVideoUrls(['', '']); 
                setError('');
              }}
              className="bg-luxury-secondary text-platinum px-6 py-2 rounded-lg border border-sapphire-luxury/30 hover:shadow-glow-sapphire transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  };

  const VideoManager: React.FC = () => {
    const [title, setTitle] = useState('');
    const [url, setUrl] = useState('');

    const addVideo = () => {
      if (!url) return;
      (async () => {
        try {
          const res = await fetch(API_ENDPOINTS.VIDEOS, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: title || 'Video', url }) });
          if (!res.ok) throw new Error('Video add failed');
          const v = await res.json();
          dispatch({ type: 'SET_VIDEOS', payload: [v, ...state.videos] });
        } catch (e) {
          const id = Date.now().toString();
          dispatch({ type: 'ADD_VIDEO', payload: { id, title: title || 'Video', url } });
        }
        setTitle('');
        setUrl('');
      })();
    };

    return (
      <div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="p-2 bg-luxury-secondary border border-emerald-luxury/30 rounded text-platinum placeholder-platinum/40 focus:ring-2 focus:ring-emerald-luxury/60 outline-none"
          />
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Video URL"
            className="p-2 bg-luxury-secondary border border-emerald-luxury/30 rounded text-platinum placeholder-platinum/40 focus:ring-2 focus:ring-emerald-luxury/60 outline-none"
          />
          <button
            onClick={addVideo}
            className="btn-premium-gold text-luxury-dark px-4 rounded hover:shadow-glow-gold transition-all"
          >
            Add Video
          </button>
        </div>
        <div className="space-y-2">
          {state.videos.map((v, i) => (
            <div key={(v as any)._id || v.id || i} className="flex justify-between items-center p-2 bg-luxury-secondary border border-emerald-luxury/20 rounded">
              <div>
                <div className="font-medium text-platinum">{v.title}</div>
                <div className="text-sm text-platinum/60 truncate max-w-md">{v.url}</div>
              </div>
              <div className="flex space-x-2">
                <a href={v.url} target="_blank" rel="noreferrer" className="text-gold-primary hover:text-rose-gold transition-colors">Open</a>
                <button
                  onClick={async () => {
                    try {
                      const videoAny = v as any;
                      const res = await fetch(`${API_ENDPOINTS.VIDEOS}/${videoAny._id || v.id}`, { method: 'DELETE' });
                      if (!res.ok) throw new Error('Delete failed');
                      dispatch({ type: 'SET_VIDEOS', payload: state.videos.filter(x => x.id !== v.id && (x as any)._id !== videoAny._id) });
                    } catch (e) {
                      dispatch({ type: 'REMOVE_VIDEO', payload: v.id });
                    }
                  }}
                  className="text-ruby-luxury hover:text-rose-gold transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const EditProductModal: React.FC = () => {
    const [form, setForm] = useState<any>(editProduct || {});
    const [previewImages, setPreviewImages] = useState<string[]>([]);
    const [videoFiles, setVideoFiles] = useState<File[]>([]);
    const [videoUrls, setVideoUrls] = useState<string[]>([]);

    React.useEffect(() => {
      setForm(editProduct || {});
      setPreviewImages([]);
      setVideoFiles([]);
      setVideoUrls((editProduct?.videos && editProduct.videos.length > 0) ? editProduct.videos : ['', '']);
    }, [editProduct]);

    if (!showEditModal || !form) return null;

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      const previews = files.map(file => URL.createObjectURL(file));
      setPreviewImages(previews);
    };

    const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      setVideoFiles(files);
    };

    const submit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        const fd = new FormData();
        // include fields from form state
        Object.keys(form).forEach(k => {
          if (form[k] !== undefined && form[k] !== null && k !== 'images' && k !== 'image' && k !== 'videos') fd.append(k, form[k]);
        });
        
        // Handle video files
        videoFiles.forEach((file) => {
          fd.append('videos_file', file);
        });
        
        // Handle videos (URLs and file placeholders)
        let finalVideos = [];
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
        const fileInput = (e.target as HTMLFormElement).querySelector('input[type="file"]') as HTMLInputElement;
        if (fileInput?.files?.length) {
          Array.from(fileInput.files).forEach(file => {
            fd.append('image', file);
          });
        }
        
        const url = `${API_ENDPOINTS.PRODUCTS}/${form.id}`;
        const res = await fetch(url, { method: 'PUT', body: fd });
        if (!res.ok) throw new Error('Update failed');
        const updated = await res.json();
        dispatch({ type: 'UPDATE_PRODUCT', payload: updated });
      } catch (err) {
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
      }
      setShowEditModal(false);
      setEditProduct(null);
      setPreviewImages([]);
    };

    return (
      <div className="fixed inset-0 bg-luxury-dark/80 backdrop-blur-sm flex items-center justify-center z-50 overflow-y-auto">
        <div className="glass-card-sapphire border border-sapphire-luxury/40 rounded-lg p-6 w-full max-w-2xl shadow-glow-sapphire my-8">
          <h3 className="text-lg font-bold text-platinum mb-4">Edit Product</h3>
          <form onSubmit={submit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                className="p-2 bg-luxury-secondary border border-sapphire-luxury/30 rounded text-platinum placeholder-platinum/40 focus:ring-2 focus:ring-sapphire-luxury/60 outline-none"
                value={form.name || ''}
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="Product name"
              />
              <select
                className="p-2 bg-luxury-secondary border border-sapphire-luxury/30 rounded text-platinum focus:ring-2 focus:ring-sapphire-luxury/60 outline-none"
                value={form.category || ''}
                onChange={e => setForm({ ...form, category: e.target.value })}
              >
                <option value="earrings">Earrings</option>
                <option value="bracelets">Bracelets</option>
                <option value="necklaces">Necklaces</option>
              </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                className="p-2 bg-luxury-secondary border border-sapphire-luxury/30 rounded text-platinum placeholder-platinum/40 focus:ring-2 focus:ring-sapphire-luxury/60 outline-none"
                value={form.price || 0}
                onChange={e => setForm({ ...form, price: e.target.value })}
                placeholder="Price"
              />
              <input
                className="p-2 bg-luxury-secondary border border-sapphire-luxury/30 rounded text-platinum placeholder-platinum/40 focus:ring-2 focus:ring-sapphire-luxury/60 outline-none"
                value={form.originalPrice || ''}
                onChange={e => setForm({ ...form, originalPrice: e.target.value })}
                placeholder="Original price"
              />
            </div>
            <textarea
              className="w-full p-2 bg-luxury-secondary border border-sapphire-luxury/30 rounded text-platinum placeholder-platinum/40 focus:ring-2 focus:ring-sapphire-luxury/60 outline-none"
              rows={4}
              value={form.description || ''}
              onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder="Description"
            />
            <div>
              <label className="block text-sm font-medium text-platinum mb-2">Current Images</label>
              {(form.images && form.images.length > 0) ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
                  {form.images.map((img: string, idx: number) => (
                    <img key={idx} src={img} alt={`Current ${idx + 1}`} className="w-20 h-20 object-cover rounded border border-sapphire-luxury/40" />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-platinum/50 mb-3">No images yet</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-platinum mb-2">Update Images (Multiple)</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="w-full p-2 bg-luxury-secondary border border-sapphire-luxury/30 rounded text-platinum placeholder-platinum/40 focus:ring-2 focus:ring-sapphire-luxury/60 outline-none"
              />
              {previewImages.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm text-platinum/70 mb-2">New images ({previewImages.length}):</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {previewImages.map((preview, idx) => (
                      <img key={idx} src={preview} alt={`Preview ${idx + 1}`} className="w-20 h-20 object-cover rounded border border-emerald-luxury/40" />
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-platinum mb-2">Product Videos (Max 2 - Upload or URLs)</label>
              <p className="text-xs text-platinum/60 mb-3">Upload video files OR paste URLs</p>
              
              {/* Current Videos */}
              {(form.videos && form.videos.length > 0) && (
                <div className="mb-4">
                  <p className="text-sm text-platinum/80 mb-2">Current Videos:</p>
                  <div className="space-y-1">
                    {form.videos.map((vid: string, idx: number) => (
                      <p key={idx} className="text-xs text-gold-primary">✓ {vid.substring(0, 50)}...</p>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Video File Upload */}
              <div className="mb-4">
                <label className="block text-sm text-platinum/80 mb-2">Upload New Video Files</label>
                <input
                  type="file"
                  multiple
                  accept="video/*"
                  onChange={handleVideoChange}
                  className="w-full p-2 bg-luxury-secondary border border-sapphire-luxury/30 rounded text-platinum placeholder-platinum/40 focus:ring-2 focus:ring-sapphire-luxury/60 outline-none"
                />
                {videoFiles.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {videoFiles.map((file, idx) => (
                      <p key={idx} className="text-xs text-gold-primary">✓ {file.name}</p>
                    ))}
                  </div>
                )}
              </div>

              {/* Video URLs */}
              <div className="space-y-2">
                <label className="block text-sm text-platinum/80">Or Add Video URLs</label>
                <input
                  type="text"
                  placeholder="Video 1 URL"
                  value={videoUrls[0] || ''}
                  onChange={e => {
                    const newUrls = [...videoUrls];
                    newUrls[0] = e.target.value;
                    setVideoUrls(newUrls);
                  }}
                  className="w-full p-2 bg-luxury-secondary border border-sapphire-luxury/30 rounded text-platinum placeholder-platinum/40 focus:ring-2 focus:ring-sapphire-luxury/60 outline-none"
                />
                <input
                  type="text"
                  placeholder="Video 2 URL (optional)"
                  value={videoUrls[1] || ''}
                  onChange={e => {
                    const newUrls = [...videoUrls];
                    newUrls[1] = e.target.value;
                    setVideoUrls(newUrls);
                  }}
                  className="w-full p-2 bg-luxury-secondary border border-sapphire-luxury/30 rounded text-platinum placeholder-platinum/40 focus:ring-2 focus:ring-sapphire-luxury/60 outline-none"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2 text-platinum cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!form.soldOut}
                  onChange={e => setForm({ ...form, soldOut: e.target.checked })}
                  className="rounded border-sapphire-luxury accent-gold-primary"
                />
                <span>Sold Out</span>
              </label>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => { setShowEditModal(false); setEditProduct(null); setPreviewImages([]); setVideoFiles([]); setVideoUrls(['', '']); }}
                className="px-4 py-2 bg-luxury-secondary text-platinum rounded border border-sapphire-luxury/30 hover:shadow-glow-sapphire transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 btn-premium-gold text-luxury-dark rounded hover:shadow-glow-gold transition-all"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const BannerManager: React.FC = () => {
    const [text, setText] = useState('');
    const [type, setType] = useState<'info' | 'hot' | 'new' | 'sold-out'>('info');
    const addBanner = () => {
      if (!text) return;
      const id = Date.now().toString();
      (async () => {
        try {
          const res = await fetch(API_ENDPOINTS.BANNERS, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text, type }) });
          if (!res.ok) throw new Error('Add banner failed');
          const b = await res.json();
          dispatch({ type: 'SET_BANNERS', payload: [b, ...state.banners] });
        } catch (e) {
          dispatch({ type: 'ADD_BANNER', payload: { id, text, type } });
        }
        setText('');
      })();
    };
    return (
      <div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Banner text"
            className="p-2 bg-luxury-secondary border border-ruby-luxury/30 rounded text-platinum placeholder-platinum/40 focus:ring-2 focus:ring-ruby-luxury/60 outline-none col-span-3"
          />
          <select
            value={type}
            onChange={(e) => setType(e.target.value as any)}
            className="p-2 bg-luxury-secondary border border-ruby-luxury/30 rounded text-platinum focus:ring-2 focus:ring-ruby-luxury/60 outline-none"
          >
            <option value="info">Info</option>
            <option value="hot">Hot</option>
            <option value="new">New</option>
            <option value="sold-out">Sold Out</option>
          </select>
        </div>
        <div className="flex space-x-2 mb-4">
          <button
            onClick={addBanner}
            className="btn-premium-gold text-luxury-dark px-4 rounded hover:shadow-glow-gold transition-all"
          >
            Add Banner
          </button>
        </div>
        <div className="space-y-2">
          {state.banners.map((b, i) => (
            <div key={(b as any)._id || b.id || i} className="flex justify-between items-center p-2 bg-luxury-secondary border border-ruby-luxury/20 rounded">
              <div>
                <div className="font-medium text-platinum">{b.text}</div>
                <div className="text-sm text-platinum/60">{b.type}</div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    if (i === 0) return;
                    const next = [...state.banners];
                    const tmp = next[i - 1];
                    next[i - 1] = next[i];
                    next[i] = tmp;
                    dispatch({ type: 'SET_BANNERS', payload: next });
                  }}
                  className="text-gold-primary hover:text-rose-gold transition-colors"
                >
                  Up
                </button>
                <button
                  onClick={() => {
                    if (i === state.banners.length - 1) return;
                    const next = [...state.banners];
                    const tmp = next[i + 1];
                    next[i + 1] = next[i];
                    next[i] = tmp;
                    dispatch({ type: 'SET_BANNERS', payload: next });
                  }}
                  className="text-gold-primary hover:text-rose-gold transition-colors"
                >
                  Down
                </button>
                <button
                  onClick={async () => {
                    try {
                      const bannerAny = b as any;
                      const res = await fetch(`${API_ENDPOINTS.BANNERS}/${bannerAny._id || b.id}`, { method: 'DELETE' });
                      if (!res.ok) throw new Error('Delete failed');
                      dispatch({ type: 'SET_BANNERS', payload: state.banners.filter(x => x.id !== b.id && (x as any)._id !== bannerAny._id) });
                    } catch (e) {
                      dispatch({ type: 'REMOVE_BANNER', payload: b.id });
                    }
                  }}
                  className="text-ruby-luxury hover:text-rose-gold transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const CouponManager: React.FC = () => {
    const [discount, setDiscount] = useState(10);
    const [productId, setProductId] = useState<number | ''>('');
    const [expiresAt, setExpiresAt] = useState<string | null>(null);
    const [usageLimit, setUsageLimit] = useState<number | ''>('');
    const generateCode = () => {
      const code = 'RR' + Math.random().toString(36).substr(2, 6).toUpperCase();
      (async () => {
        const payload = { code, discountPercent: discount, active: true, productId: productId === '' ? null : Number(productId), expiresAt, usageLimit: usageLimit === '' ? null : Number(usageLimit), used: 0 };
        try {
          const res = await fetch(API_ENDPOINTS.COUPONS, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
          if (!res.ok) throw new Error('Create coupon failed');
          const c = await res.json();
          dispatch({ type: 'ADD_COUPON', payload: c });
        } catch (e) {
          dispatch({ type: 'ADD_COUPON', payload });
        }
      })();
    };
    return (
      <div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
          <input type="number" value={discount} onChange={e => setDiscount(Number(e.target.value))} className="p-2 border rounded" />
          <select value={productId as any} onChange={e => setProductId(e.target.value === '' ? '' : Number(e.target.value))} className="p-2 border rounded">
            <option value="">All products</option>
            {state.products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <input type="date" value={expiresAt || ''} onChange={e => setExpiresAt(e.target.value || null)} className="p-2 border rounded" />
          <input type="number" value={usageLimit as any} onChange={e => setUsageLimit(e.target.value === '' ? '' : Number(e.target.value))} placeholder="Usage limit" className="p-2 border rounded" />
          <button onClick={generateCode} className="bg-brand text-platinum px-4 rounded col-span-2">Generate Coupon</button>
        </div>
        <div className="space-y-2">
          {state.coupons.map((c, i) => (
            <div key={(c as any)._id || c.code || i} className="flex justify-between items-center p-2 border rounded">
              <div>
                <div className="font-medium">{c.code} - {c.discountPercent}% {c.active ? '' : '(Inactive)'}</div>
                <div className="text-sm text-gray-600">Applies to: {c.productId ? state.products.find(p => p.id === c.productId)?.name : 'All'}</div>
                <div className="text-sm text-gray-600">Expires: {c.expiresAt || 'Never'} • Used: {c.used || 0} • Limit: {c.usageLimit || '∞'}</div>
              </div>
              <div className="flex space-x-2">
                <button onClick={async () => {
                  try {
                    const res = await fetch(`${API_ENDPOINTS.COUPONS}/${c.code}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...c, active: !c.active }) });
                    if (!res.ok) throw new Error('Toggle failed');
                    const updated = await res.json();
                    dispatch({ type: 'UPDATE_COUPON', payload: updated });
                  } catch (e) {
                    dispatch({ type: 'UPDATE_COUPON', payload: { ...c, active: !c.active } });
                  }
                }} className="text-blue-600">Toggle</button>
                <button onClick={async () => {
                  try {
                    const res = await fetch(`${API_ENDPOINTS.COUPONS}/${c.code}`, { method: 'DELETE' });
                    if (!res.ok) throw new Error('Delete failed');
                    dispatch({ type: 'REMOVE_COUPON', payload: c.code });
                  } catch (e) {
                    dispatch({ type: 'REMOVE_COUPON', payload: c.code });
                  }
                }} className="text-red-600">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-luxury-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold-primary to-rose-gold">Admin Dashboard</h1>
          <p className="text-platinum/70">Manage your MORAA REFLECTION store</p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8 border-b border-sapphire-luxury/20 pb-4">
            {[
              { id: 'dashboard', name: 'Dashboard' },
              { id: 'products', name: 'Products' },
              { id: 'content', name: 'Content' },
              { id: 'orders', name: 'Orders' },
              { id: 'customers', name: 'Customers' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 font-medium text-sm transition-all ${activeTab === tab.id
                    ? 'border-b-2 border-gold-primary text-gold-primary'
                    : 'text-platinum/60 hover:text-gold-primary'
                  }`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat) => (
                <div key={stat.name} className="glass-card-emerald border border-emerald-luxury/40 p-6 rounded-lg shadow-glow-emerald">
                  <div className="flex items-center">
                    <div className={`bg-gradient-to-r ${stat.name === 'Total Products' ? 'from-emerald-luxury to-sapphire-luxury' :
                        stat.name === 'Total Orders' ? 'from-gold-primary to-rose-gold' :
                          stat.name === 'Total Customers' ? 'from-ruby-luxury to-amethyst-luxury' :
                            'from-sapphire-luxury to-emerald-luxury'
                      } p-3 rounded-lg shadow-glow`}>
                      <stat.icon className="h-6 w-6 text-platinum" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-platinum/70">{stat.name}</p>
                      <p className="text-2xl font-bold text-gold-primary">{stat.value}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Orders */}
            <div className="glass-card-sapphire border border-sapphire-luxury/40 rounded-lg shadow-glow-sapphire overflow-hidden">
              <div className="px-6 py-4 border-b border-sapphire-luxury/20 bg-luxury-secondary">
                <h3 className="text-lg font-medium text-platinum">Recent Orders</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-sapphire-luxury/20">
                  <thead className="bg-luxury-secondary border-b border-sapphire-luxury/20">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-platinum/70 uppercase tracking-wider">
                        Order ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-platinum/70 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-platinum/70 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-platinum/70 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-platinum/70 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sapphire-luxury/20">
                    {recentOrders.map((order) => (
                      <tr key={order.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-platinum">
                          {order.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-platinum/70">
                          {order.customer}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-platinum/70">
                          {order.product}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-platinum/70">
                          {order.amount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${order.status === 'Completed' ? 'bg-gradient-to-r from-emerald-luxury to-sapphire-luxury text-platinum' :
                              order.status === 'Processing' ? 'bg-gradient-to-r from-gold-primary to-rose-gold text-luxury-dark font-bold' :
                                order.status === 'Shipped' ? 'bg-gradient-to-r from-sapphire-luxury to-gold-primary text-platinum' :
                                  'bg-luxury-secondary text-platinum/70'
                            }`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold-primary to-rose-gold">Products</h2>
              <button
                onClick={() => setShowAddProduct(true)}
                className="btn-premium-gold text-luxury-dark px-4 py-2 rounded-lg hover:shadow-glow-gold transition-all flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add Product</span>
              </button>
            </div>

            {showAddProduct && <ProductForm />}

            <div className="glass-card-sapphire border border-sapphire-luxury/40 rounded-lg shadow-glow-sapphire overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-sapphire-luxury/20">
                  <thead className="bg-luxury-secondary border-b border-sapphire-luxury/20">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-platinum/70 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-platinum/70 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-platinum/70 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-platinum/70 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-platinum/70 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sapphire-luxury/20">
                    {state.products.map((product, i) => (
                      <tr key={(product as any)._id || product.id || i}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img
                              className="h-10 w-10 rounded-lg object-cover border border-gold-primary"
                              src={product.image}
                              alt={product.name}
                            />
                            <div className="ml-4">
                              <div className="text-sm font-medium text-platinum">{product.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-platinum/70 capitalize">
                          {product.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gold-primary font-medium">
                          ₹{product.price.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${product.soldOut ? 'bg-gradient-to-r from-ruby-luxury to-amethyst-luxury text-platinum' : 'bg-gradient-to-r from-emerald-luxury to-sapphire-luxury text-platinum'
                            }`}>
                            {product.soldOut ? 'Sold Out' : 'In Stock'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button className="text-gold-primary hover:text-rose-gold transition-colors">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => {
                                setEditProduct(product);
                                setShowEditModal(true);
                              }}
                              className="text-sapphire-luxury hover:text-emerald-luxury transition-colors"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={async () => {
                                try {
                                  const productAny = product as any;
                                  const res = await fetch(`${API_ENDPOINTS.PRODUCTS}/${productAny._id || product.id}`, { method: 'DELETE' });
                                  if (!res.ok) throw new Error('Delete failed');
                                  dispatch({ type: 'REMOVE_PRODUCT', payload: product.id });
                                } catch (e) {
                                  dispatch({ type: 'REMOVE_PRODUCT', payload: product.id });
                                }
                              }}
                              className="text-ruby-luxury hover:text-rose-gold transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Content Tab */}
        {activeTab === 'content' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-card-emerald border border-emerald-luxury/40 p-6 rounded-lg shadow-glow-emerald">
                <h3 className="text-lg font-medium text-platinum mb-4">Video Showcase</h3>
                <VideoManager />
              </div>
              <div className="glass-card-ruby border border-ruby-luxury/40 p-6 rounded-lg shadow-glow-ruby">
                <h3 className="text-lg font-medium text-platinum mb-4">Banners & Tags</h3>
                <BannerManager />
              </div>
            </div>

            <div className="glass-card-sapphire border border-sapphire-luxury/40 p-6 rounded-lg shadow-glow-sapphire">
              <h3 className="text-lg font-medium text-platinum mb-4">Coupons</h3>
              <CouponManager />
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="glass-card-sapphire border border-sapphire-luxury/40 rounded-lg shadow-glow-sapphire overflow-hidden">
            <div className="px-6 py-4 border-b border-sapphire-luxury/20 bg-luxury-secondary">
              <h3 className="text-lg font-medium text-platinum">All Orders</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-sapphire-luxury/20">
                <thead className="bg-luxury-secondary border-b border-sapphire-luxury/20">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-platinum/70 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-platinum/70 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-platinum/70 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-platinum/70 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-platinum/70 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-platinum/70 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sapphire-luxury/20">
                  {recentOrders.map((order) => (
                    <tr key={order.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-platinum">
                        {order.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-platinum/70">
                        {order.customer}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-platinum/70">
                        {order.product}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-platinum/70">
                        {order.amount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${order.status === 'Completed' ? 'bg-gradient-to-r from-emerald-luxury to-sapphire-luxury text-platinum' :
                            order.status === 'Processing' ? 'bg-gradient-to-r from-gold-primary to-rose-gold text-luxury-dark font-bold' :
                              order.status === 'Shipped' ? 'bg-gradient-to-r from-sapphire-luxury to-gold-primary text-platinum' :
                                'bg-luxury-secondary text-platinum/70'
                          }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button className="text-gold-primary hover:text-rose-gold transition-colors">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="text-sapphire-luxury hover:text-emerald-luxury transition-colors">
                            <Edit className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Customers Tab */}
        {activeTab === 'customers' && (
          <div className="glass-card-emerald border border-emerald-luxury/40 rounded-lg shadow-glow-emerald overflow-hidden">
            <div className="px-6 py-4 border-b border-emerald-luxury/20 bg-luxury-secondary">
              <h3 className="text-lg font-medium text-platinum">Customer Management</h3>
            </div>
            <div className="p-6">
              <p className="text-platinum/70">Customer management features coming soon...</p>
            </div>
          </div>
        )}

        {/* Edit Product Modal - Rendered at top level */}
        <EditProductModal />
      </div>
    </div>
  );
};

export default Admin;
