import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import HeroSliderVersion2 from './components/herosliderverson2';
import CategoryList from './components/CategoryList';
import ProductGrid from './components/ProductGrid';
import LatestProductShowcase from './components/LatestProductShowcase';
import ComparisonTable from './components/ComparisonTable';
import Testimonials from './components/Testimonials';
import Newsletter from './components/Newsletter';
import SnaxxoFooter from './components/snaxxo/SnaxxoFooter';
const CartDrawer = React.lazy(() => import('./components/CartDrawer'));
import ProductModal from './components/ProductModal';
const AuthModal = React.lazy(() => import('./components/AuthModal'));
const ProductPage = React.lazy(() => import('./components/ProductPage'));
const ShopPage = React.lazy(() => import('./components/ShopPage'));
const CheckoutPage = React.lazy(() => import('./components/CheckoutPage'));
const Dashboard = React.lazy(() => import('./components/Dashboard'));
const FAQPage = React.lazy(() => import('./components/FAQPage'));
const BlogsPage = React.lazy(() => import('./components/BlogsPage'));
const DistributorPage = React.lazy(() => import('./components/DistributorPage'));
const BlogDetailPage = React.lazy(() => import('./components/BlogDetailPage'));
const EventBlogsPage = React.lazy(() => import('./components/EventBlogsPage'));
const EventDetailsPage = React.lazy(() => import('./components/EventDetailsPage'));
const AdminLoginPage = React.lazy(() => import('./components/AdminLoginPage'));
const AdminDashboard = React.lazy(() => import('./components/AdminDashboard'));
const VisitorFormPage = React.lazy(() => import('./components/VisitorFormPage'));
const JourneyPage = React.lazy(() => import('./components/JourneyPage'));
const PrivacyPolicyPage = React.lazy(() => import('./components/PrivacyPolicyPage'));
const TermsAndConditionsPage = React.lazy(() => import('./components/TermsAndConditionsPage'));
const RefundPolicyPage = React.lazy(() => import('./components/RefundPolicyPage'));
const ShippingPolicyPage = React.lazy(() => import('./components/ShippingPolicyPage'));
const SharedWishlistPage = React.lazy(() => import('./components/SharedWishlistPage'));
const NotFoundPage = React.lazy(() => import('./components/NotFoundPage'));

import RewardNotification from './components/RewardNotification';
import { ToastProvider, useToast } from './components/Toast';
import BlogSection from './components/BlogSection';
import EventsSection from './components/EventsSection';
const EventModal = React.lazy(() => import('./components/EventModal'));
import StoryCarousel from './components/StoryCarousel';
import { Product, CartItem, EventBlog, HeroSlide, Review, BlogPost, Story, VisitorForm, Category, Announcement, PressUpdate, Customer } from './types';
import SnaxxoLanding from './components/snaxxo/SnaxxoLanding';
const SnaxxoProductWheel = React.lazy(() => import('./components/snaxxo/SnaxxoProductWheel'));
import PressUpdates from './components/PressUpdates';
import MobileBottomNav from './components/MobileBottomNav';

const INITIAL_PRODUCTS: Product[] = [];
const INITIAL_STORIES: Story[] = [];
const INITIAL_REVIEWS: Review[] = [];
const INITIAL_EVENTS: EventBlog[] = [];
const INITIAL_SLIDES: HeroSlide[] = [];
const INITIAL_CATEGORIES: Category[] = [];

const CURRENT_USER = {
  name: "Alex Fueler",
  role: "Pro Member",
  avatar: "https://ui-avatars.com/api/?name=Alex+Fueler&background=008a45&color=fff"
};

type View = 'home' | 'product' | 'shop' | 'checkout' | 'dashboard' | 'faq' | 'blogs' | 'blog-detail' | 'event-blogs' | 'event-detail' | 'admin-login' | 'admin-dashboard' | 'journey' | 'privacy-policy' | 'terms-and-conditions' | 'refund-policy' | 'shipping-policy' | 'visitor-form' | 'distributor' | 'shared-wishlist' | 'not-found';

import { AuthProvider, useAuth } from './hooks/useAuth';
import { API_BASE_URL } from './config';
import { useQuery, useQueryClient } from '@tanstack/react-query';

// --- Fetcher Functions ---
const fetchProducts = async () => {
  const res = await fetch(`${API_BASE_URL}/api/products/`);
  if (!res.ok) throw new Error('Failed to fetch products');
  const productsData = await res.json();
  const productsArray = Array.isArray(productsData) ? productsData : (productsData.results || []);
  return productsArray.map((p: any) => ({
    ...p,
    id: String(p.id),
    slug: p.slug || '',
    price: parseFloat(p.price),
    reviewCount: p.review_count || 0,
    isTopRated: p.is_top_rated,
    model3d: p.model_3d || null,
    themeColor: p.theme_color,
    orientation: p.orientation ? p.orientation.replace(/[Oo]/g, '0') : '0deg 0deg 0deg',
    benefits: (p.benefits || []).filter((b: any) => b && String(b).trim() !== ""),
    nutrients: p.nutrients || [],
    nutrition: p.nutrients?.length ? Object.fromEntries(
      p.nutrients.map((n: any) => [n.label?.toLowerCase().replace(/\s+/g, ''), n.value])
    ) : undefined,
    ingredients: p.ingredients || "",
    ingredientsList: p.ingredients_list || [],
    detailedNutrition: p.detailed_nutrition || [],
    usageIdeas: (p.usage_ideas || []).map((idea: any) => ({
      id: String(idea.id),
      productId: String(idea.product),
      title: idea.title,
      description: idea.description,
      image: idea.image || '',
      order: idea.order || 0,
    })),
    mainIngredient: p.main_ingredient || (p.name?.toLowerCase().includes('peanut') ? "100% Roasted Peanuts" : p.name?.toLowerCase().includes('almond') ? "Premium Roasted Almonds" : p.name?.toLowerCase().includes('chocolate') ? "Dark Belgian Chocolate" : p.name?.toLowerCase().includes('strawberry') ? "Fresh Strawberries" : p.name?.toLowerCase().includes('chia') ? "Organic Chia Seeds" : "Premium Ingredients"),
    mainIngredientImage: p.main_ingredient_image || (p.name?.toLowerCase().includes('peanut') ? "https://images.unsplash.com/photo-1590301157890-4810ed352733?q=80&w=800&auto=format&fit=crop" : p.name?.toLowerCase().includes('almond') ? "https://images.unsplash.com/photo-1508029091899-59990abc4b8d?q=80&w=800&auto=format&fit=crop" : p.name?.toLowerCase().includes('chocolate') ? "https://images.unsplash.com/photo-1511381939415-322199ae53d5?q=80&w=800&auto=format&fit=crop" : p.name?.toLowerCase().includes('strawberry') ? "https://images.unsplash.com/photo-1518635017498-87afc0455a43?q=80&w=800&auto=format&fit=crop" : p.name?.toLowerCase().includes('chia') ? "https://images.unsplash.com/photo-1588600030303-920aa942828b?q=80&w=800&auto=format&fit=crop" : undefined)
  }));
};

const fetchCategories = async () => {
  const res = await fetch(`${API_BASE_URL}/api/categories/`);
  if (!res.ok) throw new Error('Failed to fetch categories');
  const data = await res.json();
  const dataArray = Array.isArray(data) ? data : (data.results || []);
  return dataArray.map((c: any) => ({ ...c, id: String(c.id) }));
};

const fetchAnnouncements = async () => {
  const res = await fetch(`${API_BASE_URL}/api/announcements/`);
  if (!res.ok) throw new Error('Failed to fetch announcements');
  const data = await res.json();
  return Array.isArray(data) ? data : [];
};

const fetchVisitorForms = async () => {
  const res = await fetch(`${API_BASE_URL}/api/visitor-forms/`);
  if (!res.ok) throw new Error('Failed to fetch visitor forms');
  const data = await res.json();
  return Array.isArray(data) ? data : [];
};

const fetchHeroSlides = async () => {
  const res = await fetch(`${API_BASE_URL}/api/hero-slides/`);
  if (!res.ok) throw new Error('Failed to fetch hero slides');
  const data = await res.json();
  const dataArray = Array.isArray(data) ? data : (data.results || []);
  return dataArray.map((s: any) => ({
    ...s,
    id: String(s.id),
    ctaLink: s.cta_link,
    secondaryCta: s.secondary_cta,
    secondaryCtaLink: s.secondary_cta_link,
    bgColor: s.bg_color,
    accentColor: s.accent_color,
    blobColor: s.blob_color,
    backgroundImage: s.background_image,
    productId: s.product_id,
    transitionType: s.transition_type,
    isActive: s.is_active,
    order: s.order,
    mobileImage: s.mobile_image,
    displayDuration: s.display_duration
  })).sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
};

const fetchEvents = async () => {
  const res = await fetch(`${API_BASE_URL}/api/events/`);
  if (!res.ok) throw new Error('Failed to fetch events');
  const data = await res.json();
  const dataArray = Array.isArray(data) ? data : (data.results || []);
  return dataArray.map((e: any) => ({
    ...e,
    id: String(e.id),
    fullStory: e.full_story || [],
    featuredProducts: (e.featured_products || []).map(String),
    gallery: e.gallery || [],
    impactParticipants: e.impact_participants,
    fuelBarsShared: e.fuel_bars_shared,
    vibeEnergy: e.vibe_energy,
    scheduledDate: e.scheduled_date,
    isActive: e.is_active,
  }));
};

const fetchBlogs = async () => {
  const res = await fetch(`${API_BASE_URL}/api/blog-posts/`);
  if (!res.ok) throw new Error('Failed to fetch blogs');
  const data = await res.json();
  const dataArray = Array.isArray(data) ? data : (data.results || []);
  return dataArray.map((b: any) => ({
    ...b,
    id: String(b.id),
    slug: b.slug || '',
    type: b.post_type,
    content: Array.isArray(b.content) ? b.content.join('\n\n') : (b.content || ''),
    tags: b.tags || [],
    isActive: b.is_active,
  }));
};

const fetchStories = async () => {
  const res = await fetch(`${API_BASE_URL}/api/stories/`);
  if (!res.ok) throw new Error('Failed to fetch stories');
  const data = await res.json();
  const dataArray = Array.isArray(data) ? data : (data.results || []);
  return dataArray.map((s: any) => ({
    ...s,
    id: String(s.id),
    mediaUrl: s.media_url || s.mediaUrl,
    posterUrl: s.poster_url || s.posterUrl,
    mediaType: s.media_type || s.mediaType,
    fullVideoUrl: s.full_video_url || s.fullVideoUrl,
    originalDriveUrl: s.original_drive_url || s.originalDriveUrl,
    productId: s.product_id ? String(s.product_id) : undefined
  }));
};

const fetchReviews = async () => {
  const res = await fetch(`${API_BASE_URL}/api/reviews/`);
  if (!res.ok) throw new Error('Failed to fetch reviews');
  const data = await res.json();
  const dataArray = Array.isArray(data) ? data : (data.results || []);
  return dataArray.map((r: any) => ({
    ...r,
    id: String(r.id),
    productId: String(r.product_id_str || r.product),
    userName: r.user_name,
    userRole: r.user_role,
  }));
};

const AppContent: React.FC = () => {
  // --- Local State ---
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState<View>(() => {
    const path = window.location.pathname;
    // Determine initial view from URL path (refresh / direct access)
    if (path.startsWith('/product/')) return 'product';
    if (path.startsWith('/blog/')) return 'blog-detail';
    if (path.startsWith('/blogs')) return 'blogs';
    if (path.startsWith('/shop')) return 'shop';
    if (path.startsWith('/dashboard')) return 'dashboard';
    if (path.startsWith('/faq')) return 'faq';
    if (path.startsWith('/distributor')) return 'distributor';
    if (path.startsWith('/journey')) return 'journey';
    if (path.startsWith('/checkout')) return 'checkout';
    if (path.startsWith('/events')) return 'event-blogs';
    if (path.startsWith('/event/')) return 'event-detail';
    if (path.startsWith('/privacy-policy')) return 'privacy-policy';
    if (path.startsWith('/terms-and-conditions')) return 'terms-and-conditions';
    if (path.startsWith('/refund-policy')) return 'refund-policy';
    if (path.startsWith('/shipping-policy')) return 'shipping-policy';
    if (path.startsWith('/admin/login')) return 'admin-login';
    if (path.startsWith('/admin')) return 'admin-dashboard';
    if (path.startsWith('/forms/')) return 'visitor-form';
    if (path.startsWith('/wishlist/shared/')) return 'shared-wishlist';
    return window.history.state?.view || 'not-found';
  });
  const [pressUpdates, setPressUpdates] = useState<PressUpdate[]>(() => {
    try {
      const saved = localStorage.getItem('pinobite_press_updates');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<EventBlog | null>(null);
  const [selectedBlogPost, setSelectedBlogPost] = useState<BlogPost | null>(null);
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null);
  const [sharedWishlistToken, setSharedWishlistToken] = useState<string | null>(null);
  const [globalSearchQuery, setGlobalSearchQuery] = useState(() => {
    return window.history.state?.query || '';
  });
  const [shopCategory, setShopCategory] = useState(() => {
    return window.history.state?.category || 'All';
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNutritionOpen, setIsNutritionOpen] = useState(false);

  // --- External Hooks ---
  const { user, logout, checkAuth } = useAuth();
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  // --- TanStack Queries ---
  const productsQuery = useQuery({ queryKey: ['products'], queryFn: fetchProducts, staleTime: 2 * 60 * 1000 });
  const reviewsQuery = useQuery({ queryKey: ['reviews'], queryFn: fetchReviews, staleTime: 5 * 60 * 1000 });
  const categoriesQuery = useQuery({ queryKey: ['categories'], queryFn: fetchCategories, staleTime: 2 * 60 * 1000 });
  const announcementsQuery = useQuery({ queryKey: ['announcements'], queryFn: fetchAnnouncements, staleTime: 5 * 60 * 1000 });
  const visitorFormsQuery = useQuery({ queryKey: ['visitor-forms'], queryFn: fetchVisitorForms, staleTime: 5 * 60 * 1000 });
  const heroSlidesQuery = useQuery({ queryKey: ['hero-slides'], queryFn: fetchHeroSlides, staleTime: 5 * 60 * 1000 });
  const eventsQuery = useQuery({ queryKey: ['events'], queryFn: fetchEvents, staleTime: 5 * 60 * 1000 });
  const blogPostsQuery = useQuery({ queryKey: ['blog-posts'], queryFn: fetchBlogs, staleTime: 5 * 60 * 1000 });
  const storiesQuery = useQuery({ queryKey: ['stories'], queryFn: fetchStories, staleTime: 5 * 60 * 1000 });

  // Derived values
  const products = productsQuery.data || INITIAL_PRODUCTS;
  const reviews = reviewsQuery.data || INITIAL_REVIEWS;
  const categories = categoriesQuery.data || INITIAL_CATEGORIES;
  const announcements = announcementsQuery.data || [];
  const visitorForms = visitorFormsQuery.data || [];
  const slides = heroSlidesQuery.data || INITIAL_SLIDES;
  const events = eventsQuery.data || INITIAL_EVENTS;
  const blogPosts = blogPostsQuery.data || [];
  const stories = storiesQuery.data || INITIAL_STORIES;

  const customersQuery = useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      const token = localStorage.getItem('admin_access_token');
      const res = await fetch(`${API_BASE_URL}/api/customers/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch customers');
      return res.json() as Promise<Customer[]>;
    },
    enabled: isAdminLoggedIn
  });

  const [cart, setCart] = useState<CartItem[]>([]);
  const isHydrated = React.useRef(false);

  // Initial load from localStorage
  useEffect(() => {
    if (isHydrated.current) return;

    try {
      const saved = localStorage.getItem('pinobite_cart');
      if (saved && products.length > 0) {
        const minimizedCart = JSON.parse(saved);
        const hydratedCart = minimizedCart.map((item: any) => {
          const product = products.find(p => String(p.id) === String(item.id));
          return product ? { ...product, ...item } : null;
        }).filter(Boolean) as CartItem[];

        if (hydratedCart.length > 0) {
          setCart(hydratedCart);
          isHydrated.current = true;
        }
      }
    } catch (e) {
      console.error('Initial hydration failed:', e);
    }
  }, [products]);

  // Persist only ID and Quantity to save space
  useEffect(() => {
    if (cart.length === 0 && !isHydrated.current) return;
    try {
      const minimized = cart.map(item => ({
        id: item.id,
        quantity: item.quantity,
        selectedSize: item.selectedSize,
        selectedFlavour: item.selectedFlavour
      }));
      localStorage.setItem('pinobite_cart', JSON.stringify(minimized));
    } catch (e) {
      console.error('Failed to save cart:', e);
    }
  }, [cart]);

  // Filter scheduled posts for public view
  const visibleBlogs = blogPosts.filter(post => {
    return post.isActive !== false;
  });

  const visibleEvents = events.filter(event => {
    if (event.isActive === false) return false;
    if (!event.scheduledDate) return true;  // No schedule = publish immediately
    try {
      const scheduled = new Date(event.scheduledDate);
      scheduled.setUTCHours(0, 0, 0, 0);
      const today = new Date();
      today.setUTCHours(0, 0, 0, 0);
      return scheduled <= today;
    } catch {
      return true;  // On parse error, show the event (fail open)
    }
  });



  // App is loading until critical data is fetched
  const isLoading = productsQuery.isLoading || categoriesQuery.isLoading;

  // Handle URL routing for manual links / refresh / direct access
  useEffect(() => {
    const path = window.location.pathname;
    const params = new URLSearchParams(window.location.search);

    // Helper: fetch product by slug from API
    const fetchProductBySlug = (slug: string) => {
      let mounted = true;
      fetch(`${API_BASE_URL}/api/products/${slug}/`)
        .then(res => res.json())
        .then(fullProduct => {
          if (!mounted) return;
          const mapped = {
            ...fullProduct,
            id: String(fullProduct.id),
            slug: fullProduct.slug || slug,
            price: parseFloat(fullProduct.price),
            themeColor: fullProduct.theme_color,
            model3d: fullProduct.model_3d,
            orientation: fullProduct.orientation ? fullProduct.orientation.replace(/[Oo]/g, '0') : '0deg 0deg -15deg',
            benefits: (fullProduct.benefits || []).filter((b: any) => b && String(b).trim() !== ""),
            nutrients: fullProduct.nutrients || [],
            ingredients: fullProduct.ingredients || "",
            ingredientsList: fullProduct.ingredients_list || [],
            detailedNutrition: fullProduct.detailed_nutrition || [],
            usageIdeas: (fullProduct.usage_ideas || []).map((idea: any) => ({
              id: String(idea.id),
              productId: String(idea.product),
              title: idea.title,
              description: idea.description,
              image: idea.image || '',
              order: idea.order || 0,
            })),
          };
          setSelectedProduct(mapped as Product);
          setCurrentView('product');
          window.scrollTo(0, 0);
        });
      return mounted;
    };

    if (path === '/' || path === '') {
      setCurrentView('home');
    } else if (path.startsWith('/forms/')) {
      const formId = path.split('/forms/')[1];
      if (formId) { setSelectedFormId(formId); setCurrentView('visitor-form'); }
    } else if (path.startsWith('/wishlist/shared/')) {
      const token = path.split('/wishlist/shared/')[1];
      if (token) { setSharedWishlistToken(token); setCurrentView('shared-wishlist'); }
    } else if (path.startsWith('/product/')) {
      const slug = path.split('/product/')[1]?.split('/')[0]?.split('?')[0];
      if (slug) {
        const product = products.find(p => p.slug === slug);
        if (product) {
          setSelectedProduct(product);
          setCurrentView('product');
          window.scrollTo(0, 0);
        } else {
          fetchProductBySlug(slug);
        }
      }
    } else if (path.startsWith('/blog/')) {
      const slug = path.split('/blog/')[1]?.split('/')[0]?.split('?')[0];
      if (slug) {
        const post = blogPosts.find(p => p.slug === slug);
        if (post) {
          setSelectedBlogPost(post);
          setCurrentView('blog-detail');
          window.scrollTo(0, 0);
        }
      }
    } else if (path.startsWith('/blogs')) {
      setCurrentView('blogs');
    } else if (path.startsWith('/shop/')) {
      const category = path.split('/shop/')[1]?.split('/')[0]?.split('?')[0];
      const search = params.get('search');
      if (search) { setGlobalSearchQuery(search); }
      if (category) { setShopCategory(decodeURIComponent(category)); }
      setCurrentView('shop');
    } else if (path === '/shop') {
      const search = params.get('search');
      if (search) { setGlobalSearchQuery(search); }
      setCurrentView('shop');
    } else if (path.startsWith('/event/')) {
      const eventId = path.split('/event/')[1]?.split('/')[0]?.split('?')[0];
      if (eventId) {
        const event = events.find(e => String(e.id) === String(eventId));
        if (event) {
          setSelectedEvent(event);
          setCurrentView('event-detail');
          window.scrollTo(0, 0);
        }
      }
    } else if (path === '/events') {
      setCurrentView('event-blogs');
    } else if (path === '/dashboard') {
      setCurrentView('dashboard');
    } else if (path === '/faq') {
      setCurrentView('faq');
    } else if (path === '/distributor') {
      setCurrentView('distributor');
    } else if (path === '/journey') {
      setCurrentView('journey');
    } else if (path === '/checkout') {
      setCurrentView('checkout');
    } else if (path === '/privacy-policy') {
      setCurrentView('privacy-policy');
    } else if (path === '/terms-and-conditions') {
      setCurrentView('terms-and-conditions');
    } else if (path === '/refund-policy') {
      setCurrentView('refund-policy');
    } else if (path === '/shipping-policy') {
      setCurrentView('shipping-policy');
    } else if (path === '/admin/login') {
      setCurrentView('admin-login');
    } else if (path === '/admin') {
      setCurrentView('admin-dashboard');
    } else {
      setCurrentView('not-found');
    }
  }, []); // Run once on mount
  
  // Cleanup for product detail fetch
  useEffect(() => {
    return () => {
      // Cleanup any pending state updates (handled by mounted flags)
    };
  }, []);

  // Handle browser back/forward buttons and initial state restoration
  useEffect(() => {
    const syncState = async (state: any) => {
      if (!state || !state.view) {
        // Fallback or home - only update if actually on a different view
        if (window.history.state?.view !== 'home') {
          // Careful not to trigger loop here
        }
        return;
      }

      // 1. Sync View
      if (window.history.state?.view !== state.view) {
        setCurrentView(state.view);
      }

      // 2. Sync Product (only if needed)
      if (state.slug) {
        const alreadyLoaded = selectedProduct &&
          selectedProduct.slug === state.slug &&
          (selectedProduct.benefits?.length || 0) > 0;

        if (!alreadyLoaded) {
          const p = products.find(prod => prod.slug === state.slug);
          if (p) {
            setSelectedProduct(p);
            try {
              const res = await fetch(`${API_BASE_URL}/api/products/${p.slug}/`);
              if (res.ok) {
                const fullP = await res.json();
                setSelectedProduct({
                  ...fullP,
                  id: String(fullP.id),
                  slug: fullP.slug,
                  price: parseFloat(fullP.price),
                  themeColor: fullP.theme_color,
                  model3d: fullP.model_3d,
                  orientation: fullP.orientation ? fullP.orientation.replace(/[Oo]/g, '0') : '0deg 0deg -15deg',
                  benefits: (fullP.benefits || []).filter((b: any) => b && String(b).trim() !== ""),
                  nutrients: fullP.nutrients || [],
                  ingredients: fullP.ingredients || "",
                  ingredientsList: fullP.ingredients_list || [],
                  detailedNutrition: fullP.detailed_nutrition || [],
                  usageIdeas: (fullP.usage_ideas || []).map((idea: any) => ({
                    id: String(idea.id),
                    productId: String(idea.product),
                    title: idea.title,
                    description: idea.description,
                    image: idea.image || '',
                    order: idea.order || 0,
                  })),
                  mainIngredient: fullP.main_ingredient || (fullP.name?.toLowerCase().includes('peanut') ? "100% Roasted Peanuts" : fullP.name?.toLowerCase().includes('almond') ? "Premium Roasted Almonds" : fullP.name?.toLowerCase().includes('chocolate') ? "Dark Belgian Chocolate" : fullP.name?.toLowerCase().includes('strawberry') ? "Fresh Strawberries" : fullP.name?.toLowerCase().includes('chia') ? "Organic Chia Seeds" : "Premium Ingredients"),
                  mainIngredientImage: fullP.main_ingredient_image || (fullP.name?.toLowerCase().includes('peanut') ? "https://images.unsplash.com/photo-1590301157890-4810ed352733?q=80&w=800&auto=format&fit=crop" : fullP.name?.toLowerCase().includes('almond') ? "https://images.unsplash.com/photo-1508029091899-59990abc4b8d?q=80&w=800&auto=format&fit=crop" : fullP.name?.toLowerCase().includes('chocolate') ? "https://images.unsplash.com/photo-1511381939415-322199ae53d5?q=80&w=800&auto=format&fit=crop" : fullP.name?.toLowerCase().includes('strawberry') ? "https://images.unsplash.com/photo-1518635017498-87afc0455a43?q=80&w=800&auto=format&fit=crop" : fullP.name?.toLowerCase().includes('chia') ? "https://images.unsplash.com/photo-1588600030303-920aa942828b?q=80&w=800&auto=format&fit=crop" : undefined)
                });
              }
            } catch (e) { }
          }
        }
      }

      // Minimal sync for others to avoid logic loops
      if (state.eventId) {
        const e = events.find(ev => String(ev.id) === String(state.eventId));
        if (e && (!selectedEvent || selectedEvent.id !== e.id)) setSelectedEvent(e);
      }
      if (state.slug && !state.view?.startsWith('product')) {
        const b = blogPosts.find(post => post.slug === state.slug);
        if (b && (!selectedBlogPost || selectedBlogPost.slug !== b.slug)) setSelectedBlogPost(b);
      }
    };

    const handlePopState = (event: PopStateEvent) => {
      syncState(event.state);
    };

    window.addEventListener('popstate', handlePopState);

    // Run once on mount if we have a deep linked product or state
    if (window.history.state && window.history.state.slug && !selectedProduct) {
      syncState(window.history.state);
    }

    return () => window.removeEventListener('popstate', handlePopState);
  }, [products, events, blogPosts]); // Depend on relevant query results

  useEffect(() => {
    setIsLoggedIn(!!user);
  }, [user]);

  useEffect(() => {
    const adminToken = localStorage.getItem('admin_access_token');
    if (adminToken) {
      setIsAdminLoggedIn(true);
    }
  }, []);

  // Redirect to home if user session expires while on dashboard
  useEffect(() => {
    if (!user && !isLoading && currentView === 'dashboard') {
      setCurrentView('home');
      window.history.pushState({ view: 'home' }, '', '/');
    }
  }, [user, isLoading, currentView]);

  // CMS Content is now handled by useQuery hooks above.

  // Sync pressUpdates to localStorage with a cap
  useEffect(() => {
    if (pressUpdates.length > 0) {
      const capped = pressUpdates.slice(-20);
      localStorage.setItem('pinobite_press_updates', JSON.stringify(capped));
    }
  }, [pressUpdates]);

  useEffect(() => {
    if (currentView === 'admin-dashboard') {
      const refreshAdminData = async () => {
        const token = localStorage.getItem('admin_access_token');
        if (!token) return;

        try {
          // Refresh Visitor Forms
          const response = await fetch(`${API_BASE_URL}/api/visitor-forms/`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (response.ok) {
            queryClient.invalidateQueries({ queryKey: ['visitor-forms'] });
          }

          // Refresh Announcements
          const annRes = await fetch(`${API_BASE_URL}/api/announcements/`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (annRes.ok) {
            queryClient.invalidateQueries({ queryKey: ['announcements'] });
          }
        } catch (error) {
          console.error("Failed to refresh admin data:", error);
        }
      };
      refreshAdminData();
    }
  }, [currentView]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentView, selectedProduct, selectedEvent, selectedBlogPost]);

  // Dynamic page title for SEO
  useEffect(() => {
    const titles: Record<string, string> = {
      home: 'PinoBite - Fuel Your Body Naturally',
      shop: 'Shop | PinoBite',
      product: selectedProduct ? `${selectedProduct.name} | PinoBite` : 'Product | PinoBite',
      blogs: 'Blogs | PinoBite',
      'blog-detail': selectedBlogPost ? `${selectedBlogPost.title} | PinoBite` : 'Blog | PinoBite',
      'event-blogs': 'Events | PinoBite',
      'event-detail': selectedEvent ? `${selectedEvent.title} | PinoBite` : 'Event | PinoBite',
      dashboard: 'My Dashboard | PinoBite',
      faq: 'FAQ | PinoBite',
      distributor: 'Become a Distributor | PinoBite',
      journey: 'Our Journey | PinoBite',
      checkout: 'Checkout | PinoBite',
      'privacy-policy': 'Privacy Policy | PinoBite',
      'terms-and-conditions': 'Terms & Conditions | PinoBite',
      'refund-policy': 'Refund Policy | PinoBite',
      'shipping-policy': 'Shipping Policy | PinoBite',
      'admin-login': 'Admin Login | PinoBite',
      'admin-dashboard': 'Admin Dashboard | PinoBite',
      'visitor-form': 'Visitor Form | PinoBite',
      'shared-wishlist': 'Shared Wishlist | PinoBite',
      'not-found': 'Page Not Found | PinoBite',
    };
    document.title = titles[currentView] || 'PinoBite';
  }, [currentView, selectedProduct, selectedBlogPost, selectedEvent]);

  const handleAddProduct = async (newProduct: Product) => {
    try {
      const token = localStorage.getItem('admin_access_token');
      const response = await fetch(`${API_BASE_URL}/api/products/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: newProduct.name,
          price: newProduct.price,
          rating: newProduct.rating,
          review_count: newProduct.reviewCount,
          image: newProduct.image,
          benefits: newProduct.benefits,
          nutrients: newProduct.nutrients,
          ingredients: newProduct.ingredients,
          ingredients_list: newProduct.ingredientsList,
          detailed_nutrition: newProduct.detailedNutrition,
          is_top_rated: newProduct.isTopRated,
          category: newProduct.category,
          stock: newProduct.stock,
          model_3d: newProduct.model3d,
          theme_color: newProduct.themeColor,
          orientation: newProduct.orientation,
          usage_ideas: newProduct.usageIdeas
        })
      });
      if (response.status === 401) {
        handleAdminLogout();
        return;
      }
      if (response.ok) {
        queryClient.invalidateQueries({ queryKey: ['products'] });
        showToast("Product added successfully!", 'success');
      } else {
        const errData = await response.json().catch(() => ({}));
        showToast(`Failed to add product: ${errData.detail || 'Unknown error'}`, 'error');
      }
    } catch (err) {
      console.error("Failed to add product", err);
    }
  };

  const handleUpdateProduct = async (updatedProduct: Product) => {
    try {
      const token = localStorage.getItem('admin_access_token');
      const response = await fetch(`${API_BASE_URL}/api/products/${updatedProduct.id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: updatedProduct.name,
          price: updatedProduct.price,
          description: updatedProduct.description || '',
          rating: updatedProduct.rating,
          review_count: updatedProduct.reviewCount,
          image: updatedProduct.image,
          benefits: updatedProduct.benefits,
          nutrients: updatedProduct.nutrients,
          ingredients: updatedProduct.ingredients,
          ingredients_list: updatedProduct.ingredientsList,
          detailed_nutrition: updatedProduct.detailedNutrition,
          is_top_rated: updatedProduct.isTopRated,
          category: updatedProduct.category,
          stock: updatedProduct.stock,
          model_3d: updatedProduct.model3d,
          theme_color: updatedProduct.themeColor,
          orientation: updatedProduct.orientation,
          usage_ideas: updatedProduct.usageIdeas
        })
      });
      if (response.status === 401) {
        handleAdminLogout();
        return;
      }
      if (response.ok) {
        queryClient.invalidateQueries({ queryKey: ['products'] });
        showToast("Product updated successfully!", 'success');
      } else {
        showToast("Failed to update product", 'error');
      }
    } catch (err) {
      console.error("Failed to update product", err);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      const token = localStorage.getItem('admin_access_token');
      const response = await fetch(`${API_BASE_URL}/api/products/${id}/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.status === 401) {
        handleAdminLogout();
        return;
      }
      if (response.ok) {
        queryClient.invalidateQueries({ queryKey: ['products'] });
        showToast("Product deleted successfully!", 'success');
      } else {
        showToast("Failed to delete product", 'error');
      }
    } catch (err) {
      console.error("Failed to delete product", err);
    }
  };
  const handleAddVisitorForm = async (newForm: VisitorForm) => {
    try {
      const token = localStorage.getItem('admin_access_token');
      const response = await fetch(`${API_BASE_URL}/api/visitor-forms/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: newForm.title,
          event_name: newForm.event_name,
          status: newForm.status,
          form_schema: newForm.form_schema,
          require_email_verification: newForm.require_email_verification
        })
      });
      if (response.ok) {
        const created = await response.json();
        queryClient.invalidateQueries({ queryKey: ['visitor-forms'] });
        return created;
      } else {
        const err = await response.json().catch(() => ({}));
        showToast(err.detail || 'Failed to create form', 'error');
      }
    } catch (err) {
      console.error("Failed to add visitor form", err);
      showToast('Failed to create form', 'error');
    }
    return null;
  };

  const handleUpdateVisitorForm = async (id: string, data: Partial<VisitorForm>) => {
    try {
      const token = localStorage.getItem('admin_access_token');
      const response = await fetch(`${API_BASE_URL}/api/visitor-forms/${id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });
      if (response.ok) {
        queryClient.invalidateQueries({ queryKey: ['visitor-forms'] });
        showToast('Form updated successfully!', 'success');
      } else {
        showToast('Failed to update form', 'error');
      }
    } catch (err) {
      console.error("Failed to update visitor form", err);
    }
  };

  const handleDeleteVisitorForm = async (id: string) => {
    try {
      const token = localStorage.getItem('admin_access_token');
      const response = await fetch(`${API_BASE_URL}/api/visitor-forms/${id}/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.status === 401) {
        handleAdminLogout();
        return;
      }
      if (response.ok) {
        queryClient.invalidateQueries({ queryKey: ['visitor-forms'] });
      } else {
        showToast("Failed to delete form", 'error');
      }
    } catch (err) {
      console.error("Failed to delete visitor form", err);
    }
  };
  const handleAddCategory = async (newCategory: Category) => {
    try {
      const token = localStorage.getItem('admin_access_token');
      const response = await fetch(`${API_BASE_URL}/api/categories/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newCategory)
      });
      if (response.status === 401) {
        showToast("Session expired. Please log in again.", 'warning');
        handleAdminLogout();
        return;
      }
      if (response.ok) {
        queryClient.invalidateQueries({ queryKey: ['categories'] });
      }
    } catch (err) {
      console.error("Failed to add category", err);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      const token = localStorage.getItem('admin_access_token');
      const response = await fetch(`${API_BASE_URL}/api/categories/${id}/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.status === 401) {
        showToast("Session expired. Please log in again.", 'warning');
        handleAdminLogout();
        return;
      }
      if (!response.ok) throw new Error('Failed to delete category');
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    } catch (err) {
      console.error("Failed to delete category", err);
    }
  };

  const handleAddEvent = async (newEvent: EventBlog) => {
    try {
      const token = localStorage.getItem('admin_access_token');
      const response = await fetch(`${API_BASE_URL}/api/events/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: newEvent.title,
          location: newEvent.location,
          image: newEvent.image,
          summary: newEvent.summary,
          full_story: newEvent.fullStory,
          gallery: newEvent.gallery,
          featured_products: newEvent.featuredProducts,
          date: newEvent.date,
          impact_participants: newEvent.impactParticipants,
          fuel_bars_shared: newEvent.fuelBarsShared,
          vibe_energy: newEvent.vibeEnergy,
          scheduled_date: newEvent.scheduledDate || null,
          is_active: newEvent.isActive !== false
        })
      });
      if (response.ok) {
        queryClient.invalidateQueries({ queryKey: ['events'] });
        showToast("Event story published successfully!", 'success');
      } else {
        showToast("Failed to publish event story", 'error');
      }
    } catch (err) {
      console.error("Failed to add event", err);
      showToast("An error occurred while publishing the event", 'error');
    }
  };

  const handleUpdateEvent = async (updatedEvent: EventBlog) => {
    try {
      const token = localStorage.getItem('admin_access_token');
      const response = await fetch(`${API_BASE_URL}/api/events/${updatedEvent.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: updatedEvent.title,
          location: updatedEvent.location,
          image: updatedEvent.image,
          summary: updatedEvent.summary,
          full_story: updatedEvent.fullStory,
          gallery: updatedEvent.gallery,
          featured_products: updatedEvent.featuredProducts,
          date: updatedEvent.date,
          impact_participants: updatedEvent.impactParticipants,
          fuel_bars_shared: updatedEvent.fuelBarsShared,
          vibe_energy: updatedEvent.vibeEnergy,
          scheduled_date: updatedEvent.scheduledDate || null,
          is_active: updatedEvent.isActive !== false
        })
      });
      if (response.ok) {
        queryClient.invalidateQueries({ queryKey: ['events'] });
        showToast("Event story updated successfully!", 'success');
      } else {
        showToast("Failed to update event story", 'error');
      }
    } catch (err) {
      console.error("Failed to update event", err);
      showToast("An error occurred while updating the event", 'error');
    }
  };

  const handleDeleteEvent = async (id: string) => {
    try {
      const token = localStorage.getItem('admin_access_token');
      const response = await fetch(`${API_BASE_URL}/api/events/${id}/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        queryClient.invalidateQueries({ queryKey: ['events'] });
        showToast("Event story deleted successfully!", 'success');
      } else {
        showToast("Failed to delete event story", 'error');
      }
    } catch (err) {
      console.error("Failed to delete event", err);
      showToast("An error occurred while deleting the event", 'error');
    }
  };

  const handleToggleCustomerActive = async (id: string) => {
    try {
      const token = localStorage.getItem('admin_access_token');
      const response = await fetch(`${API_BASE_URL}/api/customers/${id}/toggle_active/`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        queryClient.invalidateQueries({ queryKey: ['customers'] });
        showToast("Customer status updated", "success");
      }
    } catch (err) { console.error(err); }
  };

  const handleDeleteCustomer = async (id: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this customer?")) return;
    try {
      const token = localStorage.getItem('admin_access_token');
      const response = await fetch(`${API_BASE_URL}/api/customers/${id}/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        queryClient.invalidateQueries({ queryKey: ['customers'] });
        showToast("Customer deleted successfully", "success");
      }
    } catch (err) { console.error(err); }
  };

  const handleAddSlide = async (newSlide: HeroSlide) => {
    try {
      const token = localStorage.getItem('admin_access_token');
      const response = await fetch(`${API_BASE_URL}/api/hero-slides/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          category: newSlide.category,
          headline: newSlide.headline,
          image: newSlide.image,
          cta: newSlide.cta,
          cta_link: newSlide.ctaLink,
          secondary_cta: newSlide.secondaryCta,
          secondary_cta_link: newSlide.secondaryCtaLink,
          bg_color: newSlide.bgColor,
          accent_color: newSlide.accentColor,
          blob_color: newSlide.blobColor,
          background_image: newSlide.backgroundImage,
          product_id: newSlide.productId,
          transition_type: newSlide.transitionType,
          is_active: newSlide.isActive,
          order: newSlide.order || 0,
          mobile_image: newSlide.mobileImage,
          display_duration: newSlide.displayDuration || 5
        })
      });
      if (response.ok) {
        queryClient.invalidateQueries({ queryKey: ['hero-slides'] });
        showToast("Slide added successfully!", 'success');
      } else {
        console.error("Failed to add slide response:", await response.text());
      }
    } catch (err) {
      console.error("Failed to add slide caught:", err);
    }
  };

  const handleAddRewardRule = async (newRule: Omit<RewardRule, 'id'>) => {
  };

  const handleUpdateSlide = async (updatedSlide: HeroSlide) => {
    try {
      const token = localStorage.getItem('admin_access_token');
      const response = await fetch(`${API_BASE_URL}/api/hero-slides/${updatedSlide.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          category: updatedSlide.category,
          headline: updatedSlide.headline,
          image: updatedSlide.image,
          cta: updatedSlide.cta,
          cta_link: updatedSlide.ctaLink,
          secondary_cta: updatedSlide.secondaryCta,
          secondary_cta_link: updatedSlide.secondaryCtaLink,
          bg_color: updatedSlide.bgColor,
          accent_color: updatedSlide.accentColor,
          blob_color: updatedSlide.blobColor,
          background_image: updatedSlide.backgroundImage,
          product_id: updatedSlide.productId,
          transition_type: updatedSlide.transitionType,
          is_active: updatedSlide.isActive,
          order: updatedSlide.order || 0,
          mobile_image: updatedSlide.mobileImage,
          display_duration: updatedSlide.displayDuration || 5
        })
      });
      if (response.ok) {
        queryClient.invalidateQueries({ queryKey: ['hero-slides'] });
      } else {
        console.error("Failed to update slide response:", await response.text());
      }
    } catch (err) {
      console.error("Failed to update slide caught:", err);
    }
  };

  const handleDeleteSlide = async (id: string) => {
    try {
      const token = localStorage.getItem('admin_access_token');
      await fetch(`${API_BASE_URL}/api/hero-slides/${id}/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      queryClient.invalidateQueries({ queryKey: ['hero-slides'] });
    } catch (err) {
      console.error("Failed to delete slide", err);
    }
  };

  const buildBlogFormData = (blog: BlogPost): FormData => {
    const fd = new FormData();
    fd.append('post_type', blog.type);
    fd.append('title', blog.title);
    fd.append('excerpt', blog.excerpt);
    fd.append('date', blog.date ? new Date(blog.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]);
    fd.append('author', blog.author);
    fd.append('content', blog.content);
    fd.append('is_active', String(blog.isActive !== false));
    fd.append('subtitle', blog.subtitle || '');
    fd.append('intro_heading', blog.intro_heading || '');
    fd.append('featured_quote', blog.featured_quote || '');
    fd.append('tags', blog.tags ? blog.tags.join(',') : '');
    fd.append('facts_list', JSON.stringify(blog.facts_list || []));
    fd.append('key_points', JSON.stringify(blog.key_points || []));
    fd.append('health_benefits', JSON.stringify(blog.health_benefits || []));
    fd.append('usage_recipes', JSON.stringify(blog.usage_recipes || []));
    return fd;
  };

  const handleAddBlog = async (newBlog: BlogPost) => {
    try {
      const token = localStorage.getItem('admin_access_token');
      const headers: Record<string, string> = { 'Authorization': `Bearer ${token}` };
      let body: BodyInit;
      if (newBlog.imageFile) {
        const fd = buildBlogFormData(newBlog);
        fd.append('image', newBlog.imageFile);
        body = fd;
      } else {
        headers['Content-Type'] = 'application/json';
        body = JSON.stringify({
          post_type: newBlog.type,
          title: newBlog.title,
          excerpt: newBlog.excerpt,
          image: newBlog.image,
          date: newBlog.date ? new Date(newBlog.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          author: newBlog.author,
          content: newBlog.content,
          tags: newBlog.tags,
          is_active: newBlog.isActive !== false,
          subtitle: newBlog.subtitle || null,
          intro_heading: newBlog.intro_heading || null,
          featured_quote: newBlog.featured_quote || null,
          facts_list: newBlog.facts_list || [],
          key_points: newBlog.key_points || [],
          health_benefits: newBlog.health_benefits || [],
          usage_recipes: newBlog.usage_recipes || []
        });
      }
      const response = await fetch(`${API_BASE_URL}/api/blog-posts/`, {
        method: 'POST',
        headers,
        body
      });
      if (response.ok) {
        queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      }
    } catch (err) {
      console.error("Failed to add blog", err);
    }
  };

  const handleAddAnnouncement = async (newA: Announcement) => {
    try {
      const token = localStorage.getItem('admin_access_token');
      const response = await fetch(`${API_BASE_URL}/api/announcements/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: newA.message,
          start_date: newA.start_date,
          end_date: newA.end_date,
          is_active: newA.is_active
        })
      });
      if (response.ok) {
        queryClient.invalidateQueries({ queryKey: ['announcements'] });
      }
    } catch (err) {
      console.error("Failed to add announcement", err);
    }
  };

  const handleUpdateAnnouncement = async (updatedA: Announcement) => {
    try {
      const token = localStorage.getItem('admin_access_token');
      const response = await fetch(`${API_BASE_URL}/api/announcements/${updatedA.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: updatedA.message,
          start_date: updatedA.start_date,
          end_date: updatedA.end_date,
          is_active: updatedA.is_active
        })
      });
      if (response.ok) {
        queryClient.invalidateQueries({ queryKey: ['announcements'] });
      }
    } catch (err) {
      console.error("Failed to update announcement", err);
    }
  };

  const handleDeleteAnnouncement = async (id: number) => {
    try {
      const token = localStorage.getItem('admin_access_token');
      const response = await fetch(`${API_BASE_URL}/api/announcements/${id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        queryClient.invalidateQueries({ queryKey: ['announcements'] });
      }
    } catch (err) {
      console.error("Failed to delete announcement", err);
    }
  };

  // Press Updates Handlers (localStorage-based - no backend API yet)
  const handleAddPressUpdate = (newPress: PressUpdate) => {
    setPressUpdates(prev => {
      const updated = [newPress, ...prev];
      localStorage.setItem('pinobite_press_updates', JSON.stringify(updated));
      return updated;
    });
  };

  const handleDeletePressUpdate = (id: string) => {
    setPressUpdates(prev => {
      const updated = prev.filter(p => p.id !== id);
      localStorage.setItem('pinobite_press_updates', JSON.stringify(updated));
      return updated;
    });
  };

  const handleUpdateBlog = async (updatedBlog: BlogPost) => {
    try {
      const token = localStorage.getItem('admin_access_token');
      const headers: Record<string, string> = { 'Authorization': `Bearer ${token}` };
      let body: BodyInit;
      if (updatedBlog.imageFile) {
        const fd = buildBlogFormData(updatedBlog);
        fd.append('image', updatedBlog.imageFile);
        body = fd;
      } else {
        headers['Content-Type'] = 'application/json';
        body = JSON.stringify({
          post_type: updatedBlog.type,
          title: updatedBlog.title,
          excerpt: updatedBlog.excerpt,
          image: updatedBlog.image,
          date: updatedBlog.date ? new Date(updatedBlog.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          author: updatedBlog.author,
          content: updatedBlog.content,
          tags: updatedBlog.tags,
          is_active: updatedBlog.isActive !== false,
          subtitle: updatedBlog.subtitle || null,
          intro_heading: updatedBlog.intro_heading || null,
          featured_quote: updatedBlog.featured_quote || null,
          facts_list: updatedBlog.facts_list || [],
          key_points: updatedBlog.key_points || [],
          health_benefits: updatedBlog.health_benefits || [],
          usage_recipes: updatedBlog.usage_recipes || []
        });
      }
      const response = await fetch(`${API_BASE_URL}/api/blog-posts/${updatedBlog.id}/`, {
        method: 'PUT',
        headers,
        body
      });
      if (response.ok) {
        queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      }
    } catch (err) {
      console.error("Failed to update blog", err);
    }
  };

  const handleDeleteBlog = async (id: string) => {
    try {
      const token = localStorage.getItem('admin_access_token');
      const response = await fetch(`${API_BASE_URL}/api/blog-posts/${id}/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.status === 401) {
        showToast("Session expired. Please log in again.", 'warning');
        handleAdminLogout();
        return;
      }
      if (response.ok) {
        queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      }
    } catch (err) {
      console.error("Failed to delete blog", err);
    }
  };

  const handleAddReview = (review: Review) => {
    queryClient.invalidateQueries({ queryKey: ['reviews'] });
    // Refresh user's points to show on dashboard immediately
    checkAuth();
  };

  const handleAddStory = async (newStory: Story) => {
    try {
      const token = localStorage.getItem('admin_access_token');
      const response = await fetch(`${API_BASE_URL}/api/stories/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          media_url: newStory.mediaUrl,
          poster_url: newStory.posterUrl,
          media_type: newStory.mediaType,
          original_drive_url: newStory.originalDriveUrl,
          full_video_url: newStory.fullVideoUrl,
          product_id: newStory.productId
        })
      });
      if (response.ok) {
        queryClient.invalidateQueries({ queryKey: ['stories'] });
        showToast("Story added successfully!", 'success');
      } else {
        const errorData = await response.json().catch(() => ({}));
        showToast(`Failed to add story: ${errorData.detail || errorData.error || response.statusText}`, 'error');
      }
    } catch (err) {
      console.error("Failed to add story", err);
      showToast("Error adding story. The image might be too large or the server is busy.", 'error');
    }
  };

  const handleDeleteStory = async (id: string) => {
    try {
      const token = localStorage.getItem('admin_access_token');
      const response = await fetch(`${API_BASE_URL}/api/stories/${id}/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        queryClient.invalidateQueries({ queryKey: ['stories'] });
        showToast("Story deleted successfully!", 'success');
      } else {
        showToast("Failed to delete story", 'error');
      }
    } catch (err) {
      console.error("Failed to delete story", err);
      showToast("Error deleting story", 'error');
    }
  };

  const addToCart = React.useCallback((product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  }, []);

  const removeFromCart = React.useCallback((id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  }, []);

  const updateQuantity = React.useCallback((id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  }, []);

  const navigateToProduct = React.useCallback(async (product: Product) => {
    setSelectedProduct(product);
    setCurrentView('product');
    window.history.pushState({ view: 'product', slug: product.slug }, '', `/product/${product.slug}`);
    window.scrollTo(0, 0);
    // Fetch full details since list view is now minimal
    try {
      const response = await fetch(`${API_BASE_URL}/api/products/${product.slug}/`);
      if (response.ok) {
        const fullProduct = await response.json();
        const mappedProduct = {
          ...fullProduct,
          id: String(fullProduct.id),
          price: parseFloat(fullProduct.price),
          themeColor: fullProduct.theme_color,
          model3d: fullProduct.model_3d,
          orientation: fullProduct.orientation ? fullProduct.orientation.replace(/[Oo]/g, '0') : '0deg 0deg -15deg',
          benefits: (fullProduct.benefits || []).filter((b: any) => b && String(b).trim() !== ""),
          nutrients: fullProduct.nutrients || [],
          ingredients: fullProduct.ingredients || "",
          ingredientsList: fullProduct.ingredients_list || [],
          detailedNutrition: fullProduct.detailed_nutrition || [],
          usageIdeas: (fullProduct.usage_ideas || []).map((idea: any) => ({
            id: String(idea.id),
            productId: String(idea.product),
            title: idea.title,
            description: idea.description,
            image: idea.image || '',
            order: idea.order || 0,
          })),
          mainIngredient: fullProduct.main_ingredient || (fullProduct.name.toLowerCase().includes('peanut') ? "100% Roasted Peanuts" : fullProduct.name.toLowerCase().includes('almond') ? "Premium Roasted Almonds" : fullProduct.name.toLowerCase().includes('chocolate') ? "Dark Belgian Chocolate" : fullProduct.name.toLowerCase().includes('strawberry') ? "Fresh Strawberries" : fullProduct.name.toLowerCase().includes('chia') ? "Organic Chia Seeds" : "Premium Ingredients"),
          mainIngredientImage: fullProduct.main_ingredient_image || (fullProduct.name.toLowerCase().includes('peanut') ? "https://images.unsplash.com/photo-1590301157890-4810ed352733?q=80&w=800&auto=format&fit=crop" : fullProduct.name.toLowerCase().includes('almond') ? "https://images.unsplash.com/photo-1508029091899-59990abc4b8d?q=80&w=800&auto=format&fit=crop" : fullProduct.name.toLowerCase().includes('chocolate') ? "https://images.unsplash.com/photo-1511381939415-322199ae53d5?q=80&w=800&auto=format&fit=crop" : fullProduct.name.toLowerCase().includes('strawberry') ? "https://images.unsplash.com/photo-1518635017498-87afc0455a43?q=80&w=800&auto=format&fit=crop" : fullProduct.name.toLowerCase().includes('chia') ? "https://images.unsplash.com/photo-1588600030303-920aa942828b?q=80&w=800&auto=format&fit=crop" : undefined)
        };
        setSelectedProduct(mappedProduct);
      }
    } catch (err) {
      console.error("Failed to fetch full product details", err);
    }
  }, []);

  const navigateToShop = React.useCallback(() => {
    setShopCategory('All');
    setCurrentView('shop');
    setSelectedProduct(null);
    setGlobalSearchQuery('');
    setIsCartOpen(false);
    setIsAuthOpen(false);
    window.history.pushState({ view: 'shop', category: 'All', query: '' }, '', '/shop');
  }, []);

  const navigateToShopCategory = React.useCallback((category: string) => {
    setShopCategory(category);
    setCurrentView('shop');
    setGlobalSearchQuery('');
    setSelectedProduct(null);
    window.history.pushState({ view: 'shop', category, query: '' }, '', `/shop/${category}`);
  }, []);

  const handleGlobalSearch = React.useCallback((query: string) => {
    setGlobalSearchQuery(query);
    setShopCategory('All');
    setCurrentView('shop');
    setSelectedProduct(null);
    window.history.pushState({ view: 'shop', category: 'All', query }, '', `/shop?search=${encodeURIComponent(query)}`);
  }, []);

  const navigateToCheckout = React.useCallback(() => {
    setCurrentView('checkout');
    setIsCartOpen(false);
    setSelectedProduct(null);
    window.history.pushState({ view: 'checkout' }, '', '/checkout');
  }, []);

  const navigateToDashboard = React.useCallback(() => {
    setCurrentView('dashboard');
    setSelectedProduct(null);
    window.history.pushState({ view: 'dashboard' }, '', '/dashboard');
  }, []);

  const navigateToFAQ = React.useCallback(() => {
    setCurrentView('faq');
    setSelectedProduct(null);
    window.history.pushState({ view: 'faq' }, '', '/faq');
  }, []);

  const navigateToDistributor = React.useCallback(() => {
    setCurrentView('distributor');
    setSelectedProduct(null);
    window.history.pushState({ view: 'distributor' }, '', '/distributor');
  }, []);

  const navigateToBlogs = React.useCallback(() => {
    setCurrentView('blogs');
    setSelectedProduct(null);
    window.history.pushState({ view: 'blogs' }, '', '/blogs');
  }, []);

  const navigateToBlogDetail = React.useCallback((post: BlogPost) => {
    setSelectedBlogPost(post);
    setCurrentView('blog-detail');
    window.history.pushState({ view: 'blog-detail', slug: post.slug }, '', `/blog/${post.slug}`);
  }, []);

  const navigateToEventBlogs = React.useCallback(() => {
    setCurrentView('event-blogs');
    setSelectedProduct(null);
    setSelectedEvent(null);
    window.history.pushState({ view: 'event-blogs' }, '', '/events');
  }, []);

  const navigateToEventDetail = React.useCallback((event: EventBlog) => {
    setSelectedEvent(event);
    setCurrentView('event-detail');
    window.history.pushState({ view: 'event-detail', eventId: event.id }, '', `/event/${event.id}`);
  }, []);

  const navigateToAdmin = React.useCallback(() => {
    if (isAdminLoggedIn) {
      setCurrentView('admin-dashboard');
      window.history.pushState({ view: 'admin-dashboard' }, '', '/admin');
    } else {
      setCurrentView('admin-login');
      window.history.pushState({ view: 'admin-login' }, '', '/admin/login');
    }
  }, [isAdminLoggedIn]);

  const navigateToJourney = React.useCallback(() => {
    setCurrentView('journey');
    setSelectedProduct(null);
    setSelectedEvent(null);
    window.history.pushState({ view: 'journey' }, '', '/journey');
  }, []);

  const navigateToPrivacy = React.useCallback(() => {
    setCurrentView('privacy-policy');
    setSelectedProduct(null);
    window.history.pushState({ view: 'privacy-policy' }, '', '/privacy-policy');
  }, []);

  const navigateToTerms = React.useCallback(() => {
    setCurrentView('terms-and-conditions');
    setSelectedProduct(null);
    window.history.pushState({ view: 'terms-and-conditions' }, '', '/terms-and-conditions');
  }, []);

  const navigateToRefund = React.useCallback(() => {
    setCurrentView('refund-policy');
    setSelectedProduct(null);
    window.history.pushState({ view: 'refund-policy' }, '', '/refund-policy');
  }, []);

  const navigateToShipping = React.useCallback(() => {
    setCurrentView('shipping-policy');
    setSelectedProduct(null);
    window.history.pushState({ view: 'shipping-policy' }, '', '/shipping-policy');
  }, []);

  const goHome = React.useCallback(() => {
    setCurrentView('home');
    setSelectedProduct(null);
    setSelectedEvent(null);
    setSelectedBlogPost(null);
    setGlobalSearchQuery('');
    setIsCartOpen(false);
    setIsAuthOpen(false);
    window.history.pushState({ view: 'home' }, '', '/');
  }, []);

  const handleLogin = () => {
    setIsAuthOpen(false);
    setCurrentView('dashboard');
    window.history.pushState({ view: 'dashboard' }, '', '/dashboard');
  };

  const handleLogout = () => {
    logout();
    setCurrentView('home');
    window.history.pushState({ view: 'home' }, '', '/');
  };

  const handleAdminLogin = () => {
    setIsAdminLoggedIn(true);
    setCurrentView('admin-dashboard');
    window.history.pushState({ view: 'admin-dashboard' }, '', '/admin');
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem('admin_access_token');
    localStorage.removeItem('admin_refresh_token');
    setCurrentView('home');
    window.history.pushState({ view: 'home' }, '', '/');
  };

  const clearCart = () => {
    setCart([]);
  };

  if (currentView === 'admin-login') {
    return <AdminLoginPage onLoginSuccess={handleAdminLogin} onBackToSite={goHome} />;
  }

  if (currentView === 'admin-dashboard') {
    return (
      <AdminDashboard
        onLogout={handleAdminLogout}
        onBackToSite={goHome}
        products={products}
        onAddProduct={handleAddProduct}
        onUpdateProduct={handleUpdateProduct}
        onDeleteProduct={handleDeleteProduct}
        categories={categories}
        onAddCategory={handleAddCategory}
        onDeleteCategory={handleDeleteCategory}
        events={events}
        onAddEvent={handleAddEvent}
        onUpdateEvent={handleUpdateEvent}
        onDeleteEvent={handleDeleteEvent}
        slides={slides}
        onAddSlide={handleAddSlide}
        onUpdateSlide={handleUpdateSlide}
        onDeleteSlide={handleDeleteSlide}
        blogPosts={blogPosts}
        onAddBlog={handleAddBlog}
        onUpdateBlog={handleUpdateBlog}
        onDeleteBlog={handleDeleteBlog}
        stories={stories}
        onAddStory={handleAddStory}
        onDeleteStory={handleDeleteStory}
        visitorForms={visitorForms}
        onAddVisitorForm={handleAddVisitorForm}
        onUpdateVisitorForm={handleUpdateVisitorForm}
        onDeleteVisitorForm={handleDeleteVisitorForm}
        announcements={announcements}
        onAddAnnouncement={handleAddAnnouncement}
        onUpdateAnnouncement={handleUpdateAnnouncement}
        onDeleteAnnouncement={handleDeleteAnnouncement}
        pressUpdates={pressUpdates}
        onAddPressUpdate={handleAddPressUpdate}
        onDeletePressUpdate={handleDeletePressUpdate}
        customers={customersQuery.data || []}
        onToggleCustomerActive={handleToggleCustomerActive}
        onDeleteCustomer={handleDeleteCustomer}
      />
    );
  }

  return (
    <div className="min-h-screen selection:bg-primary/20 bg-background-light">
      {/* Full Page Premium Loading Screen */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-[10000] bg-white flex flex-col items-center justify-center"
          >
            <div className="relative w-32 h-32">
              {/* Pulsing Logo */}
              <motion.img
                src="/logos/Pinobite-logo.png"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-full h-full object-contain"
                alt="Pinobite Logo"
              />
            </div>

          </motion.div>
        )}
      </AnimatePresence>

      {
        currentView !== 'checkout' && currentView !== 'visitor-form' && (
          <Navbar
            cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
            isLoggedIn={isLoggedIn}
            onCartClick={() => setIsCartOpen(true)}
            onAccountClick={() => isLoggedIn ? navigateToDashboard() : setIsAuthOpen(true)}
            onLogoClick={goHome}
            onProductsClick={() => navigateToShop()}
            onCategoryClick={navigateToShopCategory}
            onDashboardClick={() => navigateToDashboard()}
            onStoriesClick={navigateToBlogs}
            onJourneyClick={navigateToJourney}
            onSearch={handleGlobalSearch}
            products={products}
            blogPosts={blogPosts}
            events={visibleEvents}
            onProductClick={navigateToProduct}
            onBlogClick={navigateToBlogDetail}
            onEventClick={navigateToEventDetail}
            categories={categories}
            onMenuStateChange={setIsMenuOpen}
            announcements={(announcements || [])
              .filter(a => {
                if (!a || !a.is_active || !a.start_date || !a.end_date) return false;
                const now = new Date();
                const year = now.getFullYear();
                const month = String(now.getMonth() + 1).padStart(2, '0');
                const day = String(now.getDate()).padStart(2, '0');
                const localTodayStr = `${year}-${month}-${day}`;
                const startStr = a.start_date.split('T')[0];
                const endStr = a.end_date.split('T')[0];
                return localTodayStr >= startStr && localTodayStr <= endStr;
              })
              .map(a => a.message)}
          />
        )
      }

      <main className="animate-in fade-in duration-500">
        <React.Suspense fallback={
          <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        }>
          {currentView === 'home' && (
            <>
              {slides.length > 0 && <HeroSliderVersion2 slides={slides} />}
              {products.length > 0 && <CategoryList onCategoryClick={navigateToShopCategory} products={products} />}
              {stories.length > 0 && <StoryCarousel stories={[...stories].reverse().slice(0, 5)} products={products} onProductClick={navigateToProduct} onAddToCart={addToCart} />}
              {products.length > 0 && (
                <div className="snaxxo-wrapper relative w-full overflow-hidden bg-whiteboard-alt texture-overlay texture-speckles">
                  <SnaxxoProductWheel
                    products={products}
                    onAddToCart={addToCart}
                    onProductClick={navigateToProduct}
                    isLoading={isLoading}
                    onShopClick={navigateToShop}
                    onHomeClick={goHome}
                    onFAQClick={navigateToFAQ}

                    onBlogsClick={navigateToBlogs}
                    onEventBlogsClick={navigateToEventBlogs}
                    onAdminClick={navigateToAdmin}
                    onJourneyClick={navigateToJourney}
                    onPrivacyClick={navigateToPrivacy}
                    onTermsClick={navigateToTerms}
                    onRefundClick={navigateToRefund}
                    onShippingClick={navigateToShipping}
                    onDistributorClick={navigateToDistributor}
                  />
                </div>
              )}
              <LatestProductShowcase product={products[0]} />

              <ComparisonTable />

              {reviews.length > 0 && <Testimonials reviews={reviews} />}
              {blogPosts.length > 0 && (
                <BlogSection
                  posts={visibleBlogs}
                  onPostClick={navigateToBlogDetail}
                  onViewAllClick={navigateToBlogs}
                />
              )}
              {events.length > 0 && (
                <EventsSection
                  events={visibleEvents}
                  onParticipateClick={() => setIsEventModalOpen(true)}
                  onViewRecapsClick={navigateToEventBlogs}
                />
              )}
              {pressUpdates.length > 0 && <PressUpdates pressUpdates={pressUpdates} />}
              <Newsletter />
            </>
          )}

          {currentView === 'distributor' && (
            <DistributorPage onHomeClick={goHome} />
          )}

          {currentView === 'shared-wishlist' && sharedWishlistToken && (
            <SharedWishlistPage
              token={sharedWishlistToken}
              onBack={goHome}
              onAddToCart={addToCart}
            />
          )}

          {currentView === 'shop' && (
            <ShopPage
              onProductClick={navigateToProduct}
              onAddToCart={addToCart}
              searchQuery={globalSearchQuery}
              selectedCategory={shopCategory}
              onHomeClick={goHome}
            />
          )}

          {currentView === 'product' && selectedProduct && (
            <ProductPage
              product={selectedProduct}
              products={products}
              stories={stories}
              onProductClick={navigateToProduct}
              onShopClick={navigateToShop}
              onAddToCart={addToCart}
              onBack={navigateToShop}
              reviews={reviews}
              onAddReview={handleAddReview}
              isLoggedIn={isLoggedIn}
              onLoginClick={() => setIsAuthOpen(true)}
              onPopupToggle={setIsNutritionOpen}
              onHomeClick={goHome}
            />
          )}

          {currentView === 'checkout' && (
            <CheckoutPage
              items={cart}
              onBack={navigateToShop}
              onOrderSuccess={() => {
                setCart([]);
                goHome();
              }}
              onLoginRequired={() => setIsAuthOpen(true)}
              checkAuth={checkAuth}
            />
          )}

          {currentView === 'dashboard' && (
            <Dashboard onLogout={handleLogout} onHomeClick={goHome} onAddToCart={addToCart} onProductClick={navigateToProduct} />
          )}

          {currentView === 'faq' && (
            <FAQPage onHomeClick={goHome} />
          )}

          {currentView === 'blogs' && (
            <BlogsPage
              posts={visibleBlogs}
              onBlogClick={navigateToBlogDetail}
              onHomeClick={goHome}
            />
          )}

          {currentView === 'blog-detail' && selectedBlogPost && (
            <BlogDetailPage
              post={selectedBlogPost}
              onBack={navigateToBlogs}
              onHomeClick={goHome}
            />
          )}

          {currentView === 'event-blogs' && (
            <EventBlogsPage
              events={visibleEvents}
              onEventClick={navigateToEventDetail}
              onHomeClick={goHome}
            />
          )}

          {currentView === 'event-detail' && selectedEvent && (
            <EventDetailsPage
              event={selectedEvent}
              onBack={navigateToEventBlogs}
              onHomeClick={goHome}
              products={products}
              onProductClick={navigateToProduct}
              onAddToCart={addToCart}
            />
          )}

          {currentView === 'journey' && (
            <JourneyPage onShopClick={navigateToShop} onHomeClick={goHome} />
          )}

          {currentView === 'privacy-policy' && (
            <PrivacyPolicyPage onHomeClick={goHome} />
          )}

          {currentView === 'terms-and-conditions' && (
            <TermsAndConditionsPage onHomeClick={goHome} />
          )}

          {currentView === 'refund-policy' && (
            <RefundPolicyPage onHomeClick={goHome} />
          )}

          {currentView === 'shipping-policy' && (
            <ShippingPolicyPage onHomeClick={goHome} />
          )}
          {currentView === 'visitor-form' && selectedFormId && (
            <VisitorFormPage formId={selectedFormId} onHomeClick={goHome} />
          )}
          {currentView === 'not-found' && (
            <NotFoundPage onHomeClick={goHome} />
          )}
        </React.Suspense>
      </main>

      {
        currentView !== 'checkout' && currentView !== 'visitor-form' && (
          <SnaxxoFooter
            onShopClick={(cat) => cat ? navigateToShopCategory(cat) : navigateToShop()}
            onHomeClick={goHome}
            onFAQClick={navigateToFAQ}

            onBlogsClick={navigateToBlogs}
            onEventBlogsClick={navigateToEventBlogs}
            onAdminClick={navigateToAdmin}
            onJourneyClick={navigateToJourney}
            onPrivacyClick={navigateToPrivacy}
            onTermsClick={navigateToTerms}
            onRefundClick={navigateToRefund}
            onShippingClick={navigateToShipping}
            onDistributorClick={navigateToDistributor}
          />
        )
      }



      <RewardNotification />
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        products={productsQuery.data || []}
        onRemove={removeFromCart}
        onUpdateQty={updateQuantity}
        onAddToCart={addToCart}
        onCheckout={navigateToCheckout}
        onShopClick={navigateToShop}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLogin={handleLogin}
      />

      <EventModal
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        events={events}
      />

      {
        currentView !== 'checkout' && currentView !== 'visitor-form' && !isLoading && (
          <MobileBottomNav
            currentView={currentView}
            onHomeClick={goHome}
            onShopClick={navigateToShop}
            onCartClick={() => {
              setIsCartOpen(true);
              setIsAuthOpen(false);
            }}
            onAccountClick={() => {
              if (isLoggedIn) {
                navigateToDashboard();
                setIsAuthOpen(false);
                setIsCartOpen(false);
              } else {
                setIsAuthOpen(true);
                setIsCartOpen(false);
              }
            }}
            cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
            isCartOpen={isCartOpen}
            isAuthOpen={isAuthOpen}
            isMenuOpen={isMenuOpen}
            isHidden={isNutritionOpen}
          />
        )
      }
    </div >
  );
};

const App: React.FC = () => {
  return (
    <ToastProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ToastProvider>
  );
};

export default App;
