export interface ProductCategory {
  title: string;
  products: string[];
  icon: string;
}

export const productCategories: ProductCategory[] = [
  {
    title: "Pharma Chemicals",
    products: [
      "Hydrogen Peroxide (50%)",
      "Acetone",
      "Tertiary Butanol",
      "Isobutanol",
      "THF",
      "N-Propanol",
    ],
    icon: "\uD83D\uDC8A",
  },
  {
    title: "Electronics & PCB Board Cleaning Chemicals",
    products: [
      "Isopropyl Alcohol (IPA)",
      "Trichloroethylene (TCE)",
      "No Clean Flux",
    ],
    icon: "\uD83D\uDD0C",
  },
  {
    title: "Cosmetics Products",
    products: [
      "Isopropyl Alcohol",
      "M-E-G",
      "Di Propylene Glycol",
      "Polyethylene Glycol",
    ],
    icon: "\u2728",
  },
  {
    title: "Solvents",
    products: ["Lead", "ISO Propyl Alcohol Orderless"],
    icon: "\u2697\uFE0F",
  },
  {
    title: "Rubber Chemicals",
    products: [
      "Caustic Potash",
      "Methyl Ethyl Ketone",
      "Methylene Dichloride",
      "Zinc Oxide",
      "Zinc Stearate",
      "Toluene",
      "Silicon Emulsion",
      "MIBK",
    ],
    icon: "\uD83D\uDD2C",
  },
  {
    title: "Agro Chemicals",
    products: ["Mono Chloro Benzene", "N Butanol"],
    icon: "\uD83C\uDF3E",
  },
  {
    title: "Plasticizer and Food Chemicals",
    products: ["Butyl Carbitol", "EDTA Tetra Sodium", "Sorbitol"],
    icon: "\uD83E\uDDEA",
  },
  {
    title: "Coating Paints",
    products: [
      "Ethyl Acetate",
      "Pure Solvents",
      "Paint Thinner",
      "NC Thinner",
      "Deco Thinner",
      "PU Thinner",
    ],
    icon: "\uD83C\uDFA8",
  },
];

/** Flat list of all product names (deduplicated) */
export const allProducts: string[] = [
  ...new Set(productCategories.flatMap((c) => c.products)),
];
