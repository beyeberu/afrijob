import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './contexts/ProtectedRoute';
import Term from './pages/Terms';
import Privacy from './pages/privacy';
import Home from './pages/Home';
import Jobs from './pages/Jobs';
import Login from './components/Login';
import Signup from './components/Signup';
import About from './pages/About';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Contact from './pages/Contact';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';
import FAQ from './components/Faq';
import JobPostForm from './components/JobPostForm';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              
              {/* Protected Routes */}
              <Route path="/jobs" element={
                <ProtectedRoute>
                  <ErrorBoundary>
                    <Jobs />
                  </ErrorBoundary>
                </ProtectedRoute>
              } />
              
              <Route path="/jobpostform" element={
                <ProtectedRoute>
                  <ErrorBoundary>
                    <JobPostForm />
                  </ErrorBoundary>
                </ProtectedRoute>
              } />
              
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <ErrorBoundary>
                    <Dashboard />
                  </ErrorBoundary>
                </ProtectedRoute>
              } />

              {/* Public Routes */}
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/terms" element={<Term />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<Privacy />} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;