
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
  isTopRated?: boolean;
  category: string;
  stock: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Category {
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
  date: string;
  location: string;
  image: string;
  summary: string;
  fullStory: {
    heading: string;
    content: string;
  }[];
  gallery: string[];
  featuredProducts: string[]; // IDs of products
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
  content: string[]; // Array of paragraphs
}

export const CATEGORY_DISPLAY_DATA: CategoryDisplay[] = [
  { 
    id: "Nut Butters", 
    display: "Nut Butters", 
    image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?q=80&w=600&auto=format&fit=crop",
    count: "4 Flavors",
    bgClass: "bg-[#fff7ed]",
    borderClass: "border-orange-100 hover:border-orange-300",
    textClass: "text-orange-950",
    accentClass: "bg-orange-600",
    rotation: "rotate-2"
  },
  { 
    id: "Muesli", 
    display: "Super Muesli", 
    image: "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?q=80&w=600&auto=format&fit=crop",
    count: "6 Blends",
    bgClass: "bg-[#fefce8]",
    borderClass: "border-yellow-100 hover:border-yellow-300",
    textClass: "text-yellow-950",
    accentClass: "bg-yellow-500",
    rotation: "-rotate-2"
  },
  { 
    id: "Oats", 
    display: "Super Oats", 
    image: "https://images.unsplash.com/photo-1613769049987-b31b641f25b1?q=80&w=600&auto=format&fit=crop",
    count: "3 Varieties",
    bgClass: "bg-[#f0fdf4]",
    borderClass: "border-green-100 hover:border-green-300",
    textClass: "text-green-950",
    accentClass: "bg-green-600",
    rotation: "rotate-1"
  }
];

export const BLOG_DATA: BlogPost[] = [
  {
    id: '1',
    type: 'Recipe',
    title: "The Ultimate 5-Minute High Protein Smoothie Bowl",
    excerpt: "Start your morning with a power-packed bowl of antioxidants and protein. Secret ingredient: Our chunky peanut butter!",
    image: "https://images.unsplash.com/photo-1626078436812-78d2b9d0999d?q=80&w=800&auto=format&fit=crop",
    date: "Oct 24, 2023",
    readTime: "5 min prep",
    author: "Chef Riya",
    content: [
      "Smoothie bowls are the perfect canvas for a nutrient-dense breakfast. They are hydrating, packed with fiber, and if you do it right—loaded with protein.",
      "For this recipe, we're using frozen bananas for that creamy texture, a handful of spinach (you won't taste it, promise!), and a generous scoop of Pinobite Super Peanut Butter Chunky.",
      "Simply blend 2 frozen bananas, 1/2 cup almond milk, 1 scoop of protein powder, and 1 tbsp of peanut butter until smooth. Pour into a bowl and top with our Super Muesli for that essential crunch.",
      "Pro Tip: Chill your bowl in the freezer for 10 minutes before serving to keep your smoothie thick and frosty!"
    ]
  },
  {
    id: '2',
    type: 'Lifestyle',
    title: "Why We Said 'No' to Refined Sugar",
    excerpt: "Refined sugar is the silent energy killer. Here’s how switching to natural sweeteners like honey and jaggery changed our energy levels.",
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=800&auto=format&fit=crop",
    date: "Oct 18, 2023",
    readTime: "4 min read",
    author: "Dr. A. Singh",
    content: [
      "We've all experienced the dreaded 3 PM crash. You eat a sugary snack for a quick boost, but an hour later, you're more tired than before. That's the insulin rollercoaster caused by refined sugar.",
      "At Pinobite, we made a conscious choice to exclude refined white sugar from all our products. Instead, we rely on the complex sweetness of dates, the richness of jaggery, and raw honey.",
      "These natural alternatives come with their own minerals and a lower glycemic index, meaning you get a sustained energy release rather than a spike and a crash. It's not just about calories; it's about metabolic health.",
      "Making the switch might seem hard at first, but your taste buds adapt quickly. Within two weeks, you'll find 'regular' sweets cloyingly sugary and start appreciating the subtle notes of real food."
    ]
  },
  {
    id: '3',
    type: 'Recipe',
    title: "No-Bake Muesli Energy Balls",
    excerpt: "The perfect mid-day snack that doesn't require an oven. Just mix, roll, and chill. Great for kids' lunchboxes!",
    image: "https://images.unsplash.com/photo-1604423043492-4130b788de80?q=80&w=800&auto=format&fit=crop",
    date: "Oct 10, 2023",
    readTime: "15 min prep",
    author: "Chef Riya",
    content: [
      "Energy balls are the ultimate meal-prep hack. Make a batch on Sunday, and you have healthy snacks for the entire week.",
      "Ingredients: 1 cup Pinobite Super Muesli, 1/2 cup Creamy Almond Butter, 1/4 cup honey, and a pinch of salt.",
      "Instructions: Mix all ingredients in a large bowl. The mixture should be sticky. If it's too dry, add more honey. If too wet, add more muesli. Roll into bite-sized spheres and place on a parchment-lined tray.",
      "Refrigerate for at least 30 minutes to set. These keep well in the fridge for up to 2 weeks, making them the perfect grab-and-go fuel."
    ]
  },
  {
    id: '4',
    type: 'News',
    title: "Pinobite Goes Global: Now Shipping to Dubai!",
    excerpt: "We are thrilled to announce our expansion into the Middle East. Find out where you can spot us in Dubai.",
    image: "https://images.unsplash.com/photo-1512453979798-5ea904ac66de?q=80&w=800&auto=format&fit=crop",
    date: "Sep 28, 2023",
    readTime: "2 min read",
    author: "Team Pinobite",
    content: [
      "It started as a DM on Instagram. A cafe owner in Dubai wanted to stock our muesli. One thing led to another, and today we are officially launching shipping to the UAE!",
      "You can now find Pinobite products in select specialized health stores in Downtown Dubai and Jumeirah. We are working on getting our full range available online for our Middle Eastern customers soon.",
      "This is a huge milestone for a homegrown brand like ours. Thank you for believing in clean nutrition and spreading the word!",
      "To our Dubai fam: Tag us @pinobite when you spot us on the shelves!"
    ]
  },
  {
    id: '5',
    type: 'Lifestyle',
    title: "Understanding Good Fats vs. Bad Fats",
    excerpt: "Not all fats make you fat. Learn why the monounsaturated fats in nuts are essential for brain health and glowing skin.",
    image: "https://images.unsplash.com/photo-1615486777798-fa3274dc5d5c?q=80&w=800&auto=format&fit=crop",
    date: "Sep 15, 2023",
    readTime: "6 min read",
    author: "Sarah Nutrition",
    content: [
      "For decades, 'fat' was the enemy. We bought low-fat everything, only to replace it with sugar and refined carbs. The result? A health crisis.",
      "The truth is, your body needs fat. Your brain is 60% fat. Your hormones rely on cholesterol to function. The key is choosing the *right* fats.",
      "Nuts like almonds and peanuts are rich in monounsaturated fats (MUFAs), which support heart health and reduce inflammation. They also help you feel full, preventing overeating.",
      "We avoid processed vegetable oils (trans fats) in all our products. We stick to the natural oils found within the nuts themselves. Simple, natural, and essential."
    ]
  },
  {
    id: '6',
    type: 'Recipe',
    title: "Spicy Thai Peanut Noodles (Vegan)",
    excerpt: "Who said peanut butter is only for breakfast? Try this savory, creamy, and spicy dinner recipe ready in 20 minutes.",
    image: "https://images.unsplash.com/photo-1552611052-33e04de081de?q=80&w=800&auto=format&fit=crop",
    date: "Aug 30, 2023",
    readTime: "20 min cook",
    author: "Chef Riya",
    content: [
      "This sauce is liquid gold. It's creamy, savory, spicy, and tangy all at once. And the base? Our Creamy Peanut Butter.",
      "Whisk together: 1/3 cup peanut butter, 2 tbsp soy sauce, 1 tbsp lime juice, 1 tsp chili flakes, and a splash of warm water to thin it out.",
      "Toss this sauce with cooked noodles (rice noodles work great!), shredded carrots, purple cabbage, and edamame.",
      "Top with crushed peanuts and fresh cilantro. It's better than takeout, healthier, and ready in the time it takes to boil water."
    ]
  }
];
