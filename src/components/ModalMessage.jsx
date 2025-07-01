"use client";

import React from 'react';

const ModalMessage = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-sm w-full relative text-center">
        <p className="text-lg text-gray-800 mb-6">{message}</p>
        <button
          onClick={onClose}
          className="bg-green-600 text-white py-2 px-6 rounded-md hover:bg-green-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default ModalMessage;
