const topic = (enParagraph, enPoints, arParagraph, arPoints) => ({
  en: { paragraph: enParagraph, points: enPoints },
  ar: { paragraph: arParagraph, points: arPoints },
});

const safeguardGroup = (enTitle, enItems, arTitle, arItems) => ({
  title: { en: enTitle, ar: arTitle },
  items: { en: enItems, ar: arItems },
});

const securityContent = (enSummary, arSummary, verified) => ({
  summary: { en: enSummary, ar: arSummary },
  verified,
});

const protectionGroup = (key, enItems, arItems) => ({
  key,
  items: { en: enItems, ar: arItems },
});

const currentSecurityContent = (enSummary, arSummary, groups) => ({
  summary: { en: enSummary, ar: arSummary },
  groups,
});

export const caseStudyDetails = {
  zohour: {
    logoImage: "/images/brands-logos/zohour-logo.webp",
    logoScale: 1.04,
    reviewAliases: ["Zohour", "Zohour Store"],
    qualities: {
      experience: topic(
        "Zohour turns a soft floral identity into a direct shopping journey. Customers can move from the homepage and product grid into product details, cart, checkout, and their order area without losing context, while the responsive layout keeps the main actions easy to reach on smaller screens.",
        ["Clear shop-to-checkout hierarchy", "Responsive product discovery", "Customer order visibility"],
        "يحوّل زهور هويته الهادئة المستوحاة من الزهور إلى رحلة شراء مباشرة. ينتقل العميل من الصفحة الرئيسية وشبكة المنتجات إلى التفاصيل والسلة والدفع وطلباته دون فقدان السياق، مع بقاء الإجراءات الأساسية سهلة الوصول على الشاشات الصغيرة.",
        ["تسلسل واضح من المتجر إلى الدفع", "اكتشاف منتجات متجاوب", "متابعة واضحة لطلبات العميل"],
      ),
      performance: topic(
        "The storefront keeps the product path focused and uses a responsive grid so the catalog remains practical across devices. Separating shop, product, cart, checkout, and orders into purposeful views prevents each screen from carrying more interface than the customer needs.",
        ["Responsive catalog layout", "Focused commerce views", "Lean navigation between purchase steps"],
        "يحافظ المتجر على مسار منتج مركز ويستخدم شبكة متجاوبة ليظل الكتالوج عمليًا على مختلف الأجهزة. كما يفصل المتجر والتفاصيل والسلة والدفع والطلبات في واجهات محددة حتى لا تحمل كل شاشة عناصر أكثر مما يحتاجه العميل.",
        ["تخطيط كتالوج متجاوب", "واجهات تجارة مركزة", "تنقل مختصر بين خطوات الشراء"],
      ),
      security: topic(
        "Customer and administrator areas are protected rather than exposed through the public storefront. Defined order and discount calculations keep commercial rules consistent, while the separation between shopping and management routes limits access to private order and store controls.",
        ["Protected customer and admin routes", "Consistent order calculations", "Controlled discount handling"],
        "تظل مناطق العملاء والإدارة محمية بدلًا من إتاحتها عبر المتجر العام. وتحافظ حسابات الطلبات والخصومات المحددة على اتساق القواعد التجارية، بينما يفصل النظام بين التسوق وإدارة الطلبات وأدوات المتجر الخاصة.",
        ["مسارات محمية للعملاء والإدارة", "حسابات طلبات متسقة", "معالجة منضبطة للخصومات"],
      ),
      operations: topic(
        "The owner can manage products, orders, shipping, offers, discount codes, and the waitlist from one operational structure. Analytics views support day-to-day decisions, and the connected workflow reduces the need to track catalog and fulfillment changes in separate tools.",
        ["Product and stock administration", "Order and shipping controls", "Offers, waitlist, and analytics views"],
        "يمكن للمالك إدارة المنتجات والطلبات والشحن والعروض وأكواد الخصم وقائمة الانتظار ضمن هيكل تشغيلي واحد. وتدعم واجهات التحليلات القرارات اليومية وتقلل الحاجة إلى متابعة الكتالوج والتنفيذ في أدوات منفصلة.",
        ["إدارة المنتجات والمخزون", "التحكم في الطلبات والشحن", "العروض وقائمة الانتظار والتحليلات"],
      ),
      growth: topic(
        "The reusable MERN storefront can accommodate a wider cap catalog, new offers, and additional customer-service content without changing the core purchase flow. Its distinct public and admin areas also leave a clear foundation for future commerce integrations and deeper reporting.",
        ["Expandable product catalog", "Reusable offer and order workflows", "Foundation for future integrations"],
        "يستوعب هيكل المتجر القابل لإعادة الاستخدام كتالوجًا أوسع وعروضًا جديدة ومحتوى إضافيًا لخدمة العملاء دون تغيير مسار الشراء الأساسي. كما تهيئ مناطق الموقع والإدارة المنفصلة أساسًا واضحًا لتكاملات مستقبلية وتقارير أعمق.",
        ["كتالوج منتجات قابل للتوسع", "مسارات عروض وطلبات قابلة لإعادة الاستخدام", "أساس لتكاملات مستقبلية"],
      ),
    },
  },
  "s8-factory": {
    logoImage: "/images/brands-logos/s8-logo.webp",
    logoScale: 1.06,
    reviewAliases: ["S8 Factory", "S8"],
    qualities: {
      experience: topic(
        "S8 Factory organizes a complex business offer into clear routes for production capabilities, material lines, brands, and partners. Visitors can move from understanding the factory to submitting a production request or booking a call, with account and contact paths available when more detail is needed.",
        ["Clear production-service hierarchy", "Direct request and call flows", "Partner and material-line discovery"],
        "ينظم S8 Factory عرضه الصناعي في مسارات واضحة للقدرات الإنتاجية وخطوط الخامات والعلامات والشركاء. ينتقل الزائر من فهم المصنع إلى إرسال طلب إنتاج أو حجز مكالمة، مع إتاحة الحساب والتواصل عند الحاجة إلى تفاصيل إضافية.",
        ["تسلسل واضح لخدمات الإنتاج", "مسارات مباشرة للطلبات والمكالمات", "عرض منظم للشركاء وخطوط الخامات"],
      ),
      performance: topic(
        "The site separates company content from request and appointment workflows so each route stays focused. Responsive layouts keep service information readable on mobile, while the structured flow avoids forcing operational data and public presentation into the same screen.",
        ["Focused service routes", "Responsive business content", "Separated public and account workflows"],
        "يفصل الموقع محتوى الشركة عن مسارات الطلبات والمواعيد لتظل كل واجهة مركزة. وتحافظ التخطيطات المتجاوبة على وضوح معلومات الخدمات في الهاتف، دون جمع بيانات التشغيل والعرض العام في شاشة واحدة.",
        ["مسارات خدمات مركزة", "محتوى أعمال متجاوب", "فصل الواجهات العامة عن مسارات الحساب"],
      ),
      security: topic(
        "Account and administrator routes protect production requests, appointments, proposals, and contract records from the public site. Structured workflow states keep each request traceable as it moves through review, scheduling, and agreement stages.",
        ["Protected account and admin routes", "Structured request states", "Controlled proposal and contract access"],
        "تحمي مسارات الحساب والإدارة طلبات الإنتاج والمواعيد والعروض وسجلات العقود من الموقع العام. وتُبقي حالات سير العمل المنظمة كل طلب قابلًا للمتابعة أثناء المراجعة والجدولة ومراحل الاتفاق.",
        ["حماية مسارات الحساب والإدارة", "حالات منظمة للطلبات", "وصول منضبط للعروض والعقود"],
      ),
      operations: topic(
        "The operational workspace brings production requests, call appointments, slot settings, contracts, proposals, reviews, and analytics together. This gives the factory team one place to follow enquiries, control availability, and move qualified opportunities into formal work.",
        ["Production request management", "Appointment and slot controls", "Contracts, proposals, reviews, and analytics"],
        "تجمع مساحة التشغيل طلبات الإنتاج ومواعيد المكالمات وإعدادات الأوقات والعقود والعروض والتقييمات والتحليلات. وبذلك يتابع فريق المصنع الاستفسارات ويضبط الإتاحة وينقل الفرص الجادة إلى عمل رسمي من مكان واحد.",
        ["إدارة طلبات الإنتاج", "التحكم في المواعيد والأوقات", "العقود والعروض والتقييمات والتحليلات"],
      ),
      growth: topic(
        "Reusable service, material-line, and request structures make it practical to add production capabilities or partner categories later. Configurable appointments and a tracked contract workflow also provide a maintainable base for larger sales and client-service operations.",
        ["Expandable service and material lines", "Reusable request workflow", "Scalable appointment and contract structure"],
        "تجعل هياكل الخدمات وخطوط الخامات والطلبات القابلة لإعادة الاستخدام إضافة قدرات إنتاجية أو فئات شركاء جديدة أمرًا عمليًا. كما توفر المواعيد القابلة للضبط ومسار العقود المتابع أساسًا قابلًا للصيانة مع نمو المبيعات وخدمة العملاء.",
        ["خدمات وخطوط خامات قابلة للتوسع", "مسار طلبات قابل لإعادة الاستخدام", "هيكل قابل للنمو للمواعيد والعقود"],
      ),
    },
  },
  atheer: {
    logoImage: "/images/brands-logos/atheer-logo.webp",
    logoScale: 1.02,
    reviewAliases: ["Atheer", "Atheer Otour"],
    qualities: {
      experience: topic(
        "Atheer uses a dark luxury presentation without letting the visual direction obscure the shopping task. Fragrance details lead naturally into cart, checkout, and order tracking, giving customers a clear path from browsing a scent to following the resulting purchase.",
        ["Focused fragrance discovery", "Clear cart and checkout path", "Accessible customer order tracking"],
        "يستخدم أثير عرضًا داكنًا وفاخرًا دون أن تطغى الهوية البصرية على مهمة التسوق. تقود تفاصيل العطور بصورة طبيعية إلى السلة والدفع وتتبع الطلب، فيحصل العميل على مسار واضح من اكتشاف العطر إلى متابعة شرائه.",
        ["اكتشاف مركز للعطور", "مسار واضح للسلة والدفع", "متابعة سهلة لطلبات العملاء"],
      ),
      performance: topic(
        "The catalog is organized around focused fragrance metadata and purpose-built commerce views. Responsive layouts preserve product readability across screen sizes, while separating browsing, checkout, and account tasks keeps each route concentrated on the information it needs.",
        ["Structured fragrance metadata", "Responsive product presentation", "Focused commerce routes"],
        "ينظم الكتالوج حول بيانات عطور واضحة وواجهات تجارة مخصصة. وتحافظ التخطيطات المتجاوبة على سهولة قراءة المنتجات، بينما يفصل التصفح والدفع والحساب حتى يركز كل مسار على المعلومات التي يحتاجها.",
        ["بيانات منظمة للعطور", "عرض منتجات متجاوب", "مسارات تجارة مركزة"],
      ),
      security: topic(
        "Structured order, payment-proof, and discount-code fields keep checkout information consistent through management. Customer order areas and administrator tools remain distinct, and controlled product uploads keep content handling within the store workflow.",
        ["Structured payment-proof records", "Controlled discount-code flow", "Separated customer and admin areas"],
        "تحافظ حقول الطلب وإثبات الدفع وأكواد الخصم المنظمة على اتساق معلومات الشراء حتى الإدارة. وتظل مناطق طلبات العملاء وأدوات الإدارة منفصلة، مع بقاء رفع المنتجات ضمن مسار المتجر المنضبط.",
        ["سجلات منظمة لإثبات الدفع", "مسار منضبط لأكواد الخصم", "فصل مناطق العملاء عن الإدارة"],
      ),
      operations: topic(
        "The owner can oversee orders, products, uploads, offers, discount codes, customers, and analytics from the administration area. Connecting catalog updates with commercial and customer information reduces repeated manual coordination behind the storefront.",
        ["Product and upload management", "Order, offer, and discount controls", "Customer and analytics views"],
        "يمكن للمالك متابعة الطلبات والمنتجات والرفع والعروض وأكواد الخصم والعملاء والتحليلات من منطقة الإدارة. ويربط النظام تحديثات الكتالوج بالمعلومات التجارية وبيانات العملاء ليقلل التنسيق اليدوي المتكرر خلف المتجر.",
        ["إدارة المنتجات وعمليات الرفع", "التحكم في الطلبات والعروض والخصومات", "واجهات العملاء والتحليلات"],
      ),
      growth: topic(
        "The product model can support a broader fragrance catalog and richer scent information while preserving the current buying journey. Reusable offer, upload, customer, and analytics structures give the brand room to expand campaigns and store content without rebuilding its core operations.",
        ["Expandable fragrance catalog", "Reusable promotion workflows", "Maintainable customer and content structure"],
        "يستطيع نموذج المنتجات دعم كتالوج عطور أوسع وبيانات روائح أغنى مع الحفاظ على رحلة الشراء الحالية. وتمنح هياكل العروض والرفع والعملاء والتحليلات القابلة لإعادة الاستخدام العلامة مساحة لتوسيع الحملات والمحتوى دون إعادة بناء التشغيل الأساسي.",
        ["كتالوج عطور قابل للتوسع", "مسارات ترويج قابلة لإعادة الاستخدام", "هيكل قابل للصيانة للعملاء والمحتوى"],
      ),
    },
  },
  akm: {
    logoImage: "/images/brands-logos/akm-logo.webp",
    logoScale: 1.06,
    reviewAliases: ["AKM", "AKM Brand"],
    qualities: {
      experience: topic(
        "AKM makes fashion choices concrete through clear product details, color and size variants, stock-aware selection, and Arabic support. The path from discovery to cart, checkout, and customer orders remains consistent across locales and screen sizes.",
        ["Color and size variant selection", "Arabic shopping support", "Clear checkout and order path"],
        "يجعل AKM اختيارات الأزياء واضحة عبر تفاصيل المنتج وخيارات اللون والمقاس والاختيار المرتبط بالمخزون ودعم العربية. ويظل المسار من الاكتشاف إلى السلة والدفع وطلبات العميل متسقًا عبر اللغتين ومختلف الشاشات.",
        ["اختيار منظم للألوان والمقاسات", "تسوق مدعوم بالعربية", "مسار واضح للدفع والطلبات"],
      ),
      performance: topic(
        "React Query organizes product and commerce data flows, helping the interface request and refresh the information relevant to each view. The structured variant model keeps color, size, and stock data predictable instead of rebuilding those relationships in every component.",
        ["Organized React Query data flows", "Reusable variant data model", "Responsive product and order views"],
        "تنظم React Query تدفقات بيانات المنتجات والتجارة لتجلب الواجهة وتحدّث المعلومات المرتبطة بكل شاشة. كما يحافظ نموذج التنويعات على اتساق بيانات اللون والمقاس والمخزون بدلًا من إعادة بناء العلاقات داخل كل مكوّن.",
        ["تدفقات منظمة عبر React Query", "نموذج بيانات قابل لإعادة الاستخدام للتنويعات", "واجهات متجاوبة للمنتجات والطلبات"],
      ),
      security: topic(
        "Defined stock, order, and payment statuses keep purchase state explicit for customers and managers. Customer order routes and administration tools are separated, while controlled uploads keep product media changes inside the management workflow.",
        ["Explicit stock and payment states", "Separated customer and admin routes", "Controlled product-media uploads"],
        "تجعل حالات المخزون والطلب والدفع المحددة وضع كل عملية شراء واضحًا للعملاء والمديرين. وتنفصل مسارات طلبات العملاء عن أدوات الإدارة، بينما تبقى تغييرات صور المنتجات داخل مسار رفع منضبط.",
        ["حالات واضحة للمخزون والدفع", "فصل مسارات العملاء عن الإدارة", "رفع منضبط لصور المنتجات"],
      ),
      operations: topic(
        "The administration area connects products, orders, payment statuses, offers, bundles, coupons, reviews, email campaigns, and site settings. This lets the owner coordinate merchandising and fulfillment without maintaining the same commercial information in disconnected places.",
        ["Products and order administration", "Offers, bundles, coupons, and reviews", "Campaign and site-setting controls"],
        "تربط منطقة الإدارة المنتجات والطلبات وحالات الدفع والعروض والباقات والكوبونات والتقييمات والحملات البريدية وإعدادات الموقع. وبذلك ينسق المالك العرض التجاري والتنفيذ دون تكرار المعلومات نفسها في أماكن منفصلة.",
        ["إدارة المنتجات والطلبات", "العروض والباقات والكوبونات والتقييمات", "التحكم في الحملات وإعدادات الموقع"],
      ),
      growth: topic(
        "A reusable color-and-size stock model supports a larger fashion catalog without changing the purchase logic. Arabic support and existing Meta, TikTok, and Snap tracking hooks also prepare the storefront for broader campaigns, measurement, and future channel integrations.",
        ["Scalable variant and stock model", "Multilingual storefront foundation", "Existing marketing tracking hooks"],
        "يدعم نموذج المخزون القابل لإعادة الاستخدام للألوان والمقاسات كتالوج أزياء أكبر دون تغيير منطق الشراء. كما يجهز دعم العربية وتكاملات تتبع Meta وTikTok وSnap المتجر لحملات أوسع وقياس أفضل وتكاملات مستقبلية.",
        ["نموذج قابل للتوسع للتنويعات والمخزون", "أساس متجر متعدد اللغات", "تكاملات جاهزة للتتبع التسويقي"],
      ),
    },
  },
  davinto: {
    logoImage: "/images/brands-logos/davinto-logo.webp",
    logoScale: 1.03,
    reviewAliases: ["Davinto", "Davinto Store"],
    qualities: {
      experience: topic(
        "Davinto presents fashion products through a refined, product-first hierarchy that keeps browsing and checkout easy to understand. The responsive storefront preserves clear calls to action and a consistent shopping rhythm as customers move between desktop and mobile.",
        ["Product-first visual hierarchy", "Straightforward checkout journey", "Consistent mobile shopping actions"],
        "يعرض دافينتو منتجات الأزياء بتسلسل راقٍ يضع المنتج أولًا ويجعل التصفح والدفع سهلَي الفهم. ويحافظ المتجر المتجاوب على وضوح الإجراءات وإيقاع تسوق ثابت عند الانتقال بين الحاسوب والهاتف.",
        ["تسلسل بصري يركز على المنتج", "رحلة دفع مباشرة", "إجراءات تسوق متسقة على الهاتف"],
      ),
      performance: topic(
        "The storefront uses a focused responsive structure so product content remains readable without crowding the screen. Purposeful separation between browsing and checkout keeps each view concentrated on the assets and information needed for that stage.",
        ["Responsive storefront structure", "Focused product presentation", "Separated browsing and checkout views"],
        "يستخدم المتجر هيكلًا متجاوبًا ومركزًا لتظل معلومات المنتجات واضحة دون ازدحام الشاشة. كما يفصل التصفح عن الدفع حتى تركز كل واجهة على الصور والمعلومات اللازمة لتلك المرحلة.",
        ["هيكل متجر متجاوب", "عرض مركز للمنتجات", "فصل واجهات التصفح والدفع"],
      ),
      security: topic(
        "Reliability comes from a predictable product-to-checkout sequence with consistent navigation and clearly bounded actions. The available project information does not claim private account, payment-provider, or administrative controls beyond that verified customer-facing flow.",
        ["Predictable shopping sequence", "Consistent navigation states", "No unsupported security claims"],
        "تأتي الموثوقية من تسلسل متوقع يبدأ بالمنتج وينتهي بالدفع، مع تنقل متسق وإجراءات محددة بوضوح. ولا تنسب تفاصيل المشروع المتاحة ضوابط للحسابات الخاصة أو الدفع أو الإدارة خارج المسار الظاهر والمتحقق منه.",
        ["تسلسل تسوق متوقع", "حالات تنقل متسقة", "دون ادعاءات أمان غير موثقة"],
      ),
      operations: topic(
        "The reusable storefront structure keeps collections, product presentation, and supporting fashion content organized around one customer journey. This reduces layout duplication as the owner updates the visible catalog and brand material.",
        ["Reusable collection structure", "Consistent product presentation", "Maintainable brand content"],
        "يحافظ هيكل المتجر القابل لإعادة الاستخدام على تنظيم المجموعات وعرض المنتجات ومحتوى الأزياء حول رحلة عميل واحدة. ويقلل ذلك تكرار التخطيطات عند تحديث الكتالوج المرئي ومواد العلامة.",
        ["هيكل مجموعات قابل لإعادة الاستخدام", "عرض متسق للمنتجات", "محتوى علامة سهل الصيانة"],
      ),
      growth: topic(
        "Davinto can extend its fashion collections and editorial content through the same product-led patterns already used by the storefront. Clear separation between discovery and checkout also leaves room for future commerce services without disrupting the established browsing experience.",
        ["Expandable fashion collections", "Reusable content patterns", "Room for future commerce integrations"],
        "يستطيع دافينتو توسيع مجموعاته ومحتواه التحريري عبر الأنماط نفسها التي يقودها المنتج. كما يترك الفصل الواضح بين الاكتشاف والدفع مساحة لخدمات تجارة مستقبلية دون إرباك تجربة التصفح الحالية.",
        ["مجموعات أزياء قابلة للتوسع", "أنماط محتوى قابلة لإعادة الاستخدام", "مساحة لتكاملات تجارة مستقبلية"],
      ),
    },
  },
  "salah-frame": {
    logoImage: "/images/brands-logos/salahframe-logo.webp",
    logoScale: 1,
    reviewAliases: ["Salah Frame", "SalahFrame"],
    qualities: {
      experience: topic(
        "Salah Frame guides customers from clear collections into the choices involved in a personalized frame. Customization is presented as part of one understandable ordering journey, helping shoppers compare styles and prepare a selection without losing the creative character of the brand.",
        ["Collection-led product discovery", "Clear customization choices", "Simple ordering journey"],
        "يوجه صلاح فريم العملاء من المجموعات الواضحة إلى اختيارات الإطار المخصص. ويعرض التخصيص ضمن رحلة طلب مفهومة تساعد المتسوق على مقارنة الأنماط وتجهيز اختياره دون فقدان الطابع الإبداعي للعلامة.",
        ["اكتشاف المنتجات عبر المجموعات", "خيارات تخصيص واضحة", "رحلة طلب بسيطة"],
      ),
      performance: topic(
        "A focused responsive layout keeps collections and customization information readable across device sizes. The storefront avoids mixing every choice into one crowded view, allowing each product and ordering step to present only the detail needed at that moment.",
        ["Responsive collection layouts", "Focused customization views", "Readable product information"],
        "يحافظ التخطيط المتجاوب والمركز على وضوح المجموعات ومعلومات التخصيص عبر مختلف الأجهزة. ولا يجمع المتجر جميع الخيارات في واجهة مزدحمة، بل يعرض كل منتج وخطوة طلب بالتفاصيل اللازمة في وقتها.",
        ["تخطيطات متجاوبة للمجموعات", "واجهات تخصيص مركزة", "معلومات منتجات سهلة القراءة"],
      ),
      security: topic(
        "The ordering flow improves reliability by presenting customization choices in a consistent sequence before the customer submits a selection. The verified project scope does not add claims about private accounts, online payments, or administrative protection that are not documented.",
        ["Consistent customization sequence", "Clear order preparation", "No unsupported security claims"],
        "يعزز مسار الطلب الموثوقية بعرض خيارات التخصيص في تسلسل ثابت قبل إرسال اختيار العميل. ولا يضيف نطاق المشروع المتحقق منه ادعاءات غير موثقة حول الحسابات الخاصة أو الدفع الإلكتروني أو حماية الإدارة.",
        ["تسلسل ثابت للتخصيص", "تجهيز واضح للطلب", "دون ادعاءات أمان غير موثقة"],
      ),
      operations: topic(
        "Collection and product patterns provide a consistent way to organize frame styles, customization choices, and supporting content. The owner can extend the visible offer through the same structure instead of designing a different presentation for every new frame option.",
        ["Organized frame collections", "Reusable customization patterns", "Consistent supporting content"],
        "توفر أنماط المجموعات والمنتجات طريقة متسقة لتنظيم أشكال الإطارات وخيارات التخصيص والمحتوى الداعم. ويمكن للمالك توسيع العرض المرئي ضمن الهيكل نفسه بدل إنشاء عرض مختلف لكل خيار جديد.",
        ["مجموعات إطارات منظمة", "أنماط تخصيص قابلة لإعادة الاستخدام", "محتوى داعم متسق"],
      ),
      growth: topic(
        "The collection-led architecture can absorb new frame styles, sizes, finishes, and explanatory content without changing the core ordering path. Reusable product patterns also support stronger search structure and future enquiry or commerce integrations as the catalog matures.",
        ["Expandable frame options", "Reusable product architecture", "Ready for richer discovery and integrations"],
        "يستوعب الهيكل القائم على المجموعات أشكالًا ومقاسات وتشطيبات ومحتوى توضيحيًا جديدًا دون تغيير مسار الطلب الأساسي. وتدعم أنماط المنتجات القابلة لإعادة الاستخدام بنية بحث أفضل وتكاملات استفسار أو تجارة مستقبلية.",
        ["خيارات إطارات قابلة للتوسع", "بنية منتجات قابلة لإعادة الاستخدام", "جاهزية لاكتشاف وتكاملات أوسع"],
      ),
    },
  },
  "fresh-cart": {
    logoImage: "/images/brands-logos/freshcart-logo.webp",
    logoScale: 1.05,
    reviewAliases: ["Fresh Cart", "FreshCart"],
    qualities: {
      experience: topic(
        "Fresh Cart is centered on quick category browsing and uncomplicated product discovery. A direct information hierarchy helps shoppers understand where products belong and move between catalog views comfortably, with responsive behavior preserving that clarity on mobile.",
        ["Clear category navigation", "Direct product discovery", "Mobile-friendly catalog browsing"],
        "يركز فريش كارت على تصفح الأقسام بسرعة واكتشاف المنتجات دون تعقيد. ويساعد التسلسل المعلوماتي المباشر المتسوق على فهم تصنيف المنتجات والتنقل بين واجهات الكتالوج براحة، مع الحفاظ على الوضوح في الهاتف.",
        ["تنقل واضح بين الأقسام", "اكتشاف مباشر للمنتجات", "تصفح كتالوج مناسب للهاتف"],
      ),
      performance: topic(
        "The project uses a focused responsive page structure so category and product content remain easy to scan at different widths. Keeping discovery paths simple reduces interface overhead and avoids making shoppers cross unrelated screens to reach core catalog information.",
        ["Responsive catalog structure", "Focused category views", "Short discovery paths"],
        "يستخدم المشروع هيكل صفحات متجاوبًا ومركزًا لتظل الأقسام والمنتجات سهلة المسح البصري عبر المقاسات المختلفة. ويقلل بساطة مسارات الاكتشاف من ازدحام الواجهة والحاجة إلى عبور شاشات غير مرتبطة للوصول إلى معلومات الكتالوج.",
        ["هيكل كتالوج متجاوب", "واجهات أقسام مركزة", "مسارات اكتشاف قصيرة"],
      ),
      security: topic(
        "Reliability is supported by consistent catalog organization and predictable navigation between categories and products. Because no live checkout, private account, payment, or admin controls are verified for this project, the case study deliberately avoids attributing those security features to it.",
        ["Predictable catalog navigation", "Consistent product presentation", "No unsupported account or payment claims"],
        "تدعم الموثوقية بنية كتالوج متسقة وتنقل متوقع بين الأقسام والمنتجات. ولعدم توثيق دفع مباشر أو حسابات خاصة أو مدفوعات أو إدارة لهذا المشروع، تتجنب دراسة المشروع نسب هذه المزايا الأمنية إليه.",
        ["تنقل متوقع في الكتالوج", "عرض متسق للمنتجات", "دون ادعاءات غير موثقة للحساب أو الدفع"],
      ),
      operations: topic(
        "Reusable category and product patterns provide a maintainable way to organize catalog content. They reduce repeated layout work when the visible assortment changes and keep product information presented consistently across the store concept.",
        ["Reusable category patterns", "Consistent product organization", "Lower layout repetition"],
        "توفر أنماط الأقسام والمنتجات القابلة لإعادة الاستخدام طريقة سهلة الصيانة لتنظيم محتوى الكتالوج. وتقلل إعادة تنفيذ التخطيطات عند تغير المنتجات وتحافظ على عرض المعلومات بصورة متسقة.",
        ["أنماط أقسام قابلة لإعادة الاستخدام", "تنظيم متسق للمنتجات", "تقليل تكرار التخطيطات"],
      ),
      growth: topic(
        "Fresh Cart can add categories, products, and richer discovery content through the same catalog structure. The clear separation of category and product views gives future search, filtering, SEO content, or commerce integrations defined places to grow into.",
        ["Expandable category tree", "Reusable product views", "Room for search, filtering, and integrations"],
        "يستطيع فريش كارت إضافة أقسام ومنتجات ومحتوى اكتشاف أغنى عبر هيكل الكتالوج نفسه. ويمنح الفصل بين واجهات الأقسام والمنتجات البحث والتصفية ومحتوى SEO أو تكاملات التجارة أماكن واضحة للتوسع مستقبلًا.",
        ["شجرة أقسام قابلة للتوسع", "واجهات منتجات قابلة لإعادة الاستخدام", "مساحة للبحث والتصفية والتكاملات"],
      ),
    },
  },
  travco: {
    logoImage: "/images/brands-logos/travco-logo.webp",
    logoScale: 1.02,
    reviewAliases: ["Travco"],
    qualities: {
      experience: topic(
        "Travco gives visitors a direct route through the company, its services, and selected work. The professional information hierarchy builds confidence by answering who the business is, what it does, and where to continue when a visitor wants to make contact.",
        ["Clear company narrative", "Structured service discovery", "Direct contact path"],
        "يمنح ترافكو الزائر مسارًا مباشرًا عبر تعريف الشركة وخدماتها وأعمالها المختارة. ويبني التسلسل المعلوماتي المهني الثقة بإجابة من هي الشركة وماذا تقدم وإلى أين ينتقل الزائر عندما يرغب في التواصل.",
        ["قصة شركة واضحة", "اكتشاف منظم للخدمات", "مسار مباشر للتواصل"],
      ),
      performance: topic(
        "A focused responsive structure keeps business content readable and easy to scan across screen sizes. Service and company information stay in purposeful sections, limiting visual clutter and helping mobile visitors reach the most relevant material without navigating a dense interface.",
        ["Responsive company presentation", "Focused service sections", "Readable mobile content"],
        "يحافظ الهيكل المتجاوب والمركز على سهولة قراءة محتوى الشركة ومسحه بصريًا عبر مختلف الشاشات. وتبقى معلومات الخدمات والشركة في أقسام هادفة تقلل الازدحام وتساعد زائر الهاتف على الوصول للمادة الأهم.",
        ["عرض متجاوب للشركة", "أقسام خدمات مركزة", "محتوى واضح على الهاتف"],
      ),
      security: topic(
        "The public company profile favors a stable, predictable information path with consistent navigation and clearly identified contact actions. No private authentication, payment, or administrative workflow is claimed where the available project data does not verify one.",
        ["Consistent public navigation", "Clearly bounded contact actions", "No unsupported private-system claims"],
        "يفضل الموقع التعريفي مسار معلومات ثابتًا ومتوقعًا مع تنقل متسق وإجراءات تواصل محددة بوضوح. ولا تنسب الدراسة أنظمة دخول خاصة أو دفع أو إدارة حين لا توثقها بيانات المشروع المتاحة.",
        ["تنقل عام متسق", "إجراءات تواصل محددة", "دون ادعاءات لأنظمة خاصة غير موثقة"],
      ),
      operations: topic(
        "The maintainable content structure organizes company information, services, and selected work into reusable presentation patterns. This reduces the effort required to keep the public profile current as the business changes its offer or adds new proof of work.",
        ["Reusable service sections", "Organized company information", "Maintainable work presentation"],
        "ينظم هيكل المحتوى القابل للصيانة معلومات الشركة والخدمات والأعمال المختارة في أنماط عرض قابلة لإعادة الاستخدام. ويقلل ذلك الجهد اللازم لتحديث الملف العام عند تغير العروض أو إضافة أعمال جديدة.",
        ["أقسام خدمات قابلة لإعادة الاستخدام", "معلومات شركة منظمة", "عرض أعمال سهل الصيانة"],
      ),
      growth: topic(
        "Travco can expand service pages, company information, and project proof through the existing content hierarchy. The semantic separation of those topics supports future SEO work, analytics tracking, multilingual content, and enquiry integrations without requiring a new site structure.",
        ["Expandable service content", "SEO-ready content hierarchy", "Room for tracking and enquiry integrations"],
        "يمكن لترافكو توسيع صفحات الخدمات ومعلومات الشركة وأدلة الأعمال ضمن التسلسل الحالي. ويدعم الفصل الدلالي بين الموضوعات أعمال SEO مستقبلية والتتبع والمحتوى متعدد اللغات وتكاملات الاستفسار دون هيكل موقع جديد.",
        ["محتوى خدمات قابل للتوسع", "تسلسل محتوى مهيأ لـ SEO", "مساحة للتتبع وتكاملات الاستفسار"],
      ),
    },
  },
  byjojo: {
    logoImage: "/images/brands-logos/byjojo-logo.webp",
    logoScale: 1,
    reviewAliases: ["ByJojo", "By Jojo"],
    qualities: {
      experience: topic(
        "ByJojo combines a warm brand presentation with clear discovery for personalized gifts. Product-led navigation helps shoppers compare gift ideas while the responsive layout keeps the brand story and the next useful action visible without overwhelming smaller screens.",
        ["Warm product-led discovery", "Clear gift comparison", "Responsive calls to action"],
        "يجمع باي جوجو بين عرض دافئ للعلامة واكتشاف واضح للهدايا المخصصة. ويساعد التنقل القائم على المنتجات في مقارنة الأفكار، مع إبقاء قصة العلامة والإجراء التالي ظاهرين دون إرباك الشاشات الصغيرة.",
        ["اكتشاف دافئ تقوده المنتجات", "مقارنة واضحة للهدايا", "إجراءات متجاوبة وواضحة"],
      ),
      performance: topic(
        "The storefront structure keeps product browsing focused while preserving the visual personality that distinguishes the gift range. Responsive content patterns allow imagery and product information to adapt to available space instead of forcing a desktop composition onto mobile.",
        ["Focused storefront structure", "Responsive product patterns", "Balanced brand and catalog content"],
        "يحافظ هيكل المتجر على تركيز تصفح المنتجات مع صون الشخصية البصرية التي تميز مجموعة الهدايا. وتتكيف أنماط المحتوى المتجاوبة والصور ومعلومات المنتجات مع المساحة بدل فرض تكوين الحاسوب على الهاتف.",
        ["هيكل متجر مركز", "أنماط منتجات متجاوبة", "توازن بين العلامة والكتالوج"],
      ),
      security: topic(
        "Consistent product and navigation patterns make the gift-browsing journey dependable as shoppers compare personalized options. The project description does not verify private accounts, payments, or administrative security, so the case study makes no claims about those systems.",
        ["Predictable product navigation", "Consistent gift-option presentation", "No unsupported private-system claims"],
        "تجعل أنماط المنتجات والتنقل المتسقة رحلة تصفح الهدايا موثوقة عند مقارنة الخيارات المخصصة. ولا يوثق وصف المشروع حسابات خاصة أو مدفوعات أو أمانًا إداريًا، لذلك لا تنسب الدراسة هذه الأنظمة إليه.",
        ["تنقل متوقع بين المنتجات", "عرض متسق لخيارات الهدايا", "دون ادعاءات لأنظمة خاصة غير موثقة"],
      ),
      operations: topic(
        "Reusable product and content patterns keep the gift range and brand storytelling organized within one storefront language. This makes visible catalog and editorial updates more consistent and avoids creating a separate layout for every personalized-gift theme.",
        ["Reusable product presentation", "Organized brand storytelling", "Consistent catalog updates"],
        "تحافظ أنماط المنتجات والمحتوى القابلة لإعادة الاستخدام على تنظيم مجموعة الهدايا وقصة العلامة ضمن لغة متجر واحدة. ويجعل ذلك تحديثات الكتالوج والمحتوى أكثر اتساقًا دون تخطيط منفصل لكل موضوع هدية.",
        ["عرض منتجات قابل لإعادة الاستخدام", "قصة علامة منظمة", "تحديثات كتالوج متسقة"],
      ),
      growth: topic(
        "The same storefront patterns can support new gift categories, personalization themes, and richer brand content as ByJojo grows. Clear product grouping also creates a practical foundation for future search, SEO landing pages, analytics, and commerce integrations.",
        ["Expandable gift categories", "Reusable personalization themes", "Foundation for search, SEO, and integrations"],
        "تدعم أنماط المتجر نفسها فئات هدايا وموضوعات تخصيص ومحتوى علامة أغنى مع نمو باي جوجو. كما ينشئ تجميع المنتجات الواضح أساسًا عمليًا للبحث وصفحات SEO والتحليلات وتكاملات التجارة مستقبلًا.",
        ["فئات هدايا قابلة للتوسع", "موضوعات تخصيص قابلة لإعادة الاستخدام", "أساس للبحث وSEO والتكاملات"],
      ),
    },
  },
  "ms-store": {
    logoImage: "/images/brands-logos/ms-logo.webp",
    logoScale: 1.04,
    reviewAliases: ["MS Store", "MSStore"],
    qualities: {
      experience: topic(
        "MS Store prioritizes straightforward product organization so customers can understand the catalog and continue shopping without unnecessary decisions. The consistent presentation and responsive layout keep browsing familiar as the screen size changes.",
        ["Straightforward catalog hierarchy", "Consistent product presentation", "Responsive shopping experience"],
        "يعطي إم إس ستور الأولوية لتنظيم المنتجات بوضوح حتى يفهم العميل الكتالوج ويواصل التسوق دون قرارات غير ضرورية. ويحافظ العرض المتسق والتخطيط المتجاوب على تجربة مألوفة مع تغير حجم الشاشة.",
        ["تسلسل مباشر للكتالوج", "عرض متسق للمنتجات", "تجربة تسوق متجاوبة"],
      ),
      performance: topic(
        "An efficient responsive page structure keeps catalog content readable and the shopping path focused. Repeated product patterns reduce visual overhead, allowing each item to use the same dependable hierarchy rather than introducing new interface rules across the store.",
        ["Efficient responsive layout", "Reusable product patterns", "Focused catalog navigation"],
        "يحافظ هيكل الصفحات المتجاوب والفعال على وضوح الكتالوج وتركيز مسار التسوق. وتقلل أنماط المنتجات المتكررة الحمل البصري بحيث يستخدم كل منتج تسلسلًا موثوقًا بدل قواعد واجهة جديدة في أنحاء المتجر.",
        ["تخطيط متجاوب وفعال", "أنماط منتجات قابلة لإعادة الاستخدام", "تنقل مركز في الكتالوج"],
      ),
      security: topic(
        "Reliability is built through consistent product states and predictable navigation so customers understand where they are while browsing. No protected account, payment, or admin functionality is documented for the current project, and none is implied by this case study.",
        ["Predictable catalog states", "Consistent navigation", "No unsupported account or payment claims"],
        "تُبنى الموثوقية عبر حالات منتجات متسقة وتنقل متوقع حتى يعرف العميل موقعه أثناء التصفح. ولا توثق بيانات المشروع الحالية حسابًا محميًا أو دفعًا أو إدارة، لذلك لا تلمح دراسة المشروع إلى وجودها.",
        ["حالات كتالوج متوقعة", "تنقل متسق", "دون ادعاءات غير موثقة للحساب أو الدفع"],
      ),
      operations: topic(
        "The reusable catalog structure gives the owner a consistent format for presenting products and supporting content. It reduces repetitive layout work as the visible assortment changes and makes future content maintenance easier to reason about.",
        ["Reusable catalog structure", "Consistent product content", "Reduced layout repetition"],
        "يمنح هيكل الكتالوج القابل لإعادة الاستخدام المالك صيغة متسقة لعرض المنتجات والمحتوى الداعم. ويقلل أعمال التخطيط المتكررة عند تغير المعروض ويجعل صيانة المحتوى مستقبلًا أكثر وضوحًا.",
        ["هيكل كتالوج قابل لإعادة الاستخدام", "محتوى منتجات متسق", "تقليل تكرار التخطيطات"],
      ),
      growth: topic(
        "MS Store can add products, categories, and supporting shopping content through its existing reusable patterns. The clean separation of catalog information also leaves defined extension points for future search, filtering, SEO content, analytics, or commerce services.",
        ["Expandable products and categories", "Maintainable catalog patterns", "Room for search, SEO, and integrations"],
        "يستطيع إم إس ستور إضافة منتجات وأقسام ومحتوى تسوق داعم عبر أنماطه الحالية القابلة لإعادة الاستخدام. كما يترك الفصل الواضح لمعلومات الكتالوج نقاط توسع للبحث والتصفية وSEO والتحليلات أو خدمات التجارة.",
        ["منتجات وأقسام قابلة للتوسع", "أنماط كتالوج سهلة الصيانة", "مساحة للبحث وSEO والتكاملات"],
      ),
    },
  },
};

const projectFacts = {
  zohour: {
    logoLoop: ["cap", "flower", "bag", "storefront", "mobileShopping", "growth", "secureCheckout"],
    launchInventory: { en: "4 products", ar: "4 منتجات" },
    publicPages: {
      en: ["Home", "Shop", "Product Details", "Cart", "Checkout", "Login", "Register", "My Orders"],
      ar: ["الرئيسية", "المتجر", "تفاصيل المنتج", "السلة", "الدفع", "تسجيل الدخول", "إنشاء حساب", "طلباتي"],
    },
    managementGroups: [{
      title: { en: "Admin", ar: "الإدارة" },
      items: {
        en: ["Analytics", "Orders", "Products", "Bundles", "Offers", "Discount Codes", "Waitlist"],
        ar: ["التحليلات", "الطلبات", "المنتجات", "الباقات", "العروض", "أكواد الخصم", "قائمة الانتظار"],
      },
    }],
    security: securityContent(
      "Protected customer and administrator areas keep private orders and store controls separate from the public shop. Controlled commercial rules support consistent order, offer, and discount handling.",
      "تفصل مناطق العملاء والإدارة المحمية الطلبات الخاصة وأدوات المتجر عن واجهة التسوق العامة. كما تحافظ القواعد التجارية المنضبطة على اتساق الطلبات والعروض والخصومات.",
      [
        safeguardGroup(
          "Access & authorization",
          ["Protected customer order routes", "Protected administrator routes", "Restricted store-management controls"],
          "الوصول والصلاحيات",
          ["مسارات محمية لطلبات العملاء", "مسارات محمية للإدارة", "أدوات إدارة متجر محدودة الصلاحيات"],
        ),
        safeguardGroup(
          "Data & business rules",
          ["Controlled order calculations", "Controlled offer and discount handling", "Defined order states"],
          "البيانات وقواعد العمل",
          ["حسابات طلبات منضبطة", "معالجة منضبطة للعروض والخصومات", "حالات طلب محددة"],
        ),
      ],
    ),
    metrics: [
      ["monthlySessions", "30,000"], ["monthlyOrders", "1,350"], ["conversionRate", "4.5%"],
      ["mobileTraffic", "86%"], ["lighthouseMobile", "95/100"], ["lighthouseDesktop", "99/100"],
      ["lcp", "1.4 seconds"], ["uptime90", "99.98% over 90 days"], ["p95Api", "170ms"],
    ],
    strongResults: {
      en: ["12% add-to-cart rate", "At least 25% of monthly orders come from returning customers"],
      ar: ["معدل إضافة إلى السلة 12%", "ما لا يقل عن 25% من الطلبات الشهرية تأتي من عملاء عائدين"],
    },
    reviewAliases: ["Zohour", "Zohour Store", "زهور"],
    isComingSoon: false,
  },
  "s8-factory": {
    logoLoop: ["factory", "clothing", "package", "management", "dashboard", "productionRequest", "growth"],
    launchInventory: { en: "5 manufacturing lines · 8 sample products", ar: "5 خطوط تصنيع · 8 منتجات عينات" },
    publicPages: {
      en: ["Home", "Lines", "Brands", "Appointment", "Samples", "About Us", "Contact", "Cart", "Register", "Login", "Checkout", "My Orders", "Track Order"],
      ar: ["الرئيسية", "الخطوط", "العلامات", "حجز موعد", "العينات", "من نحن", "تواصل", "السلة", "إنشاء حساب", "تسجيل الدخول", "الدفع", "طلباتي", "تتبع الطلب"],
    },
    managementGroups: [
      {
        title: { en: "Customer dashboard", ar: "لوحة العميل" },
        items: { en: ["Contracts", "Requests", "Calls Booked", "Orders"], ar: ["العقود", "الطلبات", "المكالمات المحجوزة", "طلبات العينات"] },
      },
      {
        title: { en: "Admin dashboard", ar: "لوحة الإدارة" },
        items: {
          en: ["Overview", "Requests", "Calls", "Contracts", "Sample Orders", "Production Ledger", "Analytics", "Settings", "Reviews", "Go Home", "Logout"],
          ar: ["نظرة عامة", "الطلبات", "المكالمات", "العقود", "طلبات العينات", "سجل الإنتاج", "التحليلات", "الإعدادات", "الآراء", "الرئيسية", "تسجيل الخروج"],
        },
      },
    ],
    security: securityContent(
      "Customer and administrator roles separate private production work from the public factory site. Contracts, production requests, call bookings, and sample orders follow controlled access and calculation rules.",
      "تفصل صلاحيات العملاء والإدارة أعمال الإنتاج الخاصة عن موقع المصنع العام. وتتبع العقود وطلبات الإنتاج وحجوزات المكالمات وطلبات العينات ضوابط واضحة للوصول والحساب.",
      [
        safeguardGroup(
          "Access & authorization",
          ["Protected customer and administrator routes", "Restricted contract and production-request access", "Production-ledger access controls"],
          "الوصول والصلاحيات",
          ["مسارات محمية للعملاء والإدارة", "وصول محدود للعقود وطلبات الإنتاج", "صلاحيات وصول لسجل الإنتاج"],
        ),
        safeguardGroup(
          "Request & abuse protection",
          ["Structured production-request states", "Validated sample-order workflow", "Controlled call-booking workflow"],
          "حماية الطلبات وإساءة الاستخدام",
          ["حالات منظمة لطلبات الإنتاج", "مسار متحقق لطلبات العينات", "مسار منضبط لحجز المكالمات"],
        ),
        safeguardGroup(
          "Data & business rules",
          ["Controlled contract and deposit calculations", "Customer-specific contract visibility", "Restricted production records"],
          "البيانات وقواعد العمل",
          ["حسابات منضبطة للعقود والدفعات المقدمة", "عرض العقود الخاصة بكل عميل", "سجلات إنتاج محدودة الوصول"],
        ),
      ],
    ),
    metrics: [
      ["monthlySessions", "25,000"], ["totalConversions", "1,250"], ["sampleOrders", "950"],
      ["qualifiedLeads", "300"], ["conversionRate", "5%"], ["mobileTraffic", "82%"],
      ["lighthouseMobile", "96/100"], ["lighthouseDesktop", "100/100"], ["lcp", "1.2 seconds"],
      ["uptime90", "99.99% over 90 days"], ["p95Api", "150ms"],
    ],
    strongResults: {
      en: ["12% add-to-cart rate on the samples page", "At least 20% of qualified manufacturing leads become serious production opportunities", "Quotation preparation time is under 10 minutes"],
      ar: ["معدل إضافة إلى السلة 12% في صفحة العينات", "ما لا يقل عن 20% من فرص التصنيع المؤهلة تتحول إلى فرص إنتاج جادة", "تجهيز عرض السعر يستغرق أقل من 10 دقائق"],
    },
    reviewAliases: ["S8 Factory", "S8", "S8Factory", "إس 8"],
    isComingSoon: false,
  },
  atheer: {
    logoLoop: ["perfume", "sparkle", "bag", "categories", "mobileShopping", "secureCheckout", "analytics"],
    launchInventory: { en: "28 products", ar: "28 منتجًا" },
    publicPages: {
      en: ["Home", "Shop", "Product Details", "Cart", "Checkout", "Login", "Register", "My Orders"],
      ar: ["الرئيسية", "المتجر", "تفاصيل المنتج", "السلة", "الدفع", "تسجيل الدخول", "إنشاء حساب", "طلباتي"],
    },
    managementGroups: [{
      title: { en: "Admin", ar: "الإدارة" },
      items: { en: ["Analytics", "Orders", "Products", "Bundles", "Offers", "Discount Codes", "Waitlist"], ar: ["التحليلات", "الطلبات", "المنتجات", "الباقات", "العروض", "أكواد الخصم", "قائمة الانتظار"] },
    }],
    security: securityContent(
      "Customer orders and administrator tools remain separate from the public fragrance catalog. Structured payment-proof, discount, and product-media workflows keep sensitive store actions inside management.",
      "تظل طلبات العملاء وأدوات الإدارة منفصلة عن كتالوج العطور العام. وتحافظ مسارات إثبات الدفع والخصومات وصور المنتجات على بقاء إجراءات المتجر الحساسة داخل الإدارة.",
      [
        safeguardGroup(
          "Access & authorization",
          ["Separated customer and administrator areas", "Protected customer order access", "Product-media changes kept in management"],
          "الوصول والصلاحيات",
          ["فصل مناطق العملاء عن الإدارة", "وصول محمي لطلبات العميل", "تغييرات صور المنتجات داخل الإدارة"],
        ),
        safeguardGroup(
          "Data & business rules",
          ["Structured payment-proof records", "Controlled discount-code flow", "Defined order and payment states"],
          "البيانات وقواعد العمل",
          ["سجلات منظمة لإثبات الدفع", "مسار منضبط لأكواد الخصم", "حالات محددة للطلبات والمدفوعات"],
        ),
      ],
    ),
    metrics: [
      ["monthlySessions", "24,000"], ["monthlyOrders", "1,056"], ["conversionRate", "4.4%"],
      ["mobileTraffic", "84%"], ["lighthouseMobile", "95/100"], ["lighthouseDesktop", "99/100"],
      ["lcp", "1.4 seconds"], ["uptime90", "99.98% over 90 days"], ["p95Api", "170ms"],
    ],
    strongResults: { en: ["11% add-to-cart rate", "Product-page exit rate remains below 35%"], ar: ["معدل إضافة إلى السلة 11%", "معدل الخروج من صفحة المنتج يظل أقل من 35%"] },
    reviewAliases: ["Atheer", "Atheer Otour", "Atheer Otoor", "أثير"],
    isComingSoon: false,
  },
  akm: {
    logoLoop: ["shirt", "variants", "bundle", "cart", "mobileShopping", "dashboard", "growth"],
    launchInventory: { en: "4 products", ar: "4 منتجات" },
    publicPages: {
      en: ["Home", "Shop", "Product Details", "Bundles", "Cart", "Checkout", "Login", "Register", "My Orders"],
      ar: ["الرئيسية", "المتجر", "تفاصيل المنتج", "الباقات", "السلة", "الدفع", "تسجيل الدخول", "إنشاء حساب", "طلباتي"],
    },
    managementGroups: [{
      title: { en: "Admin", ar: "الإدارة" },
      items: { en: ["Analytics", "Orders", "Products", "Categories", "Bundles", "Offers", "Discount Codes", "Waitlist"], ar: ["التحليلات", "الطلبات", "المنتجات", "التصنيفات", "الباقات", "العروض", "أكواد الخصم", "قائمة الانتظار"] },
    }],
    security: securityContent(
      "Protected customer and administrator routes keep order activity separate from the public fashion catalog. Defined stock, payment, offer, and bundle rules give customers and managers a consistent purchase state.",
      "تفصل مسارات العملاء والإدارة المحمية نشاط الطلبات عن كتالوج الأزياء العام. وتمنح قواعد المخزون والدفع والعروض والباقات العملاء والمديرين حالة شراء متسقة وواضحة.",
      [
        safeguardGroup(
          "Access & authorization",
          ["Separated customer and administrator routes", "Protected customer order access", "Product-media changes kept in management"],
          "الوصول والصلاحيات",
          ["فصل مسارات العملاء عن الإدارة", "وصول محمي لطلبات العميل", "تغييرات صور المنتجات داخل الإدارة"],
        ),
        safeguardGroup(
          "Data & business rules",
          ["Defined stock and payment states", "Controlled bundle and coupon rules", "Structured color and size selections"],
          "البيانات وقواعد العمل",
          ["حالات محددة للمخزون والدفع", "قواعد منضبطة للباقات والكوبونات", "اختيارات منظمة للألوان والمقاسات"],
        ),
      ],
    ),
    metrics: [
      ["monthlySessions", "28,000"], ["monthlyOrders", "1,344"], ["conversionRate", "4.8%"],
      ["mobileTraffic", "87%"], ["lighthouseMobile", "96/100"], ["lighthouseDesktop", "100/100"],
      ["lcp", "1.3 seconds"], ["uptime90", "99.99% over 90 days"], ["p95Api", "150ms"],
    ],
    strongResults: { en: ["Bundle offers appear in at least 30% of completed orders", "Average order value increased by 22%"], ar: ["عروض الباقات ضمن ما لا يقل عن 30% من الطلبات المكتملة", "ارتفع متوسط قيمة الطلب بنسبة 22%"] },
    reviewAliases: ["AKM", "AKM Brand", "ايه كيه ام"],
    isComingSoon: false,
  },
  davinto: {
    logoLoop: ["clothing", "variants", "bag", "mobileShopping", "account", "payment", "analytics"],
    launchInventory: { en: "50 products", ar: "50 منتجًا" },
    publicPages: {
      en: ["Home", "Shop", "Product Details", "Bundles", "Cart", "Checkout", "Login", "Register", "My Orders", "Track Order"],
      ar: ["الرئيسية", "المتجر", "تفاصيل المنتج", "الباقات", "السلة", "الدفع", "تسجيل الدخول", "إنشاء حساب", "طلباتي", "تتبع الطلب"],
    },
    managementGroups: [{
      title: { en: "Admin", ar: "الإدارة" },
      items: { en: ["Analytics", "Orders", "Products", "Categories", "Bundles", "Offers", "Discount Codes", "Waitlist", "Customers"], ar: ["التحليلات", "الطلبات", "المنتجات", "التصنيفات", "الباقات", "العروض", "أكواد الخصم", "قائمة الانتظار", "العملاء"] },
    }],
    security: securityContent(
      "Customer orders, store management and protected product-image uploads remain separate from the public fashion storefront.",
      "تظل طلبات العملاء وإدارة المتجر ورفع صور المنتجات المحمي منفصلة عن واجهة متجر الأزياء العامة.",
      [
        safeguardGroup(
          "Access & authorization",
          ["Customer order area separated from the public catalog", "Store management separated from the public storefront", "Restricted product-management workflow"],
          "الوصول والصلاحيات",
          ["فصل منطقة طلبات العميل عن الكتالوج العام", "فصل إدارة المتجر عن الواجهة العامة", "مسار محدود لإدارة المنتجات"],
        ),
        safeguardGroup(
          "Verified upload safeguards",
          ["Product-image uploads are limited to the management workflow"],
          "ضوابط رفع متحققة",
          ["رفع صور المنتجات محصور في مسار الإدارة"],
        ),
      ],
    ),
    metrics: [
      ["monthlySessions", "35,000"], ["monthlyOrders", "1,750"], ["conversionRate", "5%"],
      ["mobileTraffic", "89%"], ["lighthouseMobile", "96/100"], ["lighthouseDesktop", "100/100"],
      ["lcp", "1.2 seconds"], ["uptime90", "99.99% over 90 days"], ["p95Api", "140ms"],
    ],
    strongResults: { en: ["Checkout completion remains above 60%", "At least 25% of monthly orders come from returning customers", "Cart abandonment remains below 55%"], ar: ["اكتمال الدفع يظل أعلى من 60%", "ما لا يقل عن 25% من الطلبات الشهرية تأتي من عملاء عائدين", "التخلي عن السلة يظل أقل من 55%"] },
    reviewAliases: ["Davinto", "Davinto Store", "دافينتو"],
    liveUrl: "https://davinto-store.com",
    isComingSoon: false,
  },
  "salah-frame": {
    logoLoop: ["frame", "layers", "sliders", "bundle", "cart", "mobileShopping", "growth"],
    launchInventory: { en: "248 products", ar: "248 منتجًا" },
    publicPages: {
      en: ["Home", "Shop", "Product Details", "Bundles", "Cart", "Checkout", "Login", "Register", "My Orders"],
      ar: ["الرئيسية", "المتجر", "تفاصيل المنتج", "الباقات", "السلة", "الدفع", "تسجيل الدخول", "إنشاء حساب", "طلباتي"],
    },
    managementGroups: [{
      title: { en: "Shopify commerce management", ar: "إدارة التجارة عبر Shopify" },
      items: { en: ["Products and variants", "Framing options", "Product customization", "Bundle builder", "Orders"], ar: ["المنتجات والمتغيرات", "خيارات التأطير", "تخصيص المنتج", "منشئ الباقات", "الطلبات"] },
    }],
    security: securityContent(
      "Salah Frame keeps customization choices and order preparation inside a defined Shopify commerce flow. Controlled variant, framing, and bundle rules make the submitted configuration clear without claiming unverified private systems.",
      "يحافظ صلاح فريم على خيارات التخصيص وتجهيز الطلب ضمن مسار تجارة محدد في Shopify. وتجعل قواعد المتغيرات والتأطير والباقات الاختيار المرسل واضحًا دون ادعاء أنظمة خاصة غير موثقة.",
      [
        safeguardGroup(
          "Data & business rules",
          ["Controlled product and variant options", "Defined framing and customization choices", "Bundle selections handled in the commerce workflow"],
          "البيانات وقواعد العمل",
          ["خيارات منضبطة للمنتجات والمتغيرات", "اختيارات محددة للتأطير والتخصيص", "معالجة الباقات داخل مسار التجارة"],
        ),
        safeguardGroup(
          "Operational reliability",
          ["Consistent customization sequence", "Order preparation remains within Shopify commerce management"],
          "الموثوقية التشغيلية",
          ["تسلسل متسق للتخصيص", "تجهيز الطلبات ضمن إدارة تجارة Shopify"],
        ),
      ],
    ),
    metrics: [
      ["monthlySessions", "22,000"], ["monthlyOrders", "990"], ["conversionRate", "4.5%"],
      ["mobileTraffic", "85%"], ["lighthouseMobile", "94/100"], ["lighthouseDesktop", "98/100"],
      ["lcp", "1.6 seconds"], ["uptime90", "99.97% over 90 days"], ["p95Response", "190ms"],
    ],
    strongResults: { en: ["The bundle builder is used in at least 30% of orders", "Average order value increased by 25% through bundles and product customization"], ar: ["يُستخدم منشئ الباقات في ما لا يقل عن 30% من الطلبات", "ارتفع متوسط قيمة الطلب بنسبة 25% من خلال الباقات وتخصيص المنتجات"] },
    reviewAliases: ["Salah Frame", "SalahFrame", "Salah Frames", "صلاح فريم"],
    liveUrl: "https://salah-frame.myshopify.com",
    isComingSoon: false,
  },
  "fresh-cart": {
    logoLoop: ["cart", "freshProduce", "categories", "delivery", "mobileShopping", "repeatPurchase", "analytics"],
    launchInventory: { en: "628 products", ar: "628 منتجًا" },
    publicPages: {
      en: ["Home", "Shop", "Product Details", "Bundles", "Cart", "Checkout", "Login", "Register", "My Orders"],
      ar: ["الرئيسية", "المتجر", "تفاصيل المنتج", "الباقات", "السلة", "الدفع", "تسجيل الدخول", "إنشاء حساب", "طلباتي"],
    },
    managementGroups: [{
      title: { en: "Commerce management", ar: "إدارة المتجر" },
      items: { en: ["Catalog and category maintenance", "Order processing", "Bundle and repeat-order support"], ar: ["صيانة الكتالوج والتصنيفات", "معالجة الطلبات", "دعم الباقات وإعادة الطلب"] },
    }],
    security: securityContent(
      "Customer account and order areas remain separate from the public grocery catalog. Validated cart, checkout, and order workflows keep each shopper's activity within the intended purchase path.",
      "تظل مناطق حساب العميل وطلباته منفصلة عن كتالوج البقالة العام. وتحافظ مسارات السلة والدفع والطلبات المتحقق منها على نشاط كل متسوق داخل رحلة الشراء المقصودة.",
      [
        safeguardGroup(
          "Access & authorization",
          ["Protected customer order areas", "Customer-specific order visibility", "Separated public and account functions"],
          "الوصول والصلاحيات",
          ["مناطق محمية لطلبات العملاء", "عرض الطلبات الخاصة بكل عميل", "فصل الوظائف العامة عن الحساب"],
        ),
        safeguardGroup(
          "Request & abuse protection",
          ["Validated cart and checkout flow", "Structured order states", "Clear failure handling for purchase requests"],
          "حماية الطلبات وإساءة الاستخدام",
          ["التحقق من مسار السلة والدفع", "حالات منظمة للطلبات", "معالجة واضحة لتعذر طلبات الشراء"],
        ),
      ],
    ),
    metrics: [
      ["monthlySessions", "50,000"], ["monthlyOrders", "2,750"], ["conversionRate", "5.5%"],
      ["mobileTraffic", "91%"], ["lighthouseMobile", "95/100"], ["lighthouseDesktop", "99/100"],
      ["lcp", "1.3 seconds"], ["uptime90", "99.99% over 90 days"], ["p95Api", "150ms"],
    ],
    strongResults: { en: ["35% repeat-purchase rate", "Average reorder period below 21 days", "13% add-to-cart rate"], ar: ["معدل إعادة شراء 35%", "متوسط فترة إعادة الطلب أقل من 21 يومًا", "معدل إضافة إلى السلة 13%"] },
    reviewAliases: ["Fresh Cart", "FreshCart", "فريش كارت"],
    liveUrl: null,
    isComingSoon: false,
  },
  travco: {
    logoLoop: ["plane", "luggage", "location", "calendar", "globe", "inquiry", "growth"],
    launchInventory: { en: "8 travel packages", ar: "8 باقات سفر" },
    publicPages: {
      en: ["Home", "Packages", "Package Details", "Booking Selection", "Booking Request", "Login", "Register", "My Bookings"],
      ar: ["الرئيسية", "الباقات", "تفاصيل الباقة", "اختيار الحجز", "طلب الحجز", "تسجيل الدخول", "إنشاء حساب", "حجوزاتي"],
    },
    managementGroups: [{
      title: { en: "Booking operations", ar: "إدارة الحجوزات" },
      items: { en: ["Package management", "Booking enquiries", "Reservation status", "Customer booking records"], ar: ["إدارة الباقات", "استفسارات الحجز", "حالة الحجز", "سجلات حجوزات العملاء"] },
    }],
    security: securityContent(
      "Booking enquiries are validated before entering Travco's reservation workflow. Public package content, customer booking records, and operational handling stay separated so private enquiries are not treated as public site content.",
      "يتم التحقق من استفسارات الحجز قبل دخولها مسار حجوزات Travco. وتظل بيانات الباقات العامة وسجلات حجوزات العملاء والمعالجة التشغيلية منفصلة حتى لا تُعامل الاستفسارات الخاصة كمحتوى عام.",
      [
        safeguardGroup(
          "Access & authorization",
          ["Customer-specific booking visibility", "Booking operations separated from public package pages", "Restricted access to booking records"],
          "الوصول والصلاحيات",
          ["عرض الحجوزات الخاصة بكل عميل", "فصل عمليات الحجز عن صفحات الباقات العامة", "وصول محدود لسجلات الحجز"],
        ),
        safeguardGroup(
          "Request & abuse protection",
          ["Validated booking enquiries", "Structured reservation states", "Clear API feedback for failed booking requests"],
          "حماية الطلبات وإساءة الاستخدام",
          ["التحقق من استفسارات الحجز", "حالات منظمة للحجوزات", "استجابة واضحة عند تعذر طلب الحجز"],
        ),
        safeguardGroup(
          "Data & business rules",
          ["Controlled package and booking data", "Customer booking records remain separate from public content"],
          "البيانات وقواعد العمل",
          ["بيانات منضبطة للباقات والحجوزات", "فصل سجلات حجوزات العملاء عن المحتوى العام"],
        ),
      ],
    ),
    metrics: [
      ["monthlySessions", "20,000"], ["monthlyBookingLeads", "900"], ["conversionRate", "4.5%"],
      ["mobileTraffic", "79%"], ["lighthouseMobile", "97/100"], ["lighthouseDesktop", "100/100"],
      ["lcp", "1.1 seconds"], ["uptime90", "99.99% over 90 days"], ["p95Api", "130ms"],
    ],
    strongResults: { en: ["At least 20% of qualified booking enquiries become confirmed reservations", "Average booking-request completion time is under three minutes"], ar: ["ما لا يقل عن 20% من استفسارات الحجز المؤهلة تتحول إلى حجوزات مؤكدة", "متوسط إكمال طلب الحجز أقل من ثلاث دقائق"] },
    reviewAliases: ["Travco", "Travco Travel", "ترافكو"],
    liveUrl: null,
    isComingSoon: false,
  },
  byjojo: {
    logoLoop: ["bed", "fabric", "layers", "home", "cart", "mobileShopping", "growth"],
    launchInventory: { en: "22 products", ar: "22 منتجًا" },
    publicPages: {
      en: ["Home", "Shop", "Product Details", "Cart", "Checkout", "Login", "Register", "My Orders"],
      ar: ["الرئيسية", "المتجر", "تفاصيل المنتج", "السلة", "الدفع", "تسجيل الدخول", "إنشاء حساب", "طلباتي"],
    },
    managementGroups: [{
      title: { en: "Commerce management", ar: "إدارة المتجر" },
      items: { en: ["Bedding and table-linen catalog", "Order processing", "Bundle and upsell merchandising"], ar: ["كتالوج المفروشات ومفارش المائدة", "معالجة الطلبات", "تنسيق الباقات والمنتجات الإضافية"] },
    }],
    security: securityContent(
      "Protected customer order routes keep purchase history separate from ByJojo's public linen catalog. Controlled cart, checkout, bundle, and upsell workflows preserve customer-specific order visibility.",
      "تفصل مسارات طلبات العملاء المحمية سجل الشراء عن كتالوج ByJojo العام. وتحافظ مسارات السلة والدفع والباقات والمنتجات الإضافية على رؤية خاصة بطلبات كل عميل.",
      [
        safeguardGroup(
          "Access & authorization",
          ["Protected customer order area", "Customer-specific purchase visibility", "Public catalog separated from account activity"],
          "الوصول والصلاحيات",
          ["منطقة محمية لطلبات العميل", "عرض المشتريات الخاصة بكل عميل", "فصل الكتالوج العام عن نشاط الحساب"],
        ),
        safeguardGroup(
          "Data & business rules",
          ["Controlled cart and checkout flow", "Bundle and upsell rules remain in the order workflow", "Structured order states"],
          "البيانات وقواعد العمل",
          ["مسار منضبط للسلة والدفع", "قواعد الباقات والإضافات ضمن مسار الطلب", "حالات منظمة للطلبات"],
        ),
      ],
    ),
    metrics: [
      ["monthlySessions", "22,000"], ["monthlyOrders", "1,034"], ["conversionRate", "4.7%"],
      ["mobileTraffic", "88%"], ["lighthouseMobile", "95/100"], ["lighthouseDesktop", "99/100"],
      ["lcp", "1.4 seconds"], ["uptime90", "99.98% over 90 days"], ["p95Api", "160ms"],
    ],
    strongResults: { en: ["12% add-to-cart rate", "25% of monthly sales come through bundles or upsells", "Checkout completion remains above 58%"], ar: ["معدل إضافة إلى السلة 12%", "25% من المبيعات الشهرية تأتي عبر الباقات أو المنتجات الإضافية", "اكتمال الدفع يظل أعلى من 58%"] },
    reviewAliases: ["ByJojo", "By Jojo", "ByJojo Home", "باي جوجو"],
    liveUrl: null,
    isComingSoon: false,
  },
  "ms-store": {
    logoLoop: ["clothing", "storefront", "cart", "delivery", "mobileShopping", "management", "growth"],
    launchInventory: { en: "18 products", ar: "18 منتجًا" },
    publicPages: {
      en: ["Home", "Shop", "Product Details", "Cart", "Checkout", "Login", "Register", "Track Order"],
      ar: ["الرئيسية", "المتجر", "تفاصيل المنتج", "السلة", "الدفع", "تسجيل الدخول", "إنشاء حساب", "تتبع الطلب"],
    },
    managementGroups: [{
      title: { en: "Commerce management", ar: "إدارة المتجر" },
      items: { en: ["Catalog maintenance", "Order handling", "Customer order tracking"], ar: ["صيانة الكتالوج", "معالجة الطلبات", "تتبع طلبات العملاء"] },
    }],
    security: securityContent(
      "Account and checkout activity stays separate from MS Store's public clothing catalog. Guest tracking exposes only the lookup path needed by the shopper, while cart and order states follow a defined flow.",
      "يظل نشاط الحساب والدفع منفصلًا عن كتالوج الملابس العام في MS Store. ويعرض تتبع الضيف مسار البحث الذي يحتاجه المتسوق فقط، بينما تتبع السلة وحالات الطلب مسارًا محددًا.",
      [
        safeguardGroup(
          "Access & authorization",
          ["Separated account and public routes", "Restricted guest order lookup", "Customer order activity kept outside the public catalog"],
          "الوصول والصلاحيات",
          ["فصل مسارات الحساب عن الموقع العام", "بحث محدود لطلب الضيف", "إبقاء نشاط طلبات العميل خارج الكتالوج العام"],
        ),
        safeguardGroup(
          "Request & abuse protection",
          ["Validated cart and order states", "Controlled checkout flow", "Guest tracking limited to the required order lookup"],
          "حماية الطلبات وإساءة الاستخدام",
          ["التحقق من حالات السلة والطلب", "مسار دفع منضبط", "تتبع الضيف محصور في البحث المطلوب عن الطلب"],
        ),
      ],
    ),
    metrics: [
      ["monthlySessions", "20,000"], ["monthlyOrders", "840"], ["conversionRate", "4.2%"],
      ["mobileTraffic", "83%"], ["lighthouseMobile", "95/100"], ["lighthouseDesktop", "99/100"],
      ["lcp", "1.5 seconds"], ["uptime90", "99.97% over 90 days"], ["p95Api", "180ms"],
    ],
    strongResults: { en: ["At least 22% of monthly sales come from returning customers", "Checkout completion remains above 55%"], ar: ["ما لا يقل عن 22% من المبيعات الشهرية تأتي من عملاء عائدين", "اكتمال الدفع يظل أعلى من 55%"] },
    reviewAliases: ["MS Store", "MSStore", "M S Store", "إم إس ستور"],
    liveUrl: null,
    isComingSoon: false,
  },
};

Object.entries(projectFacts).forEach(([slug, facts]) => {
  Object.assign(caseStudyDetails[slug], facts);
});

const securityOverrides = {
  zohour: currentSecurityContent(
    "Zohour keeps private customer orders and store management separate from the public shop. Server-side checks protect commercial rules, while monitored error handling helps one failed checkout or database request stay contained.",
    "يفصل Zohour طلبات العملاء الخاصة وإدارة المتجر عن واجهة التسوق العامة. وتحمي المراجعات التي ينفذها الخادم القواعد التجارية، بينما تساعد معالجة الأخطاء والمراقبة على احتواء تعثر طلب دفع أو اتصال بقاعدة البيانات.",
    [
      protectionGroup("accessAuthorization", [
        "Protected customer and administrator routes use server-side permission and role checks, so customers can open only their own My Orders records and management endpoints remain restricted.",
        "Password hashing, controlled sessions, limited login attempts and neutral authentication errors protect accounts without revealing whether an email is registered.",
        "Analytics and waitlist operations stay inside authorized management access rather than the public storefront.",
      ], [
        "تستخدم مسارات العملاء والإدارة المحمية فحوص الصلاحيات والأدوار على الخادم، فلا يصل العميل إلا إلى سجلات طلباته وتظل نقاط الإدارة مقيدة.",
        "تحمي تجزئة كلمات المرور والجلسات المنضبطة وتقييد محاولات الدخول ورسائل المصادقة المحايدة الحسابات من دون كشف ما إذا كان البريد مسجلًا.",
        "تبقى عمليات التحليلات وقائمة الانتظار داخل وصول إداري مصرح به بعيدًا عن واجهة المتجر العامة.",
      ]),
      protectionGroup("requestAbuse", [
        "Server-side product and order validation rejects malformed data before database work, with payload limits and sanitized text where customers submit information.",
        "Rate limits cover authentication, checkout and repeated order submissions, while coupon, offer and bundle rules reduce automated or repeated abuse.",
        "Duplicate-submission checks prevent an accidental repeat click from creating an extra order.",
      ], [
        "يرفض التحقق من المنتجات والطلبات على الخادم البيانات غير الصحيحة قبل التعامل مع قاعدة البيانات، مع حدود لحجم الطلب وتنقية النصوص التي يرسلها العميل.",
        "تحد معدلات الطلب من إساءة استخدام تسجيل الدخول والدفع وتكرار إرسال الطلبات، كما تضبط قواعد الكوبونات والعروض والباقات المحاولات الآلية أو المتكررة.",
        "تمنع فحوص التكرار أن تؤدي النقرة المتكررة بالخطأ إلى إنشاء طلب إضافي.",
      ]),
      protectionGroup("browserTransport", [
        "HTTPS, strict transport settings, security headers and controlled origins protect data moving between the browser and Zohour.",
        "Clickjacking and content-type protections, compatible content policies and safe public errors reduce common browser risks without exposing internal details.",
        "Secure cookie behavior applies where sessions use cookies, and the storefront cannot call private endpoints outside its permitted access.",
      ], [
        "تحمي اتصالات HTTPS وإعدادات النقل الصارمة وترويسات الأمان والمصادر المسموح بها البيانات أثناء انتقالها بين المتصفح وZohour.",
        "تقلل حماية التضمين الاحتيالي ونوع المحتوى وسياسات المحتوى المتوافقة ورسائل الخطأ العامة الآمنة مخاطر المتصفح من دون كشف تفاصيل داخلية.",
        "تطبق إعدادات ملفات ارتباط آمنة عند استخدام الجلسات، ولا تستطيع الواجهة استدعاء النقاط الخاصة خارج صلاحياتها.",
      ]),
      protectionGroup("dataBusiness", [
        "Prices, delivery, discounts, offers, bundles and final totals are calculated and checked on the server, so protected commercial rules cannot be changed from the browser.",
        "Order ownership and explicit order-state transitions protect customer records and prevent unauthorized status changes.",
        "Safe database queries, injection protection, private-field filtering and secrets kept outside frontend code reduce exposure of store and customer data.",
      ], [
        "تُحسب الأسعار والتوصيل والخصومات والعروض والباقات والإجماليات النهائية وتُراجع على الخادم، فلا يمكن تغيير القواعد التجارية المحمية من المتصفح.",
        "تحمي ملكية الطلبات والانتقالات الصريحة بين حالاتها سجلات العملاء وتمنع تغييرات الحالة غير المصرح بها.",
        "تقلل استعلامات قاعدة البيانات الآمنة والحماية من الحقن وحجب الحقول الخاصة وحفظ الأسرار خارج الواجهة من تعرض بيانات المتجر والعملاء.",
      ]),
      protectionGroup("stabilityRecovery", [
        "Centralized errors, structured production and security logs, health checks and uptime and API monitoring make failures visible before they spread through the purchase journey.",
        "Database connection handling, important-query indexes, request and external-service timeouts, controlled retries and graceful shutdown protect the wider application from one failed request.",
        "Backups and restoration procedures support recovery, while non-critical email failures fall back without cancelling a valid order.",
      ], [
        "تجعل معالجة الأخطاء المركزية وسجلات التشغيل والأمان المنظمة وفحوص الصحة ومراقبة التوافر وواجهة API الأعطال ظاهرة قبل امتدادها إلى رحلة الشراء.",
        "تحمي معالجة انقطاع قاعدة البيانات وفهارس الاستعلامات المهمة والمهل الزمنية والمحاولات المنضبطة والإغلاق الآمن التطبيق من تأثره بطلب واحد متعثر.",
        "تدعم النسخ الاحتياطية وإجراءات الاستعادة التعافي، بينما لا يؤدي تعثر بريد غير أساسي إلى إلغاء طلب صحيح.",
      ]),
    ],
  ),
  "s8-factory": currentSecurityContent(
    "S8 Factory separates public enquiries from sensitive manufacturing records. Permission checks, ownership rules and controlled production states protect contracts, requests, appointments and sample orders, while resilient notifications and database handling keep factory operations moving.",
    "يفصل S8 Factory الاستفسارات العامة عن سجلات التصنيع الحساسة. وتحمي فحوص الصلاحيات والملكية وحالات الإنتاج المنضبطة العقود والطلبات والمواعيد وطلبات العينات، بينما تحافظ معالجة الإشعارات وقاعدة البيانات على استمرارية التشغيل.",
    [
      protectionGroup("accessAuthorization", [
        "Customer and administrator roles are checked on the server across contracts, manufacturing requests, appointments, call bookings and sample orders.",
        "Ownership validation lets each business customer see only its own records, while production-ledger and management endpoints stay restricted to authorized staff.",
        "Hashed passwords, controlled sessions, login limits and separated public, customer and administrator areas protect sensitive factory work.",
      ], [
        "تُفحص أدوار العملاء والإدارة على الخادم في العقود وطلبات التصنيع والمواعيد وحجوزات المكالمات وطلبات العينات.",
        "يتيح التحقق من الملكية لكل عميل أعمال رؤية سجلاته فقط، بينما يظل سجل الإنتاج ونقاط الإدارة مقيدين بالموظفين المصرح لهم.",
        "تحمي كلمات المرور المجزأة والجلسات المنضبطة وحدود الدخول وفصل المناطق العامة ومناطق العملاء والإدارة أعمال المصنع الحساسة.",
      ]),
      protectionGroup("requestAbuse", [
        "Manufacturing, appointment, call and sample requests are validated and size-limited before database operations, with sanitized text and malformed-request rejection.",
        "Rate limits and controlled repeated submissions reduce booking and request abuse, while honeypot fields block common automated form spam.",
        "Duplicate protection prevents the same contract, appointment or sample request from being recorded twice by accident.",
      ], [
        "يتم التحقق من طلبات التصنيع والمواعيد والمكالمات والعينات وتحديد حجمها قبل عمليات قاعدة البيانات، مع تنقية النصوص ورفض الطلبات غير الصحيحة.",
        "تقلل حدود المعدل وضبط الإرسال المتكرر إساءة استخدام الحجز والطلبات، وتحجب حقول المصيدة رسائل النماذج الآلية الشائعة.",
        "تمنع حماية التكرار تسجيل العقد أو الموعد أو طلب العينة نفسه مرتين عن طريق الخطأ.",
      ]),
      protectionGroup("browserTransport", [
        "HTTPS, transport security, controlled origins and security response headers protect factory and customer records in transit.",
        "Clickjacking, content-type and compatible content-policy controls reduce browser abuse, while production errors hide internal system details.",
        "Private contract and production endpoints accept only authorized frontend access and secure session behavior.",
      ], [
        "تحمي اتصالات HTTPS وأمان النقل والمصادر المحددة وترويسات الاستجابة سجلات المصنع والعملاء أثناء انتقالها.",
        "تقلل ضوابط التضمين الاحتيالي ونوع المحتوى وسياسة المحتوى المتوافقة إساءة استخدام المتصفح، بينما تخفي أخطاء التشغيل التفاصيل الداخلية.",
        "لا تقبل نقاط العقود والإنتاج الخاصة إلا وصول الواجهة المصرح به وسلوك الجلسات الآمن.",
      ]),
      protectionGroup("dataBusiness", [
        "Contract totals, deposits and remaining balances are calculated and validated on the server rather than trusted from the browser.",
        "Controlled contract, request, appointment and production-state transitions keep the operational ledger consistent and traceable.",
        "Ownership checks, safe database queries, injection protection and restricted private fields keep business records separated between customers.",
      ], [
        "تُحسب إجماليات العقود والعربون والأرصدة المتبقية وتُراجع على الخادم بدلًا من الاعتماد على المتصفح.",
        "تحافظ الانتقالات المنضبطة لحالات العقود والطلبات والمواعيد والإنتاج على اتساق السجل التشغيلي وإمكانية تتبعه.",
        "تفصل فحوص الملكية والاستعلامات الآمنة والحماية من الحقن وحجب الحقول الخاصة سجلات الأعمال بين العملاء.",
      ]),
      protectionGroup("stabilityRecovery", [
        "Central error handling, structured production and security logs, health checks, uptime monitoring and API monitoring surface operational faults early.",
        "Database failures and notification outages use safe fallbacks, timeouts and controlled retries so an email or messaging issue does not lose a valid manufacturing request.",
        "Graceful shutdown, indexed operational queries, restart behavior and tested backup and restoration procedures support recovery without exposing private records.",
      ], [
        "تكشف معالجة الأخطاء المركزية وسجلات التشغيل والأمان المنظمة وفحوص الصحة ومراقبة التوافر وواجهة API الأعطال التشغيلية مبكرًا.",
        "تستخدم أعطال قاعدة البيانات أو الإشعارات بدائل آمنة ومهلًا زمنية ومحاولات منضبطة، فلا يضيع طلب تصنيع صحيح بسبب تعثر البريد أو الرسائل.",
        "يدعم الإغلاق الآمن وفهرسة الاستعلامات التشغيلية وسلوك إعادة التشغيل وإجراءات النسخ والاستعادة المختبرة التعافي من دون كشف السجلات الخاصة.",
      ]),
    ],
  ),
  atheer: currentSecurityContent(
    "Atheer keeps customer accounts and orders separate from its public fragrance catalog. Product, cart and checkout validation preserve accurate order calculations, while monitored database and API handling contain failures without exposing private customer information.",
    "يفصل Atheer حسابات العملاء وطلباتهم عن كتالوج العطور العام. ويحافظ التحقق من المنتجات والسلة والدفع على دقة حسابات الطلب، بينما تحتوي مراقبة قاعدة البيانات وواجهة API الأعطال من دون كشف معلومات العملاء الخاصة.",
    [
      protectionGroup("accessAuthorization", [
        "Protected customer and administrator routes use server-side role and ownership checks, so customers see only their own orders and store tools remain restricted.",
        "Password hashing, controlled sessions, limited login attempts and neutral authentication errors protect customer accounts.",
      ], [
        "تستخدم مسارات العملاء والإدارة المحمية فحوص الأدوار والملكية على الخادم، فلا يرى العميل إلا طلباته وتظل أدوات المتجر مقيدة.",
        "تحمي تجزئة كلمات المرور والجلسات المنضبطة وحدود محاولات الدخول ورسائل المصادقة المحايدة حسابات العملاء.",
      ]),
      protectionGroup("requestAbuse", [
        "Server-side validation checks products, cart lines, checkout details and order submissions before any database change.",
        "Authentication and checkout rate limits, payload controls and duplicate-order protection reduce automated abuse and accidental repeats.",
      ], [
        "يفحص التحقق على الخادم المنتجات وعناصر السلة وبيانات الدفع وإرسال الطلب قبل أي تغيير في قاعدة البيانات.",
        "تقلل حدود تسجيل الدخول والدفع وحجم الطلب وحماية تكرار الطلبات الإساءة الآلية والتكرار غير المقصود.",
      ]),
      protectionGroup("browserTransport", [
        "HTTPS, strict transport security, controlled origins and security headers protect account and checkout traffic.",
        "Clickjacking and content-type protection, safe production errors and secure cookie behavior where applicable reduce common browser exposure.",
      ], [
        "تحمي اتصالات HTTPS وأمان النقل الصارم والمصادر المحددة وترويسات الأمان بيانات الحساب والدفع.",
        "تقلل حماية التضمين الاحتيالي ونوع المحتوى ورسائل التشغيل الآمنة وإعدادات الارتباط الآمنة عند الحاجة التعرض لمخاطر المتصفح الشائعة.",
      ]),
      protectionGroup("dataBusiness", [
        "Order prices, discounts and totals are calculated and rechecked on the server, with explicit order and payment states.",
        "Protected records, safe queries, injection protection and restricted private fields keep customer and order data out of public responses.",
      ], [
        "تُحسب أسعار الطلب والخصومات والإجماليات وتُراجع على الخادم، مع حالات صريحة للطلب والدفع.",
        "تُبقي السجلات المحمية والاستعلامات الآمنة والحماية من الحقن وحجب الحقول الخاصة بيانات العملاء والطلبات خارج الاستجابات العامة.",
      ]),
      protectionGroup("stabilityRecovery", [
        "Centralized errors and safe API responses stop internal details reaching customers while structured logs and monitoring show where a request failed.",
        "Database connection handling, timeouts, controlled retries, health checks, backups and hosting recovery protect the wider shopping journey from an isolated failure.",
      ], [
        "تمنع الأخطاء المركزية واستجابات API الآمنة وصول التفاصيل الداخلية إلى العملاء، بينما توضح السجلات والمراقبة موضع تعثر الطلب.",
        "تحمي معالجة اتصال قاعدة البيانات والمهل والمحاولات المنضبطة وفحوص الصحة والنسخ الاحتياطية وتعافي الاستضافة رحلة التسوق من العطل المعزول.",
      ]),
    ],
  ),
  akm: currentSecurityContent(
    "AKM protects the fashion purchase journey from variant selection through order tracking. Server-side checks enforce color, size, bundle and pricing rules, while account controls and resilient services keep customer orders private and consistent.",
    "يحمي AKM رحلة شراء الأزياء من اختيار المتغيرات حتى تتبع الطلب. وتفرض فحوص الخادم قواعد اللون والمقاس والباقات والتسعير، بينما تحافظ ضوابط الحساب والخدمات المرنة على خصوصية الطلبات واتساقها.",
    [
      protectionGroup("accessAuthorization", [
        "Customer and administrator routes use server-side role checks, order ownership validation and restricted management endpoints.",
        "Protected tracking and My Orders access expose each purchase only to its customer or an authorized administrator, with controlled sessions and login attempts.",
      ], [
        "تستخدم مسارات العملاء والإدارة فحوص الأدوار على الخادم والتحقق من ملكية الطلب ونقاط إدارة محدودة.",
        "لا يعرض التتبع المحمي ومنطقة طلباتي كل عملية شراء إلا لصاحبها أو لمسؤول مصرح له، مع جلسات ومحاولات دخول منضبطة.",
      ]),
      protectionGroup("requestAbuse", [
        "Products, colors, sizes and bundle slots are validated before order creation, and malformed or oversized requests are rejected before database work.",
        "Checkout and order limits, coupon and bundle abuse controls and duplicate-submission checks reduce automated and repeated purchases.",
      ], [
        "يتم التحقق من المنتجات والألوان والمقاسات وخانات الباقات قبل إنشاء الطلب، وترفض الطلبات غير الصحيحة أو كبيرة الحجم قبل التعامل مع قاعدة البيانات.",
        "تقلل حدود الدفع والطلبات وضوابط إساءة استخدام الكوبونات والباقات وفحوص التكرار عمليات الشراء الآلية والمتكررة.",
      ]),
      protectionGroup("browserTransport", [
        "HTTPS, strict transport settings, controlled origins and security headers protect shopping and administration traffic.",
        "Clickjacking, content-type and compatible content-policy controls combine with safe public errors and secure session behavior.",
      ], [
        "تحمي اتصالات HTTPS وإعدادات النقل الصارمة والمصادر المحددة وترويسات الأمان حركة التسوق والإدارة.",
        "تعمل حماية التضمين الاحتيالي ونوع المحتوى وسياسة المحتوى المتوافقة مع رسائل الخطأ العامة الآمنة وسلوك الجلسة المحمي.",
      ]),
      protectionGroup("dataBusiness", [
        "Bundle savings, offers, discounts, shipping and final order totals are calculated and validated on the server.",
        "Explicit stock, payment and order-state transitions protect variant consistency and prevent unauthorized changes from the browser.",
        "Safe queries, injection protection, private-field filtering and secrets outside frontend code protect customer and commercial data.",
      ], [
        "تُحسب وفورات الباقات والعروض والخصومات والشحن والإجمالي النهائي وتُراجع على الخادم.",
        "تحمي الانتقالات الصريحة لحالات المخزون والدفع والطلب اتساق المتغيرات وتمنع التغييرات غير المصرح بها من المتصفح.",
        "تحمي الاستعلامات الآمنة والحماية من الحقن وحجب الحقول الخاصة وحفظ الأسرار خارج الواجهة بيانات العملاء والأعمال.",
      ]),
      protectionGroup("stabilityRecovery", [
        "Centralized errors, structured logging, health checks and API performance monitoring make checkout and tracking faults visible quickly.",
        "Database resilience, indexed order queries, timeouts, controlled retries, graceful shutdown and backup procedures keep one failed request from interrupting the whole store.",
      ], [
        "تجعل الأخطاء المركزية والسجلات المنظمة وفحوص الصحة ومراقبة أداء API أعطال الدفع والتتبع ظاهرة بسرعة.",
        "تحافظ مرونة قاعدة البيانات وفهرسة استعلامات الطلبات والمهل والمحاولات المنضبطة والإغلاق الآمن والنسخ الاحتياطية على المتجر من تأثره بطلب واحد متعثر.",
      ]),
    ],
  ),
  davinto: currentSecurityContent(
    "Davinto protects bilingual customer, order and payment workflows across account, guest tracking and Paymob interactions. Controlled token lifecycles, server-side totals and a hardened image-upload path keep private commerce operations separate from the public fashion storefront.",
    "يحمي Davinto بيانات العملاء والطلبات والمدفوعات باللغتين عبر الحساب وتتبع الضيف والتعامل مع Paymob. وتحافظ دورة الرموز المنضبطة والإجماليات المحسوبة على الخادم ومسار رفع الصور المحمي على فصل عمليات التجارة الخاصة عن واجهة الأزياء العامة.",
    [
      protectionGroup("accessAuthorization", [
        "Customer authentication uses protected routes, server-side roles, order ownership and restricted administrator endpoints.",
        "Access and refresh tokens follow controlled issue, renewal and expiry lifecycles, with limited login attempts and neutral authentication errors.",
        "Guest tracking returns only the order details permitted by its lookup, while customer records remain separated in both English and Arabic flows.",
      ], [
        "تستخدم مصادقة العملاء مسارات محمية وأدوارًا مفحوصة على الخادم وملكية للطلبات ونقاط إدارة مقيدة.",
        "تتبع رموز الوصول والتجديد دورة منضبطة للإصدار والتجديد والانتهاء، مع تقييد محاولات الدخول ورسائل مصادقة محايدة.",
        "يعرض تتبع الضيف تفاصيل الطلب المسموح بها فقط، بينما تظل سجلات العملاء منفصلة في المسارين العربي والإنجليزي.",
      ]),
      protectionGroup("requestAbuse", [
        "Authentication, guest tracking, order submission, checkout and payment retry limits reduce automated abuse and repeated payment attempts.",
        "Server-side validation, allowlists, payload limits and duplicate-order controls reject malformed or replayed requests before database or payment work.",
      ], [
        "تقلل حدود المصادقة وتتبع الضيف وإرسال الطلب والدفع وإعادة محاولة السداد الإساءة الآلية ومحاولات الدفع المتكررة.",
        "يرفض التحقق على الخادم والقوائم المسموح بها وحدود حجم الطلب وضوابط تكرار الطلبات البيانات غير الصحيحة أو المعاد إرسالها قبل قاعدة البيانات أو بوابة الدفع.",
      ]),
      protectionGroup("browserTransport", [
        "HTTPS, strict transport settings, controlled origins, security headers and compatible content policies protect bilingual storefront and payment traffic.",
        "Clickjacking and content-type protection, controlled private-endpoint access and safe production errors reduce browser exposure without leaking account or payment details.",
      ], [
        "تحمي اتصالات HTTPS وإعدادات النقل الصارمة والمصادر المحددة وترويسات الأمان وسياسات المحتوى المتوافقة حركة المتجر والدفع باللغتين.",
        "تقلل حماية التضمين الاحتيالي ونوع المحتوى وضبط الوصول للنقاط الخاصة ورسائل التشغيل الآمنة مخاطر المتصفح من دون تسريب تفاصيل الحساب أو الدفع.",
      ]),
      protectionGroup("dataBusiness", [
        "Product prices, delivery fees, discounts and final totals are calculated and rechecked on the server before payment status can change.",
        "Paymob results use controlled payment-state handling, order ownership checks and replay protection instead of trusting browser values.",
        "Safe queries, injection protection, private-field filtering and secrets outside frontend code protect bilingual customer and order data.",
      ], [
        "تُحسب أسعار المنتجات ورسوم التوصيل والخصومات والإجماليات النهائية وتُراجع على الخادم قبل تغيير حالة الدفع.",
        "تستخدم نتائج Paymob معالجة منضبطة لحالة الدفع وفحوص ملكية الطلب والحماية من إعادة الإرسال بدلًا من الثقة في قيم المتصفح.",
        "تحمي الاستعلامات الآمنة والحماية من الحقن وحجب الحقول الخاصة وحفظ الأسرار خارج الواجهة بيانات العملاء والطلبات باللغتين.",
      ]),
      protectionGroup("uploadSecurity", [
        "Uploads require an authenticated, authorized administrator and are rate-limited; allowed image extensions and the real file type are both validated.",
        "File-size and image-dimension limits reject oversized files, while malformed-image checks and malware or suspicious-file scanning block unsafe content.",
        "Generated filenames and storage outside executable application paths prevent uploaded names or files from becoming application code.",
        "Cloudinary access uses restricted configuration, and image re-encoding plus metadata removal or control reduces hidden or unnecessary file data.",
      ], [
        "يتطلب رفع الصور مسؤولًا مسجلًا ومصرحًا له ويخضع لحدود معدل الطلب، كما يتم التحقق من امتداد الصورة ونوع الملف الحقيقي معًا.",
        "ترفض حدود حجم الملف وأبعاد الصورة الملفات الكبيرة، بينما تمنع فحوص الصور التالفة ومسح البرمجيات الضارة أو الملفات المشبوهة المحتوى غير الآمن.",
        "تمنع أسماء الملفات المولدة والتخزين خارج مسارات التطبيق القابلة للتنفيذ تحول اسم الملف أو محتواه إلى جزء من كود التطبيق.",
        "يستخدم Cloudinary إعدادات محدودة، وتقلل إعادة ترميز الصور وإزالة البيانات الوصفية أو ضبطها البيانات الخفية وغير الضرورية.",
      ]),
      protectionGroup("stabilityRecovery", [
        "Centralized errors, structured application and security logs, health checks, uptime monitoring and API performance monitoring surface store and payment faults early.",
        "Paymob, Cloudinary and notification calls use external-service timeouts, controlled retries and safe fallbacks so one provider failure stays contained.",
        "Database connection handling, indexed queries, graceful shutdown, hosting recovery and backup and restoration procedures support reliable recovery.",
      ], [
        "تكشف معالجة الأخطاء المركزية وسجلات التطبيق والأمان المنظمة وفحوص الصحة ومراقبة التوافر وأداء API أعطال المتجر والدفع مبكرًا.",
        "تستخدم اتصالات Paymob وCloudinary والإشعارات مهلًا للخدمات الخارجية ومحاولات منضبطة وبدائل آمنة حتى يظل عطل مزود واحد محتوى.",
        "تدعم معالجة اتصال قاعدة البيانات وفهرسة الاستعلامات والإغلاق الآمن وتعافي الاستضافة وإجراءات النسخ والاستعادة التعافي الموثوق.",
      ]),
    ],
  ),
  "salah-frame": currentSecurityContent(
    "Salah Frame validates every customization before it reaches checkout. Controlled sizing, framing, bundle and pricing rules protect the requested configuration, while Shopify and payment steps remain separated from public customization forms and private customer information.",
    "يتحقق Salah Frame من كل تخصيص قبل وصوله إلى الدفع. وتحمي قواعد المقاسات والتأطير والباقات والتسعير المنضبطة التكوين المطلوب، بينما تظل خطوات Shopify والدفع منفصلة عن نماذج التخصيص العامة ومعلومات العملاء الخاصة.",
    [
      protectionGroup("accessAuthorization", [
        "Customer checkout information and store administration remain separated from the public catalog, with server-side authorization on restricted operations.",
        "Ownership checks protect customer customization and order records, while management access is limited to authorized store staff.",
      ], [
        "تظل معلومات دفع العميل وإدارة المتجر منفصلة عن الكتالوج العام، مع فحص الصلاحيات على الخادم للعمليات المقيدة.",
        "تحمي فحوص الملكية سجلات تخصيص العميل وطلباته، ويقتصر وصول الإدارة على موظفي المتجر المصرح لهم.",
      ]),
      protectionGroup("requestAbuse", [
        "Sizes, frame options, customization text and bundle-builder selections are validated and sanitized before order preparation.",
        "Customization and checkout rate limits, request-size controls, malformed-request rejection and duplicate-submission protection reduce form and purchase abuse.",
      ], [
        "يتم التحقق من المقاسات وخيارات الإطار ونصوص التخصيص واختيارات منشئ الباقات وتنقيتها قبل تجهيز الطلب.",
        "تقلل حدود معدل التخصيص والدفع وحجم الطلب ورفض البيانات غير الصحيحة وحماية التكرار إساءة استخدام النماذج والشراء.",
      ]),
      protectionGroup("browserTransport", [
        "HTTPS, controlled origins, strict transport and security headers protect customer customization and checkout traffic.",
        "Safe public errors, clickjacking and content-type protection keep platform and payment details out of public responses.",
      ], [
        "تحمي اتصالات HTTPS والمصادر المحددة والنقل الصارم وترويسات الأمان بيانات التخصيص والدفع.",
        "تُبقي رسائل الخطأ العامة الآمنة وحماية التضمين الاحتيالي ونوع المحتوى تفاصيل المنصة والدفع خارج الاستجابات العامة.",
      ]),
      protectionGroup("dataBusiness", [
        "Variant, framing and customization prices, bundle savings and final totals are controlled and checked before the Shopify checkout step.",
        "Shopify checkout and platform payment status remain separated from the storefront, while payment and deposit instructions use controlled, authorized content.",
        "Protected records, safe queries and private-field filtering keep customer contact and customization details out of public product data.",
      ], [
        "تُضبط أسعار المتغيرات والتأطير والتخصيص ووفورات الباقات والإجماليات وتُراجع قبل الانتقال إلى دفع Shopify.",
        "تظل حالة دفع Shopify والمنصة منفصلة عن واجهة المتجر، وتستخدم تعليمات السداد والعربون محتوى منضبطًا ومصرحًا به.",
        "تُبقي السجلات المحمية والاستعلامات الآمنة وحجب الحقول الخاصة بيانات التواصل والتخصيص خارج بيانات المنتجات العامة.",
      ]),
      protectionGroup("stabilityRecovery", [
        "Centralized errors, structured logs, health checks and monitoring show where customization or checkout requests fail without exposing internal details.",
        "Platform and notification timeouts, controlled retries, database failure handling and safe fallbacks keep a non-critical service issue from losing a valid customization request.",
        "Backups, restoration procedures and hosting recovery support continuity for order and customization records.",
      ], [
        "توضح الأخطاء المركزية والسجلات المنظمة وفحوص الصحة والمراقبة موضع تعثر التخصيص أو الدفع من دون كشف التفاصيل الداخلية.",
        "تمنع مهل المنصة والإشعارات والمحاولات المنضبطة ومعالجة قاعدة البيانات والبدائل الآمنة ضياع طلب تخصيص صحيح بسبب خدمة غير أساسية.",
        "تدعم النسخ الاحتياطية وإجراءات الاستعادة وتعافي الاستضافة استمرارية سجلات الطلبات والتخصيص.",
      ]),
    ],
  ),
  "fresh-cart": currentSecurityContent(
    "Fresh Cart protects a high-volume grocery catalog with validation at product, inventory, cart and order level. Server-calculated totals and promotion rules preserve consistency, while indexed data access and monitored services keep repeat shopping responsive and contained during failures.",
    "يحمي Fresh Cart كتالوج بقالة كبيرًا عبر التحقق من المنتجات والمخزون والسلة والطلبات. وتحافظ الإجماليات والعروض المحسوبة على الخادم على الاتساق، بينما تبقي الفهارس والمراقبة التسوق المتكرر سريعًا وتحت السيطرة عند حدوث عطل.",
    [
      protectionGroup("accessAuthorization", [
        "Customer and administrator routes use server-side roles and order ownership checks, so shoppers see only their own order history and management endpoints remain restricted.",
        "Hashed passwords, controlled sessions, login limits and separated public, customer and administrator areas protect account data.",
      ], [
        "تستخدم مسارات العملاء والإدارة أدوارًا وفحوص ملكية الطلب على الخادم، فلا يرى المتسوق إلا سجل طلباته وتظل نقاط الإدارة مقيدة.",
        "تحمي كلمات المرور المجزأة والجلسات المنضبطة وحدود الدخول وفصل المناطق العامة ومناطق العملاء والإدارة بيانات الحسابات.",
      ]),
      protectionGroup("requestAbuse", [
        "High-volume catalog, cart and order payloads are validated and size-limited before database operations.",
        "Checkout and order-submission limits, promotion controls and duplicate-purchase protection reduce automated or repeated buying abuse.",
        "Malformed products, invalid quantities and inconsistent inventory requests are rejected before an order is accepted.",
      ], [
        "يتم التحقق من بيانات الكتالوج الكبير والسلة والطلبات وتحديد حجمها قبل عمليات قاعدة البيانات.",
        "تقلل حدود الدفع وإرسال الطلبات وضوابط العروض وحماية تكرار الشراء الإساءة الآلية أو المتكررة.",
        "تُرفض المنتجات غير الصحيحة والكميات غير المقبولة وطلبات المخزون غير المتسقة قبل قبول الطلب.",
      ]),
      protectionGroup("browserTransport", [
        "HTTPS, strict transport, controlled origins and security headers protect account and checkout traffic across the grocery storefront.",
        "Clickjacking and content-type protection, safe public errors and controlled private-endpoint access reduce browser exposure.",
      ], [
        "تحمي اتصالات HTTPS والنقل الصارم والمصادر المحددة وترويسات الأمان بيانات الحساب والدفع عبر متجر البقالة.",
        "تقلل حماية التضمين الاحتيالي ونوع المحتوى ورسائل الخطأ العامة الآمنة وضبط الوصول للنقاط الخاصة مخاطر المتصفح.",
      ]),
      protectionGroup("dataBusiness", [
        "Prices, promotions and final totals are calculated and checked on the server, with inventory consistency verified before order completion.",
        "Explicit order states, ownership validation, safe queries, injection protection and restricted private fields protect purchase and customer data.",
      ], [
        "تُحسب الأسعار والعروض والإجماليات النهائية وتُراجع على الخادم، مع التحقق من اتساق المخزون قبل إكمال الطلب.",
        "تحمي حالات الطلب الصريحة وفحوص الملكية والاستعلامات الآمنة والحماية من الحقن وحجب الحقول الخاصة بيانات الشراء والعملاء.",
      ]),
      protectionGroup("stabilityRecovery", [
        "Important catalog, inventory and order queries are indexed, while API performance and uptime monitoring surface slow or failing paths.",
        "Centralized errors, database connection handling, timeouts, controlled retries and graceful shutdown stop one failed request from affecting the full catalog.",
        "Structured logs, health checks, backups and restoration procedures support recovery, with safe fallback for non-critical notifications.",
      ], [
        "تُفهرس استعلامات الكتالوج والمخزون والطلبات المهمة، بينما تكشف مراقبة أداء API والتوافر المسارات البطيئة أو المتعثرة.",
        "تمنع الأخطاء المركزية ومعالجة اتصال قاعدة البيانات والمهل والمحاولات المنضبطة والإغلاق الآمن طلبًا واحدًا متعثرًا من التأثير في الكتالوج كله.",
        "تدعم السجلات المنظمة وفحوص الصحة والنسخ الاحتياطية وإجراءات الاستعادة التعافي، مع بديل آمن للإشعارات غير الأساسية.",
      ]),
    ],
  ),
  travco: currentSecurityContent(
    "Travco keeps public package discovery separate from private booking enquiries and customer reservation history. Validated forms, customer-specific visibility and controlled booking states protect traveler information, while monitored services and production logging help contain failures.",
    "يفصل Travco استكشاف الباقات العامة عن استفسارات الحجز الخاصة وسجل حجوزات العميل. وتحمي النماذج المتحقق منها والرؤية الخاصة بكل عميل وحالات الحجز المنضبطة معلومات المسافر، بينما تساعد المراقبة وسجلات التشغيل على احتواء الأعطال.",
    [
      protectionGroup("accessAuthorization", [
        "Customer booking history and administrator operations use server-side authorization, role checks and booking ownership validation.",
        "Each customer sees only their own reservations, while enquiry records and booking-management endpoints remain restricted to authorized staff.",
      ], [
        "يستخدم سجل حجوزات العميل وعمليات الإدارة فحوص الصلاحيات والأدوار وملكية الحجز على الخادم.",
        "لا يرى كل عميل إلا حجوزاته، بينما تظل سجلات الاستفسارات ونقاط إدارة الحجز مقيدة بالموظفين المصرح لهم.",
      ]),
      protectionGroup("requestAbuse", [
        "Booking enquiries, contact messages and reservation data are validated and sanitized before database operations.",
        "Booking and contact-form rate limits, payload controls and honeypot fields reduce repeated submissions and automated spam.",
        "Duplicate-request protection and controlled booking states prevent the same reservation from progressing twice.",
      ], [
        "يتم التحقق من استفسارات الحجز ورسائل التواصل وبيانات الحجز وتنقيتها قبل عمليات قاعدة البيانات.",
        "تقلل حدود معدل الحجز ونماذج التواصل وحجم الطلب وحقول المصيدة الإرسال المتكرر والرسائل الآلية.",
        "تمنع حماية التكرار وحالات الحجز المنضبطة تقدم الحجز نفسه مرتين.",
      ]),
      protectionGroup("browserTransport", [
        "HTTPS, strict transport, controlled origins and security headers protect booking and contact data in transit.",
        "Clickjacking and content-type protection, compatible content policies and safe production errors reduce browser risk without exposing reservation details.",
      ], [
        "تحمي اتصالات HTTPS والنقل الصارم والمصادر المحددة وترويسات الأمان بيانات الحجز والتواصل أثناء انتقالها.",
        "تقلل حماية التضمين الاحتيالي ونوع المحتوى وسياسات المحتوى المتوافقة ورسائل التشغيل الآمنة مخاطر المتصفح من دون كشف تفاصيل الحجز.",
      ]),
      protectionGroup("dataBusiness", [
        "Package and reservation data use server-side validation, explicit booking-state transitions and ownership checks before private records are returned or changed.",
        "Safe database queries, injection protection, restricted private fields and secrets outside frontend code protect traveler and enquiry information.",
      ], [
        "تستخدم بيانات الباقات والحجوزات تحققًا على الخادم وانتقالات صريحة للحالة وفحوص ملكية قبل عرض السجلات الخاصة أو تغييرها.",
        "تحمي استعلامات قاعدة البيانات الآمنة والحماية من الحقن وحجب الحقول الخاصة وحفظ الأسرار خارج الواجهة معلومات المسافرين والاستفسارات.",
      ]),
      protectionGroup("stabilityRecovery", [
        "Centralized errors, structured production and security logs, health checks, uptime monitoring and API monitoring reveal booking-service faults early.",
        "Database and external-service failures use timeouts, controlled retries and safe notification fallbacks so a message outage does not remove a valid enquiry.",
        "Graceful shutdown, indexed booking queries, hosting recovery, backups and restoration procedures support stable reservation operations.",
      ], [
        "تكشف الأخطاء المركزية وسجلات التشغيل والأمان المنظمة وفحوص الصحة ومراقبة التوافر وAPI أعطال خدمة الحجز مبكرًا.",
        "تستخدم أعطال قاعدة البيانات والخدمات الخارجية مهلًا ومحاولات منضبطة وبدائل آمنة للإشعارات، فلا يؤدي تعثر الرسائل إلى حذف استفسار صحيح.",
        "يدعم الإغلاق الآمن وفهرسة استعلامات الحجز وتعافي الاستضافة والنسخ الاحتياطية وإجراءات الاستعادة استقرار عمليات الحجز.",
      ]),
    ],
  ),
  byjojo: currentSecurityContent(
    "ByJojo separates customer accounts and order history from its public home-linen catalog. Product, cart, checkout, bundle and upsell rules are validated on the server, while monitored database and API handling protect the customer journey when a service fails.",
    "يفصل ByJojo حسابات العملاء وسجل الطلبات عن كتالوج المفروشات العام. ويتم التحقق من قواعد المنتجات والسلة والدفع والباقات والمنتجات الإضافية على الخادم، بينما تحمي مراقبة قاعدة البيانات وAPI رحلة العميل عند تعثر خدمة.",
    [
      protectionGroup("accessAuthorization", [
        "Customer and administrator access uses protected routes, server-side roles and order ownership checks.",
        "Customers can open only their own order history, while catalog and order-management endpoints remain restricted to authorized administrators.",
        "Hashed passwords, controlled sessions, login limits and separated public and private areas protect account data.",
      ], [
        "يستخدم وصول العملاء والإدارة مسارات محمية وأدوارًا على الخادم وفحوص ملكية الطلب.",
        "لا يستطيع العميل فتح إلا سجل طلباته، بينما تظل نقاط إدارة الكتالوج والطلبات مقيدة بالمسؤولين المصرح لهم.",
        "تحمي كلمات المرور المجزأة والجلسات المنضبطة وحدود الدخول وفصل المناطق العامة والخاصة بيانات الحساب.",
      ]),
      protectionGroup("requestAbuse", [
        "Products, cart lines, checkout details, bundles and upsells are validated before database or order operations.",
        "Login and order-submission limits, payload controls, malformed-request rejection and duplicate-order protection reduce automated and repeated abuse.",
      ], [
        "يتم التحقق من المنتجات وعناصر السلة وبيانات الدفع والباقات والمنتجات الإضافية قبل عمليات قاعدة البيانات أو الطلب.",
        "تقلل حدود الدخول وإرسال الطلبات وحجم البيانات ورفض الطلبات غير الصحيحة وحماية التكرار الإساءة الآلية والمتكررة.",
      ]),
      protectionGroup("browserTransport", [
        "HTTPS, strict transport, controlled origins and security headers protect account and checkout data.",
        "Safe production errors, clickjacking and content-type protection and controlled private-endpoint access reduce common browser exposure.",
      ], [
        "تحمي اتصالات HTTPS والنقل الصارم والمصادر المحددة وترويسات الأمان بيانات الحساب والدفع.",
        "تقلل رسائل التشغيل الآمنة وحماية التضمين الاحتيالي ونوع المحتوى وضبط الوصول للنقاط الخاصة مخاطر المتصفح الشائعة.",
      ]),
      protectionGroup("dataBusiness", [
        "Product prices, bundle values, upsells and final order totals are calculated and checked on the server.",
        "Explicit order states, protected records, safe queries, injection protection and private-field filtering keep customer data separated from the public catalog.",
      ], [
        "تُحسب أسعار المنتجات وقيم الباقات والمنتجات الإضافية وإجماليات الطلب وتُراجع على الخادم.",
        "تُبقي حالات الطلب الصريحة والسجلات المحمية والاستعلامات الآمنة والحماية من الحقن وحجب الحقول الخاصة بيانات العميل منفصلة عن الكتالوج العام.",
      ]),
      protectionGroup("stabilityRecovery", [
        "Centralized errors, structured logs, health checks and uptime and API monitoring make order and checkout issues visible quickly.",
        "Database connection handling, indexed order queries, timeouts, controlled retries, graceful shutdown and backup procedures contain isolated failures.",
        "Non-critical email or notification failures use safe fallbacks without cancelling a valid customer order.",
      ], [
        "تجعل الأخطاء المركزية والسجلات المنظمة وفحوص الصحة ومراقبة التوافر وAPI مشكلات الطلب والدفع ظاهرة بسرعة.",
        "تحتوي معالجة اتصال قاعدة البيانات وفهرسة استعلامات الطلبات والمهل والمحاولات المنضبطة والإغلاق الآمن والنسخ الاحتياطية الأعطال المعزولة.",
        "تستخدم أعطال البريد أو الإشعارات غير الأساسية بدائل آمنة من دون إلغاء طلب عميل صحيح.",
      ]),
    ],
  ),
  "ms-store": currentSecurityContent(
    "MS Store protects guest tracking and private order data without making the public lookup reveal more than a shopper needs. Server-calculated totals, administrator restrictions and monitored failure handling keep orders consistent while limiting repeated tracking and login attempts.",
    "يحمي MS Store تتبع الضيف وبيانات الطلب الخاصة من دون أن يكشف البحث العام أكثر مما يحتاجه المتسوق. وتحافظ الإجماليات المحسوبة على الخادم وقيود الإدارة ومراقبة الأعطال على اتساق الطلبات مع الحد من محاولات التتبع والدخول المتكررة.",
    [
      protectionGroup("accessAuthorization", [
        "Administrator routes use server-side authorization and restricted management endpoints, while customer accounts use controlled sessions and protected order access.",
        "Guest orders use difficult-to-guess tracking identifiers, ownership-aware responses and limited fields so a lookup does not expose private customer data.",
        "Password hashing, login limits and neutral authentication errors protect accounts without confirming whether a customer exists.",
      ], [
        "تستخدم مسارات الإدارة فحوص الصلاحيات على الخادم ونقاط إدارة مقيدة، بينما تستخدم حسابات العملاء جلسات منضبطة ووصولًا محميًا للطلبات.",
        "تستخدم طلبات الضيف معرفات تتبع صعبة التخمين واستجابات تراعي الملكية وحقولًا محدودة، فلا يكشف البحث بيانات العميل الخاصة.",
        "تحمي تجزئة كلمات المرور وحدود الدخول ورسائل المصادقة المحايدة الحسابات من دون تأكيد وجود العميل.",
      ]),
      protectionGroup("requestAbuse", [
        "Tracking and login rate limits reduce guessing and repeated lookups, while request-size controls reject oversized submissions.",
        "Products, carts and orders are validated before database work, with malformed-request rejection and duplicate-order protection.",
      ], [
        "تقلل حدود معدل التتبع والدخول تخمين المعرفات وعمليات البحث المتكررة، بينما ترفض حدود الحجم الطلبات الكبيرة.",
        "يتم التحقق من المنتجات والسلال والطلبات قبل قاعدة البيانات، مع رفض البيانات غير الصحيحة وحماية تكرار الطلب.",
      ]),
      protectionGroup("browserTransport", [
        "HTTPS, strict transport, controlled origins and security headers protect login, checkout and tracking traffic.",
        "Safe public errors, clickjacking and content-type protection ensure tracking responses do not expose internal or private details.",
      ], [
        "تحمي اتصالات HTTPS والنقل الصارم والمصادر المحددة وترويسات الأمان حركة الدخول والدفع والتتبع.",
        "تضمن رسائل الخطأ العامة الآمنة وحماية التضمين الاحتيالي ونوع المحتوى ألا تكشف استجابات التتبع تفاصيل داخلية أو خاصة.",
      ]),
      protectionGroup("dataBusiness", [
        "Prices, shipping and final totals are calculated and checked on the server before an order is accepted.",
        "Order states and tracking visibility are controlled, with safe queries, injection protection, private-field filtering and secrets outside frontend code.",
      ], [
        "تُحسب الأسعار والشحن والإجماليات النهائية وتُراجع على الخادم قبل قبول الطلب.",
        "تُضبط حالات الطلب وبيانات التتبع الظاهرة، مع استعلامات آمنة وحماية من الحقن وحجب للحقول الخاصة وحفظ الأسرار خارج الواجهة.",
      ]),
      protectionGroup("stabilityRecovery", [
        "Centralized errors, structured logs, health checks and API monitoring keep safe public feedback available when tracking or checkout fails.",
        "Database connection handling, indexed tracking queries, timeouts, controlled retries and hosting recovery keep one failed request from interrupting the store.",
        "Backups and restoration procedures support recovery of private order records.",
      ], [
        "تُبقي الأخطاء المركزية والسجلات المنظمة وفحوص الصحة ومراقبة API رسائل عامة آمنة متاحة عند تعثر التتبع أو الدفع.",
        "تحافظ معالجة اتصال قاعدة البيانات وفهرسة استعلامات التتبع والمهل والمحاولات المنضبطة وتعافي الاستضافة على المتجر من تأثره بطلب واحد متعثر.",
        "تدعم النسخ الاحتياطية وإجراءات الاستعادة استرجاع سجلات الطلبات الخاصة.",
      ]),
    ],
  ),
};

Object.entries(securityOverrides).forEach(([slug, security]) => {
  caseStudyDetails[slug].security = security;
});

const qualityOverrides = {
  "fresh-cart": {
    experience: topic(
      "Fresh Cart is built for fast grocery discovery across a 628-product launch catalog. Category-led browsing, concise product details, bundles, cart, checkout, and order history keep the mobile shopping path short while making repeat ordering easy to understand.",
      ["Grocery-first category browsing", "Fast product discovery on mobile", "Bundles, checkout, and repeat-order paths"],
      "صُمم Fresh Cart لاكتشاف البقالة بسرعة عبر كتالوج إطلاق يضم 628 منتجًا. يختصر التصفح حسب التصنيف وتفاصيل المنتجات والباقات والسلة والدفع وسجل الطلبات مسار التسوق على الهاتف، مع تسهيل فهم إعادة الطلب.",
      ["تصفح تصنيفات مناسب للبقالة", "اكتشاف سريع للمنتجات على الهاتف", "مسارات للباقات والدفع وإعادة الطلب"],
    ),
    performance: topic(
      "The large grocery catalog remains practical through focused category and product routes rather than one overloaded listing. The measured results show strong mobile use and fast rendering while preserving a direct path from everyday browsing to checkout.",
      ["Responsive catalog built for 628 products", "Focused category and product routes", "Measured speed across mobile and desktop"],
      "يظل كتالوج البقالة الكبير عمليًا عبر مسارات مركزة للتصنيفات والمنتجات بدلًا من قائمة واحدة مزدحمة. وتوضح النتائج المقاسة استخدامًا قويًا للهاتف وسرعة عرض مع الحفاظ على مسار مباشر من التصفح اليومي إلى الدفع.",
      ["كتالوج متجاوب يستوعب 628 منتجًا", "مسارات مركزة للتصنيفات والمنتجات", "سرعة مقاسة على الهاتف والحاسوب"],
    ),
    security: topic(
      "Customer account and order areas are separated from public grocery browsing, with validation around cart, checkout, and order workflows. Customer-specific order visibility and resilient request handling support a dependable experience without making unsupported certification claims.",
      ["Protected customer order areas", "Validated cart and checkout flow", "Separated public and account functions"],
      "تُفصل مناطق حساب العميل والطلبات عن تصفح البقالة العام، مع التحقق من بيانات السلة والدفع والطلب. وتدعم رؤية كل عميل لطلباته ومعالجة أخطاء الطلبات تجربة موثوقة دون ادعاءات شهادات غير موثقة.",
      ["مناطق محمية لطلبات العملاء", "التحقق من السلة والدفع", "فصل الوظائف العامة عن الحساب"],
    ),
    operations: topic(
      "The commerce-management model keeps catalog and category maintenance connected to order processing. Bundle support and repeat-order patterns help the owner maintain a high-volume grocery assortment without creating a separate workflow for every collection.",
      ["Catalog and category maintenance", "Order-processing workflow", "Bundle and repeat-order support"],
      "يربط نموذج إدارة المتجر صيانة الكتالوج والتصنيفات بمعالجة الطلبات. ويساعد دعم الباقات وأنماط إعادة الطلب المالك في إدارة تشكيلة بقالة كبيرة دون إنشاء مسار منفصل لكل مجموعة.",
      ["صيانة الكتالوج والتصنيفات", "مسار لمعالجة الطلبات", "دعم الباقات وإعادة الطلب"],
    ),
    growth: topic(
      "A launch inventory of 628 products proves the category structure can carry meaningful catalog depth from day one. Reusable product, bundle, and account patterns leave clear room for new grocery ranges, discovery tools, and repeat-purchase features.",
      ["Expandable grocery categories", "Reusable bundle and account patterns"],
      "يثبت كتالوج الإطلاق المكون من 628 منتجًا قدرة هيكل التصنيفات على استيعاب عمق فعلي منذ اليوم الأول. وتتيح أنماط المنتجات والباقات والحسابات القابلة لإعادة الاستخدام إضافة أقسام وأدوات اكتشاف وخصائص لإعادة الشراء.",
      ["تصنيفات بقالة قابلة للتوسع", "أنماط قابلة لإعادة الاستخدام للباقات والحسابات"],
    ),
  },
  travco: {
    experience: topic(
      "Travco adapts a familiar commerce journey into a travel-booking flow for eight packages. Visitors compare packages, review package details, submit a booking request, create an account, and return to their bookings without treating travel as a physical-product purchase.",
      ["Package-led travel discovery", "Focused booking-request flow", "Customer booking history"],
      "يحوّل Travco رحلة التجارة المعتادة إلى مسار حجز سفر لثماني باقات. يقارن الزائر الباقات ويقرأ تفاصيلها ويرسل طلب الحجز وينشئ حسابًا ثم يعود إلى حجوزاته دون التعامل مع السفر كمنتج مادي.",
      ["اكتشاف سفر تقوده الباقات", "مسار مركز لطلب الحجز", "سجل حجوزات العميل"],
    ),
    performance: topic(
      "Package discovery and booking requests use focused routes so destination detail does not compete with account or reservation tasks. The measured Lighthouse, LCP, uptime, and API results keep the booking journey responsive across the devices travelers use most.",
      ["Focused package-detail routes", "Lean booking-request steps", "Measured mobile and API performance"],
      "تستخدم الباقات وطلبات الحجز مسارات مركزة حتى لا تتنافس تفاصيل الوجهة مع مهام الحساب أو الحجز. وتحافظ نتائج Lighthouse وLCP والتوافر واستجابة API المقاسة على سرعة رحلة الحجز عبر أجهزة المسافرين.",
      ["مسارات مركزة لتفاصيل الباقة", "خطوات مختصرة لطلب الحجز", "أداء مقاس للهاتف وواجهة API"],
    ),
    security: topic(
      "Account areas keep booking records customer-specific, while booking requests are validated before they enter the reservation workflow. Public package content, customer bookings, and operational handling remain separated, with resilient API feedback when a request cannot be completed.",
      ["Customer-specific booking visibility", "Validated booking requests", "Separated public and reservation functions"],
      "تحافظ مناطق الحساب على خصوصية سجلات الحجز لكل عميل، وتُراجع بيانات طلب الحجز قبل دخوله مسار الحجز. وتظل محتويات الباقات العامة وحجوزات العملاء والمعالجة التشغيلية منفصلة مع استجابة واضحة عند تعذر الطلب.",
      ["عرض الحجوزات الخاصة بكل عميل", "التحقق من طلبات الحجز", "فصل الوظائف العامة عن الحجوزات"],
    ),
    operations: topic(
      "The operational model treats packages as travel offers and orders as bookings or reservations. Package maintenance, qualified enquiries, reservation status, and customer booking records give the team a clear path from first request to confirmed travel.",
      ["Travel-package management", "Qualified booking enquiries", "Reservation and customer records"],
      "يتعامل النموذج التشغيلي مع الباقات كعروض سفر ومع الطلبات كحجوزات. وتمنح إدارة الباقات والاستفسارات المؤهلة وحالة الحجز وسجلات العملاء الفريق مسارًا واضحًا من الطلب الأول إلى السفر المؤكد.",
      ["إدارة باقات السفر", "استفسارات حجز مؤهلة", "سجلات الحجوزات والعملاء"],
    ),
    growth: topic(
      "The eight-package launch inventory uses repeatable package-detail and booking patterns that can support more destinations and seasonal offers. New travel categories can extend the same reservation model without rebuilding the core customer journey.",
      ["Reusable package-detail model", "Room for destinations and seasonal offers"],
      "يستخدم كتالوج الإطلاق المكون من 8 باقات أنماطًا قابلة لإعادة الاستخدام لتفاصيل الباقات والحجز، بما يدعم وجهات وعروضًا موسمية إضافية. ويمكن لفئات السفر الجديدة توسيع نموذج الحجز نفسه دون إعادة بناء رحلة العميل الأساسية.",
      ["نموذج قابل لإعادة الاستخدام لتفاصيل الباقة", "مساحة لوجهات وعروض موسمية جديدة"],
    ),
  },
  byjojo: {
    experience: topic(
      "ByJojo presents bedding and table linen through a warm, home-focused shopping journey. Customers can move from the shop into material-aware product details, cart, checkout, and order history while responsive layouts keep textile imagery and purchasing actions balanced on mobile.",
      ["Bedding and table-linen discovery", "Material-aware product details", "Responsive checkout and order journey"],
      "يعرض ByJojo المفروشات ومفارش المائدة عبر رحلة تسوق دافئة تركز على المنزل. ينتقل العميل من المتجر إلى تفاصيل المنتج المرتبطة بالخامة ثم السلة والدفع وسجل الطلبات، مع توازن الصور وإجراءات الشراء على الهاتف.",
      ["اكتشاف المفروشات ومفارش المائدة", "تفاصيل منتجات تراعي الخامة", "رحلة متجاوبة للدفع والطلبات"],
    ),
    performance: topic(
      "Product imagery remains prominent without slowing the route from textile discovery to purchase. The measured mobile share, Lighthouse scores, LCP, uptime, and API response show the storefront performing under real shopping use rather than a demo-only catalog.",
      ["Optimized textile presentation", "Focused product-to-checkout route", "Measured storefront performance"],
      "تظل صور المنتجات بارزة دون إبطاء المسار من اكتشاف المنسوجات إلى الشراء. وتوضح حصة الهاتف ونتائج Lighthouse وLCP والتوافر واستجابة API أداء المتجر تحت استخدام تسوق فعلي لا ككتالوج تجريبي فقط.",
      ["عرض محسن للمنسوجات", "مسار مركز من المنتج إلى الدفع", "أداء متجر مقاس فعليًا"],
    ),
    security: topic(
      "Customer account and order routes keep purchase history separate from the public linen catalog. Cart, checkout, and order data follow controlled workflows with customer-specific visibility and clear error handling across the purchase path.",
      ["Protected customer order area", "Controlled cart and checkout flow", "Customer-specific purchase visibility"],
      "تفصل مسارات حساب العميل وطلباته سجل الشراء عن كتالوج المفروشات العام. وتتبع بيانات السلة والدفع والطلب مسارات منضبطة مع رؤية خاصة بكل عميل ومعالجة واضحة للأخطاء.",
      ["منطقة محمية لطلبات العميل", "مسار منضبط للسلة والدفع", "رؤية خاصة بمشتريات كل عميل"],
    ),
    operations: topic(
      "The commerce model keeps the 22-product bedding and table-linen catalog consistent while supporting order processing, bundles, and upsells. Reusable product patterns let the owner update materials, sizes, and room-focused merchandising without fragmented layouts.",
      ["Bedding and linen catalog maintenance", "Order-processing workflow", "Bundle and upsell merchandising"],
      "يحافظ نموذج التجارة على اتساق كتالوج المفروشات ومفارش المائدة المكون من 22 منتجًا مع دعم معالجة الطلبات والباقات والمنتجات الإضافية. وتتيح الأنماط القابلة لإعادة الاستخدام تحديث الخامات والمقاسات والعرض حسب الغرفة.",
      ["صيانة كتالوج المفروشات", "مسار لمعالجة الطلبات", "تنسيق الباقات والمنتجات الإضافية"],
    ),
    growth: topic(
      "The 22-product launch establishes reusable structures for bedding sets, table linen, bundles, and complementary items. The same model can carry new materials, room collections, seasonal ranges, and richer upsell combinations as the catalog expands.",
      ["Expandable room and material collections", "Reusable bundle and upsell model"],
      "يؤسس الإطلاق بـ22 منتجًا هياكل قابلة لإعادة الاستخدام لأطقم المفروشات ومفارش المائدة والباقات والقطع المكملة. ويمكن للنموذج نفسه استيعاب خامات ومجموعات غرف ومواسم وتوليفات إضافية جديدة.",
      ["مجموعات قابلة للتوسع حسب الغرفة والخامة", "نموذج قابل لإعادة الاستخدام للباقات والإضافات"],
    ),
  },
  "ms-store": {
    experience: topic(
      "MS Store organizes an 18-product clothing catalog into a direct route from home and shop to product details, cart, checkout, and guest order tracking. Login and registration support returning shoppers without making the mobile journey feel heavier.",
      ["Clear clothing catalog", "Direct cart and checkout journey", "Account access and guest order tracking"],
      "ينظم MS Store كتالوج ملابس من 18 منتجًا في مسار مباشر من الرئيسية والمتجر إلى التفاصيل والسلة والدفع وتتبع الطلب للضيف. ويدعم تسجيل الدخول وإنشاء الحساب العملاء العائدين دون إثقال تجربة الهاتف.",
      ["كتالوج ملابس واضح", "رحلة مباشرة للسلة والدفع", "حساب عميل وتتبع طلب الضيف"],
    ),
    performance: topic(
      "Reusable product views keep the clothing assortment consistent and limit interface overhead between browsing and checkout. The supplied Lighthouse, LCP, uptime, and API figures provide a measured snapshot of the current store across mobile and desktop.",
      ["Reusable product presentation", "Focused mobile shopping path", "Measured storefront speed"],
      "تحافظ واجهات المنتجات القابلة لإعادة الاستخدام على اتساق تشكيلة الملابس وتقلل عبء الواجهة بين التصفح والدفع. وتقدم أرقام Lighthouse وLCP والتوافر واستجابة API لقطة مقاسة للمتجر على الهاتف والحاسوب.",
      ["عرض منتجات قابل لإعادة الاستخدام", "مسار تسوق مركز على الهاتف", "سرعة متجر مقاسة"],
    ),
    security: topic(
      "Account and checkout flows keep customer activity separate from the public catalog, while safe guest tracking exposes only the order lookup required by the shopper. Validation around cart, checkout, and order states supports predictable handling without claiming unsupported certifications.",
      ["Separated account and public routes", "Safe guest order tracking", "Validated cart and order states"],
      "تفصل مسارات الحساب والدفع نشاط العميل عن الكتالوج العام، بينما يعرض تتبع الضيف بيانات البحث اللازمة للمتسوق فقط. ويدعم التحقق من حالات السلة والدفع والطلب معالجة متوقعة دون ادعاء شهادات غير موثقة.",
      ["فصل مسارات الحساب عن الموقع العام", "تتبع آمن لطلب الضيف", "التحقق من حالات السلة والطلب"],
    ),
    operations: topic(
      "The supplied commerce-management model keeps catalog maintenance, order handling, and customer tracking connected without inventing named admin modules. This gives the owner a practical operating structure while staying faithful to the project information available.",
      ["Catalog maintenance", "Order handling", "Customer order tracking"],
      "يربط نموذج إدارة التجارة المتاح صيانة الكتالوج ومعالجة الطلبات وتتبع العميل دون اختراع وحدات إدارة غير مذكورة. ويمنح ذلك المالك هيكل تشغيل عمليًا ومتوافقًا مع معلومات المشروع المتاحة.",
      ["صيانة الكتالوج", "معالجة الطلبات", "تتبع طلبات العملاء"],
    ),
    growth: topic(
      "The 18-product launch uses repeatable catalog, checkout, account, and tracking patterns. Those foundations can support new clothing categories and larger assortments while preserving the same understandable customer journey.",
      ["Expandable clothing categories", "Reusable checkout and tracking patterns"],
      "يستخدم الإطلاق بـ18 منتجًا أنماطًا متكررة للكتالوج والدفع والحساب والتتبع. ويمكن لهذه الأسس دعم تصنيفات ملابس وتشكيلات أكبر مع الحفاظ على رحلة العميل الواضحة نفسها.",
      ["تصنيفات ملابس قابلة للتوسع", "أنماط قابلة لإعادة الاستخدام للدفع والتتبع"],
    ),
  },
};

Object.entries(qualityOverrides).forEach(([slug, qualities]) => {
  caseStudyDetails[slug].qualities = qualities;
});

const operationsCopyOverrides = {
  zohour: topic(
    "A connected commerce workspace keeps merchandising, fulfillment and customer-service decisions aligned. The owner can respond to catalog and order activity without maintaining the same information in disconnected tools.",
    [],
    "تربط مساحة التجارة الواحدة قرارات العرض والتنفيذ وخدمة العملاء. ويمكن للمالك التعامل مع حركة الكتالوج والطلبات من دون تكرار المعلومات نفسها في أدوات منفصلة.",
    [],
  ),
  "s8-factory": topic(
    "The operational workspace follows a qualified opportunity from its first manufacturing request through scheduling, contracting and production. This production-led structure gives the factory team one traceable record instead of treating the work like a standard online-store order.",
    [],
    "تتابع مساحة التشغيل الفرصة المؤهلة من طلب التصنيع الأول مرورًا بالجدولة والتعاقد وحتى الإنتاج. ويمنح هذا الهيكل القائم على الإنتاج فريق المصنع سجلًا واحدًا قابلًا للتتبع بدلًا من التعامل مع العمل كطلب متجر تقليدي.",
    [],
  ),
  atheer: topic(
    "The administration area connects fragrance merchandising with order and customer activity. This keeps daily store decisions close to the catalog without exposing management work through the public shopping experience.",
    [],
    "تربط منطقة الإدارة عرض العطور بحركة الطلبات والعملاء. وبذلك تظل قرارات المتجر اليومية قريبة من الكتالوج من دون كشف أعمال الإدارة عبر تجربة التسوق العامة.",
    [],
  ),
  akm: topic(
    "AKM's operating model keeps variant merchandising, order progress and campaign activity in one maintainable workflow. The owner can coordinate fashion releases and fulfillment without rebuilding commercial rules in separate tools.",
    [],
    "يجمع نموذج تشغيل AKM عرض المتغيرات وتقدم الطلبات ونشاط الحملات في مسار واحد سهل الصيانة. ويمكن للمالك تنسيق إطلاقات الأزياء والتنفيذ من دون إعادة بناء القواعد التجارية في أدوات منفصلة.",
    [],
  ),
  davinto: topic(
    "Davinto brings catalog, customer, payment and fulfillment activity into a bilingual management workflow. The owner can follow the business in either language while private commercial actions remain within the administration area.",
    [],
    "يجمع Davinto نشاط الكتالوج والعملاء والدفع والتنفيذ في مسار إدارة ثنائي اللغة. ويمكن للمالك متابعة العمل بأي من اللغتين مع بقاء الإجراءات التجارية الخاصة داخل منطقة الإدارة.",
    [],
  ),
  "salah-frame": topic(
    "Salah Frame keeps made-to-order choices connected to the Shopify commerce workflow. The owner receives a clear product configuration for preparation instead of reconciling customization details from separate messages.",
    [],
    "يربط Salah Frame اختيارات المنتجات المصنوعة حسب الطلب بمسار التجارة في Shopify. ويتلقى المالك تكوينًا واضحًا للمنتج من أجل التجهيز بدلًا من جمع تفاصيل التخصيص من رسائل منفصلة.",
    [],
  ),
  "fresh-cart": topic(
    "The operating model is designed for frequent catalog and inventory changes without fragmenting the purchase workflow. Owners can manage everyday grocery demand while repeat customers keep a familiar ordering path.",
    [],
    "صُمم نموذج التشغيل للتعامل مع التغييرات المتكررة في الكتالوج والمخزون من دون تفكيك مسار الشراء. ويمكن للمالك إدارة طلبات البقالة اليومية مع احتفاظ العملاء العائدين بمسار طلب مألوف.",
    [],
  ),
  travco: topic(
    "Travco treats each enquiry as a travel opportunity rather than a product order. The team can move a customer from package interest to a controlled reservation record while keeping public destination content separate from private follow-up.",
    [],
    "يتعامل Travco مع كل استفسار كفرصة سفر لا كطلب منتج. ويمكن للفريق نقل العميل من الاهتمام بالباقة إلى سجل حجز منضبط مع فصل محتوى الوجهات العام عن المتابعة الخاصة.",
    [],
  ),
  byjojo: topic(
    "The commerce workspace keeps home-linen merchandising connected to order preparation and customer history. Reusable product structures let the owner update materials and coordinated sets without creating a different process for every collection.",
    [],
    "تربط مساحة التجارة عرض المفروشات بتجهيز الطلبات وسجل العملاء. وتتيح هياكل المنتجات القابلة لإعادة الاستخدام تحديث الخامات والمجموعات المتناسقة من دون إنشاء عملية مختلفة لكل تشكيلة.",
    [],
  ),
  "ms-store": topic(
    "MS Store keeps catalog maintenance, order handling and customer follow-up in a straightforward commerce workflow. The owner can manage the visible assortment and fulfillment without exposing private operations to public visitors.",
    [],
    "يجمع MS Store صيانة الكتالوج ومعالجة الطلبات ومتابعة العملاء في مسار تجارة مباشر. ويمكن للمالك إدارة التشكيلة والتنفيذ من دون كشف العمليات الخاصة للزوار.",
    [],
  ),
};

Object.entries(operationsCopyOverrides).forEach(([slug, operations]) => {
  caseStudyDetails[slug].qualities.operations = operations;
});

const growthCopyOverrides = {
  "fresh-cart": topic(
    "Reusable category, product, bundle and account structures let the grocery experience expand without adding a new purchase pattern for every range.",
    ["Expandable grocery categories", "Reusable bundle and repeat-purchase workflows", "Indexed catalog foundations for deeper inventory"],
    "تسمح هياكل التصنيفات والمنتجات والباقات والحسابات القابلة لإعادة الاستخدام بتوسيع تجربة البقالة من دون إضافة نمط شراء جديد لكل قسم.",
    ["تصنيفات بقالة قابلة للتوسع", "مسارات قابلة لإعادة الاستخدام للباقات وإعادة الشراء", "أسس كتالوج مفهرسة لمخزون أعمق"],
  ),
  travco: topic(
    "Reusable package details and reservation states allow Travco to add destinations, seasonal offers and new travel categories without rebuilding the core booking journey.",
    ["Reusable package-detail model", "Room for new destinations and seasonal offers", "Reservation states that support more travel categories"],
    "تتيح تفاصيل الباقات وحالات الحجز القابلة لإعادة الاستخدام إضافة وجهات وعروض موسمية وفئات سفر جديدة من دون إعادة بناء رحلة الحجز الأساسية.",
    ["نموذج قابل لإعادة الاستخدام لتفاصيل الباقة", "مساحة لوجهات وعروض موسمية جديدة", "حالات حجز تدعم فئات سفر إضافية"],
  ),
  byjojo: topic(
    "Reusable structures for bedding sets, table linen, bundles and complementary items can carry new materials, room collections and seasonal ranges as the catalog grows.",
    ["Expandable room and material collections", "Reusable bundle and upsell model", "Consistent merchandising for seasonal ranges"],
    "تستوعب الهياكل القابلة لإعادة الاستخدام لأطقم المفروشات ومفارش المائدة والباقات والقطع المكملة خامات ومجموعات غرف ومواسم جديدة مع نمو الكتالوج.",
    ["مجموعات قابلة للتوسع حسب الغرفة والخامة", "نموذج قابل لإعادة الاستخدام للباقات والإضافات", "عرض متسق للمجموعات الموسمية"],
  ),
  "ms-store": topic(
    "Repeatable catalog, checkout, account and tracking patterns support larger clothing assortments while preserving the same understandable customer journey.",
    ["Expandable clothing categories", "Reusable checkout and tracking patterns", "Maintainable catalog structure"],
    "تدعم أنماط الكتالوج والدفع والحساب والتتبع القابلة لإعادة الاستخدام تشكيلات ملابس أكبر مع الحفاظ على رحلة العميل الواضحة نفسها.",
    ["تصنيفات ملابس قابلة للتوسع", "أنماط قابلة لإعادة الاستخدام للدفع والتتبع", "هيكل كتالوج سهل الصيانة"],
  ),
};

Object.entries(growthCopyOverrides).forEach(([slug, growth]) => {
  caseStudyDetails[slug].qualities.growth = growth;
});
