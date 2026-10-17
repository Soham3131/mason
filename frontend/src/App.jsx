import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useEffect } from 'react';

// Common Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MobileBottomNav from './components/MobileBottomNav';
import ScrollToTop from './components/ScrollToTop';

// Store Pages
import Home from './pages/Home';
import Chatbot from './components/Chatbot';
import Login from './pages/Login';
import Register from './pages/Register';
import VendorRegister from './pages/VendorRegister';
import CategoryPage from './pages/CategoryPage';
import StorePage from './pages/StorePage';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import Wishlist from './pages/Wishlist';
import Profile from './pages/Profile';
import Contact from './pages/policies/Contact';
import FAQ from './pages/policies/FAQ';
import TandC from './pages/policies/TandC';
import TermsOfUse from './pages/policies/TermsOfUse';
import TrackOrder from './pages/policies/TrackOrder';
import Shipping from './pages/policies/Shipping';
import Customization from './pages/Customization';
import Returns from './pages/policies/Returns';
import Privacy from './pages/policies/Privacy';
import About from './pages/About';
import SizeGuide from './pages/policies/SizeGuide';
import GarmentCare from './pages/policies/GarmentCare';
import FabricGuide from './pages/policies/FabricGuide';
import CustomizationProcess from './pages/policies/CustomizationProcess';
import QualityStandards from './pages/policies/QualityStandards';
import Catalogue from './pages/Catalogue';
import NotFound from './pages/NotFound';
import Sitemap from './pages/Sitemap';

// Admin Components
import { Suspense, lazy } from 'react';

// Resilient dynamic import that automatically refreshes the page once if a stale chunk fails after a new deployment
const lazyWithRetry = (componentImport) =>
  lazy(async () => {
    try {
      const component = await componentImport();
      sessionStorage.removeItem('chunk_retry');
      return component;
    } catch (error) {
      console.warn('[Chunk Load Error] Retrying with reload...', error);
      const reloaded = sessionStorage.getItem('chunk_retry');
      if (!reloaded) {
        sessionStorage.setItem('chunk_retry', 'true');
        window.location.reload();
        return { default: () => null };
      }
      sessionStorage.removeItem('chunk_retry');
      throw error;
    }
  });

// Lazy load admin and vendor routes to prevent their CSS from leaking into the main app
const AdminLayout = lazyWithRetry(() => import('./components/AdminLayout'));
const Dashboard = lazyWithRetry(() => import('./pages/admin/Dashboard'));
const ProductsManagement = lazyWithRetry(() => import('./pages/admin/ProductsManagement'));
const ProductEdit = lazyWithRetry(() => import('./pages/admin/ProductEdit'));
const OrdersManagement = lazyWithRetry(() => import('./pages/admin/OrdersManagement'));
const CategoriesManagement = lazyWithRetry(() => import('./pages/admin/CategoriesManagement'));
const UsersManagement = lazyWithRetry(() => import('./pages/admin/UsersManagement'));
const UserDetail = lazyWithRetry(() => import('./pages/admin/UserDetail'));
const VendorsManagement = lazyWithRetry(() => import('./pages/admin/VendorsManagement'));
const VendorDetail = lazyWithRetry(() => import('./pages/admin/VendorDetail'));
const CouponsManagement = lazyWithRetry(() => import('./pages/admin/CouponsManagement'));
const CustomizationsManagement = lazyWithRetry(() => import('./pages/admin/CustomizationsManagement'));
const BrandsManagement = lazyWithRetry(() => import('./pages/admin/BrandsManagement'));
const ReturnsManagement = lazyWithRetry(() => import('./pages/admin/ReturnsManagement'));
const ReviewsManagement = lazyWithRetry(() => import('./pages/admin/ReviewsManagement'));
const AdminAnalytics = lazyWithRetry(() => import('./pages/admin/AdminAnalytics'));
const VendorSettlements = lazyWithRetry(() => import('./pages/admin/VendorSettlements'));
const PlatformSettings = lazyWithRetry(() => import('./pages/admin/PlatformSettings'));
const HomeMediaManagement = lazyWithRetry(() => import('./pages/admin/HomeMediaManagement'));
const RestockAlerts = lazyWithRetry(() => import('./pages/admin/RestockAlerts'));
const QueriesManagement = lazyWithRetry(() => import('./pages/admin/QueriesManagement'));

const VendorLayout = lazyWithRetry(() => import('./components/VendorLayout'));
const VendorDashboard = lazyWithRetry(() => import('./pages/vendor/VendorDashboard'));
const VendorPending = lazyWithRetry(() => import('./pages/vendor/VendorPending'));
const VendorSetPassword = lazyWithRetry(() => import('./pages/vendor/VendorSetPassword'));
const VendorProducts = lazyWithRetry(() => import('./pages/vendor/VendorProducts'));
const VendorProductForm = lazyWithRetry(() => import('./pages/vendor/VendorProductForm'));
const VendorInventory = lazyWithRetry(() => import('./pages/vendor/VendorInventory'));
const VendorOrders = lazyWithRetry(() => import('./pages/vendor/VendorOrders'));
const VendorOrderDetail = lazyWithRetry(() => import('./pages/vendor/VendorOrderDetail'));
const VendorEarnings = lazyWithRetry(() => import('./pages/vendor/VendorEarnings'));
const VendorProfile = lazyWithRetry(() => import('./pages/vendor/VendorProfile'));

// Contexts
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { NotificationProvider } from './context/NotificationContext';

const StorefrontLayout = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="app-container">
      <Navbar />
      <main className="pt-navbar">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalogue" element={<Catalogue />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/vendor-register" element={<VendorRegister />} />
          <Route path="/vendor-pending" element={
            <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>}>
              <VendorPending />
            </Suspense>
          } />
          <Route path="/vendor-set-password/:token" element={
            <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>}>
              <VendorSetPassword />
            </Suspense>
          } />
          <Route path="/category/:gender" element={<CategoryPage />} />
          <Route path="/store/:slug" element={<StorePage />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:orderId" element={<Orders />} />
          <Route path="/sitemap" element={<Sitemap />} />
          <Route path="/customisation" element={<Customization />} />
          <Route path="/customized-dresses" element={<Customization />} />
          <Route path="/custom-couple-tshirts" element={<Customization />} />
          <Route path="/custom-hoodies" element={<Customization />} />
          <Route path="/custom-tshirts" element={<Customization />} />
          <Route path="/customized-kurtis" element={<Customization />} />
          <Route path="/custom-tailoring" element={<Customization />} />
          <Route path="/custom-fashion-design" element={<Customization />} />
          <Route path="/personalized-outfits" element={<Customization />} />
          
          {/* Policy Pages */}
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/t-and-c" element={<TandC />} />
          <Route path="/terms-of-use" element={<TermsOfUse />} />
          <Route path="/track-order" element={<TrackOrder />} />
          <Route path="/shipping" element={<Shipping />} />
          <Route path="/shipping-policy" element={<Shipping />} />
          <Route path="/returns" element={<Returns />} />
          <Route path="/return-policy" element={<Returns />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/privacy-policy" element={<Privacy />} />
          <Route path="/about" element={<About />} />
          <Route path="/why-owl-stitch" element={<About />} />
          <Route path="/quality-standards" element={<QualityStandards />} />
          <Route path="/size-guide" element={<SizeGuide />} />
          <Route path="/care" element={<GarmentCare />} />
          <Route path="/fabric-guide" element={<FabricGuide />} />
          <Route path="/customization-process" element={<CustomizationProcess />} />
          
          {/* 404 Catch All */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
};

function App() {
  return (
    <CartProvider>
      <WishlistProvider>
        <NotificationProvider>
          <ScrollToTop />
          <Routes>
            {/* Admin Routes */}
            <Route path="/admin/*" element={
              <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Loading Admin...</div>}>
                <Routes>
                  <Route path="" element={<AdminLayout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="products" element={<ProductsManagement />} />
                    <Route path="products/new" element={<ProductEdit />} />
                    <Route path="products/edit/:id" element={<ProductEdit />} />
                    <Route path="orders" element={<OrdersManagement />} />
                    <Route path="categories" element={<CategoriesManagement />} />
                    <Route path="users" element={<UsersManagement />} />
                    <Route path="users/:id" element={<UserDetail />} />
                    <Route path="vendors" element={<VendorsManagement />} />
                    <Route path="vendors/:id" element={<VendorDetail />} />
                    <Route path="coupons" element={<CouponsManagement />} />
                    <Route path="customizations" element={<CustomizationsManagement />} />
                    <Route path="brands" element={<BrandsManagement />} />
                    <Route path="returns" element={<ReturnsManagement />} />
                    <Route path="reviews" element={<ReviewsManagement />} />
                    <Route path="restock-alerts" element={<RestockAlerts />} />
                    <Route path="analytics" element={<AdminAnalytics />} />
                    <Route path="settlements" element={<VendorSettlements />} />
                    <Route path="settings" element={<PlatformSettings />} />
                    <Route path="homemedia" element={<HomeMediaManagement />} />
                    <Route path="queries" element={<QueriesManagement />} />
                  </Route>
                </Routes>
              </Suspense>
            } />

            {/* Vendor Routes */}
            <Route path="/vendor/*" element={
              <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Loading Vendor...</div>}>
                <Routes>
                  <Route path="" element={<VendorLayout />}>
                    <Route index element={<VendorDashboard />} />
                    <Route path="products" element={<VendorProducts />} />
                    <Route path="products/new" element={<VendorProductForm />} />
                    <Route path="products/edit/:id" element={<VendorProductForm />} />
                    <Route path="orders" element={<VendorOrders />} />
                    <Route path="orders/:id" element={<VendorOrderDetail />} />
                    <Route path="inventory" element={<VendorInventory />} />
                    <Route path="customizations" element={<CustomizationsManagement />} />
                    <Route path="earnings" element={<VendorEarnings />} />
                    <Route path="profile" element={<VendorProfile />} />
                  </Route>
                </Routes>
              </Suspense>
            } />

            {/* Main Storefront */}
            <Route path="/*" element={<StorefrontLayout />} />
          </Routes>
          <Chatbot />
        </NotificationProvider>
      </WishlistProvider>
    </CartProvider>
  );
}

export default App;
