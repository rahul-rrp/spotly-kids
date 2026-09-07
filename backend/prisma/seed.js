const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const castingCalls = [
  {
    title: "Kids Got Talent OTT Show - Final Call",
    agencyName: "Spotly Kids",
    description: "Looking for enthusiastic child performers with great energy for a major OTT platform talent hunt show. Audition video required.",
    city: "Mumbai",
    ageMin: 4,
    ageMax: 12,
    language: "Hindi",
    category: "OTT Show",
    amount: 20000,
    deadline: "15 Oct 2026",
    imageUrl: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=600&q=80",
    isPro: true,
    isVerified: true
  },
  {
    title: "Dil Ka Rishta - Zee TV Serial",
    agencyName: "Spotly Kids",
    description: "Casting child actor for a prominent supporting role in upcoming prime time TV series. Must be comfortable speaking natural Hindi dialogues.",
    city: "Mumbai",
    ageMin: 4,
    ageMax: 12,
    language: "Hindi",
    category: "TV Serial",
    amount: 35000,
    deadline: "20 Oct 2026",
    imageUrl: "https://images.unsplash.com/photo-1543807535-eceef0bc6599?auto=format&fit=crop&w=600&q=80",
    isPro: true,
    isVerified: true
  },
  {
    title: "Kids Documentary Project",
    agencyName: "Spotly Kids",
    description: "Urgent call for kids aged 8-14 to share stories about school life and friendship for an inspirational docuseries.",
    city: "Delhi",
    ageMin: 8,
    ageMax: 14,
    language: "Hindi",
    category: "Movie",
    amount: 5000,
    deadline: "30 Sep 2026",
    imageUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=600&q=80",
    isPro: false,
    isVerified: true
  },
  {
    title: "Major Footwear Ad Commercial",
    agencyName: "Starlet Media",
    description: "Casting energetic boys and girls for a national footwear brand TV commercial shoot in Bangalore.",
    city: "Bangalore",
    ageMin: 3,
    ageMax: 8,
    language: "English",
    category: "Ad Commercial",
    amount: 15000,
    deadline: "12 Oct 2026",
    imageUrl: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=600&q=80",
    isPro: false,
    isVerified: true
  },
  {
    title: "Kids Fashion Brand Print Shoot",
    agencyName: "Vogue Kids Talent",
    description: "Modeling call for Festive Autumn Wear catalogue shoot. Photogenic kids with expressive faces preferred.",
    city: "Mumbai",
    ageMin: 5,
    ageMax: 10,
    language: "English",
    category: "Print Shoot",
    amount: 12000,
    deadline: "25 Oct 2026",
    imageUrl: "https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?auto=format&fit=crop&w=600&q=80",
    isPro: true,
    isVerified: true
  },
  {
    title: "South Feature Film Kid Lead",
    agencyName: "Cinema South Casting",
    description: "Major feature film production requires a talented child actor for pivotal role alongside leading South actors.",
    city: "Hyderabad",
    ageMin: 6,
    ageMax: 12,
    language: "Telugu",
    category: "Movie",
    amount: 50000,
    deadline: "05 Nov 2026",
    imageUrl: "https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?auto=format&fit=crop&w=600&q=80",
    isPro: true,
    isVerified: true
  },
  {
    title: "Snack Commercial Voice & On-Screen",
    agencyName: "Spotly Kids",
    description: "Fun snack commercial filming in Delhi. Expressive facial expressions and bubbly personality required.",
    city: "Delhi",
    ageMin: 4,
    ageMax: 9,
    language: "Hindi",
    category: "Ad Commercial",
    amount: 18000,
    deadline: "18 Oct 2026",
    imageUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80",
    isPro: false,
    isVerified: true
  },
  {
    title: "Educational App Video Presenter",
    agencyName: "EdTech Creative",
    description: "Casting bright kids to present short educational fun facts videos for a popular learning application.",
    city: "Bangalore",
    ageMin: 7,
    ageMax: 13,
    language: "English",
    category: "Digital",
    amount: 10000,
    deadline: "22 Oct 2026",
    imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=600&q=80",
    isPro: false,
    isVerified: true
  }
];

async function main() {
  console.log("Seeding casting calls...");
  // Clear existing records if any
  await prisma.application.deleteMany({});
  await prisma.castingCall.deleteMany({});
  
  for (const item of castingCalls) {
    const created = await prisma.castingCall.create({
      data: item
    });
    console.log(`Created casting call #${created.id}: ${created.title}`);
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
