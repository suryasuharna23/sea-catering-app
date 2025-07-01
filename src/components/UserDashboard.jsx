"use client";

import React, { useState, useEffect } from 'react';
import { useFirebase } from '../context/FirebaseContext';
import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import Link from 'next/link'; // Import Link component
import ModalMessage from './ModalMessage';

const UserDashboard = () => {
  const { db, auth, userId, isAuthReady } = useFirebase();
  const router = useRouter();
  const [subscriptions, setSubscriptions] = useState([]);
  const [message, setMessage] = useState('');
  const [isPauseModalOpen, setIsPauseModalOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [pauseEndDate, setPauseEndDate] = useState('');

  useEffect(() => {
    if (!isAuthReady) return;

    if (!auth || !auth.currentUser || auth.currentUser.isAnonymous) {
      setMessage('Anda harus login untuk melihat dashboard Anda.');
      router.push('/login');
      return;
    }

    if (db && userId) {
      const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
      const q = query(collection(db, `artifacts/${appId}/users/${userId}/subscriptions`), where('userId', '==', userId));

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const fetchedSubscriptions = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setSubscriptions(fetchedSubscriptions);
      }, (error) => {
        console.error("Error fetching user subscriptions:", error);
        setMessage('Gagal memuat langganan Anda.');
      });

      return () => unsubscribe();
    }
  }, [db, auth, userId, isAuthReady, router]);

  const openPauseModal = (subscription) => {
    setSelectedSubscription(subscription);
    setPauseEndDate('');
    setIsPauseModalOpen(true);
  };

  const closePauseModal = () => {
    setIsPauseModalOpen(false);
    setSelectedSubscription(null);
    setPauseEndDate('');
  };

  const handlePauseSubscription = async () => {
    if (!selectedSubscription || !pauseEndDate) {
      setMessage('Harap pilih tanggal akhir jeda.');
      return;
    }

    try {
      const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
      const subscriptionRef = doc(db, `artifacts/${appId}/users/${userId}/subscriptions`, selectedSubscription.id);
      const adminSubscriptionRef = doc(db, `artifacts/${appId}/public/data/all_subscriptions_for_admin`, selectedSubscription.id);

      await updateDoc(subscriptionRef, {
        status: 'paused',
        pausedUntil: pauseEndDate,
        previousStatus: selectedSubscription.status,
        lastStatusChangeDate: new Date().toISOString(),
      });
      await updateDoc(adminSubscriptionRef, {
        status: 'paused',
        pausedUntil: pauseEndDate,
        previousStatus: selectedSubscription.status,
        lastStatusChangeDate: new Date().toISOString(),
      });

      setMessage('Langganan berhasil dijeda!');
      closePauseModal();
    } catch (error) {
      console.error("Error pausing subscription:", error);
      setMessage('Terjadi kesalahan saat menjeda langganan.');
    }
  };

  const handleCancelSubscription = async (subscriptionId, currentStatus) => {
    if (!confirm('Apakah Anda yakin ingin membatalkan langganan ini?')) {
      return;
    }

    try {
      const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
      const subscriptionRef = doc(db, `artifacts/${appId}/users/${userId}/subscriptions`, subscriptionId);
      const adminSubscriptionRef = doc(db, `artifacts/${appId}/public/data/all_subscriptions_for_admin`, subscriptionId);

      await updateDoc(subscriptionRef, {
        status: 'cancelled',
        pausedUntil: null,
        previousStatus: currentStatus,
        lastStatusChangeDate: new Date().toISOString(),
      });
      await updateDoc(adminSubscriptionRef, {
        status: 'cancelled',
        pausedUntil: null,
        previousStatus: currentStatus,
        lastStatusChangeDate: new Date().toISOString(),
      });

      setMessage('Langganan berhasil dibatalkan!');
    } catch (error) {
      console.error("Error canceling subscription:", error);
      setMessage('Terjadi kesalahan saat membatalkan langganan.');
    }
  };

  const handleReactivateSubscription = async (subscriptionId, currentStatus) => {
    try {
      const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
      const subscriptionRef = doc(db, `artifacts/${appId}/users/${userId}/subscriptions`, subscriptionId);
      const adminSubscriptionRef = doc(db, `artifacts/${appId}/public/data/all_subscriptions_for_admin`, subscriptionId);

      await updateDoc(subscriptionRef, {
        status: 'active',
        pausedUntil: null,
        previousStatus: currentStatus,
        lastStatusChangeDate: new Date().toISOString(),
      });
      await updateDoc(adminSubscriptionRef, {
        status: 'active',
        pausedUntil: null,
        previousStatus: currentStatus,
        lastStatusChangeDate: new Date().toISOString(),
      });

      setMessage('Langganan berhasil diaktifkan kembali!');
    } catch (error) {
      console.error("Error reactivating subscription:", error);
      setMessage('Terjadi kesalahan saat mengaktifkan kembali langganan.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <header className="text-center mb-12">
        <h1 className="text-5xl font-extrabold text-green-700 mb-4">Your Dashboard</h1>
        <p className="text-xl text-gray-700">Manage your SEA Catering subscriptions here.</p>
        {userId && (
          <p className="text-sm text-gray-500 mt-2">
            User ID: <span className="font-mono bg-gray-200 px-2 py-1 rounded">{userId}</span>
          </p>
        )}
      </header>

      <div className="max-w-4xl mx-auto">
        {subscriptions.length === 0 ? (
          <div className="bg-white shadow-lg rounded-lg p-8 text-center">
            <p className="text-lg text-gray-600">Anda belum memiliki langganan aktif.</p>
            <Link href="/subscription" className="mt-4 inline-block bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors">
              Mulai Berlangganan Sekarang
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {subscriptions.map((sub) => (
              <div key={sub.id} className="bg-white shadow-lg rounded-lg p-6">
                <h2 className="text-2xl font-bold text-green-700 mb-2">{sub.planSelection}</h2>
                <p className="text-gray-700 mb-1">
                  <span className="font-semibold">Status: </span>
                  <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                    sub.status === 'active' ? 'bg-green-100 text-green-800' :
                    sub.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
                  </span>
                </p>
                {sub.status === 'paused' && sub.pausedUntil && (
                  <p className="text-gray-600 text-sm mb-2">
                    Dijeda hingga: {new Date(sub.pausedUntil).toLocaleDateString('id-ID')}
                  </p>
                )}
                <p className="text-gray-700 mb-1">
                  <span className="font-semibold">Jenis Makanan:</span> {sub.mealTypes.join(', ')}
                </p>
                <p className="text-gray-700 mb-1">
                  <span className="font-semibold">Hari Pengiriman:</span> {sub.deliveryDays.join(', ')}
                </p>
                <p className="text-gray-700 mb-1">
                  <span className="font-semibold">Alergi:</span> {sub.allergies || 'Tidak ada'}
                </p>
                <p className="text-xl font-bold text-green-800 mt-3">
                  Total Harga: Rp{sub.totalPrice.toLocaleString('id-ID')}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Tanggal Langganan: {new Date(sub.subscriptionDate).toLocaleDateString('id-ID')}
                </p>

                <div className="mt-4 flex flex-wrap gap-3">
                  {sub.status === 'active' && (
                    <button
                      onClick={() => openPauseModal(sub)}
                      className="bg-yellow-600 text-white py-2 px-4 rounded-md hover:bg-yellow-700 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    >
                      Jeda Langganan
                    </button>
                  )}
                  {(sub.status === 'active' || sub.status === 'paused') && (
                    <button
                      onClick={() => handleCancelSubscription(sub.id, sub.status)}
                      className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      Batalkan Langganan
                    </button>
                  )}
                  {sub.status !== 'active' && (
                    <button
                      onClick={() => handleReactivateSubscription(sub.id, sub.status)}
                      className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      Aktifkan Kembali
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isPauseModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-sm w-full relative">
            <h3 className="text-xl font-bold text-green-700 mb-4">Jeda Langganan</h3>
            <p className="mb-4 text-gray-700">Pilih tanggal akhir jeda untuk langganan "{selectedSubscription?.planSelection}".</p>
            <input
              type="date"
              value={pauseEndDate}
              onChange={(e) => setPauseEndDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full p-2 border border-gray-300 rounded-md mb-6 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={closePauseModal}
                className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handlePauseSubscription}
                className="bg-yellow-600 text-white py-2 px-4 rounded-md hover:bg-yellow-700 transition-colors"
              >
                Jeda
              </button>
            </div>
          </div>
        </div>
      )}
      <ModalMessage message={message} onClose={() => setMessage('')} />
    </div>
  );
};

export default UserDashboard;
