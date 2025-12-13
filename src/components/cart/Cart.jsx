import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  increase,
  decrease,
  removeItem,
} from "../../features/cartSlice/cartSlice";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import EyesFollow from "../EyesFollow/EyesFollow";
import SplashCursor from "../SplashCursor/SplashCursor";

const Cart = () => {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.cart.items);

  const totalPrice = items.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  return (
    <div className="min-h-screen mt-[80px] bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft size={24} className="text-gray-700" />
              </Link>
              <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
                Shopping Cart
              </h1>
            </div>

            <div className="flex items-center gap-2 text-gray-600">
              <ShoppingBag size={24} />
              <span className="text-lg font-medium">
                {items.length} {items.length === 1 ? "item" : "items"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <EyesFollow />
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* LEFT SIDE - Cart items */}
            <div className="flex-1 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={item.images?.[0]}
                        alt={item.title}
                        className="w-24 sm:w-32 h-24 sm:h-32 object-cover rounded-xl"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 flex flex-col justify-between">
                      <Link to={`/products/${item.id}`}>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1 sm:mb-2">
                          {item.title}
                        </h3>
                        <p className="text-xl sm:text-2xl font-bold text-gray-900">
                          ${item.price}
                        </p>
                      </Link>

                      {/* Actions */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4 mt-3 sm:mt-4">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 sm:gap-3 bg-gray-50 rounded-lg p-1">
                          <button
                            onClick={() => dispatch(decrease(item.id))}
                            className="p-2 rounded-lg hover:bg-white transition-colors active:scale-95"
                            disabled={item.qty === 1}
                          >
                            <Minus
                              size={16}
                              className={
                                item.qty === 1
                                  ? "text-gray-300"
                                  : "text-gray-700"
                              }
                            />
                          </button>

                          <span className="text-md sm:text-lg font-semibold text-gray-900 min-w-[2rem] text-center">
                            {item.qty}
                          </span>

                          <button
                            onClick={() => dispatch(increase(item.id))}
                            className="p-2 rounded-lg hover:bg-white transition-colors active:scale-95"
                          >
                            <Plus size={16} className="text-gray-700" />
                          </button>
                        </div>

                        {/* Subtotal & Delete */}
                        <div className="flex items-center gap-3 sm:gap-4 mt-2 sm:mt-0">
                          <div className="text-right">
                            <p className="text-xs text-gray-500">Subtotal</p>
                            <p className="text-lg sm:text-xl font-bold text-gray-900">
                              ${(item.price * item.qty).toFixed(2)}
                            </p>
                          </div>

                          <button
                            onClick={() => dispatch(removeItem(item.id))}
                            className="p-2 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors active:scale-95"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* RIGHT SIDE - Order Summary */}
            <div className="lg:w-96 flex-shrink-0">
              <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 sticky top-24 lg:top-24">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">
                  Order Summary
                </h2>

                <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>
                      Subtotal ({items.length}{" "}
                      {items.length === 1 ? "item" : "items"})
                    </span>
                    <span className="font-medium text-gray-900">
                      ${totalPrice.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="font-medium text-green-600">Free</span>
                  </div>

                  <div className="border-t border-gray-200 pt-3 sm:pt-4">
                    <div className="flex justify-between text-lg sm:text-xl">
                      <span className="font-semibold text-gray-900">Total</span>
                      <span className="font-bold text-xl sm:text-2xl text-gray-900">
                        ${totalPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <button className="w-full bg-black text-white py-3 sm:py-4 rounded-xl font-semibold hover:bg-gray-800 transition-colors active:scale-95 mb-2 sm:mb-3">
                  Proceed to Checkout
                </button>

                <Link
                  to="/"
                  className="block text-center text-gray-600 hover:text-gray-900 transition-colors py-2"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
