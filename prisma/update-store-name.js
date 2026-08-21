const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Updating store branding settings in database...");

  const settings = [
    { key: "store_name", value: "M/S Best Quality Dryfruits and Masala House", group: "GENERAL" },
    { key: "business_name", value: "M/S Best Quality Dryfruits and Masala House", group: "GENERAL" },
    { key: "contact_email", value: "bestqualityujjain@gmail.com", group: "GENERAL" },
    { key: "contact_phone", value: "+91 98765 43210", group: "GENERAL" },
    { key: "store_address", value: "55, Fawara Chowk, Daulat Ganj, Ujjain, Madhya Pradesh, India", group: "GENERAL" },
    { key: "store_timings", value: "10:00 AM - 09:30 PM (All Days)", group: "GENERAL" },
  ];

  for (const s of settings) {
    await prisma.websiteSetting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: s,
    });
  }

  console.log("Branding keys updated successfully in database!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
