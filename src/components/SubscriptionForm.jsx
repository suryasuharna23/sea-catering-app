"use client";

import React, { useState, useEffect } from 'react';
import { useFirebase } from '../context/FirebaseContext';
import { collection, addDoc } from 'firebase/firestore';
import ModalMessage from './ModalMessage';
import { useRouter } from 'next/navigation';

const planOptions = [
  { name: 'Diet Plan', price: 30000 },
  { name: 'Protein Plan', price: 40000 },
  { name: 'Royal Plan', price: 60000 },
];

const mealTypeOptions = [
  'Breakfast', 'Lunch', 'Dinner'
];

const deliveryDaysOptions = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];

const SubscriptionForm = () => {
  const { db, auth, userId, isAuthReady } = useFirebase();
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    planSelection: '',
    mealTypes: [],
    deliveryDays: [],
    allergies: '',
  });
  const [totalPrice, setTotalPrice] = useState(0);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (isAuthReady && auth && auth.currentUser && auth.currentUser.isAnonymous) {
      setMessage('Anda harus login untuk berlangganan. Silakan login atau daftar.');
      router.push('/login');
    }
  }, [isAuthReady, auth, router]);

  useEffect(() => {
    const calculatePrice = () => {
      const selectedPlan = planOptions.find(plan => plan.name === formData.planSelection);
      if (selectedPlan && formData.mealTypes.length > 0 && formData.deliveryDays.length > 0) {
        const price = selectedPlan.price * formData.mealTypes.length * formData.deliveryDays.length * 4.3;
        setTotalPrice(price);
      } else {
        setTotalPrice(0);
      }
    };
    calculatePrice();
  }, [formData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
        ? [...prev[name], value]
        : prev[name].filter(item => item !== value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthReady || !db || !userId || auth.currentUser.isAnonymous) {
      setMessage('Anda harus login untuk berlangganan.');
      router.push('/login');
      return;
    }

    if (!formData.fullName || !formData.phoneNumber || !formData.planSelection || formData.mealTypes.length === 0 || formData.deliveryDays.length === 0) {
      setMessage('Harap lengkapi semua bidang yang wajib diisi.');
      return;
    }

    try {
      const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
      const subscriptionsCollectionRef = collection(db, `artifacts/${appId}/users/${userId}/subscriptions`);

      await addDoc(subscriptionsCollectionRef, {
        ...formData,
        totalPrice: totalPrice,
        userId: userId,
        subscriptionDate: new Date().toISOString(),
        status: 'active', // Default status for new subscriptions
      });
      setMessage('Langganan Anda berhasil disimpan!');
      setFormData({
        fullName: '',
        phoneNumber: '',
        planSelection: '',
        mealTypes: [],
        deliveryDays: [],
        allergies: '',
      });
      setTotalPrice(0);
    } catch (error) {
      console.error("Error saving subscription:", error);
      setMessage('Terjadi kesalahan saat menyimpan langganan Anda. Silakan coba lagi.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <header className="text-center mb-12">
        <h1 className="text-5xl font-extrabold text-green-700 mb-4">Subscribe to a Meal Plan</h1>
        <p className="text-xl text-gray-700">Customize your healthy meals and get them delivered!</p>
        {userId && (
          <p className="text-sm text-gray-500 mt-2">
            Your User ID: <span className="font-mono bg-gray-200 px-2 py-1 rounded">{userId}</span>
          </p>
        )}
      </header>

      <div className="bg-white shadow-lg rounded-lg p-8 max-w-3xl mx-auto w-full">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="fullName" className="block text-gray-700 text-sm font-bold mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                required
                className="shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label htmlFor="phoneNumber" className="block text-gray-700 text-sm font-bold mb-2">
                Active Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                required
                className="shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="planSelection" className="block text-gray-700 text-sm font-bold mb-2">
              Plan Selection <span className="text-red-500">*</span>
            </label>
            <select
              id="planSelection"
              name="planSelection"
              value={formData.planSelection}
              onChange={handleInputChange}
              required
              className="shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select a plan</option>
              {planOptions.map(plan => (
                <option key={plan.name} value={plan.name}>
                  {plan.name} - Rp{plan.price.toLocaleString('id-ID')} per meal
                </option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Meal Type <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-4">
              {mealTypeOptions.map(type => (
                <label key={type} className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="mealTypes"
                    value={type}
                    checked={formData.mealTypes.includes(type)}
                    onChange={handleCheckboxChange}
                    className="form-checkbox h-5 w-5 text-green-600 rounded"
                  />
                  <span className="ml-2 text-gray-700">{type}</span>
                </label>
              ))}
            </div>
            {formData.mealTypes.length === 0 && (
              <p className="text-red-500 text-xs mt-1">At least one meal type must be selected.</p>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Delivery Days <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {deliveryDaysOptions.map(day => (
                <label key={day} className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="deliveryDays"
                    value={day}
                    checked={formData.deliveryDays.includes(day)}
                    onChange={handleCheckboxChange}
                    className="form-checkbox h-5 w-5 text-green-600 rounded"
                  />
                  <span className="ml-2 text-gray-700">{day}</span>
                </label>
              ))}
            </div>
            {formData.deliveryDays.length === 0 && (
              <p className="text-red-500 text-xs mt-1">At least one delivery day must be selected.</p>
            )}
          </div>

          <div className="mb-6">
            <label htmlFor="allergies" className="block text-gray-700 text-sm font-bold mb-2">
              Allergies / Dietary Restrictions (Optional)
            </label>
            <textarea
              id="allergies"
              name="allergies"
              value={formData.allergies}
              onChange={handleInputChange}
              rows="3"
              className="shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500"
            ></textarea>
          </div>

          <div className="text-center text-2xl font-bold text-green-800 mb-8 p-4 bg-green-100 rounded-md">
            Total Price: Rp{totalPrice.toLocaleString('id-ID')}
          </div>

          <div className="flex items-center justify-center">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-300"
              disabled={!isAuthReady || formData.mealTypes.length === 0 || formData.deliveryDays.length === 0 || (auth && auth.currentUser && auth.currentUser.isAnonymous)}
            >
              Subscribe Now
            </button>
          </div>
        </form>
      </div>
      <ModalMessage message={message} onClose={() => setMessage('')} />
    </div>
  );
};

export default SubscriptionForm;
