import { Routes, Route } from 'react-router-dom';
import NotFound from './pages/NotFound';
import LandingPage from './pages/LandingPage';
import CookDashboard from './pages/kitchen/CookDashboard';
import ManagerDashboard from './pages/manager/ManagerDashboard';
import './styles/global.css';

function App() {
  

  return (

    <Routes>
      <Route path="/" element={<LandingPage />}/>
      <Route path="*" element={<NotFound />} />
      <Route path="/cook" element={<CookDashboard />} />
      <Route path="/manage" element={<ManagerDashboard />} />
    </Routes>

  )
}

export default App
