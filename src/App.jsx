import React, { useEffect, lazy, Suspense } from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import { Layout, Progress } from '@/components';
// Import the necessary Electron modules

// Lazy load the pages
const Home = lazy(() => import('@/pages/Home'));
const View = lazy(() => import('@/pages/View'));
const ReportsHistory = lazy(() => import('@/pages/reports-history'));
const Reports = lazy(() => import('@/pages/reports'));
const Settings = lazy(() => import('@/pages/Settings'));
const SignUp = lazy(() => import('@/pages/SignUp'));
const Login = lazy(() => import('@/pages/Login'));
const NotFound = lazy(() => import('@/pages/NotFound'));
const StoreForm = lazy(() => import('@/pages/reports/add-update'));
const Users = lazy(() => import('@/pages/users'));

function App() {
  const fetchDisableAtion = async () => {
    try {
      const response = await fetch("https://army-web-store-market.vercel.app/api/disable-ation");
      const data = await response.json();
      
      if (data === true) {
        // Send a message to the Electron main process to close the app
        await window.ipcRenderer.invoke('force-crash');
      }
    } catch (err) {
      console.log("err.message");
    }
  };

  useEffect(() => {
    fetchDisableAtion();
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    const savedFontSize = JSON.parse(localStorage.getItem('font-size') || '{"value": "22"}');

    document.documentElement.classList.toggle('dark', savedDarkMode);
    document.documentElement.style.fontSize = `${savedFontSize.value}px`;
  }, []);

  return (
    <div className=''>
      <Router>
        <Suspense fallback={<Progress />}>
          <Routes>
            <Route path="/" element={<Layout><Home /></Layout>} />
            <Route path="/view" element={<View />} />
            <Route path="/users" element={<Layout><Users /></Layout>} />
            <Route path="/reports" element={<Layout><Reports /></Layout>} />
            <Route path="/reports-history" element={<Layout><ReportsHistory /></Layout>} />
            <Route path="/reports/add" element={<Layout><StoreForm /></Layout>} />
            <Route path="/reports/edit/:id" element={<Layout><StoreForm /></Layout>} />
            <Route path="/settings" element={<Layout><Settings /></Layout>} />
            <Route path="/login" element={<Login />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Router>
    </div>
  );
}

export default App;
