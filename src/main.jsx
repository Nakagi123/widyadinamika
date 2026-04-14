import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import './index.css'
import Layout from './components/layout.jsx'
import Home from './pages/Home.jsx'
import Products from "./pages/Products.jsx"
import Cart from "./pages/Cart.jsx"
import ProductDetail from './pages/ProductDetail.jsx'
import Auth from './pages/Auth.jsx'
import UserDashboard from "./pages/UserDashboard.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import Checkout from "./pages/Checkout.jsx"
import OrderSuccess from "./pages/orders/OrderSuccess.jsx";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}> 
            <Route index element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="products/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/user" element={<UserDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/checkout" element={<Checkout />} />
          </Route>

          <Route path="/auth" element={<Auth />} />
          <Route path="/orders/success" element={<OrderSuccess />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
)