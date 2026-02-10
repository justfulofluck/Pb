
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CategoryList from './components/CategoryList';
import ProductGrid from './components/ProductGrid';
import ComparisonTable from './components/ComparisonTable';
import Testimonials from './components/Testimonials';
import Newsletter from './components/Newsletter';
import Footer from './components/Footer';
import GeminiChat from './components/GeminiChat';
import CartDrawer from './components/CartDrawer';
import ProductModal from './components/ProductModal';
import AuthModal from './components/AuthModal';
import ProductPage from './components/ProductPage';
import ShopPage from './components/ShopPage';
import CheckoutPage from './components/CheckoutPage';
import Dashboard from './components/Dashboard';
import ContactPage from './components/ContactPage';
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
import JourneyPage from './components/JourneyPage';
import { Product, CartItem, EventBlog, HeroSlide, Review, BlogPost, BLOG_DATA } from './types';

// Initial Data
const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: "SUPER MUESLI NUT & SEEDS",
    price: 510,
    originalPrice: 550,
    rating: 4.9,
    reviewCount: 247,
    isTopRated: true,
    category: 'Muesli',
    stock: 120,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDlO7xgHzKyGEDOxeOScyOxN5vN6FXzx20a7SvpB5ecScwr4qW694FWHi28IthZVEaSbiDhq9U0eZ9ceBRcSATV1Ki-QuUg0XRUsfYd8o5L6LHcWQXasygvM_759LZu5o47H_FdjhQUqOtdsJr_Mdie3B1H-9h5Xm9kVjvlPMNRwwZkGgnF95HxRp2B-e3wC4qGMh-c_DtEjWEZdvmjtkysZyG-fw96D-tczHQAuR8nFehAenohxeOj74GHSHzTgUA6Ht8G4JYY93l_",
    description: "Our signature blend of premium nuts and heart-healthy seeds, slow-roasted to perfection. Zero refined sugar, 100% natural goodness.",
    benefits: ["High Fiber", "Zero White Sugar", "Omega-3 Rich", "Vegan Friendly"],
    nutrients: [{label: "Protein", value: "18g"}, {label: "Carbs", value: "42g"}, {label: "Healthy Fats", value: "22g"}, {label: "Energy", value: "480kcal"}]
  },
  {
    id: '2',
    name: "SUPER PEANUT BUTTER CHUNKY",
    price: 680,
    rating: 4.8,
    reviewCount: 119,
    category: 'Nut Butters',
    stock: 85,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCP7V5MszmhehKHONysdx4EeXIINOTiNn8Vz0A5WtMtC5U15SIefWSxwqAbYTWPoft9SYq26_rh38aCtNrrmu40qNkrU6zsV5jcvcFteB5STzIIF3UGVwStHYCi0mRIqS4r4x9IHb1IJcTkZhjHhcL4XGczrd8k4eGW0u9rFGJzNFdSQZvufHuSFWCWtMiBxADQJs1dS8lMy-KwjajLg2jPe0YVJjDDmFi6sIVZlq5UWSMwylmPhJ32RySGU3TDs6QWd41oY6qPtng8",
    description: "Hand-picked roasted peanuts blended with a touch of dark chocolate. No palm oil, no preservatives. Just the crunch you love.",
    benefits: ["No Palm Oil", "Whey Protein Added", "Gluten Free", "Dark Chocolate"],
    nutrients: [{label: "Protein", value: "32g"}, {label: "Carbs", value: "12g"}, {label: "Healthy Fats", value: "48g"}, {label: "Sugar", value: "4g"}]
  },
  {
    id: '3',
    name: "HIGH PROTEIN ROLLED OATS",
    price: 449,
    originalPrice: 520,
    rating: 5,
    reviewCount: 489,
    category: 'Oats',
    stock: 200,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCNiD74c8_tEGvm33_Hj4lsDcPCTXKYrcvnmhVcJmDwASTO4WH7pyx_vWDolXKZRH1aacdTaCpmgdOItJGddIS5gZF6a_XVXlebwu-ohwefHDF6uX4Mjp2x1PpiFaev9waP_XSKc1UyZyqw0pRsTAQHX0bxfVYMRGpJd6A7Htf5mLGyQ2QkiA-ZCFWPOSdK8oGoGmVzjfvK9RXS5ANbLPi4N89hC-P7FQrqUrvmxuiyKxt9l8V2asTwQgQ1l29FihpAOP94VSP19PCW",
    description: "100% Whole Grain Rolled Oats boosted with plant-based protein. The perfect base for your morning fuel bowl.",
    benefits: ["Complex Carbs", "Slow Digestion", "Non-GMO", "No Additives"],
    nutrients: [{label: "Protein", value: "14g"}, {label: "Carbs", value: "66g"}, {label: "Healthy Fats", value: "7g"}, {label: "Fiber", value: "11g"}]
  },
  {
    id: '4',
    name: "CREAMY ALMOND BUTTER",
    price: 899,
    rating: 4.7,
    reviewCount: 56,
    category: 'Nut Butters',
    stock: 5,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC36Ps7aMot5-GXznDvelGditD07FcxqmsLUDCww78ftzXv6wSqu2tdIjbahIB3N5iK37NtvJQXdCOnLTNZ7hPT-YBK4JEMa53fvnzytOZqq28jFCTDOhR37W3FMPmOt7xLn4hpt1AUcBNxzkW7oPmx9ZNsB5mf_uR6_Kj1624i-WvnHZ_HQ22K2tds_wmKQECT4e8d7rzOkqE00zOTTJkipKovCEuql_GY2ctR9FpnxXxIiaali-2EAF6m3ELAHfYIZPOzZMOeud0q",
    description: "Pure Californian almonds stone-ground into a silky smooth butter. Rich in Vitamin E and antioxidants.",
    benefits: ["Heart Healthy", "Keto Friendly", "Vitamin E Rich", "Antioxidant Pack"],
    nutrients: [{label: "Protein", value: "21g"}, {label: "Carbs", value: "10g"}, {label: "Healthy Fats", value: "54g"}, {label: "Iron", value: "4mg"}]
  },
  {
    id: '5',
    name: "DARK CHOCOLATE ALMOND BUTTER",
    price: 749,
    originalPrice: 849,
    rating: 4.9,
    reviewCount: 312,
    category: 'Nut Butters',
    stock: 45,
    image: "https://images.unsplash.com/photo-1614691467766-c56dfd8d6447?q=80&w=800&auto=format&fit=crop", 
    description: "Rich roasted almonds blended with premium dark cocoa. A guilt-free dessert on a spoon.",
    benefits: ["Rich in Protein", "Healthy Fats", "Low Sugar", "Vegan"],
    nutrients: [{label: "Protein", value: "20g"}, {label: "Carbs", value: "15g"}, {label: "Healthy Fats", value: "48g"}, {label: "Iron", value: "3mg"}]
  },
  {
    id: '6',
    name: "BERRY BLAST SUPER MUESLI",
    price: 540,
    rating: 4.7,
    reviewCount: 156,
    category: 'Muesli',
    stock: 60,
    image: "https://images.unsplash.com/photo-1590779033100-9f60a05a013d?q=80&w=800&auto=format&fit=crop",
    description: "Loaded with cranberries, blueberries, and strawberries for an antioxidant punch.",
    benefits: ["Antioxidants", "High Fiber", "Vitamin C", "No Added Sugar"],
    nutrients: [{label: "Protein", value: "14g"}, {label: "Fiber", value: "8g"}, {label: "Carbs", value: "50g"}, {label: "Vit C", value: "15mg"}]
  }
];

const INITIAL_REVIEWS: Review[] = [
  {
    id: 'r1',
    productId: '2',
    userName: "Karan Patel",
    userRole: "Fitness Enthusiast",
    rating: 5,
    comment: "It's basically the best peanut butter I've had! The blend of smooth peanut butter with crunchy bits and rich chocolate is just perfect.",
    date: "Oct 12, 2023",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200"
  },
  {
    id: 'r2',
    productId: 'general',
    userName: "Jyoti Rikhari",
    userRole: "Yoga Trainer",
    rating: 5,
    comment: "The texture is perfect for spreading on toast, adding to smoothies. My kids love it and I'm happy because it's clean nutrition.",
    date: "Sep 28, 2023",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&h=200"
  },
  {
    id: 'r3',
    productId: '3',
    userName: "Preksha",
    userRole: "Digital Creator",
    rating: 4,
    comment: "These oats are absolutely delicious. They keep me full for hours, and I love that there's no refined sugar. Perfect for my breakfast!",
    date: "Aug 15, 2023",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200&h=200"
  }
];

const INITIAL_EVENTS: EventBlog[] = [
  {
    id: '1',
    title: 'MARATHON FUEL-UP STATION',
    date: 'DEC 05, 2023',
    location: 'Marine Drive, Mumbai',
    image: 'https://images.unsplash.com/photo-1552674605-46d53961f630?q=80&w=800&auto=format&fit=crop',
    summary: 'We fueled over 500 runners with our high-protein coffee muesli bars at the Mumbai Midnight Marathon.',
    fullStory: [
      {
        heading: "The Pre-Dawn Buzz",
        content: "Starting at 3 AM, we set up our high-energy station at Marine Drive. Runners from across the city gathered, fueled by adrenaline and our signature coffee-infused muesli bars. The atmosphere was electric, with hundreds of athletes stopping by to grab their pre-race nutrition."
      },
      {
        heading: "A Community of Strides",
        content: "It wasn't just about the food; it was about the shared journey. We saw seasoned marathoners and first-timers alike exchanging tips and high-fives. Our team provided hydration and quick-digest energy options to ensure everyone hit their personal best."
      }
    ],
    gallery: [
      'https://images.unsplash.com/photo-1552674605-46d53961f630?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1544367563-12123d8965cd?q=80&w=800&auto=format&fit=crop'
    ],
    featuredProducts: ['1', '3']
  },
  {
    id: '2',
    title: 'MORNING YOGA & MUESLI',
    date: 'NOV 12, 2023',
    location: 'Lodhi Garden, Delhi',
    image: 'https://images.unsplash.com/photo-1544367563-12123d8965cd?q=80&w=800&auto=format&fit=crop',
    summary: 'A sunrise session of Sun Salutations followed by a community breakfast featuring our new almond butter.',
    fullStory: [
      {
        heading: "Morning Serenity",
        content: "Under the shade of ancient banyan trees, we gathered for a rejuvenating yoga session. The goal was simple: connect with oneself before connecting with the day. Led by expert trainers, the session focused on mindfulness and balance."
      },
      {
        heading: "The After-Flow Feast",
        content: "Post-yoga, the community shared a long-table breakfast. We served yogurt bowls topped with fresh fruit and our Nut & Seed Super Muesli. It was the perfect way to replenish and start the Sunday with good company."
      }
    ],
    gallery: [
      'https://images.unsplash.com/photo-1544367563-12123d8965cd?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1556910103-1c02745a30bf?q=80&w=800&auto=format&fit=crop'
    ],
    featuredProducts: ['1', '4']
  },
];

const INITIAL_SLIDES: HeroSlide[] = [
  {
    id: '1',
    category: "SUPER MUESLI",
    headline: "Crunchy Coffee Madness",
    description: "Zero refined sugar. Loaded with real coffee and high protein. The ultimate fuel for your busy mornings.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDlO7xgHzKyGEDOxeOScyOxN5vN6FXzx20a7SvpB5ecScwr4qW694FWHi28IthZVEaSbiDhq9U0eZ9ceBRcSATV1Ki-QuUg0XRUsfYd8o5L6LHcWQXasygvM_759LZu5o47H_FdjhQUqOtdsJr_Mdie3B1H-9h5Xm9kVjvlPMNRwwZkGgnF95HxRp2B-e3wC4qGMh-c_DtEjWEZdvmjtkysZyG-fw96D-tczHQAuR8nFehAenohxeOj74GHSHzTgUA6Ht8G4JYY93l_",
    cta: "SHOP MUESLI",
    bgColor: "bg-[#fff7ed]", // Orange-50
    accentColor: "text-orange-600",
    blobColor: "bg-orange-200",
    isActive: true
  },
  {
    id: '2',
    category: "NATURAL NUT BUTTERS",
    headline: "Liquid Gold",
    description: "Stone-ground Californian almonds. 100% natural, keto-friendly, and impossibly creamy. No added oil.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC36Ps7aMot5-GXznDvelGditD07FcxqmsLUDCww78ftzXv6wSqu2tdIjbahIB3N5iK37NtvJQXdCOnLTNZ7hPT-YBK4JEMa53fvnzytOZqq28jFCTDOhR37W3FMPmOt7xLn4hpt1AUcBNxzkW7oPmx9ZNsB5mf_uR6_Kj1624i-WvnHZ_HQ22K2tds_wmKQECT4e8d7rzOkqE00zOTTJkipKovCEuql_GY2ctR9FpnxXxIiaali-2EAF6m3ELAHfYIZPOzZMOeud0q",
    cta: "TASTE IT",
    bgColor: "bg-[#fefce8]", // Yellow-50
    accentColor: "text-yellow-600",
    blobColor: "bg-yellow-200",
    isActive: true
  },
  {
    id: '3',
    category: "PROTEIN PEANUT BUTTER",
    headline: "Crunch Time",
    description: "Roasted peanuts meeting dark chocolate chunks. High protein, high energy, and absolutely delicious.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCP7V5MszmhehKHONysdx4EeXIINOTiNn8Vz0A5WtMtC5U15SIefWSxwqAbYTWPoft9SYq26_rh38aCtNrrmu40qNkrU6zsV5jcvcFteB5STzIIF3UGVwStHYCi0mRIqS4r4x9IHb1IJcTkZhjHhcL4XGczrd8k4eGW0u9rFGJzNFdSQZvufHuSFWCWtMiBxADQJs1dS8lMy-KwjajLg2jPe0YVJjDDmFi6sIVZlq5UWSMwylmPhJ32RySGU3TDs6QWd41oY6qPtng8",
    cta: "GRAB A JAR",
    bgColor: "bg-[#faf5ff]", // Purple-50
    accentColor: "text-purple-600",
    blobColor: "bg-purple-200",
    isActive: true
  },
  {
    id: '4',
    category: "WHOLE GRAIN OATS",
    headline: "Power Breakfast",
    description: "Slow-releasing energy from 100% whole grain rolled oats. The perfect base for porridge or baking.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCNiD74c8_tEGvm33_Hj4lsDcPCTXKYrcvnmhVcJmDwASTO4WH7pyx_vWDolXKZRH1aacdTaCpmgdOItJGddIS5gZF6a_XVXlebwu-ohwefHDF6uX4Mjp2x1PpiFaev9waP_XSKc1UyZyqw0pRsTAQHX0bxfVYMRGpJd6A7Htf5mLGyQ2QkiA-ZCFWPOSdK8oGoGmVzjfvK9RXS5ANbLPi4N89hC-P7FQrqUrvmxuiyKxt9l8V2asTwQgQ1l29FihpAOP94VSP19PCW",
    cta: "START HEALTHY",
    bgColor: "bg-[#fff1f2]", // Rose-50
    accentColor: "text-rose-600",
    blobColor: "bg-rose-200",
    isActive: true
  },
  {
    id: '5',
    category: "GIFT HAMPERS",
    headline: "Share The Health",
    description: "Curated assortment boxes for your loved ones. Why choose one when you can have them all?",
    image: "https://images.unsplash.com/photo-1620916297397-a4a5402a3c6c?q=80&w=800&auto=format&fit=crop",
    cta: "VIEW BUNDLES",
    bgColor: "bg-[#ecfdf5]", // Emerald-50
    accentColor: "text-emerald-600",
    blobColor: "bg-emerald-200",
    isActive: true
  }
];

const INITIAL_CATEGORIES = ['Muesli', 'Nut Butters', 'Oats'];

// Current user stub
const CURRENT_USER = {
  name: "Alex Fueler",
  role: "Pro Member",
  avatar: "https://ui-avatars.com/api/?name=Alex+Fueler&background=008a45&color=fff"
};

type View = 'home' | 'product' | 'shop' | 'checkout' | 'dashboard' | 'contact' | 'faq' | 'distributor' | 'blogs' | 'blog-detail' | 'event-blogs' | 'event-detail' | 'admin-login' | 'admin-dashboard' | 'journey';

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [events, setEvents] = useState<EventBlog[]>(INITIAL_EVENTS);
  const [categories, setCategories] = useState<string[]>(INITIAL_CATEGORIES);
  const [slides, setSlides] = useState<HeroSlide[]>(INITIAL_SLIDES);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(BLOG_DATA);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<EventBlog | null>(null);
  const [selectedBlogPost, setSelectedBlogPost] = useState<BlogPost | null>(null);
  const [currentView, setCurrentView] = useState<View>('home');
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [shopCategory, setShopCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(true);

  // Simulate initial data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Sync scroll to top on view change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentView, selectedProduct, selectedEvent, selectedBlogPost]);

  // Admin Actions
  const handleAddProduct = (newProduct: Product) => {
    setProducts(prev => [newProduct, ...prev]);
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const handleAddCategory = (category: string) => {
    if (!categories.includes(category)) {
      setCategories(prev => [...prev, category]);
    }
  };

  const handleAddEvent = (newEvent: EventBlog) => {
    setEvents(prev => [newEvent, ...prev]);
  };

  const handleUpdateEvent = (updatedEvent: EventBlog) => {
    setEvents(prev => prev.map(e => e.id === updatedEvent.id ? updatedEvent : e));
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  const handleUpdateSlides = (newSlides: HeroSlide[]) => {
    setSlides(newSlides);
  };

  const handleAddBlog = (newBlog: BlogPost) => {
    setBlogPosts(prev => [newBlog, ...prev]);
  };

  const handleUpdateBlog = (updatedBlog: BlogPost) => {
    setBlogPosts(prev => prev.map(b => b.id === updatedBlog.id ? updatedBlog : b));
  };

  const handleDeleteBlog = (id: string) => {
    setBlogPosts(prev => prev.filter(b => b.id !== id));
  };

  const handleAddReview = (review: Review) => {
    setReviews(prev => [review, ...prev]);
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
    setGlobalSearchQuery(''); // Reset search when clicking shop manually
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

  const navigateToContact = () => {
    setCurrentView('contact');
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

  const goHome = () => {
    setCurrentView('home');
    setSelectedProduct(null);
    setSelectedEvent(null);
    setSelectedBlogPost(null);
    setGlobalSearchQuery('');
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    setIsAuthOpen(false);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentView('home');
  };

  const handleAdminLogin = () => {
    setIsAdminLoggedIn(true);
    setCurrentView('admin-dashboard');
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    setCurrentView('home');
  };

  const clearCart = () => {
    setCart([]);
  };

  // If viewing admin pages, do not render standard layout
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
        events={events}
        onAddEvent={handleAddEvent}
        onDeleteEvent={handleDeleteEvent}
        slides={slides}
        onUpdateSlides={handleUpdateSlides}
        blogPosts={blogPosts}
        onAddBlog={handleAddBlog}
        onUpdateBlog={handleUpdateBlog}
        onDeleteBlog={handleDeleteBlog}
      />
    );
  }

  return (
    <div className="min-h-screen selection:bg-primary/20 bg-background-light">
      {currentView !== 'checkout' && (
        <Navbar 
          cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)} 
          isLoggedIn={isLoggedIn}
          onCartClick={() => setIsCartOpen(true)} 
          onAccountClick={isLoggedIn ? navigateToDashboard : () => setIsAuthOpen(true)}
          onLogoClick={goHome}
          onProductsClick={navigateToShop}
          onDashboardClick={navigateToDashboard}
          onContactClick={navigateToContact}
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
            <ProductGrid 
              products={products}
              onAddToCart={addToCart} 
              onProductClick={navigateToProduct} 
              isLoading={isLoading}
            />
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
          </>
        )}

        {currentView === 'shop' && (
          <ShopPage 
            products={products}
            categories={categories}
            onProductClick={navigateToProduct}
            onAddToCart={addToCart}
            searchQuery={globalSearchQuery}
            selectedCategory={shopCategory}
            isLoading={isLoading}
          />
        )}

        {currentView === 'product' && selectedProduct && (
          <ProductPage 
            product={selectedProduct} 
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
            onBack={goHome} 
            onOrderSuccess={() => {
              clearCart();
              goHome();
            }}
          />
        )}

        {currentView === 'dashboard' && (
          <Dashboard onLogout={handleLogout} />
        )}

        {currentView === 'contact' && (
          <ContactPage />
        )}

        {currentView === 'faq' && (
          <FAQPage onContactClick={navigateToContact} />
        )}

        {currentView === 'distributor' && (
          <DistributorPage />
        )}

        {currentView === 'blogs' && (
          <BlogsPage 
            onBlogClick={navigateToBlogDetail}
          />
        )}

        {currentView === 'blog-detail' && selectedBlogPost && (
          <BlogDetailPage 
            post={selectedBlogPost}
            onBack={navigateToBlogs}
          />
        )}

        {currentView === 'event-blogs' && (
          <EventBlogsPage 
            events={events}
            onEventClick={navigateToEventDetail}
          />
        )}

        {currentView === 'event-detail' && selectedEvent && (
          <EventDetailsPage 
            event={selectedEvent}
            onBack={navigateToEventBlogs}
          />
        )}

        {currentView === 'journey' && (
          <JourneyPage onShopClick={navigateToShop} />
        )}
      </main>

      {currentView !== 'checkout' && (
        <Footer 
          onShopClick={navigateToShop} 
          onHomeClick={goHome} 
          onContactClick={navigateToContact}
          onFAQClick={navigateToFAQ}
          onDistributorClick={navigateToDistributor}
          onBlogsClick={navigateToBlogs}
          onEventBlogsClick={navigateToEventBlogs}
          onAdminClick={navigateToAdmin}
          onJourneyClick={navigateToJourney}
        />
      )}
      
      <GeminiChat />
      
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

export default App;
