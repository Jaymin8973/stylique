import React from 'react';
import { Star, MessageSquare, ThumbsUp, AlertCircle } from 'lucide-react';

const Reviews: React.FC = () => {
  const reviews = [
    {
      id: 1,
      customer: 'Alice Johnson',
      product: 'iPhone 15 Pro Max',
      rating: 5,
      comment: 'Excellent product quality and fast delivery. Highly recommended!',
      date: '2024-01-15',
      helpful: 12,
      replied: true
    },
    {
      id: 2,
      customer: 'Bob Smith',
      product: 'Samsung Galaxy S24',
      rating: 4,
      comment: 'Good phone but battery life could be better. Overall satisfied with the purchase.',
      date: '2024-01-12',
      helpful: 8,
      replied: false
    },
    {
      id: 3,
      customer: 'Carol Davis',
      product: 'MacBook Pro 16"',
      rating: 2,
      comment: 'Product arrived with minor scratches. Disappointed with the packaging.',
      date: '2024-01-10',
      helpful: 3,
      replied: true
    },
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'text-green-600';
    if (rating >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Reviews & Ratings</h1>
        <button className="flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
          <MessageSquare className="w-4 h-4 mr-2" />
          Bulk Reply
        </button>
      </div>

      {/* Review Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Overall Rating</p>
              <div className="flex items-center mt-1">
                <p className="text-2xl font-bold text-gray-900">4.7</p>
                <div className="flex ml-2">
                  {renderStars(5)}
                </div>
              </div>
            </div>
            <Star className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Reviews</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">342</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div>
            <p className="text-sm font-medium text-gray-600">Pending Responses</p>
            <p className="text-2xl font-bold text-orange-600 mt-1">15</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div>
            <p className="text-sm font-medium text-gray-600">Response Rate</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">87%</p>
          </div>
        </div>
      </div>

      {/* Rating Distribution */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Rating Distribution</h2>
        </div>
        <div className="p-6">
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className="flex items-center space-x-4">
                <div className="flex items-center space-x-1 w-16">
                  <span className="text-sm font-medium">{star}</span>
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-400 h-2 rounded-full"
                    style={{ width: `${star === 5 ? 60 : star === 4 ? 25 : star === 3 ? 10 : star === 2 ? 3 : 2}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-500 w-12">
                  {star === 5 ? '205' : star === 4 ? '85' : star === 3 ? '34' : star === 2 ? '10' : '8'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Recent Reviews</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {reviews.map((review) => (
            <div key={review.id} className="p-6">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-600">
                    {review.customer.charAt(0)}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-medium text-gray-900">{review.customer}</h3>
                    <div className="flex">{renderStars(review.rating)}</div>
                    <span className={`text-sm font-medium ${getRatingColor(review.rating)}`}>
                      {review.rating}/5
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{review.product}</p>
                  <p className="text-gray-900 mb-3">{review.comment}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>{review.date}</span>
                      <div className="flex items-center space-x-1">
                        <ThumbsUp className="w-4 h-4" />
                        <span>{review.helpful} helpful</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {review.replied ? (
                        <span className="text-sm text-green-600">Replied</span>
                      ) : (
                        <button className="text-sm text-black hover:underline">
                          Reply
                        </button>
                      )}
                      {review.rating <= 2 && (
                        <AlertCircle className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reviews;