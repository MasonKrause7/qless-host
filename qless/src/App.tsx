import { Routes, Route } from 'react-router-dom';
import NotFound from './pages/NotFound';
import LandingPage from './pages/LandingPage';
import './styles/global.css';

function App() {
  

  return (
    <Routes>
      <Route path="/landing" element={<LandingPage />}/>
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
