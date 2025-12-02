import React from 'react';
import VinylLoader from '../components/VinylLoader';

const LoaderDemo: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-white text-3xl font-bold mb-8">Vinyl Decal Loader Animation</h1>

        <div className="p-12">
          <VinylLoader size={300} />
          <p className="text-white/70 mt-6 text-sm">Watch the vinyl decal being applied!</p>
        </div>

        <div className="mt-8 space-y-4">
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-[#6da71d] text-white rounded-lg font-semibold hover:bg-[#5a8a18] transition-all"
          >
            Replay Animation
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoaderDemo;
