export const workProjects = [
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
      {
        src: "/images/projects/showcases/zohour-showcase-01.webp",
        title: "Premium Storefront",
      },
      {
        src: "/images/projects/showcases/zohour-showcase-02.webp",
        title: "Product Discovery",
      },
      {
        src: "/images/projects/showcases/zohour-showcase-03.webp",
        title: "Checkout Flow",
      },
      {
        src: "/images/projects/showcases/zohour-showcase-04.webp",
        title: "Admin Operations",
      },
    ],
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
      {
        src: "/images/projects/showcases/s8-factory-showcase-01.webp",
        title: "Business Homepage",
      },
      {
        src: "/images/projects/showcases/s8-factory-showcase-02.webp",
        title: "Production Lines",
      },
      {
        src: "/images/projects/showcases/s8-factory-showcase-03.webp",
        title: "Request And Call Flow",
      },
      {
        src: "/images/projects/showcases/s8-factory-showcase-04.webp",
        title: "Admin Workspace",
      },
    ],
    liveUrl: "https://s8-factory.com",
    isComingSoon: false,
  },
  {
    name: "Atheer Otour",
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
      {
        src: "/images/projects/showcases/atheer-showcase-01.webp",
        title: "Luxury Storefront",
      },
      {
        src: "/images/projects/showcases/atheer-showcase-02.webp",
        title: "Fragrance Browsing",
      },
      {
        src: "/images/projects/showcases/atheer-showcase-03.webp",
        title: "Order Experience",
      },
      {
        src: "/images/projects/showcases/atheer-showcase-04.webp",
        title: "Store Management",
      },
    ],
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
      {
        src: "/images/projects/showcases/akm-showcase-01.webp",
        title: "Fashion Storefront",
      },
      {
        src: "/images/projects/showcases/akm-showcase-02.webp",
        title: "Product Variants",
      },
      {
        src: "/images/projects/showcases/akm-showcase-03.webp",
        title: "Shopping Flow",
      },
      {
        src: "/images/projects/showcases/akm-showcase-04.webp",
        title: "Admin Dashboard",
      },
    ],
    liveUrl: "https://akm-brand.com",
    isComingSoon: false,
  },
];

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
        liveUrl: project.liveUrl || merged[index].liveUrl,
      };
      return;
    }

    merged.push(project);
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
