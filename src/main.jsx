import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import './index.css'
import Layout from './components/Layout.jsx'
import Home from './pages/Home.jsx'
import Products from "./pages/Products.jsx"
import Cart from "./pages/Cart.jsx"
import ProductDetail from './pages/ProductDetail.jsx'
import Auth from './pages/Auth.jsx'
import UserDashboard from "./pages/UserDashboard.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminProducts from "./pages/admin/AdminProducts.jsx";
import AdminStatistics from "./pages/admin/AdminStatistics.jsx";
import AdminOrders, { AdminOrderDetail } from "./pages/admin/AdminOrders.jsx";
import Checkout from "./pages/Checkout.jsx"
import OrderSuccess from "./pages/orders/OrderSuccess.jsx";
import OrderPending from "./pages/orders/OrderPending.jsx";
import OrderQR from "./pages/orders/OrderQR.jsx";
import OrderVA from "./pages/orders/OrderVA.jsx";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes - anyone can access */}
          <Route path="/auth" element={<Auth />} />
          
          {/* Protected routes - require authentication */}
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            {/* Student & Kasir routes (both roles can access) */}
            <Route index element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="products/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            
            {/* Student-only routes */}
            <Route path="/user" element={
              <ProtectedRoute allowedRoles={['student']}>
                <UserDashboard />
              </ProtectedRoute>
            } />
            
            {/* Kasir-only routes (admin dashboard) */}
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={['kasir']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/products" element={
              <ProtectedRoute allowedRoles={['kasir']}>
                <AdminProducts />
              </ProtectedRoute>
            } />
            <Route path="/admin/orders" element={
              <ProtectedRoute allowedRoles={['kasir']}>
                <AdminOrders />
              </ProtectedRoute>
            } />
            <Route path="/admin/orders/:id" element={
              <ProtectedRoute allowedRoles={['kasir']}>
                <AdminOrderDetail />
              </ProtectedRoute>
            } />
            <Route path="/admin/statistics" element={
              <ProtectedRoute allowedRoles={['kasir']}>
                <AdminStatistics />
              </ProtectedRoute>
            } />
          </Route>

          {/* Public order pages (can be accessed without auth, but will show order info) */}
          <Route path="/orders/success" element={<OrderSuccess />} />
          <Route path="/orders/pending" element={<OrderPending />} />
          <Route path="/orders/qr" element={<OrderQR />} />
          <Route path="/orders/va" element={<OrderVA />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
)