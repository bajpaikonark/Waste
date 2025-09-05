import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import UserProfile from './components/UserProfile';
import AdminDashboard from './components/AdminDashboard';
import MyReports from './components/MyReports';
import './index.css';
import Health from './pages/Health';
import Map from './pages/Map';
import Login from './components/Login';
import Signup from './components/Signup';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/my-reports" element={<MyReports />} />
            <Route path="/map" element={<Map />} />
          <Route path="/health" element={<Health />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
            {/* Add other routes as needed */}
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;