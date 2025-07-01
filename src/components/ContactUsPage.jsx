import React from 'react';

const ContactUsPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      <header className="text-center mb-12">
        <h1 className="text-5xl font-extrabold text-green-700 mb-4">Contact Us</h1>
        <p className="text-xl text-gray-700">We'd love to hear from you!</p>
      </header>

      <section className="bg-white shadow-lg rounded-lg p-8 max-w-2xl w-full text-center">
        <h2 className="text-3xl font-semibold text-green-600 mb-6">Get in Touch with SEA Catering</h2>
        <div className="space-y-4 text-lg text-gray-800">
          <p>
            Jika Anda memiliki pertanyaan, saran, atau ingin mengetahui lebih lanjut tentang layanan kami, jangan ragu untuk menghubungi kami. Tim kami siap membantu Anda!
          </p>
          <p className="font-medium">Manager: <span className="text-green-700">Brian</span></p>
          <p className="font-medium">Phone Number: <a href="tel:08123456789" className="text-green-600 hover:underline">08123456789</a></p>
          <p className="font-medium">Email: <a href="mailto:info@seacatering.com" className="text-green-600 hover:underline">info@seacatering.com</a></p>
          <p className="font-medium">Address: <span className="text-green-700">Jl. Katering Sehat No. 123, Jakarta, Indonesia</span></p>
        </div>
        <div className="mt-8">
          <p className="text-gray-600 italic">Kami berkomitmen untuk memberikan pengalaman terbaik bagi pelanggan kami.</p>
        </div>
      </section>
    </div>
  );
};

export default ContactUsPage;
