
import React, { useState, useRef } from 'react';
import { Product, EventBlog, HeroSlide, BlogPost, Story } from '../types';
import { jsPDF } from "jspdf";

interface AdminDashboardProps {
  onLogout: () => void;
  products: Product[];
  onAddProduct: (p: Product) => void;
  onUpdateProduct: (p: Product) => void;
  onDeleteProduct: (id: string) => void;
  categories: string[];
  onAddCategory: (c: string) => void;
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
  onUpdateStories: (s: Story[]) => void;
}

const INITIAL_ORDERS = [
  { id: '#PB-8821', customer: 'Sarah Jenkins', date: 'Oct 24, 2023', status: 'Delivered', total: 1240, items: 3, payment: 'Paid' },
  { id: '#PB-8822', customer: 'Mike Ross', date: 'Oct 24, 2023', status: 'Processing', total: 850, items: 1, payment: 'Paid' },
  { id: '#PB-8823', customer: 'Rachel Zane', date: 'Oct 23, 2023', status: 'Shipped', total: 2400, items: 4, payment: 'Paid' },
  { id: '#PB-8824', customer: 'Harvey Specter', date: 'Oct 23, 2023', status: 'Pending', total: 5600, items: 12, payment: 'Pending' },
  { id: '#PB-8825', customer: 'Louis Litt', date: 'Oct 22, 2023', status: 'Cancelled', total: 450, items: 1, payment: 'Refunded' },
  { id: '#PB-8826', customer: 'Jessica Pearson', date: 'Oct 21, 2023', status: 'Delivered', total: 3100, items: 6, payment: 'Paid' },
  { id: '#PB-8827', customer: 'Donna Paulsen', date: 'Oct 20, 2023', status: 'Delivered', total: 920, items: 2, payment: 'Paid' },
];

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

interface VisitorForm {
  id: string;
  title: string;
  eventName: string;
  status: 'Draft' | 'Published';
  link: string;
  submissions: {
    name: string;
    email: string;
    phone: string;
    time: string;
  }[];
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  onLogout, 
  products, 
  onAddProduct, 
  onUpdateProduct, 
  onDeleteProduct, 
  categories,
  onAddCategory,
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
  onUpdateStories
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [productView, setProductView] = useState<'list' | 'add' | 'categories'>('list');
  const [eventView, setEventView] = useState<'list' | 'add'>('list');
  const [blogView, setBlogView] = useState<'list' | 'form'>('list');
  const [uiView, setUiView] = useState<'hero' | 'stories'>('hero');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [viewingOrder, setViewingOrder] = useState<typeof INITIAL_ORDERS[0] | null>(null);
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  
  const storyFileInputRef = useRef<HTMLInputElement>(null);

  // Visitor Forms State
  const [visitorForms, setVisitorForms] = useState<VisitorForm[]>([
    {
      id: 'vf-1',
      title: 'Morning Yoga Registration',
      eventName: 'Morning Yoga Session',
      status: 'Published',
      link: 'https://pinobite.global/forms/vf-1',
      submissions: [
        { name: 'Alice Johnson', email: 'alice@example.com', phone: '+91 98765 43210', time: 'Oct 24, 08:30 AM' },
        { name: 'Bob Smith', email: 'bob@example.com', phone: '+91 98765 43211', time: 'Oct 24, 08:35 AM' }
      ]
    }
  ]);
  const [visitorFormView, setVisitorFormView] = useState<'list' | 'create' | 'details'>('list');
  const [selectedVisitorForm, setSelectedVisitorForm] = useState<VisitorForm | null>(null);
  const [newFormData, setNewFormData] = useState({ title: '', eventName: '' });

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
    content: ['']
  });

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
    nutrients: []
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
      id: `s-${Date.now()}`,
      mediaUrl: newStoryForm.mediaUrl || '',
      mediaType: newStoryForm.mediaType || 'image',
      productId: newStoryForm.productId || ''
    };
    onUpdateStories([...stories, newStory]);
    setNewStoryForm({ mediaUrl: '', mediaType: 'image', productId: '' });
  };

  const deleteStory = (id: string) => {
    onUpdateStories(stories.filter(s => s.id !== id));
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

  // Handlers for Products
  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.image) {
      alert("Please upload a featured image.");
      return;
    }

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
      benefits: ['High Protein', 'Natural'],
      nutrients: [{ label: 'Energy', value: '400kcal' }],
      ...productForm as Product
    };
    onAddProduct(newProduct);
    setProductView('list');
    setProductForm({ name: '', price: 0, category: '', stock: 100, description: '', image: '', gallery: [], rating: 5, reviewCount: 0, benefits: [], nutrients: [] });
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
      content: ['']
    });
    setBlogView('form');
  };

  const openEditBlog = (post: BlogPost) => {
    setEditingBlogPost(post);
    setBlogForm({ ...post });
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
      content: blogForm.content?.filter(p => p.trim() !== '') || []
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
    const newId = `vf-${Date.now()}`;
    const newForm: VisitorForm = {
      id: newId,
      title: newFormData.title,
      eventName: newFormData.eventName,
      status: 'Published',
      link: `https://pinobite.global/forms/${newId}`,
      submissions: []
    };
    setVisitorForms([newForm, ...visitorForms]);
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
      featuredProducts: eventForm.featuredProducts || []
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
    doc.text(`Date: ${viewingOrder.date}`, 20, 46);
    doc.text(`Status: ${viewingOrder.status}`, 20, 52);
    doc.text(`Payment: ${viewingOrder.payment}`, 20, 58);

    // Customer Details
    doc.text(`Customer: ${viewingOrder.customer}`, 150, 40);
    doc.text(`102, Green Valley Apts`, 150, 46);
    doc.text(`Bangalore, 560038`, 150, 52);

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
    
    // Simulating items based on count since order object only has total count
    const itemPrice = viewingOrder.total / viewingOrder.items;
    
    for (let i = 0; i < viewingOrder.items; i++) {
        doc.text(`Pinobite Super Product ${i + 1}`, 20, y);
        doc.text("1", 130, y);
        doc.text(`Rs. ${itemPrice.toFixed(0)}`, 160, y);
        y += 10;
    }

    // Divider
    doc.line(20, y, 190, y);
    y += 10;

    // Total
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text("Total Amount:", 110, y + 5);
    doc.setTextColor(0, 138, 69);
    doc.text(`Rs. ${viewingOrder.total.toLocaleString()}`, 160, y + 5);

    // Footer
    doc.setFontSize(9);
    doc.setTextColor(150);
    doc.text("Thank you for your business!", 20, y + 30);
    doc.text("This is a computer generated invoice.", 20, y + 35);

    doc.save(`Invoice-${viewingOrder.id.replace('#', '')}.pdf`);
  };

  // Update Status Logic
  const handleStatusUpdate = (newStatus: string) => {
    if (!viewingOrder) return;
    
    // Update local orders list
    const updatedOrders = orders.map(o => 
      o.id === viewingOrder.id ? { ...o, status: newStatus } : o
    );
    setOrders(updatedOrders);
    
    // Update currently viewing order
    setViewingOrder({ ...viewingOrder, status: newStatus });
    setShowStatusMenu(false);
  };

  // Filter orders based on search query
  const filteredOrders = orders.filter(order => 
    order.id.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
    order.customer.toLowerCase().includes(orderSearchQuery.toLowerCase())
  );

  const getPageTitle = () => {
    switch(activeTab) {
      case 'overview': return 'Command Center';
      case 'products': return 'Inventory Management';
      case 'blogs': return 'Blog Manager';
      case 'events': return 'Event Stories';
      case 'ui-settings': return 'Site Customization';
      case 'visitor-forms': return 'Pinobit Event Visitor Form';
      default: return activeTab.replace('-', ' ');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex font-display">
      {/* Sidebar */}
      <aside className="w-20 lg:w-64 bg-slate-900 text-white flex flex-col flex-shrink-0 transition-all duration-300">
        <div className="p-6 flex items-center gap-3 border-b border-slate-800 h-20">
          <span className="material-symbols-outlined text-3xl text-primary">eco</span>
          <span className="font-black text-xl tracking-tighter hidden lg:block">PINO<span className="text-slate-500">PANEL</span></span>
        </div>

        <nav className="flex-1 py-6 space-y-1">
          {[
            { id: 'overview', icon: 'dashboard', label: 'Overview' },
            { id: 'products', icon: 'inventory_2', label: 'Products & Stock' },
            { id: 'blogs', icon: 'article', label: 'Blog Manager' },
            { id: 'events', icon: 'event', label: 'Event Manager' },
            { id: 'ui-settings', icon: 'palette', label: 'Site UI Settings' },
            { id: 'orders', icon: 'shopping_bag', label: 'Global Orders' },
            { id: 'distributors', icon: 'handshake', label: 'Distributors' },
            { id: 'visitor-forms', icon: 'qr_code_scanner', label: 'Visitor Forms' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-6 py-4 transition-colors relative ${
                activeTab === item.id 
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

        <div className="p-4 border-t border-slate-800">
          <div className="bg-slate-800 rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center font-black">AD</div>
            <div className="hidden lg:block overflow-hidden">
              <p className="text-xs font-bold truncate">Admin User</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider">Super Admin</p>
            </div>
            <button onClick={onLogout} className="ml-auto text-slate-400 hover:text-white">
              <span className="material-symbols-outlined">logout</span>
            </button>
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
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
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
                  <button className="text-[10px] font-bold text-primary hover:underline">Mark all read</button>
                </div>
                <div className="max-h-72 overflow-y-auto custom-scroll">
                  {[
                    { title: "New Order #PB-8821", desc: "Received from Sarah J.", time: "2m ago", icon: "shopping_bag", color: "bg-green-100 text-green-600" },
                    { title: "Low Stock Alert", desc: "Super Muesli is below 10 units", time: "1h ago", icon: "warning", color: "bg-red-100 text-red-600" },
                    { title: "Distributor Application", desc: "Healthy Foods Ltd applied", time: "3h ago", icon: "handshake", color: "bg-blue-100 text-blue-600" },
                    { title: "Event Published", desc: "Morning Yoga Session is live", time: "5h ago", icon: "event", color: "bg-purple-100 text-purple-600" }
                  ].map((notif, i) => (
                    <div key={i} className="p-4 hover:bg-slate-50 transition-colors flex gap-3 border-b border-slate-50 last:border-0 cursor-pointer">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${notif.color}`}>
                        <span className="material-symbols-outlined text-sm">{notif.icon}</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800 leading-tight">{notif.title}</p>
                        <p className="text-xs text-slate-500 mt-1">{notif.desc}</p>
                        <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase">{notif.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 bg-slate-50 text-center border-t border-slate-100">
                  <button className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-slate-900">View All Activity</button>
                </div>
              </div>
            )}

            {/* Settings Dropdown */}
            {showSettings && (
              <div className="absolute top-14 right-0 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-4 border-b border-slate-50 bg-slate-50/50">
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Signed in as</p>
                   <p className="font-black text-slate-900 truncate text-sm">admin@pinobite.global</p>
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
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Media URL (Video or Image)</label>
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            value={newStoryForm.mediaUrl}
                            onChange={e => setNewStoryForm({...newStoryForm, mediaUrl: e.target.value})}
                            className="flex-1 px-4 py-3 rounded-xl border border-slate-200 font-bold focus:ring-primary"
                            placeholder="https://..."
                          />
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
                            className="bg-slate-100 text-slate-600 px-4 rounded-xl border border-slate-200 hover:bg-slate-200 transition-colors flex items-center justify-center"
                            title="Upload media file"
                          >
                            <span className="material-symbols-outlined">cloud_upload</span>
                          </button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Media Type</label>
                        <select 
                          value={newStoryForm.mediaType}
                          onChange={e => setNewStoryForm({...newStoryForm, mediaType: e.target.value as 'image' | 'video'})}
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
                          onChange={e => setNewStoryForm({...newStoryForm, productId: e.target.value})}
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
                           <div className="absolute bottom-2 left-2 right-2">
                              <p className="text-[8px] font-bold text-white uppercase truncate">
                                {products.find(p => p.id === newStoryForm.productId)?.name || 'Product will link here'}
                              </p>
                           </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {stories.map(story => {
                      const p = products.find(prod => prod.id === story.productId);
                      return (
                        <div key={story.id} className="relative aspect-[9/16] bg-slate-200 rounded-2xl overflow-hidden group border-2 border-transparent hover:border-primary transition-all">
                          {story.mediaType === 'video' ? (
                            <video src={story.mediaUrl} className="w-full h-full object-cover" muted loop />
                          ) : (
                            <img src={story.mediaUrl} className="w-full h-full object-cover" alt="Story" />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                          <div className="absolute bottom-2 left-2 right-2">
                             <p className="text-[8px] font-bold text-white uppercase truncate">{p?.name || 'Unknown Product'}</p>
                          </div>
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
                         <input required type="text" value={newFormData.title} onChange={e => setNewFormData({...newFormData, title: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 font-bold focus:ring-primary focus:border-primary" placeholder="e.g. Morning Yoga Registration" />
                      </div>
                      <div className="space-y-2">
                         <label className="text-xs font-black uppercase tracking-widest text-slate-500">Event Name</label>
                         <input required type="text" value={newFormData.eventName} onChange={e => setNewFormData({...newFormData, eventName: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 font-bold focus:ring-primary focus:border-primary" placeholder="e.g. Yoga at the Park" />
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
                             <button className="text-primary hover:text-primary/80" title="Copy Link">
                               <span className="material-symbols-outlined text-sm">content_copy</span>
                             </button>
                          </div>
                       </div>

                       {/* Submissions Panel */}
                       <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                          <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                             <div>
                               <h4 className="font-black uppercase text-slate-900">Visitor Submissions</h4>
                               <p className="text-xs text-slate-500 font-medium mt-1">Total: {selectedVisitorForm.submissions.length}</p>
                             </div>
                             <button className="text-primary font-bold text-xs uppercase tracking-widest hover:underline flex items-center gap-1">
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
                                  selectedVisitorForm.submissions.map((sub, i) => (
                                    <tr key={i} className="hover:bg-slate-50/50">
                                      <td className="p-4">
                                        <p className="font-bold text-slate-900 text-sm">{sub.name}</p>
                                      </td>
                                      <td className="p-4">
                                        <p className="text-sm text-slate-600">{sub.email}</p>
                                        <p className="text-xs text-slate-400 mt-0.5">{sub.phone}</p>
                                      </td>
                                      <td className="p-4 text-right">
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">{sub.time}</p>
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
                       </div>
                    </div>
                 </div>
              )}
            </div>
          )}

          {/* ----- BLOG MANAGER TAB ----- */}
          {activeTab === 'blogs' && (
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
                        <h4 className="font-black uppercase text-lg mb-2 leading-tight line-clamp-2">{post.title}</h4>
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
                              <input required type="text" value={blogForm.title} onChange={e => setBlogForm({...blogForm, title: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 font-bold focus:ring-primary focus:border-primary" placeholder="e.g. 5 Ways to Eat Oats" />
                           </div>
                           <div className="space-y-2">
                              <label className="text-xs font-black uppercase tracking-widest text-slate-500">Category Type</label>
                              <select required value={blogForm.type} onChange={e => setBlogForm({...blogForm, type: e.target.value as any})} className="w-full px-4 py-3 rounded-xl border border-slate-200 font-bold focus:ring-primary focus:border-primary bg-white">
                                <option value="Recipe">Recipe</option>
                                <option value="Lifestyle">Lifestyle</option>
                                <option value="News">News</option>
                              </select>
                           </div>
                           <div className="space-y-2">
                              <label className="text-xs font-black uppercase tracking-widest text-slate-500">Author</label>
                              <input required type="text" value={blogForm.author} onChange={e => setBlogForm({...blogForm, author: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 font-bold focus:ring-primary focus:border-primary" placeholder="e.g. Chef Riya" />
                           </div>
                           <div className="space-y-2">
                              <label className="text-xs font-black uppercase tracking-widest text-slate-500">Read Time</label>
                              <input required type="text" value={blogForm.readTime} onChange={e => setBlogForm({...blogForm, readTime: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 font-bold focus:ring-primary focus:border-primary" placeholder="e.g. 5 min read" />
                           </div>
                           <div className="md:col-span-2 space-y-2">
                              <label className="text-xs font-black uppercase tracking-widest text-slate-500">Excerpt</label>
                              <textarea required value={blogForm.excerpt} onChange={e => setBlogForm({...blogForm, excerpt: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 font-bold focus:ring-primary focus:border-primary" rows={2} placeholder="Short summary for the card..." />
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
                        <h4 className="text-sm font-black uppercase text-slate-800">Article Content</h4>
                        <p className="text-xs text-slate-500">Add paragraphs for your article.</p>
                        {blogForm.content?.map((paragraph, idx) => (
                           <div key={idx} className="relative group">
                              <textarea 
                                placeholder={`Paragraph ${idx + 1}...`} 
                                value={paragraph} 
                                onChange={(e) => updateBlogContent(idx, e.target.value)} 
                                rows={4} 
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-700 focus:ring-primary focus:border-primary" 
                              />
                              <button 
                                type="button" 
                                onClick={() => removeBlogParagraph(idx)}
                                className="absolute top-2 right-2 p-1 bg-white rounded-full text-slate-400 hover:text-red-500 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <span className="material-symbols-outlined text-sm">delete</span>
                              </button>
                           </div>
                        ))}
                        <button type="button" onClick={addBlogParagraph} className="text-primary font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:underline">
                          <span className="material-symbols-outlined text-sm">add</span> Add Paragraph
                        </button>
                      </section>

                      <div className="pt-6 flex justify-end gap-4 border-t border-slate-100">
                        <button type="button" onClick={() => setBlogView('list')} className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-50">Cancel</button>
                        <button type="submit" className="px-8 py-3 rounded-xl bg-primary text-white font-black uppercase tracking-widest hover:shadow-lg transition-all">{editingBlogPost ? 'Update Post' : 'Publish Post'}</button>
                      </div>
                    </form>
                 </div>
              )}
             </div>
          )}

          {/* ----- EVENT MANAGER TAB (Keeping existing logic) ----- */}
          {activeTab === 'events' && (
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
                              <input required type="text" value={eventForm.title} onChange={e => setEventForm({...eventForm, title: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 font-bold focus:ring-primary focus:border-primary" placeholder="e.g. Morning Yoga Session" />
                           </div>
                           <div className="space-y-2">
                              <label className="text-xs font-black uppercase tracking-widest text-slate-500">Date</label>
                              <input required type="text" value={eventForm.date} onChange={e => setEventForm({...eventForm, date: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 font-bold focus:ring-primary focus:border-primary" placeholder="e.g. Nov 12, 2023" />
                           </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                           <div className="space-y-2">
                              <label className="text-xs font-black uppercase tracking-widest text-slate-500">Location</label>
                              <input required type="text" value={eventForm.location} onChange={e => setEventForm({...eventForm, location: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 font-bold focus:ring-primary focus:border-primary" placeholder="e.g. Cubbon Park, Bangalore" />
                           </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-500">Summary</label>
                            <textarea required value={eventForm.summary} onChange={e => setEventForm({...eventForm, summary: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 font-bold focus:ring-primary focus:border-primary" rows={2} placeholder="Short description for the card..." />
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
          )}
          
          {/* ----- PRODUCT TAB (Keeping existing logic) ----- */}
          {activeTab === 'products' && (
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
                             <button className="text-slate-400 hover:text-primary transition-colors p-2">
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
                  <h3 className="text-2xl font-black uppercase text-slate-900 mb-6">Add New Product</h3>
                  <form onSubmit={handleProductSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <label className="text-xs font-black uppercase tracking-widest text-slate-500">Product Name</label>
                         <input required type="text" value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 font-bold focus:ring-primary focus:border-primary" placeholder="e.g. Super Oats" />
                      </div>
                      <div className="space-y-2">
                         <label className="text-xs font-black uppercase tracking-widest text-slate-500">Price (₹)</label>
                         <input required type="number" value={productForm.price} onChange={e => setProductForm({...productForm, price: Number(e.target.value)})} className="w-full px-4 py-3 rounded-xl border border-slate-200 font-bold focus:ring-primary focus:border-primary" placeholder="499" />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <label className="text-xs font-black uppercase tracking-widest text-slate-500">Category</label>
                         <select required value={productForm.category} onChange={e => setProductForm({...productForm, category: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 font-bold focus:ring-primary focus:border-primary bg-white">
                           <option value="">Select Category...</option>
                           {categories.map(c => <option key={c} value={c}>{c}</option>)}
                         </select>
                      </div>
                      <div className="space-y-2">
                         <label className="text-xs font-black uppercase tracking-widest text-slate-500">Initial Stock</label>
                         <input required type="number" value={productForm.stock} onChange={e => setProductForm({...productForm, stock: Number(e.target.value)})} className="w-full px-4 py-3 rounded-xl border border-slate-200 font-bold focus:ring-primary focus:border-primary" placeholder="100" />
                      </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-500">Description</label>
                        <textarea required value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 font-bold focus:ring-primary focus:border-primary" rows={4} placeholder="Product details..." />
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
                                onClick={() => setProductForm({...productForm, image: ''})}
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
                                onClick={() => setProductForm(prev => ({...prev, gallery: prev.gallery?.filter((_,i) => i !== idx)}))}
                                className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <span className="material-symbols-outlined text-white">close</span>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-4">
                      <button type="button" onClick={() => setProductView('list')} className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-50">Cancel</button>
                      <button type="submit" className="px-8 py-3 rounded-xl bg-primary text-white font-black uppercase tracking-widest hover:shadow-lg transition-all">Create Product</button>
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
                        if(newCategory) {
                          onAddCategory(newCategory);
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
                        <div key={c} className="px-4 py-2 bg-slate-50 rounded-lg border border-slate-200 flex items-center gap-2">
                          <span className="font-bold text-slate-700">{c}</span>
                          {c !== 'Muesli' && c !== 'Oats' && ( // Prevent deleting core categories for demo
                            <button className="text-slate-400 hover:text-red-500">
                              <span className="material-symbols-outlined text-sm">close</span>
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ----- ORDERS TAB ----- */}
          {activeTab === 'orders' && (
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
                        <p className="text-3xl font-black text-green-500 mt-2">₹{orders.reduce((acc, curr) => acc + (curr.status !== 'Cancelled' ? curr.total : 0), 0).toLocaleString()}</p>
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
                                        <td className="p-4 font-bold text-slate-900">{order.id}</td>
                                        <td className="p-4">
                                            <div className="font-bold text-slate-700">{order.customer}</div>
                                            <div className="text-xs text-slate-400">{order.items} Items</div>
                                        </td>
                                        <td className="p-4 text-sm font-medium text-slate-600">{order.date}</td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                                order.status === 'Delivered' ? 'bg-green-100 text-green-600' :
                                                order.status === 'Processing' ? 'bg-blue-100 text-blue-600' :
                                                order.status === 'Shipped' ? 'bg-purple-100 text-purple-600' :
                                                order.status === 'Pending' ? 'bg-orange-100 text-orange-600' :
                                                'bg-red-100 text-red-600'
                                            }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="p-4 font-black text-slate-800">₹{order.total}</td>
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
          )}

          {activeTab === 'overview' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Stats Grid */}
              <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
                {[
                  { label: 'Total Revenue', value: '₹42.5L', change: '+12.5%', icon: 'payments', color: 'bg-green-100 text-green-600' },
                  { label: 'Total SKUs', value: products.length.toString(), change: '+1', icon: 'inventory_2', color: 'bg-blue-100 text-blue-600' },
                  { label: 'Low Stock Items', value: products.filter(p => p.stock < 10).length.toString(), change: products.filter(p => p.stock < 10).length > 0 ? '- Action Needed' : 'Healthy', icon: 'warning', color: products.filter(p => p.stock < 10).length > 0 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600' },
                  { label: 'Total Events', value: events.length.toString(), change: '+2', icon: 'event', color: 'bg-purple-100 text-purple-600' },
                ].map((stat, i) => (
                  <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                        <span className="material-symbols-outlined">{stat.icon}</span>
                      </div>
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.change.startsWith('+') || stat.change === 'Healthy' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
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
                    <h4 className="font-bold text-blue-900">Admin Tip</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      You can now create and manage QR codes for visitor check-ins under the "Visitor Forms" tab.
                    </p>
                  </div>
               </div>
            </div>
          )}

          {activeTab !== 'overview' && activeTab !== 'products' && activeTab !== 'events' && activeTab !== 'orders' && activeTab !== 'ui-settings' && activeTab !== 'visitor-forms' && activeTab !== 'blogs' && (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
              <span className="material-symbols-outlined text-6xl opacity-20">construction</span>
              <p className="font-handdrawn text-2xl">This module is under construction</p>
            </div>
          )}
        </div>
      </main>

      {/* Slide Edit/Add Modal */}
      {isSlideModalOpen && (
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
                   <input required type="text" value={slideForm.category} onChange={e => setSlideForm({...slideForm, category: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 font-bold focus:ring-primary focus:border-primary" placeholder="e.g. SUPER MUESLI" />
                </div>
                
                <div className="space-y-2">
                   <label className="text-xs font-black uppercase tracking-widest text-slate-500">Headline</label>
                   <input required type="text" value={slideForm.headline} onChange={e => setSlideForm({...slideForm, headline: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 font-bold focus:ring-primary focus:border-primary" placeholder="e.g. Crunchy Coffee Madness" />
                </div>

                <div className="space-y-2">
                   <label className="text-xs font-black uppercase tracking-widest text-slate-500">Description</label>
                   <textarea required value={slideForm.description} onChange={e => setSlideForm({...slideForm, description: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 font-bold focus:ring-primary focus:border-primary" rows={3} placeholder="Short description..." />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-500">CTA Button Text</label>
                      <input required type="text" value={slideForm.cta} onChange={e => setSlideForm({...slideForm, cta: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 font-bold focus:ring-primary focus:border-primary" placeholder="SHOP NOW" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-500">Status</label>
                      <select value={slideForm.isActive ? 'active' : 'inactive'} onChange={e => setSlideForm({...slideForm, isActive: e.target.value === 'active'})} className="w-full px-4 py-3 rounded-xl border border-slate-200 font-bold focus:ring-primary focus:border-primary bg-white">
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
      )}

      {/* Order Details Modal */}
      {viewingOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setViewingOrder(null)} />
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in duration-300">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-black uppercase text-slate-900">Order Details</h3>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    viewingOrder.status === 'Delivered' ? 'bg-green-100 text-green-600' :
                    viewingOrder.status === 'Processing' ? 'bg-blue-100 text-blue-600' :
                    viewingOrder.status === 'Shipped' ? 'bg-purple-100 text-purple-600' :
                    viewingOrder.status === 'Pending' ? 'bg-orange-100 text-orange-600' :
                    'bg-red-100 text-red-600'
                  }`}>
                    {viewingOrder.status}
                  </span>
                </div>
                <p className="text-sm font-bold text-slate-500 mt-1">{viewingOrder.id} • Placed on {viewingOrder.date}</p>
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
                    <p className="text-xl font-black text-primary">₹{viewingOrder.total.toLocaleString()}</p>
                 </div>
                 <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Payment Status</p>
                    <p className={`text-sm font-black uppercase ${viewingOrder.payment === 'Paid' ? 'text-green-600' : 'text-orange-500'}`}>{viewingOrder.payment}</p>
                 </div>
                 <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Total Items</p>
                    <p className="text-xl font-black text-slate-900">{viewingOrder.items}</p>
                 </div>
              </div>

              {/* Customer Info */}
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                   <h4 className="font-bold text-sm uppercase text-slate-900 mb-4 flex items-center gap-2">
                     <span className="material-symbols-outlined text-slate-400">person</span> Customer
                   </h4>
                   <div className="space-y-1">
                      <p className="font-bold text-slate-800">{viewingOrder.customer}</p>
                      <p className="text-sm text-slate-500">customer@email.com</p>
                      <p className="text-sm text-slate-500">+91 98765 43210</p>
                   </div>
                </div>
                <div>
                   <h4 className="font-bold text-sm uppercase text-slate-900 mb-4 flex items-center gap-2">
                     <span className="material-symbols-outlined text-slate-400">local_shipping</span> Shipping To
                   </h4>
                   <p className="text-sm text-slate-500 font-medium leading-relaxed">
                      102, Green Valley Apartments,<br/>
                      Indiranagar, Bangalore,<br/>
                      Karnataka - 560038
                   </p>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h4 className="font-bold text-sm uppercase text-slate-900 mb-4 pb-2 border-b border-slate-100">Order Items</h4>
                <div className="space-y-4">
                  {[...Array(viewingOrder.items)].map((_, i) => (
                     <div key={i} className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-100 rounded-lg flex-shrink-0 flex items-center justify-center text-slate-300">
                           <span className="material-symbols-outlined">image</span>
                        </div>
                        <div className="flex-1">
                           <p className="font-bold text-slate-700 text-sm">Pinobite Super Product {i + 1}</p>
                           <p className="text-xs text-slate-400 font-medium">Qty: 1 • Standard Pack</p>
                        </div>
                        <p className="font-bold text-slate-900 text-sm">₹{(viewingOrder.total / viewingOrder.items).toFixed(0)}</p>
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
                   <div className="absolute bottom-full right-0 mb-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-200">
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
      )}
    </div>
  );
};

export default AdminDashboard;
