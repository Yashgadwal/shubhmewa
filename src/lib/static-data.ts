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

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  featuredImage: string;
  categoryName: string;
  tags: string;
  status: string;
  publishDate: string;
  seoDescription?: string | null;
}

// 1. Categories
export const CATEGORIES: Category[] = [
  {
    id: "cat-dry-fruits",
    name: "Premium Dry Fruits",
    slug: "dry-fruits",
    description: "Hand-sorted jumbo nuts sourced from the finest origins worldwide.",
    image: "/images/product_almond.jpg",
    displayOrder: 1,
    isActive: true,
  },
  {
    id: "cat-seeds",
    name: "Organic Seeds",
    slug: "seeds",
    description: "Nutrient-rich natural seeds packed with healthy fats and fiber.",
    image: "/images/collection_seeds.jpg",
    displayOrder: 2,
    isActive: true,
  },
  {
    id: "cat-spices",
    name: "Exotic Spices",
    slug: "spices",
    description: "Pure, aromatic, unprocessed spices to elevate daily nutrition.",
    image: "/images/shop_jars.jpg",
    displayOrder: 3,
    isActive: true,
  },
  {
    id: "cat-hampers",
    name: "Luxury Hampers",
    slug: "hampers",
    description: "Custom-engraved wooden and velvet hampers for gifting.",
    image: "/images/hamper_festive.jpg",
    displayOrder: 4,
    isActive: true,
  },
];

// 2. Products
export const PRODUCTS: Product[] = [
  {
    id: "prod-almond",
    name: "California Jumbo Almonds (Badam)",
    slug: "jumbo-almonds",
    description: "These premium California almonds are high in protein, healthy fats, and vitamin E. Perfectly dried, uniform size, and crunchiness in every bite. Selected with care for families in Ujjain.",
    categoryId: "cat-dry-fruits",
    originalPrice: 280,
    discountedPrice: 260,
    sku: "DF-ALM-001",
    stockQuantity: 150,
    stockStatus: "IN_STOCK",
    isBestseller: true,
    isNewArrival: false,
    isActive: true,
    benefits: "Improves heart health, promotes brain function, rich in antioxidants",
    shelfLife: "6 Months",
    deliveryInfo: "Same-day home delivery in Ujjain",
    storageInstructions: "Store in an airtight container in a cool, dry place.",
    images: [{ url: "/images/product_almond.jpg", isPrimary: true }],
    variants: [
      { id: "v-al-250", weight: "250g", originalPrice: 280, discountedPrice: 260, sku: "DF-ALM-250", stockQuantity: 50 },
      { id: "v-al-500", weight: "500g", originalPrice: 550, discountedPrice: 500, sku: "DF-ALM-500", stockQuantity: 60 },
      { id: "v-al-1kg", weight: "1kg", originalPrice: 1080, discountedPrice: 980, sku: "DF-ALM-1KG", stockQuantity: 40 },
    ],
  },
  {
    id: "prod-cashew",
    name: "King Size Cashews (Kaju) W240",
    slug: "king-cashews",
    description: "Rich, creamy, and wholesome premium cashews. Zero cholesterol, zero trans fats. Ideal for festive sweets, daily energy snacking, and special celebrations.",
    categoryId: "cat-dry-fruits",
    originalPrice: 320,
    discountedPrice: 300,
    sku: "DF-CSW-002",
    stockQuantity: 120,
    stockStatus: "IN_STOCK",
    isBestseller: true,
    isNewArrival: false,
    isActive: true,
    benefits: "Boosts immunity, supports bone density, loaded with magnesium",
    shelfLife: "6 Months",
    deliveryInfo: "Same-day delivery in Ujjain",
    storageInstructions: "Store in a cool dry container away from direct sunlight.",
    images: [{ url: "/images/product_cashew.jpg", isPrimary: true }],
    variants: [
      { id: "v-cs-250", weight: "250g", originalPrice: 320, discountedPrice: 300, sku: "DF-CSW-250", stockQuantity: 40 },
      { id: "v-cs-500", weight: "500g", originalPrice: 620, discountedPrice: 580, sku: "DF-CSW-500", stockQuantity: 50 },
      { id: "v-cs-1kg", weight: "1kg", originalPrice: 1220, discountedPrice: 1140, sku: "DF-CSW-1KG", stockQuantity: 30 },
    ],
  },
  {
    id: "prod-pistachio",
    name: "Roasted & Salted Iranian Pistachios",
    slug: "salted-pistachios",
    description: "Perfect split-shell salted pistachios roasted uniformly. Features a delightful crunch and balanced saltiness. A premium high-protein snack for healthy living.",
    categoryId: "cat-dry-fruits",
    originalPrice: 350,
    discountedPrice: 330,
    sku: "DF-PST-003",
    stockQuantity: 90,
    stockStatus: "IN_STOCK",
    isBestseller: false,
    isNewArrival: true,
    isActive: true,
    benefits: "High protein, great for weight management, fiber-rich",
    shelfLife: "6 Months",
    deliveryInfo: "Same-day delivery in Ujjain",
    storageInstructions: "Seal immediately after opening to keep crunchy.",
    images: [{ url: "/images/product_pistachio.jpg", isPrimary: true }],
    variants: [
      { id: "v-ps-250", weight: "250g", originalPrice: 350, discountedPrice: 330, sku: "DF-PST-250", stockQuantity: 30 },
      { id: "v-ps-500", weight: "500g", originalPrice: 680, discountedPrice: 640, sku: "DF-PST-500", stockQuantity: 40 },
      { id: "v-ps-1kg", weight: "1kg", originalPrice: 1340, discountedPrice: 1240, sku: "DF-PST-1KG", stockQuantity: 20 },
    ],
  },
  {
    id: "prod-walnut",
    name: "Chilean Extra Light Walnut Kernels (Akhrot)",
    slug: "premium-walnuts",
    description: "Premium Chilean walnut halves. Superb flavor with a mild, buttery taste and zero bitterness. Rich in Omega-3 fatty acids, making them perfect for healthy hearts.",
    categoryId: "cat-dry-fruits",
    originalPrice: 400,
    discountedPrice: 370,
    sku: "DF-WLN-004",
    stockQuantity: 80,
    stockStatus: "IN_STOCK",
    isBestseller: true,
    isNewArrival: false,
    isActive: true,
    benefits: "Omega-3 powerhouse, excellent for brain health, reduces cholesterol",
    shelfLife: "6 Months",
    deliveryInfo: "Same-day delivery in Ujjain",
    storageInstructions: "Store in a cool dry airtight jar. Refrigeration recommended for long use.",
    images: [{ url: "/images/product_walnut.jpg", isPrimary: true }],
    variants: [
      { id: "v-wl-250", weight: "250g", originalPrice: 400, discountedPrice: 370, sku: "DF-WLN-250", stockQuantity: 30 },
      { id: "v-wl-500", weight: "500g", originalPrice: 780, discountedPrice: 720, sku: "DF-WLN-500", stockQuantity: 30 },
      { id: "v-wl-1kg", weight: "1kg", originalPrice: 1540, discountedPrice: 1400, sku: "DF-WLN-1KG", stockQuantity: 20 },
    ],
  },
  {
    id: "prod-raisins",
    name: "Kishmish / Afghan Long Raisins",
    slug: "long-raisins",
    description: "Sweet, soft, and long green raisins imported from Afghanistan. Naturally sun-dried without added sulfur, providing clean energy and fibers.",
    categoryId: "cat-dry-fruits",
    originalPrice: 180,
    discountedPrice: 160,
    sku: "DF-RSN-005",
    stockQuantity: 110,
    stockStatus: "IN_STOCK",
    isBestseller: false,
    isNewArrival: false,
    isActive: true,
    images: [{ url: "/images/product_raisin.jpg", isPrimary: true }],
    variants: [
      { id: "v-rs-250", weight: "250g", originalPrice: 180, discountedPrice: 160, sku: "DF-RSN-250", stockQuantity: 40 },
      { id: "v-rs-500", weight: "500g", originalPrice: 340, discountedPrice: 300, sku: "DF-RSN-500", stockQuantity: 40 },
      { id: "v-rs-1kg", weight: "1kg", originalPrice: 650, discountedPrice: 580, sku: "DF-RSN-1KG", stockQuantity: 30 },
    ],
  },
  {
    id: "prod-dates",
    name: "Medjool Premium King Dates (Khajoor)",
    slug: "medjool-dates",
    description: "Referred to as the king of dates, our Medjool dates are large, soft, and incredibly sweet. Sourced fresh, they serve as a nutritious replacement for sugar.",
    categoryId: "cat-dry-fruits",
    originalPrice: 420,
    discountedPrice: 390,
    sku: "DF-DAT-006",
    stockQuantity: 70,
    stockStatus: "IN_STOCK",
    isBestseller: false,
    isNewArrival: true,
    isActive: true,
    images: [{ url: "/images/product_dates.jpg", isPrimary: true }],
    variants: [
      { id: "v-dt-250", weight: "250g", originalPrice: 420, discountedPrice: 390, sku: "DF-DAT-250", stockQuantity: 20 },
      { id: "v-dt-500", weight: "500g", originalPrice: 800, discountedPrice: 750, sku: "DF-DAT-500", stockQuantity: 30 },
      { id: "v-dt-1kg", weight: "1kg", originalPrice: 1550, discountedPrice: 1450, sku: "DF-DAT-1KG", stockQuantity: 20 },
    ],
  },
  {
    id: "prod-chia",
    name: "Organic Raw Chia Seeds",
    slug: "chia-seeds",
    description: "Premium fiber-rich chia seeds. High in calcium, iron, and loaded with antioxidants. Ideal to mix in water, smoothies, yogurts, or oatmeal breakfasts.",
    categoryId: "cat-seeds",
    originalPrice: 140,
    discountedPrice: 120,
    sku: "SD-CHI-007",
    stockQuantity: 90,
    stockStatus: "IN_STOCK",
    isBestseller: false,
    isNewArrival: false,
    isActive: true,
    images: [{ url: "/images/collection_seeds.jpg", isPrimary: true }],
    variants: [
      { id: "v-ch-200", weight: "200g", originalPrice: 140, discountedPrice: 120, sku: "SD-CHI-200", stockQuantity: 40 },
      { id: "v-ch-500", weight: "500g", originalPrice: 320, discountedPrice: 280, sku: "SD-CHI-500", stockQuantity: 50 },
    ],
  },
  {
    id: "prod-saffron",
    name: "Kashmiri Mongra Saffron (Kesar) Grade A+",
    slug: "premium-saffron",
    description: "100% natural, deep red Kashmiri Mongra Saffron threads. Picked selectively from Pampore fields. Provides intense color, aroma, and unmatched flavor.",
    categoryId: "cat-spices",
    originalPrice: 350,
    discountedPrice: 320,
    sku: "SP-KES-008",
    stockQuantity: 100,
    stockStatus: "IN_STOCK",
    isBestseller: true,
    isNewArrival: true,
    isActive: true,
    images: [{ url: "/images/shop_jars.jpg", isPrimary: true }],
    variants: [
      { id: "v-sf-1g", weight: "1g", originalPrice: 350, discountedPrice: 320, sku: "SP-KES-1G", stockQuantity: 60 },
      { id: "v-sf-5g", weight: "5g", originalPrice: 1650, discountedPrice: 1500, sku: "SP-KES-5G", stockQuantity: 40 },
    ],
  },
];

// 3. Testimonials
export const TESTIMONIALS: Testimonial[] = [
  {
    id: "test-1",
    name: "Anjali Sharma",
    rating: 5,
    review: "Absolutely outstanding quality. The jumbo walnuts are light colored and very fresh. Best shop in Ujjain for dry fruit gifting!",
    isFeatured: true,
    isGoogleReview: false,
  },
  {
    id: "test-2",
    name: "Rajesh Sethi",
    rating: 5,
    review: "Ordered 120 custom wooden dry fruit boxes for my daughter's wedding return favors. The engravings and nut selections were elegant.",
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
export const BLOG_POSTS: BlogPost[] = [
  {
    id: "blog-1",
    title: "10 Health Benefits of Eating Almonds Daily",
    slug: "benefits-of-almonds",
    content: "### Almonds: A Nutrition Powerhouse\n\nAlmonds are packed with essential vitamins, minerals, and healthy fats that offer immense benefits for our daily health. Eating just a handful (about 25-30g) of soaked almonds every morning can help boost your body in various ways:\n\n### 1. Rich in Antioxidants\nAlmonds are a fantastic source of antioxidants, which help protect your cells from oxidative stress and slow down aging.\n\n### 2. High in Vitamin E\nVitamin E is a fat-soluble antioxidant that builds up in cell membranes, protecting them from damage and keeping your skin glowing.\n\n### 3. Regulates Blood Sugar\nLoaded with magnesium, almonds help manage insulin sensitivities and blood sugar levels, making them highly beneficial for individuals with diabetes.\n\n- Eat them soaked in the morning.\n- Keep shells off if you want easier digestion.\n- Add to breakfasts or smoothies daily.",
    featuredImage: "/images/product_almond.jpg",
    categoryName: "Healthy Living",
    tags: "almonds, nutrition, health",
    status: "PUBLISHED",
    publishDate: "2026-08-01T00:00:00.000Z",
  },
  {
    id: "blog-2",
    title: "How to Design the Perfect Dry Fruit Gift Hamper",
    slug: "gifting-hamper-guide",
    content: "### Elevating Festive Gifting with Custom Hampers\n\nGifting represents tradition, gratitude, and care. Designing a custom dry fruit hamper is a wonderful way to convey these feelings:\n\n### 1. Choose the Right Box\nSelect from wooden laser-engraved trays, soft velvet boxes, or designer jar sets based on the occasion.\n\n### 2. Balance the Mix\nIncorporate classic jumbo almonds and cashews, salted crunchy pistachios, sweet Medjool dates, and premium Saffron threads for color.\n\n### 3. Personalize It\nAdd a hand-written note or custom laser-engraving with the family name to show extra attention.",
    featuredImage: "/images/hamper_festive.jpg",
    categoryName: "Gifting Guide",
    tags: "gifting, hampers, wedding, festival",
    status: "PUBLISHED",
    publishDate: "2026-08-05T00:00:00.000Z",
  },
];

// 5. Default Settings
export const DEFAULT_SETTINGS: Record<string, string> = {
  store_name: "ShubhMewa",
  business_name: "ShubhMewa",
  announcement_text: "🎉 Free local delivery in Ujjain on orders above ₹999",
  announcement_active: "true",
  whatsapp_number: "919876543210",
  contact_phone: "+91 98765 43210",
  contact_email: "info@shubhmewa.com",
  store_address: "55, Fawara Chowk, Daulat Ganj, Ujjain, Madhya Pradesh, India - 456001",
  store_timings: "10:00 AM - 09:30 PM (All Days Open)",
  google_maps_link: "https://maps.google.com/?q=55,+Fawara+Chowk,+Daulat+Ganj,+Ujjain",
  instagram_link: "https://instagram.com/shubhmewa",
  footer_credit: "Designed and Powered by ShubhMewa",
  online_checkout_active: "true",
  hero_title: "Premium Dry Fruits, Delivered with Trust.",
  hero_subtitle: "Discover carefully selected dry fruits, healthy seeds, and premium gift hampers packed fresh for you.",
};
