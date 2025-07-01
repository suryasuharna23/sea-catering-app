"use client";

import React, { useState, useEffect } from 'react';
import { useFirebase } from '../context/FirebaseContext';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import ModalMessage from './ModalMessage';

const AdminDashboard = () => {
  const { db, auth, userRole, isAuthReady } = useFirebase();
  const router = useRouter();
  const [allSubscriptions, setAllSubscriptions] = useState([]);
  const [message, setMessage] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    if (!isAuthReady) return;

    if (!auth || !auth.currentUser || auth.currentUser.isAnonymous || userRole !== 'admin') {
      setMessage('Akses ditolak. Anda harus login sebagai admin.');
      router.push('/login');
      return;
    }

    if (db) {
      const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
      const q = query(collection(db, `artifacts/${appId}/public/data/all_subscriptions_for_admin`));

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const fetchedSubscriptions = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setAllSubscriptions(fetchedSubscriptions);
      }, (error) => {
        console.error("Error fetching all subscriptions for admin:", error);
        setMessage('Gagal memuat data langganan.');
      });

      return () => unsubscribe();
    }
  }, [db, auth, userRole, isAuthReady, router]);

  const filteredSubscriptions = allSubscriptions.filter(sub => {
    const subDate = new Date(sub.subscriptionDate);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    let inDateRange = true;
    if (start && subDate < start) inDateRange = false;
    if (end && subDate > end) inDateRange = false;

    return inDateRange;
  });

  const newSubscriptions = filteredSubscriptions.filter(sub => sub.status === 'active').length;
  const totalActiveSubscriptions = allSubscriptions.filter(sub => sub.status === 'active').length;

  const monthlyRecurringRevenue = filteredSubscriptions.reduce((sum, sub) => {
    if (sub.status === 'active') {
      return sum + sub.totalPrice;
    }
    return sum;
  }, 0);

  const reactivations = filteredSubscriptions.filter(sub =>
    sub.status === 'active' && sub.previousStatus === 'cancelled'
  ).length;

  if (!isAuthReady || !auth || !auth.currentUser || auth.currentUser.isAnonymous || userRole !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white shadow-lg rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Akses Ditolak</h2>
          <p className="text-gray-700">Anda tidak memiliki izin untuk mengakses halaman ini.</p>
          <button
            onClick={() => router.push('/login')}
            className="mt-4 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
          >
            Login
          </button>
        </div>
        <ModalMessage message={message} onClose={() => setMessage('')} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <header className="text-center mb-12">
        <h1 className="text-5xl font-extrabold text-green-700 mb-4">Admin Dashboard</h1>
        <p className="text-xl text-gray-700">Overview of SEA Catering Subscriptions</p>
      </header>

      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <div className="mb-8 p-4 bg-gray-50 rounded-md">
          <h2 className="text-2xl font-semibold text-green-700 mb-4">Filter Data</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="startDate" className="block text-gray-700 text-sm font-bold mb-2">
                Start Date:
              </label>
              <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label htmlFor="endDate" className="block text-gray-700 text-sm font-bold mb-2">
                End Date:
              </label>
              <input
                type="date"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-blue-50 p-6 rounded-lg shadow-md text-center">
            <h3 className="text-lg font-semibold text-blue-800">Langganan Baru</h3>
            <p className="text-4xl font-bold text-blue-700 mt-2">{newSubscriptions}</p>
          </div>
          <div className="bg-purple-50 p-6 rounded-lg shadow-md text-center">
            <h3 className="text-lg font-semibold text-purple-800">MRR</h3>
            <p className="text-4xl font-bold text-purple-700 mt-2">Rp{monthlyRecurringRevenue.toLocaleString('id-ID')}</p>
          </div>
          <div className="bg-orange-50 p-6 rounded-lg shadow-md text-center">
            <h3 className="text-lg font-semibold text-orange-800">Reaktivasi</h3>
            <p className="text-4xl font-bold text-orange-700 mt-2">{reactivations}</p>
          </div>
          <div className="bg-green-50 p-6 rounded-lg shadow-md text-center">
            <h3 className="text-lg font-semibold text-green-800">Pertumbuhan Langganan</h3>
            <p className="text-4xl font-bold text-green-700 mt-2">{totalActiveSubscriptions}</p>
          </div>
        </div>

        <h2 className="text-3xl font-semibold text-green-700 mb-6">Semua Langganan</h2>
        {allSubscriptions.length === 0 ? (
          <p className="text-gray-600 text-center">Belum ada data langganan.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg shadow-md">
              <thead>
                <tr className="bg-green-100 text-green-800 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">Nama</th>
                  <th className="py-3 px-6 text-left">Paket</th>
                  <th className="py-3 px-6 text-left">Jenis Makanan</th>
                  <th className="py-3 px-6 text-left">Hari Pengiriman</th>
                  <th className="py-3 px-6 text-left">Total Harga</th>
                  <th className="py-3 px-6 text-left">Status</th>
                  <th className="py-3 px-6 text-left">Tanggal Langganan</th>
                  <th className="py-3 px-6 text-left">User ID</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 text-sm font-light">
                {allSubscriptions.map((sub) => (
                  <tr key={sub.id} className="border-b border-gray-200 hover:bg-gray-100">
                    <td className="py-3 px-6 text-left whitespace-nowrap">{sub.fullName}</td>
                    <td className="py-3 px-6 text-left">{sub.planSelection}</td>
                    <td className="py-3 px-6 text-left">{sub.mealTypes.join(', ')}</td>
                    <td className="py-3 px-6 text-left">{sub.deliveryDays.join(', ')}</td>
                    <td className="py-3 px-6 text-left">Rp{sub.totalPrice.toLocaleString('id-ID')}</td>
                    <td className="py-3 px-6 text-left">
                      <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                        sub.status === 'active' ? 'bg-green-100 text-green-800' :
                        sub.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-left">{new Date(sub.subscriptionDate).toLocaleDateString('id-ID')}</td>
                    <td className="py-3 px-6 text-left font-mono text-xs">{sub.userId}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <ModalMessage message={message} onClose={() => setMessage('')} />
    </div>
  );
};

export default AdminDashboard;
