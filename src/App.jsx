import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import AppShell from './components/layout/AppShell';
import Dashboard from './pages/Dashboard';
import Input from './pages/Input';
import Reports from './pages/Reports';
import Recommendations from './pages/Recommendations';
import Alerts from './pages/Alerts';
import Sustainability from './pages/Sustainability';
import About from './pages/About';

export default function App() {
  return (
    <BrowserRouter>
      <DataProvider>
        <AppShell>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/input" element={<Input />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/recommendations" element={<Recommendations />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/sustainability" element={<Sustainability />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </AppShell>
      </DataProvider>
    </BrowserRouter>
  );
}
