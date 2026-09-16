const makeLogoLoop = (src, alt) =>
  Array.from({ length: 6 }, () => ({ src, alt }));

const topic = (enParagraph, enPoints, arParagraph, arPoints) => ({
  en: { paragraph: enParagraph, points: enPoints },
  ar: { paragraph: arParagraph, points: arPoints },
});

const protectionGroup = (key, enItems, arItems) => ({
  key,
  items: { en: enItems, ar: arItems },
});

export const portfolioExpansionProjects = [
  {
    slug: "darb",
    name: "Darb",
    title: "Darb",
    type: "Online Store",
    websiteType: "Online Store",
    businessType: "Perfume e-commerce store",
    status: "Featured",
    description:
      "A premium perfume store combining fragrance discovery, smooth ordering, customer accounts, tracking, and complete store management.",
    overview:
      "Darb turns the brand's fragrance identity into a full e-commerce operation. Customers can discover scents, browse categories, order as a guest or through an account, complete checkout, follow their orders, and return to a consistent branded experience while the team manages products, categories, bundles, reviews, delivery, payments, and order operations from one system.",
    fullDescription:
      "A production-ready perfume e-commerce experience built around discovery, checkout, order tracking, customer accounts, secure commerce operations, and a complete management workflow.",
    image: "/images/projects/darb-cover.webp",
    coverImage: "/images/projects/darb-cover.webp",
    logoImage: "/images/brands-logos/darb-logo.webp",
    showcaseImages: [
      "/images/projects/showcases/darb-showcase-01.webp",
      "/images/projects/showcases/darb-showcase-02.webp",
      "/images/projects/showcases/darb-showcase-03.webp",
    ],
    liveUrl: "https://darbfragrance.com",
    isComingSoon: false,
    reviewAliases: ["Darb", "Darb Perfumes", "Darb Fragrance"],
    logoLoop: makeLogoLoop("/images/brands-logos/darb-logo.webp", "Darb logo"),
    publicPages: {
      en: [
        "Home and fragrance discovery",
        "Shop and category browsing",
        "Product details",
        "Cart and checkout",
        "Order tracking",
        "Customer account and orders",
      ],
      ar: [
        "الرئيسية واكتشاف العطور",
        "المتجر وتصفح الفئات",
        "تفاصيل المنتج",
        "السلة وإتمام الطلب",
        "تتبع الطلب",
        "حساب العميل والطلبات",
      ],
    },
    qualities: {
      experience: topic(
        "Darb keeps the fragrance journey premium without slowing the customer down. Product discovery, scent details, cart, checkout, account ordering, and order follow-up are separated into clear steps so the visual identity stays strong while the buying path remains direct.",
        [
          "Fragrance-led discovery and category browsing",
          "Clear guest and account ordering paths",
          "Order tracking and post-purchase visibility",
        ],
        "يحافظ Darb على رحلة عطور راقية دون تعقيد الشراء. تم فصل اكتشاف المنتجات وتفاصيل العطر والسلة والدفع والطلب بالحساب ومتابعة الطلب إلى خطوات واضحة تحافظ على قوة الهوية وسهولة الاستخدام.",
        [
          "اكتشاف العطور والتصفح حسب الفئات",
          "مسارات واضحة للطلب كضيف أو بالحساب",
          "تتبع الطلب ووضوح ما بعد الشراء",
        ],
      ),
      performance: topic(
        "The store uses focused commerce routes, optimized product media, and a separated customer/admin architecture so browsing stays responsive as the fragrance catalog, campaigns, reviews, and operational data grow.",
        [
          "Responsive catalog and product pages",
          "Focused checkout and account routes",
          "Optimized storefront and operational separation",
        ],
        "يعتمد المتجر على مسارات تجارة مركزة ووسائط منتجات محسنة وفصل بين تجربة العميل والإدارة حتى يظل التصفح سريعًا مع نمو الكتالوج والعروض والمراجعات والبيانات التشغيلية.",
        [
          "كتالوج وصفحات منتجات متجاوبة",
          "مسارات مركزة للدفع والحساب",
          "فصل محسن بين المتجر والتشغيل",
        ],
      ),
      security: topic(
        "Darb keeps customer and management operations separated from the public storefront. Sensitive payment-proof handling stays private, commercial calculations remain controlled by the application, and protected account/admin routes keep operational actions away from anonymous browsing.",
        [
          "Protected customer and admin areas",
          "Private payment-proof handling",
          "Controlled order, delivery, and payment rules",
        ],
        "يفصل Darb عمليات العملاء والإدارة عن المتجر العام. تظل إثباتات الدفع الحساسة خاصة، وتبقى الحسابات التجارية تحت تحكم النظام، مع حماية مسارات الحساب والإدارة من التصفح العام.",
        [
          "حماية مناطق العملاء والإدارة",
          "معالجة خاصة لإثباتات الدفع",
          "قواعد منضبطة للطلبات والتوصيل والدفع",
        ],
      ),
      operations: topic(
        "The management side brings the daily store workload into one operating system: products, categories, bundles, orders, reviews, delivery rules, payment configuration, and store settings. The team can update the customer experience without depending on separate tools for routine commerce work.",
        [
          "Products, categories, and bundles",
          "Orders, reviews, and customer follow-up",
          "Delivery, payments, and store settings",
        ],
        "يجمع جانب الإدارة العمل اليومي للمتجر في نظام واحد يشمل المنتجات والفئات والباقات والطلبات والمراجعات وقواعد التوصيل وإعدادات الدفع والمتجر، ما يسهّل تحديث تجربة العميل دون الاعتماد على أدوات منفصلة.",
        [
          "المنتجات والفئات والباقات",
          "الطلبات والمراجعات ومتابعة العملاء",
          "التوصيل والدفع وإعدادات المتجر",
        ],
      ),
      growth: topic(
        "The structure is ready for a larger fragrance catalog, more campaigns, bundles, delivery rules, reviews, payment options, and deeper reporting without rebuilding the purchase journey. Darb can keep expanding while the storefront and management workflow stay consistent.",
        [
          "Expandable fragrance and category catalog",
          "Reusable offer, bundle, and review workflows",
          "Room for more payments, delivery rules, and reporting",
        ],
        "تم تجهيز الهيكل لكتالوج عطور أكبر وعروض وباقات وقواعد توصيل ومراجعات وخيارات دفع وتقارير أعمق دون إعادة بناء رحلة الشراء، ما يسمح لـ Darb بالنمو مع بقاء المتجر والتشغيل متسقين.",
        [
          "كتالوج عطور وفئات قابل للتوسع",
          "مسارات قابلة لإعادة الاستخدام للعروض والباقات والمراجعات",
          "قابلية لإضافة طرق دفع وتوصيل وتقارير جديدة",
        ],
      ),
    },
    metrics: [
      ["monthlySessions", "31,000"],
      ["monthlyOrders", "1,395"],
      ["conversionRate", "4.5%"],
      ["mobileTraffic", "88%"],
      ["lighthouseMobile", "96/100"],
      ["lighthouseDesktop", "100/100"],
      ["lcp", "1.3 seconds"],
      ["uptime90", "99.99% over 90 days"],
      ["p95Api", "150ms"],
    ],
    strongResults: {
      en: [
        "12% add-to-cart rate",
        "Checkout completion remains above 60%",
        "At least 24% of monthly orders come from returning customers",
      ],
      ar: [
        "معدل إضافة إلى السلة 12%",
        "اكتمال الدفع يظل أعلى من 60%",
        "ما لا يقل عن 24% من الطلبات الشهرية تأتي من عملاء عائدين",
      ],
    },
    security: {
      summary: {
        en: "Commerce and account operations are kept behind controlled application routes, with private handling for sensitive payment material and clear separation between customer access and store management.",
        ar: "تظل عمليات التجارة والحساب خلف مسارات منضبطة داخل النظام، مع معالجة خاصة لمواد الدفع الحساسة وفصل واضح بين وصول العميل وإدارة المتجر.",
      },
      groups: [
        protectionGroup(
          "accessControl",
          ["Protected customer account routes", "Protected administrator workspace", "Separated public and management flows"],
          ["حماية مسارات حساب العميل", "حماية مساحة الإدارة", "فصل المسارات العامة عن الإدارية"],
        ),
        protectionGroup(
          "sensitiveData",
          ["Private payment-proof handling", "Customer order details kept outside public catalog routes"],
          ["معالجة خاصة لإثباتات الدفع", "إبقاء تفاصيل طلبات العملاء خارج مسارات الكتالوج العامة"],
        ),
        protectionGroup(
          "businessRules",
          ["Controlled order totals", "Defined delivery and payment configuration", "Structured order-status handling"],
          ["حسابات منضبطة لإجماليات الطلب", "إعدادات محددة للتوصيل والدفع", "معالجة منظمة لحالات الطلب"],
        ),
      ],
    },
    managementGroups: [
      {
        title: { en: "Store management", ar: "إدارة المتجر" },
        items: {
          en: ["Products and categories", "Bundles and promotions", "Orders and reviews", "Store settings"],
          ar: ["المنتجات والفئات", "الباقات والعروض", "الطلبات والمراجعات", "إعدادات المتجر"],
        },
      },
      {
        title: { en: "Customer & order operations", ar: "تشغيل العملاء والطلبات" },
        items: {
          en: ["Delivery configuration", "Payment configuration", "Payment-proof review", "Order-status follow-up"],
          ar: ["إعدادات التوصيل", "إعدادات الدفع", "مراجعة إثباتات الدفع", "متابعة حالة الطلب"],
        },
      },
    ],
    launchInventory: {
      en: "A complete perfume commerce system with fragrance discovery, checkout, guest/account ordering, tracking, and store management.",
      ar: "نظام تجارة عطور متكامل يشمل اكتشاف العطور والدفع والطلب كضيف أو بالحساب والتتبع وإدارة المتجر.",
    },
  },
  {
    slug: "wam",
    name: "Wish A Mesh",
    title: "Wish A Mesh",
    type: "Online Store",
    websiteType: "Online Store",
    businessType: "3D printing store & custom ordering platform",
    status: "Featured",
    description:
      "A complete 3D-printing commerce platform connecting ready-made products, custom requests, 3D uploads, checkout, quotes, tracking, and management.",
    overview:
      "Wish A Mesh combines normal e-commerce with custom 3D-printing work in one customer journey. Shoppers can buy ready-made pieces, start a request from a reference image, upload a 3D model, receive a quote, complete checkout, track progress, manage their account, and stay inside one branded experience while the team manages products, custom jobs, quotes, promotions, reviews, and orders from the admin side.",
    fullDescription:
      "A full 3D-printing commerce and custom-ordering platform joining ready-made products, reference requests, 3D model uploads, quotes, checkout, tracking, accounts, and admin operations.",
    image: "/images/projects/wam-cover.webp",
    coverImage: "/images/projects/wam-cover.webp",
    logoImage: "/images/brands-logos/wam-logo.webp",
    showcaseImages: [
      "/images/projects/showcases/wam-showcase-01.webp",
      "/images/projects/showcases/wam-showcase-02.webp",
      "/images/projects/showcases/wam-showcase-03.webp",
    ],
    liveUrl: "https://wishamesh.com",
    isComingSoon: false,
    reviewAliases: ["Wish A Mesh", "WAM", "WishAMesh"],
    logoLoop: makeLogoLoop("/images/brands-logos/wam-logo.webp", "Wish A Mesh logo"),
    publicPages: {
      en: [
        "Home and product discovery",
        "Ready-made shop",
        "Product details and checkout",
        "Reference-image custom requests",
        "3D model uploads",
        "Account, quotes, and order tracking",
      ],
      ar: [
        "الرئيسية واكتشاف المنتجات",
        "متجر المنتجات الجاهزة",
        "تفاصيل المنتج والدفع",
        "طلبات مخصصة من صور مرجعية",
        "رفع النماذج ثلاثية الأبعاد",
        "الحساب وعروض الأسعار وتتبع الطلب",
      ],
    },
    qualities: {
      experience: topic(
        "Wish A Mesh gives three different customer intentions a clear route: buy a ready-made piece, start from a reference image, or upload a 3D model. Each flow stays distinct enough to be easy to understand while still feeling like one connected branded platform.",
        [
          "Clear ready-made shopping journey",
          "Dedicated reference-image request flow",
          "3D upload, quote, and order follow-up path",
        ],
        "يمنح Wish A Mesh ثلاث نوايا مختلفة للعميل مسارًا واضحًا: شراء قطعة جاهزة أو بدء طلب من صورة مرجعية أو رفع نموذج ثلاثي الأبعاد، مع بقاء كل مسار سهل الفهم ضمن منصة وهوية واحدة.",
        [
          "رحلة واضحة لشراء المنتجات الجاهزة",
          "مسار مخصص للطلبات من الصور المرجعية",
          "رفع النماذج وعروض الأسعار ومتابعة الطلب",
        ],
      ),
      performance: topic(
        "The platform separates catalog shopping, custom requests, quotes, uploads, checkout, and account tasks into focused routes. That keeps the interface responsive even though WAM handles more workflow types than a standard online store.",
        [
          "Focused ready-made and custom routes",
          "Responsive product and request interfaces",
          "Separated upload, quote, checkout, and account tasks",
        ],
        "تفصل المنصة التسوق والطلبات المخصصة وعروض الأسعار والرفع والدفع والحساب إلى مسارات مركزة، ما يحافظ على سلاسة الاستخدام رغم أن WAM يدير أنواع عمل أكثر من المتجر التقليدي.",
        [
          "مسارات مركزة للمنتجات الجاهزة والمخصصة",
          "واجهات متجاوبة للمنتجات والطلبات",
          "فصل الرفع وعروض الأسعار والدفع والحساب",
        ],
      ),
      security: topic(
        "Account, order, quote, and file workflows are separated from the public catalog. Private request material stays inside the relevant customer/management flow, while pricing, quote totals, and order states remain controlled by the system rather than the browser alone.",
        [
          "Protected account and management flows",
          "Private custom-request and model files",
          "Controlled quote, pricing, and order states",
        ],
        "تظل مسارات الحساب والطلبات وعروض الأسعار والملفات منفصلة عن الكتالوج العام، وتبقى مواد الطلبات المخصصة داخل مسار العميل والإدارة المناسب مع تحكم النظام في الأسعار والإجماليات وحالات الطلب.",
        [
          "حماية مسارات الحساب والإدارة",
          "ملفات خاصة للطلبات المخصصة والنماذج",
          "تحكم منضبط في عروض الأسعار وحالات الطلب",
        ],
      ),
      operations: topic(
        "The admin workspace connects the ready-made catalog with the custom production side of the business. Products, categories, orders, custom requests, quotes, uploads, promotions, reviews, print settings, and store configuration can all be followed without moving custom work into a separate offline process.",
        [
          "Catalog, orders, and customer reviews",
          "Custom requests, quotes, and 3D uploads",
          "Promotions, print settings, and store configuration",
        ],
        "تربط لوحة الإدارة بين كتالوج المنتجات الجاهزة وجانب الإنتاج المخصص. يمكن متابعة المنتجات والفئات والطلبات والطلبات المخصصة وعروض الأسعار والملفات والعروض والمراجعات وإعدادات الطباعة والمتجر دون فصل العمل المخصص خارج النظام.",
        [
          "الكتالوج والطلبات ومراجعات العملاء",
          "الطلبات المخصصة وعروض الأسعار وملفات 3D",
          "العروض وإعدادات الطباعة والمتجر",
        ],
      ),
      growth: topic(
        "WAM can grow ready-made collections and custom manufacturing workflows independently. New product categories, materials, print settings, promotions, quoting rules, and customer-service flows can be added without forcing every order into one rigid structure.",
        [
          "Expandable ready-made product catalog",
          "Independent custom and 3D-order workflows",
          "Room for more print options, promotions, and quoting rules",
        ],
        "يمكن لـ WAM توسيع مجموعات المنتجات الجاهزة ومسارات التصنيع المخصص بشكل مستقل، مع إضافة فئات وخامات وإعدادات طباعة وعروض وقواعد تسعير وخدمة عملاء جديدة دون حصر كل الطلبات في مسار واحد.",
        [
          "كتالوج منتجات جاهزة قابل للتوسع",
          "مسارات مستقلة للطلبات المخصصة والثلاثية الأبعاد",
          "قابلية لإضافة خيارات طباعة وعروض وقواعد تسعير جديدة",
        ],
      ),
    },
    metrics: [
      ["monthlySessions", "29,000"],
      ["monthlyOrders", "1,305"],
      ["conversionRate", "4.5%"],
      ["mobileTraffic", "85%"],
      ["lighthouseMobile", "95/100"],
      ["lighthouseDesktop", "99/100"],
      ["lcp", "1.4 seconds"],
      ["uptime90", "99.98% over 90 days"],
      ["p95Api", "165ms"],
    ],
    strongResults: {
      en: [
        "Checkout completion remains above 58%",
        "At least 20% of monthly orders come through custom or 3D request flows",
        "Quote and order tracking remain inside one customer account journey",
      ],
      ar: [
        "اكتمال الدفع يظل أعلى من 58%",
        "ما لا يقل عن 20% من الطلبات الشهرية تأتي عبر الطلبات المخصصة أو ثلاثية الأبعاد",
        "تظل عروض الأسعار وتتبع الطلب ضمن رحلة حساب عميل واحدة",
      ],
    },
    security: {
      summary: {
        en: "Customer accounts, custom requests, quotes, model files, and order details are kept inside controlled workflows rather than exposed through the public product catalog.",
        ar: "تظل حسابات العملاء والطلبات المخصصة وعروض الأسعار وملفات النماذج وتفاصيل الطلبات داخل مسارات منضبطة بدل إتاحتها عبر كتالوج المنتجات العام.",
      },
      groups: [
        protectionGroup(
          "accessControl",
          ["Protected customer account routes", "Protected management workspace", "Customer-specific order and quote access"],
          ["حماية مسارات حساب العميل", "حماية مساحة الإدارة", "وصول خاص بطلبات وعروض كل عميل"],
        ),
        protectionGroup(
          "sensitiveData",
          ["Private custom-request references", "Private 3D model uploads", "Order and quote details kept outside public catalog routes"],
          ["خصوصية مراجع الطلبات المخصصة", "خصوصية ملفات النماذج ثلاثية الأبعاد", "إبقاء تفاصيل الطلبات وعروض الأسعار خارج الكتالوج العام"],
        ),
        protectionGroup(
          "businessRules",
          ["Controlled quote totals", "Defined order states", "Separated ready-made and custom workflow rules"],
          ["حسابات منضبطة لعروض الأسعار", "حالات محددة للطلبات", "فصل قواعد المنتجات الجاهزة عن الطلبات المخصصة"],
        ),
      ],
    },
    managementGroups: [
      {
        title: { en: "Commerce operations", ar: "تشغيل المتجر" },
        items: {
          en: ["Products and categories", "Orders and payments", "Reviews and promotions", "Store settings"],
          ar: ["المنتجات والفئات", "الطلبات والمدفوعات", "المراجعات والعروض", "إعدادات المتجر"],
        },
      },
      {
        title: { en: "Custom & 3D operations", ar: "الطلبات المخصصة والطباعة ثلاثية الأبعاد" },
        items: {
          en: ["Reference-image requests", "Quotes", "3D model uploads", "Print configuration and job follow-up"],
          ar: ["طلبات الصور المرجعية", "عروض الأسعار", "رفع النماذج ثلاثية الأبعاد", "إعدادات الطباعة ومتابعة التنفيذ"],
        },
      },
    ],
    launchInventory: {
      en: "Ready-made shopping, reference-image requests, 3D-model ordering, quotes, checkout, tracking, accounts, and management in one platform.",
      ar: "تسوق المنتجات الجاهزة وطلبات الصور المرجعية وطلبات النماذج ثلاثية الأبعاد وعروض الأسعار والدفع والتتبع والحسابات والإدارة في منصة واحدة.",
    },
  },
  {
    slug: "burn-gym",
    name: "Burn Gym",
    title: "Burn Gym",
    type: "Custom Dashboard",
    websiteType: "Custom Dashboard",
    businessType: "Gym management & operations dashboard",
    status: "Featured",
    description:
      "A custom gym-management dashboard that brings members, memberships, coaches, classes, attendance, payments, and daily operations into one workspace.",
    overview:
      "Burn Gym centralizes the work a busy gym team handles every day. Instead of jumping between disconnected records, the dashboard gives management one clear place for member information, membership status, coaches, classes, attendance, payments, and the operational overview needed to see what is happening across the gym quickly.",
    fullDescription:
      "A custom operations dashboard built to make gym management faster and clearer across members, memberships, coaches, classes, attendance, payments, and day-to-day administration.",
    image: "/images/projects/burngym-cover.webp",
    coverImage: "/images/projects/burngym-cover.webp",
    logoImage: "/images/brands-logos/burngym-logo.webp",
    showcaseImages: [
      "/images/projects/showcases/burngym-showcase-01.webp",
      "/images/projects/showcases/burngym-showcase-02.webp",
      "/images/projects/showcases/burngym-showcase-03.webp",
    ],
    liveUrl: null,
    isComingSoon: false,
    reviewAliases: ["Burn Gym", "BurnGym"],
    logoLoop: makeLogoLoop("/images/brands-logos/burngym-logo.webp", "Burn Gym logo"),
    publicPages: {
      en: ["Dashboard", "Members", "Memberships", "Coaches", "Classes", "Attendance", "Payments"],
      ar: ["لوحة التحكم", "الأعضاء", "الاشتراكات", "المدربون", "الحصص", "الحضور", "المدفوعات"],
    },
    qualities: {
      experience: topic(
        "Burn Gym is designed around fast daily management. The dashboard gives staff a consistent visual hierarchy and predictable controls across every module, so moving from a member record to a membership, class, attendance entry, or payment feels like one connected operating system instead of separate tools.",
        [
          "One dashboard for the core gym workflow",
          "Consistent controls across management modules",
          "Fast movement between member, class, attendance, and payment tasks",
        ],
        "تم تصميم Burn Gym حول الإدارة اليومية السريعة. تمنح لوحة التحكم فريق العمل تسلسلًا بصريًا واضحًا وعناصر تحكم متسقة بين الوحدات، بحيث تبدو إدارة العضو والاشتراك والحصة والحضور والدفع كنظام تشغيلي واحد بدل أدوات منفصلة.",
        [
          "لوحة واحدة لمسار تشغيل النادي الأساسي",
          "عناصر تحكم متسقة بين وحدات الإدارة",
          "انتقال سريع بين مهام الأعضاء والحصص والحضور والمدفوعات",
        ],
      ),
      performance: topic(
        "The interface keeps high-frequency management views focused and lightweight. Shared dashboard patterns reduce repeated UI work, responsive layouts keep the system practical across screen sizes, and each module loads only the information needed for its operational task.",
        [
          "Lightweight high-frequency management views",
          "Shared reusable dashboard patterns",
          "Responsive operational layouts",
        ],
        "تحافظ الواجهة على خفة وتركيز صفحات الإدارة الأكثر استخدامًا. تقلل أنماط لوحة التحكم المشتركة تكرار الواجهة، وتبقي التخطيطات المتجاوبة النظام عمليًا على مختلف الشاشات، مع عرض المعلومات اللازمة لكل مهمة فقط.",
        [
          "واجهات إدارة خفيفة للمهام المتكررة",
          "أنماط لوحة تحكم مشتركة وقابلة لإعادة الاستخدام",
          "تخطيطات تشغيلية متجاوبة",
        ],
      ),
      security: topic(
        "Operational information is organized through management-only dashboard views with clear module boundaries and controlled record states. Member, membership, attendance, and payment information is kept inside the management experience instead of being mixed into public-facing content.",
        [
          "Management-only operational views",
          "Separated member, membership, attendance, and payment records",
          "Consistent controlled record states across modules",
        ],
        "يتم تنظيم المعلومات التشغيلية داخل واجهات إدارية مخصصة مع حدود واضحة للوحدات وحالات منضبطة للسجلات. تبقى بيانات الأعضاء والاشتراكات والحضور والمدفوعات داخل تجربة الإدارة بدل خلطها بمحتوى عام.",
        [
          "واجهات تشغيل مخصصة للإدارة",
          "فصل سجلات الأعضاء والاشتراكات والحضور والمدفوعات",
          "حالات سجلات متسقة ومنضبطة بين الوحدات",
        ],
      ),
      operations: topic(
        "The biggest gain is operational clarity. Management can see the gym overview and move directly into members, active memberships, coaches, classes, attendance, or payments without maintaining separate spreadsheets or disconnected screens for each part of the business.",
        [
          "Central member and membership management",
          "Coach, class, and attendance operations",
          "Payment visibility connected to the same dashboard workflow",
        ],
        "أكبر مكسب هو وضوح التشغيل. يمكن للإدارة رؤية الصورة العامة للنادي والانتقال مباشرة إلى الأعضاء والاشتراكات والمدربين والحصص والحضور والمدفوعات دون الاعتماد على جداول أو شاشات منفصلة لكل جزء من العمل.",
        [
          "إدارة مركزية للأعضاء والاشتراكات",
          "تشغيل المدربين والحصص والحضور",
          "وضوح المدفوعات ضمن نفس مسار لوحة التحكم",
        ],
      ),
      growth: topic(
        "The dashboard structure gives Burn Gym room to grow without losing the operating model. More staff views, membership plans, class types, reporting, branches, and management modules can be added around the same core dashboard patterns.",
        [
          "Expandable membership and class structures",
          "Room for more reporting and management views",
          "Reusable foundation for additional branches or operating modules",
        ],
        "يمنح هيكل لوحة التحكم Burn Gym مساحة للنمو دون فقدان نموذج التشغيل. يمكن إضافة أدوار موظفين وخطط اشتراك وأنواع حصص وتقارير وفروع ووحدات إدارة جديدة حول نفس الأنماط الأساسية.",
        [
          "هياكل قابلة للتوسع للاشتراكات والحصص",
          "مساحة لإضافة تقارير وواجهات إدارة جديدة",
          "أساس قابل لإعادة الاستخدام لفروع أو وحدات تشغيل إضافية",
        ],
      ),
    },
    metrics: [
      ["lighthouseMobile", "96/100"],
      ["lighthouseDesktop", "100/100"],
      ["lcp", "1.2 seconds"],
    ],
    strongResults: {
      en: [
        "Seven core management areas brought into one workspace",
        "Membership, attendance, and payment views follow the same operating pattern",
        "Daily staff tasks can be handled without switching between disconnected management screens",
      ],
      ar: [
        "جمع سبع مناطق إدارة أساسية في مساحة عمل واحدة",
        "الاشتراكات والحضور والمدفوعات تتبع نفس نمط التشغيل",
        "إدارة المهام اليومية دون التنقل بين شاشات منفصلة وغير مترابطة",
      ],
    },
    security: {
      summary: {
        en: "The management experience keeps operational records inside dedicated dashboard modules with clear boundaries between member, membership, attendance, class, coach, and payment information.",
        ar: "تحافظ تجربة الإدارة على السجلات التشغيلية داخل وحدات لوحة تحكم مخصصة مع حدود واضحة بين بيانات الأعضاء والاشتراكات والحضور والحصص والمدربين والمدفوعات.",
      },
      groups: [
        protectionGroup(
          "accessControl",
          ["Management-only dashboard views", "Separated operational modules", "Consistent navigation between controlled management areas"],
          ["واجهات لوحة تحكم مخصصة للإدارة", "فصل الوحدات التشغيلية", "تنقل متسق بين مناطق الإدارة المنضبطة"],
        ),
        protectionGroup(
          "sensitiveData",
          ["Member records kept inside management views", "Membership and payment information separated from general dashboard summaries"],
          ["إبقاء سجلات الأعضاء داخل واجهات الإدارة", "فصل بيانات الاشتراكات والمدفوعات عن الملخصات العامة"],
        ),
        protectionGroup(
          "businessRules",
          ["Defined membership states", "Structured attendance records", "Consistent payment-status presentation"],
          ["حالات محددة للاشتراكات", "سجلات حضور منظمة", "عرض متسق لحالات الدفع"],
        ),
      ],
    },
    managementGroups: [
      {
        title: { en: "Member operations", ar: "تشغيل الأعضاء" },
        items: {
          en: ["Members", "Memberships", "Membership status", "Payment visibility"],
          ar: ["الأعضاء", "الاشتراكات", "حالة الاشتراك", "وضوح المدفوعات"],
        },
      },
      {
        title: { en: "Gym operations", ar: "تشغيل النادي" },
        items: {
          en: ["Coaches", "Classes", "Attendance", "Dashboard overview"],
          ar: ["المدربون", "الحصص", "الحضور", "نظرة لوحة التحكم"],
        },
      },
    ],
    launchInventory: {
      en: "Seven connected management areas covering the dashboard, members, memberships, coaches, classes, attendance, and payments.",
      ar: "سبع مناطق إدارة مترابطة تشمل لوحة التحكم والأعضاء والاشتراكات والمدربين والحصص والحضور والمدفوعات.",
    },
  },
];
