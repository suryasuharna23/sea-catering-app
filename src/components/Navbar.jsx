"use client"; 
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

/**
 * Komponen Navbar yang responsif untuk navigasi aplikasi SEA Catering.
 * Menampilkan tautan ke berbagai halaman dan menyoroti halaman yang aktif.
 *
 * @returns {JSX.Element} Elemen JSX untuk bilah navigasi.
 */
const Navbar = () => {
  const pathname = usePathname(); 
  const [isOpen, setIsOpen] = useState(false); 

  const isActive = (path) => pathname === path;

  return (
    <nav className="bg-green-800 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo/Nama Bisnis */}
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

        <div className="hidden md:flex space-x-6">
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
        </div>
      )}
    </nav>
  );
};

export default Navbar;
