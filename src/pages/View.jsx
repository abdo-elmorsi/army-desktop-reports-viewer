import React, { useEffect } from 'react';
import { Error } from '@/components';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();






  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        navigate("/")
      }
    };

    window.addEventListener('keydown', handleEscapeKey);
    return () => {
      window.removeEventListener('keydown', handleEscapeKey);
    };
  }, []);


  return (
    <div className="bg-gray-50 dark:bg-gray-900 h-screen flex justify-center items-center">
      <div className="sidebar flex justify-center items-center w-full h-full">
        <h1 className="text-9xl font-bold text-center text-primary dark:text-white animate-ping-slow">
          بلاغ رقم 2
        </h1>
      </div>
    </div>
  );
};

export default Home;
