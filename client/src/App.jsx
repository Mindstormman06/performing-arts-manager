import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import SignupPage from './pages/Signup.jsx'
import LoginPage from './pages/Login.jsx'
import './assets/styles.css'

function App() {
  return (
    <Router>
      <nav className="bg-blue-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold">Performing Arts Manager</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                to="/login" 
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition duration-200"
              >
                Login
              </Link>
              <Link 
                to="/signup" 
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition duration-200"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/" element={<h2>Welcome to Performing Arts Manager</h2>} />
      </Routes>
    </Router>
  );
}

export default App
