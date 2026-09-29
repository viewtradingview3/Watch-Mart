// Initial Data & Seed Configuration for Watch Mart Watch Store
const DEFAULT_STORE_DATA = {
  settings: {
    storeName: "WATCH MART",
    tagline: "Pakistan's Premier Luxury Horology & Timepiece Store",
    phone: "+92 300 8472910",
    whatsappNumber: "923008472910",
    email: "orders@watchmart.pk",
    address: "Showroom 12, Ground Floor, Al-Hafeez Heights, Gulberg III, Lahore, Pakistan",
    currency: "PKR",
    currencySymbol: "Rs.",
    freeShippingThreshold: 5000,
    announcementText: "✨ FESTIVE LUXURY OFFER: Flat 15% OFF with code WATCHMART15 | Free Express Shipping Nationwide on Rs. 5,000+",
    heroHeadline: "Masterpieces of Precision & Grandeur",
    heroSubheadline: "Discover Pakistan's finest collection of Swiss-inspired automatics, luxury chronographs, and cutting-edge smart timepieces.",
    facebookUrl: "https://facebook.com/watchmart.pk",
    instagramUrl: "https://instagram.com/watchmart.pk",
    tiktokUrl: "https://tiktok.com/@watchmart.pk"
  },
  
  shippingRates: [
    { city: "Lahore", rate: 199, estDays: "1 - 2 Days" },
    { city: "Karachi", rate: 250, estDays: "2 - 3 Days" },
    { city: "Islamabad", rate: 250, estDays: "2 - 3 Days" },
    { city: "Rawalpindi", rate: 250, estDays: "2 - 3 Days" },
    { city: "Faisalabad", rate: 250, estDays: "2 - 3 Days" },
    { city: "Multan", rate: 250, estDays: "2 - 3 Days" },
    { city: "Peshawar", rate: 280, estDays: "2 - 4 Days" },
    { city: "Sialkot", rate: 250, estDays: "2 - 3 Days" },
    { city: "Gujranwala", rate: 250, estDays: "2 - 3 Days" },
    { city: "Quetta", rate: 300, estDays: "3 - 5 Days" },
    { city: "Hyderabad", rate: 280, estDays: "2 - 4 Days" },
    { city: "Other Cities (All Pakistan)", rate: 290, estDays: "3 - 5 Days" }
  ],

  categories: [
    { id: "all", name: "All Watches", count: 16, icon: "watch" },
    { id: "men", name: "Men's Watches", count: 8, icon: "user" },
    { id: "women", name: "Women's Watches", count: 4, icon: "heart" },
    { id: "smart", name: "Smart Watches", count: 3, icon: "cpu" },
    { id: "luxury", name: "Luxury Collection", count: 6, icon: "award" },
    { id: "sports", name: "Sports & Diver", count: 4, icon: "activity" },
    { id: "casual", name: "Casual & Vintage", count: 4, icon: "clock" },
    { id: "couple", name: "Couple Watches", count: 2, icon: "users" },
    { id: "sale", name: "Sale & Deals", count: 10, icon: "tag" }
  ],

  coupons: [
    { code: "WATCHMART15", discountType: "percentage", value: 15, minOrder: 4000, expiry: "2026-12-31", active: true },
    { code: "WELCOME10", discountType: "percentage", value: 10, minOrder: 2500, expiry: "2026-12-31", active: true },
    { code: "EID500", discountType: "fixed", value: 500, minOrder: 5000, expiry: "2026-12-31", active: true },
    { code: "LUXURY1500", discountType: "fixed", value: 1500, minOrder: 18000, expiry: "2026-12-31", active: true }
  ],

  products: [
    {
      id: "prod-001",
      name: "Chrono Royal Oak Skeleton Automatic",
      sku: "CI-SKEL-01",
      category: "luxury",
      secondaryCategories: ["men", "sale"],
      gender: "Men",
      brand: "Watch Mart",
      price: 24500,
      salePrice: 19999,
      isSale: true,
      isFeatured: true,
      isBestSeller: true,
      isNewArrival: false,
      rating: 4.9,
      reviewCount: 38,
      stock: 7,
      lowStockThreshold: 3,
      strapType: "Stainless Steel",
      images: [
        "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&w=800&q=80"
      ],
      shortDesc: "A masterpiece of horological architecture with open-heart skeleton dial and high-precision automatic mechanical movement.",
      description: "Crafted for connoisseurs of fine watchmaking, the Chrono Royal Oak Skeleton features an intricate exposed mechanical movement protected by scratch-resistant sapphire crystal. The brushed 316L stainless steel bracelet and octagonal bezel embody timeless masculine power.",
      specs: {
        movement: "Japanese Miyota 8N24 Skeleton Automatic (No battery needed)",
        caseDiameter: "42 mm",
        caseThickness: "11.5 mm",
        caseMaterial: "316L Surgical Grade Solid Stainless Steel",
        glass: "Anti-Reflective Sapphire Crystal",
        waterResistance: "50m / 5 ATM (Splash & Shower Proof)",
        strapWidth: "22 mm Interlocking Steel Bracelet",
        powerReserve: "42 Hours",
        warranty: "1 Year International & Local Warranty"
      },
      variants: [
        { name: "Royal Gold & Obsidian", hex: "#D4AF37", inStock: true },
        { name: "Silver Steel & Azure", hex: "#C0C0C0", inStock: true },
        { name: "Midnight Blackout", hex: "#1A1A1A", inStock: true }
      ]
    },
    {
      id: "prod-002",
      name: "Submariner Cerachrom Pro Diver",
      sku: "CI-SUB-02",
      category: "luxury",
      secondaryCategories: ["men", "sports", "sale"],
      gender: "Men",
      brand: "Watch Mart",
      price: 22000,
      salePrice: 17499,
      isSale: true,
      isFeatured: true,
      isBestSeller: true,
      isNewArrival: false,
      rating: 4.8,
      reviewCount: 52,
      stock: 12,
      lowStockThreshold: 4,
      strapType: "Stainless Steel",
      images: [
        "https://images.unsplash.com/photo-1547996160-71dfabbce5ed?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80"
      ],
      shortDesc: "Iconic professional diving watch with unidirectional rotatable ceramic bezel and luminous Chromalight display.",
      description: "The Submariner Cerachrom is engineered for oceanic depths and urban sophistication. Features a cyclops magnification lens over the date window, screw-down crown, and ultra-bright Swiss Super-LumiNova markers for night visibility.",
      specs: {
        movement: "High-Beat NH35A Japanese Automatic with Hacking",
        caseDiameter: "40.5 mm",
        caseThickness: "12.8 mm",
        caseMaterial: "Solid Oystersteel 316L",
        glass: "Double-Domed Sapphire with Cyclops Date Lens",
        waterResistance: "100m / 10 ATM (Swimming & Snorkeling Proof)",
        strapWidth: "20 mm Oyster-Style Bracelet with Glidelock Clasp",
        powerReserve: "41 Hours",
        warranty: "1 Year Official Warranty"
      },
      variants: [
        { name: "Emerald Hulk Green", hex: "#0E4C33", inStock: true },
        { name: "Deep Ocean Black", hex: "#111111", inStock: true },
        { name: "Pepsi Dual Tone (Red/Blue)", hex: "#8A1818", inStock: true }
      ]
    },
    {
      id: "prod-003",
      name: "Elegance Diamond Petite Rose",
      sku: "CI-FEM-03",
      category: "women",
      secondaryCategories: ["luxury", "sale"],
      gender: "Women",
      brand: "Watch Mart",
      price: 15500,
      salePrice: 12999,
      isSale: true,
      isFeatured: true,
      isBestSeller: true,
      isNewArrival: true,
      rating: 5.0,
      reviewCount: 29,
      stock: 9,
      lowStockThreshold: 3,
      strapType: "Stainless Steel",
      images: [
        "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1517463708453-2947118ef399?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?auto=format&fit=crop&w=800&q=80"
      ],
      shortDesc: "A graceful feminine luxury watch featuring natural mother-of-pearl dial and Austrian crystal bezel.",
      description: "Designed to reflect elegance at weddings, festive occasions, and daily luxury. The rose gold ion plating ensures lifelong brilliance without fading, paired with delicate cubic zirconia hour markers.",
      specs: {
        movement: "Swiss Ronda Quartz Movement (Ultra-Accurate)",
        caseDiameter: "32 mm",
        caseThickness: "7.8 mm (Ultra-Slim)",
        caseMaterial: "Rose Gold IP Plated Brass & Steel Caseback",
        glass: "Hardened Mineral Crystal with Anti-Scratch Coating",
        waterResistance: "30m / 3 ATM (Rain & Handwash Safe)",
        strapWidth: "14 mm Jewelry Clasp Mesh Bracelet",
        batteryLife: "Up to 3 Years (Sony Battery included)",
        warranty: "1 Year Official Warranty"
      },
      variants: [
        { name: "Rose Gold & Pearl", hex: "#B76E79", inStock: true },
        { name: "Champagne Yellow Gold", hex: "#D4AF37", inStock: true },
        { name: "Silver Starlight", hex: "#E0E0E0", inStock: true }
      ]
    },
    {
      id: "prod-004",
      name: "Titan Pulse Ultra AMOLED Smartwatch",
      sku: "CI-SMRT-04",
      category: "smart",
      secondaryCategories: ["sports", "men", "sale"],
      gender: "Unisex",
      brand: "Watch Mart Tech",
      price: 8999,
      salePrice: 6999,
      isSale: true,
      isFeatured: true,
      isBestSeller: true,
      isNewArrival: true,
      rating: 4.7,
      reviewCount: 64,
      stock: 18,
      lowStockThreshold: 5,
      strapType: "Silicone/Rubber",
      images: [
        "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1510017803434-a899398421b3?auto=format&fit=crop&w=800&q=80"
      ],
      shortDesc: "1.43-inch vibrant HD AMOLED display with Bluetooth calling, AI voice assistant, and 120+ sports tracking modes.",
      description: "The ultimate modern companion for your fitness and communication. Receive Urdu & English WhatsApp notifications, make high-clarity phone calls directly from your wrist, monitor heart rate 24/7, SpO2, and sleep cycles.",
      specs: {
        movement: "Dual-Core Smart Processor with GPU rendering",
        display: "1.43\" Ultra HD AMOLED, 466x466 px, 1000 nits brightness",
        caseDiameter: "46 mm Aerospace Zinc Alloy",
        features: "Bluetooth Calling, SpO2, Heart Rate, BP, Calculator, Games",
        batteryLife: "7 - 10 Days typical use, 25 Days standby",
        connectivity: "Bluetooth 5.3 (iOS & Android Compatible via DaFit / GloryFit)",
        waterResistance: "IP68 Dust & Water Resistant",
        warranty: "6 Months Replacement Warranty"
      },
      variants: [
        { name: "Matte Space Grey", hex: "#4A4E54", inStock: true },
        { name: "Obsidian Black", hex: "#111111", inStock: true },
        { name: "Silver Metal Mesh Band", hex: "#D1D5DB", inStock: true }
      ]
    },
    {
      id: "prod-005",
      name: "Heritage Vintage Chronograph Moonphase",
      sku: "CI-HER-05",
      category: "casual",
      secondaryCategories: ["luxury", "men"],
      gender: "Men",
      brand: "Watch Mart",
      price: 18500,
      salePrice: 14800,
      isSale: true,
      isFeatured: true,
      isBestSeller: false,
      isNewArrival: false,
      rating: 4.9,
      reviewCount: 23,
      stock: 6,
      lowStockThreshold: 2,
      strapType: "Genuine Leather",
      images: [
        "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80"
      ],
      shortDesc: "Classic dress watch featuring working moonphase subdial and hand-stitched Tuscan genuine leather strap.",
      description: "An homage to 1950s European watchmaking. The sunburst ivory dial complements the polished rose gold case and deep blue moon indicator. Perfect for formal suits, boardrooms, and special family gatherings.",
      specs: {
        movement: "Japanese Seiko VD53 Multi-Function Quartz",
        caseDiameter: "41 mm",
        caseThickness: "10.2 mm",
        caseMaterial: "Polished Stainless Steel with Warm Rose Gold Ion Plating",
        glass: "Curved Domed Mineral Glass with AR Coating",
        waterResistance: "50m / 5 ATM",
        strapWidth: "20 mm Top-Grain Italian Leather with Butterfly Deployant Buckle",
        batteryLife: "3 Years",
        warranty: "1 Year Official Warranty"
      },
      variants: [
        { name: "Cognac Brown & Rose Gold", hex: "#9E4717", inStock: true },
        { name: "Midnight Black & Silver", hex: "#222222", inStock: true }
      ]
    },
    {
      id: "prod-006",
      name: "Aura Stella Diamond Bezel Sapphire",
      sku: "CI-AURA-06",
      category: "women",
      secondaryCategories: ["luxury", "casual"],
      gender: "Women",
      brand: "Watch Mart",
      price: 11500,
      salePrice: 9200,
      isSale: true,
      isFeatured: false,
      isBestSeller: true,
      isNewArrival: false,
      rating: 4.8,
      reviewCount: 31,
      stock: 14,
      lowStockThreshold: 4,
      strapType: "Stainless Steel",
      images: [
        "https://images.unsplash.com/photo-1517463708453-2947118ef399?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80"
      ],
      shortDesc: "Glamorous jewelry timepiece with pavé crystal bezel and deep celestial sunburst dial.",
      description: "A showstopper designed to turn heads. Sleek, comfortable bracelet hugs the wrist gently. Shines brilliantly under indoor lighting and evening banquets.",
      specs: {
        movement: "Seiko PC21 Quartz Movement",
        caseDiameter: "34 mm",
        caseThickness: "8.5 mm",
        caseMaterial: "High-Gloss Polished Stainless Steel",
        glass: "Tempered Hardlex Mineral Glass",
        waterResistance: "30m / 3 ATM",
        strapWidth: "16 mm Dual Fold Push-Button Clasp",
        warranty: "1 Year Official Warranty"
      },
      variants: [
        { name: "Midnight Royal Blue & Silver", hex: "#1A365D", inStock: true },
        { name: "Emerald Green & Gold", hex: "#064E3B", inStock: true }
      ]
    },
    {
      id: "prod-007",
      name: "Grandeur Master Dual Timezone GMT",
      sku: "CI-GMT-07",
      category: "luxury",
      secondaryCategories: ["men", "sports"],
      gender: "Men",
      brand: "Watch Mart",
      price: 26000,
      salePrice: 21500,
      isSale: true,
      isFeatured: true,
      isBestSeller: false,
      isNewArrival: true,
      rating: 5.0,
      reviewCount: 19,
      stock: 5,
      lowStockThreshold: 2,
      strapType: "Stainless Steel",
      images: [
        "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80"
      ],
      shortDesc: "World-traveler GMT watch displaying two timezones simultaneously with Batman black & blue ceramic bezel.",
      description: "For Pakistani business executives and frequent travelers. Track Pakistan Standard Time (PKT) and Gulf/UK time at a single glance with the 24-hour red GMT hand and bi-directional ceramic bezel.",
      specs: {
        movement: "Automatic Calibre HZ6460 True GMT Movement",
        caseDiameter: "41 mm",
        caseThickness: "13 mm",
        caseMaterial: "316L Marine Stainless Steel",
        glass: "Anti-Scratch Sapphire Crystal with Date Magnifier",
        waterResistance: "100m / 10 ATM",
        strapWidth: "20 mm Jubilee 5-Piece Link Bracelet",
        powerReserve: "40 Hours",
        warranty: "1 Year Official Warranty"
      },
      variants: [
        { name: "Batman Ceramic (Black / Royal Blue)", hex: "#1E3A8A", inStock: true },
        { name: "Root Beer (Brown / Rose Gold)", hex: "#78350F", inStock: true }
      ]
    },
    {
      id: "prod-008",
      name: "Apex Pro Rugged Military Smartwatch",
      sku: "CI-SMRT-08",
      category: "smart",
      secondaryCategories: ["sports", "men"],
      gender: "Men",
      brand: "Watch Mart Tech",
      price: 10500,
      salePrice: 8499,
      isSale: true,
      isFeatured: false,
      isBestSeller: true,
      isNewArrival: false,
      rating: 4.8,
      reviewCount: 44,
      stock: 15,
      lowStockThreshold: 4,
      strapType: "Silicone/Rubber",
      images: [
        "https://images.unsplash.com/photo-1510017803434-a899398421b3?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=800&q=80"
      ],
      shortDesc: "Military-grade drop-proof smartwatch with shock absorption, built-in flashlight, and massive 600mAh battery.",
      description: "Tested against severe drops, heat, and dust. Built for Pakistani athletes, bike riders, and adventurers. Features continuous barometer, compass, blood oxygen, and Bluetooth voice assistant.",
      specs: {
        battery: "600 mAh High-Density Li-Po (Up to 15-20 Days battery)",
        display: "1.96\" HD IPS Screen with Corning Gorilla Glass",
        durability: "MIL-STD-810H Military Certified Drop & Shock Proof",
        features: "Dual Flashlight, Compass, Bluetooth Calling, 100+ Sports",
        waterResistance: "5ATM & IP69K Waterproof",
        warranty: "6 Months Replacement Warranty"
      },
      variants: [
        { name: "Army Tactical Green", hex: "#3F4E34", inStock: true },
        { name: "Desert Tan / Sand", hex: "#C2B280", inStock: true },
        { name: "Gunmetal Shadow", hex: "#2B2D42", inStock: true }
      ]
    },
    {
      id: "prod-009",
      name: "Eternal Bond His & Hers Luxury Couple Set",
      sku: "CI-CPL-09",
      category: "couple",
      secondaryCategories: ["luxury", "sale"],
      gender: "Couple",
      brand: "Watch Mart",
      price: 21999,
      salePrice: 18500,
      isSale: true,
      isFeatured: true,
      isBestSeller: true,
      isNewArrival: false,
      rating: 5.0,
      reviewCount: 41,
      stock: 8,
      lowStockThreshold: 2,
      strapType: "Stainless Steel",
      images: [
        "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80"
      ],
      shortDesc: "Two complementary matching luxury timepieces presented in a handcrafted velvet gift box. Ideal wedding & anniversary gift.",
      description: "Celebrate endless love with this his & hers dual-tone pair. Both watches feature diamond-cut indices, scratch-resistant sapphire crystal, and golden fluted bezels. Includes complimentary custom gift packaging and warranty cards for both.",
      specs: {
        setContains: "1x Men's Watch (41mm) + 1x Women's Watch (31mm) + Gift Box",
        movement: "Twin Japanese Quartz Movements",
        caseMaterial: "Dual Tone 18K Gold PVD & Stainless Steel",
        glass: "Sapphire Crystal with Anti-Glare",
        waterResistance: "30m / 3 ATM",
        packaging: "Luxury Wooden Lacquer Gift Box with Velvet Cushion",
        warranty: "1 Year Official Warranty on Both Watches"
      },
      variants: [
        { name: "Dual Tone Gold & Silver", hex: "#D4AF37", inStock: true },
        { name: "Pure Platinum Silver", hex: "#E5E7EB", inStock: true }
      ]
    },
    {
      id: "prod-010",
      name: "Speedmaster Racing Tachymetre",
      sku: "CI-RACE-10",
      category: "sports",
      secondaryCategories: ["men", "casual"],
      gender: "Men",
      brand: "Watch Mart",
      price: 14000,
      salePrice: 11200,
      isSale: true,
      isFeatured: false,
      isBestSeller: true,
      isNewArrival: true,
      rating: 4.7,
      reviewCount: 27,
      stock: 11,
      lowStockThreshold: 3,
      strapType: "Genuine Leather",
      images: [
        "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1547996160-71dfabbce5ed?auto=format&fit=crop&w=800&q=80"
      ],
      shortDesc: "Motorsport-inspired high-precision chronograph with tachymeter speed scale and carbon weave texture.",
      description: "Built for speed enthusiasts. Triple sub-dials track 1/10th of a second, 60 minutes, and split-lap timing with responsive mechanical-feel pushers.",
      specs: {
        movement: "Seiko VK63 Meca-Quartz Flyback Movement",
        caseDiameter: "43 mm",
        caseThickness: "12 mm",
        caseMaterial: "Black DLC Coated Stainless Steel",
        glass: "K1 Hardened Mineral Crystal",
        waterResistance: "50m / 5 ATM",
        strapWidth: "22 mm Perforated Rally Leather Strap with Red Stitching",
        warranty: "1 Year Official Warranty"
      },
      variants: [
        { name: "Rally Red & Carbon Black", hex: "#DC2626", inStock: true },
        { name: "Monza Yellow & Black", hex: "#FACC15", inStock: true }
      ]
    },
    {
      id: "prod-011",
      name: "Monaco Square Retro Automatic",
      sku: "CI-MON-11",
      category: "casual",
      secondaryCategories: ["men", "luxury"],
      gender: "Men",
      brand: "Watch Mart",
      price: 16500,
      salePrice: 13500,
      isSale: true,
      isFeatured: true,
      isBestSeller: false,
      isNewArrival: true,
      rating: 4.9,
      reviewCount: 18,
      stock: 6,
      lowStockThreshold: 2,
      strapType: "Genuine Leather",
      images: [
        "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&w=800&q=80"
      ],
      shortDesc: "Avant-garde square case design with sunburst petrol-blue dial and vintage motorsport heritage.",
      description: "Break away from ordinary round dials. The bold geometric square silhouette screams confidence, finished with chamfered edges and exhibition glass caseback.",
      specs: {
        movement: "Automatic Mechanical Self-Winding 21 Jewels",
        caseDiameter: "39 x 39 mm Square Case",
        caseThickness: "12.5 mm",
        caseMaterial: "Satin-Brushed 316L Stainless Steel",
        glass: "Beveled Sapphire Crystal",
        waterResistance: "50m / 5 ATM",
        strapWidth: "22 mm Alligator Grain Embossed Genuine Leather",
        warranty: "1 Year Official Warranty"
      },
      variants: [
        { name: "Petrol Blue Dial / Navy Strap", hex: "#1E40AF", inStock: true },
        { name: "Onyx Black / Cognac Strap", hex: "#18181B", inStock: true }
      ]
    },
    {
      id: "prod-012",
      name: "Grace Floral Mother-of-Pearl",
      sku: "CI-GRC-12",
      category: "women",
      secondaryCategories: ["casual", "sale"],
      gender: "Women",
      brand: "Watch Mart",
      price: 9500,
      salePrice: 7499,
      isSale: true,
      isFeatured: false,
      isBestSeller: true,
      isNewArrival: false,
      rating: 4.9,
      reviewCount: 35,
      stock: 10,
      lowStockThreshold: 3,
      strapType: "Genuine Leather",
      images: [
        "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1517463708453-2947118ef399?auto=format&fit=crop&w=800&q=80"
      ],
      shortDesc: "Delicate floral embossed dial with iridescent pastel reflections and soft genuine calfskin strap.",
      description: "An understated, poetic accessory that pairs effortlessly with Eastern lawn suits or Western formal wear. Lightweight and breathable for summer comfort.",
      specs: {
        movement: "Citizen Miyota 2035 Quartz",
        caseDiameter: "30 mm",
        caseThickness: "7.2 mm",
        caseMaterial: "Polished Rose Gold Alloy",
        glass: "Scratch-Resistant Mineral Crystal",
        waterResistance: "30m / 3 ATM",
        strapWidth: "12 mm Soft Calfskin Leather",
        warranty: "1 Year Official Warranty"
      },
      variants: [
        { name: "Powder Pink Leather", hex: "#FBCFE8", inStock: true },
        { name: "Cream Ivory Leather", hex: "#FEF3C7", inStock: true }
      ]
    },
    {
      id: "prod-013",
      name: "Phantom Stealth All-Blackout Automatic",
      sku: "CI-PHAN-13",
      category: "men",
      secondaryCategories: ["luxury", "sports"],
      gender: "Men",
      brand: "Watch Mart",
      price: 15800,
      salePrice: 12499,
      isSale: true,
      isFeatured: false,
      isBestSeller: false,
      isNewArrival: true,
      rating: 4.7,
      reviewCount: 16,
      stock: 4,
      lowStockThreshold: 3,
      strapType: "Stainless Steel",
      images: [
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80"
      ],
      shortDesc: "Monochrome stealth black aesthetics with luminous grey indices and matte PVD gunmetal casing.",
      description: "Designed for those who command respect without saying a word. Deep textured matte dial, dark exhibition caseback, and smooth sweeping second hand.",
      specs: {
        movement: "Automatic Mechanical Self-Winding",
        caseDiameter: "42 mm",
        caseThickness: "12 mm",
        caseMaterial: "Matte Black PVD 316L Stainless Steel",
        glass: "Anti-Reflective Sapphire Crystal",
        waterResistance: "50m / 5 ATM",
        strapWidth: "22 mm Solid Link Black Steel Bracelet",
        warranty: "1 Year Official Warranty"
      },
      variants: [
        { name: "Matte Phantom Black", hex: "#18181B", inStock: true }
      ]
    },
    {
      id: "prod-014",
      name: "Infinity Pro Gen-5 Smart Fitness Watch",
      sku: "CI-SMRT-14",
      category: "smart",
      secondaryCategories: ["women", "men", "sale"],
      gender: "Unisex",
      brand: "Watch Mart Tech",
      price: 7999,
      salePrice: 5999,
      isSale: true,
      isFeatured: false,
      isBestSeller: false,
      isNewArrival: true,
      rating: 4.6,
      reviewCount: 22,
      stock: 20,
      lowStockThreshold: 5,
      strapType: "Silicone/Rubber",
      images: [
        "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1510017803434-a899398421b3?auto=format&fit=crop&w=800&q=80"
      ],
      shortDesc: "Sleek curved borderless screen with continuous health metrics, Pakistani prayer time reminders, and WhatsApp sync.",
      description: "Slim, fashionable and intuitive. Includes customizable watch faces (upload your own picture), menstrual cycle tracking for women, steps, calories, and Bluetooth music control.",
      specs: {
        display: "1.85\" Curved Edge HD Display",
        batteryLife: "5 - 7 Days",
        compatibility: "Android 5.0+ and iOS 10.0+",
        features: "Prayer Reminders, Blood Oxygen, Remote Camera, Sleep Monitor",
        waterResistance: "IP67 Splash Proof",
        warranty: "6 Months Official Warranty"
      },
      variants: [
        { name: "Midnight Black", hex: "#111111", inStock: true },
        { name: "Rose Blush", hex: "#FECDD3", inStock: true },
        { name: "Cloud Silver", hex: "#E5E7EB", inStock: true }
      ]
    },
    {
      id: "prod-015",
      name: "Regal Imperial Gold Tourbillon Edition",
      sku: "CI-LUX-15",
      category: "luxury",
      secondaryCategories: ["men"],
      gender: "Men",
      brand: "Watch Mart",
      price: 38000,
      salePrice: 32500,
      isSale: true,
      isFeatured: true,
      isBestSeller: false,
      isNewArrival: true,
      rating: 5.0,
      reviewCount: 14,
      stock: 3,
      lowStockThreshold: 1,
      strapType: "Genuine Leather",
      images: [
        "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80"
      ],
      shortDesc: "Exclusive high-complication timepiece featuring an oscillating tourbillon cage and 24K gold-electroplated bezel.",
      description: "The pinnacle of our horological showcase. Each watch is individually numbered on the side case and assembled by master horologists. Presented in a high-gloss wooden chest with certificate of authenticity.",
      specs: {
        movement: "Flying Tourbillon Mechanical Manual-Wind Calibre CI-9901",
        caseDiameter: "43 mm",
        caseThickness: "13.2 mm",
        caseMaterial: "316L Steel with 5-Micron 24K Gold PVD Coating",
        glass: "Domed Double Sapphire Crystal with Anti-Fingerprint Coating",
        waterResistance: "50m / 5 ATM",
        strapWidth: "22 mm Genuine Crocodile Grain Leather Strap",
        powerReserve: "60 Hours",
        warranty: "2 Years Premium VIP Concierge Warranty"
      },
      variants: [
        { name: "24K Yellow Gold / Royal Black Dial", hex: "#D4AF37", inStock: true },
        { name: "Rose Gold / Sunburst White Dial", hex: "#C59B76", inStock: true }
      ]
    },
    {
      id: "prod-016",
      name: "Bella Petite Crystal Milanese Mesh",
      sku: "CI-FEM-16",
      category: "women",
      secondaryCategories: ["casual", "sale"],
      gender: "Women",
      brand: "Watch Mart",
      price: 7500,
      salePrice: 5499,
      isSale: true,
      isFeatured: false,
      isBestSeller: true,
      isNewArrival: false,
      rating: 4.8,
      reviewCount: 47,
      stock: 16,
      lowStockThreshold: 4,
      strapType: "Stainless Steel",
      images: [
        "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?auto=format&fit=crop&w=800&q=80"
      ],
      shortDesc: "Minimalist ultra-thin dial with magnetic Milanese mesh band and crystal hour markers.",
      description: "Effortlessly chic and extremely lightweight. The magnetic clasp snaps smoothly to fit any wrist size without needing link removal tools.",
      specs: {
        movement: "Japanese Quartz",
        caseDiameter: "28 mm",
        caseThickness: "6.5 mm (Featherlight)",
        caseMaterial: "Polished Alloy with Stainless Steel Back",
        glass: "Reinforced Mineral Glass",
        waterResistance: "30m / 3 ATM",
        strapWidth: "12 mm Infinitely Adjustable Magnetic Loop Mesh",
        warranty: "1 Year Official Warranty"
      },
      variants: [
        { name: "Rose Gold Milanese", hex: "#B76E79", inStock: true },
        { name: "Starlight Silver", hex: "#D1D5DB", inStock: true },
        { name: "Midnight Black Mesh", hex: "#18181B", inStock: true }
      ]
    }
  ],

  reviews: [
    {
      id: "rev-101",
      productId: "prod-001",
      productName: "Chrono Royal Oak Skeleton Automatic",
      customerName: "Hamza Tariq",
      city: "Lahore (DHA Phase 5)",
      rating: 5,
      date: "2026-09-18",
      comment: "Zabardast quality! Skeleton movement dekh kar log pooch rahe hain kahan se li. Packaging VIP thi aur Lahore me next day delivery mil gayi. Highly recommended for watch lovers!",
      verifiedPurchase: true,
      status: "approved"
    },
    {
      id: "rev-102",
      productId: "prod-002",
      productName: "Submariner Cerachrom Pro Diver",
      customerName: "Bilal Ahmed Khan",
      city: "Karachi (Clifton)",
      rating: 5,
      date: "2026-09-22",
      comment: "Ceramic bezel bohot smooth rotate karta hai aur green color daylight me ultra premium lagta hai. TCS k zariye 2 din me Karachi parcel deliver hua. COD option bohat safe laga.",
      verifiedPurchase: true,
      status: "approved"
    },
    {
      id: "rev-103",
      productId: "prod-004",
      productName: "Titan Pulse Ultra AMOLED Smartwatch",
      customerName: "Dr. Usman Farooq",
      city: "Islamabad (F-10)",
      rating: 5,
      date: "2026-09-25",
      comment: "AMOLED screen ki brightness outdoor dhoop me bhi crystal clear hai. WhatsApp Urdu notifications sahi read hoti hain aur calling speaker bohot clear hai. 10/10 value for money!",
      verifiedPurchase: true,
      status: "approved"
    },
    {
      id: "rev-104",
      productId: "prod-003",
      productName: "Elegance Diamond Petite Rose",
      customerName: "Ayesha Malik",
      city: "Faisalabad",
      rating: 5,
      date: "2026-09-26",
      comment: "Maine apni sister ki birthday k liye order ki thi. Bohat khubsurat packaging thi aur watch bohot delicate aur luxury lagti hai. Thank you Watch Mart!",
      verifiedPurchase: true,
      status: "approved"
    },
    {
      id: "rev-105",
      productId: "prod-009",
      productName: "Eternal Bond His & Hers Luxury Couple Set",
      customerName: "Saad & Mariam",
      city: "Rawalpindi",
      rating: 5,
      date: "2026-09-27",
      comment: "Anniversary gift k liye best purchase thi. Wooden luxury box aur dono watches ki finish 100% genuine feel deti hai. Customer support on WhatsApp was extremely helpful.",
      verifiedPurchase: true,
      status: "approved"
    }
  ],

  orders: [
    {
      id: "ORD-PK-8921",
      customer: {
        name: "Ali Raza Chohan",
        phone: "03009876543",
        email: "aliraza@gmail.com",
        address: "House 42-B, Sector Y, DHA Phase 3",
        city: "Lahore",
        area: "DHA",
        notes: "Please call before arrival"
      },
      items: [
        {
          productId: "prod-001",
          name: "Chrono Royal Oak Skeleton Automatic",
          variant: "Royal Gold & Obsidian",
          price: 19999,
          quantity: 1,
          image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=400&q=80"
        }
      ],
      subtotal: 19999,
      discount: 0,
      deliveryCharges: 0, // Free shipping above 5k
      total: 19999,
      paymentMethod: "Cash on Delivery (COD)",
      paymentStatus: "Pending COD Collection",
      status: "Shipped",
      courier: "TCS Express",
      trackingNumber: "TCS-902847192",
      date: "2026-09-27T14:20:00Z"
    },
    {
      id: "ORD-PK-9042",
      customer: {
        name: "Fatima Zahra",
        phone: "03214567890",
        email: "fatima.z@outlook.com",
        address: "Apartment 504, Creek Vistas, Phase 8",
        city: "Karachi",
        area: "DHA Phase 8",
        notes: "Leave with security guard if not available"
      },
      items: [
        {
          productId: "prod-003",
          name: "Elegance Diamond Petite Rose",
          variant: "Rose Gold & Pearl",
          price: 12999,
          quantity: 1,
          image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=400&q=80"
        }
      ],
      subtotal: 12999,
      discount: 1300, // WELCOME10 coupon
      deliveryCharges: 0,
      total: 11699,
      couponCode: "WELCOME10",
      paymentMethod: "Direct Bank Transfer (Meezan Bank)",
      paymentStatus: "Payment Verified",
      status: "Confirmed",
      courier: "Trax Logistics",
      trackingNumber: "TRX-7719284",
      date: "2026-09-28T09:45:00Z"
    },
    {
      id: "ORD-PK-9150",
      customer: {
        name: "Muhammad Bilal",
        phone: "03335551234",
        email: "bilal.m@yahoo.com",
        address: "Street 14, House 89, Sector I-8/2",
        city: "Islamabad",
        area: "I-8/2",
        notes: "Deliver in morning hours"
      },
      items: [
        {
          productId: "prod-004",
          name: "Titan Pulse Ultra AMOLED Smartwatch",
          variant: "Matte Space Grey",
          price: 6999,
          quantity: 1,
          image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=400&q=80"
        }
      ],
      subtotal: 6999,
      discount: 0,
      deliveryCharges: 0,
      total: 6999,
      paymentMethod: "Cash on Delivery (COD)",
      paymentStatus: "Pending COD Collection",
      status: "Processing",
      courier: "CallCourier",
      trackingNumber: "CC-849102",
      date: "2026-09-29T08:15:00Z"
    }
  ]
};

// ---- Store configuration (edit these) ----
// Leave a social link empty ('') to hide its icon. Put your REAL profile URLs here.
window.SOCIAL_LINKS = { facebook: '', instagram: '', tiktok: '' };
// Real end date of your current offer, e.g. '2026-10-15T23:59:00+05:00'. Empty or past = timer section is hidden.
window.OFFER_END_DATE = '';
