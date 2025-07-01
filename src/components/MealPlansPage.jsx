"use client"; 

import React, { useState } from 'react';
import Image from 'next/image'; 
const mealPlansData = [
  {
    id: 'diet',
    name: 'Diet Plan',
    price: 'Rp30.000,00 per meal',
    shortDescription: 'Ideal for weight loss and calorie control.',
    longDescription: 'Rencana diet rendah kalori, tinggi serat, dan kaya nutrisi untuk membantu Anda mencapai tujuan penurunan berat badan dengan sehat dan berkelanjutan. Setiap hidangan dirancang untuk memberikan rasa kenyang tanpa kelebihan kalori.',
    image: 'https://placehold.co/600x400/ADD8E6/000000?text=Diet+Plan', 
  },
  {
    id: 'protein',
    name: 'Protein Plan',
    price: 'Rp40.000,00 per meal',
    shortDescription: 'Perfect for muscle gain and active lifestyles.',
    longDescription: 'Rencana makanan tinggi protein yang dirancang untuk mendukung pertumbuhan dan pemulihan otot, cocok untuk atlet atau mereka yang aktif. Mengandung sumber protein berkualitas tinggi dan karbohidrat kompleks.',
    image: 'https://placehold.co/600x400/90EE90/000000?text=Protein+Plan', 
  },
  {
    id: 'royal',
    name: 'Royal Plan',
    price: 'Rp60.000,00 per meal',
    shortDescription: 'Premium ingredients for a luxurious healthy experience.',
    longDescription: 'Rencana premium yang menawarkan hidangan mewah dengan bahan-bahan pilihan dan nutrisi lengkap. Dirancang untuk pengalaman kuliner sehat yang istimewa, dengan fokus pada kualitas dan rasa yang tak tertandingi.',
    image: 'https://placehold.co/600x400/FFD700/000000?text=Royal+Plan', 
  },
];

const MealPlansPage = () => {
  const [selectedPlan, setSelectedPlan] = useState(null); 
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const openModal = (plan) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPlan(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <header className="text-center mb-12">
        <h1 className="text-5xl font-extrabold text-green-700 mb-4">Our Meal Plans</h1>
        <p className="text-xl text-gray-700">Choose the perfect plan for your healthy lifestyle!</p>
      </header>

      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {mealPlansData.map((plan) => (
          <div
            key={plan.id}
            className="bg-white shadow-lg rounded-lg overflow-hidden transform transition-transform hover:scale-105 duration-300 ease-in-out"
          >
            {plan.image && (
              <div className="relative w-full h-48">
                <Image
                  src={plan.image}
                  alt={plan.name}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-t-lg"
                  onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x400/CCCCCC/000000?text=Image+Not+Found'; }}
                />
              </div>
            )}
            <div className="p-6">
              <h2 className="text-2xl font-bold text-green-700 mb-2">{plan.name}</h2>
              <p className="text-xl font-semibold text-gray-800 mb-3">{plan.price}</p>
              <p className="text-gray-600 mb-4">{plan.shortDescription}</p>
              <button
                onClick={() => openModal(plan)}
                className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                See More Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && selectedPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-lg w-full relative">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-3xl font-bold focus:outline-none"
              aria-label="Close modal"
            >
              &times;
            </button>
            <h2 className="text-3xl font-bold text-green-700 mb-4">{selectedPlan.name}</h2>
            {selectedPlan.image && (
              <div className="relative w-full h-56 mb-4 rounded-md overflow-hidden">
                <Image
                  src={selectedPlan.image}
                  alt={selectedPlan.name}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-md"
                  onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x400/CCCCCC/000000?text=Image+Not+Found'; }}
                />
              </div>
            )}
            <p className="text-2xl font-semibold text-gray-800 mb-3">{selectedPlan.price}</p>
            <p className="text-gray-700 leading-relaxed">{selectedPlan.longDescription}</p>
            <div className="mt-6 text-center">
              <button
                onClick={closeModal}
                className="bg-green-600 text-white py-2 px-6 rounded-md hover:bg-green-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MealPlansPage;