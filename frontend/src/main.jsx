import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import DevLogin from './pages/DevLogin.jsx'
import DevDashboard from './pages/DevDashboard.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/"         element={<App />} />
        <Route path="/dev"      element={<DevLogin />} />
        <Route path="/dev/dashboard" element={
          <ProtectedRoute>
            <DevDashboard />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)