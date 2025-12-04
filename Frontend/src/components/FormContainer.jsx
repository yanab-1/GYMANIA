// frontend/src/components/FormContainer.jsx
import React from 'react';

const FormContainer = ({ children, title }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen pt-6 sm:pt-0 bg-gray-50">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-extrabold text-gray-900 text-center mb-6">
          {title}
        </h1>
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-lg sm:px-10">
          {children}
        </div>
      </div>
    </div>
  );
};

export default FormContainer;