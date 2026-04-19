// Production deployment trigger - Maua's Flowers
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ProductPage from './pages/ProductPage';
import PaymentPage from './pages/PaymentPage';
import CartPage from './pages/CartPage';
import Login from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import ProtectedRoute from './components/admin/ProtectedRoute';
import Gallery from './pages/Gallery';
import FlowerDetail from './pages/FlowerDetail';
import ScrollHandler from './components/ScrollHandler';
import ToastContainer from './components/Toast';
import LandingQR from './pages/LandingQR';

function App() {
  return (
    <>
      <ScrollHandler />
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/galerie" element={<Gallery />} />
        <Route path="/galerie/:id" element={<FlowerDetail />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/payment/:orderId" element={<PaymentPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/qr/:id" element={<LandingQR />} />

        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } />
      </Routes>
    </>
  );
}

export default App;
