import React from 'react';
import MainLayout from '../components/MainLayout';

const TrainerScheduleScreen = () => {
  return (
    <MainLayout>
      <div className="p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-4 text-teal-600">⏰ Trainer Availability Schedule</h1>
        <p className="text-gray-600">
          This screen allows the trainer to manage and update their available time slots for personal training sessions.
        </p>
        <div className="mt-4 p-4 border-l-4 border-yellow-500 bg-yellow-50 text-yellow-800">
          **TO DO:** Implement calendar interface for managing available slots.
        </div>
      </div>
    </MainLayout>
  );
};

export default TrainerScheduleScreen;