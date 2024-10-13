import React, { useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDatabase } from '@/hooks';
import { Button, Error, Select } from '@/components';
import { BiEdit, BiTrash } from 'react-icons/bi';
import { statusOptions, statusColors } from '@/assets';



const Reports = () => {
  const navigate = useNavigate();
  const { data: reports, fetchData, loading, error, deleteItem, updateItem } = useDatabase('report');

  const handleDelete = useCallback(async (id) => {
    const confirmationMessage = 'هل انت متأكد من حذف هذا البلاغ';
    const isConfirmed = await window.ipcRenderer.invoke('show-prompt', confirmationMessage);

    if (isConfirmed) {
      await deleteItem(id);
    }
  }, [deleteItem]);

  if (error) {
    return <Error message={error} onRetry={() => window.location.reload()} />;
  }

  const handleSelectChange = async (selectedOption, report) => {
    if (!selectedOption) return; // Check if a valid option is selected
    const { value } = selectedOption;
    // Run text-to-speech when status is changed to "in-progress"
      const speech = new SpeechSynthesisUtterance(); // Create a new SpeechSynthesisUtterance instance
      speech.text = `بلاغ رقم ${report.id}`; // Set the text to read
      speech.lang = 'ar-EG'; // Set the language to Arabic
      speech.rate = 0.8; // You can adjust the rate of speech if needed
      speech.pitch = 1; // You can adjust the pitch of the speech if needed
      window.speechSynthesis.speak(speech); // Speak the text
    
    await updateItem(report.id, [value]);
    fetchData(null, [""]);
  };

  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-900">
      <h1 className="text-2xl mb-4 text-gray-800 dark:text-white">البلاغات</h1>
      <Link
        to="/reports/add"
        className="bg-primary text-white px-4 py-2 rounded hover:bg-hoverPrimary mb-4 inline-block"
      >
        أضافة بلاغات اخري
      </Link>
      <div className="overflow-auto" style={{ height: '60vh' }}>
        <table className="w-full bg-white dark:bg-gray-800 shadow-md rounded border border-gray-200 dark:border-gray-700">
          <thead className="bg-gray-300 dark:bg-gray-800 sticky top-0 z-10">
            <tr>
              <th className="p-4 text-gray-800 dark:text-gray-300">الرقم التسلسلي</th>
              <th className="p-4 text-gray-800 dark:text-gray-300">الحالة</th>
              <th className="p-4 text-gray-800 dark:text-gray-300">الاوامر</th>
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
                    <td className="text-center p-4 text-gray-800 dark:text-gray-200">{i + 1}</td>
                    <td className={`text-center p-4 ${statusColors[report.status]}`}>
                      {status?.label}
                    </td>

                    <td className="p-4 justify-center gap-2 flex">
                      <div className="relative">
                        <Select
                          value={""}
                          onChange={(value) => handleSelectChange(value, report)}
                          isOptionDisabled={option => option.value === report.status}
                          placeholder="اختيار إجراء"
                          options={statusOptions}
                        />
                      </div>

                      <Button disabled={loading} onClick={() => handleDelete(report.id)} className="btn--red flex items-center gap-2">
                        <BiTrash />
                        <span>حذف</span>
                      </Button>
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
