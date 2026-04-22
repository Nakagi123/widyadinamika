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
import OrderFailed from "./pages/orders/OrderFailed.jsx";
import OrderPending from "./pages/orders/OrderPending.jsx";
import OrderDetail from "./pages/orders/OrderDetail.jsx";
import OrderQR from "./pages/orders/OrderQR.jsx";
import OrderVA from "./pages/orders/OrderVA.jsx";
import NotFound from "./pages/NotFound.jsx";


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public route */}
          <Route path="/auth" element={<Auth />} />
          
          {/* Public order pages */}
          <Route path="/orders/success" element={<OrderSuccess />} />
          <Route path="/orders/pending" element={<OrderPending />} />
          <Route path="/orders/failed" element={<OrderFailed />} />
          <Route path="/orders/qr" element={<OrderQR />} />
          <Route path="/orders/va" element={<OrderVA />} />

          <Route path="/orders/:id" element={
            <ProtectedRoute>
              <OrderDetail />
            </ProtectedRoute>
          } />
          
          {/* Admin routes - MUST be outside Layout to avoid conflicts */}
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
          
          {/* Protected routes with Layout */}
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            {/* Routes accessible by both student and kasir */}
            <Route index element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            
            {/* User Dashboard - accessible by both student AND kasir */}
            <Route path="/user" element={
              <ProtectedRoute allowedRoles={['student', 'kasir']}>
                <UserDashboard />
              </ProtectedRoute>
            } />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
)