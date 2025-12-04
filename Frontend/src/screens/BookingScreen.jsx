import React from 'react';
import MainLayout from '../components/MainLayout';

const BookingScreen = () => {
  return (
    <MainLayout>
      <div className="p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-4 text-indigo-600">📅 Session & Class Booking</h1>
        <p className="text-gray-600">
          This screen will allow members to view available group classes (Zumba, Yoga) or trainer slots and book a session.
        </p>
        <div className="mt-4 p-4 border-l-4 border-yellow-500 bg-yellow-50 text-yellow-800">
          **TO DO:** Implement calendar view, session listing, and booking API integration.
        </div>
      </div>
    </MainLayout>
  );
};

export default BookingScreen;