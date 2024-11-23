// src/pages/Register.tsx
import React from 'react';

export default function Register() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
        <div>
          <h2 className="text-3xl font-bold text-center">Create Account</h2>
          <p className="mt-2 text-center text-gray-600">Join our mindful community</p>
        </div>
        <form className="mt-8 space-y-6">
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Nickname"
              className="w-full px-4 py-2 border rounded-lg"
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2 border rounded-lg"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-teal-500 text-white rounded-lg"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}