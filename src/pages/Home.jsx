import { format, subMonths } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { useSavedState } from '@/hooks';
import { Error, CustomDatePicker } from '@/components';

const Home = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [firstDateInTransactions, setFirstDateInTransactions] = useSavedState("", 'first-date-in-report', { expirationDays: 1 });
  const [startDate, setStartDate] = useState(subMonths(new Date(), 1))

  useEffect(() => {
    const fetchFirstDate = async () => {
      const result = await window.ipcRenderer.invoke('get-first-date-in-report');
      setFirstDateInTransactions(result || new Date());
    }
    !firstDateInTransactions && fetchFirstDate()
  }, [])


  useEffect(() => {
    const fetchReportsByDay = async () => {
      try {

        const result = await window.ipcRenderer.invoke('get-reports-by-day', format(startDate, "yyyy-MM-dd"));
        setReports(result);
      } catch (err) {
        setError(err?.message || 'Failed to fetch in-progress report index');
      }
      setLoading(false)
    };
    fetchReportsByDay();
  }, [startDate]);

  if (error) {
    return <Error message={error} onRetry={() => window.location.reload()} />;
  }
  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-900">
      <header className='flex justify-between items-center'>

        <h1 className="text-2xl mb-4 text-gray-800 dark:text-white">القائمة الرئيسيه</h1>
        <CustomDatePicker
          minDate={new Date(firstDateInTransactions)}
          maxDate={new Date()}
          value={startDate || new Date()}
          onChange={value => {
            setStartDate(value ? value : new Date())
          }}
        />
      </header>
      <div className="overflow-auto" style={{ height: '60vh' }}>
        <table className="w-full bg-white dark:bg-gray-800 shadow-md rounded border border-gray-200 dark:border-gray-700">
          <thead className="bg-gray-300 dark:bg-gray-800 sticky top-0 z-10">
            <tr>
              <th className="p-4 text-gray-800 dark:text-gray-300">الرقم التسلسلي</th>
              <th className="p-4 text-gray-800 dark:text-gray-300">التاريخ</th>
              <th className="p-4 text-gray-800 dark:text-gray-300">عدد البلاغات</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableSkeleton key={index} />
              ))
            ) : (
              reports?.map((report, i) => {
                return (
                  <tr key={report.date} className={`${i % 2 === 0 ? 'bg-gray-100 dark:bg-gray-700' : 'bg-white dark:bg-gray-800'}`}>
                    <td className="text-center p-4 text-gray-800 dark:text-gray-200">{i + 1}</td>
                    <td className={`text-center p-4`}>
                      {report?.date}
                    </td>
                    <td className={`text-center p-4`}>
                      {report?.reportCount}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>

  );
};

export default Home;

const TableSkeleton = () => {
  return (
    <tr>
      <td className="p-4 text-center">
        <div className="animate-pulse bg-gray-300 rounded h-8 w-12 mx-auto"></div>
      </td>
      <td className="p-4 text-center">
        <div className="animate-pulse bg-gray-300 rounded h-8 w-32 mx-auto"></div>
      </td>
      <td className="p-4 text-center">
        <div className="animate-pulse bg-gray-300 rounded h-8 w-48 mx-auto"></div>
      </td>
    </tr>
  );
};
