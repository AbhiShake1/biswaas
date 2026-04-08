import { action } from "./_generated/server";

// Seed data for 5 categories with businesses
const SEED_CATEGORIES = [
  { name: "Education Consultancies", nameNe: "शैक्षिक परामर्शदाता", slug: "education-consultancies", description: "Study abroad consultancies, language schools, test prep centers", sortOrder: 1 },
  { name: "E-Commerce & Online Shopping", nameNe: "ई-कमर्स", slug: "ecommerce", description: "Online marketplaces, food delivery, health & beauty platforms", sortOrder: 2 },
  { name: "Trekking & Tourism", nameNe: "ट्रेकिङ र पर्यटन", slug: "trekking-tourism", description: "Trekking agencies, travel companies, hotels, adventure sports", sortOrder: 3 },
  { name: "ISPs & Telecom", nameNe: "इन्टरनेट र टेलिकम", slug: "isp-telecom", description: "Internet service providers, mobile operators, digital TV", sortOrder: 4 },
  { name: "Hospitals & Healthcare", nameNe: "अस्पताल र स्वास्थ्य", slug: "hospitals-healthcare", description: "Hospitals, clinics, diagnostic centers, pharmacies", sortOrder: 5 },
];

const SEED_BUSINESSES: Record<string, Array<{ name: string; slug: string; description: string; district: string; trustScore: number; totalReviews: number }>> = {
  "education-consultancies": [
    { name: "AECC Global Nepal", slug: "aecc-global-nepal", description: "Leading study abroad consultancy for Australia, UK, Canada", district: "Kathmandu", trustScore: 4.2, totalReviews: 87 },
    { name: "KIEC", slug: "kiec", description: "Kathmandu Infosys Educational Consultancy - Japan, Korea specialist", district: "Kathmandu", trustScore: 3.8, totalReviews: 124 },
    { name: "IDP Nepal", slug: "idp-nepal", description: "Official IELTS test center and study abroad services", district: "Kathmandu", trustScore: 4.5, totalReviews: 203 },
    { name: "Edwise Foundation", slug: "edwise-foundation", description: "US, UK, Australia university admissions", district: "Kathmandu", trustScore: 3.5, totalReviews: 56 },
    { name: "Global Reach Nepal", slug: "global-reach-nepal", description: "Comprehensive overseas education consultancy", district: "Kathmandu", trustScore: 4.0, totalReviews: 92 },
    { name: "The Next Education", slug: "next-education", description: "Australia and New Zealand education specialist", district: "Kathmandu", trustScore: 3.9, totalReviews: 67 },
    { name: "SAS Education", slug: "sas-education", description: "Japan and Korea study programs", district: "Lalitpur", trustScore: 3.7, totalReviews: 45 },
    { name: "Alfa Beta Education", slug: "alfa-beta", description: "European university admissions", district: "Kathmandu", trustScore: 4.1, totalReviews: 78 },
    { name: "Heritage Education", slug: "heritage-education", description: "UK and Ireland specialist", district: "Bhaktapur", trustScore: 3.6, totalReviews: 34 },
    { name: "Aus Studies Nepal", slug: "aus-studies", description: "Australia focused education services", district: "Kathmandu", trustScore: 4.3, totalReviews: 112 },
  ],
  "ecommerce": [
    { name: "Daraz Nepal", slug: "daraz-nepal", description: "Largest online marketplace in Nepal", district: "Kathmandu", trustScore: 2.1, totalReviews: 1543 },
    { name: "SastoDeal", slug: "sastodeal", description: "Electronics and gadgets online store", district: "Kathmandu", trustScore: 3.2, totalReviews: 342 },
    { name: "Foodmandu", slug: "foodmandu", description: "Food delivery service in Kathmandu valley", district: "Kathmandu", trustScore: 3.8, totalReviews: 567 },
    { name: "HamroBazar", slug: "hamrobazar", description: "Buy and sell marketplace", district: "Kathmandu", trustScore: 3.0, totalReviews: 89 },
    { name: "Jeevee", slug: "jeevee", description: "Health, beauty and wellness online store", district: "Lalitpur", trustScore: 4.1, totalReviews: 178 },
    { name: "Thulo.com", slug: "thulo-com", description: "Multi-category online store", district: "Kathmandu", trustScore: 3.4, totalReviews: 234 },
    { name: "OkDam", slug: "okdam", description: "Deal and coupon marketplace", district: "Kathmandu", trustScore: 3.6, totalReviews: 156 },
    { name: "SmartDoko", slug: "smartdoko", description: "Grocery and daily essentials delivery", district: "Kathmandu", trustScore: 3.9, totalReviews: 289 },
  ],
  "trekking-tourism": [
    { name: "Nepal Intrepid Treks", slug: "nepal-intrepid-treks", description: "Premium trekking and expedition company", district: "Kathmandu", trustScore: 4.6, totalReviews: 312 },
    { name: "Himalayan Temple Tours", slug: "himalayan-temple-tours", description: "Cultural tours and trekking in Nepal", district: "Kathmandu", trustScore: 4.3, totalReviews: 189 },
    { name: "Real Sherpa Adventures", slug: "real-sherpa-adventures", description: "Authentic Sherpa-led trekking experiences", district: "Solukhumbu", trustScore: 4.7, totalReviews: 245 },
    { name: "Adventure Vision Treks", slug: "adventure-vision-treks", description: "Budget-friendly trekking packages", district: "Kathmandu", trustScore: 3.9, totalReviews: 134 },
    { name: "Everest Holiday", slug: "everest-holiday", description: "Everest region specialist tours", district: "Kathmandu", trustScore: 4.1, totalReviews: 98 },
    { name: "Nepal Wilderness Trekking", slug: "nepal-wilderness", description: "Off-the-beaten-path adventures", district: "Pokhara", trustScore: 4.4, totalReviews: 167 },
    { name: "World Eco Expeditions", slug: "world-eco-expeditions", description: "Eco-friendly trekking company", district: "Kathmandu", trustScore: 4.2, totalReviews: 143 },
    { name: "Kathmandu Adventure Treks", slug: "kathmandu-adventure", description: "Multi-day trekking and tours", district: "Kathmandu", trustScore: 3.8, totalReviews: 89 },
  ],
  "isp-telecom": [
    { name: "WorldLink Communications", slug: "worldlink", description: "Largest ISP in Nepal with fiber internet", district: "Kathmandu", trustScore: 3.1, totalReviews: 892 },
    { name: "Vianet Communications", slug: "vianet", description: "Fiber and wireless internet provider", district: "Kathmandu", trustScore: 3.4, totalReviews: 456 },
    { name: "Nepal Telecom", slug: "nepal-telecom", description: "State-owned telecom operator", district: "Kathmandu", trustScore: 2.8, totalReviews: 1204 },
    { name: "Ncell", slug: "ncell", description: "Private mobile operator", district: "Lalitpur", trustScore: 3.0, totalReviews: 987 },
    { name: "Classic Tech", slug: "classic-tech", description: "FTTH internet and digital TV", district: "Kathmandu", trustScore: 3.6, totalReviews: 234 },
    { name: "Subisu Cablenet", slug: "subisu", description: "Cable internet and TV provider", district: "Kathmandu", trustScore: 2.9, totalReviews: 567 },
    { name: "CG Net", slug: "cg-net", description: "Fiber internet by CG Group", district: "Kathmandu", trustScore: 3.3, totalReviews: 178 },
    { name: "DishHome", slug: "dishhome", description: "Satellite TV and internet", district: "Kathmandu", trustScore: 3.2, totalReviews: 345 },
  ],
  "hospitals-healthcare": [
    { name: "Norvic International Hospital", slug: "norvic-hospital", description: "Multi-specialty international hospital", district: "Kathmandu", trustScore: 4.0, totalReviews: 345 },
    { name: "Grande International Hospital", slug: "grande-hospital", description: "Modern healthcare facility in Kathmandu", district: "Kathmandu", trustScore: 4.2, totalReviews: 278 },
    { name: "Nepal Mediciti Hospital", slug: "nepal-mediciti", description: "State-of-the-art medical center", district: "Lalitpur", trustScore: 3.8, totalReviews: 456 },
    { name: "B&B Hospital", slug: "bb-hospital", description: "Leading private hospital in Lalitpur", district: "Lalitpur", trustScore: 3.5, totalReviews: 567 },
    { name: "CIWEC Hospital", slug: "ciwec-hospital", description: "International clinic and travel medicine", district: "Kathmandu", trustScore: 4.4, totalReviews: 123 },
    { name: "Star Hospital", slug: "star-hospital", description: "Multi-specialty hospital", district: "Kathmandu", trustScore: 3.7, totalReviews: 234 },
    { name: "Patan Hospital", slug: "patan-hospital", description: "Teaching hospital in Lalitpur", district: "Lalitpur", trustScore: 3.9, totalReviews: 456 },
    { name: "TU Teaching Hospital", slug: "tuth", description: "Tribhuvan University teaching hospital", district: "Kathmandu", trustScore: 3.3, totalReviews: 678 },
  ],
};

export const seedAll = action({
  args: {},
  handler: async (ctx) => {
    // This is a Convex action for seeding - would be called from admin UI
    // In practice, this would use ctx.runMutation to insert data
    console.log("Seed data ready:", {
      categories: SEED_CATEGORIES.length,
      businesses: Object.values(SEED_BUSINESSES).flat().length,
    });
    return {
      categories: SEED_CATEGORIES.length,
      businesses: Object.values(SEED_BUSINESSES).flat().length,
    };
  },
});
