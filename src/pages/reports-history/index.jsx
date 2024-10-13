import React, { useCallback, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDatabase, useSavedState } from '@/hooks';
import { Button, Error, CustomDatePicker } from '@/components';
import { BiEdit, BiTrash } from 'react-icons/bi';
import { statusOptions, statusColors } from '@/assets';
import { format } from 'date-fns';



const Reports = () => {
  const navigate = useNavigate();
  const [firstDateInTransactions, setFirstDateInTransactions] = useSavedState("", 'first-date-in-report', { expirationDays: 1 });
  const [selectedDate, setSelectedDate] = useSavedState(format(new Date(), "yyyy-MM-dd"), 'selected-date', { expirationDays: 1 });


  const { data: reports, fetchData, loading, error } = useDatabase('report', null, ["", new Date(selectedDate)]);


  useEffect(() => {
    if (!loading) {
      fetchData(null, ["", new Date(selectedDate)])
    }
  }, [selectedDate])

  useEffect(() => {
    const fetchFirstDate = async () => {
      const result = await window.ipcRenderer.invoke('get-first-date-in-report');
      setFirstDateInTransactions(result || new Date());
    }
    !firstDateInTransactions && fetchFirstDate()
  }, [])


  if (error) {
    return <Error message={error} onRetry={() => window.location.reload()} />;
  }



  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-900">
      <header className='flex justify-between items-center'>
        <h1 className="text-2xl mb-4 text-gray-800 dark:text-white">البلاغات السابقه</h1>
        <CustomDatePicker
          minDate={new Date(firstDateInTransactions)}
          maxDate={new Date()}
          value={selectedDate || new Date()}
          onChange={value => {
            setSelectedDate(value ? value : new Date())
          }}
        />
      </header>
      <div className="overflow-auto" style={{ height: '60vh' }}>
        <table className="w-full bg-white dark:bg-gray-800 shadow-md rounded border border-gray-200 dark:border-gray-700">
          <thead className="bg-gray-300 dark:bg-gray-800 sticky top-0 z-10">
            <tr>
              <th className="p-4 text-gray-800 dark:text-gray-300">الرقم التسلسلي</th>
              <th className="p-4 text-gray-800 dark:text-gray-300">الحالة</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableSkeleton key={index} />
              ))
            ) : (
              reports.map((report, i) => {
                const status = statusOptions.find(status => status.value === report.status);
                return (
                  <tr key={report.id} className={`${i % 2 === 0 ? 'bg-gray-100 dark:bg-gray-700' : 'bg-white dark:bg-gray-800'}`}>
                    <td className="text-center p-4 text-gray-800 dark:text-gray-200">{i + 2}</td>
                    <td className={`text-center p-4 ${statusColors[report.status]}`}>
                      {status?.label}
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

export default Reports;

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
