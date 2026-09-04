import { BLOG_POSTS_DATA, type BlogPost } from "./blog-data";
export type { BlogPost };

export interface ProductVariant {
  id: string;
  weight: string;
  originalPrice: number;
  discountedPrice?: number | null;
  sku?: string | null;
  stockQuantity: number;
}

export interface ProductImage {
  url: string;
  isPrimary?: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  categoryId: string;
  originalPrice: number;
  discountedPrice: number | null;
  sku: string;
  stockQuantity: number;
  stockStatus: string;
  isBestseller: boolean;
  isNewArrival: boolean;
  isActive: boolean;
  benefits?: string | null;
  shelfLife?: string | null;
  deliveryInfo?: string | null;
  storageInstructions?: string | null;
  images: ProductImage[];
  variants: ProductVariant[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  displayOrder: number;
  isActive: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  rating: number;
  review: string;
  image?: string;
  isFeatured: boolean;
  isGoogleReview: boolean;
}

// 1. Categories
export const CATEGORIES: Category[] = [
  {
    id: "cat-dry-fruits",
    name: "Dry Fruits",
    slug: "dry-fruits",
    description: "Hand-sorted nuts and dried fruits sourced from the finest origins.",
    image: "/images/product_almond.jpg",
    displayOrder: 1,
    isActive: true,
  },
  {
    id: "cat-snacks",
    name: "Makhana & Healthy Seeds",
    slug: "snacks",
    description: "Phool makhana, raw seeds, and roasted high-protein nut blends.",
    image: "/images/collection_seeds.jpg",
    displayOrder: 2,
    isActive: true,
  },
];

// 2. Products
export const PRODUCTS: Product[] = [
  // DRY FRUITS
  {
    id: "prod-badam",
    name: "California Jumbo Almonds (Badam)",
    slug: "jumbo-almonds",
    description: "These premium California almonds are a source of healthy fats, protein, and vitamin E. Perfectly sorted and uniform in size. Sourced fresh for you.",
    categoryId: "cat-dry-fruits",
    originalPrice: 280,
    discountedPrice: 260,
    sku: "SM-ALM-001",
    stockQuantity: 150,
    stockStatus: "IN_STOCK",
    isBestseller: true,
    isNewArrival: false,
    isActive: true,
    benefits: "Source of healthy fats, protein, and vitamin E.",
    shelfLife: "6 Months",
    deliveryInfo: "Same-day home delivery in Ujjain",
    storageInstructions: "Store in an airtight container in a cool, dry place.",
    images: [{ url: "/images/product_almond.jpg", isPrimary: true }],
    variants: [
      { id: "v-al-250", weight: "250g", originalPrice: 280, discountedPrice: 260, sku: "SM-ALM-250", stockQuantity: 50 },
      { id: "v-al-500", weight: "500g", originalPrice: 550, discountedPrice: 500, sku: "SM-ALM-500", stockQuantity: 60 },
      { id: "v-al-1kg", weight: "1kg", originalPrice: 1080, discountedPrice: 980, sku: "SM-ALM-1KG", stockQuantity: 40 },
    ],
  },
  {
    id: "prod-kaju",
    name: "King Size Cashews (Kaju) W240",
    slug: "king-cashews",
    description: "Rich, creamy, and wholesome premium cashews. Naturally clean, uniform, and delicious. Ideal for gifting, snacks, and sweets.",
    categoryId: "cat-dry-fruits",
    originalPrice: 320,
    discountedPrice: 300,
    sku: "SM-CSW-002",
    stockQuantity: 120,
    stockStatus: "IN_STOCK",
    isBestseller: true,
    isNewArrival: false,
    isActive: true,
    benefits: "Rich in taste and texture, cholesterol-free by nature.",
    shelfLife: "6 Months",
    deliveryInfo: "Same-day delivery in Ujjain",
    storageInstructions: "Store in a cool dry container away from direct sunlight.",
    images: [{ url: "/images/product_cashew.jpg", isPrimary: true }],
    variants: [
      { id: "v-cs-250", weight: "250g", originalPrice: 320, discountedPrice: 300, sku: "SM-CSW-250", stockQuantity: 40 },
      { id: "v-cs-500", weight: "500g", originalPrice: 620, discountedPrice: 580, sku: "SM-CSW-500", stockQuantity: 50 },
      { id: "v-cs-1kg", weight: "1kg", originalPrice: 1220, discountedPrice: 1140, sku: "SM-CSW-1KG", stockQuantity: 30 },
    ],
  },
  {
    id: "prod-pista",
    name: "Roasted & Salted Iranian Pistachios (Pista)",
    slug: "salted-pistachios",
    description: "Perfect split-shell salted pistachios roasted uniformly. Features a delightful crunch and balanced saltiness. A premium snack for your family.",
    categoryId: "cat-dry-fruits",
    originalPrice: 350,
    discountedPrice: 330,
    sku: "SM-PST-003",
    stockQuantity: 90,
    stockStatus: "IN_STOCK",
    isBestseller: false,
    isNewArrival: true,
    isActive: true,
    benefits: "High in nutrients and fiber, delicious roasted flavor.",
    shelfLife: "6 Months",
    deliveryInfo: "Same-day delivery in Ujjain",
    storageInstructions: "Seal immediately after opening to keep crunchy.",
    images: [{ url: "/images/product_pistachio.jpg", isPrimary: true }],
    variants: [
      { id: "v-ps-250", weight: "250g", originalPrice: 350, discountedPrice: 330, sku: "SM-PST-250", stockQuantity: 30 },
      { id: "v-ps-500", weight: "500g", originalPrice: 680, discountedPrice: 640, sku: "SM-PST-500", stockQuantity: 40 },
      { id: "v-ps-1kg", weight: "1kg", originalPrice: 1340, discountedPrice: 1240, sku: "SM-PST-1KG", stockQuantity: 20 },
    ],
  },
  {
    id: "prod-akhrot",
    name: "Chilean Extra Light Walnut Kernels (Akhrot)",
    slug: "premium-walnuts",
    description: "Premium Chilean walnut halves. Superb flavor with a mild, buttery taste and zero bitterness. Rich in naturally occurring nutrients.",
    categoryId: "cat-dry-fruits",
    originalPrice: 400,
    discountedPrice: 370,
    sku: "SM-WLN-004",
    stockQuantity: 80,
    stockStatus: "IN_STOCK",
    isBestseller: true,
    isNewArrival: false,
    isActive: true,
    benefits: "Contains naturally occurring nutrients like Omega-3 ALA.",
    shelfLife: "6 Months",
    deliveryInfo: "Same-day delivery in Ujjain",
    storageInstructions: "Store in a cool dry airtight jar. Refrigeration recommended.",
    images: [{ url: "/images/product_walnut.jpg", isPrimary: true }],
    variants: [
      { id: "v-wl-250", weight: "250g", originalPrice: 400, discountedPrice: 370, sku: "SM-WLN-250", stockQuantity: 30 },
      { id: "v-wl-500", weight: "500g", originalPrice: 780, discountedPrice: 720, sku: "SM-WLN-500", stockQuantity: 30 },
      { id: "v-wl-1kg", weight: "1kg", originalPrice: 1540, discountedPrice: 1400, sku: "SM-WLN-1KG", stockQuantity: 20 },
    ],
  },
  {
    id: "prod-kishmish",
    name: "Kishmish / Afghan Long Raisins",
    slug: "long-raisins",
    description: "Sweet, soft, and long green raisins imported from Afghanistan. Naturally sun-dried, providing a great taste and texture.",
    categoryId: "cat-dry-fruits",
    originalPrice: 180,
    discountedPrice: 160,
    sku: "SM-RSN-005",
    stockQuantity: 110,
    stockStatus: "IN_STOCK",
    isBestseller: false,
    isNewArrival: false,
    isActive: true,
    images: [{ url: "/images/product_raisin.jpg", isPrimary: true }],
    variants: [
      { id: "v-rs-250", weight: "250g", originalPrice: 180, discountedPrice: 160, sku: "SM-RSN-250", stockQuantity: 40 },
      { id: "v-rs-500", weight: "500g", originalPrice: 340, discountedPrice: 300, sku: "SM-RSN-500", stockQuantity: 40 },
      { id: "v-rs-1kg", weight: "1kg", originalPrice: 650, discountedPrice: 580, sku: "SM-RSN-1KG", stockQuantity: 30 },
    ],
  },
  {
    id: "prod-anjeer",
    name: "Premium Dried Figs (Anjeer)",
    slug: "premium-figs",
    description: "Soft, sweet, and pulpy dried figs sourced selectively. Hand-threaded and naturally processed to maintain original rich taste.",
    categoryId: "cat-dry-fruits",
    originalPrice: 450,
    discountedPrice: 420,
    sku: "SM-FIG-009",
    stockQuantity: 80,
    stockStatus: "IN_STOCK",
    isBestseller: false,
    isNewArrival: true,
    isActive: true,
    images: [{ url: "/images/product_dates.jpg", isPrimary: true }],
    variants: [
      { id: "v-an-250", weight: "250g", originalPrice: 450, discountedPrice: 420, sku: "SM-FIG-250", stockQuantity: 30 },
      { id: "v-an-500", weight: "500g", originalPrice: 880, discountedPrice: 820, sku: "SM-FIG-500", stockQuantity: 30 },
    ],
  },
  {
    id: "prod-khajur",
    name: "Medjool Premium King Dates (Khajur)",
    slug: "medjool-dates",
    description: "Often called the king of dates, our Medjool dates are large, soft, and naturally sweet. A delicious natural sugar replacement.",
    categoryId: "cat-dry-fruits",
    originalPrice: 420,
    discountedPrice: 390,
    sku: "SM-DAT-006",
    stockQuantity: 70,
    stockStatus: "IN_STOCK",
    isBestseller: false,
    isNewArrival: true,
    isActive: true,
    images: [{ url: "/images/product_dates.jpg", isPrimary: true }],
    variants: [
      { id: "v-dt-250", weight: "250g", originalPrice: 420, discountedPrice: 390, sku: "SM-DAT-250", stockQuantity: 20 },
      { id: "v-dt-500", weight: "500g", originalPrice: 800, discountedPrice: 750, sku: "SM-DAT-500", stockQuantity: 30 },
      { id: "v-dt-1kg", weight: "1kg", originalPrice: 1550, discountedPrice: 1450, sku: "SM-DAT-1KG", stockQuantity: 20 },
    ],
  },
  {
    id: "prod-apricot",
    name: "Turkish Soft Dried Apricots (Jardalu)",
    slug: "dried-apricots",
    description: "Premium sun-dried apricots from Turkey. Soft, sweet, and golden. Rich in taste and texture.",
    categoryId: "cat-dry-fruits",
    originalPrice: 260,
    discountedPrice: 240,
    sku: "SM-APR-010",
    stockQuantity: 85,
    stockStatus: "IN_STOCK",
    isBestseller: false,
    isNewArrival: false,
    isActive: true,
    images: [{ url: "/images/product_dates.jpg", isPrimary: true }],
    variants: [
      { id: "v-ap-250", weight: "250g", originalPrice: 260, discountedPrice: 240, sku: "SM-APR-250", stockQuantity: 45 },
      { id: "v-ap-500", weight: "500g", originalPrice: 500, discountedPrice: 460, sku: "SM-APR-500", stockQuantity: 40 },
    ],
  },

  // HEALTHY & SNACKS
  {
    id: "prod-makhana",
    name: "Phool Makhana (Lotus Seeds)",
    slug: "phool-makhana",
    description: "Premium large-size handpicked lotus seeds. Extremely crunchy and perfect to roast with rock salt and pure ghee for a healthy daily snack.",
    categoryId: "cat-snacks",
    originalPrice: 199,
    discountedPrice: 179,
    sku: "SM-MAK-011",
    stockQuantity: 120,
    stockStatus: "IN_STOCK",
    isBestseller: true,
    isNewArrival: true,
    isActive: true,
    benefits: "Light, healthy snack containing naturally occurring nutrients.",
    images: [{ url: "/images/collection_seeds.jpg", isPrimary: true }],
    variants: [
      { id: "v-mk-100", weight: "100g", originalPrice: 100, discountedPrice: 90, sku: "SM-MAK-100", stockQuantity: 60 },
      { id: "v-mk-250", weight: "250g", originalPrice: 240, discountedPrice: 210, sku: "SM-MAK-250", stockQuantity: 60 },
    ],
  },
  {
    id: "prod-chia",
    name: "Organic Raw Chia Seeds",
    slug: "chia-seeds",
    description: "Premium organic chia seeds. High in fiber and naturally clean. Perfect to mix in water, smoothies, yogurts, or breakfasts.",
    categoryId: "cat-snacks",
    originalPrice: 140,
    discountedPrice: 120,
    sku: "SM-CHI-007",
    stockQuantity: 90,
    stockStatus: "IN_STOCK",
    isBestseller: false,
    isNewArrival: false,
    isActive: true,
    images: [{ url: "/images/collection_seeds.jpg", isPrimary: true }],
    variants: [
      { id: "v-ch-200", weight: "200g", originalPrice: 140, discountedPrice: 120, sku: "SM-CHI-200", stockQuantity: 40 },
      { id: "v-ch-500", weight: "500g", originalPrice: 320, discountedPrice: 280, sku: "SM-CHI-500", stockQuantity: 50 },
    ],
  },
  {
    id: "prod-trailmix",
    name: "Daily Energy Trail Mix",
    slug: "daily-trail-mix",
    description: "A premium combination of almonds, cashews, pistachios, pumpkin seeds, cranberries, and raisins. Designed for natural energy.",
    categoryId: "cat-snacks",
    originalPrice: 299,
    discountedPrice: 269,
    sku: "SM-TRM-012",
    stockQuantity: 80,
    stockStatus: "IN_STOCK",
    isBestseller: true,
    isNewArrival: false,
    isActive: true,
    images: [{ url: "/images/collection_seeds.jpg", isPrimary: true }],
    variants: [
      { id: "v-tm-250", weight: "250g", originalPrice: 299, discountedPrice: 269, sku: "SM-TRM-250", stockQuantity: 40 },
      { id: "v-tm-500", weight: "500g", originalPrice: 570, discountedPrice: 520, sku: "SM-TRM-500", stockQuantity: 40 },
    ],
  },
  {
    id: "prod-roastednuts",
    name: "Gourmet Roasted Almonds & Cashews Mix",
    slug: "roasted-nuts-mix",
    description: "Lightly roasted premium almonds and cashews tossed with a touch of Himalayan rock salt for a delicious, healthy snack.",
    categoryId: "cat-snacks",
    originalPrice: 349,
    discountedPrice: 319,
    sku: "SM-RNM-013",
    stockQuantity: 95,
    stockStatus: "IN_STOCK",
    isBestseller: false,
    isNewArrival: true,
    isActive: true,
    images: [{ url: "/images/collection_seeds.jpg", isPrimary: true }],
    variants: [
      { id: "v-rn-200", weight: "200g", originalPrice: 349, discountedPrice: 319, sku: "SM-RNM-200", stockQuantity: 50 },
      { id: "v-rn-400", weight: "400g", originalPrice: 650, discountedPrice: 590, sku: "SM-RNM-400", stockQuantity: 45 },
    ],
  },
];

// 3. Testimonials
export const TESTIMONIALS: Testimonial[] = [
  {
    id: "test-1",
    name: "Anjali Sharma",
    rating: 5,
    review: "Absolutely outstanding quality. The jumbo walnuts are light colored and very fresh. Best shop in Ujjain for dry fruit shopping!",
    isFeatured: true,
    isGoogleReview: false,
  },
  {
    id: "test-2",
    name: "Rajesh Sethi",
    rating: 5,
    review: "Ordered dry fruits for family celebrations. The nut selection and packaging were exceptionally clean and crisp.",
    isFeatured: true,
    isGoogleReview: false,
  },
  {
    id: "test-3",
    name: "Dr. Sandeep Vyas",
    rating: 5,
    review: "I buy almonds and roasted salted pistachios regularly. Sourced fresh, hygienic packaging, and prompt home delivery service in Ujjain.",
    isFeatured: true,
    isGoogleReview: false,
  },
];

// 4. Blog Posts
export const BLOG_POSTS: BlogPost[] = BLOG_POSTS_DATA;

// 5. Default Settings
export const DEFAULT_SETTINGS: Record<string, string> = {
  store_name: "ShubhMewa",
  business_name: "ShubhMewa",
  announcement_text: "🚚 Free Delivery in Ujjain on orders above ₹399! | Full Refund & Replacement Available",
  announcement_active: "true",
  whatsapp_number: "8982010210",
  contact_phone: "8982010210",
  contact_email: "info@shubhmewa.com",
  store_address: "Shop No. 5, Gali No. 4, Tilak Marg, Dev Sahab Ki Gali, Fawara Chowk, Daulat Ganj, Ujjain, Madhya Pradesh",
  store_timings: "10:00 AM - 09:30 PM (All Days Open)",
  google_maps_link: "https://maps.google.com/?q=Shop+No.+5,+Gali+No.+4,+Tilak+Marg,+Fawara+Chowk,+Daulat+Ganj,+Ujjain",
  instagram_link: "https://instagram.com/shubhmewa",
  footer_credit: "Designed and Powered by ShubhMewa",
  online_checkout_active: "true",
  hero_title: "Premium Dry Fruits. Packed Fresh. Delivered with Care.",
  hero_subtitle: "ShubhMewa brings carefully selected premium dry fruits, crunchy makhana, and nutritious healthy seeds directly to your doorstep.",
  free_shipping_threshold: "399",
  shiprocket_channel_id: "1196285411962854"
};
