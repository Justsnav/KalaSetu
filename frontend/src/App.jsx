import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/Landing';
import AuthPage from './pages/AuthPage';
import Marketplace from './pages/MarketPlace';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import BuyerOrders from './pages/BuyerOrders';
import Stories from './pages/Stories';
import ArtisanProfile from './pages/ArtisanProfile';
import Profile from './pages/Profile';
import ArtisanDashboard from './pages/ArtisanDashboard';
import AddProduct from './pages/AddProduct';
import EditProduct from './pages/EditProduct';
import ArtisanOrders from './pages/ArtisanOrders';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/marketplace" element={<Marketplace />} />
      <Route path="/products/:id" element={<ProductDetails />} />
      <Route path="/stories" element={<Stories />} />
      <Route path="/artisans/:id" element={<ArtisanProfile />} />
      <Route path="/cart" element={<Cart />} />

      {/* Buyer & General Protected Routes */}
      <Route
        path="/checkout"
        element={
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        }
      />
      <Route
        path="/order-success/:id"
        element={
          <ProtectedRoute>
            <OrderSuccess />
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <BuyerOrders />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* Artisan Protected Routes */}
      <Route
        path="/artisan/dashboard"
        element={
          <ProtectedRoute allowedRoles={['artisan']}>
            <ArtisanDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/add-product"
        element={
          <ProtectedRoute allowedRoles={['artisan']}>
            <AddProduct />
          </ProtectedRoute>
        }
      />
      <Route
        path="/products/:id/edit"
        element={
          <ProtectedRoute allowedRoles={['artisan']}>
            <EditProduct />
          </ProtectedRoute>
        }
      />
      <Route
        path="/artisan/orders"
        element={
          <ProtectedRoute allowedRoles={['artisan']}>
            <ArtisanOrders />
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;