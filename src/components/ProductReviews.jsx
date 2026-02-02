import React, { useState } from 'react';

const ProductReviews = ({ productId, productName }) => {
  const [reviews, setReviews] = useState([
    {
      id: 1,
      author: 'Marie L.',
      rating: 5,
      date: '2026-01-28',
      comment: 'Excellent produit ! Très satisfaite de ma commande. La qualité est au rendez-vous.',
      helpful: 12
    },
    {
      id: 2,
      author: 'Amadou D.',
      rating: 4,
      date: '2026-01-25',
      comment: 'Très bon rapport qualité-prix. Livraison rapide. Je recommande !',
      helpful: 8
    },
    {
      id: 3,
      author: 'Fatou S.',
      rating: 5,
      date: '2026-01-20',
      comment: 'Conforme à mes attentes. Je suis ravie de cet achat.',
      helpful: 5
    }
  ]);

  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    author: '',
    rating: 5,
    comment: ''
  });
  const [errors, setErrors] = useState({});

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      distribution[review.rating]++;
    });
    return distribution;
  };

  const renderStars = (rating, interactive = false, onChange = null) => {
    return (
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
  };

  const validateReviewForm = () => {
    const newErrors = {};
    
    if (!newReview.author.trim()) {
      newErrors.author = 'Le nom est requis';
    }
    
    if (!newReview.comment.trim()) {
      newErrors.comment = 'Le commentaire est requis';
    } else if (newReview.comment.trim().length < 10) {
      newErrors.comment = 'Le commentaire doit contenir au moins 10 caractères';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    
    if (validateReviewForm()) {
      const review = {
        id: reviews.length + 1,
        author: newReview.author,
        rating: newReview.rating,
        date: new Date().toISOString().split('T')[0],
        comment: newReview.comment,
        helpful: 0
      };
      
      setReviews([review, ...reviews]);
      setNewReview({ author: '', rating: 5, comment: '' });
      setShowReviewForm(false);
      setErrors({});
    }
  };

  const handleHelpful = (reviewId) => {
    setReviews(reviews.map(review =>
      review.id === reviewId
        ? { ...review, helpful: review.helpful + 1 }
        : review
    ));
  };

  const distribution = getRatingDistribution();
  const averageRating = calculateAverageRating();

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6">Avis clients</h2>
      
      {/* Rating Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-6">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="text-center">
            <div className="text-5xl font-bold mb-2">{averageRating}</div>
            {renderStars(Math.round(parseFloat(averageRating)))}
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Basé sur {reviews.length} avis
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
                      width: `${reviews.length > 0 ? (distribution[rating] / reviews.length) * 100 : 0}%`
                    }}
                  ></div>
                </div>
                <span className="text-sm w-8">{distribution[rating]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Review Button */}
      {!showReviewForm && (
        <button
          onClick={() => setShowReviewForm(true)}
          className="mb-6 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
        >
          Écrire un avis
        </button>
      )}

      {/* Review Form */}
      {showReviewForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-6">
          <h3 className="text-xl font-bold mb-4">Partagez votre avis</h3>
          <form onSubmit={handleSubmitReview}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Votre nom *
              </label>
              <input
                type="text"
                value={newReview.author}
                onChange={(e) => setNewReview({ ...newReview, author: e.target.value })}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 ${
                  errors.author ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Votre nom"
              />
              {errors.author && (
                <p className="mt-1 text-sm text-red-500">{errors.author}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Note *
              </label>
              {renderStars(newReview.rating, true, (rating) => 
                setNewReview({ ...newReview, rating })
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Votre commentaire *
              </label>
              <textarea
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                rows="4"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 ${
                  errors.comment ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Partagez votre expérience avec ce produit..."
              ></textarea>
              {errors.comment && (
                <p className="mt-1 text-sm text-red-500">{errors.comment}</p>
              )}
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
              >
                Publier l'avis
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowReviewForm(false);
                  setNewReview({ author: '', rating: 5, comment: '' });
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

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="bg-white dark:bg-gray-800 rounded-lg p-6"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="font-semibold mb-1">{review.author}</div>
                {renderStars(review.rating)}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(review.date).toLocaleDateString('fr-FR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
            
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              {review.comment}
            </p>
            
            <button
              onClick={() => handleHelpful(review.id)}
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary transition-colors flex items-center gap-2"
            >
              <span>👍</span>
              Utile ({review.helpful})
            </button>
          </div>
        ))}
      </div>

      {reviews.length === 0 && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          Aucun avis pour le moment. Soyez le premier à donner votre avis !
        </div>
      )}
    </div>
  );
};

export default ProductReviews;
