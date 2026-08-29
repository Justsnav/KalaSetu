import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/Landing'
import AuthPage from './pages/AuthPage'
import ArtisanDashboard from './pages/ArtisanDashboard'
import AddProduct from './pages/AddProduct'
import BuyerDashboard from './pages/BuyerDashboard'
import ProtectedRoute from './components/ProtectedRoute'


const App = () => {
  return (
    <Routes> 
      <Route path="/" element={<LandingPage />} />
      <Route path ="/auth" element={<AuthPage />} />
      <Route path = "/artisan/dashboard" element={
        <ProtectedRoute> <ArtisanDashboard /> </ProtectedRoute>
      } />
      <Route path = "/add-product" element = {<AddProduct />} />
      <Route path="/buyer/dashboard" element={
        <ProtectedRoute> <BuyerDashboard /> </ProtectedRoute>
      } />
    </Routes>
  )
}

export default App