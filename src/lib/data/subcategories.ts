export interface Subcategory {
  name: string;
  slug: string;
  description: string;
}

export interface CategoryWithSubcategories {
  slug: string;
  name: string;
  subcategories: Subcategory[];
}

export const subcategories: CategoryWithSubcategories[] = [
  {
    slug: 'education-consultancies',
    name: 'Education Consultancies',
    subcategories: [
      { name: 'Study Abroad', slug: 'study-abroad', description: 'Consultancies for studying in Australia, UK, USA, Canada, Japan, Korea' },
      { name: 'Language Schools', slug: 'language-schools', description: 'IELTS, TOEFL, PTE, Japanese, Korean language preparation' },
      { name: 'Test Preparation', slug: 'test-prep', description: 'SAT, GRE, GMAT, and other standardized test prep centers' },
      { name: 'Visa Services', slug: 'visa-services', description: 'Student visa processing and documentation assistance' },
      { name: 'Scholarship Guidance', slug: 'scholarship-guidance', description: 'Help finding and applying for scholarships abroad' },
      { name: 'Bridge Courses', slug: 'bridge-courses', description: 'Foundation and pathway programs for international universities' },
    ],
  },
  {
    slug: 'ecommerce',
    name: 'E-Commerce',
    subcategories: [
      { name: 'Online Marketplaces', slug: 'online-marketplaces', description: 'Multi-vendor platforms like Daraz, SastoDeal, HamroBazar' },
      { name: 'Food Delivery', slug: 'food-delivery', description: 'Foodmandu, Bhojdeals, Pathao Food, and other delivery apps' },
      { name: 'Grocery Delivery', slug: 'grocery-delivery', description: 'Online grocery and essentials delivery services' },
      { name: 'Fashion & Clothing', slug: 'fashion-clothing', description: 'Online clothing stores and boutiques' },
      { name: 'Electronics', slug: 'electronics', description: 'Online electronics and gadget retailers' },
      { name: 'Digital Payments', slug: 'digital-payments', description: 'eSewa, Khalti, IME Pay, and other digital wallets' },
    ],
  },
  {
    slug: 'trekking-tourism',
    name: 'Trekking & Tourism',
    subcategories: [
      { name: 'Trekking Agencies', slug: 'trekking-agencies', description: 'Licensed trekking and expedition operators' },
      { name: 'Hotels & Resorts', slug: 'hotels-resorts', description: 'Hotels, resorts, and lodges across Nepal' },
      { name: 'Adventure Sports', slug: 'adventure-sports', description: 'Paragliding, bungee jumping, rafting, zip-lining' },
      { name: 'Travel Agencies', slug: 'travel-agencies', description: 'Domestic and international travel booking services' },
      { name: 'Homestays', slug: 'homestays', description: 'Community homestay and rural tourism experiences' },
      { name: 'Tour Guides', slug: 'tour-guides', description: 'Licensed tour guides and cultural experience providers' },
    ],
  },
  {
    slug: 'isp-telecom',
    name: 'ISPs & Telecom',
    subcategories: [
      { name: 'Broadband ISPs', slug: 'broadband-isps', description: 'Fiber and DSL internet service providers' },
      { name: 'Mobile Operators', slug: 'mobile-operators', description: 'NTC, Ncell, Smart Cell mobile services' },
      { name: 'Cable TV', slug: 'cable-tv', description: 'Cable television and IPTV providers' },
      { name: 'Satellite Internet', slug: 'satellite-internet', description: 'VSAT and satellite-based internet services' },
      { name: 'Enterprise Solutions', slug: 'enterprise-solutions', description: 'Business internet, leased lines, and corporate plans' },
    ],
  },
  {
    slug: 'hospitals-healthcare',
    name: 'Hospitals & Healthcare',
    subcategories: [
      { name: 'Hospitals', slug: 'hospitals', description: 'General and multi-specialty hospitals' },
      { name: 'Clinics', slug: 'clinics', description: 'Private clinics and polyclinics' },
      { name: 'Diagnostic Centers', slug: 'diagnostic-centers', description: 'Pathology labs, imaging, and diagnostic services' },
      { name: 'Pharmacies', slug: 'pharmacies', description: 'Retail and online pharmacies' },
      { name: 'Dental Care', slug: 'dental-care', description: 'Dental clinics and orthodontic services' },
      { name: 'Eye Care', slug: 'eye-care', description: 'Ophthalmology clinics and eye hospitals' },
      { name: 'Ayurveda & Traditional', slug: 'ayurveda-traditional', description: 'Ayurvedic clinics and traditional medicine practitioners' },
    ],
  },
];

export function getSubcategoriesForCategory(categorySlug: string): Subcategory[] {
  const category = subcategories.find((c) => c.slug === categorySlug);
  return category?.subcategories ?? [];
}
