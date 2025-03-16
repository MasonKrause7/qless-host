import { Routes, Route } from 'react-router-dom';
import NotFound from './pages/NotFound';
import LandingPage from './pages/LandingPage';
import CookDashboard from './pages/kitchen/CookDashboard';
import './styles/global.css';
import { StrictMode } from 'react';

function App() {


  return (

    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="*" element={<NotFound />} />
      <Route path="/cook" element={
        <StrictMode>
          <CookDashboard />
        </StrictMode>
      } />
    </Routes>

  )
}

export default App
