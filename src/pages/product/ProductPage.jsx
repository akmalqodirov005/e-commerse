import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { Carousel, message, Spin } from 'antd';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../features/cartSlice/cartSlice';
import api from '../../services/api';
import { ArrowLeft, ShoppingCart, Heart, Share2, Star } from 'lucide-react';
import { useState } from 'react';

const ProductPage = () => {
  const { productId } = useParams();
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  const { data: product, isLoading, isError } = useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      const res = await api.get(`/products/${productId}`);
      return res.data;
    },
  });

  const handleAddToCart = () => {
  dispatch(addToCart({ ...product, qty: quantity }));
  message.success(`${product.title} added to cart`);
};

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Spin size="large" />
          <p className="mt-4 text-gray-500">Loading product...</p>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-xl text-gray-900 mb-4">Product not found</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const images = product?.images && product.images.length > 0 
    ? product.images 
    : ['https://via.placeholder.com/600'];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-[100px]">
        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Products</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="aspect-square">
                <Carousel autoplay arrows className="h-full">
                  {images.map((img, i) => (
                    <div key={i} className="h-full">
                      <img
                        src={img}
                        alt={`${product.title} - ${i + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/600';
                        }}
                      />
                    </div>
                  ))}
                </Carousel>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Title */}
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                {product.title}
              </h1>
              
            </div>

            {/* Price */}
            <div className="py-4 border-y border-gray-200">
              <p className="text-4xl font-bold text-gray-900">
                ${product.price}
              </p>
              <p className="text-sm text-green-600 mt-1">In Stock</p>
            </div>

            {/* Description */}
            {product.description && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Description
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* Quantity Selector */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">
                Quantity
              </h3>
              <div className="inline-flex items-center border-2 border-gray-200 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  -
                </button>
                <span className="px-6 py-2 font-semibold text-gray-900">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4">
              <button
                onClick={handleAddToCart}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-all active:scale-95 shadow-lg hover:shadow-xl"
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;