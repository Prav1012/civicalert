import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ children }) {
  const auth = sessionStorage.getItem('dev_auth')
  if (!auth) return <Navigate to="/dev" replace />
  return children
}