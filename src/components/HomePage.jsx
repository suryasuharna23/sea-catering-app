"use client";

import React, { useState, useEffect } from 'react';
import { useFirebase } from '../context/FirebaseContext';
import { collection, addDoc, onSnapshot, query } from 'firebase/firestore';
import ModalMessage from './ModalMessage';

const HomePage = () => {
  const { db, userId, isAuthReady } = useFirebase();
  const [testimonials, setTestimonials] = useState([]);
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
  const [testimonialForm, setTestimonialForm] = useState({
    customerName: '',
    reviewMessage: '',
    rating: 5,
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!db || !isAuthReady) return;

    const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
    const testimonialsCollectionRef = collection(db, `artifacts/${appId}/public/data/testimonials`);
    const q = query(testimonialsCollectionRef);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedTestimonials = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTestimonials(fetchedTestimonials);
    }, (error) => {
      console.error("Error fetching testimonials:", error);
      setMessage('Gagal memuat testimonial.');
    });

    return () => unsubscribe();
  }, [db, isAuthReady]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setTestimonialForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitTestimonial = async (e) => {
    e.preventDefault();

    if (!isAuthReady || !db || !userId) {
      setMessage('Sistem autentikasi belum siap. Silakan coba lagi.');
      return;
    }

    if (!testimonialForm.customerName || !testimonialForm.reviewMessage) {
        setMessage('Nama dan ulasan harus diisi.');
        return;
    }

    try {
      const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
      const testimonialsCollectionRef = collection(db, `artifacts/${appId}/public/data/testimonials`);

      await addDoc(testimonialsCollectionRef, {
        ...testimonialForm,
        userId: userId,
        submissionDate: new Date().toISOString(),
      });
      setMessage('Testimonial Anda berhasil disimpan!');
      setTestimonialForm({ customerName: '', reviewMessage: '', rating: 5 });
    } catch (error) {
      console.error("Error saving testimonial:", error);
      setMessage('Terjadi kesalahan saat menyimpan testimonial Anda. Silakan coba lagi.');
    }
  };

  const nextTestimonial = () => {
    if (testimonials.length > 0) {
      setCurrentTestimonialIndex((prevIndex) =>
        (prevIndex + 1) % testimonials.length
      );
    }
  };

  const prevTestimonial = () => {
    if (testimonials.length > 0) {
      setCurrentTestimonialIndex((prevIndex) =>
        (prevIndex - 1 + testimonials.length) % testimonials.length
      );
    }
  };

  const currentTestimonial = testimonials[currentTestimonialIndex];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      <header className="text-center mb-12">
        <h1 className="text-5xl font-extrabold text-green-700 mb-4">SEA Catering</h1>
        <p className="text-2xl text-gray-700 italic">“Healthy Meals, Anytime, Anywhere”</p>
      </header>

      <section className="bg-white shadow-lg rounded-lg p-8 max-w-3xl text-center mb-12">
        <h2 className="text-3xl font-semibold text-green-600 mb-4">
          Your Journey to Healthy Eating Starts Here!
        </h2>
        <p className="text-lg text-gray-800 leading-relaxed">
          Selamat datang di SEA Catering, layanan katering makanan sehat yang dapat disesuaikan dan siap diantar ke seluruh Indonesia. Kami hadir untuk memudahkan Anda menikmati hidangan bergizi, disesuaikan dengan preferensi dan kebutuhan diet Anda, kapan pun dan di mana pun.
        </p>
      </section>

      <section className="bg-green-50 shadow-lg rounded-lg p-8 max-w-3xl mb-12 w-full">
        <h2 className="text-3xl font-semibold text-green-600 text-center mb-6">
          Why Choose SEA Catering?
        </h2>
        <ul className="list-disc list-inside text-lg text-gray-800 space-y-3">
          <li>
            <span className="font-medium text-green-700">Meal Customization:</span> Sesuaikan setiap hidangan dengan selera dan kebutuhan nutrisi Anda, mulai dari pilihan protein, karbohidrat, hingga sayuran.
          </li>
          <li>
            <span className="font-medium text-green-700">Nationwide Delivery:</span> Layanan antar kami mencakup kota-kota besar di seluruh Indonesia, memastikan hidangan sehat sampai ke tangan Anda.
          </li>
          <li>
            <span className="font-medium text-green-700">Detailed Nutritional Information:</span> Dapatkan informasi nutrisi lengkap untuk setiap hidangan, membantu Anda memantau asupan kalori, makro, dan mikro nutrisi.
          </li>
          <li>
            <span className="font-medium text-green-700">Diverse Meal Plans:</span> Pilihan rencana makanan yang beragam, cocok untuk berbagai tujuan diet, seperti penurunan berat badan, peningkatan massa otot, atau gaya hidup sehat secara umum.
          </li>
          <li>
            <span className="font-medium text-green-700">Fresh & High-Quality Ingredients:</span> Kami hanya menggunakan bahan-bahan segar dan berkualitas tinggi yang dipilih dengan cermat.
          </li>
        </ul>
      </section>

      <section className="bg-blue-50 shadow-lg rounded-lg p-8 max-w-3xl mb-12 w-full">
        <h2 className="text-3xl font-semibold text-blue-700 text-center mb-8">
          What Our Customers Say
        </h2>

        {testimonials.length > 0 ? (
          <div className="relative bg-white p-6 rounded-lg shadow-md mb-8 min-h-[180px] flex items-center justify-center">
            <button
              onClick={prevTestimonial}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Previous testimonial"
            >
              &#8592;
            </button>
            <div className="text-center px-10">
              {currentTestimonial && (
                <>
                  <p className="text-lg italic text-gray-700 mb-4">"{currentTestimonial.reviewMessage}"</p>
                  <p className="text-md font-semibold text-blue-800">- {currentTestimonial.customerName}</p>
                  <div className="flex justify-center mt-2">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-5 h-5 ${i < currentTestimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.683-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.565-1.83-.197-1.54-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.92 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </>
              )}
            </div>
            <button
              onClick={nextTestimonial}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Next testimonial"
            >
              &#8594;
            </button>
          </div>
        ) : (
          <p className="text-center text-gray-600 mb-8">Belum ada testimonial. Jadilah yang pertama!</p>
        )}

        <h3 className="text-2xl font-semibold text-blue-600 text-center mb-4">Share Your Experience!</h3>
        <form onSubmit={handleSubmitTestimonial} className="bg-white p-6 rounded-lg shadow-md">
          <div className="mb-4">
            <label htmlFor="customerName" className="block text-gray-700 text-sm font-bold mb-2">
              Your Name:
            </label>
            <input
              type="text"
              id="customerName"
              name="customerName"
              value={testimonialForm.customerName}
              onChange={handleFormChange}
              required
              className="shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="reviewMessage" className="block text-gray-700 text-sm font-bold mb-2">
              Your Review:
            </label>
            <textarea
              id="reviewMessage"
              name="reviewMessage"
              value={testimonialForm.reviewMessage}
              onChange={handleFormChange}
              required
              rows="4"
              className="shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>
          <div className="mb-6">
            <label htmlFor="rating" className="block text-gray-700 text-sm font-bold mb-2">
              Rating (out of 5):
            </label>
            <input
              type="number"
              id="rating"
              name="rating"
              value={testimonialForm.rating}
              onChange={handleFormChange}
              min="1"
              max="5"
              required
              className="shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center justify-center">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-300"
              disabled={!isAuthReady}
            >
              Submit Testimonial
            </button>
          </div>
        </form>
      </section>

      <footer className="bg-green-700 text-white rounded-lg p-6 max-w-md text-center">
        <h3 className="text-2xl font-semibold mb-3">Contact Us</h3>
        <p className="text-lg mb-2">Manager: Brian</p>
        <p className="text-lg">Phone Number: <a href="tel:08123456789" className="underline hover:text-green-200">08123456789</a></p>
      </footer>
      <ModalMessage message={message} onClose={() => setMessage('')} />
    </div>
  );
};

export default HomePage;
