
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CategoryList from './components/CategoryList';
import ProductGrid from './components/ProductGrid';
import LatestProductShowcase from './components/LatestProductShowcase';
import ComparisonTable from './components/ComparisonTable';
import Testimonials from './components/Testimonials';
import Newsletter from './components/Newsletter';
import SnaxxoFooter from './components/snaxxo/SnaxxoFooter';
import CartDrawer from './components/CartDrawer';
import ProductModal from './components/ProductModal';
import AuthModal from './components/AuthModal';
import ProductPage from './components/ProductPage';
import ShopPage from './components/ShopPage';
import CheckoutPage from './components/CheckoutPage';
import Dashboard from './components/Dashboard';
import FAQPage from './components/FAQPage';
import BlogsPage from './components/BlogsPage';
import DistributorPage from './components/DistributorPage';
import BlogSection from './components/BlogSection';
import BlogDetailPage from './components/BlogDetailPage';
import EventBlogsPage from './components/EventBlogsPage';
import EventDetailsPage from './components/EventDetailsPage';
import EventsSection from './components/EventsSection';
import EventModal from './components/EventModal';
import AdminLoginPage from './components/AdminLoginPage';
import AdminDashboard from './components/AdminDashboard';
import VisitorFormPage from './components/VisitorFormPage';
import JourneyPage from './components/JourneyPage';
import PrivacyPolicyPage from './components/PrivacyPolicyPage';
import TermsAndConditionsPage from './components/TermsAndConditionsPage';
import RefundPolicyPage from './components/RefundPolicyPage';
import ShippingPolicyPage from './components/ShippingPolicyPage';
import StoryCarousel from './components/StoryCarousel';
import { Product, CartItem, EventBlog, HeroSlide, Review, BlogPost, Story, VisitorForm, Category, Announcement, PressUpdate } from './types';
import SnaxxoLanding from './components/snaxxo/SnaxxoLanding';
import SnaxxoProductWheel from './components/snaxxo/SnaxxoProductWheel';
import PressUpdates from './components/PressUpdates';
import MobileBottomNav from './components/MobileBottomNav';
import RewardNotification from './components/RewardNotification';

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

type View = 'home' | 'product' | 'shop' | 'checkout' | 'dashboard' | 'faq' | 'blogs' | 'blog-detail' | 'event-blogs' | 'event-detail' | 'admin-login' | 'admin-dashboard' | 'journey' | 'privacy-policy' | 'terms-and-conditions' | 'refund-policy' | 'shipping-policy' | 'visitor-form' | 'distributor';

import { AuthProvider, useAuth } from './hooks/useAuth';
import { API_BASE_URL } from './config';

const AppContent: React.FC = () => {
  const { user, logout, checkAuth } = useAuth();
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [events, setEvents] = useState<EventBlog[]>(INITIAL_EVENTS);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [slides, setSlides] = useState<HeroSlide[]>(INITIAL_SLIDES);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [stories, setStories] = useState<Story[]>(INITIAL_STORIES);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [visitorForms, setVisitorForms] = useState<VisitorForm[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [pressUpdates, setPressUpdates] = useState<PressUpdate[]>(() => {
    try {
      const saved = localStorage.getItem('pinobite_press_updates');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<EventBlog | null>(null);
  const [selectedBlogPost, setSelectedBlogPost] = useState<BlogPost | null>(null);
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<View>(() => {
    return window.history.state?.view || 'home';
  });
  const [globalSearchQuery, setGlobalSearchQuery] = useState(() => {
    return window.history.state?.query || '';
  });
  const [shopCategory, setShopCategory] = useState(() => {
    return window.history.state?.category || 'All';
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNutritionOpen, setIsNutritionOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Handle URL routing for manual links
  useEffect(() => {
    const path = window.location.pathname;
    if (path.startsWith('/forms/')) {
      const formId = path.split('/forms/')[1];
      if (formId) {
        setSelectedFormId(formId);
        setCurrentView('visitor-form');
      }
    }
  }, []);

  // Handle browser back/forward buttons and initial state restoration
  useEffect(() => {
    const syncState = async (state: any) => {
      if (state && state.view) {
        // Only update view if it's different to prevent redundant re-renders on data refresh
        if (currentView !== state.view) {
          setCurrentView(state.view);
        }

        if (state.productId) {
          const p = products.find(prod => String(prod.id) === String(state.productId));
          if (p) {
            setSelectedProduct(p);
            // Fetch full details
            try {
              const res = await fetch(`${API_BASE_URL}/api/products/${p.id}/`);
              if (res.ok) {
                const fullP = await res.json();
                setSelectedProduct({
                  ...fullP,
                  id: String(fullP.id),
                  price: parseFloat(fullP.price),
                  originalPrice: fullP.original_price ? parseFloat(fullP.original_price) : undefined,
                  themeColor: fullP.theme_color,
                  model3d: fullP.model_3d,
                  orientation: fullP.orientation ? fullP.orientation.replace(/[Oo]/g, '0') : '0deg 0deg -15deg',
                  benefits: fullP.benefits || [],
                  nutrients: fullP.nutrients || [],
                  gallery: fullP.gallery || [],
                  mainIngredient: fullP.main_ingredient || (fullP.name.toLowerCase().includes('peanut') ? "100% Roasted Peanuts" : fullP.name.toLowerCase().includes('almond') ? "Premium Roasted Almonds" : fullP.name.toLowerCase().includes('chocolate') ? "Dark Belgian Chocolate" : fullP.name.toLowerCase().includes('strawberry') ? "Fresh Strawberries" : fullP.name.toLowerCase().includes('chia') ? "Organic Chia Seeds" : "Premium Ingredients"),
                  mainIngredientImage: fullP.main_ingredient_image || (fullP.name.toLowerCase().includes('peanut') ? "https://images.unsplash.com/photo-1590301157890-4810ed352733?q=80&w=800&auto=format&fit=crop" : fullP.name.toLowerCase().includes('almond') ? "https://images.unsplash.com/photo-1508029091899-59990abc4b8d?q=80&w=800&auto=format&fit=crop" : fullP.name.toLowerCase().includes('chocolate') ? "https://images.unsplash.com/photo-1511381939415-322199ae53d5?q=80&w=800&auto=format&fit=crop" : fullP.name.toLowerCase().includes('strawberry') ? "https://images.unsplash.com/photo-1518635017498-87afc0455a43?q=80&w=800&auto=format&fit=crop" : fullP.name.toLowerCase().includes('chia') ? "https://images.unsplash.com/photo-1588600030303-920aa942828b?q=80&w=800&auto=format&fit=crop" : undefined)
                });
              }
            } catch (e) { }
          }
        }
        if (state.eventId) {
          const e = events.find(ev => String(ev.id) === String(state.eventId));
          if (e) setSelectedEvent(e);
        }
        if (state.blogId) {
          const b = blogPosts.find(post => String(post.id) === String(state.blogId));
          if (b) setSelectedBlogPost(b);
        }
        if (state.view === 'visitor-form' && state.formId) {
          setSelectedFormId(state.formId);
        }
        if (state.view === 'shop') {
          setShopCategory(state.category || 'All');
          setGlobalSearchQuery(state.query || '');
        }

        // Clear selections if not in state
        if (!state.productId) setSelectedProduct(null);
        if (!state.eventId) setSelectedEvent(null);
        if (!state.blogId) setSelectedBlogPost(null);
      } else {
        // Fallback to home if no state
        setCurrentView('home');
        setSelectedProduct(null);
        setSelectedEvent(null);
        setSelectedBlogPost(null);
      }
    };

    const handlePopState = (event: PopStateEvent) => {
      syncState(event.state);
    };

    window.addEventListener('popstate', handlePopState);

    // Sync current state on mount or when data updates
    if (window.history.state) {
      syncState(window.history.state);
    } else {
      window.history.replaceState({ view: 'home' }, '');
    }

    return () => window.removeEventListener('popstate', handlePopState);
  }, [products, events, blogPosts]);

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
      window.history.pushState({ view: 'home' }, '');
    }
  }, [user, isLoading, currentView]);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const [eventsRes, blogsRes, storiesRes, productsRes, vFormsRes, categoriesRes, annRes, slidesRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/events/`),
          fetch(`${API_BASE_URL}/api/blog-posts/`),
          fetch(`${API_BASE_URL}/api/stories/`),
          fetch(`${API_BASE_URL}/api/products/`),
          fetch(`${API_BASE_URL}/api/visitor-forms/`),
          fetch(`${API_BASE_URL}/api/categories/`),
          fetch(`${API_BASE_URL}/api/announcements/`),
          fetch(`${API_BASE_URL}/api/hero-slides/`)
        ]);

        if (slidesRes && slidesRes.ok) {
          const slidesData = await slidesRes.json();
          const mappedSlides = slidesData.map((s: any) => ({
            id: String(s.id),
            category: s.category,
            headline: s.headline,
            description: s.description,
            image: s.image || '',
            backgroundImage: s.background_image || s.backgroundImage || '',
            cta: s.cta_button_text || s.cta,
            bgColor: s.bg_color || s.bgColor,
            accentColor: s.accent_color || s.accentColor,
            blobColor: s.blob_color || s.blobColor,
            isActive: s.is_active || s.isActive
          }));
          setSlides(mappedSlides);
        }

        if (annRes.ok) {
          const annData = await annRes.json();
          setAnnouncements(annData);
        }

        if (vFormsRes.ok) {
          const vFormsData = await vFormsRes.json();
          const mappedVForms = vFormsData.map((f: any) => ({
            id: String(f.id),
            title: f.title,
            eventName: f.event_name,
            status: f.status,
            createdAt: f.created_at,
            link: `${window.location.origin}/forms/${f.id}`,
            submissions: f.submissions ? f.submissions.map((s: any) => ({
              id: String(s.id),
              name: s.name,
              email: s.email,
              phone: s.phone,
              submittedAt: s.submitted_at
            })) : []
          }));
          if (mappedVForms.length > 0) setVisitorForms(mappedVForms);
        }

        if (productsRes.ok) {
          const productsData = await productsRes.json();
          const mappedProducts = productsData.map((p: any) => ({
            ...p,
            id: String(p.id),
            price: parseFloat(p.price),
            originalPrice: p.original_price ? parseFloat(p.original_price) : undefined,
            reviewCount: p.review_count || 0,
            isTopRated: p.is_top_rated,
            model3d: p.model_3d || null,
            themeColor: p.theme_color,
            orientation: p.orientation ? p.orientation.replace(/[Oo]/g, '0') : '0deg 0deg 0deg',
            gallery: p.gallery || [],
            benefits: p.benefits || [],
            nutrients: p.nutrients || [],
            mainIngredient: p.main_ingredient || (p.name.toLowerCase().includes('peanut') ? "100% Roasted Peanuts" : p.name.toLowerCase().includes('almond') ? "Premium Roasted Almonds" : p.name.toLowerCase().includes('chocolate') ? "Dark Belgian Chocolate" : p.name.toLowerCase().includes('strawberry') ? "Fresh Strawberries" : p.name.toLowerCase().includes('chia') ? "Organic Chia Seeds" : "Premium Ingredients"),
            mainIngredientImage: p.main_ingredient_image || (p.name.toLowerCase().includes('peanut') ? "https://images.unsplash.com/photo-1590301157890-4810ed352733?q=80&w=800&auto=format&fit=crop" : p.name.toLowerCase().includes('almond') ? "https://images.unsplash.com/photo-1508029091899-59990abc4b8d?q=80&w=800&auto=format&fit=crop" : p.name.toLowerCase().includes('chocolate') ? "https://images.unsplash.com/photo-1511381939415-322199ae53d5?q=80&w=800&auto=format&fit=crop" : p.name.toLowerCase().includes('strawberry') ? "https://images.unsplash.com/photo-1518635017498-87afc0455a43?q=80&w=800&auto=format&fit=crop" : p.name.toLowerCase().includes('chia') ? "https://images.unsplash.com/photo-1588600030303-920aa942828b?q=80&w=800&auto=format&fit=crop" : undefined)
          }));
          setProducts(mappedProducts);
        }

        if (eventsRes.ok) {
          const eventsData = await eventsRes.json();
          const mappedEvents = eventsData.map((e: any) => ({
            ...e,
            id: String(e.id),
            fullStory: e.full_story || [],
            featuredProducts: (e.featured_products || []).map(String),
            gallery: e.gallery || [],
          }));
          if (mappedEvents.length > 0) setEvents(mappedEvents);
        }

        if (blogsRes.ok) {
          const blogsData = await blogsRes.json();
          const mappedBlogs = blogsData.map((b: any) => ({
            ...b,
            id: String(b.id),
            type: b.post_type,
            readTime: b.read_time,
            content: Array.isArray(b.content) ? b.content.join('\n\n') : (b.content || ''),
            tags: b.tags || [],
          }));
          if (mappedBlogs.length > 0) setBlogPosts(mappedBlogs);
        }

        if (storiesRes.ok) {
          const storiesData = await storiesRes.json();
          const mappedStories = storiesData.map((s: any) => ({
            id: String(s.id),
            mediaUrl: s.media_url,
            originalDriveUrl: s.original_drive_url,
            mediaType: s.media_type,
            productId: String(s.product_id),
          }));
          setStories(mappedStories);
        }

        if (categoriesRes.ok) {
          const categoriesData = await categoriesRes.json();
          if (categoriesData.length > 0) setCategories(categoriesData);
        }
      } catch (error) {
        console.error('Failed to fetch CMS content:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, []);

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
            const data = await response.json();
            const mappedVForms = data.map((f: any) => ({
              id: String(f.id),
              title: f.title,
              eventName: f.event_name,
              status: f.status,
              createdAt: f.created_at,
              link: `${window.location.origin}/forms/${f.id}`,
              submissions: f.submissions ? f.submissions.map((s: any) => ({
                id: String(s.id),
                name: s.name,
                email: s.email,
                phone: s.phone,
                submittedAt: s.submitted_at,
                addressDetails: s.address_details,
                buyingSource: s.buying_source,
                brandAwareness: s.brand_awareness,
                currentUsage: s.current_usage,
                flavorPreferences: s.flavor_preferences,
                reviewedProduct: s.reviewed_product,
                reviewContent: s.review_content,
                marketingConsent: s.marketing_consent
              })) : []
            }));
            setVisitorForms(mappedVForms);
          }

          // Refresh Announcements
          const annRes = await fetch(`${API_BASE_URL}/api/announcements/`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (annRes.ok) {
            const annData = await annRes.json();
            setAnnouncements(annData);
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
          original_price: newProduct.originalPrice,
          rating: newProduct.rating,
          review_count: newProduct.reviewCount,
          image: newProduct.image,
          gallery: newProduct.gallery,
          description: newProduct.description,
          benefits: newProduct.benefits,
          nutrients: newProduct.nutrients,
          is_top_rated: newProduct.isTopRated,
          category: newProduct.category,
          stock: newProduct.stock,
          model_3d: newProduct.model3d,
          theme_color: newProduct.themeColor,
          orientation: newProduct.orientation
        })
      });
      if (response.status === 401) {
        handleAdminLogout();
        return;
      }
      if (response.ok) {
        const savedProduct = await response.json();
        const mappedProduct = {
          ...savedProduct,
          id: String(savedProduct.id),
          originalPrice: savedProduct.original_price,
          reviewCount: savedProduct.review_count,
          isTopRated: savedProduct.is_top_rated,
          model3d: savedProduct.model_3d,
          themeColor: savedProduct.theme_color,
          orientation: savedProduct.orientation,
          gallery: savedProduct.gallery || [],
          benefits: savedProduct.benefits || [],
          nutrients: savedProduct.nutrients || []
        };
        setProducts(prev => [mappedProduct, ...prev]);
      } else {
        const errData = await response.json();
        alert(`Failed to add product: ${errData.detail || 'Unknown error'}`);
      }
    } catch (err) {
      console.error("Failed to add product", err);
    }
  };

  const handleUpdateProduct = async (updatedProduct: Product) => {
    try {
      const token = localStorage.getItem('admin_access_token');
      const response = await fetch(`${API_BASE_URL}/api/products/${updatedProduct.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: updatedProduct.name,
          price: updatedProduct.price,
          original_price: updatedProduct.originalPrice,
          rating: updatedProduct.rating,
          review_count: updatedProduct.reviewCount,
          image: updatedProduct.image,
          gallery: updatedProduct.gallery,
          description: updatedProduct.description,
          benefits: updatedProduct.benefits,
          nutrients: updatedProduct.nutrients,
          is_top_rated: updatedProduct.isTopRated,
          category: updatedProduct.category,
          stock: updatedProduct.stock,
          model_3d: updatedProduct.model3d,
          theme_color: updatedProduct.themeColor,
          orientation: updatedProduct.orientation
        })
      });
      if (response.status === 401) {
        handleAdminLogout();
        return;
      }
      if (response.ok) {
        const savedProduct = await response.json();
        const mappedProduct = {
          ...savedProduct,
          id: String(savedProduct.id),
          originalPrice: savedProduct.original_price,
          reviewCount: savedProduct.review_count,
          isTopRated: savedProduct.is_top_rated,
          model3d: savedProduct.model_3d,
          themeColor: savedProduct.theme_color,
          orientation: savedProduct.orientation,
          gallery: savedProduct.gallery || [],
          benefits: savedProduct.benefits || [],
          nutrients: savedProduct.nutrients || []
        };
        setProducts(prev => prev.map(p => p.id === mappedProduct.id ? mappedProduct : p));
      } else {
        alert("Failed to update product");
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
        setProducts(prev => prev.filter(p => p.id !== id));
      } else {
        alert("Failed to delete product");
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
          event_name: newForm.eventName,
          status: newForm.status
        })
      });
      if (response.ok) {
        const savedForm = await response.json();
        const mappedForm = {
          id: String(savedForm.id),
          title: savedForm.title,
          eventName: savedForm.event_name,
          status: savedForm.status,
          createdAt: savedForm.created_at,
          link: `${window.location.origin}/forms/${savedForm.id}`,
          submissions: savedForm.submissions || []
        };
        setVisitorForms(prev => [mappedForm, ...prev]);
      }
    } catch (err) {
      console.error("Failed to add visitor form", err);
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
        setVisitorForms(prev => prev.filter(f => f.id !== id));
      } else {
        alert("Failed to delete form");
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
        alert("Session expired. Please log in again.");
        handleAdminLogout();
        return;
      }
      if (response.ok) {
        const savedCategory = await response.json();
        setCategories(prev => [...prev, savedCategory]);
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
        alert("Session expired. Please log in again.");
        handleAdminLogout();
        return;
      }
      if (!response.ok) throw new Error('Failed to delete category');
      setCategories(prev => prev.filter(c => c.id !== Number(id) && c.id !== String(id))); // Handle generic ID types
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
          date: newEvent.date
        })
      });
      if (response.ok) {
        const savedEvent = await response.json();
        const mappedEvent = {
          ...savedEvent,
          id: String(savedEvent.id),
          fullStory: savedEvent.full_story || [],
          featuredProducts: (savedEvent.featured_products || []).map(String),
          gallery: savedEvent.gallery || []
        };
        setEvents(prev => [mappedEvent, ...prev]);
      }
    } catch (err) {
      console.error("Failed to add event", err);
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
          date: updatedEvent.date
        })
      });
      if (response.ok) {
        const savedEvent = await response.json();
        const mappedEvent = {
          ...savedEvent,
          id: String(savedEvent.id),
          fullStory: savedEvent.full_story || [],
          featuredProducts: (savedEvent.featured_products || []).map(String),
          gallery: savedEvent.gallery || []
        };
        setEvents(prev => prev.map(e => e.id === mappedEvent.id ? mappedEvent : e));
      }
    } catch (err) {
      console.error("Failed to update event", err);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    try {
      const token = localStorage.getItem('admin_access_token');
      await fetch(`${API_BASE_URL}/api/events/${id}/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setEvents(prev => prev.filter(e => e.id !== id));
    } catch (err) {
      console.error("Failed to delete event", err);
    }
  };

  const handleUpdateSlides = (newSlides: HeroSlide[]) => {
    setSlides(newSlides);
  };

  const handleAddBlog = async (newBlog: BlogPost) => {
    try {
      const token = localStorage.getItem('admin_access_token');
      const response = await fetch(`${API_BASE_URL}/api/blog-posts/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          post_type: newBlog.type,
          title: newBlog.title,
          excerpt: newBlog.excerpt,
          image: newBlog.image,
          date: newBlog.date,
          read_time: newBlog.readTime,
          author: newBlog.author,
          content: newBlog.content,
          tags: newBlog.tags
        })
      });
      if (response.ok) {
        const savedBlog = await response.json();
        const mappedBlog = {
          ...savedBlog,
          id: String(savedBlog.id),
          type: savedBlog.post_type,
          readTime: savedBlog.read_time,
          content: savedBlog.content || [],
          tags: savedBlog.tags || []
        };
        setBlogPosts(prev => [mappedBlog, ...prev]);
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
        const saved = await response.json();
        setAnnouncements(prev => [saved, ...prev]);
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
        const saved = await response.json();
        setAnnouncements(prev => prev.map(a => a.id === saved.id ? saved : a));
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
        setAnnouncements(prev => prev.filter(a => String(a.id) !== String(id)));
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
      const response = await fetch(`${API_BASE_URL}/api/blog-posts/${updatedBlog.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          post_type: updatedBlog.type,
          title: updatedBlog.title,
          excerpt: updatedBlog.excerpt,
          image: updatedBlog.image,
          date: updatedBlog.date,
          read_time: updatedBlog.readTime,
          author: updatedBlog.author,
          content: updatedBlog.content,
          tags: updatedBlog.tags
        })
      });
      if (response.ok) {
        const savedBlog = await response.json();
        const mappedBlog = {
          ...savedBlog,
          id: String(savedBlog.id),
          type: savedBlog.post_type,
          readTime: savedBlog.read_time,
          content: savedBlog.content || [],
          tags: savedBlog.tags || []
        };
        setBlogPosts(prev => prev.map(b => b.id === mappedBlog.id ? mappedBlog : b));
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
        alert("Session expired. Please log in again.");
        handleAdminLogout();
        return;
      }
      if (response.ok) {
        setBlogPosts(prev => prev.filter(b => b.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete blog", err);
    }
  };

  const handleAddReview = (review: Review) => {
    setReviews(prev => [review, ...prev]);
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
          media_type: newStory.mediaType,
          original_drive_url: newStory.originalDriveUrl,
          product_id: newStory.productId
        })
      });
      if (response.ok) {
        const savedStory = await response.json();
        const mappedStory = {
          id: String(savedStory.id),
          mediaUrl: savedStory.media_url,
          originalDriveUrl: savedStory.original_drive_url,
          mediaType: savedStory.media_type,
          productId: String(savedStory.product_id)
        };
        setStories(prev => [...prev, mappedStory]);
        alert("Story added successfully!");
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(`Failed to add story: ${errorData.detail || errorData.error || response.statusText}`);
      }
    } catch (err) {
      console.error("Failed to add story", err);
      alert("Error adding story. The image might be too large or the server is busy.");
    }
  };

  const handleDeleteStory = async (id: string) => {
    try {
      const token = localStorage.getItem('admin_access_token');
      await fetch(`${API_BASE_URL}/api/stories/${id}/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setStories(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      console.error("Failed to delete story", err);
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
    window.history.pushState({ view: 'product', productId: product.id }, '');
    window.scrollTo(0, 0);

    // Fetch full details since list view is now minimal
    try {
      const response = await fetch(`${API_BASE_URL}/api/products/${product.id}/`);
      if (response.ok) {
        const fullProduct = await response.json();
        const mappedProduct = {
          ...fullProduct,
          id: String(fullProduct.id),
          price: parseFloat(fullProduct.price),
          originalPrice: fullProduct.original_price ? parseFloat(fullProduct.original_price) : undefined,
          themeColor: fullProduct.theme_color,
          model3d: fullProduct.model_3d,
          orientation: fullProduct.orientation ? fullProduct.orientation.replace(/[Oo]/g, '0') : '0deg 0deg -15deg',
          benefits: fullProduct.benefits || [],
          nutrients: fullProduct.nutrients || [],
          gallery: fullProduct.gallery || [],
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
    window.history.pushState({ view: 'shop', category: 'All', query: '' }, '');
  }, []);

  const navigateToShopCategory = React.useCallback((category: string) => {
    setShopCategory(category);
    setCurrentView('shop');
    setGlobalSearchQuery('');
    setSelectedProduct(null);
    window.history.pushState({ view: 'shop', category, query: '' }, '');
  }, []);

  const handleGlobalSearch = React.useCallback((query: string) => {
    setGlobalSearchQuery(query);
    setShopCategory('All');
    setCurrentView('shop');
    setSelectedProduct(null);
    window.history.pushState({ view: 'shop', category: 'All', query }, '');
  }, []);

  const navigateToCheckout = React.useCallback(() => {
    setCurrentView('checkout');
    setIsCartOpen(false);
    setSelectedProduct(null);
    window.history.pushState({ view: 'checkout' }, '');
  }, []);

  const navigateToDashboard = React.useCallback(() => {
    setCurrentView('dashboard');
    setSelectedProduct(null);
    window.history.pushState({ view: 'dashboard' }, '');
  }, []);

  const navigateToFAQ = React.useCallback(() => {
    setCurrentView('faq');
    setSelectedProduct(null);
    window.history.pushState({ view: 'faq' }, '');
  }, []);

  const navigateToDistributor = React.useCallback(() => {
    setCurrentView('distributor');
    setSelectedProduct(null);
    window.history.pushState({ view: 'distributor' }, '');
  }, []);

  const navigateToBlogs = React.useCallback(() => {
    setCurrentView('blogs');
    setSelectedProduct(null);
    window.history.pushState({ view: 'blogs' }, '');
  }, []);

  const navigateToBlogDetail = React.useCallback((post: BlogPost) => {
    setSelectedBlogPost(post);
    setCurrentView('blog-detail');
    window.history.pushState({ view: 'blog-detail', blogId: post.id }, '');
  }, []);

  const navigateToEventBlogs = React.useCallback(() => {
    setCurrentView('event-blogs');
    setSelectedProduct(null);
    setSelectedEvent(null);
    window.history.pushState({ view: 'event-blogs' }, '');
  }, []);

  const navigateToEventDetail = React.useCallback((event: EventBlog) => {
    setSelectedEvent(event);
    setCurrentView('event-detail');
    window.history.pushState({ view: 'event-detail', eventId: event.id }, '');
  }, []);

  const navigateToAdmin = React.useCallback(() => {
    if (isAdminLoggedIn) {
      setCurrentView('admin-dashboard');
      window.history.pushState({ view: 'admin-dashboard' }, '');
    } else {
      setCurrentView('admin-login');
      window.history.pushState({ view: 'admin-login' }, '');
    }
  }, [isAdminLoggedIn]);

  const navigateToJourney = React.useCallback(() => {
    setCurrentView('journey');
    setSelectedProduct(null);
    setSelectedEvent(null);
    window.history.pushState({ view: 'journey' }, '');
  }, []);

  const navigateToPrivacy = React.useCallback(() => {
    setCurrentView('privacy-policy');
    setSelectedProduct(null);
    window.history.pushState({ view: 'privacy-policy' }, '');
  }, []);

  const navigateToTerms = React.useCallback(() => {
    setCurrentView('terms-and-conditions');
    setSelectedProduct(null);
    window.history.pushState({ view: 'terms-and-conditions' }, '');
  }, []);

  const navigateToRefund = React.useCallback(() => {
    setCurrentView('refund-policy');
    setSelectedProduct(null);
    window.history.pushState({ view: 'refund-policy' }, '');
  }, []);

  const navigateToShipping = React.useCallback(() => {
    setCurrentView('shipping-policy');
    setSelectedProduct(null);
    window.history.pushState({ view: 'shipping-policy' }, '');
  }, []);

  const goHome = React.useCallback(() => {
    setCurrentView('home');
    setSelectedProduct(null);
    setSelectedEvent(null);
    setSelectedBlogPost(null);
    setGlobalSearchQuery('');
    setIsCartOpen(false);
    setIsAuthOpen(false);
    window.history.pushState({ view: 'home' }, '');
  }, []);

  const handleLogin = () => {
    // setIsLoggedIn is handled by useEffect
    setIsAuthOpen(false);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    logout();
    setCurrentView('home');
  };

  const handleAdminLogin = () => {
    setIsAdminLoggedIn(true);
    setCurrentView('admin-dashboard');
    window.history.pushState({ view: 'admin-dashboard' }, '');
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem('admin_access_token');
    localStorage.removeItem('admin_refresh_token');
    setCurrentView('home');
    window.history.pushState({ view: 'home' }, '');
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
        onDeleteEvent={handleDeleteEvent}
        slides={slides}
        onUpdateSlides={handleUpdateSlides}
        blogPosts={blogPosts}
        onAddBlog={handleAddBlog}
        onUpdateBlog={handleUpdateBlog}
        onDeleteBlog={handleDeleteBlog}
        stories={stories}
        onAddStory={handleAddStory}
        onDeleteStory={handleDeleteStory}
        visitorForms={visitorForms}
        onAddVisitorForm={handleAddVisitorForm}
        onDeleteVisitorForm={handleDeleteVisitorForm}
        announcements={announcements}
        onAddAnnouncement={handleAddAnnouncement}
        onUpdateAnnouncement={handleUpdateAnnouncement}
        onDeleteAnnouncement={handleDeleteAnnouncement}
        pressUpdates={pressUpdates}
        onAddPressUpdate={handleAddPressUpdate}
        onDeletePressUpdate={handleDeletePressUpdate}
      />
    );
  }

  return (
    <div className="min-h-screen selection:bg-primary/20 bg-background-light">
      {currentView !== 'checkout' && currentView !== 'visitor-form' && (
        <Navbar
          cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
          isLoggedIn={isLoggedIn}
          onCartClick={() => setIsCartOpen(true)}
          onAccountClick={() => isLoggedIn ? navigateToDashboard() : setIsAuthOpen(true)}
          onLogoClick={goHome}
          onProductsClick={() => navigateToShop()}
          onCategoryClick={navigateToShopCategory}
          onDashboardClick={() => navigateToDashboard()}
          onStoriesClick={() => setCurrentView('blogs')}
          onJourneyClick={() => setCurrentView('journey')}
          onSearch={handleGlobalSearch}
          products={products}
          blogPosts={blogPosts}
          events={events}
          onProductClick={navigateToProduct}
          onBlogClick={navigateToBlogDetail}
          onEventClick={navigateToEventDetail}
          categories={categories}
          onMenuStateChange={setIsMenuOpen}
          announcements={announcements
            .filter(a => {
              if (!a.is_active) return false;
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
      )}

      <main className="animate-in fade-in duration-500">
        {currentView === 'home' && (
          <>
            <Hero onShopClick={navigateToShop} products={products} onProductClick={navigateToProduct} slides={slides} />
            <CategoryList onCategoryClick={navigateToShopCategory} products={products} />
            <StoryCarousel stories={[...stories].reverse().slice(0, 5)} products={products} onProductClick={navigateToProduct} onAddToCart={addToCart} />
            <div className="snaxxo-wrapper relative w-full overflow-hidden bg-[#fcf6e5]">
              <SnaxxoProductWheel
                products={products}
                onAddToCart={addToCart}
                onProductClick={navigateToProduct}
                isLoading={isLoading}
                onShopClick={navigateToShop}
              />
            </div>
            <LatestProductShowcase />

            <ComparisonTable />

            <Testimonials reviews={reviews} />
            <BlogSection
              posts={blogPosts}
              onPostClick={navigateToBlogDetail}
              onViewAllClick={navigateToBlogs}
            />
            <EventsSection
              events={events}
              onParticipateClick={() => setIsEventModalOpen(true)}
              onViewRecapsClick={navigateToEventBlogs}
            />
            <PressUpdates pressUpdates={pressUpdates} />
            <Newsletter />
            <SnaxxoLanding
              products={products.slice(-5).reverse()}
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
          </>
        )}

        {currentView === 'distributor' && (
          <DistributorPage onHomeClick={goHome} />
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
            onBack={() => setCurrentView('shop')}
            onOrderSuccess={() => {
              setCart([]);
              setCurrentView('home');
            }}
            onLoginRequired={() => setIsAuthOpen(true)}
            checkAuth={checkAuth}
          />
        )}

        {currentView === 'dashboard' && (
          <Dashboard onLogout={handleLogout} onHomeClick={goHome} />
        )}

        {currentView === 'faq' && (
          <FAQPage onHomeClick={goHome} />
        )}

        {currentView === 'blogs' && (
          <BlogsPage
            posts={blogPosts}
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
            events={events}
            onEventClick={navigateToEventDetail}
            onHomeClick={goHome}
          />
        )}

        {currentView === 'event-detail' && selectedEvent && (
          <EventDetailsPage
            event={selectedEvent}
            onBack={navigateToEventBlogs}
            onHomeClick={goHome}
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
      </main>

      {currentView !== 'checkout' && currentView !== 'visitor-form' && (
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
      )}



      <RewardNotification />
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onRemove={removeFromCart}
        onUpdateQty={updateQuantity}
        onCheckout={navigateToCheckout}
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

      {currentView !== 'admin-dashboard' && currentView !== 'admin-login' && currentView !== 'checkout' && currentView !== 'visitor-form' && (
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
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
