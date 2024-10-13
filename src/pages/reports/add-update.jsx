import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDatabase, useInput } from '@/hooks';
import { Button, Input, Error } from '@/components';

const ReportForm = () => {
  const navigate = useNavigate();
  const { error, addItem } = useDatabase('report');

  // Input for the number of reports
  const numberOfReports = useInput(10, "number", true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const count = parseInt(numberOfReports.value) || 0; // Get the value as an integer

    // Loop to add the specified number of reports
    for (let i = 0; i < count; i++) {
      const data = i === 0 ? ["in-progress"] : []
      await addItem(data); // Pass the necessary report data, if any
    }

    navigate('/reports');
  };

  if (error) {
    return <Error message={error} onRetry={() => window.location.reload()} />;
  }

  return (
    <div className="p-6 px-8 rounded-md bg-gray-50 dark:bg-gray-900">
      <nav className="text-gray-700 dark:text-gray-300 mb-4">
        <ul className="list-reset flex">
          <li>
            <Link to="/reports" className="text-primary hover:underline">
              البلاغات
            </Link>
          </li>
          <li className="mx-2">/</li>
          <li className={'text-gray-700 dark:text-gray-300'}>
            أضافة عدد بلاغات اليوم
          </li>
        </ul>
      </nav>
      <h1 className="text-2xl mb-4 text-gray-800 dark:text-white">
        أضافه
      </h1>
      <form className='mt-10' onSubmit={handleSubmit}>
        <div className='flex justify-between items-start gap-12 min-h-80'>
          <div className="mb-4 w-6/12">
            <Input
              mandatory
              label={"عدد بلاغات اليوم"}
              {...numberOfReports.bind}
              name="numberOfReports"
            />
          </div>
        </div>
        <div className='flex items-center justify-end gap-10'>
          <Button className="btn--red w-36" onClick={() => navigate('/reports')}>
            إلغاء
          </Button>
          <Button className="btn--primary w-36" disabled={!+numberOfReports.value} type="submit">
            حفظ
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ReportForm;
