// src/pages/Home.tsx
import React from 'react';

const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold">404 - Not Found</h1>
      <p className="mt-4 text-lg">The page you are looking for does not exist.</p>
    </div>
  );
};
export default NotFound;