import React, { useState, useRef, useEffect } from 'react';
import { Product, EventBlog, HeroSlide, BlogPost, Story, VisitorForm, Order, Category, Announcement, DistributorApplication } from '../types';
import { API_BASE_URL } from '../config';
import { jsPDF } from "jspdf";
import ConfirmationModal from './ConfirmationModal';

interface AdminDashboardProps {
  onLogout: () => void;
  onBackToSite: () => void;
  products: Product[];
  onAddProduct: (p: Product) => void;
  onUpdateProduct: (p: Product) => void;
  onDeleteProduct: (id: string) => void;
  categories: Category[]; // Changed from string[]
  onAddCategory: (c: Category) => void; // Changed signature
  onDeleteCategory: (id: string) => void; // Added prop
  events: EventBlog[];
  onAddEvent: (e: EventBlog) => void;
  onDeleteEvent: (id: string) => void;
  slides: HeroSlide[];
  onUpdateSlides: (s: HeroSlide[]) => void;
  blogPosts: BlogPost[];
  onAddBlog: (b: BlogPost) => void;
  onUpdateBlog: (b: BlogPost) => void;
  onDeleteBlog: (id: string) => void;
  stories: Story[];
  onAddStory: (s: Story) => void;
  onDeleteStory: (id: string) => void;
  visitorForms: VisitorForm[];
  onAddVisitorForm: (f: VisitorForm) => void;
  onDeleteVisitorForm: (id: string) => void;
  announcements: Announcement[];
  onAddAnnouncement: (a: Announcement) => void;
  onDeleteAnnouncement: (id: number) => void;
  onUpdateAnnouncement: (a: Announcement) => void;
}

// Removed INITIAL_ORDERS mock data

const ORDER_STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

const COLOR_THEMES = [
  { name: 'Orange', bgColor: 'bg-[#fff7ed]', accentColor: 'text-orange-600', blobColor: 'bg-orange-200' },
  { name: 'Yellow', bgColor: 'bg-[#fefce8]', accentColor: 'text-yellow-600', blobColor: 'bg-yellow-200' },
  { name: 'Purple', bgColor: 'bg-[#faf5ff]', accentColor: 'text-purple-600', blobColor: 'bg-purple-200' },
  { name: 'Rose', bgColor: 'bg-[#fff1f2]', accentColor: 'text-rose-600', blobColor: 'bg-rose-200' },
  { name: 'Emerald', bgColor: 'bg-[#ecfdf5]', accentColor: 'text-emerald-600', blobColor: 'bg-emerald-200' },
  { name: 'Blue', bgColor: 'bg-blue-50', accentColor: 'text-blue-600', blobColor: 'bg-blue-200' },
  { name: 'Slate', bgColor: 'bg-slate-50', accentColor: 'text-slate-800', blobColor: 'bg-slate-200' },
];



const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onLogout,
  onBackToSite,
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  categories,
  onAddCategory,
  onDeleteCategory,
  events,
  onAddEvent,
  onDeleteEvent,
  slides,
  onUpdateSlides,
  blogPosts,
  onAddBlog,
  onUpdateBlog,
  onDeleteBlog,
  stories,
  onAddStory,
  onDeleteStory,
  visitorForms,
  onAddVisitorForm,
  onDeleteVisitorForm,
  announcements,
  onAddAnnouncement,
  onDeleteAnnouncement,
  onUpdateAnnouncement
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [productView, setProductView] = useState<'list' | 'add' | 'categories'>('list');
  const [eventView, setEventView] = useState<'list' | 'add'>('list');
  const [blogView, setBlogView] = useState<'list' | 'form'>('list');
  const [uiView, setUiView] = useState<'hero' | 'stories'>('hero');
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationsLastClear, setNotificationsLastClear] = useState<number>(() => {
    return Number(localStorage.getItem('admin_notifications_last_clear') || '0');
  });
  const [showSettings, setShowSettings] = useState(false);
  const [deleteCategoryModal, setDeleteCategoryModal] = useState<{ isOpen: boolean; categoryId: string | null }>({ isOpen: false, categoryId: null });
  const [orders, setOrders] = useState<Order[]>([]);
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [orderSearchQuery, setOrderSearchQuery] = useState('');

  const adminEmail = localStorage.getItem('admin_email') || 'admin@pinobite.global';
  const adminInitials = adminEmail.substring(0, 2).toUpperCase();

  // Distributor Applications State
  const [distributorApplications, setDistributorApplications] = useState<DistributorApplication[]>([]);
  const [distributorSearchQuery, setDistributorSearchQuery] = useState('');

  const storyFileInputRef = useRef<HTMLInputElement>(null);

  // Visitor Forms State
  // visitorForms is now passed via props
  const [visitorFormView, setVisitorFormView] = useState<'list' | 'create' | 'details'>('list');
  const [selectedVisitorForm, setSelectedVisitorForm] = useState<VisitorForm | null>(null);
  const [newFormData, setNewFormData] = useState({ title: '', eventName: '' });
  const [visitorSubmissionPage, setVisitorSubmissionPage] = useState(1);
  const VISITOR_SUBMISSIONS_PER_PAGE = 6;

  // Announcements state
  const [announcementForm, setAnnouncementForm] = useState<Partial<Announcement>>({
    message: '',
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    is_active: true
  });
  const [isEditingAnnouncement, setIsEditingAnnouncement] = useState(false);
  const [editingAnnouncementId, setEditingAnnouncementId] = useState<number | null>(null);

  // Fetch Global Admin Data (Orders & Distributors) on mount
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const token = localStorage.getItem('access_token') || localStorage.getItem('admin_access_token');
        if (!token) return;

        // Fetch Orders
        const ordersRes = await fetch(`${API_BASE_URL}/api/orders/`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (ordersRes.ok) {
          const data = await ordersRes.json();
          const sortedData = data.sort((a: Order, b: Order) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
          setOrders(sortedData);
        }

        // Fetch Distributor Applications
        const distRes = await fetch(`${API_BASE_URL}/api/distributor-applications/`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (distRes.ok) {
          const data = await distRes.json();
          setDistributorApplications(data);
        }
      } catch (error) {
        console.error("Failed to fetch admin data", error);
      }
    };
    fetchAdminData();
    // Refresh every 30 seconds for real-time notifications
    const interval = setInterval(fetchAdminData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Compute Notifications
  const notifications = React.useMemo(() => {
    const list: any[] = [];

    // 1. Pending Orders
    orders.filter(o => o.status === 'PENDING').forEach(o => {
      list.push({
        id: `order-${o.id}`,
        title: `New Order #PB-${o.id}`,
        desc: `Received from ${o.user_name}`,
        time: new Date(o.created_at).getTime(),
        icon: "shopping_bag",
        color: "bg-green-100 text-green-600",
        tab: 'orders'
      });
    });

    // 2. Low Stock Alerts
    products.filter(p => p.stock < 10).forEach(p => {
      list.push({
        id: `stock-${p.id}`,
        title: "Low Stock Alert",
        desc: `${p.name} is below 10 units (${p.stock} left)`,
        time: Date.now() - 1000, // Show as current
        icon: "warning",
        color: "bg-red-100 text-red-600",
        tab: 'products'
      });
    });

    // 3. Pending Distributor Applications
    distributorApplications.filter(a => a.status === 'Pending').forEach(a => {
      list.push({
        id: `dist-${a.id}`,
        title: "Distributor Application",
        desc: `${a.business_name} applied for distribution`,
        time: new Date(a.created_at).getTime(),
        icon: "handshake",
        color: "bg-orange-100 text-orange-600",
        tab: 'distributors'
      });
    });

    // 4. Recent Visitor Submissions
    visitorForms.forEach(f => {
      f.submissions.slice(-3).forEach(s => {
        list.push({
          id: `sub-${s.id}`,
          title: "New Visitor Submission",
          desc: `${s.name} submitted ${f.title}`,
          time: new Date(s.submittedAt || Date.now()).getTime(),
          icon: "qr_code_scanner",
          color: "bg-purple-100 text-purple-600",
          tab: 'visitor-forms'
        });
      });
    });

    return list.sort((a, b) => b.time - a.time).slice(0, 10);
  }, [orders, products, distributorApplications, visitorForms]);

  const hasUnreadNotifications = notifications.some(n => n.time > notificationsLastClear);

  const formatNotifTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  const clearNotifications = () => {
    const now = Date.now();
    setNotificationsLastClear(now);
    localStorage.setItem('admin_notifications_last_clear', String(now));
  };

  // Slide Management State
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [isSlideModalOpen, setIsSlideModalOpen] = useState(false);

  // Story Form State
  const [newStoryForm, setNewStoryForm] = useState<Partial<Story>>({
    mediaUrl: '',
    mediaType: 'image',
    productId: ''
  });

  // Blog Management State
  const [editingBlogPost, setEditingBlogPost] = useState<BlogPost | null>(null);
  const [blogForm, setBlogForm] = useState<Partial<BlogPost>>({
    title: '',
    type: 'Recipe',
    excerpt: '',
    image: '',
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    readTime: '',
    author: '',
    content: ''
  });

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Product Form State
  const [productForm, setProductForm] = useState<Partial<Product>>({
    name: '',
    price: 0,
    category: '',
    stock: 100,
    description: '',
    image: '',
    gallery: [],
    rating: 5,
    reviewCount: 0,
    benefits: [],
    nutrients: [],
    ingredients: '',
    nutrition: {
      calories: '',
      protein: '',
      carbs: '',
      fat: ''
    },
    model3d: '',
    themeColor: '#FF6F00', // Default to a brand color if none selected
    orientation: '0deg 0deg 0deg',
    originalPrice: 0
  });

  // Event Form State
  const [eventForm, setEventForm] = useState<Partial<EventBlog>>({
    title: '',
    date: '',
    location: '',
    image: '',
    summary: '',
    fullStory: [{ heading: '', content: '' }],
    gallery: [],
    featuredProducts: []
  });

  // Slide Form State
  const [slideForm, setSlideForm] = useState<Partial<HeroSlide>>({
    category: '',
    headline: '',
    description: '',
    image: '',
    cta: 'SHOP NOW',
    bgColor: COLOR_THEMES[0].bgColor,
    accentColor: COLOR_THEMES[0].accentColor,
    blobColor: COLOR_THEMES[0].blobColor,
    isActive: true
  });

  const [newCategory, setNewCategory] = useState('');

  // Story Handlers
  const handleAddStory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStoryForm.mediaUrl || !newStoryForm.productId) {
      alert("Please provide a media URL or upload a file and select a product.");
      return;
    }
    const newStory: Story = {
      id: `s - ${Date.now()} `,
      mediaUrl: newStoryForm.mediaUrl || '',
      mediaType: newStoryForm.mediaType || 'image',
      productId: newStoryForm.productId || ''
    };
    onAddStory(newStory);
    setNewStoryForm({ mediaUrl: '', mediaType: 'image', productId: '' });
  };

  const deleteStory = (id: string) => {
    onDeleteStory(id);
  };

  const handleStoryFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewStoryForm({
          ...newStoryForm,
          mediaUrl: reader.result as string,
          mediaType: file.type.startsWith('video') ? 'video' : 'image'
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const openAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      price: 0,
      category: '',
      stock: 100,
      description: '',
      image: '',
      gallery: [],
      rating: 5,
      reviewCount: 0,
      benefits: [],
      nutrients: [],
      ingredients: '',
      nutrition: {
        calories: '',
        protein: '',
        carbs: '',
        fat: ''
      },
      model3d: '',
      themeColor: '#FF6F00',
      orientation: '0deg 0deg 0deg',
      originalPrice: 0
    });
    setProductView('add');
  };

  const openEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      ...product,
      themeColor: product.themeColor || '#FF6F00',
      orientation: product.orientation || '0deg 0deg 0deg'
    });
    setProductView('add');
  };

  const updateBenefit = (index: number, value: string) => {
    const newBenefits = [...(productForm.benefits || [])];
    newBenefits[index] = value;
    setProductForm(prev => ({ ...prev, benefits: newBenefits }));
  };

  const addBenefit = () => {
    setProductForm(prev => ({ ...prev, benefits: [...(prev.benefits || []), ''] }));
  };

  const removeBenefit = (index: number) => {
    setProductForm(prev => ({ ...prev, benefits: prev.benefits?.filter((_, i) => i !== index) }));
  };

  // Handlers for Products
  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.image) {
      alert("Please upload a featured image.");
      return;
    }

    if (editingProduct) {
      const updatedProduct: Product = {
        ...editingProduct,
        ...productForm as Product,
        id: editingProduct.id // Keep original ID
      };
      onUpdateProduct(updatedProduct);
    } else {
      const newProduct: Product = {
        id: Date.now().toString(),
        name: productForm.name || 'New Product',
        price: Number(productForm.price) || 0,
        category: productForm.category || 'Uncategorized',
        stock: Number(productForm.stock) || 0,
        description: productForm.description || '',
        image: productForm.image || '',
        gallery: productForm.gallery || [],
        rating: 5,
        reviewCount: 0,
        benefits: productForm.benefits || [],
        nutrients: productForm.nutrients || [],
        ...productForm as Product
      };
      onAddProduct(newProduct);
    }

    setProductView('list');
    setEditingProduct(null);
    setProductForm({
      name: '',
      price: 0,
      category: '',
      stock: 100,
      description: '',
      image: '',
      gallery: [],
      rating: 5,
      reviewCount: 0,
      benefits: [],
      nutrients: [],
      ingredients: '',
      nutrition: {
        calories: '',
        protein: '',
        carbs: '',
        fat: ''
      },
      model3d: '',
      themeColor: '#FF6F00',
      orientation: '0deg 0deg 0deg',
      originalPrice: 0
    });
  };

  const handleStockUpdate = (product: Product, newStock: number) => {
    onUpdateProduct({ ...product, stock: Math.max(0, newStock) });
  };

  // Handlers for Blog
  const openAddBlog = () => {
    setEditingBlogPost(null);
    setBlogForm({
      title: '',
      type: 'Recipe',
      excerpt: '',
      image: '',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      readTime: '',
      author: '',
      content: ''
    });
    setBlogView('form');
  };

  const openEditBlog = (post: BlogPost) => {
    setEditingBlogPost(post);
    const content = Array.isArray(post.content) ? post.content.join('\n\n') : (post.content || '');
    setBlogForm({ ...post, content });
    setBlogView('form');
  };

  const handleBlogSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!blogForm.image) {
      alert("Please upload a cover image.");
      return;
    }

    const postData: BlogPost = {
      id: editingBlogPost ? editingBlogPost.id : Date.now().toString(),
      title: blogForm.title || 'Untitled Post',
      type: (blogForm.type as any) || 'Recipe',
      excerpt: blogForm.excerpt || '',
      image: blogForm.image || '',
      date: blogForm.date || new Date().toDateString(),
      readTime: blogForm.readTime || '5 min read',
      author: blogForm.author || 'Admin',
      content: blogForm.content || ''
    };

    if (editingBlogPost) {
      onUpdateBlog(postData);
    } else {
      onAddBlog(postData);
    }
    setBlogView('list');
  };

  const handleBlogImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setBlogForm(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const updateBlogContent = (index: number, value: string) => {
    const newContent = [...(blogForm.content || [])];
    newContent[index] = value;
    setBlogForm(prev => ({ ...prev, content: newContent }));
  };

  const addBlogParagraph = () => {
    setBlogForm(prev => ({ ...prev, content: [...(prev.content || []), ''] }));
  };

  const removeBlogParagraph = (index: number) => {
    setBlogForm(prev => ({ ...prev, content: prev.content?.filter((_, i) => i !== index) }));
  };

  // Handlers for Slides
  const handleSlideSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingSlide) {
      // Update existing
      const updatedSlides = slides.map(s =>
        s.id === editingSlide.id ? { ...s, ...slideForm } as HeroSlide : s
      );
      onUpdateSlides(updatedSlides);
    } else {
      // Add new
      const newSlide: HeroSlide = {
        id: Date.now().toString(),
        category: slideForm.category || 'New Category',
        headline: slideForm.headline || 'New Headline',
        description: slideForm.description || '',
        image: slideForm.image || '',
        cta: slideForm.cta || 'SHOP NOW',
        bgColor: slideForm.bgColor || COLOR_THEMES[0].bgColor,
        accentColor: slideForm.accentColor || COLOR_THEMES[0].accentColor,
        blobColor: slideForm.blobColor || COLOR_THEMES[0].blobColor,
        isActive: slideForm.isActive ?? true
      };
      onUpdateSlides([...slides, newSlide]);
    }
    closeSlideModal();
  };

  const openAddSlideModal = () => {
    setEditingSlide(null);
    setSlideForm({
      category: '',
      headline: '',
      description: '',
      image: '',
      cta: 'SHOP NOW',
      bgColor: COLOR_THEMES[0].bgColor,
      accentColor: COLOR_THEMES[0].accentColor,
      blobColor: COLOR_THEMES[0].blobColor,
      isActive: true
    });
    setIsSlideModalOpen(true);
  };

  const openEditSlideModal = (slide: HeroSlide) => {
    setEditingSlide(slide);
    setSlideForm({ ...slide });
    setIsSlideModalOpen(true);
  };

  const closeSlideModal = () => {
    setIsSlideModalOpen(false);
    setEditingSlide(null);
  };

  const deleteSlide = (id: string) => {
    if (confirm('Are you sure you want to delete this slide?')) {
      onUpdateSlides(slides.filter(s => s.id !== id));
    }
  };

  const toggleSlideStatus = (id: string) => {
    onUpdateSlides(slides.map(s => s.id === id ? { ...s, isActive: !s.isActive } : s));
  };

  const moveSlide = (index: number, direction: 'up' | 'down') => {
    const newSlides = [...slides];
    if (direction === 'up' && index > 0) {
      [newSlides[index], newSlides[index - 1]] = [newSlides[index - 1], newSlides[index]];
    } else if (direction === 'down' && index < newSlides.length - 1) {
      [newSlides[index], newSlides[index + 1]] = [newSlides[index + 1], newSlides[index]];
    }
    onUpdateSlides(newSlides);
  };

  const handleSlideImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setSlideForm(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handlers for Visitor Forms
  const handleCreateForm = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `vf - ${Date.now()} `;
    const newForm: VisitorForm = {
      id: newId,
      title: newFormData.title,
      eventName: newFormData.eventName,
      status: 'Published',
      link: `https://pinobite.global/forms/${newId}`,
      createdAt: new Date().toISOString(),
      submissions: []
    };
    onAddVisitorForm(newForm);
    setVisitorFormView('list');
    setNewFormData({ title: '', eventName: '' });
  };

  const downloadQRCode = async (dataUrl: string, filename: string) => {
    try {
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading QR code:', error);
      alert('Failed to download QR code');
    }
  };

  const handleExportCSV = () => {
    if (!selectedVisitorForm) return;

    const headers = [
      'Name',
      'Email',
      'Phone',
      'Address/City',
      'Buying Source',
      'Brand Awareness',
      'Current Usage',
      'Flavor Preferences',
      'Reviewed Product',
      'Review Content',
      'Marketing Consent',
      'Submitted At'
    ];

    const rows = selectedVisitorForm.submissions.map(sub => [
      sub.name,
      sub.email,
      sub.phone,
      sub.addressDetails || '',
      sub.buyingSource || '',
      sub.brandAwareness ? 'Yes' : 'No',
      sub.currentUsage || '',
      sub.flavorPreferences || '',
      sub.reviewedProduct || '',
      sub.reviewContent || '',
      sub.marketingConsent ? 'Agreed' : 'Not Agreed',
      new Date(sub.submittedAt || Date.now()).toLocaleString()
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')) // Quote cells and escape existing quotes
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${selectedVisitorForm.title.replace(/\s+/g, '_')}_submissions.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handlers for Announcements
  const handleAnnouncementSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementForm.message) return;

    if (isEditingAnnouncement && editingAnnouncementId) {
      onUpdateAnnouncement({
        ...announcementForm,
        id: Number(editingAnnouncementId)
      } as Announcement);
    } else {
      onAddAnnouncement({
        ...announcementForm,
        id: Date.now() // Use number for temporary ID
      } as Announcement);
    }

    setAnnouncementForm({
      message: '',
      start_date: new Date().toISOString().split('T')[0],
      end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      is_active: true
    });
    setIsEditingAnnouncement(false);
    setEditingAnnouncementId(null);
  };

  const startEditAnnouncement = (a: Announcement) => {
    setAnnouncementForm({
      message: a.message,
      start_date: a.start_date.split('T')[0],
      end_date: a.end_date.split('T')[0],
      is_active: a.is_active
    });
    setIsEditingAnnouncement(true);
    setEditingAnnouncementId(a.id);
  };

  // Handlers for Events
  const handleEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventForm.image) {
      alert("Please upload a cover image.");
      return;
    }

    const newEvent: EventBlog = {
      id: Date.now().toString(),
      title: eventForm.title || 'New Event',
      date: eventForm.date || new Date().toDateString(),
      location: eventForm.location || 'Online',
      image: eventForm.image || '',
      summary: eventForm.summary || '',
      fullStory: eventForm.fullStory?.filter(s => s.heading && s.content) || [],
      gallery: eventForm.gallery || [],
      featuredProducts: []
    };
    onAddEvent(newEvent);
    setEventView('list');
    setEventForm({ title: '', date: '', location: '', image: '', summary: '', fullStory: [{ heading: '', content: '' }], gallery: [], featuredProducts: [] });
  };

  const handleEventImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'cover' | 'gallery') => {
    if (e.target.files && e.target.files.length > 0) {
      if (type === 'cover') {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
          setEventForm(prev => ({ ...prev, image: reader.result as string }));
        };
        reader.readAsDataURL(file);
      } else {
        const files = e.target.files;
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const reader = new FileReader();
          reader.onloadend = () => {
            setEventForm(prev => ({
              ...prev,
              gallery: [...(prev.gallery || []), reader.result as string]
            }));
          };
          reader.readAsDataURL(file);
        }
      }
    }
  };

  const addStorySection = () => {
    setEventForm(prev => ({
      ...prev,
      fullStory: [...(prev.fullStory || []), { heading: '', content: '' }]
    }));
  };

  const updateStorySection = (index: number, field: 'heading' | 'content', value: string) => {
    const newStory = [...(eventForm.fullStory || [])];
    newStory[index][field] = value;
    setEventForm(prev => ({ ...prev, fullStory: newStory }));
  };

  const toggleFeaturedProduct = (productId: string) => {
    const current = eventForm.featuredProducts || [];
    if (current.includes(productId)) {
      setEventForm(prev => ({ ...prev, featuredProducts: current.filter(id => id !== productId) }));
    } else {
      setEventForm(prev => ({ ...prev, featuredProducts: [...current, productId] }));
    }
  };

  // Reused Image Uploader for Products
  const handleProductImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'featured' | 'gallery') => {
    if (e.target.files && e.target.files.length > 0) {
      if (type === 'featured') {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
          setProductForm(prev => ({ ...prev, image: reader.result as string }));
        };
        reader.readAsDataURL(file);
      } else {
        const files = e.target.files;
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const reader = new FileReader();
          reader.onloadend = () => {
            setProductForm(prev => ({
              ...prev,
              gallery: [...(prev.gallery || []), reader.result as string]
            }));
          };
          reader.readAsDataURL(file);
        }
      }
    }
  };

  const handleProductModel3DUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductForm(prev => ({ ...prev, model3d: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Invoice Generation
  const handleDownloadInvoice = () => {
    if (!viewingOrder) return;

    const doc = new jsPDF();

    // Brand
    doc.setFontSize(22);
    doc.setTextColor(0, 138, 69); // Pinobite Green
    doc.text("PINOBITE GLOBAL", 20, 20);

    // Invoice Label
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text("INVOICE", 150, 20);

    // Order Details
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Order ID: ${viewingOrder.id}`, 20, 40);
    doc.text(`Date: ${new Date(viewingOrder.created_at).toLocaleDateString()}`, 20, 46);
    doc.text(`Status: ${viewingOrder.status}`, 20, 52);
    doc.text(`Payment: ${viewingOrder.razorpay_payment_id ? 'Paid' : 'Pending'}`, 20, 58);

    // Customer Details
    doc.text(`Customer: ${viewingOrder.user_name}`, 150, 40);
    doc.text(viewingOrder.shipping_address || 'No Address', 150, 46);

    // Divider
    doc.setDrawColor(220, 220, 220);
    doc.line(20, 65, 190, 65);

    // Table Header
    doc.setFontSize(11);
    doc.setTextColor(0);
    doc.text("Item Description", 20, 75);
    doc.text("Qty", 130, 75);
    doc.text("Price", 160, 75);

    // Divider
    doc.line(20, 80, 190, 80);

    // Table Body
    let y = 90;
    doc.setFontSize(10);
    doc.setTextColor(60);

    viewingOrder.items.forEach((item) => {
      doc.text(item.product_name, 20, y);
      doc.text(item.quantity.toString(), 130, y);
      doc.text(`Rs. ${item.price}`, 160, y);
      y += 10;
    });

    // Divider
    doc.line(20, y, 190, y);
    y += 10;

    // Total
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text("Total Amount:", 110, y + 5);
    doc.setTextColor(0, 138, 69);
    doc.text(`Rs. ${viewingOrder.total_amount.toLocaleString()}`, 160, y + 5);

    // Footer
    doc.setFontSize(9);
    doc.setTextColor(150);
    doc.text("Thank you for your business!", 20, y + 30);
    doc.text("This is a computer generated invoice.", 20, y + 35);

    doc.save(`Invoice-${viewingOrder.id}.pdf`);
  };

  // Update Status Logic
  // Update Status Logic
  const handleStatusUpdate = async (newStatus: string) => {
    if (!viewingOrder) return;
    try {
      const token = localStorage.getItem('access_token') || localStorage.getItem('admin_access_token');
      if (!token) return;
      const response = await fetch(`${API_BASE_URL}/api/orders/${viewingOrder.id}/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (response.ok) {
        // Update local orders list
        const updatedOrders = orders.map(o =>
          o.id === viewingOrder.id ? { ...o, status: newStatus } : o
        );
        setOrders(updatedOrders);
        // Update currently viewing order
        setViewingOrder({ ...viewingOrder, status: newStatus });
        setShowStatusMenu(false);
      }
    } catch (error) {
      console.error("Failed to update status", error);
      alert("Failed to update status");
    }
  };

  // Filter orders based on search query
  // Filter orders based on search query
  const filteredOrders = orders.filter(order =>
    order.id.toString().includes(orderSearchQuery) ||
    order.user_email?.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
    order.user_name?.toLowerCase().includes(orderSearchQuery.toLowerCase())
  );

  const getPageTitle = () => {
    switch (activeTab) {
      case 'overview': return 'Command Center';
      case 'products': return 'Inventory Management';
      case 'blogs': return 'Blog Manager';
      case 'events': return 'Event Stories';
      case 'ui-settings': return 'Site Customization';
      case 'visitor-forms': return 'Pinobit Event Visitor Form';
      case 'announcements': return 'Dynamic Announcements';
      default: return activeTab.replace('-', ' ');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex font-display">
      {/* Sidebar */}
      <aside className="w-20 lg:w-64 bg-slate-900 text-white flex flex-col flex-shrink-0 transition-all duration-300">
        <div className="p-4 border-b border-slate-800 h-20 flex items-center justify-center">
          <button
            onClick={onBackToSite}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 hover:bg-primary text-white rounded-xl transition-all duration-300 group"
          >
            <span className="material-symbols-outlined text-xl group-hover:-translate-x-1 transition-transform">arrow_back</span>
            <span className="font-bold text-sm hidden lg:block uppercase tracking-wider">Go to Site</span>
          </button>
        </div>

        <nav className="flex-1 py-6 space-y-1">
          {[
            { id: 'overview', icon: 'dashboard', label: 'Overview' },
            { id: 'products', icon: 'inventory_2', label: 'Products & Stock' },
            { id: 'blogs', icon: 'article', label: 'Blog Manager' },
            { id: 'events', icon: 'event', label: 'Event Manager' },
            { id: 'ui-settings', icon: 'palette', label: 'Site UI Settings' },
            { id: 'orders', icon: 'shopping_bag', label: 'Global Orders' },
            { id: 'announcements', icon: 'campaign', label: 'Announcements' },
            { id: 'distributors', icon: 'handshake', label: 'Distributors' },
            { id: 'visitor-forms', icon: 'qr_code_scanner', label: 'Visitor Forms' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-6 py-4 transition-colors relative ${activeTab === item.id
                ? 'text-white bg-slate-800'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className="font-bold text-sm hidden lg:block">{item.label}</span>
              {activeTab === item.id && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800/50">
          <div className="bg-slate-800/40 rounded-2xl p-4 border border-slate-700/30">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center font-black text-white shadow-lg shadow-primary/20 flex-shrink-0">
                {adminInitials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-0.5">Signed in as</p>
                <p className="text-xs font-bold text-white truncate" title={adminEmail}>{adminEmail}</p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-slate-700/50">
              <span className="text-[10px] font-black uppercase tracking-widest text-primary/80 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                Super Admin
              </span>
              <button
                onClick={onLogout}
                className="w-8 h-8 rounded-lg bg-slate-700/50 text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-all flex items-center justify-center group"
                title="Logout"
              >
                <span className="material-symbols-outlined text-lg group-hover:translate-x-0.5 transition-transform">logout</span>
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 flex-shrink-0 relative z-30">
          <h2 className="text-2xl font-black uppercase text-slate-800">
            {getPageTitle()}
          </h2>
          <div className="flex items-center gap-4 relative">

            {/* Notifications Toggle */}
            <button
              onClick={() => { setShowNotifications(!showNotifications); setShowSettings(false); }}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors relative ${showNotifications ? 'bg-primary text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}
            >
              <span className="material-symbols-outlined">notifications</span>
              {hasUnreadNotifications && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
              )}
            </button>

            {/* Settings Toggle */}
            <button
              onClick={() => { setShowSettings(!showSettings); setShowNotifications(false); }}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors relative ${showSettings ? 'bg-primary text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}
            >
              <span className="material-symbols-outlined">settings</span>
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute top-14 right-12 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-4 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                  <h4 className="font-black uppercase text-xs tracking-widest text-slate-900">Notifications</h4>
                  <button onClick={clearNotifications} className="text-[10px] font-bold text-primary hover:underline">Mark all read</button>
                </div>
                <div className="max-h-72 overflow-y-auto custom-scroll">
                  {notifications.length > 0 ? (
                    notifications.map((notif, i) => (
                      <div
                        key={i}
                        onClick={() => {
                          if (notif.tab) setActiveTab(notif.tab);
                          setShowNotifications(false);
                        }}
                        className={`p-4 hover:bg-slate-50 transition-colors flex gap-3 border-b border-slate-50 last:border-0 cursor-pointer ${notif.time > notificationsLastClear ? 'bg-primary/5' : ''}`}
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${notif.color}`}>
                          <span className="material-symbols-outlined text-sm">{notif.icon}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-slate-800 leading-tight truncate">{notif.title}</p>
                          <p className="text-xs text-slate-500 mt-1 line-clamp-2">{notif.desc}</p>
                          <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase">{formatNotifTime(notif.time)}</p>
                        </div>
                        {notif.time > notificationsLastClear && (
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2"></div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center">
                      <span className="material-symbols-outlined text-slate-200 text-4xl mb-2">notifications_off</span>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No new notifications</p>
                    </div>
                  )}
                </div>
                <div className="p-3 bg-slate-50 text-center border-t border-slate-100">
                  <button onClick={() => { setActiveTab('overview'); setShowNotifications(false); }} className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-slate-900">View All Activity</button>
                </div>
              </div>
            )}

            {/* Settings Dropdown */}
            {showSettings && (
              <div className="absolute top-14 right-0 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-4 border-b border-slate-50 bg-slate-50/50">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Signed in as</p>
                  <p className="font-black text-slate-900 truncate text-sm">{adminEmail}</p>
                </div>
                <div className="p-2 space-y-1">
                  <button className="w-full text-left px-4 py-2.5 rounded-xl hover:bg-slate-50 text-sm font-bold text-slate-600 flex items-center gap-3 transition-colors">
                    <span className="material-symbols-outlined text-lg">person</span> Profile Settings
                  </button>
                  <button className="w-full text-left px-4 py-2.5 rounded-xl hover:bg-slate-50 text-sm font-bold text-slate-600 flex items-center gap-3 transition-colors">
                    <span className="material-symbols-outlined text-lg">tune</span> System Preferences
                  </button>
                  <button className="w-full text-left px-4 py-2.5 rounded-xl hover:bg-slate-50 text-sm font-bold text-slate-600 flex items-center gap-3 transition-colors">
                    <span className="material-symbols-outlined text-lg">security</span> Security
                  </button>
                </div>
                <div className="p-2 border-t border-slate-50">
                  <button onClick={onLogout} className="w-full text-left px-4 py-2.5 rounded-xl hover:bg-red-50 text-sm font-bold text-red-600 flex items-center gap-3 transition-colors">
                    <span className="material-symbols-outlined text-lg">logout</span> Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-8 custom-scroll" onClick={() => { setShowNotifications(false); setShowSettings(false); }}>

          {/* ----- SITE UI SETTINGS TAB ----- */}
          {activeTab === 'ui-settings' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              {/* UI Section Sub-tabs */}
              <div className="flex gap-4 p-1 bg-white rounded-2xl shadow-sm border border-slate-200 w-fit">
                <button
                  onClick={() => setUiView('hero')}
                  className={`px-8 py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${uiView === 'hero' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  Hero Slider
                </button>
                <button
                  onClick={() => setUiView('stories')}
                  className={`px-8 py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${uiView === 'stories' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  Social Stories
                </button>
              </div>

              {/* View: Hero Manager */}
              {uiView === 'hero' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-black uppercase text-slate-800">Slider Configuration</h3>
                    <button
                      onClick={openAddSlideModal}
                      className="bg-primary text-white px-6 py-3 rounded-xl font-black uppercase text-xs tracking-widest hover:shadow-lg transition-all flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-lg">add_circle</span> Add Slide
                    </button>
                  </div>

                  <div className="grid gap-6">
                    {slides.map((slide, index) => (
                      <div key={slide.id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden flex shadow-sm hover:shadow-md transition-shadow group">
                        <div className={`w-48 ${slide.bgColor} flex items-center justify-center p-4 relative overflow-hidden`}>
                          <div className={`absolute -bottom-4 -right-4 w-20 h-20 rounded-full blur-2xl opacity-40 ${slide.blobColor}`}></div>
                          <img src={slide.image} className="w-full h-auto object-contain drop-shadow-lg z-10" alt="Preview" />
                        </div>
                        <div className="flex-1 p-6 flex flex-col">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${slide.accentColor}`}>{slide.category}</span>
                              <h4 className="font-black uppercase text-xl leading-tight mt-1">{slide.headline}</h4>
                            </div>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => moveSlide(index, 'up')} disabled={index === 0} className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-400 flex items-center justify-center disabled:opacity-30"><span className="material-symbols-outlined text-sm">keyboard_arrow_up</span></button>
                              <button onClick={() => moveSlide(index, 'down')} disabled={index === slides.length - 1} className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-400 flex items-center justify-center disabled:opacity-30"><span className="material-symbols-outlined text-sm">keyboard_arrow_down</span></button>
                            </div>
                          </div>
                          <p className="text-sm text-slate-500 line-clamp-2 flex-1 mb-4">{slide.description}</p>
                          <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                            <div className="flex items-center gap-4">
                              <button onClick={() => toggleSlideStatus(slide.id)} className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${slide.isActive ? 'text-green-500' : 'text-slate-400'}`}>
                                <span className="material-symbols-outlined text-lg">{slide.isActive ? 'check_circle' : 'circle'}</span>
                                {slide.isActive ? 'Active' : 'Hidden'}
                              </button>
                            </div>
                            <div className="flex gap-2">
                              <button onClick={() => deleteSlide(slide.id)} className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"><span className="material-symbols-outlined text-lg">delete</span></button>
                              <button onClick={() => openEditSlideModal(slide)} className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-primary transition-colors">Edit Content</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* View: Stories Manager */}
              {uiView === 'stories' && (
                <div className="space-y-8 animate-in fade-in duration-300">
                  <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
                    <h3 className="text-xl font-black uppercase text-slate-900 mb-6">Create New Story</h3>
                    <form onSubmit={handleAddStory} className="grid md:grid-cols-4 gap-6 items-end">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Upload Media</label>
                        <div className="flex gap-2">
                          <input
                            ref={storyFileInputRef}
                            type="file"
                            accept="image/*,video/*"
                            onChange={handleStoryFileUpload}
                            className="hidden"
                          />
                          <button
                            type="button"
                            onClick={() => storyFileInputRef.current?.click()}
                            className={`flex-1 px-4 py-3 rounded-xl border-2 border-dashed transition-all flex items-center justify-center gap-2 font-black uppercase text-[10px] tracking-widest ${newStoryForm.mediaUrl ? 'bg-green-50 border-green-200 text-green-600' : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-primary hover:text-primary'}`}
                          >
                            <span className="material-symbols-outlined text-lg">
                              {newStoryForm.mediaUrl ? 'check_circle' : 'cloud_upload'}
                            </span>
                            {newStoryForm.mediaUrl ? 'Ready' : 'Upload'}
                          </button>
                          {newStoryForm.mediaUrl && (
                            <button 
                              type="button"
                              onClick={() => setNewStoryForm({ ...newStoryForm, mediaUrl: '', mediaType: 'image' })}
                              className="w-12 h-[48px] rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-colors flex items-center justify-center"
                            >
                              <span className="material-symbols-outlined">delete</span>
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Media Type</label>
                        <select
                          value={newStoryForm.mediaType}
                          onChange={e => setNewStoryForm({ ...newStoryForm, mediaType: e.target.value as 'image' | 'video' })}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 font-bold focus:ring-primary bg-white"
                        >
                          <option value="image">Image</option>
                          <option value="video">Video</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Link Product</label>
                        <select
                          value={newStoryForm.productId}
                          onChange={e => setNewStoryForm({ ...newStoryForm, productId: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 font-bold focus:ring-primary bg-white"
                        >
                          <option value="">Select a product...</option>
                          {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                      </div>
                      <button type="submit" className="bg-primary text-white py-3 rounded-xl font-black uppercase text-xs tracking-widest hover:shadow-lg transition-all h-[50px]">
                        Add Story
                      </button>
                    </form>

                    {/* Story Preview Area */}
                    {newStoryForm.mediaUrl && (
                      <div className="mt-8 border-t border-slate-100 pt-6">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Live Preview</h4>
                        <div className="w-[160px] h-[280px] rounded-[18px] overflow-hidden relative shadow-lg">
                          {newStoryForm.mediaType === 'video' ? (
                            <video src={newStoryForm.mediaUrl} className="w-full h-full object-cover" autoPlay muted loop />
                          ) : (
                            <img src={newStoryForm.mediaUrl} className="w-full h-full object-cover" alt="Preview" />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                          {(() => {
                            const p = products.find(prod => prod.id === newStoryForm.productId);
                            if (!p) {
                              return (
                                <div className="absolute bottom-2 left-2 right-2">
                                  <p className="text-[8px] font-bold text-white uppercase truncate">Product will link here</p>
                                </div>
                              );
                            }
                            return (
                                <div className="absolute bottom-4 left-2 right-2 bg-white rounded-xl p-2.5 shadow-lg flex items-center gap-3 border border-slate-100">
                                  <div className="w-16 h-16 rounded-lg flex-shrink-0 flex items-center justify-center">
                                    <img src={p.image} className="w-14 h-14 object-contain" alt="P" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h4 className="text-[11px] font-bold text-slate-900 leading-[1.2] line-clamp-2">
                                      {p.name.split('(')[0] || p.name}
                                    </h4>
                                    <div className="flex items-center gap-2 mt-0">
                                      <span className="text-[12px] font-black text-slate-900">₹{p.price.toLocaleString()}</span>
                                      {p.originalPrice && (
                                        <span className="text-[9px] text-slate-400 line-through decoration-slate-300">₹{p.originalPrice.toLocaleString()}</span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                            );
                          })()}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {[...stories].reverse().map(story => {
                      const p = products.find(prod => prod.id === story.productId);
                      return (
                        <div key={story.id} className="relative aspect-[9/16] bg-slate-200 rounded-2xl overflow-hidden group border-2 border-transparent hover:border-primary transition-all">
                          {story.mediaType === 'video' ? (
                            <video src={story.mediaUrl} className="w-full h-full object-cover" muted loop />
                          ) : (
                            <img src={story.mediaUrl} className="w-full h-full object-cover" alt="Story" />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                          {p && (
                            <div className="absolute bottom-2 left-2 right-2 bg-white rounded-xl p-1.5 shadow-lg flex items-center gap-2 border border-slate-50">
                                 <div className="w-9 h-9 rounded-lg bg-white flex-shrink-0 overflow-hidden flex items-center justify-center border border-slate-50">
                                   <img src={p.image} className="w-8 h-8 object-contain" alt="P" />
                                 </div>
                                 <div className="flex-1 min-w-0">
                                   <h4 className="text-[8px] font-bold text-slate-900 leading-[1.1] line-clamp-2">
                                     {p.name.split('(')[0] || p.name}
                                   </h4>
                                   <div className="flex items-center gap-1.5 mt-0">
                                     <span className="text-[8px] font-black text-slate-900">₹{p.price.toLocaleString()}</span>
                                     {p.originalPrice && (
                                        <span className="text-[6px] text-slate-400 line-through decoration-slate-300">₹{p.originalPrice.toLocaleString()}</span>
                                      )}
                                   </div>
                                 </div>
                               </div>
                          )}
                          <button
                            onClick={() => deleteStory(story.id)}
                            className="absolute top-2 right-2 w-8 h-8 bg-white/90 backdrop-blur rounded-full text-red-500 flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <span className="material-symbols-outlined text-sm">delete</span>
                          </button>
                          <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-slate-900/60 rounded text-[6px] font-black text-white uppercase tracking-widest backdrop-blur">
                            {story.mediaType}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ----- VISITOR FORMS TAB ----- */}
          {/* ----- DISTRIBUTORS TAB ----- */}
          {activeTab === 'distributors' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
                  <div>
                    <h3 className="font-black uppercase text-slate-900">Distributor Applications</h3>
                    <p className="text-xs text-slate-500 font-bold mt-1 uppercase tracking-wider">{distributorApplications.length} Total Applicants</p>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined text-lg">search</span>
                    <input
                      type="text"
                      placeholder="Search distributors..."
                      value={distributorSearchQuery}
                      onChange={(e) => setDistributorSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-sm font-bold focus:ring-primary focus:border-primary w-64"
                    />
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="p-4 text-xs font-black uppercase text-slate-500 tracking-widest">Business Detail</th>
                        <th className="p-4 text-xs font-black uppercase text-slate-500 tracking-widest">Contact Person</th>
                        <th className="p-4 text-xs font-black uppercase text-slate-500 tracking-widest">Location</th>
                        <th className="p-4 text-xs font-black uppercase text-slate-500 tracking-widest">Status</th>
                        <th className="p-4 text-xs font-black uppercase text-slate-500 tracking-widest">Date Applied</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-bold text-slate-700">
                      {(distributorApplications || [])
                        .filter(app =>
                          (app.business_name || '').toLowerCase().includes(distributorSearchQuery.toLowerCase()) ||
                          (app.full_name || '').toLowerCase().includes(distributorSearchQuery.toLowerCase())
                        ).map(app => (
                          <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                            <td className="p-4">
                              <div className="text-slate-900 font-black uppercase text-sm tracking-tight">{app.business_name}</div>
                              <div className="text-xs text-slate-400 lowercase">{app.email}</div>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-slate-400 text-sm">person</span>
                                {app.full_name}
                              </div>
                              <div className="text-[10px] text-slate-400">{app.phone_number}</div>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-slate-400 text-sm">location_city</span>
                                {app.city || 'N/A'}
                              </div>
                            </td>
                            <td className="p-4">
                              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${app.status === 'Approved' ? 'bg-green-100 text-green-600' :
                                app.status === 'Rejected' ? 'bg-red-100 text-red-600' :
                                  'bg-orange-100 text-orange-600'
                                }`}>
                                {app.status || 'Pending'}
                              </span>
                            </td>
                            <td className="p-4 text-sm text-slate-400">
                              {new Date(app.created_at).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      {(distributorApplications || []).length === 0 && (
                        <tr>
                          <td colSpan={5} className="p-8 text-center text-slate-400 font-bold">
                            No applications found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'visitor-forms' && (
            <div className="space-y-6 animate-in fade-in duration-300">

              {/* Toolbar */}
              <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
                  <button
                    onClick={() => { setVisitorFormView('list'); setSelectedVisitorForm(null); }}
                    className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${visitorFormView === 'list' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    All Forms
                  </button>
                  <button
                    onClick={() => { setVisitorFormView('create'); setSelectedVisitorForm(null); }}
                    className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${visitorFormView === 'create' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    Create New Form
                  </button>
                </div>
              </div>

              {/* View: Create Form */}
              {visitorFormView === 'create' && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 max-w-2xl mx-auto">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined text-2xl">qr_code_2</span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-black uppercase text-slate-900">Create Visitor Form</h3>
                      <p className="text-sm text-slate-500 font-medium">Generate a QR code for quick event check-ins.</p>
                    </div>
                  </div>

                  <form onSubmit={handleCreateForm} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-500">Form Title</label>
                      <input required type="text" value={newFormData.title} onChange={e => setNewFormData({ ...newFormData, title: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 font-bold focus:ring-primary focus:border-primary" placeholder="e.g. Morning Yoga Registration" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-500">Event Name</label>
                      <input required type="text" value={newFormData.eventName} onChange={e => setNewFormData({ ...newFormData, eventName: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 font-bold focus:ring-primary focus:border-primary" placeholder="e.g. Yoga at the Park" />
                    </div>

                    <div className="pt-4 flex gap-4 justify-end">
                      <button type="button" onClick={() => setVisitorFormView('list')} className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-50">Cancel</button>
                      <button type="submit" className="px-8 py-3 rounded-xl bg-primary text-white font-black uppercase tracking-widest hover:shadow-lg transition-all">Publish Form</button>
                    </div>
                  </form>
                </div>
              )}

              {/* View: Form List */}
              {visitorFormView === 'list' && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {visitorForms.map(form => (
                    <div key={form.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
                      <div className="p-6 border-b border-slate-50 flex justify-between items-start">
                        <div>
                          <h4 className="font-black text-lg text-slate-900 mb-1">{form.title}</h4>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{form.eventName}</p>
                        </div>
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-[10px] font-black uppercase tracking-wider">{form.status}</span>
                      </div>
                      <div className="p-6 grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-slate-50 rounded-xl">
                          <p className="text-2xl font-black text-primary">{form.submissions.length}</p>
                          <p className="text-[10px] uppercase font-bold text-slate-400">Submissions</p>
                        </div>
                        <button
                          onClick={() => { setSelectedVisitorForm(form); setVisitorFormView('details'); }}
                          className="flex flex-col items-center justify-center p-3 bg-slate-900 text-white rounded-xl hover:bg-primary transition-colors"
                        >
                          <span className="material-symbols-outlined mb-1">visibility</span>
                          <span className="text-[10px] uppercase font-bold">View Details</span>
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() => setVisitorFormView('create')}
                    className="border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center p-8 text-slate-400 hover:border-primary hover:text-primary transition-colors min-h-[200px]"
                  >
                    <span className="material-symbols-outlined text-4xl mb-2">add_circle</span>
                    <span className="font-bold uppercase tracking-widest text-sm">Create New Form</span>
                  </button>
                </div>
              )}

              {/* View: Form Details */}
              {visitorFormView === 'details' && selectedVisitorForm && (
                <div className="space-y-8 animate-in fade-in duration-300">
                  <button
                    onClick={() => { setVisitorFormView('list'); setSelectedVisitorForm(null); }}
                    className="flex items-center gap-2 text-slate-400 hover:text-slate-900 font-bold text-xs uppercase tracking-widest transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">arrow_back</span> Back to Forms
                  </button>

                  <div className="grid lg:grid-cols-3 gap-8">
                    {/* QR Code Panel */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 flex flex-col items-center text-center h-fit">
                      <h3 className="font-black text-xl text-slate-900 mb-2">{selectedVisitorForm.title}</h3>
                      <p className="text-sm text-slate-500 font-medium mb-8">{selectedVisitorForm.eventName}</p>

                      <div className="bg-white p-4 rounded-xl border-2 border-slate-900 mb-8">
                        <img
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(selectedVisitorForm.link)}`}
                          alt="QR Code"
                          className="w-48 h-48"
                        />
                      </div>

                      <button
                        onClick={() => downloadQRCode(`https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(selectedVisitorForm.link)}`, `${selectedVisitorForm.id}-qr.png`)}
                        className="w-full py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 mb-4"
                      >
                        <span className="material-symbols-outlined text-lg">download</span>
                        Download QR Code
                      </button>

                      <div className="w-full bg-slate-50 p-3 rounded-lg border border-slate-100 flex items-center justify-between gap-2">
                        <p className="text-xs text-slate-500 truncate font-mono">{selectedVisitorForm.link}</p>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(selectedVisitorForm.link);
                            // Visual feedback could be added here, e.g. toast
                            alert("Link copied to clipboard!");
                          }}
                          className="text-primary hover:text-primary/80"
                          title="Copy Link"
                        >
                          <span className="material-symbols-outlined text-sm">content_copy</span>
                        </button>
                      </div>

                      <button
                        onClick={() => {
                          onDeleteVisitorForm(selectedVisitorForm.id);
                          setSelectedVisitorForm(null);
                          setVisitorFormView('list');
                        }}
                        className="mt-6 text-red-500 text-xs font-bold uppercase tracking-widest hover:underline"
                      >
                        Delete Form
                      </button>
                    </div>

                    {/* Submissions Panel */}
                    <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                      <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                        <div>
                          <h4 className="font-black uppercase text-slate-900">Visitor Submissions</h4>
                          <p className="text-xs text-slate-500 font-medium mt-1">Total: {selectedVisitorForm.submissions.length}</p>
                        </div>
                        <button onClick={handleExportCSV} className="text-primary font-bold text-xs uppercase tracking-widest hover:underline flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">download</span> Export CSV
                        </button>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left">
                          <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                              <th className="p-4 text-xs font-black uppercase text-slate-500 tracking-widest">Name</th>
                              <th className="p-4 text-xs font-black uppercase text-slate-500 tracking-widest">Contact</th>
                              <th className="p-4 text-xs font-black uppercase text-slate-500 tracking-widest text-right">Time</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-50">
                            {selectedVisitorForm.submissions.length > 0 ? (
                              selectedVisitorForm.submissions
                                .slice((visitorSubmissionPage - 1) * VISITOR_SUBMISSIONS_PER_PAGE, visitorSubmissionPage * VISITOR_SUBMISSIONS_PER_PAGE)
                                .map((sub, i) => (
                                  <tr key={i} className="hover:bg-slate-50/50">
                                    <td className="p-4">
                                      <p className="font-bold text-slate-900 text-sm">{sub.name}</p>
                                    </td>
                                    <td className="p-4">
                                      <p className="text-sm text-slate-600">{sub.email}</p>
                                      <p className="text-xs text-slate-400 mt-0.5">{sub.phone}</p>
                                    </td>
                                    <td className="p-4 text-right">
                                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                                        {new Date(sub.submittedAt || Date.now()).toLocaleDateString()}
                                      </p>
                                    </td>
                                  </tr>
                                ))
                            ) : (
                              <tr>
                                <td colSpan={3} className="p-12 text-center text-slate-400 font-medium">
                                  No submissions yet. Share the QR code to get started!
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>


                      {selectedVisitorForm.submissions.length > VISITOR_SUBMISSIONS_PER_PAGE && (
                        <div className="p-4 border-t border-slate-50 flex items-center justify-between bg-white">
                          <p className="text-xs text-slate-500 font-bold">
                            Showing {(visitorSubmissionPage - 1) * VISITOR_SUBMISSIONS_PER_PAGE + 1} - {Math.min(visitorSubmissionPage * VISITOR_SUBMISSIONS_PER_PAGE, selectedVisitorForm.submissions.length)} of {selectedVisitorForm.submissions.length}
                          </p>
                          <div className="flex gap-2">
                            <button
                              disabled={visitorSubmissionPage === 1}
                              onClick={() => setVisitorSubmissionPage(p => p - 1)}
                              className="px-3 py-1 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Previous
                            </button>
                            <button
                              disabled={visitorSubmissionPage * VISITOR_SUBMISSIONS_PER_PAGE >= selectedVisitorForm.submissions.length}
                              onClick={() => setVisitorSubmissionPage(p => p + 1)}
                              className="px-3 py-1 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Next
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ----- BLOG MANAGER TAB ----- */}
          {
            activeTab === 'blogs' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                {/* Toolbar */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
                  <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
                    <button
                      onClick={() => setBlogView('list')}
                      className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${blogView === 'list' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      All Posts
                    </button>
                    <button
                      onClick={openAddBlog}
                      className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${blogView === 'form' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      Create New Post
                    </button>
                  </div>
                </div>

                {/* View: List */}
                {blogView === 'list' && (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {blogPosts.map(post => (
                      <div key={post.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col group">
                        <div className="h-48 overflow-hidden relative">
                          <img src={post.image} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt={post.title} />
                          <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-900">
                            {post.type}
                          </span>
                          <div className="absolute top-4 right-4 flex gap-2">
                            <button onClick={() => onDeleteBlog(post.id)} className="w-8 h-8 rounded-full bg-white text-red-500 flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                              <span className="material-symbols-outlined text-lg">delete</span>
                            </button>
                          </div>
                        </div>
                        <div className="p-6 flex-1 flex flex-col">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{post.date}</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{post.readTime}</span>
                          </div>
                          <h4 className="font-black uppercase text-lg mb-2 leading-tight line-clamp-2 text-primary">{post.title}</h4>
                          <p className="text-sm text-slate-600 line-clamp-2 mb-4 flex-1">{post.excerpt}</p>
                          <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-slate-100 overflow-hidden"><img src={`https://ui-avatars.com/api/?name=${post.author}&background=random`} alt={post.author} className="w-full h-full object-cover" /></div>
                              <span className="text-xs font-bold text-slate-600">{post.author}</span>
                            </div>
                            <button onClick={() => openEditBlog(post)} className="text-primary font-bold text-xs uppercase hover:underline">
                              Edit Post
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div
                      onClick={openAddBlog}
                      className="border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center p-8 text-slate-400 cursor-pointer hover:border-primary hover:text-primary transition-colors min-h-[300px]"
                    >
                      <span className="material-symbols-outlined text-4xl mb-2">add_circle</span>
                      <span className="font-bold uppercase tracking-widest text-sm">Create New Post</span>
                    </div>
                  </div>
                )}

                {/* View: Add/Edit Blog */}
                {blogView === 'form' && (
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 max-w-4xl mx-auto">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-2xl font-black uppercase text-slate-900">{editingBlogPost ? 'Edit Blog Post' : 'Create New Post'}</h3>
                      <button onClick={() => setBlogView('list')} className="text-slate-400 hover:text-slate-600"><span className="material-symbols-outlined">close</span></button>
                    </div>

                    <form onSubmit={handleBlogSubmit} className="space-y-8">
                      {/* Basic Info */}
                      <section className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-black uppercase tracking-widest text-slate-500">Post Title</label>
                          <input required type="text" value={blogForm.title} onChange={e => setBlogForm({ ...blogForm, title: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 font-bold focus:ring-primary focus:border-primary" placeholder="e.g. 5 Ways to Eat Oats" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-black uppercase tracking-widest text-slate-500">Category Type</label>
                          <select required value={blogForm.type} onChange={e => setBlogForm({ ...blogForm, type: e.target.value as any })} className="w-full px-4 py-3 rounded-xl border border-slate-200 font-bold focus:ring-primary focus:border-primary bg-white">
                            <option value="Recipe">Recipe</option>
                            <option value="Lifestyle">Lifestyle</option>
                            <option value="News">News</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-black uppercase tracking-widest text-slate-500">Author</label>
                          <input required type="text" value={blogForm.author} onChange={e => setBlogForm({ ...blogForm, author: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 font-bold focus:ring-primary focus:border-primary" placeholder="e.g. Chef Riya" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-black uppercase tracking-widest text-slate-500">Read Time</label>
                          <input required type="text" value={blogForm.readTime} onChange={e => setBlogForm({ ...blogForm, readTime: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 font-bold focus:ring-primary focus:border-primary" placeholder="e.g. 5 min read" />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                          <label className="text-xs font-black uppercase tracking-widest text-slate-500">Excerpt</label>
                          <textarea required value={blogForm.excerpt} onChange={e => setBlogForm({ ...blogForm, excerpt: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 font-bold focus:ring-primary focus:border-primary" rows={2} placeholder="Short summary for the card..." />
                        </div>
                      </section>

                      {/* Cover Image */}
                      <section className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-500">Cover Image</label>
                        <input type="file" accept="image/*" onChange={handleBlogImageUpload} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
                        {blogForm.image && <img src={blogForm.image} alt="Cover" className="h-48 rounded-xl object-cover mt-2 w-full" />}
                      </section>

                      {/* Content Editor */}
                      <section className="space-y-4 pt-6 border-t border-slate-100">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-black uppercase text-slate-800">Article Content</h4>
                          <span className="text-[10px] font-bold text-primary uppercase tracking-widest border border-primary/20 px-2 py-0.5 rounded">HTML Supported</span>
                        </div>
                        <p className="text-xs text-slate-500">Enter your article content. You can use HTML tags like &lt;h1&gt;, &lt;h2&gt;, &lt;p&gt;, and &lt;a&gt; for headings and links.</p>
                        <div className="flex flex-wrap gap-2 mb-2">
                          <button
                            type="button"
                            onClick={() => setBlogForm({ ...blogForm, content: (blogForm.content || '') + '\n<p>New paragraph here...</p>' })}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors border border-slate-200"
                          >
                            <span className="material-symbols-outlined text-sm">segment</span> Paragraph
                          </button>
                          <button
                            type="button"
                            onClick={() => setBlogForm({ ...blogForm, content: (blogForm.content || '') + '\n<h2>Heading 2</h2>' })}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors border border-slate-200"
                          >
                            <span className="material-symbols-outlined text-sm">title</span> Heading
                          </button>
                          <button
                            type="button"
                            onClick={() => setBlogForm({ ...blogForm, content: (blogForm.content || '') + '<strong>Bold Text</strong>' })}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors border border-slate-200"
                          >
                            <span className="material-symbols-outlined text-sm">format_bold</span> Bold
                          </button>
                          <button
                            type="button"
                            onClick={() => setBlogForm({ ...blogForm, content: (blogForm.content || '') + '<a href="https://example.com">Link Text</a>' })}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors border border-slate-200"
                          >
                            <span className="material-symbols-outlined text-sm">link</span> Link
                          </button>
                          <button
                            type="button"
                            onClick={() => setBlogForm({ ...blogForm, content: (blogForm.content || '') + '\n<img src="IMAGE_URL_HERE" alt="description" className="w-full rounded-2xl my-6" />' })}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors border border-slate-200"
                          >
                            <span className="material-symbols-outlined text-sm">image</span> Add Image
                          </button>
                        </div>
                        <div className="relative">
                          <textarea
                            placeholder="Write your article story here... Use HTML for headings and links!"
                            value={blogForm.content}
                            onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                            rows={15}
                            className="w-full px-4 py-4 rounded-xl border border-slate-200 text-slate-700 focus:ring-primary focus:border-primary font-mono text-sm leading-relaxed bg-slate-50/30"
                          />
                        </div>
                      </section>

                      <div className="pt-6 flex justify-end gap-4 border-t border-slate-100">
                        <button type="button" onClick={() => setBlogView('list')} className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-50">Cancel</button>
                        <button type="submit" className="px-8 py-3 rounded-xl bg-primary text-white font-black uppercase tracking-widest hover:shadow-lg transition-all">{editingBlogPost ? 'Update Post' : 'Publish Post'}</button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            )
          }

          {/* ----- EVENT MANAGER TAB (Keeping existing logic) ----- */}
          {
            activeTab === 'events' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                {/* Toolbar */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
                  <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
                    <button
                      onClick={() => setEventView('list')}
                      className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${eventView === 'list' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      All Events
                    </button>
                    <button
                      onClick={() => setEventView('add')}
                      className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${eventView === 'add' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      Add Event
                    </button>
                  </div>
                </div>

                {/* View: List */}
                {eventView === 'list' && (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.map(event => (
                      <div key={event.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                        <div className="h-48 overflow-hidden relative">
                          <img src={event.image} className="w-full h-full object-cover" alt={event.title} />
                          <div className="absolute top-4 right-4 flex gap-2">
                            <button onClick={() => onDeleteEvent(event.id)} className="w-8 h-8 rounded-full bg-white text-red-500 flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                              <span className="material-symbols-outlined text-lg">delete</span>
                            </button>
                          </div>
                        </div>
                        <div className="p-6 flex-1 flex flex-col">
                          <h4 className="font-black uppercase text-lg mb-2 leading-tight">{event.title}</h4>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">{event.date} • {event.location}</p>
                          <p className="text-sm text-slate-600 line-clamp-2 mb-4 flex-1">{event.summary}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Tagged Products:</span>
                            <div className="flex -space-x-2">
                              {event.featuredProducts.map((pid, idx) => (
                                <div key={idx} className="w-6 h-6 rounded-full bg-slate-200 border-2 border-white overflow-hidden">
                                  {/* Just a placeholder visually, would match ID in real app */}
                                  <div className="w-full h-full bg-primary/20"></div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div
                      onClick={() => setEventView('add')}
                      className="border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center p-8 text-slate-400 cursor-pointer hover:border-primary hover:text-primary transition-colors min-h-[300px]"
                    >
                      <span className="material-symbols-outlined text-4xl mb-2">add_circle</span>
                      <span className="font-bold uppercase tracking-widest text-sm">Create New Event</span>
                    </div>
                  </div>
                )}

                {/* View: Add Event */}
                {eventView === 'add' && (
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 max-w-4xl mx-auto">
                    <h3 className="text-2xl font-black uppercase text-slate-900 mb-6">Create New Event Story</h3>
                    <form onSubmit={handleEventSubmit} className="space-y-8">
                      {/* Basic Info */}
                      <section className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-500">Event Title</label>
                            <input required type="text" value={eventForm.title} onChange={e => setEventForm({ ...eventForm, title: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 font-bold focus:ring-primary focus:border-primary" placeholder="e.g. Morning Yoga Session" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-500">Date</label>
                            <input required type="text" value={eventForm.date} onChange={e => setEventForm({ ...eventForm, date: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 font-bold focus:ring-primary focus:border-primary" placeholder="e.g. Nov 12, 2023" />
                          </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-500">Location</label>
                            <input required type="text" value={eventForm.location} onChange={e => setEventForm({ ...eventForm, location: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 font-bold focus:ring-primary focus:border-primary" placeholder="e.g. Cubbon Park, Bangalore" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-black uppercase tracking-widest text-slate-500">Summary</label>
                          <textarea required value={eventForm.summary} onChange={e => setEventForm({ ...eventForm, summary: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 font-bold focus:ring-primary focus:border-primary" rows={2} placeholder="Short description for the card..." />
                        </div>
                      </section>

                      {/* Story Editor */}
                      <section className="space-y-4 pt-6 border-t border-slate-100">
                        <h4 className="text-sm font-black uppercase text-slate-800">Full Story Content</h4>
                        {eventForm.fullStory?.map((section, idx) => (
                          <div key={idx} className="p-4 bg-slate-50 rounded-xl space-y-3 relative group">
                            <button type="button" onClick={() => {
                              const newStory = eventForm.fullStory?.filter((_, i) => i !== idx);
                              setEventForm(prev => ({ ...prev, fullStory: newStory }));
                            }} className="absolute top-2 right-2 text-slate-400 hover:text-red-500"><span className="material-symbols-outlined">close</span></button>

                            <input type="text" placeholder="Section Heading" value={section.heading} onChange={(e) => updateStorySection(idx, 'heading', e.target.value)} className="w-full bg-white px-3 py-2 rounded-lg border border-slate-200 font-bold text-sm" />
                            <textarea placeholder="Section Content paragraph..." value={section.content} onChange={(e) => updateStorySection(idx, 'content', e.target.value)} rows={3} className="w-full bg-white px-3 py-2 rounded-lg border border-slate-200 text-sm" />
                          </div>
                        ))}
                        <button type="button" onClick={addStorySection} className="text-primary font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:underline">
                          <span className="material-symbols-outlined text-sm">add</span> Add Story Section
                        </button>
                      </section>

                      {/* Images */}
                      <section className="space-y-4 pt-6 border-t border-slate-100">
                        <h4 className="text-sm font-black uppercase text-slate-800">Media</h4>
                        <div className="grid md:grid-cols-2 gap-8">
                          <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-500">Cover Image</label>
                            <input type="file" accept="image/*" onChange={(e) => handleEventImageUpload(e, 'cover')} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
                            {eventForm.image && <img src={eventForm.image} alt="Cover" className="h-32 rounded-lg object-cover mt-2" />}
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-500">Gallery Images</label>
                            <input type="file" multiple accept="image/*" onChange={(e) => handleEventImageUpload(e, 'gallery')} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
                            <div className="flex flex-wrap gap-2 mt-2">
                              {eventForm.gallery?.map((img, i) => (
                                <div key={i} className="w-16 h-16 relative">
                                  <img src={img} className="w-full h-full object-cover rounded-lg" />
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </section>

                      {/* Product Linker */}
                      <section className="space-y-4 pt-6 border-t border-slate-100">
                        <h4 className="text-sm font-black uppercase text-slate-800">Featured Products</h4>
                        <p className="text-xs text-slate-500">Select products that were part of this event.</p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {products.map(p => (
                            <div
                              key={p.id}
                              onClick={() => toggleFeaturedProduct(p.id)}
                              className={`p-3 rounded-lg border-2 cursor-pointer transition-all flex items-center gap-3 ${eventForm.featuredProducts?.includes(p.id) ? 'border-primary bg-primary/5' : 'border-slate-100 hover:border-slate-300'}`}
                            >
                              <div className="w-8 h-8 rounded bg-white overflow-hidden flex-shrink-0"><img src={p.image} className="w-full h-full object-cover" /></div>
                              <span className="text-xs font-bold line-clamp-1">{p.name}</span>
                              {eventForm.featuredProducts?.includes(p.id) && <span className="ml-auto material-symbols-outlined text-primary text-sm">check_circle</span>}
                            </div>
                          ))}
                        </div>
                      </section>

                      <div className="pt-6 flex justify-end gap-4">
                        <button type="button" onClick={() => setEventView('list')} className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-50">Cancel</button>
                        <button type="submit" className="px-8 py-3 rounded-xl bg-primary text-white font-black uppercase tracking-widest hover:shadow-lg transition-all">Publish Story</button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            )
          }

          {/* ----- PRODUCT TAB (Keeping existing logic) ----- */}
          {
            activeTab === 'products' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                {/* Toolbar */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
                  <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
                    <button
                      onClick={() => setProductView('list')}
                      className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${productView === 'list' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      Product List
                    </button>
                    <button
                      onClick={() => setProductView('add')}
                      className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${productView === 'add' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      Add Product
                    </button>
                    <button
                      onClick={() => setProductView('categories')}
                      className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${productView === 'categories' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      Categories
                    </button>
                  </div>
                  {productView === 'list' && (
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined text-lg">search</span>
                      <input type="text" placeholder="Search inventory..." className="pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-sm font-bold focus:ring-primary focus:border-primary w-64" />
                    </div>
                  )}
                </div>

                {/* View: Product List */}
                {productView === 'list' && (
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                          <th className="p-4 text-xs font-black uppercase text-slate-500 tracking-widest">Product</th>
                          <th className="p-4 text-xs font-black uppercase text-slate-500 tracking-widest">Category</th>
                          <th className="p-4 text-xs font-black uppercase text-slate-500 tracking-widest">Price</th>
                          <th className="p-4 text-xs font-black uppercase text-slate-500 tracking-widest">Stock Level</th>
                          <th className="p-4 text-xs font-black uppercase text-slate-500 tracking-widest text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {products.map(product => (
                          <tr key={product.id} className="hover:bg-slate-50/50 transition-colors group">
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0">
                                  <img src={product.image} className="w-full h-full object-cover" alt={product.name} />
                                </div>
                                <div>
                                  <p className="font-bold text-slate-900 text-sm">{product.name}</p>
                                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">ID: {product.id.slice(-4)}</p>
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              <span className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-black uppercase text-slate-600 tracking-wider">
                                {product.category}
                              </span>
                            </td>
                            <td className="p-4">
                              <span className="font-bold text-slate-700">₹{product.price}</span>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <button onClick={() => handleStockUpdate(product, product.stock - 1)} className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center hover:bg-slate-200 text-slate-600">-</button>
                                <span className={`w-12 text-center font-bold text-sm ${product.stock < 10 ? 'text-red-500' : 'text-slate-700'}`}>
                                  {product.stock}
                                </span>
                                <button onClick={() => handleStockUpdate(product, product.stock + 1)} className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center hover:bg-slate-200 text-slate-600">+</button>
                                {product.stock < 10 && <span className="text-[10px] text-red-500 font-bold uppercase ml-2">Low</span>}
                              </div>
                            </td>
                            <td className="p-4 text-right">
                              <button
                                onClick={() => onDeleteProduct(product.id)}
                                className="text-slate-400 hover:text-red-500 transition-colors p-2"
                              >
                                <span className="material-symbols-outlined text-lg">delete</span>
                              </button>
                              <button
                                onClick={() => openEditProduct(product)}
                                className="text-slate-400 hover:text-primary transition-colors p-2"
                              >
                                <span className="material-symbols-outlined text-lg">edit</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {products.length === 0 && (
                      <div className="p-12 text-center">
                        <p className="text-slate-400 font-medium">No products found. Add one to get started!</p>
                      </div>
                    )}
                  </div>
                )}

                {/* View: Add Product */}
                {productView === 'add' && (
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 max-w-3xl mx-auto">
                    <h3 className="text-2xl font-black uppercase text-slate-900 mb-6">
                      {editingProduct ? 'Edit Product' : 'Add New Product'}
                    </h3>
                    <form onSubmit={handleProductSubmit} className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-500">Product Name</label>
                        <input required type="text" value={productForm.name} onChange={e => setProductForm({ ...productForm, name: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 font-bold focus:ring-primary focus:border-primary" placeholder="e.g. Super Oats" />
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-black uppercase tracking-widest text-slate-500">Actual Rate (₹) <span className="text-[10px] text-slate-400 font-bold">(M.R.P)</span></label>
                          <input required type="number" value={productForm.originalPrice} onChange={e => setProductForm({ ...productForm, originalPrice: Number(e.target.value) })} className="w-full px-4 py-3 rounded-xl border border-slate-200 font-bold focus:ring-primary focus:border-primary" placeholder="699" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-black uppercase tracking-widest text-slate-500">Discounted Rate (₹) <span className="text-[10px] text-primary font-bold">(Selling Price)</span></label>
                          <input required type="number" value={productForm.price} onChange={e => setProductForm({ ...productForm, price: Number(e.target.value) })} className="w-full px-4 py-3 rounded-xl border border-slate-200 font-bold focus:ring-primary focus:border-primary" placeholder="499" />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-black uppercase tracking-widest text-slate-500">Category</label>
                          <select required value={productForm.category} onChange={e => setProductForm({ ...productForm, category: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 font-bold focus:ring-primary focus:border-primary bg-white">
                            <option value="">Select Category...</option>
                            {categories.map(c => <option key={c.id || c.name} value={c.name}>{c.name}</option>)}
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-black uppercase tracking-widest text-slate-500">Initial Stock</label>
                          <input required type="number" value={productForm.stock} onChange={e => setProductForm({ ...productForm, stock: Number(e.target.value) })} className="w-full px-4 py-3 rounded-xl border border-slate-200 font-bold focus:ring-primary focus:border-primary" placeholder="100" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-500">Description</label>
                        <textarea required value={productForm.description} onChange={e => setProductForm({ ...productForm, description: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 font-bold focus:ring-primary focus:border-primary" rows={4} placeholder="Product details..." />
                      </div>

                      {/* Product Benefits Section */}
                      <div className="space-y-4 border-t border-slate-100 pt-6">
                        <div className="flex justify-between items-center">
                          <h4 className="text-sm font-black uppercase tracking-widest text-slate-900 border-l-4 border-primary pl-3">Key Benefits</h4>
                          <button type="button" onClick={addBenefit} className="text-primary font-bold text-xs uppercase tracking-widest flex items-center gap-1 hover:underline">
                            <span className="material-symbols-outlined text-sm">add</span> Add Benefit
                          </button>
                        </div>
                        <div className="grid gap-3">
                          {productForm.benefits?.map((benefit, idx) => (
                            <div key={idx} className="flex gap-2 animate-in fade-in slide-in-from-left-2 duration-200">
                              <input
                                type="text"
                                value={benefit}
                                onChange={(e) => updateBenefit(idx, e.target.value)}
                                className="flex-1 px-4 py-3 rounded-xl border border-slate-200 font-bold text-sm focus:ring-primary focus:border-primary"
                                placeholder="e.g. 27g Protein per 100g 💪"
                              />
                              <button
                                type="button"
                                onClick={() => removeBenefit(idx)}
                                className="w-12 rounded-xl bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-red-50 flex items-center justify-center transition-all"
                              >
                                <span className="material-symbols-outlined text-lg">delete</span>
                              </button>
                            </div>
                          ))}
                          {(productForm.benefits?.length === 0) && (
                            <p className="text-xs text-slate-400 italic">No benefits added yet. Click "Add Benefit" to start listing product highlights.</p>
                          )}
                        </div>
                      </div>

                      {/* Nutrition & Ingredients Section */}
                      <div className="space-y-6 border-t border-slate-100 pt-6">
                        <h4 className="text-sm font-black uppercase tracking-widest text-slate-900 border-l-4 border-primary pl-3">Nutrition & Ingredients</h4>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Calories (kcal)</label>
                            <input type="text" value={productForm.nutrition?.calories} onChange={e => setProductForm({ ...productForm, nutrition: { ...productForm.nutrition!, calories: e.target.value } })} className="w-full px-3 py-2 rounded-lg border border-slate-200 font-bold text-sm focus:ring-primary focus:border-primary" placeholder="450" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Protein (gm)</label>
                            <input type="text" value={productForm.nutrition?.protein} onChange={e => setProductForm({ ...productForm, nutrition: { ...productForm.nutrition!, protein: e.target.value } })} className="w-full px-3 py-2 rounded-lg border border-slate-200 font-bold text-sm focus:ring-primary focus:border-primary" placeholder="24" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Carbs (gm)</label>
                            <input type="text" value={productForm.nutrition?.carbs} onChange={e => setProductForm({ ...productForm, nutrition: { ...productForm.nutrition!, carbs: e.target.value } })} className="w-full px-3 py-2 rounded-lg border border-slate-200 font-bold text-sm focus:ring-primary focus:border-primary" placeholder="12" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Fat (gm)</label>
                            <input type="text" value={productForm.nutrition?.fat} onChange={e => setProductForm({ ...productForm, nutrition: { ...productForm.nutrition!, fat: e.target.value } })} className="w-full px-3 py-2 rounded-lg border border-slate-200 font-bold text-sm focus:ring-primary focus:border-primary" placeholder="18" />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-black uppercase tracking-widest text-slate-500">Full Ingredients</label>
                          <textarea value={productForm.ingredients} onChange={e => setProductForm({ ...productForm, ingredients: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 font-bold focus:ring-primary focus:border-primary" rows={3} placeholder="Peanuts, Sea Salt, etc..." />
                        </div>
                      </div>

                      {/* Image Upload Section */}
                      <div className="space-y-6 border-t border-slate-100 pt-6">
                        <div className="space-y-2">
                          <label className="text-xs font-black uppercase tracking-widest text-slate-500">Featured Image</label>
                          <div className="flex items-center gap-4">
                            <label className="cursor-pointer bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl px-4 py-3 hover:bg-slate-100 hover:border-primary transition-all">
                              <span className="text-sm font-bold text-slate-500 flex items-center gap-2">
                                <span className="material-symbols-outlined">cloud_upload</span>
                                Upload Main Image
                              </span>
                              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleProductImageUpload(e, 'featured')} />
                            </label>
                            {productForm.image && (
                              <div className="w-16 h-16 rounded-lg overflow-hidden border border-slate-200 shadow-sm relative group">
                                <img src={productForm.image} alt="Preview" className="w-full h-full object-cover" />
                                <button
                                  type="button"
                                  onClick={() => setProductForm({ ...productForm, image: '' })}
                                  className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <span className="material-symbols-outlined text-white">close</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-black uppercase tracking-widest text-slate-500">Gallery Images</label>
                          <div className="flex items-center gap-4 flex-wrap">
                            <label className="cursor-pointer bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl px-4 py-3 hover:bg-slate-100 hover:border-primary transition-all">
                              <span className="text-sm font-bold text-slate-500 flex items-center gap-2">
                                <span className="material-symbols-outlined">add_photo_alternate</span>
                                Add More Images
                              </span>
                              <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleProductImageUpload(e, 'gallery')} />
                            </label>
                            {productForm.gallery && productForm.gallery.map((img, idx) => (
                              <div key={idx} className="w-16 h-16 rounded-lg overflow-hidden border border-slate-200 shadow-sm relative group">
                                <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                                <button
                                  type="button"
                                  onClick={() => setProductForm(prev => ({ ...prev, gallery: prev.gallery?.filter((_, i) => i !== idx) }))}
                                  className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <span className="material-symbols-outlined text-white">close</span>
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* 3D Model & Aesthetics Section */}
                        <div className="space-y-6 border-t border-slate-100 pt-6">
                          <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <label className="text-xs font-black uppercase tracking-widest text-slate-500">Theme Color</label>
                              <div className="flex items-center gap-3">
                                <input
                                  type="color"
                                  value={productForm.themeColor || '#FF6F00'}
                                  onChange={e => setProductForm({ ...productForm, themeColor: e.target.value })}
                                  className="w-12 h-12 rounded-lg border-0 p-0 cursor-pointer overflow-hidden"
                                />
                                <input
                                  type="text"
                                  value={productForm.themeColor || '#FF6F00'}
                                  onChange={e => setProductForm({ ...productForm, themeColor: e.target.value })}
                                  className="flex-1 px-4 py-3 rounded-xl border border-slate-200 font-bold focus:ring-primary focus:border-primary text-sm uppercase"
                                  placeholder="#FF6F00"
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs font-black uppercase tracking-widest text-slate-500">3D Orientation</label>
                              <div className="relative">
                                <input
                                  type="text"
                                  value={productForm.orientation}
                                  onChange={e => setProductForm({ ...productForm, orientation: e.target.value })}
                                  onBlur={e => {
                                    const fixed = e.target.value.replace(/O/g, '0').replace(/o/g, '0').trim();
                                    setProductForm({ ...productForm, orientation: fixed });
                                  }}
                                  className="w-full px-4 py-3 rounded-xl border border-slate-200 font-mono focus:ring-primary focus:border-primary text-sm bg-slate-50/50"
                                  placeholder="0deg 0deg 0deg"
                                />
                                <p className="text-[10px] text-slate-400 mt-1 ml-1 font-medium italic">Format: Xdeg Ydeg Zdeg (e.g., 0deg 0deg -15deg)</p>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-500">3D Model (.glb)</label>
                            <div className="flex items-center gap-4">
                              <label className="cursor-pointer bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl px-4 py-3 hover:bg-slate-100 hover:border-primary transition-all">
                                <span className="text-sm font-bold text-slate-500 flex items-center gap-2">
                                  <span className="material-symbols-outlined">view_in_ar</span>
                                  {productForm.model3d ? 'Change 3D Model' : 'Upload 3D Model'}
                                </span>
                                <input type="file" accept=".glb,.gltf" className="hidden" onChange={handleProductModel3DUpload} />
                              </label>
                              {productForm.model3d && (
                                <div className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-600 rounded-lg border border-green-100">
                                  <span className="material-symbols-outlined text-sm">check_circle</span>
                                  <span className="text-xs font-bold uppercase">Model Uploaded</span>
                                  <button type="button" onClick={() => setProductForm({ ...productForm, model3d: '' })} className="hover:text-red-500 ml-1">
                                    <span className="material-symbols-outlined text-sm">close</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 flex justify-end gap-4">
                        <button type="button" onClick={() => setProductView('list')} className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-50">Cancel</button>
                        <button type="submit" className="px-8 py-3 rounded-xl bg-primary text-white font-black uppercase tracking-widest hover:shadow-lg transition-all">
                          {editingProduct ? 'Update Product' : 'Create Product'}
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* View: Categories */}
                {productView === 'categories' && (
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 max-w-2xl mx-auto">
                    <h3 className="text-2xl font-black uppercase text-slate-900 mb-6">Manage Categories</h3>

                    <div className="flex gap-4 mb-8">
                      <input
                        type="text"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        placeholder="New Category Name"
                        className="flex-1 px-4 py-3 rounded-xl border border-slate-200 font-bold focus:ring-primary focus:border-primary"
                      />
                      <button
                        onClick={() => {
                          if (newCategory) {
                            onAddCategory({ name: newCategory, image: '' }); // Pass object
                            setNewCategory('');
                          }
                        }}
                        className="px-6 py-3 bg-slate-900 text-white rounded-xl font-black uppercase"
                      >
                        Add
                      </button>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2 block">Active Categories</label>
                      <div className="flex flex-wrap gap-3">
                        {categories.map(c => (
                          <div key={c.id || c.name} className="px-4 py-2 bg-slate-50 rounded-lg border border-slate-200 flex items-center gap-2">
                            <span className="font-bold text-slate-700">{c.name}</span>
                            <button
                              onClick={() => {
                                setDeleteCategoryModal({ isOpen: true, categoryId: c.id! });
                              }}
                              className="text-slate-400 hover:text-red-500"
                            >
                              <span className="material-symbols-outlined text-sm">close</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          }

          {/* ----- ORDERS TAB ----- */}
          {
            activeTab === 'orders' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="grid md:grid-cols-4 gap-6">
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <p className="text-xs font-black uppercase tracking-widest text-slate-400">Total Orders</p>
                    <p className="text-3xl font-black text-slate-900 mt-2">{orders.length}</p>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <p className="text-xs font-black uppercase tracking-widest text-slate-400">Pending</p>
                    <p className="text-3xl font-black text-orange-500 mt-2">{orders.filter(o => o.status === 'Pending' || o.status === 'Processing').length}</p>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <p className="text-xs font-black uppercase tracking-widest text-slate-400">Shipped</p>
                    <p className="text-3xl font-black text-blue-500 mt-2">{orders.filter(o => o.status === 'Shipped').length}</p>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <p className="text-xs font-black uppercase tracking-widest text-slate-400">Total Revenue</p>
                    <p className="text-3xl font-black text-green-500 mt-2">₹{orders.reduce((acc, curr) => acc + (curr.status !== 'Cancelled' ? Number(curr.total_amount) : 0), 0).toLocaleString()}</p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="p-6 border-b border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
                    <h3 className="font-black uppercase text-slate-900">Recent Transactions</h3>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined text-lg">search</span>
                      <input
                        type="text"
                        placeholder="Search orders..."
                        value={orderSearchQuery}
                        onChange={(e) => setOrderSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-sm font-bold focus:ring-primary focus:border-primary w-64"
                      />
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                          <th className="p-4 text-xs font-black uppercase text-slate-500 tracking-widest">Order ID</th>
                          <th className="p-4 text-xs font-black uppercase text-slate-500 tracking-widest">Customer</th>
                          <th className="p-4 text-xs font-black uppercase text-slate-500 tracking-widest">Date</th>
                          <th className="p-4 text-xs font-black uppercase text-slate-500 tracking-widest">Status</th>
                          <th className="p-4 text-xs font-black uppercase text-slate-500 tracking-widest">Total</th>
                          <th className="p-4 text-xs font-black uppercase text-slate-500 tracking-widest text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredOrders.map(order => (
                          <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                            <td className="p-4 font-bold text-slate-900">#{order.id}</td>
                            <td className="p-4">
                              <div className="font-bold text-slate-700">{order.user_name}</div>
                              <div className="text-xs text-slate-400">{order.items.length} Items</div>
                            </td>
                            <td className="p-4 text-sm font-medium text-slate-600">{new Date(order.created_at).toLocaleDateString()}</td>
                            <td className="p-4">
                              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${order.status === 'Delivered' ? 'bg-green-100 text-green-600' :
                                order.status === 'Processing' ? 'bg-blue-100 text-blue-600' :
                                  order.status === 'Shipped' ? 'bg-purple-100 text-purple-600' :
                                    order.status === 'Pending' ? 'bg-orange-100 text-orange-600' :
                                      'bg-red-100 text-red-600'
                                }`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="p-4 font-black text-slate-800">₹{order.total_amount}</td>
                            <td className="p-4 text-right">
                              <button
                                onClick={() => setViewingOrder(order)}
                                className="text-slate-400 hover:text-primary transition-colors p-2 rounded-full hover:bg-slate-100"
                                title="View Details"
                              >
                                <span className="material-symbols-outlined">visibility</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                        {filteredOrders.length === 0 && (
                          <tr>
                            <td colSpan={6} className="p-8 text-center text-slate-400 font-bold">
                              No orders found matching "{orderSearchQuery}"
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )
          }

          {
            activeTab === 'overview' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Stats Grid */}
                <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
                  {[
                    { 
                      label: 'Total Revenue', 
                      value: `₹${orders.reduce((acc, curr) => acc + (curr.status !== 'Cancelled' ? Number(curr.total_amount) : 0), 0).toLocaleString('en-IN')}`, 
                      change: `${orders.length} Orders`, 
                      icon: 'payments', 
                      color: 'bg-green-100 text-green-600' 
                    },
                    { 
                      label: 'Total SKUs', 
                      value: products.length.toString(), 
                      change: 'Active', 
                      icon: 'inventory_2', 
                      color: 'bg-blue-100 text-blue-600' 
                    },
                    { 
                      label: 'Low Stock Items', 
                      value: products.filter(p => p.stock < 10).length.toString(), 
                      change: products.filter(p => p.stock < 10).length > 0 ? '- Action Needed' : 'Healthy', 
                      icon: 'warning', 
                      color: products.filter(p => p.stock < 10).length > 0 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600' 
                    },
                    { 
                      label: 'Total Events', 
                      value: events.length.toString(), 
                      change: events.length > 0 ? 'Upcoming' : 'None', 
                      icon: 'event', 
                      color: 'bg-purple-100 text-purple-600' 
                    },
                  ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                          <span className="material-symbols-outlined">{stat.icon}</span>
                        </div>
                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.change.startsWith('+') || stat.change === 'Healthy' || stat.change === 'Active' || stat.change === 'Total' || stat.change.includes('Orders') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                          {stat.change}
                        </span>
                      </div>
                      <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{stat.label}</p>
                      <p className="text-3xl font-black text-slate-900 mt-1">{stat.value}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 flex items-start gap-4">
                  <span className="material-symbols-outlined text-blue-600">info</span>
                  <div>
                    <h4 className="font-bold text-blue-900">System Overview</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      You are currently managing {products.length} products across {categories.length} categories. {orders.filter(o => o.status === 'Pending').length} orders are awaiting processing.
                    </p>
                  </div>
                </div>
              </div>
            )
          }

          {/* ----- ANNOUNCEMENTS TAB ----- */}
          {
            activeTab === 'announcements' && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
                  <h3 className="text-xl font-black uppercase text-slate-900 mb-6">
                    {isEditingAnnouncement ? 'Edit Announcement' : 'Post New Announcement'}
                  </h3>
                  <form onSubmit={handleAnnouncementSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-500">Announcement Message</label>
                      <textarea
                        required
                        value={announcementForm.message}
                        onChange={e => setAnnouncementForm({ ...announcementForm, message: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 font-bold focus:ring-primary focus:border-primary"
                        rows={2}
                        placeholder="e.g. Free shipping on orders over ₹999!"
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-500">Start Date</label>
                        <input
                          required
                          type="date"
                          value={announcementForm.start_date}
                          onChange={e => setAnnouncementForm({ ...announcementForm, start_date: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 font-bold focus:ring-primary focus:border-primary bg-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-500">End Date</label>
                        <input
                          required
                          type="date"
                          value={announcementForm.end_date}
                          onChange={e => setAnnouncementForm({ ...announcementForm, end_date: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 font-bold focus:ring-primary focus:border-primary bg-white"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="is_active"
                        checked={announcementForm.is_active}
                        onChange={e => setAnnouncementForm({ ...announcementForm, is_active: e.target.checked })}
                        className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary"
                      />
                      <label htmlFor="is_active" className="text-sm font-bold text-slate-700">Display this announcement</label>
                    </div>
                    <div className="flex gap-4">
                      <button type="submit" className="flex-1 bg-slate-900 text-white py-3 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-primary transition-all">
                        {isEditingAnnouncement ? 'Update Message' : 'Post Announcement'}
                      </button>
                      {isEditingAnnouncement && (
                        <button
                          type="button"
                          onClick={() => {
                            setIsEditingAnnouncement(false);
                            setAnnouncementForm({
                              message: '',
                              start_date: new Date().toISOString().split('T')[0],
                              end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                              is_active: true
                            });
                          }}
                          className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-50"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-black uppercase text-slate-800 px-2 tracking-[0.1em]">Announcement History</h4>
                  <div className="grid gap-4">
                    {announcements.map(a => (
                      <div key={a.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between group hover:border-primary transition-all">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className={`w-2 h-2 rounded-full ${a.is_active ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-slate-300'}`}></span>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                              {new Date(a.start_date).toLocaleDateString()} - {new Date(a.end_date).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="font-bold text-slate-800">{a.message}</p>
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => startEditAnnouncement(a)}
                            className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-primary hover:text-white transition-all"
                          >
                            <span className="material-symbols-outlined text-lg">edit</span>
                          </button>
                          <button
                            onClick={() => onDeleteAnnouncement(a.id)}
                            className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
                          >
                            <span className="material-symbols-outlined text-lg">delete</span>
                          </button>
                        </div>
                      </div>
                    ))}
                    {announcements.length === 0 && (
                      <div className="text-center py-12 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 text-slate-400">
                        <span className="material-symbols-outlined text-4xl mb-2 opacity-20">campaign</span>
                        <p className="font-bold uppercase tracking-widest text-xs">No announcements yet</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          }

          {
            activeTab !== 'overview' && activeTab !== 'products' && activeTab !== 'events' && activeTab !== 'orders' && activeTab !== 'ui-settings' && activeTab !== 'visitor-forms' && activeTab !== 'blogs' && activeTab !== 'announcements' && activeTab !== 'distributors' && (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
                <span className="material-symbols-outlined text-6xl opacity-20">construction</span>
                <p className="font-handdrawn text-2xl">This module is under construction</p>
              </div>
            )
          }

        </div>
      </main >

      {/* Slide Edit/Add Modal */}
      {
        isSlideModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={closeSlideModal} />
            <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl relative z-10 p-8 animate-in zoom-in duration-300 max-h-[90vh] overflow-y-auto custom-scroll">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-black uppercase text-slate-900">{editingSlide ? 'Edit Slide' : 'Add New Slide'}</h3>
                <button onClick={closeSlideModal} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200"><span className="material-symbols-outlined">close</span></button>
              </div>

              <form onSubmit={handleSlideSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500">Category Label</label>
                  <input required type="text" value={slideForm.category} onChange={e => setSlideForm({ ...slideForm, category: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 font-bold focus:ring-primary focus:border-primary" placeholder="e.g. SUPER MUESLI" />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500">Headline</label>
                  <input required type="text" value={slideForm.headline} onChange={e => setSlideForm({ ...slideForm, headline: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 font-bold focus:ring-primary focus:border-primary" placeholder="e.g. Crunchy Coffee Madness" />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500">Description</label>
                  <textarea required value={slideForm.description} onChange={e => setSlideForm({ ...slideForm, description: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 font-bold focus:ring-primary focus:border-primary" rows={3} placeholder="Short description..." />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-500">CTA Button Text</label>
                    <input required type="text" value={slideForm.cta} onChange={e => setSlideForm({ ...slideForm, cta: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 font-bold focus:ring-primary focus:border-primary" placeholder="SHOP NOW" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-500">Status</label>
                    <select value={slideForm.isActive ? 'active' : 'inactive'} onChange={e => setSlideForm({ ...slideForm, isActive: e.target.value === 'active' })} className="w-full px-4 py-3 rounded-xl border border-slate-200 font-bold focus:ring-primary focus:border-primary bg-white">
                      <option value="active">Published (Active)</option>
                      <option value="inactive">Draft (Inactive)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500">Color Theme</label>
                  <div className="flex flex-wrap gap-2">
                    {COLOR_THEMES.map(theme => (
                      <button
                        key={theme.name}
                        type="button"
                        onClick={() => setSlideForm(prev => ({ ...prev, bgColor: theme.bgColor, accentColor: theme.accentColor, blobColor: theme.blobColor }))}
                        className={`px-3 py-2 rounded-lg border-2 text-xs font-bold uppercase transition-all flex items-center gap-2 ${slideForm.bgColor === theme.bgColor ? 'border-primary bg-primary/5 text-primary' : 'border-slate-100 hover:border-slate-300 text-slate-500'}`}
                      >
                        <span className={`w-3 h-3 rounded-full ${theme.bgColor.replace('bg-', 'bg-')}`}></span>
                        {theme.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500">Slide Image</label>
                  <input type="file" accept="image/*" onChange={handleSlideImageUpload} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
                  {slideForm.image && (
                    <div className="mt-2 h-32 w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                      <img src={slideForm.image} alt="Preview" className="w-full h-full object-contain" />
                    </div>
                  )}
                </div>

                <div className="pt-4 flex justify-end gap-4 border-t border-slate-100 mt-6">
                  <button type="button" onClick={closeSlideModal} className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-50">Cancel</button>
                  <button type="submit" className="px-8 py-3 rounded-xl bg-primary text-white font-black uppercase tracking-widest hover:shadow-lg transition-all">Save Slide</button>
                </div>
              </form>
            </div>
          </div>
        )
      }

      {/* Order Details Modal */}
      {
        viewingOrder && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setViewingOrder(null)} />
            <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in duration-300">
              {/* Modal Header */}
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-black uppercase text-slate-900">Order Details</h3>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${viewingOrder.status === 'Delivered' ? 'bg-green-100 text-green-600' :
                      viewingOrder.status === 'Processing' ? 'bg-blue-100 text-blue-600' :
                        viewingOrder.status === 'Shipped' ? 'bg-purple-100 text-purple-600' :
                          viewingOrder.status === 'Pending' ? 'bg-orange-100 text-orange-600' :
                            'bg-red-100 text-red-600'
                      }`}>
                      {viewingOrder.status}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-slate-500 mt-1">Order #{viewingOrder.id} • Placed on {new Date(viewingOrder.created_at).toLocaleDateString()}</p>
                </div>
                <button
                  onClick={() => setViewingOrder(null)}
                  className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">close</span>
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-8 overflow-y-auto custom-scroll space-y-8">

                {/* Key Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Total Amount</p>
                    <p className="text-xl font-black text-primary">₹{viewingOrder.total_amount.toLocaleString()}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Payment Status</p>
                    <p className={`text-sm font-black uppercase ${viewingOrder.razorpay_payment_id ? 'text-green-600' : 'text-orange-500'}`}>{viewingOrder.razorpay_payment_id ? 'Paid' : 'Pending'}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Total Items</p>
                    <p className="text-xl font-black text-slate-900">{viewingOrder.items.length}</p>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-bold text-sm uppercase text-slate-900 mb-4 flex items-center gap-2">
                      <span className="material-symbols-outlined text-slate-400">person</span> Customer
                    </h4>
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Customer</p>
                      <p className="font-bold text-slate-900">
                        {viewingOrder.first_name || viewingOrder.last_name
                          ? `${viewingOrder.first_name || ''} ${viewingOrder.last_name || ''}`.trim()
                          : viewingOrder.user_name || 'Guest'}
                      </p>
                      <p className="text-sm text-slate-500">{viewingOrder.user_email}</p>
                      {viewingOrder.phone && (
                        <p className="text-sm text-slate-600 flex items-center gap-1 font-semibold">
                          <span className="material-symbols-outlined text-xs text-primary">call</span>
                          Phone: {viewingOrder.phone}
                        </p>
                      )}
                      {(viewingOrder.address || viewingOrder.city) && (
                        <p className="text-sm text-slate-500 flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs text-slate-400">location_on</span>
                          {viewingOrder.address || `${viewingOrder.city}, ${viewingOrder.state} ${viewingOrder.pin_code}`}
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm uppercase text-slate-900 mb-4 flex items-center gap-2">
                      <span className="material-symbols-outlined text-slate-400">local_shipping</span> Shipping To
                    </h4>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed">
                      {viewingOrder.address || `${viewingOrder.city}, ${viewingOrder.state} ${viewingOrder.pin_code}`}
                    </p>
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h4 className="font-bold text-sm uppercase text-slate-900 mb-4 pb-2 border-b border-slate-100">Order Items</h4>
                  <div className="space-y-4">
                    {viewingOrder.items.map((item, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-100 rounded-lg flex-shrink-0 flex items-center justify-center text-slate-300 overflow-hidden">
                          {item.product_image ? (
                            <img src={item.product_image} alt={item.product_name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="material-symbols-outlined">image</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-slate-700 text-sm">{item.product_name}</p>
                          <p className="text-xs text-slate-400 font-medium">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-bold text-slate-900 text-sm">₹{item.price}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 relative">
                <button
                  onClick={handleDownloadInvoice}
                  className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-white hover:shadow-sm transition-all text-sm border border-transparent hover:border-slate-200"
                >
                  Download Invoice
                </button>

                <div className="relative">
                  <button
                    onClick={() => setShowStatusMenu(!showStatusMenu)}
                    className="px-6 py-3 rounded-xl font-black uppercase text-xs tracking-widest bg-slate-900 text-white hover:bg-primary transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                  >
                    Update Status
                    <span className="material-symbols-outlined text-sm">{showStatusMenu ? 'expand_less' : 'expand_more'}</span>
                  </button>

                  {showStatusMenu && (
                    <div className="absolute bottom-full right-0 mb-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-200 z-50">
                      {ORDER_STATUSES.map(status => (
                        <button
                          key={status}
                          onClick={() => handleStatusUpdate(status)}
                          className={`w-full text-left px-4 py-3 text-xs font-bold uppercase tracking-wider hover:bg-slate-50 transition-colors flex items-center justify-between ${viewingOrder.status === status ? 'text-primary bg-primary/5' : 'text-slate-600'}`}
                        >
                          {status}
                          {viewingOrder.status === status && <span className="material-symbols-outlined text-sm">check</span>}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )
      }
      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteCategoryModal.isOpen}
        onClose={() => setDeleteCategoryModal({ isOpen: false, categoryId: null })}
        onConfirm={() => {
          if (deleteCategoryModal.categoryId) {
            onDeleteCategory(deleteCategoryModal.categoryId);
          }
          setDeleteCategoryModal({ isOpen: false, categoryId: null });
        }}
        title="Delete Category?"
        message="Are you sure you want to delete this category? This action cannot be undone."
        confirmLabel="Delete"
        isDestructive={true}
      />
    </div >
  );
};

export default AdminDashboard;
