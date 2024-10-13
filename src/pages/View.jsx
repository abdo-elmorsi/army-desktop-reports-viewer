import React, { useEffect, useState } from 'react';
import { Error } from '@/components';
import { speakReportNumber } from '@/utils';
import { useNavigate } from 'react-router-dom';

const View = () => {
  const navigate = useNavigate();
  const [reportNumber, setReportNumber] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReportIndex = async () => {
      setLoading(true); // Set loading to true before fetching
      try {
        const result = await window.ipcRenderer.invoke('get-in-progress-report-index');

        // Check if result is different from the current report number
        if (result !== null && result !== reportNumber) {
          speakReportNumber(result + 1);
        }


        setReportNumber(result || null);
      } catch (err) {
        setError(err?.message || 'Failed to fetch in-progress report index');
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchReportIndex(); // Fetch immediately when component mounts

    // Set up an interval to fetch every 5 seconds
    const intervalId = setInterval(fetchReportIndex, 5000);

    // Clear the interval on component unmount
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array ensures this runs once on mount

  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        navigate('/');
      }
    };

    window.addEventListener('keydown', handleEscapeKey);
    return () => {
      window.removeEventListener('keydown', handleEscapeKey);
    };
  }, [navigate]);

  if (error) {
    return <Error message={error} onRetry={() => window.location.reload()} />;
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 h-screen flex justify-center items-center overflow-hidden">
      <div className="sidebar flex justify-center items-center w-full h-full">
        <h1 className="text-9xl font-bold text-center text-primary dark:text-white animate-slide-left-to-right">
          {loading ? "تحميل..." : +reportNumber ? `بلاغ رقم ${reportNumber + 1}` : 'لا يوجد بلاغات'}
        </h1>
      </div>
    </div>
  );
};

export default View;
