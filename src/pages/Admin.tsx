import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye, Package, Users, ShoppingBag, TrendingUp } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { API_ENDPOINTS } from '../utils/api';

const Admin = () => {
  const navigate = useNavigate();
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
    const [soldOut, setSoldOut] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files: File[] = Array.from(e.target.files || []);
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
      <div className="bg-white border border-gold-primary/20 p-8 rounded-2xl shadow-lg">

        <h3 className="text-lg font-bold text-text-primary mb-4">Add New Product</h3>
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
          // Collect video URLs (only non-empty ones)
          const validUrls = videoUrls.filter(url => url.trim());
          if (validUrls.length > 0 || videoFiles.length > 0) {
            const finalVideos = [...validUrls, ...videoFiles.map((_, i) => `__file_${i}__`)];
            fd.append('videos', JSON.stringify(finalVideos));
          }

          // Add soldOut status
          fd.append('soldOut', String(soldOut));

          // Parse specifications from raw text
          const specsRaw = fd.get('specifications_raw')?.toString() || '';
          if (specsRaw) {
            const specsArray = specsRaw.split('\n').map(s => s.trim()).filter(s => s.length > 0);
            fd.append('specifications', JSON.stringify(specsArray));
          }
          fd.delete('specifications_raw');

          // Parse materials from raw text
          const matsRaw = fd.get('materials_raw')?.toString() || '';
          if (matsRaw) {
            const matsArray = matsRaw.split('\n').map(s => s.trim()).filter(s => s.length > 0);
            fd.append('materials', JSON.stringify(matsArray));
          }
          fd.delete('materials_raw');

          // Handle sizes
          const sizesRaw = fd.get('sizes_raw')?.toString() || '';
          if (sizesRaw) {
            const sizesArray = sizesRaw.split(',').map(s => s.trim()).filter(s => s.length > 0);
            fd.append('sizes', JSON.stringify(sizesArray));
          }
          fd.delete('sizes_raw');
          
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
          setError('');
        }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label htmlFor="product-name" className="block text-[10px] font-bold text-text-muted uppercase tracking-widest mb-3">Product Name</label>
              <input
                id="product-name"
                name="name"
                type="text"
                autoComplete="off"
                className="w-full px-4 py-3 bg-luxury-dark/10 border border-gold-primary/10 rounded-xl text-text-primary placeholder-text-muted/40 focus:ring-2 focus:ring-primary-red/20 transition-all outline-none"
                placeholder="Enter product name"
              />
            </div>
            <div>
              <label htmlFor="product-category" className="block text-[10px] font-bold text-text-muted uppercase tracking-widest mb-3">Category</label>
              <select id="product-category" name="category" className="w-full px-4 py-3 bg-luxury-dark/10 border border-gold-primary/10 rounded-xl text-text-primary focus:ring-2 focus:ring-primary-red/20 transition-all outline-none">
                <option value="">Select category</option>
                <option value="earrings">Earrings</option>
                <option value="bracelets">Bracelets</option>
                <option value="necklaces">Necklaces</option>
                <option value="rings">Rings</option>
                <option value="sets">Jewelry Sets</option>
                <option value="hand-chains">Hand Chains</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label htmlFor="product-price" className="block text-[10px] font-bold text-text-muted uppercase tracking-widest mb-3">Price (₹)</label>
              <input
                id="product-price"
                name="price"
                type="number"
                autoComplete="off"
                className="w-full px-4 py-3 bg-luxury-dark/10 border border-gold-primary/10 rounded-xl text-text-primary placeholder-text-muted/40 focus:ring-2 focus:ring-primary-red/20 transition-all outline-none"
                placeholder="0"
              />
            </div>
            <div>
              <label htmlFor="product-original-price" className="block text-[10px] font-bold text-text-muted uppercase tracking-widest mb-3">Original Price (₹)</label>
              <input
                id="product-original-price"
                name="originalPrice"
                type="number"
                autoComplete="off"
                className="w-full px-4 py-3 bg-luxury-dark/10 border border-gold-primary/10 rounded-xl text-text-primary placeholder-text-muted/40 focus:ring-2 focus:ring-primary-red/20 transition-all outline-none"
                placeholder="0"
              />
            </div>
            <div>
              <label htmlFor="product-stock" className="block text-[10px] font-bold text-text-muted uppercase tracking-widest mb-3">Available Stock</label>
              <input
                id="product-stock"
                name="stock"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                className="w-full px-4 py-3 bg-luxury-dark/10 border border-gold-primary/10 rounded-xl text-text-primary placeholder-text-muted/40 focus:ring-2 focus:ring-primary-red/20 transition-all outline-none"
                placeholder="Enter stock quantity"
              />
            </div>
            <div>
              <label htmlFor="product-sizes" className="block text-[10px] font-bold text-text-muted uppercase tracking-widest mb-3">Sizes (For rings, comma separated)</label>
              <input
                id="product-sizes"
                name="sizes_raw"
                type="text"
                className="w-full px-4 py-3 bg-luxury-dark/10 border border-gold-primary/10 rounded-xl text-text-primary placeholder-text-muted/40 focus:ring-2 focus:ring-primary-red/20 transition-all outline-none"
                placeholder="5, 6, 7, 8, 9"
              />
            </div>
          </div>
          <div>
            <label htmlFor="product-description" className="block text-[10px] font-bold text-text-muted uppercase tracking-widest mb-3">Description</label>
            <textarea
              id="product-description"
              name="description"
              rows={4}
              className="w-full px-4 py-3 bg-luxury-dark/10 border border-gold-primary/10 rounded-xl text-text-primary placeholder-text-muted/40 focus:ring-2 focus:ring-primary-red/20 transition-all outline-none"
              placeholder="Enter product description"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label htmlFor="product-dimensions" className="block text-[10px] font-bold text-text-muted uppercase tracking-widest mb-3">Dimensions (e.g. 20cm x 15cm)</label>
              <input
                id="product-dimensions"
                name="dimensions"
                type="text"
                autoComplete="off"
                className="w-full px-4 py-3 bg-luxury-dark/10 border border-gold-primary/10 rounded-xl text-text-primary placeholder-text-muted/40 focus:ring-2 focus:ring-primary-red/20 transition-all outline-none"
                placeholder="Length x Width x Height"
              />
            </div>
            <div>
              <label htmlFor="product-weight" className="block text-[10px] font-bold text-text-muted uppercase tracking-widest mb-3">Weight (e.g. 50g)</label>
              <input
                id="product-weight"
                name="weight"
                type="text"
                autoComplete="off"
                className="w-full px-4 py-3 bg-luxury-dark/10 border border-gold-primary/10 rounded-xl text-text-primary placeholder-text-muted/40 focus:ring-2 focus:ring-primary-red/20 transition-all outline-none"
                placeholder="50g"
              />
            </div>
          </div>
          <div>
            <label htmlFor="product-materials" className="block text-[10px] font-bold text-text-muted uppercase tracking-widest mb-3">Materials (One per line)</label>
            <textarea
              id="product-materials"
              name="materials_raw"
              rows={2}
              className="w-full px-4 py-3 bg-luxury-dark/10 border border-gold-primary/10 rounded-xl text-text-primary placeholder-text-muted/40 focus:ring-2 focus:ring-primary-red/20 transition-all outline-none"
              placeholder="Stainless Steel&#10;18k Gold PVD"
            />
          </div>
          <div>
            <label htmlFor="product-specifications" className="block text-[10px] font-bold text-text-muted uppercase tracking-widest mb-3">Specifications (One per line)</label>
            <textarea
              id="product-specifications"
              name="specifications_raw"
              rows={3}
              className="w-full px-4 py-3 bg-luxury-dark/10 border border-gold-primary/10 rounded-xl text-text-primary placeholder-text-muted/40 focus:ring-2 focus:ring-primary-red/20 transition-all outline-none"
              placeholder="Waterproof&#10;Anti-Tarnish&#10;Hypoallergenic"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Product Images (Multiple)</label>
            <input
              name="image"
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-3 py-2 bg-white border border-gold-primary/20 rounded-lg text-text-primary placeholder-platinum/40 focus:ring-2 focus:ring-sapphire-luxury/60 focus:border-transparent outline-none"
            />
            {previewImages.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-text-primary/70 mb-2">Selected images ({previewImages.length}):</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {previewImages.map((preview, idx) => (
                    <img key={idx} src={preview} alt={`Preview ${idx + 1}`} className="w-20 h-20 object-cover rounded border border-sapphire-luxury/40" />
                  ))}
                </div>
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Product Videos (Max 2 - Upload or URLs)</label>
            <p className="text-xs text-text-primary/60 mb-3">You can upload video files (MP4, WebM) OR paste URLs (YouTube, Vimeo, or direct video links)</p>
            
            {/* Video File Upload */}
            <div className="mb-4">
              <label className="block text-sm text-text-primary/80 mb-2">Upload Video Files</label>
              <input
                type="file"
                multiple
                accept="video/*"
                onChange={handleVideoChange}
                className="w-full px-3 py-2 bg-white border border-gold-primary/20 rounded-lg text-text-primary placeholder-platinum/40 focus:ring-2 focus:ring-sapphire-luxury/60 focus:border-transparent outline-none"
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
              <label className="block text-sm text-text-primary/80">Or Add Video URLs</label>
              <input
                type="text"
                placeholder="Video 1 URL (YouTube, Vimeo, or MP4 link)"
                value={videoUrls[0]}
                onChange={(e) => {
                  const newUrls = [...videoUrls];
                  newUrls[0] = e.target.value;
                  setVideoUrls(newUrls);
                }}
                className="w-full px-3 py-2 bg-white border border-gold-primary/20 rounded-lg text-text-primary placeholder-platinum/40 focus:ring-2 focus:ring-sapphire-luxury/60 focus:border-transparent outline-none"
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
                className="w-full px-3 py-2 bg-white border border-gold-primary/20 rounded-lg text-text-primary placeholder-platinum/40 focus:ring-2 focus:ring-sapphire-luxury/60 focus:border-transparent outline-none"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2 text-text-primary cursor-pointer">
              <input
                type="checkbox"
                checked={soldOut}
                onChange={e => setSoldOut(e.target.checked)}
                className="rounded border-sapphire-luxury accent-gold-primary"
              />
              <span>Sold Out</span>
            </label>
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
                setSoldOut(false);
                setError('');
              }}
              className="bg-white text-text-primary px-6 py-2 rounded-lg border border-teal-luxury/30 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"

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
            className="p-2 bg-white border border-teal-luxury/30 rounded text-text-primary placeholder-platinum/40 focus:ring-2 focus:ring-teal-luxury/60 outline-none"
          />
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Video URL"
            className="p-2 bg-white border border-teal-luxury/30 rounded text-text-primary placeholder-platinum/40 focus:ring-2 focus:ring-teal-luxury/60 outline-none"
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
            <div key={(v as any)._id || v.id || i} className="flex justify-between items-center p-2 bg-white border border-teal-luxury/20 rounded">
              <div>
                <div className="font-medium text-text-primary">{v.title}</div>
                <div className="text-sm text-text-primary/60 truncate max-w-md">{v.url}</div>
              </div>
              <div className="flex space-x-2">
                <a href={v.url} target="_blank" rel="noreferrer" className="text-gold-primary hover:text-gold-soft transition-colors">Open</a>
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
                  className="text-primary-wine hover:text-gold-soft transition-colors"
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
    const [localForm, setLocalForm] = useState<any>(null);
    const [previewImages, setPreviewImages] = useState<string[]>([]);
    const [videoFiles, setVideoFiles] = useState<File[]>([]);
    const [videoUrls, setVideoUrls] = useState<string[]>(['', '']);

    // Sync localForm whenever editProduct or showEditModal changes
    React.useEffect(() => {
      if (showEditModal && editProduct) {
        setLocalForm({
          id: editProduct.id || editProduct._id,
          name: editProduct.name || '',
          category: editProduct.category || '',
          price: editProduct.price || 0,
          originalPrice: editProduct.originalPrice || '',
          description: editProduct.description || '',
          dimensions: editProduct.dimensions || '',
          weight: editProduct.weight || '',
          materials: (() => {
            let mats = editProduct.materials;
            if (typeof mats === 'string' && mats.startsWith('[')) {
              try { mats = JSON.parse(mats); } catch (e) { /* ignore */ }
            }
            return Array.isArray(mats) ? mats.join('\n') : (mats || '');
          })(),
          specifications: (() => {
            let specs = editProduct.specifications;
            if (typeof specs === 'string' && specs.startsWith('[')) {
              try { specs = JSON.parse(specs); } catch (e) { /* ignore */ }
            }
            return Array.isArray(specs) ? specs.join('\n') : (specs || '');
          })(),
          soldOut: editProduct.soldOut || false,
          images: editProduct.images || [],
          videos: editProduct.videos || [],
          stock: editProduct.stock || 0,
          sizes: (() => {
            let s = editProduct.sizes;
            if (typeof s === 'string' && s.startsWith('[')) {
              try { s = JSON.parse(s); } catch (e) { /* ignore */ }
            }
            return Array.isArray(s) ? s.join(', ') : (s || '');
          })()
        });
        setVideoUrls((editProduct?.videos && editProduct.videos.length > 0) ? editProduct.videos : ['', '']);
      } else {
        setLocalForm(null);
      }
    }, [showEditModal, editProduct]);

    if (!showEditModal || !localForm) {
      return null;
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files: File[] = Array.from(e.target.files || []);
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
        Object.keys(localForm).forEach(k => {
          if (localForm[k] !== undefined && localForm[k] !== null && k !== 'images' && k !== 'image' && k !== 'videos' && k !== 'specifications' && k !== 'materials') {
            fd.append(k, localForm[k]);
          }
        });

        // Handle specifications array
        if (localForm.specifications) {
          const specsArray = localForm.specifications.split('\n').map((s: string) => s.trim()).filter((s: string) => s.length > 0);
          fd.append('specifications', JSON.stringify(specsArray));
        }

        // Handle materials array
        if (localForm.materials) {
          const matsArray = localForm.materials.split('\n').map((s: string) => s.trim()).filter((s: string) => s.length > 0);
          fd.append('materials', JSON.stringify(matsArray));
        }
        
        // Handle sizes array
        if (localForm.sizes) {
          let sizesArray: string[] = [];
          if (Array.isArray(localForm.sizes)) {
            sizesArray = localForm.sizes;
          } else if (typeof localForm.sizes === 'string') {
            sizesArray = localForm.sizes.split(',').map((s: string) => s.trim()).filter((s: string) => s.length > 0);
          }
          fd.append('sizes', JSON.stringify(sizesArray));
        }

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
        const fileInput = (e.target as HTMLFormElement).querySelector('input[type="file"]') as HTMLInputElement;
        if (fileInput?.files?.length) {
          Array.from(fileInput.files).forEach(file => {
            fd.append('image', file);
          });
        }
        
        const url = `${API_ENDPOINTS.PRODUCTS}/${localForm.id}`;
        const res = await fetch(url, { method: 'PUT', body: fd });
        if (!res.ok) throw new Error('Update failed');
        const updated = await res.json();
        dispatch({ type: 'UPDATE_PRODUCT', payload: updated });
      } catch (err) {
        const updated = {
          ...localForm,
          id: localForm.id,
          name: localForm.name,
          category: localForm.category,
          price: Number(localForm.price) || 0,
          originalPrice: localForm.originalPrice ? Number(localForm.originalPrice) : undefined,
          description: localForm.description || '',
          soldOut: !!localForm.soldOut,
        };
        dispatch({ type: 'UPDATE_PRODUCT', payload: updated });
      }
      setShowEditModal(false);
      setEditProduct(null);
      setPreviewImages([]);
    };

    return (
      <div className="fixed inset-0 bg-luxury-dark/90 backdrop-blur-md flex items-center justify-center z-[100] overflow-y-auto py-10">
        <div className="bg-white border border-gold-primary/20 rounded-3xl shadow-2xl max-w-4xl w-full mx-4 p-8 md:p-12">
          <div className="mb-8">
            <h3 className="text-3xl font-black text-text-primary luxury-serif tracking-widest uppercase mb-1">Edit Product</h3>
            <p className="text-[10px] font-bold text-primary-red tracking-[0.3em] uppercase">ID: {localForm?.id || localForm?._id}</p>
          </div>
          <form onSubmit={submit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-[10px] font-bold text-text-muted uppercase tracking-widest mb-3">Product Name</label>
                <input
                  className="w-full px-4 py-3 bg-luxury-dark/10 border border-gold-primary/10 rounded-xl text-text-primary placeholder-text-muted/40 focus:ring-2 focus:ring-primary-red/20 transition-all outline-none"
                  value={localForm?.name || ''}
                  onChange={e => setLocalForm({ ...localForm, name: e.target.value })}
                  placeholder="Product name"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-text-muted uppercase tracking-widest mb-3">Category</label>
                <select
                  className="w-full px-4 py-3 bg-luxury-dark/10 border border-gold-primary/10 rounded-xl text-text-primary focus:ring-2 focus:ring-primary-red/20 transition-all outline-none"
                  value={localForm?.category || ''}
                  onChange={e => setLocalForm({ ...localForm, category: e.target.value })}
                >
                  <option value="">Select category</option>
                  <option value="earrings">Earrings</option>
                  <option value="bracelets">Bracelets</option>
                  <option value="necklaces">Necklaces</option>
                  <option value="rings">Rings</option>
                  <option value="sets">Jewelry Sets</option>
                  <option value="hand-chains">Hand Chains</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-[10px] font-bold text-text-muted uppercase tracking-widest mb-3">Current Price (₹)</label>
                <input
                  className="w-full px-4 py-3 bg-luxury-dark/10 border border-gold-primary/10 rounded-xl text-text-primary placeholder-text-muted/40 focus:ring-2 focus:ring-primary-red/20 transition-all outline-none"
                  value={localForm?.price || 0}
                  onChange={e => setLocalForm({ ...localForm, price: e.target.value })}
                  placeholder="Price"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-text-muted uppercase tracking-widest mb-3">Original Price (₹)</label>
                <input
                  className="w-full px-4 py-3 bg-luxury-dark/10 border border-gold-primary/10 rounded-xl text-text-primary placeholder-text-muted/40 focus:ring-2 focus:ring-primary-red/20 transition-all outline-none"
                  value={localForm?.originalPrice || ''}
                  onChange={e => setLocalForm({ ...localForm, originalPrice: e.target.value })}
                  placeholder="Original price"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-text-muted uppercase tracking-widest mb-3">Stock</label>
                <input
                  className="w-full px-4 py-3 bg-luxury-dark/10 border border-gold-primary/10 rounded-xl text-text-primary focus:ring-2 focus:ring-primary-red/20 outline-none"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={localForm?.stock === 0 ? '0' : (localForm?.stock || '')}
                  onChange={e => {
                    const val = e.target.value;
                    if (val === '' || /^\d+$/.test(val)) {
                      setLocalForm({ ...localForm, stock: val === '' ? '' : parseInt(val, 10) });
                    }
                  }}
                  placeholder="Enter stock quantity"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-text-muted uppercase tracking-widest mb-3">Sizes (Comma separated)</label>
                <input
                  className="w-full px-4 py-3 bg-luxury-dark/10 border border-gold-primary/10 rounded-xl text-text-primary focus:ring-2 focus:ring-primary-red/20 outline-none"
                  type="text"
                  value={localForm?.sizes || ''}
                  onChange={e => setLocalForm({ ...localForm, sizes: e.target.value })}
                  placeholder="5, 6, 7"
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-text-muted uppercase tracking-widest mb-3">Description</label>
              <textarea
                className="w-full px-4 py-3 bg-luxury-dark/10 border border-gold-primary/10 rounded-xl text-text-primary placeholder-text-muted/40 focus:ring-2 focus:ring-primary-red/20 transition-all outline-none"
                rows={4}
                value={localForm?.description || ''}
                onChange={e => setLocalForm({ ...localForm, description: e.target.value })}
                placeholder="Description"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-[10px] font-bold text-text-muted uppercase tracking-widest mb-3">Dimensions</label>
                <input
                  className="w-full px-4 py-3 bg-luxury-dark/10 border border-gold-primary/10 rounded-xl text-text-primary placeholder-text-muted/40 focus:ring-2 focus:ring-primary-red/20 transition-all outline-none"
                  value={localForm?.dimensions || ''}
                  onChange={e => setLocalForm({ ...localForm, dimensions: e.target.value })}
                  placeholder="e.g. 20cm x 15cm"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-text-muted uppercase tracking-widest mb-3">Weight</label>
                <input
                  className="w-full px-4 py-3 bg-luxury-dark/10 border border-gold-primary/10 rounded-xl text-text-primary placeholder-text-muted/40 focus:ring-2 focus:ring-primary-red/20 transition-all outline-none"
                  value={localForm?.weight || ''}
                  onChange={e => setLocalForm({ ...localForm, weight: e.target.value })}
                  placeholder="e.g. 50g"
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-text-muted uppercase tracking-widest mb-3">Materials (One per line)</label>
              <textarea
                className="w-full px-4 py-3 bg-luxury-dark/10 border border-gold-primary/10 rounded-xl text-text-primary placeholder-text-muted/40 focus:ring-2 focus:ring-primary-red/20 transition-all outline-none"
                rows={2}
                value={localForm?.materials || ''}
                onChange={e => setLocalForm({ ...localForm, materials: e.target.value })}
                placeholder="Stainless Steel&#10;18k Gold PVD"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-text-muted uppercase tracking-widest mb-3">Specifications (One per line)</label>
              <textarea
                className="w-full px-4 py-3 bg-luxury-dark/10 border border-gold-primary/10 rounded-xl text-text-primary placeholder-text-muted/40 focus:ring-2 focus:ring-primary-red/20 transition-all outline-none"
                rows={3}
                value={localForm?.specifications || ''}
                onChange={e => setLocalForm({ ...localForm, specifications: e.target.value })}
                placeholder="Stainless Steel&#10;18k Gold Finish"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Current Images</label>
              {(localForm?.images && localForm.images.length > 0) ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
                  {localForm.images.map((img: string, idx: number) => (
                    <img key={idx} src={img} alt={`Current ${idx + 1}`} className="w-20 h-20 object-cover rounded border border-teal-luxury/40" />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-text-primary/50 mb-3">No images yet</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Update Images (Multiple)</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="w-full p-2 bg-white border border-teal-luxury/30 rounded text-text-primary placeholder-platinum/40 focus:ring-2 focus:ring-teal-luxury/60 outline-none"
              />
              {previewImages.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm text-text-primary/70 mb-2">New images ({previewImages.length}):</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {previewImages.map((preview, idx) => (
                      <img key={idx} src={preview} alt={`Preview ${idx + 1}`} className="w-20 h-20 object-cover rounded border border-teal-luxury/40" />
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Product Videos (Max 2 - Upload or URLs)</label>
              <p className="text-xs text-text-primary/60 mb-3">Upload video files OR paste URLs</p>
              
              {/* Current Videos */}
              {(localForm?.videos && localForm.videos.length > 0) && (
                <div className="mb-4">
                  <p className="text-sm text-text-primary/80 mb-2">Current Videos:</p>
                  <div className="space-y-1">
                    {localForm.videos.map((vid: string, idx: number) => (
                      <p key={idx} className="text-xs text-gold-primary">✓ {vid.substring(0, 50)}...</p>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Video File Upload */}
              <div className="mb-4">
                <label className="block text-sm text-text-primary/80 mb-2">Upload New Video Files</label>
                <input
                  type="file"
                  multiple
                  accept="video/*"
                  onChange={handleVideoChange}
                  className="w-full p-2 bg-white border border-teal-luxury/30 rounded text-text-primary placeholder-platinum/40 focus:ring-2 focus:ring-teal-luxury/60 outline-none"
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
                <label className="block text-sm text-text-primary/80">Or Add Video URLs</label>
                <input
                  type="text"
                  placeholder="Video 1 URL"
                  value={videoUrls[0] || ''}
                  onChange={e => {
                    const newUrls = [...videoUrls];
                    newUrls[0] = e.target.value;
                    setVideoUrls(newUrls);
                  }}
                  className="w-full p-2 bg-white border border-teal-luxury/30 rounded text-text-primary placeholder-platinum/40 focus:ring-2 focus:ring-teal-luxury/60 outline-none"
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
                  className="w-full p-2 bg-white border border-teal-luxury/30 rounded text-text-primary placeholder-platinum/40 focus:ring-2 focus:ring-teal-luxury/60 outline-none"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2 text-text-primary cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!localForm?.soldOut}
                  onChange={e => setLocalForm({ ...localForm, soldOut: e.target.checked })}
                  className="rounded border-teal-luxury accent-gold-primary"
                />
                <span>Sold Out</span>
              </label>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => { setShowEditModal(false); setEditProduct(null); setPreviewImages([]); setVideoFiles([]); setVideoUrls(['', '']); }}
                className="px-4 py-2 bg-white text-text-primary rounded border border-teal-luxury/30 hover:shadow-lg transition-all"

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
            className="p-2 bg-white border border-primary-wine/30 rounded text-text-primary placeholder-platinum/40 focus:ring-2 focus:ring-primary-wine/60 outline-none col-span-3"
          />
          <select
            value={type}
            onChange={(e) => setType(e.target.value as any)}
            className="p-2 bg-white border border-primary-wine/30 rounded text-text-primary focus:ring-2 focus:ring-primary-wine/60 outline-none"
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
            <div key={(b as any)._id || b.id || i} className="flex justify-between items-center p-2 bg-white border border-ruby-luxury/20 rounded">
              <div>
                <div className="font-medium text-text-primary">{b.text}</div>
                <div className="text-sm text-text-primary/60">{b.type}</div>
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
          <button onClick={generateCode} className="bg-brand text-text-primary px-4 rounded col-span-2">Generate Coupon</button>
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
        <div className="mb-12">
          <h1 className="text-4xl font-black text-text-primary luxury-serif tracking-widest uppercase">Admin Dashboard</h1>
          <div className="w-20 h-1 bg-primary-red mt-4 mb-2"></div>
          <p className="text-text-secondary font-medium italic">Manage your MORAA REFLECTION store</p>
        </div>

        <div className="mb-12">
          <nav className="flex space-x-12 border-b border-gold-primary/20 pb-4">
            {[
              { id: 'dashboard', name: 'Dashboard' },
              { id: 'products', name: 'Products' },
              { id: 'inventory', name: 'Inventory' },
              { id: 'content', name: 'Content' },
              { id: 'orders', name: 'Orders' },
              { id: 'customers', name: 'Customers' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 font-black text-[10px] tracking-[0.3em] transition-all relative ${activeTab === tab.id
                    ? 'text-primary-red after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary-red'
                    : 'text-text-muted hover:text-primary-red'
                  }`}
              >
                {tab.name.toUpperCase()}
              </button>
            ))}
          </nav>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat) => (
                <div key={stat.name} className="bg-white border border-gold-primary/20 p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all group">
                  <div className="flex items-center">
                    <div className={`p-4 rounded-xl bg-gold-primary/10 text-gold-primary group-hover:bg-primary-red/10 group-hover:text-primary-red transition-all`}>
                      <stat.icon className="h-6 w-6" />
                    </div>
                    <div className="ml-5">
                      <p className="text-[10px] font-black tracking-widest text-text-muted uppercase mb-1">{stat.name}</p>
                      <p className="text-3xl font-black text-text-primary luxury-serif">{stat.value}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Orders */}
            <div className="bg-white border border-gold-primary/10 rounded-2xl shadow-sm overflow-hidden">
              <div className="px-8 py-6 border-b border-gold-primary/10 flex items-center justify-between">
                <h3 className="text-sm font-black text-text-primary tracking-[0.2em] uppercase">RECENT ORDERS</h3>
                <button className="text-[10px] font-bold text-primary-red hover:underline tracking-widest uppercase">VIEW ALL</button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gold-primary/10">
                  <thead className="bg-[#FDFBF9]">
                    <tr>
                      <th className="px-6 py-4 text-left text-[10px] font-bold text-text-muted uppercase tracking-widest">
                        Order ID
                      </th>
                      <th className="px-6 py-4 text-left text-[10px] font-bold text-text-muted uppercase tracking-widest">
                        Customer
                      </th>
                      <th className="px-6 py-4 text-left text-[10px] font-bold text-text-muted uppercase tracking-widest">
                        Product
                      </th>
                      <th className="px-6 py-4 text-left text-[10px] font-bold text-text-muted uppercase tracking-widest">
                        Amount
                      </th>
                      <th className="px-6 py-4 text-left text-[10px] font-bold text-text-muted uppercase tracking-widest">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gold-primary/10 bg-white">
                    {recentOrders.map((order) => (
                      <tr key={order.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-text-primary">
                          {order.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                          {order.customer}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                          {order.product}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                          {order.amount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full ${order.status === 'Completed' ? 'bg-green-100 text-green-700' :
                              order.status === 'Processing' ? 'bg-orange-100 text-orange-700' :
                                order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                                  'bg-gray-100 text-gray-700'
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

        {/* Inventory Tab */}
        {activeTab === 'inventory' && (
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-2xl border border-gold-primary/20 shadow-sm flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-text-primary luxury-serif tracking-widest uppercase mb-1">Stock Inventory</h2>
                <div className="w-12 h-1 bg-gold-primary rounded-full"></div>
              </div>
              <div className="flex items-center space-x-3 bg-luxury-secondary/10 px-4 py-2 rounded-xl border border-gold-primary/10">
                <Package className="h-4 w-4 text-gold-primary" />
                <span className="text-xs font-bold text-text-muted uppercase tracking-wider">{state.products.length} Items Total</span>
              </div>
            </div>

            <div className="bg-white border border-gold-primary/10 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gold-primary/5">
                  <thead className="bg-[#FDFBF9]">
                    <tr>
                      <th className="px-8 py-4 text-left text-[10px] font-bold text-text-muted uppercase tracking-widest">Product</th>
                      <th className="px-8 py-4 text-left text-[10px] font-bold text-text-muted uppercase tracking-widest">Category</th>
                      <th className="px-8 py-4 text-left text-[10px] font-bold text-text-muted uppercase tracking-widest text-center">In Stock</th>
                      <th className="px-8 py-4 text-left text-[10px] font-bold text-text-muted uppercase tracking-widest">Status</th>
                      <th className="px-8 py-4 text-left text-[10px] font-bold text-text-muted uppercase tracking-widest">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sapphire-luxury/5 bg-white">
                    {state.products.map((product, i) => (
                      <tr key={(product as any)._id || product.id || i} className="hover:bg-luxury-secondary/5 transition-colors">
                        <td className="px-8 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img className="h-10 w-10 rounded-lg object-cover border border-gold-primary/30" src={product.image} alt={product.name} />
                            <span className="ml-4 text-sm font-bold text-text-primary">{product.name}</span>
                          </div>
                        </td>
                        <td className="px-8 py-4 whitespace-nowrap text-xs text-text-primary/70 uppercase tracking-wider font-medium">
                          {product.category}
                        </td>
                        <td className="px-8 py-4 whitespace-nowrap text-center">
                          <span className={`text-lg font-black luxury-serif ${((product as any).stock || 0) <= 5 ? 'text-primary-red' : 'text-gold-primary'}`}>
                            {(product as any).stock || 0}
                          </span>
                        </td>
                        <td className="px-8 py-4 whitespace-nowrap">
                          {((product as any).stock || 0) > 0 ? (
                            <span className="inline-flex px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full bg-emerald-luxury/10 text-emerald-luxury border border-emerald-luxury/20">
                              Available
                            </span>
                          ) : (
                            <span className="inline-flex px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full bg-primary-wine/10 text-primary-wine border border-primary-wine/20">
                              Out of Stock
                            </span>
                          )}
                        </td>
                        <td className="px-8 py-4 whitespace-nowrap">
                          <button
                            onClick={() => {
                              const productId = (product as any)._id || product.id;
                              navigate(`/admin/edit-product/${productId}`);
                            }}
                            className="p-2 bg-luxury-secondary/10 rounded-lg hover:bg-gold-primary/20 text-gold-primary transition-all"
                            title="Update Stock"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
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
          <div className="space-y-8">
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-gold-primary/20 shadow-sm">
              <div>
                <h2 className="text-2xl font-black text-text-primary luxury-serif tracking-widest uppercase">Products</h2>
                <p className="text-xs text-text-muted mt-1 uppercase tracking-widest">Inventory Management</p>
              </div>
              <button
                onClick={() => setShowAddProduct(true)}
                className="btn-premium-gold text-luxury-dark px-6 py-2.5 rounded-xl hover:shadow-glow-gold transition-all flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span className="font-bold tracking-widest text-[10px]">ADD NEW PRODUCT</span>
              </button>
            </div>

            {showAddProduct && <ProductForm />}

            <div className="bg-white border border-gold-primary/10 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gold-primary/5">
                  <thead className="bg-[#FDFBF9]">
                    <tr>
                      <th className="px-8 py-4 text-left text-[10px] font-bold text-text-muted uppercase tracking-widest">
                        Product
                      </th>
                      <th className="px-8 py-4 text-left text-[10px] font-bold text-text-muted uppercase tracking-widest">
                        Category
                      </th>
                      <th className="px-8 py-4 text-left text-[10px] font-bold text-text-muted uppercase tracking-widest">
                        Price
                      </th>
                      <th className="px-8 py-4 text-left text-[10px] font-bold text-text-muted uppercase tracking-widest">
                        Status
                      </th>
                      <th className="px-8 py-4 text-left text-[10px] font-bold text-text-muted uppercase tracking-widest">
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
                              <div className="text-sm font-medium text-text-primary">{product.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary/70 capitalize">
                          {product.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gold-primary font-medium">
                          ₹{product.price.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${product.soldOut ? 'bg-red-500/20 text-red-300 border border-red-500/50' : 'bg-emerald-luxury/20 text-emerald-luxury border border-emerald-luxury/50'}`}>
                            {product.soldOut ? 'Sold Out' : 'Available'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button className="text-gold-primary hover:text-rose-gold transition-colors">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => {
                                const productId = (product as any)._id || product.id;
                                navigate(`/admin/edit-product/${productId}`);
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
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white border border-gold-primary/20 p-8 rounded-2xl shadow-sm">
                <h3 className="text-sm font-black text-text-primary tracking-widest uppercase mb-6 flex items-center">
                  <span className="w-8 h-px bg-gold-primary/30 mr-3"></span>
                  Video Showcase
                </h3>
                <VideoManager />
              </div>
              <div className="bg-white border border-gold-primary/20 p-8 rounded-2xl shadow-sm">
                <h3 className="text-sm font-black text-text-primary tracking-widest uppercase mb-6 flex items-center">
                  <span className="w-8 h-px bg-gold-primary/30 mr-3"></span>
                  Banners & Tags
                </h3>
                <BannerManager />
              </div>
            </div>

            <div className="bg-white border border-gold-primary/20 p-8 rounded-2xl shadow-sm">
              <h3 className="text-sm font-black text-text-primary tracking-widest uppercase mb-6 flex items-center">
                <span className="w-8 h-px bg-gold-primary/30 mr-3"></span>
                Coupons
              </h3>
              <CouponManager />
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="bg-white border border-gold-primary/10 rounded-2xl overflow-hidden shadow-sm">
            <div className="px-8 py-6 border-b border-gold-primary/10 bg-[#FDFBF9]">
              <h3 className="text-sm font-black text-text-primary tracking-widest uppercase">All Orders</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gold-primary/5">
                <thead className="bg-white">
                  <tr>
                    <th className="px-8 py-4 text-left text-[10px] font-bold text-text-muted uppercase tracking-widest">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-primary/70 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-primary/70 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-primary/70 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-primary/70 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-primary/70 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sapphire-luxury/20">
                  {recentOrders.map((order) => (
                    <tr key={order.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-primary">
                        {order.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary/70">
                        {order.customer}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary/70">
                        {order.product}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary/70">
                        {order.amount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${order.status === 'Completed' ? 'bg-gradient-to-r from-emerald-luxury to-sapphire-luxury text-text-primary' :
                            order.status === 'Processing' ? 'bg-gradient-to-r from-gold-primary to-rose-gold text-luxury-dark font-bold' :
                              order.status === 'Shipped' ? 'bg-gradient-to-r from-sapphire-luxury to-gold-primary text-text-primary' :
                                'bg-white text-text-primary/70'
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
          <div className="bg-white border border-gold-primary/10 rounded-2xl overflow-hidden shadow-sm">
            <div className="px-8 py-6 border-b border-gold-primary/10 bg-[#FDFBF9]">
              <h3 className="text-sm font-black text-text-primary tracking-widest uppercase">Customer Management</h3>
            </div>
            <div className="p-8">
              <div className="bg-luxury-dark/5 p-12 rounded-2xl border-2 border-dashed border-gold-primary/20 text-center">
                <Users className="h-12 w-12 text-gold-primary/30 mx-auto mb-4" />
                <p className="text-text-secondary font-bold tracking-widest text-xs uppercase">Customer management features coming soon...</p>
              </div>
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
