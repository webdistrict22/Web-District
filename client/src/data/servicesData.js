const service = ({
  id,
  tone,
  reverse,
  serviceType,
  relatedProjectSlugs = [],
  projectSlugs = relatedProjectSlugs,
  relatedServiceIds = [],
  seo,
  page,
}) => ({
  id,
  slug: id,
  path: `/services/${id}`,
  tone,
  reverse,
  serviceType,
  relatedProjectSlugs,
  projectSlugs,
  relatedServiceIds,
  seo,
  page,
});

export const serviceCatalog = [
  service({
    id: "online-stores",
    tone: "light",
    reverse: false,
    serviceType: "E-commerce website design and development",
    relatedProjectSlugs: ["zohour", "davinto", "salah-frame", "atheer"],
    projectSlugs: [
      "zohour",
      "atheer",
      "akm",
      "davinto",
      "salah-frame",
      "fresh-cart",
      "byjojo",
      "ms-store",
    ],
    relatedServiceIds: ["landing-pages", "custom-platforms", "business-websites"],
    seo: {
      en: {
        title: "E-commerce Website Development Egypt | Web District",
        description:
          "Web District builds e-commerce websites in Egypt with product discovery, checkout, payments, delivery, customer accounts, and practical store management.",
      },
      ar: {
        title: "تطوير المتاجر الإلكترونية في مصر | Web District",
        description:
          "تصمم Web District وتطور متاجر إلكترونية في مصر تشمل عرض المنتجات والدفع والتوصيل وحسابات العملاء وأدوات إدارة المتجر بشكل عملي وقابل للتوسع.",
      },
    },
    page: {
      en: {
        name: "Online Stores",
        eyebrow: "E-commerce",
        title: "Online stores built around how customers actually buy.",
        intro:
          "For product brands in Egypt that need a complete buying experience beyond social-media orders, we shape the storefront, checkout, payments, delivery, and management tools as one connected system.",
        contextEyebrow: "The goal",
        contextTitle: "Make buying easier without making the business harder to run.",
        contextParagraphs: [
          "A strong store has to work from both sides. Customers need a clear path from discovering a product to completing an order, while the team needs practical control over products, orders, offers, delivery, and customer follow-up.",
          "We choose the commerce stack around the real scope of the brand—whether that means Shopify or a custom coded store—rather than forcing every project into the same setup.",
        ],
        proofEyebrow: "Relevant work",
        proofTitle: "E-commerce projects built for real product brands.",
        proofDescription:
          "These case studies show different approaches to catalogs, variants, bundles, checkout, customer orders, and store operations.",
        relatedEyebrow: "Related services",
        relatedTitle: "When the project needs more than the storefront.",
        hubLinkLabel: "Explore Online Stores",
      },
      ar: {
        name: "المتاجر الإلكترونية",
        eyebrow: "التجارة الإلكترونية",
        title: "متاجر إلكترونية مبنية حول طريقة شراء عملائك فعليًا.",
        intro:
          "للعلامات التجارية في مصر التي تحتاج تجربة شراء متكاملة تتجاوز الطلبات عبر السوشيال ميديا، نبني واجهة المتجر والدفع والتوصيل وأدوات الإدارة كنظام واحد مترابط.",
        contextEyebrow: "الهدف",
        contextTitle: "نجعل الشراء أسهل من دون أن تصبح إدارة المتجر أصعب.",
        contextParagraphs: [
          "المتجر القوي يجب أن يعمل من الجهتين: مسار واضح للعميل من اكتشاف المنتج حتى إتمام الطلب، وتحكم عملي للفريق في المنتجات والطلبات والعروض والتوصيل ومتابعة العملاء.",
          "نختار بنية المتجر بحسب احتياج المشروع الحقيقي، سواء كان Shopify أو متجرًا مبرمجًا خصيصًا، بدلًا من فرض نفس الحل على كل علامة تجارية.",
        ],
        proofEyebrow: "أعمال مرتبطة",
        proofTitle: "مشاريع تجارة إلكترونية لعلامات تجارية حقيقية.",
        proofDescription:
          "توضح دراسات الحالة طرقًا مختلفة لتنظيم المنتجات والمتغيرات والباقات والدفع وطلبات العملاء وإدارة المتجر.",
        relatedEyebrow: "خدمات مرتبطة",
        relatedTitle: "عندما يحتاج المشروع أكثر من واجهة متجر.",
        hubLinkLabel: "استكشف المتاجر الإلكترونية",
      },
    },
  }),
  service({
    id: "business-websites",
    tone: "gold",
    reverse: true,
    serviceType: "Business website design and development",
    relatedProjectSlugs: ["s8-factory"],
    relatedServiceIds: ["landing-pages", "booking-websites", "custom-platforms"],
    seo: {
      en: {
        title: "Business Website Design & Development Egypt | Web District",
        description:
          "Web District builds business websites in Egypt that explain services clearly, strengthen credibility, and turn interest into qualified enquiries.",
      },
      ar: {
        title: "تصميم وتطوير مواقع الشركات في مصر | Web District",
        description:
          "تبني Web District مواقع شركات احترافية في مصر توضح الخدمات بشكل واضح وتعزز الثقة وتحوّل اهتمام الزوار إلى استفسارات وفرص عمل جادة.",
      },
    },
    page: {
      en: {
        name: "Business Websites",
        eyebrow: "Companies",
        title: "Business websites that make the company easy to understand and trust.",
        intro:
          "For companies, factories, agencies, consultants, and service businesses in Egypt, the website should explain what the business does quickly, prove credibility, and give serious prospects a clear next step.",
        contextEyebrow: "The goal",
        contextTitle: "Turn a complicated business into a clear digital presentation.",
        contextParagraphs: [
          "Business websites often fail when every service, capability, brochure, and company detail competes for attention. We structure the information so visitors can understand the offer first, then move naturally toward proof and contact.",
          "The right scope can stay presentation-focused or extend into enquiries, appointments, downloadable profiles, multilingual content, and admin-managed business information without changing the core experience.",
        ],
        proofEyebrow: "Relevant work",
        proofTitle: "A business website connected to real operations.",
        proofDescription:
          "S8 Factory shows how a company website can present capabilities clearly while connecting enquiries, appointments, and operational workflows behind the scenes.",
        relatedEyebrow: "Related services",
        relatedTitle: "Add the workflow your business actually needs.",
        hubLinkLabel: "Explore Business Websites",
      },
      ar: {
        name: "مواقع الشركات",
        eyebrow: "الشركات",
        title: "مواقع شركات تجعل النشاط سهل الفهم وتبني الثقة من أول زيارة.",
        intro:
          "للشركات والمصانع والوكالات والاستشاريين ومقدمي الخدمات في مصر، يجب أن يوضح الموقع ما يقدمه النشاط بسرعة، ويثبت المصداقية، ويمنح العميل الجاد خطوة تالية واضحة.",
        contextEyebrow: "الهدف",
        contextTitle: "نحوّل نشاطًا معقدًا إلى حضور رقمي واضح ومنظم.",
        contextParagraphs: [
          "تفشل مواقع كثيرة عندما تتنافس الخدمات والقدرات والملفات التعريفية وكل تفاصيل الشركة على انتباه الزائر في نفس الوقت. نحن ننظم المعلومات ليبدأ الزائر بفهم العرض ثم ينتقل طبيعيًا إلى الأدلة والتواصل.",
          "يمكن أن يظل المشروع موقعًا تعريفيًا مركزًا أو يتوسع ليشمل الاستفسارات والمواعيد والملفات القابلة للتحميل والمحتوى متعدد اللغات وإدارة المحتوى من لوحة تحكم.",
        ],
        proofEyebrow: "أعمال مرتبطة",
        proofTitle: "موقع شركة مرتبط بعمليات حقيقية.",
        proofDescription:
          "يوضح مشروع S8 Factory كيف يمكن للموقع أن يعرض قدرات الشركة بوضوح ويربط الاستفسارات والمواعيد ومسارات التشغيل خلف الكواليس.",
        relatedEyebrow: "خدمات مرتبطة",
        relatedTitle: "أضف مسار العمل الذي يحتاجه نشاطك فعلًا.",
        hubLinkLabel: "استكشف مواقع الشركات",
      },
    },
  }),
  service({
    id: "portfolio-websites",
    tone: "dark",
    reverse: false,
    serviceType: "Portfolio and personal brand website design and development",
    relatedServiceIds: ["landing-pages", "booking-websites", "business-websites"],
    seo: {
      en: {
        title: "Portfolio & Personal Brand Websites Egypt | Web District",
        description:
          "Web District designs portfolio and personal brand websites in Egypt for professionals, creators, consultants, and freelancers who need a polished home online.",
      },
      ar: {
        title: "تصميم مواقع البورتفوليو والبراند الشخصي في مصر | Web District",
        description:
          "تصمم Web District مواقع بورتفوليو وهوية شخصية في مصر للمحترفين والمبدعين والاستشاريين والمستقلين لعرض أعمالهم وخبراتهم بصورة احترافية.",
      },
    },
    page: {
      en: {
        name: "Portfolio & Personal Brand Websites",
        eyebrow: "Personal brands",
        title: "A permanent digital home for your work, experience, and reputation.",
        intro:
          "For professionals, creators, consultants, and freelancers in Egypt, a personal website gives your work context that social profiles cannot: who you are, what you do, what you have built, and how someone can work with you.",
        contextEyebrow: "The goal",
        contextTitle: "Present the person and the work as one clear brand.",
        contextParagraphs: [
          "A portfolio is more useful when it explains the thinking and experience behind the work instead of behaving like a gallery of disconnected images. We structure projects, expertise, achievements, services, and personal identity around one consistent story.",
          "The result can stay intentionally minimal or expand into case studies, articles, speaking or press, downloadable profiles, bookings, and enquiries as the personal brand grows.",
        ],
        relatedEyebrow: "Related services",
        relatedTitle: "Support campaigns, enquiries, or bookings around the personal brand.",
        hubLinkLabel: "Explore Portfolio Websites",
      },
      ar: {
        name: "مواقع البورتفوليو والبراند الشخصي",
        eyebrow: "الهوية الشخصية",
        title: "مساحة رقمية دائمة لأعمالك وخبرتك وسمعتك المهنية.",
        intro:
          "للمحترفين والمبدعين والاستشاريين والمستقلين في مصر، يمنحك الموقع الشخصي مساحة لا توفرها حسابات السوشيال ميديا: من أنت، ماذا تقدم، ماذا أنجزت، وكيف يمكن للناس العمل معك.",
        contextEyebrow: "الهدف",
        contextTitle: "نقدّم الشخص والعمل كهوية واحدة واضحة.",
        contextParagraphs: [
          "يصبح البورتفوليو أقوى عندما يشرح الخبرة والفكرة خلف العمل بدل أن يكون مجرد معرض صور منفصلة. ننظم المشاريع والخبرات والإنجازات والخدمات والهوية الشخصية في قصة واحدة متماسكة.",
          "يمكن أن يظل الموقع بسيطًا ومركزًا أو يتوسع لاحقًا ليشمل دراسات حالة ومقالات وظهورًا إعلاميًا وملفًا تعريفيًا قابلًا للتحميل والحجوزات والاستفسارات.",
        ],
        relatedEyebrow: "خدمات مرتبطة",
        relatedTitle: "ادعم الحملات أو الاستفسارات أو الحجوزات حول البراند الشخصي.",
        hubLinkLabel: "استكشف مواقع البورتفوليو",
      },
    },
  }),
  service({
    id: "landing-pages",
    tone: "light",
    reverse: true,
    serviceType: "Landing page design and development",
    relatedServiceIds: ["online-stores", "business-websites", "booking-websites"],
    seo: {
      en: {
        title: "Landing Page Design & Development Egypt | Web District",
        description:
          "Web District designs and develops landing pages in Egypt for ads, launches, lead generation, registrations, offers, and focused conversion campaigns.",
      },
      ar: {
        title: "تصميم وتطوير صفحات الهبوط في مصر | Web District",
        description:
          "تصمم Web District صفحات هبوط في مصر للإعلانات والإطلاقات وجمع العملاء المحتملين والتسجيلات والعروض والحملات التي تحتاج هدفًا واحدًا واضحًا.",
      },
    },
    page: {
      en: {
        name: "Landing Pages",
        eyebrow: "Campaigns",
        title: "Focused pages built around one message and one action.",
        intro:
          "When an ad, launch, waitlist, event, or offer has one specific goal, a focused landing page in Egypt can remove the distractions of a full website and keep the visitor moving toward that action.",
        contextEyebrow: "The goal",
        contextTitle: "Give campaign traffic exactly what it came for.",
        contextParagraphs: [
          "A landing page works best when the message, proof, offer, and call to action all support the same decision. We keep the hierarchy tight so visitors do not have to search through a full navigation structure to understand what happens next.",
          "Tracking, forms, advertising pixels, confirmation states, and agreed integrations can be planned into the page from the start so the campaign is measurable as well as polished.",
        ],
        relatedEyebrow: "Related services",
        relatedTitle: "Connect the campaign to the wider website or store.",
        hubLinkLabel: "Explore Landing Pages",
      },
      ar: {
        name: "صفحات الهبوط",
        eyebrow: "الحملات",
        title: "صفحات مركزة حول رسالة واحدة وخطوة واحدة.",
        intro:
          "عندما يكون للإعلان أو الإطلاق أو قائمة الانتظار أو الحدث أو العرض هدف محدد، يمكن لصفحة هبوط مركزة في مصر أن تزيل تشتيت الموقع الكامل وتبقي الزائر متجهًا نحو الخطوة المطلوبة.",
        contextEyebrow: "الهدف",
        contextTitle: "أعطِ زائر الحملة ما جاء من أجله مباشرة.",
        contextParagraphs: [
          "تعمل صفحة الهبوط بأفضل صورة عندما تخدم الرسالة والدليل والعرض والدعوة لاتخاذ الإجراء نفس القرار. نحافظ على تسلسل واضح حتى لا يحتاج الزائر للتنقل داخل موقع كامل لفهم الخطوة التالية.",
          "يمكن تخطيط التتبع والنماذج وبيكسلات الإعلانات وصفحات التأكيد والتكاملات المتفق عليها منذ البداية حتى تكون الحملة قابلة للقياس إلى جانب جودة التصميم.",
        ],
        relatedEyebrow: "خدمات مرتبطة",
        relatedTitle: "اربط الحملة بالموقع أو المتجر الكامل.",
        hubLinkLabel: "استكشف صفحات الهبوط",
      },
    },
  }),
  service({
    id: "booking-websites",
    tone: "gold",
    reverse: false,
    serviceType: "Booking and reservation website design and development",
    relatedProjectSlugs: ["travco"],
    relatedServiceIds: ["business-websites", "custom-platforms", "landing-pages"],
    seo: {
      en: {
        title: "Booking & Reservation Website Development Egypt | Web District",
        description:
          "Web District builds booking and reservation websites in Egypt for clinics, hospitality, travel, activities, rentals, and appointment-based businesses.",
      },
      ar: {
        title: "تطوير مواقع الحجز والمواعيد في مصر | Web District",
        description:
          "تبني Web District مواقع حجز ومواعيد في مصر للعيادات والضيافة والسفر والأنشطة والتأجير والخدمات التي تعتمد على المواعيد والحجوزات.",
      },
    },
    page: {
      en: {
        name: "Booking & Reservation Websites",
        eyebrow: "Bookings",
        title: "Booking websites that reduce manual back-and-forth.",
        intro:
          "For appointment, travel, hospitality, rental, activity, and reservation businesses in Egypt, we turn the repeated questions around services, dates, availability, and confirmation into one clear customer journey.",
        contextEyebrow: "The goal",
        contextTitle: "Make the reservation easy for the customer and manageable for the team.",
        contextParagraphs: [
          "The booking experience should explain what can be reserved, when it is available, what the customer needs to provide, and what happens after submission without making people chase answers through messages.",
          "Depending on the scope, the same system can extend into deposits, payments, rescheduling, reminders, customer records, calendars, staff or resource assignment, and admin reporting.",
        ],
        proofEyebrow: "Relevant work",
        proofTitle: "A travel experience built around booking intent.",
        proofDescription:
          "Travco shows how package discovery and booking requests can move together in one responsive journey while operational records remain separate from the public experience.",
        relatedEyebrow: "Related services",
        relatedTitle: "Connect bookings to the wider business operation.",
        hubLinkLabel: "Explore Booking Websites",
      },
      ar: {
        name: "مواقع الحجز والمواعيد",
        eyebrow: "الحجوزات",
        title: "مواقع حجز تقلل الرسائل والرجوع المتكرر مع العملاء.",
        intro:
          "للأنشطة المعتمدة على المواعيد والسفر والضيافة والتأجير والفعاليات والحجوزات في مصر، نحول الأسئلة المتكررة حول الخدمات والمواعيد والإتاحة والتأكيد إلى رحلة عميل واحدة واضحة.",
        contextEyebrow: "الهدف",
        contextTitle: "اجعل الحجز سهلًا للعميل وقابلًا للإدارة للفريق.",
        contextParagraphs: [
          "يجب أن توضح تجربة الحجز ما الذي يمكن حجزه ومتى يكون متاحًا وما البيانات المطلوبة وماذا يحدث بعد إرسال الطلب، من دون إجبار العميل على مطاردة الإجابات عبر الرسائل.",
          "بحسب نطاق المشروع، يمكن للنظام أن يتوسع إلى العربون والدفع وإعادة الجدولة والتذكيرات وسجلات العملاء والتقويمات وتوزيع الموظفين أو الموارد وتقارير الإدارة.",
        ],
        proofEyebrow: "أعمال مرتبطة",
        proofTitle: "تجربة سفر مبنية حول نية الحجز.",
        proofDescription:
          "يوضح Travco كيف يمكن ربط اكتشاف الباقات بطلبات الحجز في رحلة متجاوبة واحدة مع إبقاء سجلات التشغيل منفصلة عن التجربة العامة.",
        relatedEyebrow: "خدمات مرتبطة",
        relatedTitle: "اربط الحجوزات بعمليات النشاط الأوسع.",
        hubLinkLabel: "استكشف مواقع الحجز",
      },
    },
  }),
  service({
    id: "custom-platforms",
    tone: "dark",
    reverse: true,
    serviceType: "Custom platform, portal and dashboard development",
    relatedProjectSlugs: ["s8-factory"],
    relatedServiceIds: ["business-websites", "booking-websites", "online-stores"],
    seo: {
      en: {
        title: "Custom Platforms & Dashboard Development Egypt | Web District",
        description:
          "Web District develops custom platforms, portals, and dashboards in Egypt with roles, records, approvals, reporting, integrations, and tailored workflows.",
      },
      ar: {
        title: "تطوير المنصات ولوحات التحكم المخصصة في مصر | Web District",
        description:
          "تطور Web District منصات وبوابات ولوحات تحكم مخصصة في مصر تشمل الصلاحيات والسجلات والموافقات والتقارير ومسارات العمل المصممة حول احتياج النشاط.",
      },
    },
    page: {
      en: {
        name: "Custom Platforms & Dashboards",
        eyebrow: "Custom systems",
        title: "Custom platforms shaped around the workflow—not the other way around.",
        intro:
          "For businesses in Egypt that have outgrown spreadsheets, scattered tools, or repeated manual processes, we design portals and dashboards around the users, records, permissions, and actions the operation actually needs.",
        contextEyebrow: "The goal",
        contextTitle: "Turn a repeated business process into a system the team can actually use.",
        contextParagraphs: [
          "Custom software becomes valuable when it removes friction from a real workflow. We start with the people involved, the information they need, the decisions they make, and the permissions around those actions before deciding what screens should exist.",
          "A project can include customer or staff portals, role-based access, approvals, status tracking, records, reports, notifications, integrations, and admin controls while keeping the public website separate where that makes sense.",
        ],
        proofEyebrow: "Relevant work",
        proofTitle: "A company platform extending beyond the public website.",
        proofDescription:
          "S8 Factory connects public lead generation with protected requests, appointments, contracts, production records, reviews, and management controls.",
        relatedEyebrow: "Related services",
        relatedTitle: "Pair the internal system with the customer-facing experience.",
        hubLinkLabel: "Explore Custom Platforms",
      },
      ar: {
        name: "المنصات ولوحات التحكم المخصصة",
        eyebrow: "الأنظمة المخصصة",
        title: "منصات مخصصة مبنية حول سير العمل، وليس العكس.",
        intro:
          "للأنشطة في مصر التي تجاوزت الجداول والأدوات المتفرقة والعمليات اليدوية المتكررة، نصمم بوابات ولوحات تحكم حول المستخدمين والسجلات والصلاحيات والإجراءات التي يحتاجها التشغيل فعلًا.",
        contextEyebrow: "الهدف",
        contextTitle: "حوّل عملية متكررة في النشاط إلى نظام يستطيع الفريق استخدامه فعلًا.",
        contextParagraphs: [
          "تكون البرمجيات المخصصة مفيدة عندما تزيل الاحتكاك من مسار عمل حقيقي. نبدأ بالأشخاص والبيانات والقرارات والصلاحيات قبل أن نقرر ما الشاشات التي يجب أن توجد.",
          "يمكن أن يشمل المشروع بوابات للعملاء أو الموظفين وصلاحيات حسب الدور وموافقات وتتبع حالات وسجلات وتقارير وإشعارات وتكاملات وتحكمًا إداريًا، مع فصل الموقع العام عندما يكون ذلك الأنسب.",
        ],
        proofEyebrow: "أعمال مرتبطة",
        proofTitle: "منصة شركة تتجاوز الموقع العام.",
        proofDescription:
          "يربط S8 Factory توليد العملاء المحتملين بالطلبات والمواعيد والعقود وسجلات الإنتاج والتقييمات وأدوات الإدارة المحمية.",
        relatedEyebrow: "خدمات مرتبطة",
        relatedTitle: "اربط النظام الداخلي بالتجربة التي يراها العميل.",
        hubLinkLabel: "استكشف المنصات المخصصة",
      },
    },
  }),
];

export const servicesPageSections = serviceCatalog.map((item) => ({
  id: item.id,
  path: item.path,
  tone: item.tone,
  reverse: item.reverse,
  page: item.page,
}));

export const serviceById = new Map(serviceCatalog.map((item) => [item.id, item]));
export const serviceByPath = new Map(
  serviceCatalog.map((item) => [item.path, item]),
);

export const getServiceBySlug = (slug) => serviceById.get(slug) || null;

export const getRelatedServicesForProject = (projectSlug) =>
  serviceCatalog.filter((item) => item.projectSlugs.includes(projectSlug));
