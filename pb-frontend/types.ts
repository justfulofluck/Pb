export interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  description?: string;
  original_price?: number;
  rating: number;
  reviewCount: number;
  image: string;
  benefits: string[];
  nutrients: { label: string; value: string }[];
  ingredients?: string;
  ingredientsList?: { name: string; image: string }[];
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
  usageIdeas?: UsageIdea[];
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
  impactParticipants?: string;
  fuelBarsShared?: string;
  vibeEnergy?: string;
  scheduledDate?: string;
  isActive?: boolean;
}

export interface HeroSlide {
  id: string;
  category: string;
  headline: string;
  image: string;
  cta: string;
  ctaLink?: string;
  secondaryCta?: string;
  secondaryCtaLink?: string;
  bgColor: string;
  accentColor: string;
  blobColor: string;
  productId?: string;
  transitionType?: string;
  isActive: boolean;
  order?: number;
  backgroundImage?: string;
  mobileImage?: string;
  displayDuration?: number;
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
  imagePosition?: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  type: 'Recipe' | 'Lifestyle' | 'News';
  title: string;
  excerpt: string;
  image: string;
  date: string;
  readTime: string;
  author: string;
  content: string; // HTML content from editor
  subtitle?: string;
  intro_heading?: string;
  featured_quote?: string;
  author_image?: string;
  author_role?: string;
  secondary_image?: string;
  tertiary_image?: string;
  facts_list?: string[];
  key_points?: { title: string; desc: string }[];
  health_benefits?: { title: string; desc: string }[];
  usage_recipes?: { title: string; desc: string; image: string }[];
  tags?: string[];
  scheduledDate?: string;
  isActive?: boolean;
}

export interface Story {
  id: string;
  mediaUrl: string;
  posterUrl?: string;
  fullVideoUrl?: string;
  originalDriveUrl?: string;
  mediaType: 'image' | 'video';
  productId: string;
}

export interface UsageIdea {
  id: string;
  productId: string;
  title: string;
  description: string;
  image: string;
  order: number;
}

export const CATEGORY_DISPLAY_DATA: CategoryDisplay[] = [
  {
    id: "Peanut Butter",
    display: "Peanut Butter",
    image: "/assets/peanut-butter-display.jpg",
    count: "0 Flavors",
    bgClass: "bg-[#fff7ed]",
    borderClass: "border-orange-100 hover:border-orange-300",
    textClass: "text-orange-950",
    accentClass: "bg-orange-600",
    rotation: "rotate-2",
    imagePosition: "object-center"
  },
  {
    id: "Muesli",
    display: "Muesli",
    image: "/assets/muesli-display.jpg",
    count: "0 Blends",
    bgClass: "bg-[#fefce8]",
    borderClass: "border-yellow-100 hover:border-yellow-300",
    textClass: "text-yellow-950",
    accentClass: "bg-yellow-500",
    rotation: "-rotate-2",
    imagePosition: "object-bottom"
  },
  {
    id: "Oats",
    display: "Oats",
    image: "/assets/oats-display.jpg",
    count: "0 Varieties",
    bgClass: "bg-[#f0fdf4]",
    borderClass: "border-green-100 hover:border-green-300",
    textClass: "text-green-950",
    accentClass: "bg-green-600",
    rotation: "rotate-1",
    imagePosition: "object-bottom"
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

export interface PressUpdate {
  id: string;
  logo: string;          // Media house logo (base64 or URL)
  mediaHouse: string;    // Name of the media house
  quote: string;         // The press quote / comment
  author: string;        // Author name
}

export interface RewardRule {
  id: number;
  event_name: 'signup' | 'first_order' | 'purchase' | 'review' | 'photo_review' | 'birthday' | 'instagram_follow' | 'social_share' | 'referral';
  points: number;
  is_enabled: boolean;
  description: string;
}

export interface RewardTransaction {
  id: number;
  points_change: number;
  reason: string;
  timestamp: string;
}

export interface Customer {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  is_staff: boolean;
  date_joined: string;
  profile: {
    points: number;
    tier: string;
    savings: number;
    phone: string;
    address: string;
    city: string;
    state: string;
    pin_code: string;
    birth_date: string;
  };
}

