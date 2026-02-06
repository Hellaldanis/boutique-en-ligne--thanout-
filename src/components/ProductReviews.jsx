import React, { useState, useEffect, useCallback } from 'react';
import { API_ENDPOINTS, getAuthHeaders } from '../config/api';
import { useAuthStore } from '../store';

const INITIAL_REVIEW = { rating: 5, title: '', comment: '' };

const ProductReviews = ({ productId, productName }) => {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({ averageRating: 0, totalReviews: 0, distribution: {} });
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState(INITIAL_REVIEW);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const { isAuthenticated, user } = useAuthStore((state) => ({
    isAuthenticated: state.isAuthenticated,
    user: state.user,
  }));

  const loadReviews = useCallback(async (pageToLoad = 1, append = false) => {
    if (append) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }
    setError('');

    try {
      const params = new URLSearchParams();
      params.set('page', String(pageToLoad));
      params.set('limit', '5');

      const response = await fetch(`${API_ENDPOINTS.REVIEWS.PRODUCT(productId)}?${params.toString()}`);
      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}));
        throw new Error(errBody.message || 'Impossible de charger les avis');
      }

      const data = await response.json();
      const fetchedReviews = Array.isArray(data.reviews) ? data.reviews : [];
      setReviews((prev) => (append ? [...prev, ...fetchedReviews] : fetchedReviews));
      setPagination(data.pagination || null);
      setStats({
        averageRating: Number(data.stats?.averageRating || 0),
        totalReviews: data.stats?.totalReviews ?? fetchedReviews.length,
        distribution: data.stats?.distribution || {},
      });
      setPage(pageToLoad);
    } catch (err) {
      console.error('Reviews fetch error:', err);
      setError(err.message || 'Impossible de charger les avis');
      if (!append) {
        setReviews([]);
      }
    } finally {
      if (append) {
        setLoadingMore(false);
      } else {
        setLoading(false);
      }
    }
  }, [productId]);

  useEffect(() => {
    loadReviews(1, false);
  }, [loadReviews]);

  useEffect(() => {
    setShowReviewForm(false);
    setNewReview(INITIAL_REVIEW);
  }, [productId]);

  const renderStars = (rating, interactive = false, onChange = null) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => interactive && onChange && onChange(star)}
          className={`text-2xl ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''} ${
            star <= rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'
          }`}
          disabled={!interactive}
        >
          ★
        </button>
      ))}
    </div>
  );

  const validateReviewForm = () => {
    const newErrors = {};

    if (!newReview.comment.trim()) {
      newErrors.comment = 'Le commentaire est requis';
    } else if (newReview.comment.trim().length < 10) {
      newErrors.comment = 'Le commentaire doit contenir au moins 10 caractères';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOpenReviewForm = () => {
    if (!isAuthenticated) {
      setErrors({ form: 'Connectez-vous pour publier un avis.' });
      return;
    }
    setErrors({});
    setShowReviewForm(true);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setErrors({ form: 'Connectez-vous pour publier un avis.' });
      return;
    }
    if (!validateReviewForm()) {
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(API_ENDPOINTS.REVIEWS.CREATE(productId), {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify({
          rating: newReview.rating,
          title: newReview.title.trim() || undefined,
          comment: newReview.comment.trim(),
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.message || 'Impossible de publier votre avis');
      }

      setShowReviewForm(false);
      setNewReview(INITIAL_REVIEW);
      setErrors({});
      loadReviews(1, false);
    } catch (err) {
      console.error('Create review error:', err);
      setErrors({ form: err.message || 'Impossible de publier votre avis.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleHelpful = async (reviewId) => {
    if (!isAuthenticated) {
      setError('Connectez-vous pour voter sur un avis.');
      return;
    }

    try {
      const response = await fetch(API_ENDPOINTS.REVIEWS.MARK_HELPFUL(reviewId), {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include',
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.message || 'Impossible de mettre à jour votre vote');
      }

      const delta = data.helpful ? 1 : -1;
      setReviews((prev) => prev.map((review) =>
        review.id === reviewId
          ? { ...review, helpfulCount: Math.max(0, (review.helpfulCount || 0) + delta) }
          : review
      ));
    } catch (err) {
      console.error('Helpful error:', err);
      setError(err.message || 'Impossible de mettre à jour votre vote.');
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!isAuthenticated) {
      setError('Connectez-vous pour supprimer votre avis.');
      return;
    }

    if (typeof window !== 'undefined' && !window.confirm('Supprimer votre avis ?')) {
      return;
    }

    try {
      const response = await fetch(API_ENDPOINTS.REVIEWS.DELETE(reviewId), {
        method: 'DELETE',
        headers: getAuthHeaders(),
        credentials: 'include',
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.message || 'Impossible de supprimer votre avis');
      }
      loadReviews(1, false);
    } catch (err) {
      console.error('Delete review error:', err);
      setError(err.message || 'Impossible de supprimer votre avis.');
    }
  };

  const hasMore = pagination ? page < pagination.pages : false;
  const totalReviews = stats.totalReviews || reviews.length;
  const averageRating = Number(stats.averageRating || 0);
  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, ...stats.distribution };

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const reviewerName = (review) => {
    const first = review.user?.firstName || '';
    const lastInitial = review.user?.lastName ? `${review.user.lastName.charAt(0)}.` : '';
    const fallback = first || lastInitial ? `${first} ${lastInitial}`.trim() : 'Client Thanout';
    return fallback;
  };

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6">Avis clients</h2>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-6">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="text-center">
            <div className="text-5xl font-bold mb-2">{averageRating.toFixed(1)}</div>
            {renderStars(Math.round(averageRating))}
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Basé sur {totalReviews} avis
            </p>
          </div>

          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center gap-2">
                <span className="text-sm w-12">{rating} ★</span>
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full"
                    style={{
                      width: `${totalReviews ? (distribution[rating] / totalReviews) * 100 : 0}%`,
                    }}
                  />
                </div>
                <span className="text-sm w-8 text-right">{distribution[rating] || 0}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {!showReviewForm && (
        <button
          onClick={handleOpenReviewForm}
          className="mb-6 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
        >
          Écrire un avis
        </button>
      )}

      {!showReviewForm && errors.form && (
        <p className="-mt-4 mb-6 text-sm text-red-500">{errors.form}</p>
      )}

      {showReviewForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-6">
          <h3 className="text-xl font-bold mb-4">Partagez votre avis</h3>
          {errors.form && <p className="mb-4 text-sm text-red-500">{errors.form}</p>}
          <form onSubmit={handleSubmitReview}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Titre de l'avis</label>
              <input
                type="text"
                value={newReview.title}
                onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600"
                placeholder={`Ex: Parfait pour ${productName || 'ce produit'}`}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Note *</label>
              {renderStars(newReview.rating, true, (rating) => setNewReview({ ...newReview, rating }))}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Votre commentaire *</label>
              <textarea
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                rows="4"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 ${
                  errors.comment ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Partagez votre expérience avec ce produit..."
              />
              {errors.comment && <p className="mt-1 text-sm text-red-500">{errors.comment}</p>}
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium disabled:opacity-60"
              >
                {submitting ? 'Publication...' : "Publier l'avis"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowReviewForm(false);
                  setNewReview(INITIAL_REVIEW);
                  setErrors({});
                }}
                className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {loading && reviews.length === 0 ? (
          <div className="text-center py-6 text-gray-500 dark:text-gray-400">
            Chargement des avis...
          </div>
        ) : (
          <>
            {reviews.map((review) => {
              const isOwner = user?.id && review.userId === user.id;
              return (
                <div key={review.id} className="bg-white dark:bg-gray-800 rounded-lg p-6">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">{reviewerName(review)}</p>
                        {review.isVerifiedPurchase && (
                          <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                            Achat vérifié
                          </span>
                        )}
                      </div>
                      {review.title && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">{review.title}</p>
                      )}
                      <div className="mt-2">{renderStars(review.rating)}</div>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 text-right">
                      {review.createdAt ? formatDate(review.createdAt) : ''}
                    </div>
                  </div>

                  <p className="text-gray-700 dark:text-gray-300 mb-4 whitespace-pre-line">{review.comment}</p>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <button
                      onClick={() => handleHelpful(review.id)}
                      className="flex items-center gap-2 hover:text-primary transition-colors"
                    >
                      <span>👍</span>
                      Utile ({review.helpfulCount || 0})
                    </button>
                    {isOwner && (
                      <button
                        onClick={() => handleDeleteReview(review.id)}
                        className="hover:text-red-500 transition-colors"
                      >
                        Supprimer
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            {!loading && reviews.length === 0 && (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                Aucun avis pour le moment. Soyez le premier à donner votre avis !
              </div>
            )}

            {hasMore && (
              <div className="text-center mt-6">
                <button
                  onClick={() => loadReviews(page + 1, true)}
                  disabled={loadingMore}
                  className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-60"
                >
                  {loadingMore ? 'Chargement...' : "Afficher plus d'avis"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProductReviews;
