export interface ProductSafety {
  hazardous: string;
  precautionary: string[];
  skinContact: string;
  inhalationIngestion: string;
  firstAidEye: string;
  disposalSpill: string;
  storage: string;
  fireClass: string;
}

const defaultSafety: ProductSafety = {
  hazardous: "May cause irritation to skin, eyes and respiratory tract. Handle with care.",
  precautionary: [
    "Keep away from heat, sparks and open flames.",
    "Keep container tightly closed.",
    "Wear protective gloves and eye protection.",
    "Use only in well-ventilated areas.",
  ],
  skinContact: "Wash with plenty of soap and water for at least 15 minutes. Remove contaminated clothing. Seek medical advice if irritation persists.",
  inhalationIngestion: "Inhalation \u2013 move to fresh air. Contact a doctor if symptoms persist.\nIngestion \u2013 rinse mouth with water. Do not induce vomiting. Seek medical attention.",
  firstAidEye: "Rinse cautiously with water for at least 15 minutes. Remove contact lenses if present. Seek medical attention.",
  disposalSpill: "Contain spill with inert absorbent material. Dispose of contents and container as per local regulations.",
  storage: "Cool, dry, well-ventilated place.",
  fireClass: "Use appropriate extinguisher for surrounding fire.",
};

const safetyData: Record<string, ProductSafety> = {
  "Isopropyl Alcohol (IPA)": {
    hazardous: "Highly flammable liquid and vapors. Causes serious eye irritation. May cause drowsiness or dizziness.",
    precautionary: [
      "Keep away from heat, sparks, flames and hot surfaces.",
      "No smoking. Keep container tightly closed.",
      "Ground / bond container and receiving equipment.",
      "Take precautionary measures against static discharge.",
      "Use non-sparking tools and equipment.",
    ],
    skinContact: "Remove contaminated clothes and shoes. Wash the area thoroughly with soap and water for at least 15 minutes. Do not apply neutralizing agents.",
    inhalationIngestion: "Inhalation \u2013 for any respiratory problem, contact a doctor.\nIngestion \u2013 rinse mouth with water. Do not induce vomiting.",
    firstAidEye: "Wash eyes thoroughly with plenty of water for at least 15 minutes. Seek medical attention immediately.",
    disposalSpill: "Eliminate all ignition sources. Absorb spill with inert material (sand/vermiculite). Dispose as per local regulations.",
    storage: "Cool, dry, ventilated. Away from ignition.",
    fireClass: "Class IB flammable liquid (UN 1219)",
  },

  "Isopropyl Alcohol": {
    hazardous: "Highly flammable liquid and vapors. Causes serious eye irritation. May cause drowsiness or dizziness.",
    precautionary: [
      "Keep away from heat, sparks, flames and hot surfaces.",
      "No smoking. Keep container tightly closed.",
      "Ground / bond container and receiving equipment.",
      "Take precautionary measures against static discharge.",
      "Use non-sparking tools and equipment.",
    ],
    skinContact: "Remove contaminated clothes and shoes. Wash the area thoroughly with soap and water for at least 15 minutes. Do not apply neutralizing agents.",
    inhalationIngestion: "Inhalation \u2013 for any respiratory problem, contact a doctor.\nIngestion \u2013 rinse mouth with water. Do not induce vomiting.",
    firstAidEye: "Wash eyes thoroughly with plenty of water for at least 15 minutes. Seek medical attention immediately.",
    disposalSpill: "Eliminate all ignition sources. Absorb spill with inert material (sand/vermiculite). Dispose as per local regulations.",
    storage: "Cool, dry, ventilated. Away from ignition.",
    fireClass: "Class IB flammable liquid (UN 1219)",
  },

  "ISO Propyl Alcohol Orderless": {
    hazardous: "Highly flammable liquid and vapors. Causes serious eye irritation. May cause drowsiness or dizziness.",
    precautionary: [
      "Keep away from heat, sparks, flames and hot surfaces.",
      "No smoking. Keep container tightly closed.",
      "Ground / bond container and receiving equipment.",
      "Take precautionary measures against static discharge.",
      "Use non-sparking tools and equipment.",
    ],
    skinContact: "Remove contaminated clothes and shoes. Wash the area thoroughly with soap and water for at least 15 minutes. Do not apply neutralizing agents.",
    inhalationIngestion: "Inhalation \u2013 for any respiratory problem, contact a doctor.\nIngestion \u2013 rinse mouth with water. Do not induce vomiting.",
    firstAidEye: "Wash eyes thoroughly with plenty of water for at least 15 minutes. Seek medical attention immediately.",
    disposalSpill: "Eliminate all ignition sources. Absorb spill with inert material (sand/vermiculite). Dispose as per local regulations.",
    storage: "Cool, dry, ventilated. Away from ignition.",
    fireClass: "Class IB flammable liquid (UN 1219)",
  },

  "Acetone": {
    hazardous: "Highly flammable liquid and vapors. Causes serious eye irritation. May cause drowsiness or dizziness.",
    precautionary: [
      "Keep away from heat, sparks, open flames and hot surfaces. No smoking.",
      "Keep container tightly closed.",
      "Ground / bond container and receiving equipment.",
      "Use explosion-proof ventilating and lighting equipment.",
      "Use non-sparking tools. Take measures against static discharge.",
    ],
    skinContact: "Wash with plenty of water. Remove contaminated clothing. If irritation persists, seek medical advice.",
    inhalationIngestion: "Inhalation \u2013 move to fresh air. If breathing is difficult, give oxygen.\nIngestion \u2013 rinse mouth. Do NOT induce vomiting. Call a poison center.",
    firstAidEye: "Rinse cautiously with water for at least 15 minutes. Remove contact lenses. Get medical attention.",
    disposalSpill: "Eliminate all ignition sources. Absorb with sand or vermiculite. Ventilate area. Dispose per local regulations.",
    storage: "Cool, dry, ventilated. Away from oxidizers.",
    fireClass: "Class IB flammable liquid (UN 1090)",
  },

  "Tertiary Butanol": {
    hazardous: "Highly flammable liquid and vapors. Causes eye and skin irritation. Harmful if inhaled.",
    precautionary: [
      "Keep away from heat, sparks, open flames and hot surfaces.",
      "Keep container tightly closed in a well-ventilated place.",
      "Ground / bond container and receiving equipment.",
      "Use explosion-proof electrical and ventilating equipment.",
      "Avoid breathing vapors. Use only outdoors or in ventilated area.",
    ],
    skinContact: "Remove contaminated clothes. Wash skin with soap and water for at least 15 minutes. Seek medical advice if irritation develops.",
    inhalationIngestion: "Inhalation \u2013 move to fresh air. Give oxygen if breathing is difficult.\nIngestion \u2013 rinse mouth. Do NOT induce vomiting. Seek medical attention.",
    firstAidEye: "Flush eyes with water for at least 15 minutes. Remove contact lenses. Seek medical attention immediately.",
    disposalSpill: "Eliminate ignition sources. Absorb with inert material. Ventilate area. Dispose per local regulations.",
    storage: "Cool, dry, ventilated. Away from ignition.",
    fireClass: "Class IB flammable liquid (UN 1120)",
  },

  "Methyl Ethyl Ketone": {
    hazardous: "Highly flammable liquid and vapors. Causes serious eye irritation. May cause drowsiness or dizziness.",
    precautionary: [
      "Keep away from heat, sparks, open flames and hot surfaces.",
      "Keep container tightly closed.",
      "Ground / bond container and receiving equipment.",
      "Use explosion-proof equipment. Take measures against static discharge.",
      "Avoid breathing vapors. Use in well-ventilated area.",
    ],
    skinContact: "Wash with soap and water. Remove contaminated clothing. Seek medical advice if irritation persists.",
    inhalationIngestion: "Inhalation \u2013 move to fresh air immediately. Contact a doctor.\nIngestion \u2013 rinse mouth with water. Do not induce vomiting.",
    firstAidEye: "Rinse with water for at least 15 minutes. Remove contact lenses. Seek medical attention.",
    disposalSpill: "Eliminate ignition sources. Absorb with inert material. Ventilate. Dispose per local regulations.",
    storage: "Cool, dry, ventilated. Away from oxidizers.",
    fireClass: "Class IB flammable liquid (UN 1193)",
  },

  "Toluene": {
    hazardous: "Highly flammable liquid and vapors. May be fatal if swallowed and enters airways. Causes skin irritation. May cause drowsiness or dizziness. May damage organs through prolonged exposure.",
    precautionary: [
      "Keep away from heat, sparks, open flames and hot surfaces.",
      "Keep container tightly closed. Ground / bond container.",
      "Do not breathe vapors. Use only outdoors or in ventilated area.",
      "Wear protective gloves, eye protection and face protection.",
      "Use explosion-proof equipment.",
    ],
    skinContact: "Remove contaminated clothes. Wash skin thoroughly with soap and water. Seek medical advice if irritation develops.",
    inhalationIngestion: "Inhalation \u2013 move to fresh air. Give oxygen if breathing is difficult.\nIngestion \u2013 do NOT induce vomiting. Aspiration hazard. Call poison center immediately.",
    firstAidEye: "Rinse with water for at least 15 minutes. Remove contact lenses. Seek medical attention.",
    disposalSpill: "Eliminate ignition sources. Absorb with sand. Prevent entry into drains. Dispose per local regulations.",
    storage: "Cool, dry, ventilated. Away from ignition.",
    fireClass: "Class IB flammable liquid (UN 1294)",
  },

  "Ethyl Acetate": {
    hazardous: "Highly flammable liquid and vapors. Causes serious eye irritation. May cause drowsiness or dizziness.",
    precautionary: [
      "Keep away from heat, sparks, open flames and hot surfaces.",
      "Keep container tightly closed.",
      "Ground / bond container and receiving equipment.",
      "Use explosion-proof ventilating and lighting equipment.",
      "Use non-sparking tools.",
    ],
    skinContact: "Wash with soap and water. Remove contaminated clothing. Seek medical advice if irritation persists.",
    inhalationIngestion: "Inhalation \u2013 move to fresh air. Contact a doctor if symptoms persist.\nIngestion \u2013 rinse mouth. Do not induce vomiting. Seek medical attention.",
    firstAidEye: "Rinse with water for at least 15 minutes. Remove contact lenses. Seek medical attention.",
    disposalSpill: "Eliminate ignition sources. Absorb with inert material. Ventilate. Dispose per local regulations.",
    storage: "Cool, dry, ventilated. Away from oxidizers.",
    fireClass: "Class IA flammable liquid (UN 1173)",
  },

  "Hydrogen Peroxide (50%)": {
    hazardous: "Causes severe skin burns and serious eye damage. May cause fire or explosion (strong oxidizer). Harmful if swallowed or inhaled.",
    precautionary: [
      "Keep away from heat, sparks and combustible materials.",
      "Keep container tightly closed in a well-ventilated place.",
      "Wear protective gloves, clothing, eye and face protection.",
      "Do not breathe mist, vapors or spray.",
      "Keep away from clothing and other combustible materials.",
    ],
    skinContact: "Remove contaminated clothes immediately. Rinse skin with water for at least 20 minutes. Seek immediate medical attention.",
    inhalationIngestion: "Inhalation \u2013 move to fresh air. Give oxygen if breathing is difficult. Call emergency.\nIngestion \u2013 rinse mouth. Do NOT induce vomiting. Seek medical attention immediately.",
    firstAidEye: "Rinse immediately with water for at least 20 minutes. Remove contact lenses. Seek emergency medical attention.",
    disposalSpill: "Contain spill. Flush with large amounts of water. Keep combustibles away. Dispose per local regulations.",
    storage: "Cool, dark place. Away from combustibles. Vent container periodically.",
    fireClass: "Oxidizer, not flammable (UN 2014)",
  },

  "Trichloroethylene (TCE)": {
    hazardous: "May cause cancer. Causes skin irritation. Causes serious eye irritation. May cause drowsiness or dizziness. May cause damage to organs through prolonged exposure.",
    precautionary: [
      "Obtain special instructions before use.",
      "Do not handle until all safety precautions have been read.",
      "Do not breathe vapors. Use only in well-ventilated area.",
      "Wear protective gloves, clothing and eye protection.",
      "Avoid release to the environment.",
    ],
    skinContact: "Remove contaminated clothes. Wash skin with soap and water for 15 minutes. Seek medical advice.",
    inhalationIngestion: "Inhalation \u2013 move to fresh air immediately. Call a doctor.\nIngestion \u2013 rinse mouth. Do NOT induce vomiting. Seek medical attention immediately.",
    firstAidEye: "Rinse with water for at least 15 minutes. Remove contact lenses. Get medical attention.",
    disposalSpill: "Ventilate area. Absorb with inert material. Prevent entry into drains. Dispose as hazardous waste.",
    storage: "Cool, dry, ventilated. Away from light and heat.",
    fireClass: "Non-flammable but toxic (UN 1710)",
  },

  "Methylene Dichloride": {
    hazardous: "May cause cancer. Causes skin irritation. Causes serious eye irritation. May cause drowsiness or dizziness.",
    precautionary: [
      "Obtain special instructions before use.",
      "Do not breathe vapors. Use only in well-ventilated area.",
      "Wear protective gloves, clothing and eye protection.",
      "Avoid release to the environment.",
      "Store in well-ventilated place. Keep container tightly closed.",
    ],
    skinContact: "Remove contaminated clothes. Wash skin with soap and water for 15 minutes. Seek medical advice.",
    inhalationIngestion: "Inhalation \u2013 move to fresh air immediately. Give oxygen if needed.\nIngestion \u2013 rinse mouth. Do NOT induce vomiting. Seek medical attention.",
    firstAidEye: "Rinse with water for at least 15 minutes. Remove contact lenses. Seek medical attention.",
    disposalSpill: "Ventilate area. Absorb with inert material. Prevent entry into drains. Dispose as hazardous waste.",
    storage: "Cool, dry, ventilated. Away from heat sources.",
    fireClass: "Non-flammable (UN 1593)",
  },

  "Caustic Potash": {
    hazardous: "Causes severe skin burns and serious eye damage. Harmful if swallowed.",
    precautionary: [
      "Do not breathe dust or mist.",
      "Wash hands thoroughly after handling.",
      "Wear protective gloves, clothing, eye and face protection.",
      "Store locked up in corrosion-resistant container.",
      "Keep only in original container.",
    ],
    skinContact: "Remove contaminated clothes immediately. Rinse skin with water for at least 20 minutes. Seek medical attention.",
    inhalationIngestion: "Inhalation \u2013 move to fresh air. If breathing is difficult, give oxygen.\nIngestion \u2013 rinse mouth. Do NOT induce vomiting. Seek immediate medical attention.",
    firstAidEye: "Rinse immediately with water for at least 20 minutes. Seek emergency medical attention.",
    disposalSpill: "Contain spill. Neutralize carefully. Avoid contact with skin. Dispose per local regulations.",
    storage: "Cool, dry place. In corrosion-resistant container.",
    fireClass: "Non-flammable, corrosive (UN 1813)",
  },

  "Mono Chloro Benzene": {
    hazardous: "Flammable liquid and vapor. Harmful if swallowed or inhaled. Causes skin and eye irritation. Toxic to aquatic life.",
    precautionary: [
      "Keep away from heat, sparks, open flames and hot surfaces.",
      "Keep container tightly closed.",
      "Avoid breathing vapors. Use in well-ventilated area.",
      "Wear protective gloves and eye protection.",
      "Avoid release to the environment.",
    ],
    skinContact: "Remove contaminated clothes. Wash skin with soap and water for 15 minutes. Seek medical advice.",
    inhalationIngestion: "Inhalation \u2013 move to fresh air. Contact a doctor.\nIngestion \u2013 rinse mouth. Do NOT induce vomiting. Seek medical attention.",
    firstAidEye: "Rinse with water for at least 15 minutes. Remove contact lenses. Seek medical attention.",
    disposalSpill: "Eliminate ignition sources. Absorb with inert material. Prevent entry into drains. Dispose per regulations.",
    storage: "Cool, dry, ventilated. Away from ignition.",
    fireClass: "Class II combustible liquid (UN 1134)",
  },

  "MIBK": {
    hazardous: "Highly flammable liquid and vapors. Causes serious eye irritation. May cause drowsiness or dizziness.",
    precautionary: [
      "Keep away from heat, sparks, open flames and hot surfaces.",
      "Keep container tightly closed.",
      "Ground / bond container and receiving equipment.",
      "Use explosion-proof equipment.",
      "Avoid breathing vapors.",
    ],
    skinContact: "Wash with soap and water. Remove contaminated clothing. Seek medical advice if irritation persists.",
    inhalationIngestion: "Inhalation \u2013 move to fresh air. Contact a doctor if symptoms persist.\nIngestion \u2013 rinse mouth. Do not induce vomiting.",
    firstAidEye: "Rinse with water for at least 15 minutes. Remove contact lenses. Seek medical attention.",
    disposalSpill: "Eliminate ignition sources. Absorb with inert material. Ventilate. Dispose per local regulations.",
    storage: "Cool, dry, ventilated. Away from oxidizers.",
    fireClass: "Class IB flammable liquid (UN 1245)",
  },

  "N Butanol": {
    hazardous: "Flammable liquid and vapor. Causes serious eye damage. May cause drowsiness or dizziness.",
    precautionary: [
      "Keep away from heat, sparks, open flames and hot surfaces.",
      "Keep container tightly closed.",
      "Avoid breathing vapors. Use in well-ventilated area.",
      "Wear protective gloves, eye and face protection.",
      "Use non-sparking tools.",
    ],
    skinContact: "Wash with soap and water for 15 minutes. Remove contaminated clothing. Seek medical advice if irritation develops.",
    inhalationIngestion: "Inhalation \u2013 move to fresh air. Give oxygen if breathing is difficult.\nIngestion \u2013 rinse mouth. Do NOT induce vomiting. Seek medical attention.",
    firstAidEye: "Rinse immediately with water for at least 20 minutes. Seek emergency medical attention.",
    disposalSpill: "Eliminate ignition sources. Absorb with inert material. Ventilate area. Dispose per local regulations.",
    storage: "Cool, dry, ventilated. Away from oxidizers.",
    fireClass: "Class IC flammable liquid (UN 1120)",
  },

  "THF": {
    hazardous: "Highly flammable liquid and vapors. Causes serious eye irritation. May cause drowsiness or dizziness. May form explosive peroxides.",
    precautionary: [
      "Keep away from heat, sparks, open flames and hot surfaces.",
      "Keep container tightly closed under inert gas.",
      "Ground / bond container and receiving equipment.",
      "Test for peroxides before distilling or evaporating.",
      "Use explosion-proof equipment.",
    ],
    skinContact: "Wash with soap and water. Remove contaminated clothing. Seek medical advice if irritation persists.",
    inhalationIngestion: "Inhalation \u2013 move to fresh air. Give oxygen if breathing is difficult.\nIngestion \u2013 rinse mouth. Do NOT induce vomiting. Seek medical attention.",
    firstAidEye: "Rinse with water for at least 15 minutes. Remove contact lenses. Seek medical attention.",
    disposalSpill: "Eliminate ignition sources. Absorb with inert material. Ventilate. Dispose per local regulations.",
    storage: "Cool, dry, ventilated. Under inert gas. Check for peroxides.",
    fireClass: "Class IB flammable liquid (UN 2056)",
  },

  "N-Propanol": {
    hazardous: "Highly flammable liquid and vapors. Causes serious eye irritation. May cause drowsiness or dizziness.",
    precautionary: [
      "Keep away from heat, sparks, open flames and hot surfaces.",
      "Keep container tightly closed.",
      "Ground / bond container and receiving equipment.",
      "Use non-sparking tools and equipment.",
      "Avoid breathing vapors.",
    ],
    skinContact: "Wash with soap and water. Remove contaminated clothing. Seek medical advice if irritation persists.",
    inhalationIngestion: "Inhalation \u2013 move to fresh air. Contact a doctor if symptoms persist.\nIngestion \u2013 rinse mouth. Do not induce vomiting.",
    firstAidEye: "Rinse with water for at least 15 minutes. Remove contact lenses. Seek medical attention.",
    disposalSpill: "Eliminate ignition sources. Absorb with inert material. Ventilate. Dispose per local regulations.",
    storage: "Cool, dry, ventilated. Away from ignition.",
    fireClass: "Class IB flammable liquid (UN 1274)",
  },

  "Isobutanol": {
    hazardous: "Flammable liquid and vapor. Causes serious eye damage. Causes skin irritation. May cause drowsiness or dizziness.",
    precautionary: [
      "Keep away from heat, sparks, open flames and hot surfaces.",
      "Keep container tightly closed.",
      "Avoid breathing vapors. Use in well-ventilated area.",
      "Wear protective gloves, eye and face protection.",
      "Use non-sparking tools.",
    ],
    skinContact: "Wash with soap and water for 15 minutes. Remove contaminated clothing. Seek medical advice if irritation persists.",
    inhalationIngestion: "Inhalation \u2013 move to fresh air. Give oxygen if breathing is difficult.\nIngestion \u2013 rinse mouth. Do NOT induce vomiting. Seek medical attention.",
    firstAidEye: "Rinse immediately with water for at least 20 minutes. Seek emergency medical attention.",
    disposalSpill: "Eliminate ignition sources. Absorb with inert material. Ventilate. Dispose per local regulations.",
    storage: "Cool, dry, ventilated. Away from oxidizers.",
    fireClass: "Class IC flammable liquid (UN 1212)",
  },
};

// Alias common paint thinners to same data
const thinnerSafety: ProductSafety = {
  hazardous: "Highly flammable liquid and vapors. Causes skin irritation. Harmful if inhaled. May cause drowsiness or dizziness.",
  precautionary: [
    "Keep away from heat, sparks, open flames and hot surfaces.",
    "Keep container tightly closed.",
    "Use only in well-ventilated area. Avoid breathing vapors.",
    "Wear protective gloves and eye protection.",
    "Use non-sparking tools and equipment.",
  ],
  skinContact: "Remove contaminated clothes. Wash skin with soap and water for at least 15 minutes. Seek medical advice if irritation persists.",
  inhalationIngestion: "Inhalation \u2013 move to fresh air immediately. Contact a doctor.\nIngestion \u2013 rinse mouth. Do NOT induce vomiting. Seek medical attention.",
  firstAidEye: "Rinse with water for at least 15 minutes. Remove contact lenses. Seek medical attention.",
  disposalSpill: "Eliminate ignition sources. Absorb with sand or vermiculite. Ventilate area. Dispose per local regulations.",
  storage: "Cool, dry, ventilated. Away from ignition.",
  fireClass: "Class IB flammable liquid",
};

safetyData["Paint Thinner"] = thinnerSafety;
safetyData["NC Thinner"] = thinnerSafety;
safetyData["Deco Thinner"] = thinnerSafety;
safetyData["PU Thinner"] = thinnerSafety;
safetyData["Pure Solvents"] = thinnerSafety;

export function getProductSafety(productName: string): ProductSafety {
  return safetyData[productName] ?? defaultSafety;
}
