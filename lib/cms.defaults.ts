export type Project = { id: string; title: string; location: string; year: string; category: string; cover: string; images: string[]; videos?: string[]; excerpt: string; area?: string; status: "Built" | "Ongoing" | "Concept" };
export type Journal = { id: string; title: string; date: string; tag: string; image: string; excerpt: string };
export type TeamMember = { id: string; name: string; role: string; bio: string; image: string };
export type Product = { id: string; name: string; category: string; price: string; material: string; dimensions: string; image: string; images?: string[]; excerpt: string; inStock: boolean };
export type StudioData = { heroTitle: string; heroSubtitle: string; studioHeadline: string; studioHeadlineAccent: string; studioHeadlineTail: string; quote: string; about: string; philosophy: string[]; contactHeadline?: string; contactHeadlineAccent?: string; email: string; phone: string; address: string; instagram: string };
export type CMS = { projects: Project[]; journal: Journal[]; studio: StudioData; team: TeamMember[]; products: Product[] };

export const DEFAULT_PROJECTS: Project[] = [
  { id: "1", title: "House by the Paddies", location: "Ubud, Bali", year: "2024", category: "Residential", cover: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&q=80", images: ["https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900&q=80"], videos: [], excerpt: "The brief was simple. Do not block the paddies.", area: "420 sqm", status: "Built" },
  { id: "2", title: "SAVANA Atelier", location: "Kemang, Jakarta", year: "2023", category: "Studio", cover: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&q=80", images: [], videos: [], excerpt: "An old stock warehouse turned into our own studio.", area: "180 sqm", status: "Built" },
  { id: "3", title: "Karang Villa", location: "Selong Belanak, Lombok", year: "2024", category: "Hospitality", cover: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=900&q=80", images: [], videos: [], excerpt: "Perched on rock, strong wind.", area: "650 sqm", status: "Ongoing" },
  { id: "4", title: "Bamboo Pavilion", location: "Lembang, Bandung", year: "2023", category: "Cultural", cover: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=900&q=80", images: [], videos: [], excerpt: "A community hall in petung bamboo.", area: "300 sqm", status: "Built" },
  { id: "5", title: "House of Light", location: "Semarang", year: "2025", category: "Residential", cover: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900&q=80", images: [], videos: [], excerpt: "A narrow 7 by 20 house.", area: "380 sqm", status: "Concept" },
  { id: "6", title: "Earth Office", location: "Kotagede, Yogyakarta", year: "2022", category: "Commercial", cover: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=900&q=80", images: [], videos: [], excerpt: "40 cm rammed earth walls.", area: "520 sqm", status: "Built" },
];
export const DEFAULT_JOURNAL: Journal[] = [
  { id: "j1", title: "The uneven brick is intentional", date: "12 Mar 2024", tag: "On site", image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&q=80", excerpt: "In Bayat we reject bricks that look too perfect." },
  { id: "j2", title: "Draw the shadows first, then the walls", date: "04 Jan 2024", tag: "Process", image: "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?w=600&q=80", excerpt: "At 7, at noon, at 4, we track where shadows fall." },
  { id: "j3", title: "Caring for a thatch roof", date: "21 Nov 2023", tag: "Material", image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&q=80", excerpt: "A thatch roof can last up to 10 years." },
  { id: "j4", title: "Why a house needs a deep veranda", date: "15 Sep 2023", tag: "Essay", image: "https://images.unsplash.com/photo-1449844908441-8829872d2607?w=600&q=80", excerpt: "The veranda is essential in the tropics." },
];
export const DEFAULT_STUDIO: StudioData = {
  heroTitle: "Houses that know\nhow to breathe.", heroSubtitle: "A small studio in Jakarta. We make houses that stay cool without heavy AC.",
  studioHeadline: "A small studio in a converted warehouse,", studioHeadlineAccent: "learning from the site", studioHeadlineTail: "before we draw.",
  quote: "4 to 5 houses a year. On site with the builders.", about: "Founded in 2018.", philosophy: ["Use what is nearby first", "Wind and sun are free", "Listen to the site, then draw", "Builders are teachers, not executors"],
  contactHeadline: "Let's build", contactHeadlineAccent: "something.", email: "halo@savana.co.id", phone: "+62 812 3456 7890", address: "Jl. Kemang Timur 72, Jakarta 12530", instagram: "@savana.architecture",
};
export const DEFAULT_TEAM: TeamMember[] = [
  { id: "t1", name: "Riko Savana", role: "Principal  drawing and site", bio: "TU Delft.", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&q=80" },
  { id: "t2", name: "Ayu Lestari", role: "Studio Director", bio: "Keeps budgets grounded.", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&q=80" },
  { id: "t3", name: "Bima Prakasa", role: "Lead Architect", bio: "Detail obsessed.", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&q=80" },
  { id: "t4", name: "Nadia Putri", role: "Material and Interior", bio: "Sources reclaimed teak.", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&q=80" },
];
export const DEFAULT_PRODUCTS: Product[] = [
  { id: "p1", name: "Sora Dining Table", category: "Table", price: "Rp 8,900,000", material: "Reclaimed teak and rattan", dimensions: "180 by 90 by 75 cm", image: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=800&q=80", images: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80"], excerpt: "Cross legs without nails.", inStock: true },
  { id: "p2", name: "Kala Folding Chair", category: "Chair", price: "Rp 1,750,000", material: "Teak and lontar weave", dimensions: "45 by 52 by 82 cm", image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80", images: [], excerpt: "Foldable.", inStock: true },
  { id: "p3", name: "Alur Wall Shelf", category: "Shelf", price: "Rp 2,400,000", material: "Sungkai plywood", dimensions: "120 by 20 by 180 cm", image: "https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?w=800&q=80", images: [], excerpt: "Grooved ledge.", inStock: true },
  { id: "p4", name: "Terracotta Pendant", category: "Light", price: "Rp 890,000", material: "Plered terracotta", dimensions: "28 cm dia", image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80", images: [], excerpt: "Hand pressed.", inStock: true },
  { id: "p5", name: "Uma Bench", category: "Chair", price: "Rp 3,200,000", material: "Laminated bamboo", dimensions: "160 by 35 by 45 cm", image: "https://images.unsplash.com/photo-1493666438817-866a91353ca9?w=800&q=80", images: [], excerpt: "For the veranda.", inStock: false },
  { id: "p6", name: "Sela Side Table", category: "Table", price: "Rp 1,250,000", material: "Andesite stone and black steel", dimensions: "40 by 40 by 50 cm", image: "https://images.unsplash.com/photo-1519947486511-46149fa0a254?w=800&q=80", images: [], excerpt: "Andesite offcut.", inStock: true },
  { id: "p7", name: "Lana Lounge Chair", category: "Chair", price: "Rp 2,850,000", material: "Rattan and young teak", dimensions: "68 by 72 by 78 cm", image: "https://images.unsplash.com/photo-1503602642458-232111445657?w=800&q=80", images: [], excerpt: "Tight rattan back.", inStock: true },
  { id: "p8", name: "Taka Console", category: "Table", price: "Rp 3,600,000", material: "Perhutani teak and brass", dimensions: "120 by 35 by 80 cm", image: "https://images.unsplash.com/photo-1493666438817-866a91353ca9?w=800&q=80", images: [], excerpt: "Thin brass legs.", inStock: true },
];
