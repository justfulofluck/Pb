export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  gallery?: string[];
  description: string;
  benefits: string[];
  nutrients: { label: string; value: string }[];
  ingredients?: string;
  nutrition?: {
    calories: string;
    protein: string;
    carbs: string;
    fat: string;
  };
  isTopRated?: boolean;
  category: string;
  stock: number;
  model3d?: string;
  themeColor?: string;
  orientation?: string;
  mainIngredient?: string;
  mainIngredientImage?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Category {
  id?: string;
  name: string;
  image: string;
}

export interface Testimonial {
  name: string;
  role: string;
  text: string;
  image: string;
}

export interface Review {
  id: string;
  productId: string; // 'general' or specific ID
  productName?: string;
  userName: string;
  userRole: string;
  rating: number;
  comment: string;
  date: string;
  avatar: string;
}

export interface ComparisonRow {
  feature: string;
  ghar: string;
  pino: string;
  junk: string;
}

export interface EventBlog {
  id: string;
  title: string;
  location: string;
  image: string;
  summary: string;
  fullStory: {
    heading: string;
    content: string;
  }[];
  gallery: string[];
  featuredProducts: string[]; // IDs of products
  date: string;
}

export interface HeroSlide {
  id: string;
  category: string;
  headline: string;
  description: string;
  image: string;
  cta: string;
  bgColor: string;
  accentColor: string;
  blobColor: string;
  isActive: boolean;
}

export interface CategoryDisplay {
  id: string;
  display: string;
  image: string;
  count: string;
  bgClass: string;
  borderClass: string;
  textClass: string;
  accentClass: string;
  rotation: string;
}

export interface BlogPost {
  id: string;
  type: 'Recipe' | 'Lifestyle' | 'News';
  title: string;
  excerpt: string;
  image: string;
  date: string;
  readTime: string;
  author: string;
  content: string; // HTML content from editor
  tags?: string[];
}

// Added Story interface to fix missing export errors
export interface Story {
  id: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  productId: string;
}

export const CATEGORY_DISPLAY_DATA: CategoryDisplay[] = [
  {
    id: "Peanut Butter",
    display: "Peanut Butter",
    image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?q=80&w=600&auto=format&fit=crop",
    count: "0 Flavors",
    bgClass: "bg-[#fff7ed]",
    borderClass: "border-orange-100 hover:border-orange-300",
    textClass: "text-orange-950",
    accentClass: "bg-orange-600",
    rotation: "rotate-2"
  },
  {
    id: "Muesli",
    display: "Muesli",
    image: "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?q=80&w=600&auto=format&fit=crop",
    count: "0 Blends",
    bgClass: "bg-[#fefce8]",
    borderClass: "border-yellow-100 hover:border-yellow-300",
    textClass: "text-yellow-950",
    accentClass: "bg-yellow-500",
    rotation: "-rotate-2"
  },
  {
    id: "Oats",
    display: "Oats",
    image: "https://images.unsplash.com/photo-1613769049987-b31b641f25b1?q=80&w=600&auto=format&fit=crop",
    count: "0 Varieties",
    bgClass: "bg-[#f0fdf4]",
    borderClass: "border-green-100 hover:border-green-300",
    textClass: "text-green-950",
    accentClass: "bg-green-600",
    rotation: "rotate-1"
  }
];
export interface VisitorSubmission {
  id: string;
  form: string;
  name: string;
  email: string;
  phone: string;
  submittedAt?: string;
  addressDetails?: string;
  buyingSource?: string;
  brandAwareness?: boolean;
  currentUsage?: string;
  flavorPreferences?: string; // Comma separated
  reviewedProduct?: string;
  reviewContent?: string;
  marketingConsent?: boolean;
}

export interface VisitorForm {
  id: string;
  title: string;
  eventName: string;
  status: 'Draft' | 'Published';
  createdAt: string;
  link: string;
  submissions: VisitorSubmission[];
}

export interface OrderItem {
  id: number;
  product: number;
  product_name: string;
  product_image?: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: number;
  user: number;
  user_name: string;
  user_email: string;
  first_name?: string;
  last_name?: string;
  total_amount: number;
  status: string;
  shipping_address: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  pin_code?: string;
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  created_at: string;
  items: OrderItem[];
}

export interface Announcement {
  id: number;
  message: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
}

export interface DistributorApplication {
  id: string;
  business_name: string;
  full_name: string;
  phone_number: string;
  city: string;
  email: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  created_at: string;
}
