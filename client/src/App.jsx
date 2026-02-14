import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import SignupPage from './pages/Signup.jsx'
import LoginPage from './pages/Login.jsx'
import './assets/styles.css'

function App() {
  return (
    <Router>
      <nav>
        <Link to="/login">Login</Link> | <Link to="/signup">Sign Up</Link>
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
