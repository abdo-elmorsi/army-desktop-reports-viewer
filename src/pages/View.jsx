import React, { useEffect, useState } from 'react';
import { Error } from '@/components';
import { useNavigate } from 'react-router-dom';
import { logoBase64 } from '../assets';

const View = () => {
  const navigate = useNavigate();
  const [reportNumber, setReportNumber] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReportIndex = async () => {
      setLoading(true);
      try {
        const result = await window.ipcRenderer.invoke('get-in-progress-report-index');
        setReportNumber(result || null);
      } catch (err) {
        setError(err?.message || 'Failed to fetch in-progress report index');
      } finally {
        setLoading(false);
      }
    };

    fetchReportIndex();

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
    // <div className="bg-primary dark:bg-gray-900 h-screen flex justify-center items-center ">
    <div className="bg-primary h-screen overflow-hidden">
      <div className='flex justify-between items-center px-6 pt-2'>
        <div className='text-white'>
          <h1 className='m-0 text-yellow-200 text-4xl'>وزارة الداخلية</h1>
          <h2 className='m-0 text-yellow-200'>مديرية أمن كفر الشيخ</h2>
          <h3 className='m-0 text-yellow-200'>قسم تكنولوجيا المعلومات</h3>
        </div>
        <div>
          <img
            src={logoBase64}
            alt="Logo"
            className="h-24 w-24 rounded-full"
          />
        </div>
      </div>
      <div className='flex justify-center items-start pt-32 h-full'>
        {loading ? <span>تحميل...</span> :
          <>
            <div className="flex flex-col gap-4 items-center animate-slide-left-to-right w-full">
              <p className='text-9xl font-bold  text-inherit m-0'>{+reportNumber ? `بلاغ رقم` : 'نرحب بالسادة المواطنين'}</p>
              {+reportNumber ? <p className='text-9xl font-bold  text-inherit m-0'>({+reportNumber + 1})</p> : null}
            </div>
          </>
        }
      </div>
    </div>
    // </div>
  );
};

export default View;
