import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import ToastContainer from './components/ToastContainer';
import FakePopup from './components/FakePopup';
import Rickroll from './components/Rickroll';
import LandingPage from './pages/LandingPage';
import MenuPage from './pages/MenuPage';
import BuyNowPage from './pages/BuyNowPage';
import PaymentPage from './pages/PaymentPage';
import FinalPaymentPage from './pages/FinalPaymentPage';
import SupportChat from './components/SupportChat';
import { useApp } from './context/AppContext';
import './App.css';

function App() {
  return (
    <Router>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </Router>
  );
}

function AppContent() {
  const { hellMode } = useApp();

  return (
    <div className={hellMode ? 'hell-body' : ''}>
      <Navbar />
      <ToastContainer />
      <FakePopup />
      <Rickroll />
      <SupportChat />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/buy" element={<BuyNowPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/final-payment" element={<FinalPaymentPage />} />
      </Routes>
    </div>
  );
}


export default App;
