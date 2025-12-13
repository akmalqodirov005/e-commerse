import { useMutation, useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import api from '../../services/api';
import { Eye, EyeOff } from 'lucide-react';
import { useParams } from 'react-router-dom';

const Admin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { data: user, isLoading, error } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const res = await api.get('/auth/profile');
      return res.data;
    },
  });


  // Loading holati
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-300 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Error holati
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg border border-red-200">
          <div className="text-center text-red-500">
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-bold mb-2">Error Loading Profile</h3>
            <p className="text-gray-600">{error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  // Ma'lumot yo'q holati
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="text-center text-gray-500">
          <p className="text-xl font-semibold">User not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg border border-gray-200">
        <div className="flex flex-col items-center text-center">
          {/* Avatar */}
          <div className="w-24 h-24 rounded-full overflow-hidden ring-2 ring-gray-200 shadow-md mb-4">
            <img
              src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=random`}
              alt={`${user?.name}'s avatar`}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=random`;
              }}
            />
          </div>

          {/* Name */}
          <h2 className="text-2xl font-bold text-gray-800 capitalize">
            {user?.name || "Unknown User"}
          </h2>

          {/* Role */}
          <span className={`mt-2 px-3 py-1 rounded-full text-sm font-medium ${
            user?.role === 'admin' 
              ? 'bg-purple-100 text-purple-700' 
              : 'bg-blue-100 text-blue-700'
          }`}>
            {user?.role || "User"}
          </span>
        </div>

        {/* Info section */}
        <div className="mt-6 space-y-3">
          <div className="bg-gray-100 p-4 rounded-xl">
            <p className="text-sm text-gray-600">Email</p>
            <p className="font-medium text-gray-800 break-all">
              {user?.email || "Not provided"}
            </p>
          </div>

          <div className="bg-gray-100 p-4 rounded-xl">
            <p className="text-sm text-gray-600">Username</p>
            <p className="font-medium text-gray-800">
              {user?.name || "Not provided"}
            </p>
          </div>

          {/* Password field with show/hide */}
          <div className="bg-gray-100 p-4 rounded-xl">
            <p className="text-sm text-gray-600 mb-1">Password</p>
            <div className="flex items-center justify-between">
              <p className="font-medium text-gray-800 font-mono">
                {showPassword 
                  ? user?.password || "••••••••" 
                  : "••••••••"}
              </p>
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="ml-2 p-1.5 hover:bg-gray-200 rounded-lg transition active:scale-95"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff size={18} className="text-gray-600" />
                ) : (
                  <Eye size={18} className="text-gray-600" />
                )}
              </button>
            </div>
          </div>

          <div className="bg-gray-100 p-4 rounded-xl">
            <p className="text-sm text-gray-600">Joined</p>
            <p className="font-medium text-gray-800">
              {user?.updatedAt 
                ? new Date(user.updatedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })
                : "Unknown"}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex gap-4">
          <button 
            disabled={true}
            onClick={() => {
              // Edit logic
              console.log("Edit profile");
            }}
            className="flex-1 py-3 rounded-xl bg-black text-white font-medium shadow hover:bg-gray-900 transition active:scale-95"
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default Admin;