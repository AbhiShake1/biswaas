export type ReplyRecord = {
  id: string;
  author: string;
  body: string;
  createdAt: string;
};

export type ReviewRecord = {
  id: string;
  author: string;
  stars: number;
  title: string;
  body: string;
  createdAt: string;
  source?: 'organic' | 'imported';
  replies?: ReplyRecord[];
};

export type BusinessRecord = {
  name: string;
  slug: string;
  categorySlug: string;
  categoryName: string;
  description: string;
  district: string;
  municipality: string;
  address: string;
  phone: string;
  websiteUrl: string;
  trustScore: number;
  starRating: number;
  totalReviews: number;
  ratingDistribution: {
    one: number;
    two: number;
    three: number;
    four: number;
    five: number;
  };
  reviews: ReviewRecord[];
};

export const categories = [
  {
    name: 'Education Consultancies',
    slug: 'education-consultancies',
    description: 'Study abroad consultancies, test prep centers, and counseling offices.'
  },
  {
    name: 'E-Commerce',
    slug: 'ecommerce',
    description: 'Online marketplaces, food delivery apps, and direct-to-consumer services.'
  },
  {
    name: 'Trekking & Tourism',
    slug: 'trekking-tourism',
    description: 'Trekking agencies, travel operators, and tourism service companies.'
  },
  {
    name: 'ISPs & Telecom',
    slug: 'isp-telecom',
    description: 'Internet providers, telecom operators, and connectivity services.'
  },
  {
    name: 'Hospitals & Healthcare',
    slug: 'hospitals-healthcare',
    description: 'Hospitals, clinics, diagnostics, and healthcare providers.'
  }
] as const;

export const businesses: BusinessRecord[] = [
  {
    name: 'AECC Global Nepal',
    slug: 'aecc-global-nepal',
    categorySlug: 'education-consultancies',
    categoryName: 'Education Consultancies',
    description: 'Provides study abroad counseling, application guidance, and visa support.',
    district: 'Kathmandu',
    municipality: 'Kathmandu Metropolitan City',
    address: 'Putalisadak, Kathmandu',
    phone: '+977-1-4545454',
    websiteUrl: 'https://example.com/aecc-global-nepal',
    trustScore: 4.4,
    starRating: 4,
    totalReviews: 128,
    ratingDistribution: { one: 5, two: 7, three: 18, four: 42, five: 56 },
    reviews: [
      {
        id: 'aecc-1',
        author: 'Suman G.',
        stars: 5,
        title: 'Clear advice and fast follow-up',
        body: 'The counselors explained university options well and kept me updated throughout the application.',
        createdAt: '2026-03-29',
        source: 'organic',
        replies: [
          {
            id: 'aecc-1-r1',
            author: 'AECC Global Nepal',
            body: 'Thank you for the detailed feedback. We are glad the counseling and updates were useful.',
            createdAt: '2026-03-30'
          }
        ]
      },
      {
        id: 'aecc-2',
        author: 'Anita M.',
        stars: 4,
        title: 'Helpful team',
        body: 'Good support for the visa process, though some document checks took longer than expected.',
        createdAt: '2026-03-15',
        source: 'organic'
      },
      {
        id: 'aecc-3',
        author: 'Prakash R.',
        stars: 3,
        title: 'Average experience',
        body: 'The staff were polite, but I had to follow up multiple times to get final updates.',
        createdAt: '2026-02-20',
        source: 'imported'
      }
    ]
  },
  {
    name: 'Nepal Education Gateway',
    slug: 'nepal-education-gateway',
    categorySlug: 'education-consultancies',
    categoryName: 'Education Consultancies',
    description: 'Student visa and university placement support for Australia, Canada, and the UK.',
    district: 'Lalitpur',
    municipality: 'Lalitpur Metropolitan City',
    address: 'Jawalakhel, Lalitpur',
    phone: '+977-1-5533221',
    websiteUrl: 'https://example.com/nepal-education-gateway',
    trustScore: 4.1,
    starRating: 4,
    totalReviews: 89,
    ratingDistribution: { one: 6, two: 6, three: 14, four: 30, five: 33 },
    reviews: [
      {
        id: 'neg-1',
        author: 'Ram B.',
        stars: 5,
        title: 'Smooth visa process',
        body: 'They were organized and helped me avoid mistakes in the visa application.',
        createdAt: '2026-03-26',
        source: 'organic'
      },
      {
        id: 'neg-2',
        author: 'Mina T.',
        stars: 4,
        title: 'Good communication',
        body: 'The team responded quickly and gave clear next steps at each stage.',
        createdAt: '2026-03-01',
        source: 'organic'
      }
    ]
  },
  {
    name: 'Foodmandu',
    slug: 'foodmandu',
    categorySlug: 'ecommerce',
    categoryName: 'E-Commerce',
    description: 'Food delivery platform serving restaurants across major Nepal cities.',
    district: 'Kathmandu',
    municipality: 'Kathmandu Metropolitan City',
    address: 'Tinkune, Kathmandu',
    phone: '+977-1-4100100',
    websiteUrl: 'https://example.com/foodmandu',
    trustScore: 3.8,
    starRating: 4,
    totalReviews: 203,
    ratingDistribution: { one: 19, two: 21, three: 42, four: 66, five: 55 },
    reviews: [
      {
        id: 'foodmandu-1',
        author: 'Priya S.',
        stars: 4,
        title: 'Reliable in the city core',
        body: 'Orders usually arrive on time in central Kathmandu, though weekends can be slower.',
        createdAt: '2026-04-02',
        source: 'organic',
        replies: [
          {
            id: 'foodmandu-1-r1',
            author: 'Foodmandu Support',
            body: 'Thanks for calling out the weekend delays. We are working on rider coverage during peak periods.',
            createdAt: '2026-04-03'
          }
        ]
      },
      {
        id: 'foodmandu-2',
        author: 'Kiran D.',
        stars: 3,
        title: 'Mixed delivery times',
        body: 'Selection is good, but support can be inconsistent when an order is delayed.',
        createdAt: '2026-03-11',
        source: 'organic'
      }
    ]
  },
  {
    name: 'Daraz Nepal',
    slug: 'daraz-nepal',
    categorySlug: 'ecommerce',
    categoryName: 'E-Commerce',
    description: 'General marketplace for electronics, home goods, fashion, and more.',
    district: 'Kathmandu',
    municipality: 'Kathmandu Metropolitan City',
    address: 'Naxal, Kathmandu',
    phone: '+977-1-5970000',
    websiteUrl: 'https://example.com/daraz-nepal',
    trustScore: 3.6,
    starRating: 4,
    totalReviews: 311,
    ratingDistribution: { one: 32, two: 40, three: 61, four: 96, five: 82 },
    reviews: [
      {
        id: 'daraz-1',
        author: 'Sanjay P.',
        stars: 4,
        title: 'Wide product choice',
        body: 'The catalog is useful, but seller quality varies a lot across categories.',
        createdAt: '2026-04-01',
        source: 'organic'
      },
      {
        id: 'daraz-2',
        author: 'Rekha K.',
        stars: 3,
        title: 'Delivery depends on the seller',
        body: 'Some orders arrive quickly while others take much longer than promised.',
        createdAt: '2026-03-05',
        source: 'imported'
      }
    ]
  },
  {
    name: 'Everest Trek Adventures',
    slug: 'everest-trek-adventures',
    categorySlug: 'trekking-tourism',
    categoryName: 'Trekking & Tourism',
    description: 'Guided trekking company focused on Everest and Annapurna region expeditions.',
    district: 'Kathmandu',
    municipality: 'Kathmandu Metropolitan City',
    address: 'Thamel, Kathmandu',
    phone: '+977-1-4447788',
    websiteUrl: 'https://example.com/everest-trek-adventures',
    trustScore: 4.7,
    starRating: 5,
    totalReviews: 156,
    ratingDistribution: { one: 3, two: 5, three: 10, four: 34, five: 104 },
    reviews: [
      {
        id: 'eta-1',
        author: 'Julia F.',
        stars: 5,
        title: 'Experienced guides',
        body: 'The route planning and guide support were excellent from arrival to return.',
        createdAt: '2026-03-18',
        source: 'organic'
      },
      {
        id: 'eta-2',
        author: 'Ashok L.',
        stars: 5,
        title: 'Well-managed trip',
        body: 'Transport, permits, and communication were all handled properly.',
        createdAt: '2026-02-28',
        source: 'organic'
      }
    ]
  },
  {
    name: 'Pokhara Mountain Trails',
    slug: 'pokhara-mountain-trails',
    categorySlug: 'trekking-tourism',
    categoryName: 'Trekking & Tourism',
    description: 'Local trekking operator based in Pokhara with Annapurna-focused itineraries.',
    district: 'Kaski',
    municipality: 'Pokhara Metropolitan City',
    address: 'Lakeside, Pokhara',
    phone: '+977-61-441122',
    websiteUrl: 'https://example.com/pokhara-mountain-trails',
    trustScore: 4.3,
    starRating: 4,
    totalReviews: 74,
    ratingDistribution: { one: 4, two: 5, three: 9, four: 24, five: 32 },
    reviews: [
      {
        id: 'pmt-1',
        author: 'Neha A.',
        stars: 4,
        title: 'Great local knowledge',
        body: 'The guides knew the region well and the pace of the trek matched our group.',
        createdAt: '2026-03-13',
        source: 'organic'
      }
    ]
  },
  {
    name: 'WorldLink Internet',
    slug: 'worldlink-internet',
    categorySlug: 'isp-telecom',
    categoryName: 'ISPs & Telecom',
    description: 'Fiber internet provider serving homes and businesses across Nepal.',
    district: 'Kathmandu',
    municipality: 'Kathmandu Metropolitan City',
    address: 'Tripureshwor, Kathmandu',
    phone: '+977-1-5970050',
    websiteUrl: 'https://example.com/worldlink-internet',
    trustScore: 3.9,
    starRating: 4,
    totalReviews: 234,
    ratingDistribution: { one: 21, two: 26, three: 45, four: 79, five: 63 },
    reviews: [
      {
        id: 'worldlink-1',
        author: 'Hari P.',
        stars: 4,
        title: 'Stable enough for work',
        body: 'Connection is usually stable, but outages still happen during peak weather periods.',
        createdAt: '2026-04-03',
        source: 'organic'
      },
      {
        id: 'worldlink-2',
        author: 'Bikash N.',
        stars: 3,
        title: 'Support can be slow',
        body: 'Technician visits get resolved eventually, but the waiting time is inconsistent.',
        createdAt: '2026-03-19',
        source: 'organic'
      }
    ]
  },
  {
    name: 'Nepal Telecom',
    slug: 'nepal-telecom',
    categorySlug: 'isp-telecom',
    categoryName: 'ISPs & Telecom',
    description: 'Telecom and internet services provider with nationwide mobile and broadband coverage.',
    district: 'Kathmandu',
    municipality: 'Kathmandu Metropolitan City',
    address: 'Bhadrakali, Kathmandu',
    phone: '+977-14911499',
    websiteUrl: 'https://example.com/nepal-telecom',
    trustScore: 3.2,
    starRating: 3,
    totalReviews: 287,
    ratingDistribution: { one: 34, two: 44, three: 73, four: 81, five: 55 },
    reviews: [
      {
        id: 'ntc-1',
        author: 'Gita S.',
        stars: 3,
        title: 'Works, but support is uneven',
        body: 'Coverage is strong, but issue resolution depends a lot on the office and queue.',
        createdAt: '2026-03-22',
        source: 'organic'
      }
    ]
  },
  {
    name: 'Grande Hospital',
    slug: 'grande-hospital',
    categorySlug: 'hospitals-healthcare',
    categoryName: 'Hospitals & Healthcare',
    description: 'Private hospital providing specialist care, diagnostics, and inpatient services.',
    district: 'Kathmandu',
    municipality: 'Tokha Municipality',
    address: 'Dhapasi, Kathmandu',
    phone: '+977-1-5159266',
    websiteUrl: 'https://example.com/grande-hospital',
    trustScore: 4.2,
    starRating: 4,
    totalReviews: 112,
    ratingDistribution: { one: 7, two: 8, three: 20, four: 34, five: 43 },
    reviews: [
      {
        id: 'grande-1',
        author: 'Laxmi D.',
        stars: 5,
        title: 'Clean and organized',
        body: 'The hospital was clean and the staff explained the treatment process clearly.',
        createdAt: '2026-03-31',
        source: 'organic'
      },
      {
        id: 'grande-2',
        author: 'Nabin K.',
        stars: 4,
        title: 'Good doctors, busy front desk',
        body: 'Doctor consultation was strong, though registration took a while in the morning.',
        createdAt: '2026-03-10',
        source: 'organic'
      }
    ]
  },
  {
    name: 'Manipal Teaching Hospital',
    slug: 'manipal-teaching-hospital',
    categorySlug: 'hospitals-healthcare',
    categoryName: 'Hospitals & Healthcare',
    description: 'Teaching hospital in Pokhara serving outpatient, emergency, and specialist care.',
    district: 'Kaski',
    municipality: 'Pokhara Metropolitan City',
    address: 'Fulbari, Pokhara',
    phone: '+977-61-526416',
    websiteUrl: 'https://example.com/manipal-teaching-hospital',
    trustScore: 4.0,
    starRating: 4,
    totalReviews: 96,
    ratingDistribution: { one: 8, two: 7, three: 18, four: 30, five: 33 },
    reviews: [
      {
        id: 'manipal-1',
        author: 'Pooja R.',
        stars: 4,
        title: 'Solid emergency care',
        body: 'The staff managed the emergency process well and doctors communicated clearly.',
        createdAt: '2026-03-28',
        source: 'organic'
      }
    ]
  }
];

export function getCategory(slug: string) {
  return categories.find((category) => category.slug === slug);
}

export function getBusinessesByCategory(slug: string) {
  return businesses.filter((business) => business.categorySlug === slug);
}

export function getBusiness(slug: string) {
  return businesses.find((business) => business.slug === slug);
}

export function searchBusinesses(query: string) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [];

  return businesses.filter((business) =>
    [
      business.name,
      business.categoryName,
      business.district,
      business.municipality,
      business.address,
      business.description
    ].some((value) => value.toLowerCase().includes(normalized))
  );
}
