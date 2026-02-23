
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
import DistributorPage from './components/DistributorPage';
import BlogsPage from './components/BlogsPage';
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
import { Product, CartItem, EventBlog, HeroSlide, Review, BlogPost, Story, VisitorForm, Category } from './types';
import SnaxxoLanding from './components/snaxxo/SnaxxoLanding';
import SnaxxoProductWheel from './components/snaxxo/SnaxxoProductWheel';

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

type View = 'home' | 'product' | 'shop' | 'checkout' | 'dashboard' | 'faq' | 'distributor' | 'blogs' | 'blog-detail' | 'event-blogs' | 'event-detail' | 'admin-login' | 'admin-dashboard' | 'journey' | 'privacy-policy' | 'terms-and-conditions' | 'refund-policy' | 'shipping-policy' | 'visitor-form';

import { AuthProvider, useAuth } from './hooks/useAuth';
import { API_BASE_URL } from './config';

const AppContent: React.FC = () => {
  const { user, logout } = useAuth();
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [events, setEvents] = useState<EventBlog[]>(INITIAL_EVENTS);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [slides, setSlides] = useState<HeroSlide[]>(INITIAL_SLIDES);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [stories, setStories] = useState<Story[]>(INITIAL_STORIES);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [visitorForms, setVisitorForms] = useState<VisitorForm[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<EventBlog | null>(null);
  const [selectedBlogPost, setSelectedBlogPost] = useState<BlogPost | null>(null);
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<View>('home');
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [shopCategory, setShopCategory] = useState('All');
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

  useEffect(() => {
    setIsLoggedIn(!!user);
  }, [user]);

  useEffect(() => {
    const adminToken = localStorage.getItem('admin_access_token');
    if (adminToken) {
      setIsAdminLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const [eventsRes, blogsRes, storiesRes, productsRes, vFormsRes, categoriesRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/events/`),
          fetch(`${API_BASE_URL}/api/blog-posts/`),
          fetch(`${API_BASE_URL}/api/stories/`),
          fetch(`${API_BASE_URL}/api/products/`),
          fetch(`${API_BASE_URL}/api/visitor-forms/`),
          fetch(`${API_BASE_URL}/api/categories/`)
        ]);

        if (vFormsRes.ok) {
          const vFormsData = await vFormsRes.json();
          const mappedVForms = vFormsData.map((f: any) => ({
            id: String(f.id),
            title: f.title,
            eventName: f.event_name,
            status: f.status,
            createdAt: f.created_at,
            link: `${window.location.origin}/forms/${f.id}`, // or handle link generation
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
            reviewCount: p.review_count,
            isTopRated: p.is_top_rated,
            gallery: p.gallery || [],
            benefits: p.benefits || [],
            nutrients: p.nutrients || []
          }));
          if (mappedProducts.length > 0) setProducts(mappedProducts);
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
            content: b.content || [],
            tags: b.tags || [],
          }));
          if (mappedBlogs.length > 0) setBlogPosts(mappedBlogs);
        }

        if (storiesRes.ok) {
          const storiesData = await storiesRes.json();
          const mappedStories = storiesData.map((s: any) => ({
            id: String(s.id),
            mediaUrl: s.media_url,
            mediaType: s.media_type,
            productId: String(s.product_id),
          }));
          if (mappedStories.length > 0) setStories(mappedStories);
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
      const refreshVisitorForms = async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/api/visitor-forms/`);
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
        } catch (error) {
          console.error("Failed to refresh visitor forms:", error);
        }
      };
      refreshVisitorForms();
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
          stock: newProduct.stock
        })
      });
      if (response.ok) {
        const savedProduct = await response.json();
        const mappedProduct = {
          ...savedProduct,
          id: String(savedProduct.id),
          originalPrice: savedProduct.original_price,
          reviewCount: savedProduct.review_count,
          isTopRated: savedProduct.is_top_rated,
          gallery: savedProduct.gallery || [],
          benefits: savedProduct.benefits || [],
          nutrients: savedProduct.nutrients || []
        };
        setProducts(prev => [mappedProduct, ...prev]);
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
          stock: updatedProduct.stock
        })
      });
      if (response.ok) {
        const savedProduct = await response.json();
        const mappedProduct = {
          ...savedProduct,
          id: String(savedProduct.id),
          originalPrice: savedProduct.original_price,
          reviewCount: savedProduct.review_count,
          isTopRated: savedProduct.is_top_rated,
          gallery: savedProduct.gallery || [],
          benefits: savedProduct.benefits || [],
          nutrients: savedProduct.nutrients || []
        };
        setProducts(prev => prev.map(p => p.id === mappedProduct.id ? mappedProduct : p));
      }
    } catch (err) {
      console.error("Failed to update product", err);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      const token = localStorage.getItem('admin_access_token');
      await fetch(`${API_BASE_URL}/api/products/${id}/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setProducts(prev => prev.filter(p => p.id !== id));
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
      await fetch(`${API_BASE_URL}/api/visitor-forms/${id}/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setVisitorForms(prev => prev.filter(f => f.id !== id));
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
          product_id: newStory.productId
        })
      });
      if (response.ok) {
        const savedStory = await response.json();
        const mappedStory = {
          id: String(savedStory.id),
          mediaUrl: savedStory.media_url,
          mediaType: savedStory.media_type,
          productId: String(savedStory.product_id)
        };
        setStories(prev => [...prev, mappedStory]);
      }
    } catch (err) {
      console.error("Failed to add story", err);
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

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const navigateToProduct = (product: Product) => {
    setSelectedProduct(product);
    setCurrentView('product');
  };

  const navigateToShop = () => {
    setShopCategory('All');
    setCurrentView('shop');
    setSelectedProduct(null);
    setGlobalSearchQuery('');
  };

  const navigateToShopCategory = (category: string) => {
    setShopCategory(category);
    setCurrentView('shop');
    setGlobalSearchQuery('');
    setSelectedProduct(null);
  };

  const handleGlobalSearch = (query: string) => {
    setGlobalSearchQuery(query);
    setShopCategory('All');
    setCurrentView('shop');
    setSelectedProduct(null);
  };

  const navigateToCheckout = () => {
    setCurrentView('checkout');
    setIsCartOpen(false);
    setSelectedProduct(null);
  };

  const navigateToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedProduct(null);
  };

  const navigateToFAQ = () => {
    setCurrentView('faq');
    setSelectedProduct(null);
  };

  const navigateToDistributor = () => {
    setCurrentView('distributor');
    setSelectedProduct(null);
  };

  const navigateToBlogs = () => {
    setCurrentView('blogs');
    setSelectedProduct(null);
  };

  const navigateToBlogDetail = (post: BlogPost) => {
    setSelectedBlogPost(post);
    setCurrentView('blog-detail');
  };

  const navigateToEventBlogs = () => {
    setCurrentView('event-blogs');
    setSelectedProduct(null);
    setSelectedEvent(null);
  };

  const navigateToEventDetail = (event: EventBlog) => {
    setSelectedEvent(event);
    setCurrentView('event-detail');
  };

  const navigateToAdmin = () => {
    if (isAdminLoggedIn) {
      setCurrentView('admin-dashboard');
    } else {
      setCurrentView('admin-login');
    }
  };

  const navigateToJourney = () => {
    setCurrentView('journey');
    setSelectedProduct(null);
    setSelectedEvent(null);
  }

  const navigateToPrivacy = () => {
    setCurrentView('privacy-policy');
    setSelectedProduct(null);
  }

  const navigateToTerms = () => {
    setCurrentView('terms-and-conditions');
    setSelectedProduct(null);
  }

  const navigateToRefund = () => {
    setCurrentView('refund-policy');
    setSelectedProduct(null);
  }

  const navigateToShipping = () => {
    setCurrentView('shipping-policy');
    setSelectedProduct(null);
  }

  const goHome = () => {
    setCurrentView('home');
    setSelectedProduct(null);
    setSelectedEvent(null);
    setSelectedBlogPost(null);
    setGlobalSearchQuery('');
  };

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
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem('admin_access_token');
    localStorage.removeItem('admin_refresh_token');
    setCurrentView('home');
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
          onAccountClick={isLoggedIn ? navigateToDashboard : () => setIsAuthOpen(true)}
          onLogoClick={goHome}
          onProductsClick={navigateToShop}
          onDashboardClick={navigateToDashboard}
          onStoriesClick={navigateToEventBlogs}
          onJourneyClick={navigateToJourney}
          onSearch={handleGlobalSearch}
        />
      )}

      <main className="animate-in fade-in duration-500">
        {currentView === 'home' && (
          <>
            <Hero onShopClick={navigateToShop} slides={slides} />
            <CategoryList onCategoryClick={navigateToShopCategory} />
            <div className="snaxxo-wrapper relative w-full overflow-hidden bg-[#FAF9F5]">
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
            <Newsletter />
            <SnaxxoLanding
              products={products.slice(-5).reverse()}
              onAddToCart={addToCart}
              onProductClick={navigateToProduct}
              isLoading={isLoading}
              onShopClick={navigateToShop}
              onHomeClick={goHome}
              onFAQClick={navigateToFAQ}
              onDistributorClick={navigateToDistributor}
              onBlogsClick={navigateToBlogs}
              onEventBlogsClick={navigateToEventBlogs}
              onAdminClick={navigateToAdmin}
              onJourneyClick={navigateToJourney}
              onPrivacyClick={navigateToPrivacy}
              onTermsClick={navigateToTerms}
              onRefundClick={navigateToRefund}
              onShippingClick={navigateToShipping}
            />
          </>
        )}

        {currentView === 'shop' && (
          <ShopPage
            onProductClick={navigateToProduct}
            onAddToCart={addToCart}
            searchQuery={globalSearchQuery}
            selectedCategory={shopCategory}
          />
        )}

        {currentView === 'product' && selectedProduct && (
          <ProductPage
            product={selectedProduct}
            products={products}
            onProductClick={navigateToProduct}
            onShopClick={navigateToShop}
            onAddToCart={addToCart}
            onBack={navigateToShop}
            reviews={reviews}
            onAddReview={handleAddReview}
            isLoggedIn={isLoggedIn}
            currentUser={isLoggedIn ? CURRENT_USER : undefined}
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
          />
        )}

        {currentView === 'dashboard' && (
          <Dashboard onLogout={handleLogout} onHomeClick={goHome} />
        )}

        {currentView === 'faq' && (
          <FAQPage onHomeClick={goHome} />
        )}

        {currentView === 'distributor' && (
          <DistributorPage onHomeClick={goHome} />
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
          onShopClick={navigateToShop}
          onHomeClick={goHome}
          onFAQClick={navigateToFAQ}
          onDistributorClick={navigateToDistributor}
          onBlogsClick={navigateToBlogs}
          onEventBlogsClick={navigateToEventBlogs}
          onAdminClick={navigateToAdmin}
          onJourneyClick={navigateToJourney}
          onPrivacyClick={navigateToPrivacy}
          onTermsClick={navigateToTerms}
          onRefundClick={navigateToRefund}
          onShippingClick={navigateToShipping}
        />
      )}



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
