const { PrismaClient } = require("@prisma/client");
const crypto = require("crypto");

const prisma = new PrismaClient();

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .createHmac("sha256", salt)
    .update(password)
    .digest("hex");
  return `${salt}:${hash}`;
}

async function main() {
  console.log("Seeding database...");

  // 1. Clean existing database records
  await prisma.activityLog.deleteMany({});
  await prisma.contactSubmission.deleteMany({});
  await prisma.deliveryArea.deleteMany({});
  await prisma.websiteSetting.deleteMany({});
  await prisma.banner.deleteMany({});
  await prisma.coupon.deleteMany({});
  await prisma.blogPost.deleteMany({});
  await prisma.blogCategory.deleteMany({});
  await prisma.testimonial.deleteMany({});
  await prisma.enquiry.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.productImage.deleteMany({});
  await prisma.productVariant.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.adminUser.deleteMany({});

  // 2. Admin User
  const admin = await prisma.adminUser.create({
    data: {
      email: "admin@harshildryfruits.com",
      name: "Harshil Gupta",
      passwordHash: hashPassword("harshiladmin"),
      role: "ADMIN",
    },
  });
  console.log("Seeded admin user: admin@harshildryfruits.com / harshiladmin");

  // 3. Categories
  const categoriesData = [
    { name: "Almonds", slug: "almonds", description: "Premium raw and roasted badam", image: "/images/product_almond.jpg" },
    { name: "Cashews", slug: "cashews", description: "Creamy white whole kaju", image: "/images/product_cashew.jpg" },
    { name: "Pistachios", slug: "pistachios", description: "Salted and roasted pista", image: "/images/product_pistachio.jpg" },
    { name: "Walnuts", slug: "walnuts", description: "Kashmiri akhrot halves", image: "/images/product_walnut.jpg" },
    { name: "Raisins", slug: "raisins", description: "Sweet golden and black kishmish", image: "/images/product_raisin.jpg" },
    { name: "Dates", slug: "dates", description: "Soft Medjool and premium khajoor", image: "/images/product_dates.jpg" },
    { name: "Seeds", slug: "seeds", description: "Nutritious raw seeds mix", image: "/images/collection_seeds.jpg" },
    { name: "Gift Hampers", slug: "hampers", description: "Custom and luxury gift boxes", image: "/images/hamper_festive.jpg" },
  ];

  const categories = {};
  for (const cat of categoriesData) {
    categories[cat.slug] = await prisma.category.create({ data: cat });
  }
  console.log("Seeded categories");

  // 4. Products and variants
  const productsData = [
    {
      name: "Premium California Almonds (Jumbo Badam)",
      slug: "premium-california-almonds",
      description: "Directly imported from California, our Jumbo sized almonds are rich in protein, fibre, and healthy fats. Handpicked, crunchy, and perfect for your daily nutrition intake.",
      categoryId: categories["almonds"].id,
      originalPrice: 450,
      discountedPrice: 399,
      discountPercent: 11,
      sku: "ALM-CA-001",
      stockQuantity: 150,
      isBestseller: true,
      isNewArrival: false,
      benefits: "Improves brain health, Rich in Vitamin E, Lowers cholesterol, Great for weight management",
      storageInstructions: "Store in a cool, dry place in an airtight container. Refrigeration is recommended for longer shelf life.",
      shelfLife: "6 Months",
      deliveryInfo: "Ships within 24 hours. Local home delivery in Ujjain within 4-6 hours.",
      seoTitle: "Buy Premium California Almonds (Badam) Online Ujjain | Harshil Dry Fruits",
      seoDescription: "Shop jumbo sized California almonds online in Ujjain. Healthy, handpicked, and hygienically packed. Fast delivery available.",
      images: ["/images/product_almond.jpg", "/images/macro_dry_fruit.jpg"],
      variants: [
        { weight: "250g", originalPrice: 240, discountedPrice: 210, sku: "ALM-CA-250G", stockQuantity: 50 },
        { weight: "500g", originalPrice: 450, discountedPrice: 399, sku: "ALM-CA-500G", stockQuantity: 60 },
        { weight: "1kg", originalPrice: 880, discountedPrice: 770, sku: "ALM-CA-1KG", stockQuantity: 40 },
      ]
    },
    {
      name: "Royal W180 King Cashews (Kaju)",
      slug: "royal-w180-king-cashews",
      description: "Widely known as the 'King of Cashews', W180 nuts are the largest size available. Creamy, sweet, and incredibly white. Sourced from the finest farms and hygienically packed.",
      categoryId: categories["cashews"].id,
      originalPrice: 650,
      discountedPrice: 599,
      discountPercent: 8,
      sku: "CAS-W180-001",
      stockQuantity: 100,
      isBestseller: true,
      isNewArrival: false,
      benefits: "Heart healthy fats, Rich in Magnesium, Boosts immune system, Promotes skin and hair health",
      storageInstructions: "Keep in airtight containers away from direct sunlight. Store in refrigerator to maintain crispness.",
      shelfLife: "6 Months",
      deliveryInfo: "Ships within 24 hours. Same-day Ujjain delivery.",
      seoTitle: "Order King Size W180 Cashews (Kaju) Online Ujjain",
      seoDescription: "Get the largest, premium-grade W180 cashews delivered to your door in Ujjain. Best quality guaranteed.",
      images: ["/images/product_cashew.jpg"],
      variants: [
        { weight: "250g", originalPrice: 340, discountedPrice: 310, sku: "CAS-W180-250G", stockQuantity: 30 },
        { weight: "500g", originalPrice: 650, discountedPrice: 599, sku: "CAS-W180-500G", stockQuantity: 40 },
        { weight: "1kg", originalPrice: 1250, discountedPrice: 1150, sku: "CAS-W180-1KG", stockQuantity: 30 },
      ]
    },
    {
      name: "Salted & Roasted Iranian Pistachios (Pista)",
      slug: "salted-roasted-iranian-pistachios",
      description: "Crunchy, roasted Iranian pistachios lightly salted to perfection. Excellent source of healthy fats, fiber, protein, and antioxidants. A highly addictive healthy snack.",
      categoryId: categories["pistachios"].id,
      originalPrice: 550,
      discountedPrice: 499,
      discountPercent: 9,
      sku: "PIS-IR-001",
      stockQuantity: 80,
      isBestseller: false,
      isNewArrival: true,
      benefits: "Loaded with antioxidants, Low in calories yet high in protein, Promotes healthy gut bacteria",
      storageInstructions: "Seal the bag or container after use to prevent moisture. Keep in dry environments.",
      shelfLife: "4 Months",
      deliveryInfo: "Standard shipping or local Ujjain pickup available.",
      seoTitle: "Buy Roasted Salted Iranian Pistachios (Pista) in Ujjain",
      seoDescription: "Shop premium quality salted roasted Iranian pistachios online in Ujjain. Hand-selected crack-open pistachios.",
      images: ["/images/product_pistachio.jpg"],
      variants: [
        { weight: "250g", originalPrice: 290, discountedPrice: 260, sku: "PIS-IR-250G", stockQuantity: 40 },
        { weight: "500g", originalPrice: 550, discountedPrice: 499, sku: "PIS-IR-500G", stockQuantity: 40 },
      ]
    },
    {
      name: "Kashmiri Snow White Walnut Halves (Akhrot)",
      slug: "kashmiri-snow-white-walnuts",
      description: "Directly sourced from Kashmir valleys, these extra light snow-white walnut halves are highly premium. Brain-shaped nut halves rich in Omega-3 fatty acids.",
      categoryId: categories["walnuts"].id,
      originalPrice: 700,
      discountedPrice: 599,
      discountPercent: 14,
      sku: "WAL-KAS-001",
      stockQuantity: 90,
      isBestseller: true,
      isNewArrival: false,
      benefits: "Super plant source of Omega-3s, Supports brain function, Regulates blood pressure",
      storageInstructions: "Walnuts easily oxidise due to fats. Store in an airtight container inside the refrigerator or freezer.",
      shelfLife: "6 Months",
      deliveryInfo: "Ships within 24 hours. Local delivery available.",
      seoTitle: "Premium Kashmiri Walnut Halves (Akhrot) Online | Ujjain",
      seoDescription: "Savor the buttery taste of extra light Kashmiri walnut halves. High-grade walnuts available at Harshil Dry Fruits Ujjain.",
      images: ["/images/product_walnut.jpg", "/images/lifestyle_breakfast.jpg"],
      variants: [
        { weight: "250g", originalPrice: 360, discountedPrice: 310, sku: "WAL-KAS-250G", stockQuantity: 30 },
        { weight: "500g", originalPrice: 700, discountedPrice: 599, sku: "WAL-KAS-500G", stockQuantity: 40 },
        { weight: "1kg", originalPrice: 1350, discountedPrice: 1150, sku: "WAL-KAS-1KG", stockQuantity: 20 },
      ]
    },
    {
      name: "Premium Afghan Long Golden Raisins (Kishmish)",
      slug: "premium-afghan-long-raisins",
      description: "Elongated golden raisins imported from Afghanistan. Soft, chewy, sweet, and perfectly clean. High in iron and natural sugars.",
      categoryId: categories["raisins"].id,
      originalPrice: 220,
      discountedPrice: 199,
      discountPercent: 9,
      sku: "RAI-AF-001",
      stockQuantity: 200,
      isBestseller: false,
      isNewArrival: false,
      benefits: "Improves digestion, Helps treat anaemia, Relieves acidity, Boosts physical energy",
      storageInstructions: "Store in a cool dry pantry. Keep away from humidity.",
      shelfLife: "9 Months",
      deliveryInfo: "Instant local delivery in Ujjain.",
      seoTitle: "Buy Long Golden Afghan Raisins (Kishmish) in Ujjain",
      seoDescription: "Order sweet, long Afghan raisins online. Hygienically cleaned and packed in Ujjain.",
      images: ["/images/product_raisin.jpg"],
      variants: [
        { weight: "250g", originalPrice: 120, discountedPrice: 110, sku: "RAI-AF-250G", stockQuantity: 100 },
        { weight: "500g", originalPrice: 220, discountedPrice: 199, sku: "RAI-AF-500G", stockQuantity: 100 },
      ]
    },
    {
      name: "Royal Medjool Dates (Premium Khajoor)",
      slug: "royal-medjool-dates",
      description: "Fleshy, soft, large-sized Medjool dates imported from Jordan. Known as the 'Fruit of Kings', these dates have a rich, caramel-like taste and a soft texture.",
      categoryId: categories["dates"].id,
      originalPrice: 900,
      discountedPrice: 799,
      discountPercent: 11,
      sku: "DAT-MED-001",
      stockQuantity: 70,
      isBestseller: true,
      isNewArrival: true,
      benefits: "Instant energy source, Rich in dietary fiber, Excellent natural sweetener, High in potassium",
      storageInstructions: "Store in a refrigerator for maintaining moisture and soft texture.",
      shelfLife: "8 Months",
      deliveryInfo: "Premium packaging. Safe delivery.",
      seoTitle: "Buy Royal Medjool Dates (Khajoor) in Ujjain",
      seoDescription: "Order premium Jordan Medjool dates online. Sweet, fleshy, and loaded with energy. Delivery in Ujjain.",
      images: ["/images/product_dates.jpg"],
      variants: [
        { weight: "500g", originalPrice: 900, discountedPrice: 799, sku: "DAT-MED-500G", stockQuantity: 45 },
        { weight: "1kg", originalPrice: 1750, discountedPrice: 1499, sku: "DAT-MED-1KG", stockQuantity: 25 },
      ]
    },
    {
      name: "Super Healthy Seeds Collection (5-in-1 Mix)",
      slug: "healthy-seeds-collection",
      description: "A superfood blend containing premium raw Pumpkin seeds, Sunflower seeds, Flax seeds, Chia seeds, and Watermelon seeds. Perfect for keto diets, breakfast toppings, or snacking.",
      categoryId: categories["seeds"].id,
      originalPrice: 300,
      discountedPrice: 249,
      discountPercent: 17,
      sku: "SED-MX-001",
      stockQuantity: 120,
      isBestseller: false,
      isNewArrival: false,
      benefits: "High in Omega-3 & Zinc, Promotes heart health, Boosts digestion, Great for daily fiber",
      storageInstructions: "Store in an airtight jar. Keep in a dry place.",
      shelfLife: "6 Months",
      deliveryInfo: "Packaged in reusable stand-up pouches.",
      seoTitle: "Buy Organic 5-in-1 Seeds Mix Online Ujjain",
      seoDescription: "Premium seeds mix featuring pumpkin, chia, flax, and sunflower seeds. Order online in Ujjain.",
      images: ["/images/collection_seeds.jpg"],
      variants: [
        { weight: "250g", originalPrice: 160, discountedPrice: 135, sku: "SED-MX-250G", stockQuantity: 60 },
        { weight: "500g", originalPrice: 300, discountedPrice: 249, sku: "SED-MX-500G", stockQuantity: 60 },
      ]
    },
    {
      name: "Royal Diwali Dry Fruit Gift Hamper",
      slug: "royal-diwali-gift-hamper",
      description: "Celebrate relationships with our premium luxury festive hamper. Elegantly curated set containing 4 designer glass jars filled with California Almonds, King Cashews, Salted Pistachios, and Kashmiri Walnut Halves, tied with a signature gold ribbon.",
      categoryId: categories["hampers"].id,
      originalPrice: 1800,
      discountedPrice: 1499,
      discountPercent: 16,
      sku: "HAM-DIW-001",
      stockQuantity: 50,
      isBestseller: true,
      isNewArrival: true,
      benefits: "Premium quality assurance, Beautiful reusable laser-cut box, Ideal for festival gifting",
      storageInstructions: "Store individual jars in a dry place. Keep airtight.",
      shelfLife: "6 Months",
      deliveryInfo: "Packed securely in high-end shipping carton. Hand delivery available in Ujjain.",
      seoTitle: "Luxury Diwali Dry Fruit Gift Hamper Ujjain",
      seoDescription: "Order premium Diwali dry fruit boxes and hampers. Custom engraving and bulk delivery in Ujjain.",
      images: ["/images/hamper_festive.jpg", "/images/gift_packaging.jpg"],
      variants: [
        { weight: "Standard (1kg)", originalPrice: 1800, discountedPrice: 1499, sku: "HAM-DIW-STD", stockQuantity: 50 },
      ]
    },
    {
      name: "Luxury Wedding Gifting Hamper Box",
      slug: "luxury-wedding-gift-box",
      description: "Make your wedding day memorable for your guests. Custom designer wood-finished boxes containing premium quality dry fruits, dry date varieties, and saffron strands. Completely customizable.",
      categoryId: categories["hampers"].id,
      originalPrice: 2500,
      discountedPrice: 2200,
      discountPercent: 12,
      sku: "HAM-WED-001",
      stockQuantity: 30,
      isBestseller: false,
      isNewArrival: false,
      benefits: "Fully customizable with family monogram, Royal red velvet interior casing, Premium grade nuts",
      storageInstructions: "Store in dry room temperature.",
      shelfLife: "6 Months",
      deliveryInfo: "Bulk order shipping rules apply. Lead time of 7-10 days for customized engraving.",
      seoTitle: "Custom Wedding Dry Fruit Hamper Boxes Ujjain",
      seoDescription: "Sourcing premium wedding return gifts and dry fruit hampers in Ujjain. Elegant wood laser engraving options.",
      images: ["/images/hamper_wedding.jpg"],
      variants: [
        { weight: "Standard Premium", originalPrice: 2500, discountedPrice: 2200, sku: "HAM-WED-STD", stockQuantity: 30 },
      ]
    },
    {
      name: "Elite Corporate Gifting Box",
      slug: "elite-corporate-gifting-box",
      description: "An elegant, matte forest green box featuring gold foil prints, designed for employee appreciation, client gifting, and corporate hampers. Contains California almonds, premium cashews, roasted pistachios, and saffron.",
      categoryId: categories["hampers"].id,
      originalPrice: 1500,
      discountedPrice: 1299,
      discountPercent: 13,
      sku: "HAM-CORP-001",
      stockQuantity: 60,
      isBestseller: false,
      isNewArrival: false,
      benefits: "Empowers professional relationships, custom brand tag slots, hygienic vacuum sealing",
      storageInstructions: "Store in a cool dry office space.",
      shelfLife: "6 Months",
      deliveryInfo: "Individual or multi-address corporate delivery inside Madhya Pradesh.",
      seoTitle: "Premium Corporate Dry Fruit Hampers Ujjain",
      seoDescription: "Partner with Harshil Dry Fruits for elite client and employee gifting. Custom logo embossing.",
      images: ["/images/hamper_corporate.jpg"],
      variants: [
        { weight: "Executive Box", originalPrice: 1500, discountedPrice: 1299, sku: "HAM-CORP-EXE", stockQuantity: 60 },
      ]
    }
  ];

  for (const prodData of productsData) {
    const { images, variants, ...prodFields } = prodData;

    const product = await prisma.product.create({
      data: prodFields,
    });

    // Seed images
    for (let i = 0; i < images.length; i++) {
      await prisma.productImage.create({
        data: {
          productId: product.id,
          url: images[i],
          isPrimary: i === 0,
          displayOrder: i,
        },
      });
    }

    // Seed variants
    for (const variant of variants) {
      await prisma.productVariant.create({
        data: {
          productId: product.id,
          ...variant,
        },
      });
    }
  }
  console.log("Seeded products and variants");

  // 5. Testimonials
  const testimonials = [
    {
      name: "Devendra Sharma",
      rating: 5,
      review: "Ordered 150 wedding gift hampers from Harshil Dry Fruits. The wood carving and laser-engraving were flawless. All guests appreciated the high quality of almonds and cashews. Highly recommended for premium gifts!",
      isFeatured: true,
      isGoogleReview: true,
    },
    {
      name: "Radhika Agrawal",
      rating: 5,
      review: "The quality of Medjool Dates and Jumbo Almonds is superior compared to anything else in Ujjain. Packaging is very premium and clean. WhatsApp order process was fast, got home delivery in 2 hours.",
      isFeatured: true,
      isGoogleReview: false,
    },
    {
      name: "Manish Shah (Tech Solutions)",
      rating: 5,
      review: "Sourced client appreciation boxes for Diwali. The matte green boxes with our gold logo printed looked very elegant. The pricing was fair and delivery was prompt. Great corporate partner.",
      isFeatured: true,
      isGoogleReview: true,
    },
  ];

  for (const t of testimonials) {
    await prisma.testimonial.create({ data: t });
  }
  console.log("Seeded testimonials");

  // 6. Blog categories & posts
  const blogCats = [
    { name: "Nutrition", slug: "nutrition" },
    { name: "Gifting", slug: "gifting" },
    { name: "Storage Tips", slug: "storage-tips" },
  ];

  const catsMap = {};
  for (const c of blogCats) {
    catsMap[c.slug] = await prisma.blogCategory.create({ data: c });
  }

  const blogPosts = [
    {
      title: "Best Dry Fruits for Daily Nutrition & Brain Health",
      slug: "best-dry-fruits-daily-nutrition",
      content: `### Sourcing Your Daily Energy
Investing in your health starts with small, daily changes. Integrating a handful of premium dry fruits into your routine can yield immense benefits.

#### 1. Almonds: The Mind Powerhouse
Almonds are high in Vitamin E, which acts as a powerful antioxidant protecting cells from oxidative damage. Studies show they support cognitive function.

#### 2. Walnuts: Omega-3 Rich
Brain-shaped walnuts are rich in ALA (Alpha-Linolenic Acid), a crucial plant-based Omega-3 fatty acid. Essential for heart and cognitive wellness.

#### 3. Pistachios: Protein Snacks
Low in calories but high in essential amino acids, pistachios are the ideal snack for active lifestyles.

*Note: Sourced hygienically by Harshil Dry Fruits in Ujjain.*`,
      featuredImage: "/images/lifestyle_breakfast.jpg",
      categoryId: catsMap["nutrition"].id,
      tags: "nutrition,health,almonds,walnuts",
      status: "PUBLISHED",
      publishDate: new Date(),
      seoTitle: "Top Dry Fruits for Daily Nutrition & Brain Health",
      seoDescription: "Learn about the nutritional profiles and health benefits of almonds, walnuts, and pistachios in our healthy guide.",
    },
    {
      title: "How to Store Dry Fruits Properly to Keep Them Fresh",
      slug: "how-to-store-dry-fruits-properly",
      content: `### Essential Tips for Longevity
Many households experience dry fruits losing their crunch or developing oily odors. Because premium nuts contain natural, healthy oils, they are prone to oxidation when exposed to heat and oxygen.

#### The Golden Rules of Storage:
1. **Airtight Glass Jars**: Standard plastic bags allow air seepage. Use airtight glass containers.
2. **Cool, Dark Pantry**: Heat speeds up rancidity. Keep shelves away from gas stoves.
3. **Refrigeration**: For storage exceeding 2 months, placing walnuts and pine nuts in a sealed bag in the fridge preserves freshness.

Follow these simple rules to ensure your premium cashiers and walnuts remain fresh for months!`,
      featuredImage: "/images/shop_jars.jpg",
      categoryId: catsMap["storage-tips"].id,
      tags: "storage,tips,freshness,glass-jars",
      status: "PUBLISHED",
      publishDate: new Date(),
      seoTitle: "Store Dry Fruits for Long-Lasting Crunch & Freshness",
      seoDescription: "Avoid stale nuts! Read our guide on storing dry fruits inside glass jars and refrigerators to maintain freshness.",
    },
  ];

  for (const post of blogPosts) {
    await prisma.blogPost.create({ data: post });
  }
  console.log("Seeded blog posts");

  // 7. Banners
  const banners = [
    {
      title: "Festive Diwali Hampers",
      subtitle: "Elevate your greetings with gold-ribboned luxury hampers. Custom options available.",
      image: "/images/diwali_banner.jpg",
      link: "/shop?category=hampers",
      section: "FESTIVAL",
      isActive: true,
      displayOrder: 1,
    },
  ];

  for (const b of banners) {
    await prisma.banner.create({ data: b });
  }

  // 8. Coupons
  const coupons = [
    { code: "WELCOME10", type: "PERCENTAGE", value: 10, minOrderValue: 500, isActive: true },
    { code: "HARSHILCOD", type: "FIXED", value: 50, minOrderValue: 1000, isActive: true },
  ];

  for (const c of coupons) {
    await prisma.coupon.create({ data: c });
  }

  // 9. Delivery Areas
  const deliveryAreas = [
    { areaName: "Freeganj, Ujjain", pincode: "456001", minOrderForFreeDelivery: 999, deliveryCharge: 50 },
    { areaName: "Nanakheda, Ujjain", pincode: "456010", minOrderForFreeDelivery: 999, deliveryCharge: 60 },
    { areaName: "Mahakal Area, Ujjain", pincode: "456006", minOrderForFreeDelivery: 500, deliveryCharge: 40 },
  ];

  for (const area of deliveryAreas) {
    await prisma.deliveryArea.create({ data: area });
  }

  // 10. Website Settings
  const settings = [
    { key: "announcement_text", value: "🎉 Free local delivery in Ujjain on orders above ₹999", group: "GENERAL" },
    { key: "announcement_active", value: "true", group: "GENERAL" },
    { key: "whatsapp_number", value: "919876543210", group: "CONTACT" }, // Editable WhatsApp
    { key: "contact_phone", value: "+91 98765 43210", group: "CONTACT" },
    { key: "contact_email", value: "info@harshildryfruits.com", group: "CONTACT" },
    { key: "store_address", value: "12, Freeganj Main Road, Opp. Gold Gym, Ujjain, Madhya Pradesh - 456001", group: "CONTACT" },
    { key: "store_timings", value: "10:00 AM - 09:30 PM (All Days Open)", group: "SHOP_TIMINGS" },
    { key: "google_maps_link", value: "https://maps.google.com/?q=Freeganj+Ujjain", group: "CONTACT" },
    { key: "instagram_link", value: "https://instagram.com/harshildryfruits", group: "CONTACT" },
    { key: "footer_credit", value: "Designed and Powered by Nexora Scale", group: "FOOTER" },
    { key: "online_checkout_active", value: "true", group: "GENERAL" }, // Checkout toggle
    { key: "hero_title", value: "Premium Dry Fruits, Delivered with Trust.", group: "GENERAL" },
    { key: "hero_subtitle", value: "Discover carefully selected dry fruits, healthy seeds and thoughtfully crafted gift hampers for every occasion.", group: "GENERAL" },
  ];

  for (const s of settings) {
    await prisma.websiteSetting.create({ data: s });
  }

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
