import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import SignupPage from './pages/Signup.jsx';
import LoginPage from './pages/Login.jsx';
import OrgDashboard from './pages/OrgDashboard.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import { useAuth } from './context/AuthContext.jsx';
import UserManagement from './pages/UserManagement.jsx';
import './assets/styles.css';

function App() {
  const { token, logout } = useAuth();
  const location = useLocation();
  
  // Check if current route should be centered (login/signup)
  const shouldCenter = location.pathname === '/login' || location.pathname === '/signup';
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="bg-blue-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold">Performing Arts Manager</h1>
            </div>
            <div className="flex items-center space-x-4">
              {!token ? (
                <>
                  <Link to="/login" className="px-3 py-2 rounded-md hover:bg-blue-700 cursor-pointer">Login</Link>
                  <Link to="/signup" className="px-3 py-2 rounded-md hover:bg-blue-700 cursor-pointer">Sign Up</Link>
                </>
              ) : (
                <>
                  <Link to="/organizations" className="px-3 py-2 rounded-md hover:bg-blue-700 cursor-pointer">Dashboard</Link>
                  <button 
                    onClick={logout} 
                    className="px-3 py-2 rounded-md text-sm font-medium bg-red-500 hover:bg-red-600 transition cursor-pointer"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className={`flex-1 bg-gray-100 ${shouldCenter ? 'flex items-center justify-center' : ''}`}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/" element={<h2>Welcome to Performing Arts Manager</h2>} />
          <Route 
            path="/organizations" 
            element={
              <PrivateRoute>
                <OrgDashboard />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/orgs/:orgId/users" 
            element={
              <PrivateRoute>
                <UserManagement />
              </PrivateRoute>
            } 
          />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="border-gray-700 mt-4 mb-4 text-center">
            <p className="text-gray-300 text-sm">
              © 2026 Performing Arts Manager. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App
