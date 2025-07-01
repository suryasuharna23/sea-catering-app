"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useFirebase } from '../context/FirebaseContext';
import { signOut } from 'firebase/auth';
import ModalMessage from './ModalMessage';

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { auth, userId, userRole, isAuthReady } = useFirebase();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [displayName, setDisplayName] = useState('Tamu');

  useEffect(() => {
    if (auth && auth.currentUser) {
      setDisplayName(auth.currentUser.displayName || auth.currentUser.email || 'Pengguna');
    } else if (userId && isAuthReady) {
      setDisplayName('Tamu');
    }
  }, [auth, userId, isAuthReady]);

  const isActive = (path) => pathname === path;

  const handleLogout = async () => {
    if (!auth) {
      setMessage('Sistem autentikasi belum siap.');
      return;
    }
    try {
      await signOut(auth);
      setMessage('Logout berhasil!');
      setDisplayName('Tamu');
      router.push('/login');
    } catch (error) {
      console.error("Logout error:", error);
      setMessage('Terjadi kesalahan saat logout. Silakan coba lagi.');
    }
  };

  return (
    <nav className="bg-green-800 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white text-2xl font-bold rounded-md p-2 hover:bg-green-700 transition-colors">
          SEA Catering
        </Link>

        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white focus:outline-none focus:ring-2 focus:ring-white rounded-md p-2"
            aria-label="Toggle navigation"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        <div className="hidden md:flex items-center space-x-6">
          <Link href="/" className={`text-white text-lg font-medium p-2 rounded-md transition-colors ${isActive('/') ? 'bg-green-700' : 'hover:bg-green-700'}`}>
            Home
          </Link>
          <Link href="/menu" className={`text-white text-lg font-medium p-2 rounded-md transition-colors ${isActive('/menu') ? 'bg-green-700' : 'hover:bg-green-700'}`}>
            Menu / Meal Plans
          </Link>
          <Link href="/subscription" className={`text-white text-lg font-medium p-2 rounded-md transition-colors ${isActive('/subscription') ? 'bg-green-700' : 'hover:bg-green-700'}`}>
            Subscription
          </Link>
          <Link href="/contact" className={`text-white text-lg font-medium p-2 rounded-md transition-colors ${isActive('/contact') ? 'bg-green-700' : 'hover:bg-green-700'}`}>
            Contact Us
          </Link>

          {auth && auth.currentUser && !auth.currentUser.isAnonymous ? (
            <>
              <Link href="/dashboard/user" className={`text-white text-lg font-medium p-2 rounded-md transition-colors ${isActive('/dashboard/user') ? 'bg-green-700' : 'hover:bg-green-700'}`}>
                Dashboard
              </Link>
              {userRole === 'admin' && (
                <Link href="/dashboard/admin" className={`text-white text-lg font-medium p-2 rounded-md transition-colors ${isActive('/dashboard/admin') ? 'bg-green-700' : 'hover:bg-green-700'}`}>
                  Admin
                </Link>
              )}
              <span className="text-white text-lg font-medium">Halo, {displayName}!</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Logout
              </button>
            </>
          ) : (
            <Link href="/login" className={`text-white text-lg font-medium p-2 rounded-md transition-colors ${isActive('/login') ? 'bg-green-700' : 'hover:bg-green-700'}`}>
              Login
            </Link>
          )}
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden mt-4 bg-green-700 rounded-md shadow-lg py-2">
          <Link href="/" onClick={() => setIsOpen(false)} className={`block text-white text-lg px-4 py-2 rounded-md transition-colors ${isActive('/') ? 'bg-green-600' : 'hover:bg-green-600'}`}>
            Home
          </Link>
          <Link href="/menu" onClick={() => setIsOpen(false)} className={`block text-white text-lg px-4 py-2 rounded-md transition-colors ${isActive('/menu') ? 'bg-green-600' : 'hover:bg-green-600'}`}>
            Menu / Meal Plans
          </Link>
          <Link href="/subscription" onClick={() => setIsOpen(false)} className={`block text-white text-lg px-4 py-2 rounded-md transition-colors ${isActive('/subscription') ? 'bg-green-600' : 'hover:bg-green-600'}`}>
            Subscription
          </Link>
          <Link href="/contact" onClick={() => setIsOpen(false)} className={`block text-white text-lg px-4 py-2 rounded-md transition-colors ${isActive('/contact') ? 'bg-green-600' : 'hover:bg-green-600'}`}>
            Contact Us
          </Link>
          {auth && auth.currentUser && !auth.currentUser.isAnonymous ? (
            <>
              <Link href="/dashboard/user" onClick={() => setIsOpen(false)} className={`block text-white text-lg px-4 py-2 rounded-md transition-colors ${isActive('/dashboard/user') ? 'bg-green-600' : 'hover:bg-green-600'}`}>
                Dashboard
              </Link>
              {userRole === 'admin' && (
                <Link href="/dashboard/admin" onClick={() => setIsOpen(false)} className={`block text-white text-lg px-4 py-2 rounded-md transition-colors ${isActive('/dashboard/admin') ? 'bg-green-600' : 'hover:bg-green-600'}`}>
                  Admin
                </Link>
              )}
              <span className="block text-white text-lg px-4 py-2">Halo, {displayName}!</span>
              <button
                onClick={() => { setIsOpen(false); handleLogout(); }}
                className="block w-full text-left bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 mt-2"
              >
                Logout
              </button>
            </>
          ) : (
            <Link href="/login" onClick={() => setIsOpen(false)} className={`block text-white text-lg px-4 py-2 rounded-md transition-colors ${isActive('/login') ? 'bg-green-600' : 'hover:bg-green-600'}`}>
              Login
            </Link>
          )}
        </div>
      )}
      <ModalMessage message={message} onClose={() => setMessage('')} />
    </nav>
  );
};

export default Navbar;
