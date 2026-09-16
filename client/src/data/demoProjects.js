import { portfolioExpansionProjects } from "./portfolioExpansionProjects.js";
import { caseStudyDetails } from "./caseStudyDetails.js";

const baseWorkProjects = [
  {
    name: "Zohour",
    slug: "zohour",
    type: "Online Store",
    businessType: "Floral cap store",
    status: "Featured",
    description: "A calm e-commerce store for floral-inspired caps with a soft brand system.",
    overview: "A polished store experience built around product discovery, checkout, and order tracking.",
    coverImage: "/images/projects/zohour-cover.webp",
    publicFeatures: [
      "Homepage with floral vibes",
      "Shop and product details",
      "Cart and checkout flow",
      "Customer orders area",
    ],
    adminFeatures: [
      "Product manager",
      "Order and shipping controls",
      "Offers and discount codes",
      "Waitlist and analytics views",
    ],
    pages: [
      "Home",
      "Shop",
      "Product Details",
      "Cart",
      "Checkout",
      "My Orders",
      "Admin Orders",
      "Admin Products",
    ],
    techHighlights: [
      "MERN storefront",
      "Protected customer/admin routes",
      "Discount and order calculations",
      "Responsive product grid",
    ],
    tags: ["E-commerce", "Caps", "Admin"],
    showcaseImages: [
      "/images/projects/showcases/zohour-showcase-01.webp",
      "/images/projects/showcases/zohour-showcase-02.webp",
      "/images/projects/showcases/zohour-showcase-03.webp",
    ],
    qualities: {
      userExperience:
        "The floral storefront keeps product discovery, cart, checkout, and customer orders easy to follow across screen sizes.",
      performance:
        "A responsive product grid and focused commerce structure keep browsing direct as customers move from the shop to checkout.",
      reliability:
        "Protected customer and admin routes support private areas, while defined order and discount calculations keep commerce actions consistent.",
      management:
        "Product, order, shipping, offer, discount, and waitlist tools support daily store operations and future catalog growth.",
    },
    liveUrl: "https://zohour-store.vercel.app",
    isComingSoon: false,
  },
  {
    name: "S8 Factory",
    slug: "s8-factory",
    type: "Business Website",
    businessType: "Clothing factory",
    status: "Featured",
    description: "A bold production website for factory services, partners, requests, and calls.",
    overview: "A serious factory presence with clear production paths and operational admin tools.",
    coverImage: "/images/projects/s8-cover.webp",
    publicFeatures: [
      "Home page with bold presence",
      "Brands and partners showcase",
      "Material lines presentation",
      "Production request and call flows",
    ],
    adminFeatures: [
      "Production request manager",
      "Call appointments and slot settings",
      "Contracts and proposals",
      "Reviews and analytics",
    ],
    pages: [
      "Home",
      "Brands",
      "Lines",
      "Appointment",
      "About",
      "Contact",
      "Account",
      "Admin",
    ],
    techHighlights: [
      "MERN request workflow",
      "Protected account/admin routes",
      "Appointment settings",
      "Contract tracking",
    ],
    tags: ["Business Website", "Factory", "Portal"],
    showcaseImages: [
      "/images/projects/showcases/s8-factory-showcase-01.webp",
      "/images/projects/showcases/s8-factory-showcase-02.webp",
      "/images/projects/showcases/s8-factory-showcase-03.webp",
    ],
    qualities: {
      userExperience:
        "Clear production paths connect visitors with factory services, partners, material lines, production requests, and call booking.",
      performance:
        "The responsive page structure keeps service information and request flows focused across desktop and mobile layouts.",
      reliability:
        "Protected account and admin routes support structured production requests, appointments, proposals, and contract tracking.",
      management:
        "Request, appointment, contract, review, and settings tools organize factory operations while leaving room for new service lines.",
    },
    liveUrl: "https://s8-factory.com",
    isComingSoon: false,
  },
  {
    name: "Atheer",
    slug: "atheer",
    type: "Online Store",
    businessType: "Perfume store",
    status: "Featured",
    description: "A dark luxury perfume store with products, checkout, orders, and admin tools.",
    overview: "A fragrance storefront with a strong visual direction and a practical commerce backend.",
    coverImage: "/images/projects/atheer-cover.webp",
    publicFeatures: [
      "Dark luxury homepage",
      "Shop and product details",
      "Cart and checkout",
      "Customer order tracking",
    ],
    adminFeatures: [
      "Orders dashboard",
      "Products and product uploads",
      "Offers and discount codes",
      "Analytics and customer management",
    ],
    pages: [
      "Home",
      "Shop",
      "Product Details",
      "Cart",
      "Checkout",
      "My Orders",
      "Contact",
      "Admin",
    ],
    techHighlights: [
      "Perfume product metadata",
      "Payment proof fields",
      "Discount code flow",
      "Cloudinary-ready uploads",
    ],
    tags: ["E-commerce", "Perfume", "Admin"],
    showcaseImages: [
      "/images/projects/showcases/atheer-showcase-01.webp",
      "/images/projects/showcases/atheer-showcase-02.webp",
      "/images/projects/showcases/atheer-showcase-03.webp",
    ],
    qualities: {
      userExperience:
        "The dark storefront gives fragrance products a clear browsing path through product details, cart, checkout, and order tracking.",
      performance:
        "Focused product metadata and a responsive commerce layout keep the catalog organized without distracting from discovery.",
      reliability:
        "Structured order, payment-proof, and discount-code fields keep purchase information consistent from checkout through management.",
      management:
        "Order, product, upload, offer, discount, customer, and analytics tools support the practical work behind the storefront.",
    },
    liveUrl: "https://atheer-otour.vercel.app",
    isComingSoon: false,
  },
  {
    name: "AKM",
    slug: "akm",
    type: "Online Store",
    businessType: "Clothing store",
    status: "Featured",
    description: "A clean fashion store with product variants, offers, checkout, and tracking.",
    overview: "A commerce build focused on product variants, customer orders, and serious admin operations.",
    coverImage: "/images/projects/akm-cover.webp",
    publicFeatures: [
      "Homepage and arabic translation",
      "Shop and product details",
      "Color and size variants",
      "Cart and checkout",
    ],
    adminFeatures: [
      "Products manager",
      "Orders and payment statuses",
      "Offers, bundles, coupons and reviews",
      "Email campaigns and site settings",
    ],
    pages: [
      "Home",
      "Shop",
      "Product Details",
      "Cart",
      "Checkout",
      "My Orders",
      "Admin Products",
      "Admin Orders",
    ],
    techHighlights: [
      "React Query data flows",
      "Color/size stock model",
      "Meta/TikTok/Snap tracking hooks",
      "Cloudinary upload service",
    ],
    tags: ["E-commerce", "Fashion", "Tracking"],
    showcaseImages: [
      "/images/projects/showcases/akm-showcase-01.webp",
      "/images/projects/showcases/akm-showcase-02.webp",
      "/images/projects/showcases/akm-showcase-03.webp",
    ],
    qualities: {
      userExperience:
        "Arabic support, clear product details, and color and size choices make the fashion catalog practical to browse and order from.",
      performance:
        "React Query data flows and a structured variant model keep product and stock information organized throughout the shopping flow.",
      reliability:
        "Defined stock, order, and payment states give customers and managers a consistent view of each purchase as it progresses.",
      management:
        "Products, orders, offers, bundles, coupons, reviews, campaigns, and site settings form a maintainable base for store growth.",
    },
    liveUrl: "https://akm-brand.com",
    isComingSoon: false,
  },
  {
    name: "Davinto",
    slug: "davinto",
    type: "Online Store",
    businessType: "Fashion store",
    description:
      "A refined fashion store with a polished shopping experience, responsive product browsing, and smooth checkout.",
    coverImage: "/images/projects/davinto-cover.webp",
    showcaseImages: [
      "/images/projects/showcases/davinto-showcase-01.webp",
      "/images/projects/showcases/davinto-showcase-02.webp",
      "/images/projects/showcases/davinto-showcase-03.webp",
    ],
    qualities: {
      userExperience:
        "Responsive product browsing and a clear checkout journey keep the fashion store polished and easy to use on desktop and mobile.",
      performance:
        "A focused storefront structure keeps attention on products and supports efficient browsing across screen sizes.",
      reliability:
        "The shopping journey uses clear product and checkout steps so customers can move through the store with confidence.",
      management:
        "A reusable storefront structure gives fashion collections and supporting content room to expand without changing the core experience.",
    },
    liveUrl: "https://davinto-store.com",
    isComingSoon: true,
  },
  {
    name: "Salah Frame",
    slug: "salah-frame",
    type: "Online Store",
    businessType: "Custom frame store",
    description:
      "A creative frame store with clear collections, customization options, and a simple ordering journey.",
    coverImage: "/images/projects/salahframe-cover.webp",
    showcaseImages: [
      "/images/projects/showcases/salah-frame-showcase-01.webp",
      "/images/projects/showcases/salah-frame-showcase-02.webp",
      "/images/projects/showcases/salah-frame-showcase-03.webp",
    ],
    qualities: {
      userExperience:
        "Clear collections, customization choices, and a simple ordering journey help customers find and shape the right frame.",
      performance:
        "A responsive, focused storefront keeps collections and product choices readable across desktop and mobile screens.",
      reliability:
        "The ordering flow presents customization choices in a clear sequence, reducing ambiguity as customers prepare their selection.",
      management:
        "The collection-led structure can accommodate new frame styles, customization options, and supporting content over time.",
    },
    liveUrl: "https://salah-frame.myshopify.com",
    isComingSoon: true,
  },
  {
    name: "Fresh Cart",
    slug: "fresh-cart",
    type: "Online Store",
    businessType: "Product discovery store",
    description:
      "A modern online store designed to make browsing categories and finding products feel fast and simple.",
    coverImage: "/images/projects/freshcart-cover.webp",
    showcaseImages: [
      "/images/projects/showcases/fresh-cart-showcase-01.webp",
      "/images/projects/showcases/fresh-cart-showcase-02.webp",
      "/images/projects/showcases/fresh-cart-showcase-03.webp",
    ],
    qualities: {
      userExperience:
        "Clear categories and product discovery give shoppers a direct way to browse the catalog on desktop and mobile.",
      performance:
        "The responsive page structure keeps category and product browsing focused, with a simple path between key store views.",
      reliability:
        "A consistent catalog structure keeps product information and navigation predictable throughout the browsing experience.",
      management:
        "Reusable category and product patterns provide a maintainable base for adding more catalog content in the future.",
    },
    liveUrl: null,
    isComingSoon: true,
  },
  {
    name: "Travco",
    slug: "travco",
    type: "Business Website",
    businessType: "Company profile",
    description:
      "A professional business website presenting the company, its services, and its work with clarity and trust.",
    coverImage: "/images/projects/travco-cover.webp",
    showcaseImages: [
      "/images/projects/showcases/travco-showcase-01.webp",
      "/images/projects/showcases/travco-showcase-02.webp",
      "/images/projects/showcases/travco-showcase-03.webp",
    ],
    qualities: {
      userExperience:
        "Clear navigation presents the company, its services, and its work in a direct format that supports trust and understanding.",
      performance:
        "A focused responsive structure keeps business content readable and easy to scan across screen sizes.",
      reliability:
        "A consistent public-content layout gives visitors a dependable path through company and service information.",
      management:
        "The maintainable content structure leaves room to expand services, company information, and selected work without changing the core layout.",
    },
    liveUrl: null,
    isComingSoon: true,
  },
  {
    name: "ByJojo",
    slug: "byjojo",
    type: "Online Store",
    businessType: "Personalized gifts store",
    description:
      "An elegant personalized-gifts store with clear product discovery and a warm, polished visual direction.",
    coverImage: "/images/projects/byjojo-cover.webp",
    showcaseImages: [
      "/images/projects/showcases/byjojo-showcase-01.webp",
      "/images/projects/showcases/byjojo-showcase-02.webp",
      "/images/projects/showcases/byjojo-showcase-03.webp",
    ],
    qualities: {
      userExperience:
        "A warm visual direction and clear product discovery help shoppers explore personalized gifts comfortably on any screen.",
      performance:
        "The responsive storefront structure keeps product browsing focused while preserving the brand-led presentation.",
      reliability:
        "Consistent product and navigation patterns make the browsing journey predictable as customers compare gift options.",
      management:
        "Reusable product and content patterns allow the gift range and brand storytelling to grow within a maintainable structure.",
    },
    liveUrl: null,
    isComingSoon: true,
  },
  {
    name: "MS Store",
    slug: "ms-store",
    type: "Online Store",
    businessType: "Product catalog store",
    description:
      "A clean online store that organizes products clearly and gives customers a simple shopping experience.",
    coverImage: "/images/projects/ms-cover.webp",
    showcaseImages: [
      "/images/projects/showcases/ms-store-showcase-01.webp",
      "/images/projects/showcases/ms-store-showcase-02.webp",
      "/images/projects/showcases/ms-store-showcase-03.webp",
    ],
    qualities: {
      userExperience:
        "Clear product organization gives customers a simple shopping experience with straightforward browsing across devices.",
      performance:
        "A responsive, efficient page structure keeps the catalog readable and the shopping path focused.",
      reliability:
        "Consistent product presentation and navigation help customers understand where they are throughout the store.",
      management:
        "The reusable catalog structure supports future product and content expansion while keeping the project easy to maintain.",
    },
    liveUrl: null,
    isComingSoon: true,
  },
];

const originalWorkProjects = baseWorkProjects.map((project) => ({
  ...project,
  ...caseStudyDetails[project.slug],
}));

export const workProjects = (() => {
  const s8Index = originalWorkProjects.findIndex((project) => project?.slug === "s8-factory");
  if (s8Index < 0) {
    throw new Error('Static portfolio catalog is missing the "s8-factory" project');
  }

  const darbProject = portfolioExpansionProjects.find((project) => project.slug === "darb");
  const wamProject = portfolioExpansionProjects.find((project) => project.slug === "wam");
  const burnGymProject = portfolioExpansionProjects.find((project) => project.slug === "burn-gym");

  if (!darbProject || !wamProject || !burnGymProject) {
    throw new Error("Portfolio expansion projects are incomplete");
  }

  return [
    ...originalWorkProjects.slice(0, s8Index + 1),
    darbProject,
    wamProject,
    ...originalWorkProjects.slice(s8Index + 1),
    burnGymProject,
  ];
})();

export const mergeProjectsWithFallback = (projects = []) => {
  if (!projects.length) return workProjects;

  const merged = [...workProjects];

  projects.forEach((project) => {
    const index = merged.findIndex((item) => item.slug === project.slug);

    if (index >= 0) {
      merged[index] = {
        ...merged[index],
        ...project,
        showcaseImages: project.showcaseImages || merged[index].showcaseImages,
        qualities: project.qualities || merged[index].qualities,
        liveUrl: project.liveUrl || merged[index].liveUrl,
      };
      return;
    }

    // New case studies are published through the static catalog first so every
    // public card has a prerendered route, metadata, and sitemap entry.
  });

  return merged;
};

export const getFallbackProjectBySlug = (slug) =>
  workProjects.find((project) => project.slug === slug);

export const workFilters = [
  "All",
  "Online Store",
  "Business Website",
  "Factory",
  "Fashion",
  "Perfume",
  "Admin",
];
