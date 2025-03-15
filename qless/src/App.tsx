import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NotFound from './pages/NotFound';
import LandingPage from './pages/LandingPage';
import CookDashboard from './pages/kitchen/CookDashboard';
import './styles/global.css';

function App() {
  

  return (
<<<<<<< HEAD
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />}/>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
=======
    <Routes>
      <Route path="/landing" element={<LandingPage />}/>
      <Route path="*" element={<NotFound />} />
      <Route path="/cook" element={<CookDashboard />} />
    </Routes>
>>>>>>> 1ad9dddc993c82ac8179ae6b1bcb1fe85ef22d2a
  )
}

export default App
