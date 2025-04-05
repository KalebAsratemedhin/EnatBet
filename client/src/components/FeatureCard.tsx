import React from 'react';

interface Props {
  image: string;
  title: string;
  description: string;
}

const FeatureCard: React.FC<Props> = ({ image, title, description }) => (
  <div className="bg-white shadow-md rounded-xl overflow-hidden hover:scale-105 transition-transform">
    <img src={image} alt={title} className="h-40 w-full object-cover" />
    <div className="p-4">
      <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
      <p className="text-gray-600 text-sm mt-2">{description}</p>
    </div>
  </div>
);

export default FeatureCard;
