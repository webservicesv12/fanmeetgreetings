import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";
import * as dotenv from "dotenv";
dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter } as any);



async function main() {
  console.log("🌱 Seeding database...");

  // ─── Create Admin User ─────────────────────────────────────────────────────
  const adminPassword = await bcrypt.hash("Admin@123456", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@meetgreetings.com" },
    update: {},
    create: {
      name: "MeetGreetings Admin",
      email: "admin@meetgreetings.com",
      password: adminPassword,
      role: "ADMIN",
    },
  });
  console.log("✅ Admin user created:", admin.email);

  // ─── Create Sample Users ───────────────────────────────────────────────────
  const userPassword = await bcrypt.hash("User@123456", 12);
  const user1 = await prisma.user.upsert({
    where: { email: "fan@example.com" },
    update: {},
    create: {
      name: "Sarah Johnson",
      email: "fan@example.com",
      password: userPassword,
      phone: "+1 555 000 1234",
    },
  });
  console.log("✅ Sample user created:", user1.email);

  // ─── Create Celebrities ────────────────────────────────────────────────────
  const celebrities = [
    {
      name: "Aria Starlight",
      slug: "aria-starlight",
      category: "MUSIC" as const,
      bio: "Grammy-winning music artist whose soulful voice and captivating performances have earned her a global fanbase of over 80 million. Born and raised in New Orleans, Louisiana, Aria blends R&B, soul, and pop into a signature sound that transcends genres.",
      location: "Los Angeles, CA",
      nationality: "American",
      yearsActive: "2015–present",
      verified: true,
      featured: true,
      basePrice: 5000,
      rating: 4.9,
      reviewCount: 127,
      tags: ["Grammy Winner", "R&B", "Pop", "Soul"],
      socialLinks: {
        instagram: "https://instagram.com",
        twitter: "https://twitter.com",
        youtube: "https://youtube.com",
      },
    },
    {
      name: "James Thunder",
      slug: "james-thunder",
      category: "ACTOR" as const,
      bio: "Hollywood A-lister known for blockbuster action films and critically acclaimed dramatic performances. James has starred in over 40 films worldwide and has won multiple Academy Award nominations.",
      location: "Beverly Hills, CA",
      nationality: "American",
      yearsActive: "2008–present",
      verified: true,
      featured: true,
      basePrice: 12000,
      rating: 4.8,
      reviewCount: 89,
      tags: ["Hollywood", "Action", "Drama"],
      socialLinks: { instagram: "https://instagram.com", twitter: "https://twitter.com" },
    },
    {
      name: "Elena Voss",
      slug: "elena-voss",
      category: "INFLUENCER" as const,
      bio: "Social media powerhouse with 50M+ followers across platforms. Elena is known for her authentic lifestyle content, fashion collaborations, and philanthropic work.",
      location: "New York, NY",
      nationality: "German-American",
      yearsActive: "2016–present",
      verified: true,
      featured: false,
      basePrice: 2500,
      rating: 4.7,
      reviewCount: 203,
      tags: ["Lifestyle", "Fashion", "Beauty"],
      socialLinks: { instagram: "https://instagram.com", tiktok: "https://tiktok.com" },
    },
    {
      name: "Marcus King",
      slug: "marcus-king",
      category: "ATHLETE" as const,
      bio: "World champion athlete and Olympic gold medalist. Marcus has broken multiple world records and is considered one of the greatest athletes of his generation.",
      location: "Miami, FL",
      nationality: "Jamaican-American",
      yearsActive: "2010–present",
      verified: true,
      featured: true,
      basePrice: 8000,
      rating: 4.9,
      reviewCount: 156,
      tags: ["Olympic Gold", "World Champion", "Sprinter"],
      socialLinks: { instagram: "https://instagram.com", twitter: "https://twitter.com" },
    },
    {
      name: "Sofia Rivera",
      slug: "sofia-rivera",
      category: "COMEDIAN" as const,
      bio: "Stand-up comedian and TV host with sold-out world tours and two Netflix specials. Sofia's sharp wit and relatable humor have made her one of the most beloved comedians of her generation.",
      location: "Chicago, IL",
      nationality: "Mexican-American",
      yearsActive: "2012–present",
      verified: true,
      featured: false,
      basePrice: 3500,
      rating: 4.8,
      reviewCount: 94,
      tags: ["Stand-up", "Netflix", "TV Host"],
      socialLinks: { instagram: "https://instagram.com", youtube: "https://youtube.com" },
    },
    {
      name: "DJ Nexus",
      slug: "dj-nexus",
      category: "DJ" as const,
      bio: "International DJ and music producer with residencies at top global venues including Ibiza, Las Vegas, and Dubai. Known for blending electronic music with world rhythms.",
      location: "Ibiza, Spain",
      nationality: "British",
      yearsActive: "2011–present",
      verified: true,
      featured: false,
      basePrice: 6000,
      rating: 4.6,
      reviewCount: 78,
      tags: ["EDM", "House", "Ibiza"],
      socialLinks: { instagram: "https://instagram.com", soundcloud: "https://soundcloud.com" },
    },
    {
      name: "Zara Moon",
      slug: "zara-moon",
      category: "MUSIC" as const,
      bio: "Pop sensation with 10 consecutive #1 Billboard hits. Zara's powerful vocals and electrifying stage presence have earned her a reputation as one of the most exciting live performers in the industry.",
      location: "London, UK",
      nationality: "British",
      yearsActive: "2018–present",
      verified: true,
      featured: true,
      basePrice: 7500,
      rating: 4.9,
      reviewCount: 189,
      tags: ["Pop", "Billboard #1", "Live Performer"],
      socialLinks: { instagram: "https://instagram.com", twitter: "https://twitter.com", youtube: "https://youtube.com" },
    },
    {
      name: "Ryan Chase",
      slug: "ryan-chase",
      category: "ACTOR" as const,
      bio: "Rising star known for critically acclaimed indie films and streaming series. Ryan brings depth and authenticity to every role he plays.",
      location: "Austin, TX",
      nationality: "Canadian",
      yearsActive: "2019–present",
      verified: false,
      featured: false,
      basePrice: 9500,
      rating: 4.7,
      reviewCount: 112,
      tags: ["Indie Film", "Streaming", "Drama"],
      socialLinks: { instagram: "https://instagram.com" },
    },
  ];

  for (const celeb of celebrities) {
    const created = await prisma.celebrity.upsert({
      where: { slug: celeb.slug },
      update: {},
      create: {
        ...celeb,
        socialLinks: celeb.socialLinks as any,
        packages: {
          create: [
            {
              name: "VIP Meet & Greet",
              description: `An exclusive 30-minute private meet & greet with ${celeb.name}. Includes photo session and signed memorabilia.`,
              eventType: "MEET_AND_GREET",
              duration: 30,
              price: celeb.basePrice,
              maxGuests: 2,
              includes: ["Private 30-min meet & greet", "Professional photo session", "Signed memorabilia", "VIP concierge service"],
            },
            {
              name: "Personal Video Call",
              description: `A 15-minute private video call with ${celeb.name}. Perfect for a personal greeting or special occasion message.`,
              eventType: "VIDEO_CALL",
              duration: 15,
              price: Math.floor(celeb.basePrice * 0.3),
              maxGuests: 1,
              includes: ["15-min private video call", "Recording of session", "Personal greeting message"],
            },
            {
              name: "VIP Dinner Experience",
              description: `A 2-hour exclusive private dinner with ${celeb.name} at a premium venue.`,
              eventType: "VIP_DINNER",
              duration: 120,
              price: celeb.basePrice * 3,
              maxGuests: 4,
              includes: ["2-hour private dinner", "Premium venue", "Personal conversation", "Group photos", "Signed merchandise"],
            },
          ],
        },
      },
    });
    console.log(`✅ Celebrity created: ${created.name}`);
  }

  // ─── Crypto Wallets ────────────────────────────────────────────────────────
  const wallets = [
    { coin: "BITCOIN" as const, label: "Bitcoin Main", address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh", network: "Bitcoin" },
    { coin: "ETHEREUM" as const, label: "Ethereum Main", address: "0x742d35Cc6634C0532925a3b8D4C9C4B7e2A1234", network: "ERC-20" },
    { coin: "USDT_TRC20" as const, label: "USDT TRC20", address: "TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE", network: "TRC-20" },
    { coin: "LITECOIN" as const, label: "Litecoin Main", address: "ltc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh", network: "Litecoin" },
    { coin: "BUSD" as const, label: "BUSD BEP-20", address: "0x742d35Cc6634C0532925a3b8D4C9C4B7e2A5678", network: "BEP-20" },
  ];

  for (const wallet of wallets) {
    await prisma.cryptoWallet.upsert({
      where: { id: wallet.coin },
      update: {},
      create: wallet,
    }).catch(async () => {
      await prisma.cryptoWallet.create({ data: wallet });
    });
    console.log(`✅ Wallet created: ${wallet.label}`);
  }

  // ─── Bank Account ──────────────────────────────────────────────────────────
  await prisma.bankAccount.deleteMany();
  await prisma.bankAccount.create({
    data: {
      bankName: "Chase Bank",
      accountName: "MeetGreetings LLC",
      accountNumber: "1234567890",
      routingNumber: "021000021",
      swiftCode: "CHASUS33",
      currency: "USD",
      country: "United States",
    },
  });
  console.log("✅ Bank account created");

  // ─── Site Settings ─────────────────────────────────────────────────────────
  const settings = [
    { key: "site_name", value: "MeetGreetings" },
    { key: "site_tagline", value: "Premium Celebrity Meet & Greet Experiences" },
    { key: "contact_email", value: "support@meetgreetings.com" },
    { key: "booking_fee_pct", value: "5" },
  ];

  for (const setting of settings) {
    await prisma.siteSettings.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    });
  }
  console.log("✅ Site settings created");

  console.log("\n🎉 Seeding complete!");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("Admin login: admin@meetgreetings.com / Admin@123456");
  console.log("User login:  fan@example.com / User@123456");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
