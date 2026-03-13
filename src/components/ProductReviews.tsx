import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { API_BASE_URL } from '../utils/api';

interface Review {
  id: string;
  _id?: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  helpful: number;
  createdAt: string;
}

interface ProductReviewsProps {
  productId: string;
}

const ProductReviews: React.FC<ProductReviewsProps> = ({ productId }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [ratingDistribution, setRatingDistribution] = useState({
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0
  });
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [sortBy, setSortBy] = useState('newest');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    rating: 5,
    title: '',
    comment: ''
  });

  useEffect(() => {
    fetchReviews();
  }, [productId, sortBy]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/reviews/product/${productId}?sort=${sortBy}`);
      if (!response.ok) throw new Error('Failed to fetch reviews');
      
      const data = await response.json();
      setReviews(data.reviews || []);
      setRatingDistribution(data.ratingDistribution);
      setTotalReviews(data.totalReviews);

      if (data.reviews.length > 0) {
        const avgRating =
          data.reviews.reduce((sum: number, r: Review) => sum + r.rating, 0) /
          data.reviews.length;
        setAverageRating(Math.round(avgRating * 10) / 10);
      }
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      setSubmitLoading(true);

      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to submit a review');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          productId,
          ...formData
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit review');
      }

      setSuccess('Review submitted successfully! It will appear after admin approval.');
      setFormData({ rating: 5, title: '', comment: '' });
      setShowForm(false);

      setTimeout(() => {
        fetchReviews();
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Failed to submit review');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleHelpful = async (reviewId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/reviews/${reviewId}/helpful`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        fetchReviews();
      }
    } catch (err) {
      console.error('Failed to mark as helpful:', err);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg p-6 mt-8">
      <h2 className="text-2xl font-bold mb-6">Customer Reviews & Ratings</h2>

      {/* Rating Summary */}
      {totalReviews > 0 && (
        <div className="mb-8 pb-8 border-b">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center gap-4">
                <div className="text-4xl font-bold">{averageRating}</div>
                <div>
                  {renderStars(Math.round(averageRating))}
                  <p className="text-gray-600 text-sm mt-2">{totalReviews} review{totalReviews !== 1 ? 's' : ''}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((stars) => (
                <div key={stars} className="flex items-center gap-2">
                  <span className="text-sm w-12">{stars} star</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full"
                      style={{
                        width: `${totalReviews > 0 ? (ratingDistribution[stars as keyof typeof ratingDistribution] / totalReviews) * 100 : 0}%`
                      }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-12">
                    {ratingDistribution[stars as keyof typeof ratingDistribution]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Write Review Button */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="mb-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Write a Review
        </button>
      )}

      {/* Review Form */}
      {showForm && (
        <form onSubmit={handleSubmitReview} className="mb-8 p-6 bg-gray-50 rounded-lg">
          <h3 className="font-bold mb-4">Share Your Experience</h3>

          {error && <div className="text-red-600 mb-4 p-2 bg-red-50 rounded">{error}</div>}
          {success && <div className="text-green-600 mb-4 p-2 bg-green-50 rounded">{success}</div>}

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData({ ...formData, rating: star })}
                  className="p-1"
                >
                  <Star
                    size={24}
                    className={
                      star <= formData.rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="What's your headline?"
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Your Review</label>
            <textarea
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              placeholder="Share your experience with this product"
              required
              rows={4}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={submitLoading}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
              {submitLoading ? 'Submitting...' : 'Submit Review'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-6 py-2 border rounded hover:bg-gray-100"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Sort Options */}
      {reviews.length > 0 && (
        <div className="mb-6">
          <label className="mr-4 font-medium">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option value="newest">Newest First</option>
            <option value="highest">Highest Rating</option>
            <option value="lowest">Lowest Rating</option>
            <option value="helpful">Most Helpful</option>
          </select>
        </div>
      )}

      {/* Reviews List */}
      {loading ? (
        <div className="text-center text-gray-600 py-8">Loading reviews...</div>
      ) : reviews.length > 0 ? (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id || review._id} className="border-b pb-6 last:border-b-0">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <h4 className="font-bold text-lg">{review.title}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    {renderStars(review.rating)}
                    <span className="text-sm text-gray-600">
                      by {review.userName} • {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-gray-700 mb-3">{review.comment}</p>
              <div className="flex gap-4 text-sm">
                <button
                  onClick={() => handleHelpful(review.id || review._id || '')}
                  className="text-blue-600 hover:underline"
                >
                  Helpful ({review.helpful})
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600 py-8">No reviews yet. Be the first to review this product!</p>
      )}
    </div>
  );
};

export default ProductReviews;
