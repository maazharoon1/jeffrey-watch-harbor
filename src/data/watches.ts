export type WatchCategory =
  | "All"
  | "Chronograph"
  | "Luxury"
  | "Automatic"
  | "Dress Watches"
  | "Classic";

export interface WatchProduct {
  id: string;
  reference: string;
  name: string;
  subtitle: string;
  category: Exclude<WatchCategory, "All">;
  price: number;
  featured: boolean;
  availability: string;
  image: string;
  secondaryImage: string;
  description: string;
  specs: {
    movement: string;
    case: string;
    dial: string;
    strap: string;
    powerReserve: string;
    waterResistance: string;
  };
}

export const WATCH_PRODUCTS: WatchProduct[] = [
  {
    id: "sovereign-chronograph-rg",
    reference: "REF. JWH-001R",
    name: "Sovereign Chronograph 41",
    subtitle: "18k Rose Gold · Anthracite Slate",
    category: "Chronograph",
    price: 38500,
    featured: true,
    availability: "In Salon · Ready for Insured Courier",
    image: "/src/assets/images/watch_chronograph_gold_1791334700675.jpg",
    secondaryImage: "/src/assets/images/craftsmanship_macro_movement_1791334761037.jpg",
    description:
      "Hand-finished column-wheel chronograph housed in brushed 18k rose gold. Engineered for effortless legibility and mechanical permanence.",
    specs: {
      movement: "Calibre JWH-8901 Manual-Wind Column-Wheel Chronograph, 28,800 vph (4 Hz), 34 Jewels",
      case: "41 mm Brushed & Chamfered 18k Rose Gold, 11.4 mm Thickness, Sapphire Exhibition Caseback",
      dial: "Sunburst Anthracite Slate with Sunken Guilloché Subdials & Applied Rose Gold Indices",
      strap: "Hand-Stitched Matte Obsidian Alligator Leather with 18k Rose Gold Deployant Clasp",
      powerReserve: "72 Hours",
      waterResistance: "50 Meters (5 ATM)",
    },
  },
  {
    id: "lumiere-skeleton-tourbillon",
    reference: "REF. JWH-004P",
    name: "Lumière Flying Tourbillon",
    subtitle: "950 Platinum · Midnight Openworked",
    category: "Luxury",
    price: 84000,
    featured: true,
    availability: "Limited Edition · 2 Pieces Remaining",
    image: "/src/assets/images/watch_tourbillon_platinum_1791334716912.jpg",
    secondaryImage: "/src/assets/images/craftsmanship_macro_movement_1791334761037.jpg",
    description:
      "An architectural openworked flying tourbillon suspended between dual anti-reflective sapphire crystals inside an ultra-thin 950 platinum profile.",
    specs: {
      movement: "Calibre JWH-9400 Hand-Wound Flying Tourbillon, 21,600 vph (3 Hz), Titanium Carriage",
      case: "39.5 mm 950 Platinum, 8.9 mm Ultra-Thin Profile, Domed Sapphire Crystal",
      dial: "Openworked Midnight PVD Bridges with Hand-Beveled Anglage & Flame-Blued Hands",
      strap: "Deep Charcoal Nubuck Alligator with 950 Platinum Pin Buckle",
      powerReserve: "80 Hours",
      waterResistance: "30 Meters (3 ATM)",
    },
  },
  {
    id: "abyssal-ceramic-automatic",
    reference: "REF. JWH-007C",
    name: "Nautilus Harbor Automatic",
    subtitle: "Black Ceramic & Grade 5 Titanium",
    category: "Automatic",
    price: 24900,
    featured: true,
    availability: "In Salon · Ready for Insured Courier",
    image: "/src/assets/images/watch_diver_ceramic_1791334733091.jpg",
    secondaryImage: "/src/assets/images/watch_chronograph_gold_1791334700675.jpg",
    description:
      "Micro-blasted high-density zirconium oxide ceramic paired with a Grade 5 titanium integrated chassis and unidirectional 120-click bezel.",
    specs: {
      movement: "Calibre JWH-5200 Self-Winding Manufacture Movement, Solid 22k Gold Micro-Rotor",
      case: "42 mm Matte Black Ceramic with Brushed Grade 5 Titanium Core, 11.8 mm Thickness",
      dial: "Fine-Grained Obsidian Dial with Super-LumiNova Grade X1 Applied Baton Markers",
      strap: "Integrated Brushed Grade 5 Titanium Bracelet with Micro-Adjustment Folding Clasp",
      powerReserve: "68 Hours",
      waterResistance: "300 Meters (30 ATM)",
    },
  },
  {
    id: "celeste-perpetual-moonphase",
    reference: "REF. JWH-012G",
    name: "Céleste Perpetual Moonphase",
    subtitle: "18k Champagne Gold · Charcoal Guilloché",
    category: "Dress Watches",
    price: 52000,
    featured: true,
    availability: "Built to Order · Immediate Salon Allocation",
    image: "/src/assets/images/watch_perpetual_moonphase_1791334746360.jpg",
    secondaryImage: "/src/assets/images/craftsmanship_macro_movement_1791334761037.jpg",
    description:
      "Astronomical moonphase accurate to one day in 122 years, set against a hand-turned charcoal barleycorn guilloché dial in warm 18k champagne gold.",
    specs: {
      movement: "Calibre JWH-7100 Ultra-Thin Automatic Perpetual Calendar, 28,800 vph",
      case: "39 mm Polished 18k Champagne Gold, 9.6 mm Thickness, Concave Bezel",
      dial: "Hand-Engine-Turned Charcoal Guilloché with Solid Gold Lunar Disc",
      strap: "Espresso Shell Cordovan & Alligator Lining with 18k Gold Folding Clasp",
      powerReserve: "65 Hours",
      waterResistance: "30 Meters (3 ATM)",
    },
  },
  {
    id: "patrimoine-calatrava-classic",
    reference: "REF. JWH-018C",
    name: "Patrimoine Classique 38",
    subtitle: "18k Rose Gold · Smoked Warm Slate",
    category: "Classic",
    price: 29400,
    featured: false,
    availability: "In Salon · Ready for Insured Courier",
    image: "/src/assets/images/watch_chronograph_gold_1791334700675.jpg",
    secondaryImage: "/src/assets/images/watch_perpetual_moonphase_1791334746360.jpg",
    description:
      "Pure horological restraint. Three-register balance, hand-chamfered dauphine hands, and an unadorned silhouette designed to outlast generations.",
    specs: {
      movement: "Calibre JWH-3100 Manual-Wind Twin-Barrel Movement, Geneva Seal Finishing",
      case: "38 mm 18k Rose Gold, 7.8 mm Ultra-Slim Profile",
      dial: "Smoked Warm Slate Lacquer with Diamond-Polished Gold Markers",
      strap: "Matte Black Alligator Leather with 18k Rose Gold Ardillon Buckle",
      powerReserve: "90 Hours",
      waterResistance: "30 Meters (3 ATM)",
    },
  },
  {
    id: "harbor-regatta-chronograph",
    reference: "REF. JWH-021T",
    name: "Harbor Regatta Flyback",
    subtitle: "950 Platinum · Deep Marine Dial",
    category: "Chronograph",
    price: 46800,
    featured: false,
    availability: "In Salon · 1 Piece Available",
    image: "/src/assets/images/watch_tourbillon_platinum_1791334716912.jpg",
    secondaryImage: "/src/assets/images/watch_diver_ceramic_1791334733091.jpg",
    description:
      "Instantaneous flyback chronograph engineered for maritime timing precision, encased in heavy 950 platinum with a vertical clutch mechanism.",
    specs: {
      movement: "Calibre JWH-8950 Automatic Flyback Chronograph, Vertical Clutch",
      case: "40.5 mm 950 Platinum with Brushed Flanks, 11.9 mm Thickness",
      dial: "Deep Abyssal Blue Metallic Dial with Rhodium-Plated Sub-Registers",
      strap: "Hand-Stitched Navy Alligator Leather with Platinum Deployant Clasp",
      powerReserve: "70 Hours",
      waterResistance: "100 Meters (10 ATM)",
    },
  },
];

export const WATCH_CATEGORIES: WatchCategory[] = [
  "All",
  "Classic",
  "Chronograph",
  "Automatic",
  "Dress Watches",
  "Luxury",
];

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
};
