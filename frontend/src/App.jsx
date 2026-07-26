import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import Navbar from './components/common/Navbar.jsx';
import Footer from './components/common/Footer.jsx';
import Home from './pages/Home/Home.jsx';
import Login from './pages/Login/Login.jsx';
import Register from './pages/Register/Register.jsx';
import Dashboard from './pages/Dashboard/Dashboard.jsx';
import BookShipment from './pages/BookShipment/BookShipment.jsx';
import TrackShipment from './pages/TrackShipment/TrackShipment.jsx';
import RateCalculator from './pages/RateCalculator/RateCalculator.jsx';
import GlobalSchedules from './pages/GlobalSchedules/GlobalSchedules.jsx';
import Admin from './pages/Admin/Admin.jsx';
import GooglePopup from './pages/Login/GooglePopup.jsx';
import AIShippingAssistant from './pages/AIShippingAssistant.jsx';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col justify-between bg-brand-dark">
          {/* Navigation Bar */}
          <Navbar />

          {/* Main Content Area */}
          <main className="flex-grow pt-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/book" element={<BookShipment />} />
              <Route path="/track" element={<TrackShipment />} />
              <Route path="/rates" element={<RateCalculator />} />
              <Route path="/schedules" element={<GlobalSchedules />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/auth/google-popup" element={<GooglePopup />} />
              <Route path="/ai-assistant" element={<AIShippingAssistant />} />
            </Routes>
          </main>

          {/* Global Footer */}
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
