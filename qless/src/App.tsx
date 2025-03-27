import { Routes, Route } from 'react-router-dom';
import NotFound from './pages/NotFound';
import LandingPage from './pages/login-signup/LandingPage';
import CookDashboard from './pages/kitchen/CookDashboard';
import ManagerDashboard from './pages/manager/ManagerDashboard';
import CustomerInterface from './pages/customer/CustomerInterface';
import OrderMenu from './pages/customer/OrderMenu';
import './styles/global.css';
import { StrictMode } from 'react';

function App() {


  return (

    <Routes>
      <Route path="/" element={<LandingPage />}/>
      <Route path="*" element={<NotFound />} />
      <Route path="/cook" element={
        <StrictMode>
          <CookDashboard />
        </StrictMode>
      } />
      <Route path="/customer" element={<CustomerInterface />} />
      <Route path="/order-menu" element={<OrderMenu />} />
    </Routes>

  )
}

export default App
