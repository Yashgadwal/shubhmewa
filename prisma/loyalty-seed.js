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
  console.log("Seeding loyalty & rewards demo data...");

  // 1. Clear existing loyalty tables to avoid conflicts
  await prisma.visit.deleteMany();
  await prisma.rewardRedemption.deleteMany();
  await prisma.reward.deleteMany();
  await prisma.rewardMilestone.deleteMany();
  await prisma.loyaltyAuditLog.deleteMany();
  await prisma.qrSession.deleteMany();
  await prisma.giftHamper.deleteMany();
  
  // Clear any existing demo customers and users to avoid unique constraint violations
  await prisma.customer.deleteMany({
    where: {
      phone: {
        in: ["9876543210", "9876543211", "9876543212", "9876543213", "9876543214"]
      }
    }
  });

  await prisma.adminUser.deleteMany({
    where: {
      email: {
        in: ["admin@bestquality.in", "manager@bestquality.in", "sunil@bestquality.in"]
      }
    }
  });

  // 2. Add admin, staff, and manager accounts
  const superAdmin = await prisma.adminUser.create({
    data: {
      email: "admin@bestquality.in",
      name: "Super Admin Owner",
      passwordHash: hashPassword("superpassword"),
      role: "SUPER_ADMIN",
    },
  });

  const admin = await prisma.adminUser.create({
    data: {
      email: "manager@bestquality.in",
      name: "Store Manager Amit",
      passwordHash: hashPassword("adminpassword"),
      role: "ADMIN",
    },
  });

  const staff = await prisma.adminUser.create({
    data: {
      email: "sunil@bestquality.in",
      name: "Cashier Sunil",
      passwordHash: hashPassword("staffpassword"),
      role: "STAFF",
    },
  });

  console.log("Admin & Staff accounts seeded.");

  // 3. Add default settings
  const settings = [
    { key: "loyalty_cooldown_hours", value: "24", group: "LOYALTY" },
    { key: "qr_session_duration_seconds", value: "300", group: "LOYALTY" },
    { key: "business_name", value: "M/S Best Quality Dryfruits and Masala House", group: "GENERAL" },
    { key: "store_address", value: "55, Fawara Chowk, Daulat Ganj, Ujjain, Madhya Pradesh, India", group: "GENERAL" },
    { key: "whatsapp_number", value: "919876543210", group: "GENERAL" },
    { key: "google_maps_link", value: "https://maps.google.com/?q=55,+Fawara+Chowk,+Daulat+Ganj,+Ujjain", group: "GENERAL" },
  ];

  for (const s of settings) {
    await prisma.websiteSetting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: s,
    });
  }

  console.log("Settings keys seeded/updated.");

  // 4. Add reward milestones
  const milestones = [
    {
      milestoneVisits: 7,
      rewardName: "₹100 Off Voucher",
      rewardType: "DISCOUNT_AMOUNT",
      rewardValue: 100,
      minPurchase: 500,
      expiryDays: 30,
      description: "Get ₹100 discount on your billing of ₹500 and above. Valid for all dry fruits.",
      isActive: true,
    },
    {
      milestoneVisits: 15,
      rewardName: "₹250 Off Premium Voucher",
      rewardType: "DISCOUNT_AMOUNT",
      rewardValue: 250,
      minPurchase: 1000,
      expiryDays: 45,
      description: "Get ₹250 discount on your billing of ₹1,000 and above. Staff verification required.",
      isActive: true,
    },
    {
      milestoneVisits: 30,
      rewardName: "₹500 Off Premium Gifting Voucher",
      rewardType: "DISCOUNT_AMOUNT",
      rewardValue: 500,
      minPurchase: 2000,
      expiryDays: 60,
      description: "Get ₹500 discount on your billing of ₹2,000 and above. Perfect for gift hampers! Staff verification required.",
      isActive: true,
    },
  ];

  for (const m of milestones) {
    await prisma.rewardMilestone.create({ data: m });
  }

  console.log("Milestones seeded.");

  // 5. Add Customers and their histories
  // Customer 1: Rahul Sharma (5 visits, close to 7th milestone)
  const rahul = await prisma.customer.create({
    data: {
      name: "Rahul Sharma",
      phone: "9876543210",
      pinHash: hashPassword("1234"),
      totalVisits: 5,
      status: "ACTIVE",
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Joined 30 days ago
    },
  });

  // Rahul visits
  for (let i = 1; i <= 5; i++) {
    await prisma.visit.create({
      data: {
        customerId: rahul.id,
        visitNumber: i,
        status: "VALID",
        date: new Date(Date.now() - (30 - i * 5) * 24 * 60 * 60 * 1000), // Visit every 5 days
        notes: "Scan counter QR checkin",
      },
    });
  }

  // Customer 2: Amit Jain (7 visits, ₹100 reward unlocked)
  const amit = await prisma.customer.create({
    data: {
      name: "Amit Jain",
      phone: "9876543211",
      pinHash: hashPassword("1234"),
      totalVisits: 7,
      status: "ACTIVE",
      createdAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000),
    },
  });

  // Amit visits
  for (let i = 1; i <= 7; i++) {
    await prisma.visit.create({
      data: {
        customerId: amit.id,
        visitNumber: i,
        status: "VALID",
        date: new Date(Date.now() - (40 - i * 5) * 24 * 60 * 60 * 1000),
      },
    });
  }

  // Amit's 7-visit reward
  await prisma.reward.create({
    data: {
      code: "BQDH-7X82",
      customerId: amit.id,
      milestoneVisits: 7,
      rewardName: "₹100 Off Voucher",
      amount: 100,
      minPurchase: 500,
      status: "UNLOCKED",
      expiryDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), // Expire in 20 days
      unlockedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    },
  });

  // Customer 3: Priya Sharma (14 visits, 1 left to 15th milestone)
  const priya = await prisma.customer.create({
    data: {
      name: "Priya Sharma",
      phone: "9876543212",
      pinHash: hashPassword("1234"),
      totalVisits: 14,
      status: "ACTIVE",
      createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    },
  });

  for (let i = 1; i <= 14; i++) {
    await prisma.visit.create({
      data: {
        customerId: priya.id,
        visitNumber: i,
        status: "VALID",
        date: new Date(Date.now() - (60 - i * 4) * 24 * 60 * 60 * 1000),
      },
    });
  }

  // Priya's 7th-visit reward (already redeemed)
  const priyaReward7 = await prisma.reward.create({
    data: {
      code: "BQDH-4Y88",
      customerId: priya.id,
      milestoneVisits: 7,
      rewardName: "₹100 Off Voucher",
      amount: 100,
      minPurchase: 500,
      status: "REDEEMED",
      expiryDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      unlockedAt: new Date(Date.now() - 32 * 24 * 60 * 60 * 1000),
      redeemedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      redeemedByStaff: "Cashier Sunil",
    },
  });

  await prisma.rewardRedemption.create({
    data: {
      rewardId: priyaReward7.id,
      customerId: priya.id,
      staffId: staff.id,
      redeemedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      notes: "Redeemed on bill total",
    },
  });

  // Customer 4: Neha Agarwal (15 visits, ₹250 reward unlocked, high-value verification reqd)
  const neha = await prisma.customer.create({
    data: {
      name: "Neha Agarwal",
      phone: "9876543213",
      pinHash: hashPassword("1234"),
      totalVisits: 15,
      status: "ACTIVE",
      createdAt: new Date(Date.now() - 75 * 24 * 60 * 60 * 1000),
    },
  });

  for (let i = 1; i <= 15; i++) {
    await prisma.visit.create({
      data: {
        customerId: neha.id,
        visitNumber: i,
        status: "VALID",
        date: new Date(Date.now() - (75 - i * 4) * 24 * 60 * 60 * 1000),
      },
    });
  }

  // Neha's 7th-visit reward (redeemed)
  const nehaReward7 = await prisma.reward.create({
    data: {
      code: "BQDH-9K23",
      customerId: neha.id,
      milestoneVisits: 7,
      rewardName: "₹100 Off Voucher",
      amount: 100,
      minPurchase: 500,
      status: "REDEEMED",
      expiryDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      unlockedAt: new Date(Date.now() - 47 * 24 * 60 * 60 * 1000),
      redeemedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
      redeemedByStaff: "Store Manager Amit",
    },
  });

  await prisma.rewardRedemption.create({
    data: {
      rewardId: nehaReward7.id,
      customerId: neha.id,
      staffId: admin.id,
      redeemedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
    },
  });

  // Neha's 15th-visit reward (unlocked, high-value)
  await prisma.reward.create({
    data: {
      code: "BQDH-15R2",
      customerId: neha.id,
      milestoneVisits: 15,
      rewardName: "₹250 Off Premium Voucher",
      amount: 250,
      minPurchase: 1000,
      status: "UNLOCKED",
      expiryDate: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
      unlockedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
  });

  // Customer 5: Rohit Jain (29 visits, 1 left to 30th milestone!)
  const rohit = await prisma.customer.create({
    data: {
      name: "Rohit Jain",
      phone: "9876543214",
      pinHash: hashPassword("1234"),
      totalVisits: 29,
      status: "ACTIVE",
      createdAt: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000),
    },
  });

  for (let i = 1; i <= 29; i++) {
    await prisma.visit.create({
      data: {
        customerId: rohit.id,
        visitNumber: i,
        status: "VALID",
        date: new Date(Date.now() - (100 - i * 3) * 24 * 60 * 60 * 1000),
      },
    });
  }

  // Rohit's 7th-visit reward (redeemed)
  const rohitReward7 = await prisma.reward.create({
    data: {
      code: "BQDH-8W43",
      customerId: rohit.id,
      milestoneVisits: 7,
      rewardName: "₹100 Off Voucher",
      amount: 100,
      minPurchase: 500,
      status: "REDEEMED",
      expiryDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
      unlockedAt: new Date(Date.now() - 79 * 24 * 60 * 60 * 1000),
      redeemedAt: new Date(Date.now() - 75 * 24 * 60 * 60 * 1000),
      redeemedByStaff: "Cashier Sunil",
    },
  });
  
  await prisma.rewardRedemption.create({
    data: {
      rewardId: rohitReward7.id,
      customerId: rohit.id,
      staffId: staff.id,
      redeemedAt: new Date(Date.now() - 75 * 24 * 60 * 60 * 1000),
    },
  });

  // Rohit's 15th-visit reward (redeemed)
  const rohitReward15 = await prisma.reward.create({
    data: {
      code: "BQDH-2D88",
      customerId: rohit.id,
      milestoneVisits: 15,
      rewardName: "₹250 Off Premium Voucher",
      amount: 250,
      minPurchase: 1000,
      status: "REDEEMED",
      expiryDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      unlockedAt: new Date(Date.now() - 55 * 24 * 60 * 60 * 1000),
      redeemedAt: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000),
      redeemedByStaff: "Store Manager Amit",
    },
  });

  await prisma.rewardRedemption.create({
    data: {
      rewardId: rohitReward15.id,
      customerId: rohit.id,
      staffId: admin.id,
      redeemedAt: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000),
    },
  });

  console.log("Customer profiles (Rahul, Amit, Priya, Neha, Rohit) and visit/reward histories seeded.");

  // 6. Seed Gift Hampers (Prisma Model GiftHamper)
  const hampers = [
    {
      name: "Royal Ujjain Wedding Box",
      description: "Extravagant velvet wedding hamper packed with premium Afghani Anjeer, Iranian Mamra Badam, Salted Jumbo Pistas, and organic saffron threads.",
      startingPrice: 2500,
      images: "/images/hamper_royal.jpg",
      isActive: true,
    },
    {
      name: "Festival Dryfruit Delight",
      description: "Chic handcrafted wooden box filled with Kaju, Almonds, Kishmish, and Munakka. Ideal for Diwali, Rakhi, or corporate gifting.",
      startingPrice: 1200,
      images: "/images/hamper_festival.jpg",
      isActive: true,
    },
    {
      name: "Corporate Premium Hamper",
      description: "Minimalist leather-bound corporate gift pack with mixed dry fruits, salted cashews, and healthy seeds.",
      startingPrice: 1800,
      images: "/images/hamper_corporate.jpg",
      isActive: true,
    },
  ];

  for (const h of hampers) {
    await prisma.giftHamper.create({ data: h });
  }

  console.log("Gift hampers seeded.");
  console.log("Seeding loyalty & rewards database complete!");
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
