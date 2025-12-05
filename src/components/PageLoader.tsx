import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const PageLoader: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Show loader when route changes
    setLoading(true);

    // Hide loader after a short delay to allow page to render
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  if (!loading) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{ backgroundColor: '#333333', zIndex: 9999 }}
    >
      <img
        src="/loader.gif"
        alt="Loading..."
        className="w-64 h-64 object-contain"
      />
    </div>
  );
};

export default PageLoader;
