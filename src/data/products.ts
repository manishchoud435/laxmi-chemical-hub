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
      "Acetone (ACT)",
      "Acetone 99.70%",
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
      "Iso propyl Alcohol (IPA)",
      "Iso propyl Alcohol 99.8%",
      "Trichloroethylene (TCE)",
      "No Clean Flux",
    ],
    icon: "\uD83D\uDD0C",
  },
  {
    title: "Cosmetics Products",
    products: [
      "Iso propyl Alcohol (IPA)",
      "M-E-G",
      "Di Propylene Glycol (DPG)",
      "Polyethylene Glycol (PEG)",
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
      "Caustic Potash (KOH)",
      "Methyl Ethyl Ketone (MEK)",
      "Methylene Dichloride (MDC)",
      "Zinc Oxide (ZnO)",
      "Zinc Stearate",
      "Toluene (TOL)",
      "Toluene 99.80%",
      "Silicon Emulsion",
      "MIBK",
    ],
    icon: "\uD83D\uDD2C",
  },
  {
    title: "Agro Chemicals",
    products: ["Mono Chloro Benzene (MCB)", "N Butanol (NBA)"],
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
      "Ethyl Acetate (EA)",
      "Ethyl Acetate 99.70%",
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
