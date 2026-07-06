/* ──────────────────────────────────────────────────────────────
   Material Safety Data Sheet (MSDS) content — 16-section GHS format.
   Keyed by the exact product name used in src/data/products.ts so the
   MSDS page can offer a product dropdown. Add new products by adding
   another entry with the same 16 sections.
   ────────────────────────────────────────────────────────────── */

export interface MsdsRow {
  label: string;
  value: string;
}

export interface MsdsTable {
  headers: string[];
  rows: string[][];
}

export interface MsdsSection {
  title: string;
  rows?: MsdsRow[];
  table?: MsdsTable;
}

export interface MsdsData {
  /** Display name shown as the document title. */
  productName: string;
  docRef: string;
  /** The 16 GHS sections, in order. */
  sections: MsdsSection[];
}

const COMPONENT_HEADERS = ["Hazardous Component", "CAS", "EINECS", "Symbol(s)", "R-phrase(s)", "Conc."];
const OEL_HEADERS = ["Material", "Source", "Type", "ppm", "mg/m³"];

/* ════════════════════════════ MIX XYLENE ════════════════════════════ */
const mixXylene: MsdsData = {
  productName: "Mix Xylene",
  docRef: "LXM/MSDS/MX-001",
  sections: [
    {
      title: "Identification of the Substance & Company",
      rows: [
        { label: "Material Name", value: "Mix Xylene" },
        { label: "Uses", value: "Solvent. Raw material for use in the chemical industry." },
        { label: "Synonyms", value: "Dimethyl benzenes · Xylene S · Mixed xylenes" },
      ],
    },
    {
      title: "Composition / Information on Ingredients",
      rows: [
        { label: "Material Formal Name", value: "Benzene, dimethyl" },
        { label: "CAS No.", value: "1330-20-7" },
        { label: "INDEX No.", value: "601-022-00-9" },
        { label: "EINECS No.", value: "215-535-7" },
      ],
      table: {
        headers: COMPONENT_HEADERS,
        rows: [
          ["Ethylbenzene", "100-41-4", "202-849-4", "F, Xn", "R11; R20", "40–85%"],
          ["Xylene, mixed isomers", "1330-20-7", "215-535-7", "Xn", "R10", "15–60%"],
        ],
      },
    },
    {
      title: "Hazards Identification",
      rows: [
        { label: "Health Hazards", value: "Harmful by inhalation and in contact with skin. Vapours may cause drowsiness and dizziness. Slightly irritating to the respiratory system. Irritating to skin. Moderately irritating to eyes. Harmful — may cause lung damage if swallowed. Possibility of organ damage from prolonged exposure. Target organs: Central Nervous System (CNS), Auditory system." },
        { label: "Signs & Symptoms", value: "Eye/skin irritation: burning, redness, swelling, blisters or blurred vision. If material enters the lungs: coughing, choking, wheezing, breathing difficulty (onset may be delayed). High vapour concentrations may cause CNS depression — dizziness, headache, nausea, loss of coordination; continued inhalation may cause unconsciousness and death. Auditory effects may include temporary hearing loss/ringing." },
        { label: "Safety Hazards", value: "Highly flammable. May form flammable/explosive vapour-air mixtures. Electrostatic discharge may cause fire." },
        { label: "Environmental", value: "Toxic to aquatic organisms." },
      ],
    },
    {
      title: "First Aid Measures",
      rows: [
        { label: "General", value: "Keep victim calm. Obtain medical treatment immediately." },
        { label: "Inhalation", value: "DO NOT DELAY. Remove to fresh air. If rapid recovery does not occur, transport to the nearest medical facility." },
        { label: "Skin Contact", value: "Remove contaminated clothing. Immediately flush skin with large amounts of water for at least 15 minutes, then wash with soap and water." },
        { label: "Eye Contact", value: "Immediately flush eyes with large amounts of water for at least 15 minutes while holding the eyelids open. Transport to a medical facility." },
        { label: "Ingestion", value: "DO NOT induce vomiting — transport to the nearest medical facility. If vomiting occurs, keep the head below the hips to prevent aspiration." },
        { label: "Advice to Physician", value: "Potential for chemical pneumonitis. Consider gastric lavage with protected airway and activated charcoal. Potential for cardiac sensitisation; consider oxygen therapy." },
      ],
    },
    {
      title: "Fire-Fighting Measures",
      rows: [
        { label: "Specific Hazards", value: "Vapour is heavier than air, spreads along the ground and distant ignition is possible. Will float and can be re-ignited on surface water. Carbon monoxide may be evolved on incomplete combustion." },
        { label: "Extinguishing Media", value: "Foam, water spray or fog. Dry chemical powder, carbon dioxide, sand or earth for small fires only." },
        { label: "Unsuitable Media", value: "Do not use water in a jet." },
        { label: "Protective Equipment", value: "Wear full protective clothing and self-contained breathing apparatus. Keep adjacent containers cool by spraying with water." },
      ],
    },
    {
      title: "Accidental Release Measures",
      rows: [
        { label: "Protective Measures", value: "Isolate the hazard area; deny entry to unprotected personnel. Stay upwind, out of low areas. Remove ignition sources. Prevent entry into drains or watercourses using sand/earth. Bond and ground all equipment. Ventilate the area." },
        { label: "Clean-Up", value: "Large spills (> 1 drum): transfer by mechanical means (vacuum truck) to a salvage tank. Small spills: transfer to a labelled sealable container; soak residues with absorbent and dispose of safely. Remove contaminated soil." },
        { label: "Additional Advice", value: "Notify authorities if exposure to the public or environment occurs. Vapour is heavier than air and may form an explosive mixture." },
      ],
    },
    {
      title: "Handling & Storage",
      rows: [
        { label: "Handling", value: "Avoid inhaling vapour/mist and contact with skin, eyes and clothing. Extinguish naked flames; no smoking; remove ignition sources. Bond and ground all equipment. Restrict line velocity during pumping. Avoid splash filling. Do NOT use compressed air for filling/discharging." },
        { label: "Storage", value: "Store in a diked (bunded), well-ventilated area away from sunlight, ignition sources and heat. Keep away from oxidising agents and corrosives. Vapour is heavier than air — beware accumulation in pits and confined spaces. Temperature: ambient." },
        { label: "Recommended Materials", value: "Mild steel or stainless steel for containers / linings." },
        { label: "Unsuitable Materials", value: "Natural, butyl, neoprene or nitrile rubbers." },
        { label: "Container Advice", value: "Even emptied containers can contain explosive vapours. Do not cut, drill, grind or weld containers." },
      ],
    },
    {
      title: "Exposure Controls / Personal Protection",
      table: {
        headers: OEL_HEADERS,
        rows: [
          ["Ethylbenzene", "ACGIH", "TWA / STEL", "100 / 125", "—"],
          ["Ethylbenzene", "SG OEL", "TWA / STEL", "100 / 125", "434 / 543"],
          ["Xylene, mixed isomers", "ACGIH", "TWA / STEL", "100 / 150", "—"],
          ["Xylene, mixed isomers", "SG OEL", "TWA / STEL", "100 / 150", "434 / 651"],
        ],
      },
      rows: [
        { label: "Exposure Controls", value: "Use sealed systems where possible. Adequate explosion-proof and local exhaust ventilation. Provide eye washes and safety showers." },
        { label: "Respiratory", value: "Where controls are inadequate, use a full-face mask with a filter for organic gases/vapours (EN141). For high concentrations use positive-pressure breathing apparatus." },
        { label: "Hand Protection", value: "Gloves to EN374. Long-term: Viton. Splash protection: nitrile rubber. Replace contaminated gloves." },
        { label: "Eye Protection", value: "Chemical splash goggles (monogoggles) to EN166." },
        { label: "Protective Clothing", value: "Chemical-resistant gloves, boots and apron; one-piece overall with hood for spill clean-up." },
      ],
    },
    {
      title: "Physical & Chemical Properties",
      rows: [
        { label: "Appearance", value: "Colourless liquid" },
        { label: "Odour", value: "Aromatic" },
        { label: "Boiling Point", value: "136–145 °C" },
        { label: "Flash Point", value: "23–27 °C (Abel)" },
        { label: "Flammability Limits", value: "1 – 7.1 %(V) in air" },
        { label: "Auto-ignition", value: "432–530 °C" },
        { label: "Vapour Pressure", value: "≈ 0.8–1.2 kPa at 20 °C" },
        { label: "Density", value: "≈ 870 kg/m³ at 15 °C" },
        { label: "Water Solubility", value: "0.175 kg/m³ (slight)" },
        { label: "Molecular Weight", value: "106 g/mol" },
      ],
    },
    {
      title: "Stability & Reactivity",
      rows: [
        { label: "Stability", value: "Stable under normal conditions of use. Reacts violently with strong oxidising agents." },
        { label: "Conditions to Avoid", value: "Heat, sparks, open flames and other ignition sources. Prevent vapour accumulation." },
        { label: "Materials to Avoid", value: "Strong oxidising agents." },
        { label: "Decomposition Products", value: "Combustion evolves carbon monoxide, carbon dioxide and other organic compounds." },
      ],
    },
    {
      title: "Toxicological Information",
      rows: [
        { label: "Acute Oral", value: "Low toxicity: LD50 > 2000 mg/kg (Rat). Aspiration into the lungs may cause chemical pneumonitis, which can be fatal." },
        { label: "Acute Dermal", value: "Low toxicity: LD50 > 2000 mg/kg (Rabbit). Classified harmful under EC criteria." },
        { label: "Acute Inhalation", value: "Low toxicity: LC50 > 20 mg/l / 4 h (Rat). High concentrations may cause CNS depression." },
        { label: "Skin / Eye", value: "Irritating to skin. Moderately irritating to eyes." },
        { label: "Carcinogenicity", value: "Increased tumour incidence observed in the CNS (animal data)." },
      ],
    },
    {
      title: "Ecological Information",
      rows: [
        { label: "Acute Toxicity", value: "Toxic — Fish, aquatic invertebrates and algae: 1 < LC/EC/IC50 ≤ 10 mg/l." },
        { label: "Mobility", value: "Highly mobile in soil; may contaminate groundwater. Floats on water." },
        { label: "Persistence", value: "Readily biodegradable. Oxidises rapidly by photochemical reactions in air." },
        { label: "Bioaccumulation", value: "Does not bioaccumulate significantly." },
      ],
    },
    {
      title: "Disposal Considerations",
      rows: [
        { label: "Material Disposal", value: "Recover or recycle if possible. Do not dispose into the environment, drains or watercourses. The waste generator is responsible for correct classification and disposal." },
        { label: "Container Disposal", value: "Drain thoroughly; vent in a safe place away from sparks. Do not puncture, cut or weld uncleaned drums. Send to a drum recoverer or metal reclaimer." },
        { label: "Local Legislation", value: "Dispose in accordance with applicable regional, national and local laws." },
      ],
    },
    {
      title: "Transport Information",
      rows: [
        { label: "UN No.", value: "UN 1307" },
        { label: "Proper Shipping Name", value: "XYLENES" },
        { label: "Class / Division", value: "3 (Flammable liquid)" },
        { label: "Packing Group", value: "III" },
        { label: "Marine Pollutant", value: "No" },
      ],
    },
    {
      title: "Regulatory Information",
      rows: [
        { label: "EC Classification", value: "Flammable. Harmful." },
        { label: "EC Symbols", value: "Xn — Harmful" },
        { label: "Risk Phrases", value: "R10 · R20/21 · R38" },
        { label: "Safety Phrases", value: "S25 Avoid contact with eyes" },
        { label: "Inventories", value: "Listed on AICS, DSL, TSCA, EINECS (215-535-7), KECI, PICCS." },
      ],
    },
    {
      title: "Other Information",
      rows: [
        { label: "R10", value: "Flammable" },
        { label: "R11", value: "Highly flammable" },
        { label: "R20/21", value: "Harmful by inhalation and in contact with skin" },
        { label: "R38", value: "Irritating to skin" },
      ],
    },
  ],
};

/* ════════════════════════ ISOPROPYL ALCOHOL (IPA) ════════════════════════ */
const ipa: MsdsData = {
  productName: "Isopropyl Alcohol (IPA)",
  docRef: "LXM/MSDS/IPA-001",
  sections: [
    {
      title: "Product & Company Identification",
      rows: [
        { label: "Material Name", value: "Isopropyl Alcohol (IPA)" },
        { label: "Product Description", value: "Oxygenated Hydrocarbon" },
        { label: "Intended Use", value: "Solvent" },
        { label: "Synonyms", value: "Propan-2-ol · Isopropanol · 2-Propanol" },
      ],
    },
    {
      title: "Composition / Information on Ingredients",
      rows: [
        { label: "CAS No.", value: "67-63-0" },
        { label: "EINECS No.", value: "200-661-7" },
        { label: "Molecular Formula", value: "C₃H₈O" },
      ],
      table: {
        headers: COMPONENT_HEADERS,
        rows: [
          ["Isopropyl Alcohol", "67-63-0", "200-661-7", "F, Xi", "R11; R36; R67", "100%"],
        ],
      },
    },
    {
      title: "Hazards Identification",
      rows: [
        { label: "Classification", value: "Considered hazardous according to regulatory guidelines (see Section 15)." },
        { label: "Physical / Chemical", value: "Flammable. Material can release vapours that readily form flammable mixtures. Vapour accumulation could flash and/or explode if ignited." },
        { label: "Health Effects", value: "Irritating to eyes. If swallowed, may be aspirated and cause lung damage. Excessive exposure may result in eye, skin or respiratory irritation. May cause central nervous system depression." },
        { label: "Target Organs", value: "Eye" },
        { label: "NFPA / HMIS", value: "Health 1 · Flammability 3 · Reactivity 0" },
      ],
    },
    {
      title: "First Aid Measures",
      rows: [
        { label: "Inhalation", value: "Remove from further exposure; use adequate respiratory protection. If respiratory irritation, dizziness, nausea or unconsciousness occurs, seek immediate medical assistance. If breathing has stopped, assist ventilation." },
        { label: "Skin Contact", value: "Wash contact areas with soap and water. Remove contaminated clothing and launder before reuse." },
        { label: "Eye Contact", value: "Flush thoroughly with water for at least 15 minutes. Get medical assistance." },
        { label: "Ingestion", value: "Seek immediate medical attention. Do NOT induce vomiting." },
        { label: "Note to Physician", value: "If ingested, material may be aspirated into the lungs and cause chemical pneumonitis. Treat appropriately." },
      ],
    },
    {
      title: "Fire-Fighting Measures",
      rows: [
        { label: "Extinguishing Media", value: "Water fog, foam, dry chemical or carbon dioxide (CO₂)." },
        { label: "Unsuitable Media", value: "Straight streams of water." },
        { label: "Fire Fighting", value: "Evacuate the area. Use water spray to disperse vapours and to cool fire-exposed surfaces. Prevent runoff from entering streams, sewers or drinking water. Use self-contained breathing apparatus (SCBA) in enclosed spaces." },
        { label: "Unusual Hazards", value: "Highly flammable. Vapours are heavier than air and may travel across the ground to remote ignition sources, causing flashback." },
        { label: "Combustion Products", value: "Smoke, fume, incomplete combustion products, oxides of carbon." },
        { label: "Flammability", value: "Flash point 12 °C (54 °F, ASTM D-56) · LEL 2.0% / UEL 12.7% · auto-ignition > 350 °C." },
      ],
    },
    {
      title: "Accidental Release Measures",
      rows: [
        { label: "Notification", value: "In the event of a spill, notify relevant authorities in accordance with all applicable regulations." },
        { label: "Protective Measures", value: "Avoid contact with spilled material. Warn or evacuate occupants in surrounding and downwind areas if required due to flammability." },
        { label: "Land Spill", value: "Eliminate all ignition sources (no smoking, flares, sparks or flames). Stop the leak if safe. Ground all equipment. Prevent entry into waterways, sewers, basements or confined areas. A vapour-suppressing foam may reduce vapours. Absorb/cover with dry earth or sand and transfer to containers; recover large spills by pumping." },
        { label: "Water Spill", value: "Stop the leak if safe. Eliminate ignition sources. Warn other shipping. Seek specialist advice before using dispersants." },
        { label: "Environmental", value: "Dike far ahead of the liquid spill for later recovery. Prevent entry into waterways, sewers, basements or confined areas." },
      ],
    },
    {
      title: "Handling & Storage",
      rows: [
        { label: "Handling", value: "Avoid contact with eyes. Prevent exposure to ignition sources — use non-sparking tools and explosion-proof equipment. Use only with adequate ventilation. Use proper bonding and grounding. Peroxides may form on prolonged storage; light, heat or air increase peroxide formation. Loading/unloading temperature: ambient." },
        { label: "Storage", value: "Keep container closed; open slowly to control possible pressure release. Store in a cool, well-ventilated area — outside or detached storage preferred. Ground and bond storage and transfer containers. Ample fire-water supply / fixed sprinkler recommended. Storage temperature: ambient." },
        { label: "Suitable Materials", value: "Carbon steel, stainless steel, polyester, Teflon, polyethylene, polypropylene, epoxy phenolic, vinyls." },
        { label: "Unsuitable Materials", value: "Aluminium, cast iron, polystyrene, EPDM, Monel, butyl rubber, natural rubber." },
      ],
    },
    {
      title: "Exposure Controls / Personal Protection",
      table: {
        headers: OEL_HEADERS,
        rows: [
          ["Isopropyl Alcohol", "OSHA Z1", "TWA", "400", "980"],
          ["Isopropyl Alcohol", "ACGIH", "TWA", "200", "—"],
          ["Isopropyl Alcohol", "ACGIH", "STEL", "400", "—"],
        ],
      },
      rows: [
        { label: "Engineering Controls", value: "Provide adequate, explosion-proof ventilation so that exposure limits are not exceeded." },
        { label: "Respiratory", value: "Half-face filter respirator where engineering controls are inadequate. For high airborne concentrations, use an approved supplied-air respirator in positive-pressure mode." },
        { label: "Hand Protection", value: "Chemical-resistant gloves for prolonged or repeated contact; gauntlet-style gloves if forearm contact is likely. Inspect and replace worn gloves." },
        { label: "Eye Protection", value: "Chemical goggles." },
        { label: "Skin & Body", value: "Chemical- and oil-resistant clothing for prolonged or repeated contact." },
      ],
    },
    {
      title: "Physical & Chemical Properties",
      rows: [
        { label: "Physical State", value: "Liquid" },
        { label: "Form / Colour", value: "Clear, colourless" },
        { label: "Odour", value: "Alcohol" },
        { label: "Relative Density (20 °C)", value: "0.786" },
        { label: "Density (20 °C)", value: "785 kg/m³" },
        { label: "Boiling Point", value: "82 – 83 °C" },
        { label: "Flash Point", value: "12 °C (ASTM D-56)" },
        { label: "Flammability Limits", value: "LEL 2.0% / UEL 12.7%" },
        { label: "Auto-ignition", value: "> 350 °C" },
        { label: "Vapour Pressure", value: "4.3 kPa at 20 °C" },
        { label: "Vapour Density", value: "> 1 (air = 1)" },
        { label: "Evaporation Rate", value: "1.2 (n-butyl acetate = 1)" },
        { label: "Solubility in Water", value: "Complete (miscible)" },
        { label: "Viscosity", value: "2.65 cSt at 25 °C" },
        { label: "Freezing Point", value: "−85 °C" },
        { label: "Molecular Weight", value: "60 g/mol" },
        { label: "Hygroscopic", value: "Yes" },
      ],
    },
    {
      title: "Stability & Reactivity",
      rows: [
        { label: "Stability", value: "Stable under normal conditions. Under normal storage, peroxides may accumulate and explode when subjected to heat or shock; distillation or evaporation increases the explosion hazard." },
        { label: "Conditions to Avoid", value: "Heat, sparks, open flames and other ignition sources." },
        { label: "Materials to Avoid", value: "Aldehydes, amines, strong oxidisers, caustics, chlorinated compounds, alkanolamines." },
        { label: "Decomposition Products", value: "Material does not decompose at ambient temperatures." },
        { label: "Hazardous Polymerisation", value: "Will not occur." },
      ],
    },
    {
      title: "Toxicological Information",
      rows: [
        { label: "Inhalation", value: "Minimally toxic. Vapours, mists or fumes may irritate the eyes, nose, throat or lungs." },
        { label: "Ingestion", value: "Minimally toxic. Aspiration may cause chemical pneumonitis or pulmonary edema." },
        { label: "Skin", value: "Minimally toxic; mildly irritating to skin with prolonged exposure." },
        { label: "Eye", value: "Irritating and will injure eye tissue." },
        { label: "Chronic Effects", value: "Vapour above recommended exposure levels irritates the eyes and respiratory tract, may cause headache, dizziness and other CNS effects. Prolonged/repeated skin contact may defat the skin, causing irritation and dermatitis." },
      ],
    },
    {
      title: "Ecological Information",
      rows: [
        { label: "Ecotoxicity", value: "Not expected to be harmful to aquatic organisms." },
        { label: "Mobility", value: "Expected to remain in water or migrate through soil." },
        { label: "Persistence", value: "Expected to be readily biodegradable. Degrades at a moderate rate in air." },
        { label: "VOC (EPA Method 24)", value: "6.551 lbs/gal" },
      ],
    },
    {
      title: "Disposal Considerations",
      rows: [
        { label: "Material Disposal", value: "Suitable for burning in an enclosed controlled burner for fuel value, or disposal by supervised high-temperature incineration. Must comply with applicable laws and regulations." },
        { label: "RCRA Information", value: "Disposal may be subject to RCRA (40 CFR 261). Potential RCRA characteristic: IGNITABILITY." },
        { label: "Empty Containers", value: "Empty containers may contain residue and can be dangerous. Do NOT pressurise, cut, weld, braze, solder, drill, grind or expose to heat, flame or ignition sources — they may explode. Send for recycling or disposal via a licensed contractor." },
      ],
    },
    {
      title: "Transport Information",
      rows: [
        { label: "UN No.", value: "UN 1219" },
        { label: "Proper Shipping Name", value: "ISOPROPANOL (ISOPROPYL ALCOHOL)" },
        { label: "Hazard Class & Division", value: "3" },
        { label: "Packing Group", value: "II" },
        { label: "Labels", value: "3" },
        { label: "Transport Document", value: "UN1219, ISOPROPANOL, 3, PG II" },
      ],
    },
    {
      title: "Regulatory Information",
      rows: [
        { label: "OSHA Hazard Communication", value: "When used for its intended purpose, this material is classified as hazardous in accordance with OSHA 29 CFR 1910.1200." },
        { label: "Inventory Listings", value: "AICS, IECSC, DSL, EINECS, ENCS, KECI, PICCS, TSCA." },
        { label: "SARA (311/312)", value: "Fire · Immediate Health · Delayed Health." },
        { label: "SARA (313)", value: "Contains no chemicals subject to SARA 313 supplier notification." },
      ],
    },
    {
      title: "Other Information",
      rows: [
        { label: "Signal Word", value: "WARNING!" },
        { label: "Health Hazards", value: "Irritating to eyes. If swallowed, may be aspirated and cause lung damage. Target organ: Eye." },
        { label: "Physical Hazards", value: "Flammable." },
        { label: "Key", value: "N/D = Not determined · N/A = Not applicable." },
      ],
    },
  ],
};

/* ════════════════════════════ ACETONE (ACT) ════════════════════════════ */
const acetone: MsdsData = {
  productName: "Acetone (ACT)",
  docRef: "LXM/MSDS/ACT-001",
  sections: [
    {
      title: "Identification of the Substance & Company",
      rows: [
        { label: "Material Name", value: "Acetone (ACT)" },
        { label: "Uses", value: "Solvent for cleaning and degreasing. Raw material in the chemical, pharmaceutical and electronics industries." },
        { label: "Synonyms", value: "Propan-2-one · Dimethyl ketone · 2-Propanone" },
      ],
    },
    {
      title: "Composition / Information on Ingredients",
      rows: [
        { label: "Material Formal Name", value: "Propan-2-one" },
        { label: "CAS No.", value: "67-64-1" },
        { label: "INDEX No.", value: "606-001-00-8" },
        { label: "EINECS No.", value: "200-662-2" },
        { label: "Molecular Formula", value: "C₃H₆O" },
      ],
      table: {
        headers: COMPONENT_HEADERS,
        rows: [
          ["Acetone", "67-64-1", "200-662-2", "F, Xi", "R11; R36; R66; R67", "> 99%"],
        ],
      },
    },
    {
      title: "Hazards Identification",
      rows: [
        { label: "Health Hazards", value: "Causes serious eye irritation. May cause drowsiness or dizziness. Repeated exposure may cause skin dryness or cracking. High vapour concentrations may cause headache, nausea and CNS depression." },
        { label: "Safety Hazards", value: "Highly flammable liquid and vapour. Vapours are heavier than air, may form explosive mixtures, travel to ignition sources and flash back." },
        { label: "Environmental", value: "Not classified as environmentally hazardous; prevent large releases entering watercourses." },
      ],
    },
    {
      title: "First Aid Measures",
      rows: [
        { label: "Inhalation", value: "Remove to fresh air. If breathing is difficult, give oxygen. Obtain medical attention if symptoms persist." },
        { label: "Skin Contact", value: "Remove contaminated clothing. Wash skin with soap and water. Apply moisturiser; seek advice if irritation persists." },
        { label: "Eye Contact", value: "Rinse cautiously with water for at least 15 minutes, holding the eyelids open. Remove contact lenses if present. Seek medical attention." },
        { label: "Ingestion", value: "Do NOT induce vomiting. Rinse mouth. Never give anything by mouth to an unconscious person. Seek immediate medical attention." },
      ],
    },
    {
      title: "Fire-Fighting Measures",
      rows: [
        { label: "Extinguishing Media", value: "Alcohol-resistant foam, dry chemical powder, carbon dioxide or water fog." },
        { label: "Unsuitable Media", value: "Do not use a direct water jet." },
        { label: "Specific Hazards", value: "Highly flammable. Vapour is heavier than air and travels to ignition sources. Containers may explode on heating." },
        { label: "Protective Equipment", value: "Self-contained breathing apparatus and full protective clothing. Cool exposed containers with water spray." },
      ],
    },
    {
      title: "Accidental Release Measures",
      rows: [
        { label: "Protective Measures", value: "Eliminate all ignition sources. Ventilate the area and avoid breathing vapour. Wear protective equipment." },
        { label: "Clean-Up", value: "Absorb with inert material (sand, vermiculite) and transfer to a sealable container. Prevent entry into drains and watercourses." },
      ],
    },
    {
      title: "Handling & Storage",
      rows: [
        { label: "Handling", value: "Keep away from heat, sparks and open flames — no smoking. Use only in well-ventilated areas. Bond and ground equipment against static. Avoid contact with skin and eyes." },
        { label: "Storage", value: "Store in a cool, dry, well-ventilated place away from ignition sources and oxidisers. Keep container tightly closed and upright." },
      ],
    },
    {
      title: "Exposure Controls / Personal Protection",
      table: {
        headers: OEL_HEADERS,
        rows: [
          ["Acetone", "ACGIH", "TWA", "250", "—"],
          ["Acetone", "ACGIH", "STEL", "500", "—"],
        ],
      },
      rows: [
        { label: "Exposure Controls", value: "Adequate ventilation, including local exhaust, to keep vapour below the exposure limits. Provide eye wash and safety shower." },
        { label: "Respiratory", value: "Where ventilation is inadequate, wear a respirator with an organic-vapour cartridge." },
        { label: "Hand / Eye / Body", value: "Butyl-rubber gloves (acetone permeates nitrile quickly), chemical splash goggles and protective clothing." },
      ],
    },
    {
      title: "Physical & Chemical Properties",
      rows: [
        { label: "Appearance", value: "Colourless liquid" },
        { label: "Odour", value: "Characteristic, sweetish (mint-like)" },
        { label: "Boiling Point", value: "56 °C" },
        { label: "Flash Point", value: "−20 °C (closed cup)" },
        { label: "Flammability Limits", value: "2.5 – 13 %(V) in air" },
        { label: "Auto-ignition", value: "465 °C" },
        { label: "Vapour Pressure", value: "≈ 24 kPa at 20 °C" },
        { label: "Density", value: "≈ 790 kg/m³ at 20 °C" },
        { label: "Water Solubility", value: "Fully miscible" },
        { label: "Molecular Weight", value: "58.08 g/mol" },
      ],
    },
    {
      title: "Stability & Reactivity",
      rows: [
        { label: "Stability", value: "Stable under normal conditions of use." },
        { label: "Conditions to Avoid", value: "Heat, sparks, open flames and ignition sources." },
        { label: "Materials to Avoid", value: "Strong oxidising agents, strong acids and bases, chloroform, bromoform." },
        { label: "Decomposition Products", value: "Carbon monoxide and carbon dioxide on combustion." },
      ],
    },
    {
      title: "Toxicological Information",
      rows: [
        { label: "Acute Oral", value: "Low toxicity: LD50 ≈ 5800 mg/kg (Rat)." },
        { label: "Skin / Eye", value: "Causes serious eye irritation; repeated contact defats and dries the skin." },
        { label: "Inhalation", value: "High concentrations cause CNS depression — headache, dizziness, nausea." },
        { label: "Sensitisation", value: "Not expected to be a skin sensitiser." },
      ],
    },
    {
      title: "Ecological Information",
      rows: [
        { label: "Aquatic Toxicity", value: "Low toxicity to aquatic organisms." },
        { label: "Persistence", value: "Readily biodegradable." },
        { label: "Bioaccumulation", value: "Does not bioaccumulate significantly." },
      ],
    },
    {
      title: "Disposal Considerations",
      rows: [
        { label: "Material Disposal", value: "Recover or recycle if possible. Dispose of as flammable waste per local regulations. Do not discharge to drains or watercourses." },
        { label: "Container Disposal", value: "Empty containers retain flammable vapour. Do not cut, weld or grind. Send to an approved drum recoverer." },
      ],
    },
    {
      title: "Transport Information",
      rows: [
        { label: "UN No.", value: "UN 1090" },
        { label: "Proper Shipping Name", value: "ACETONE" },
        { label: "Class / Division", value: "3 (Flammable liquid)" },
        { label: "Packing Group", value: "II" },
        { label: "Marine Pollutant", value: "No" },
      ],
    },
    {
      title: "Regulatory Information",
      rows: [
        { label: "EC Classification", value: "Highly flammable. Irritant." },
        { label: "EC Symbols", value: "F — Highly flammable · Xi — Irritant" },
        { label: "Risk Phrases", value: "R11 · R36 · R66 · R67" },
        { label: "Safety Phrases", value: "S9 · S16 · S26" },
      ],
    },
    {
      title: "Other Information",
      rows: [
        { label: "R11", value: "Highly flammable" },
        { label: "R36", value: "Irritating to eyes" },
        { label: "R66", value: "Repeated exposure may cause skin dryness or cracking" },
        { label: "R67", value: "Vapours may cause drowsiness and dizziness" },
      ],
    },
  ],
};

/* ════════════════════════════ ETHYL ACETATE (EA) ════════════════════════════ */
const ethylAcetate: MsdsData = {
  productName: "Ethyl Acetate (EA)",
  docRef: "LXM/MSDS/EA-001",
  sections: [
    {
      title: "Identification of the Substance & Company",
      rows: [
        { label: "Material Name", value: "Ethyl Acetate (EA)" },
        { label: "Uses", value: "Solvent for paints, coatings, inks and adhesives. Raw material for use in the chemical industry." },
        { label: "Synonyms", value: "Acetic acid ethyl ester · Ethyl ethanoate" },
      ],
    },
    {
      title: "Composition / Information on Ingredients",
      rows: [
        { label: "Material Formal Name", value: "Ethyl acetate" },
        { label: "CAS No.", value: "141-78-6" },
        { label: "INDEX No.", value: "607-022-00-5" },
        { label: "EINECS No.", value: "205-500-4" },
        { label: "Molecular Formula", value: "C₄H₈O₂" },
      ],
      table: {
        headers: COMPONENT_HEADERS,
        rows: [
          ["Ethyl Acetate", "141-78-6", "205-500-4", "F, Xi", "R11; R36; R66; R67", "> 99%"],
        ],
      },
    },
    {
      title: "Hazards Identification",
      rows: [
        { label: "Health Hazards", value: "Causes serious eye irritation. May cause drowsiness or dizziness. Repeated exposure may cause skin dryness or cracking. Vapours irritate the respiratory tract." },
        { label: "Safety Hazards", value: "Highly flammable liquid and vapour. Vapours are heavier than air, may form explosive mixtures, travel to ignition sources and flash back." },
        { label: "Environmental", value: "Not classified as environmentally hazardous; prevent large releases entering watercourses." },
      ],
    },
    {
      title: "First Aid Measures",
      rows: [
        { label: "Inhalation", value: "Remove to fresh air. If breathing is difficult, give oxygen. Obtain medical attention if symptoms persist." },
        { label: "Skin Contact", value: "Remove contaminated clothing. Wash skin with soap and water. Seek medical advice if irritation develops." },
        { label: "Eye Contact", value: "Rinse cautiously with water for at least 15 minutes, holding the eyelids open. Remove contact lenses if present. Seek medical attention." },
        { label: "Ingestion", value: "Do NOT induce vomiting. Rinse mouth. Never give anything by mouth to an unconscious person. Seek immediate medical attention." },
      ],
    },
    {
      title: "Fire-Fighting Measures",
      rows: [
        { label: "Extinguishing Media", value: "Alcohol-resistant foam, dry chemical powder, carbon dioxide or water fog." },
        { label: "Unsuitable Media", value: "Do not use a direct water jet." },
        { label: "Specific Hazards", value: "Highly flammable. Vapour is heavier than air and may travel to ignition sources and flash back. Containers may explode on heating." },
        { label: "Protective Equipment", value: "Self-contained breathing apparatus and full protective clothing. Cool exposed containers with water spray." },
      ],
    },
    {
      title: "Accidental Release Measures",
      rows: [
        { label: "Protective Measures", value: "Eliminate all ignition sources. Ventilate the area and avoid breathing vapour. Wear protective equipment." },
        { label: "Clean-Up", value: "Absorb with inert material (sand, vermiculite) and transfer to a sealable container. Prevent entry into drains and watercourses." },
      ],
    },
    {
      title: "Handling & Storage",
      rows: [
        { label: "Handling", value: "Keep away from heat, sparks and open flames — no smoking. Use only in well-ventilated areas. Bond and ground equipment against static. Avoid contact with skin and eyes." },
        { label: "Storage", value: "Store in a cool, dry, well-ventilated place away from ignition sources and oxidisers. Keep container tightly closed and upright." },
      ],
    },
    {
      title: "Exposure Controls / Personal Protection",
      table: {
        headers: OEL_HEADERS,
        rows: [
          ["Ethyl Acetate", "ACGIH", "TWA", "400", "1440"],
          ["Ethyl Acetate", "OSHA Z1", "TWA", "400", "1400"],
        ],
      },
      rows: [
        { label: "Engineering Controls", value: "Adequate, explosion-proof ventilation to keep vapour below the exposure limits. Provide eye wash and safety shower." },
        { label: "Respiratory", value: "Where ventilation is inadequate, wear a respirator with an organic-vapour cartridge." },
        { label: "Hand / Eye / Body", value: "Gloves resistant to esters (e.g. butyl rubber); chemical splash goggles; protective clothing." },
      ],
    },
    {
      title: "Physical & Chemical Properties",
      rows: [
        { label: "Appearance", value: "Colourless liquid" },
        { label: "Odour", value: "Characteristic fruity / sweet (ester)" },
        { label: "Boiling Point", value: "77 °C" },
        { label: "Flash Point", value: "−4 °C (closed cup)" },
        { label: "Flammability Limits", value: "2.0 – 11.5 %(V) in air" },
        { label: "Auto-ignition", value: "426 °C" },
        { label: "Vapour Pressure", value: "≈ 9.7 kPa at 20 °C" },
        { label: "Density", value: "≈ 902 kg/m³ at 20 °C" },
        { label: "Vapour Density", value: "3.04 (air = 1)" },
        { label: "Water Solubility", value: "Moderate (≈ 8 g / 100 ml)" },
        { label: "Molecular Weight", value: "88.1 g/mol" },
      ],
    },
    {
      title: "Stability & Reactivity",
      rows: [
        { label: "Stability", value: "Stable under normal conditions of use." },
        { label: "Conditions to Avoid", value: "Heat, sparks, open flames and ignition sources." },
        { label: "Materials to Avoid", value: "Strong oxidising agents, strong acids and bases, nitrates." },
        { label: "Decomposition Products", value: "Carbon monoxide and carbon dioxide on combustion." },
        { label: "Hazardous Polymerisation", value: "Will not occur." },
      ],
    },
    {
      title: "Toxicological Information",
      rows: [
        { label: "Acute Oral", value: "Low toxicity: LD50 ≈ 5620 mg/kg (Rat)." },
        { label: "Skin / Eye", value: "Causes serious eye irritation; repeated contact defats and dries the skin." },
        { label: "Inhalation", value: "High concentrations cause CNS depression — headache, dizziness, narcosis." },
        { label: "Sensitisation", value: "Not expected to be a skin sensitiser." },
      ],
    },
    {
      title: "Ecological Information",
      rows: [
        { label: "Aquatic Toxicity", value: "Low toxicity to aquatic organisms." },
        { label: "Persistence", value: "Readily biodegradable." },
        { label: "Bioaccumulation", value: "Does not bioaccumulate significantly." },
      ],
    },
    {
      title: "Disposal Considerations",
      rows: [
        { label: "Material Disposal", value: "Recover or recycle if possible. Dispose of as flammable waste per local regulations. Do not discharge to drains or watercourses." },
        { label: "Container Disposal", value: "Empty containers retain flammable vapour. Do not cut, weld or grind. Send to an approved drum recoverer." },
      ],
    },
    {
      title: "Transport Information",
      rows: [
        { label: "UN No.", value: "UN 1173" },
        { label: "Proper Shipping Name", value: "ETHYL ACETATE" },
        { label: "Class / Division", value: "3 (Flammable liquid)" },
        { label: "Packing Group", value: "II" },
        { label: "Marine Pollutant", value: "No" },
      ],
    },
    {
      title: "Regulatory Information",
      rows: [
        { label: "EC Classification", value: "Highly flammable. Irritant." },
        { label: "EC Symbols", value: "F — Highly flammable · Xi — Irritant" },
        { label: "Risk Phrases", value: "R11 · R36 · R66 · R67" },
        { label: "Safety Phrases", value: "S16 · S26 · S33" },
        { label: "Inventory Listings", value: "AICS, DSL, EINECS (205-500-4), TSCA, ENCS, KECI, PICCS." },
      ],
    },
    {
      title: "Other Information",
      rows: [
        { label: "R11", value: "Highly flammable" },
        { label: "R36", value: "Irritating to eyes" },
        { label: "R66", value: "Repeated exposure may cause skin dryness or cracking" },
        { label: "R67", value: "Vapours may cause drowsiness and dizziness" },
      ],
    },
  ],
};

/* ════════════════════════════ FORMALDEHYDE ════════════════════════════ */
const formaldehyde: MsdsData = {
  productName: "Formaldehyde",
  docRef: "LXM/MSDS/FA-001",
  sections: [
    {
      title: "Identification of the Substance & Company",
      rows: [
        { label: "Material Name", value: "Formaldehyde (Formalin solution, ~37%)" },
        { label: "Uses", value: "Disinfectant, preservative and fixative. Raw material for resins and in the chemical industry." },
        { label: "Synonyms", value: "Methanal · Formalin · Formic aldehyde · Methylene oxide" },
      ],
    },
    {
      title: "Composition / Information on Ingredients",
      rows: [
        { label: "Material Formal Name", value: "Formaldehyde (aqueous solution)" },
        { label: "CAS No.", value: "50-00-0" },
        { label: "INDEX No.", value: "605-001-00-5" },
        { label: "EINECS No.", value: "200-001-8" },
        { label: "Molecular Formula", value: "CH₂O" },
      ],
      table: {
        headers: COMPONENT_HEADERS,
        rows: [
          ["Formaldehyde", "50-00-0", "200-001-8", "T, C, Carc.", "R23/24/25; R34; R40; R43", "37%"],
          ["Methanol (stabiliser)", "67-56-1", "200-659-6", "F, T", "R11; R23/25", "≤ 15%"],
        ],
      },
    },
    {
      title: "Hazards Identification",
      rows: [
        { label: "Health Hazards", value: "Toxic if inhaled, swallowed or in contact with skin. Causes severe skin burns and serious eye damage. May cause an allergic skin reaction, asthma or breathing difficulties. Suspected of causing cancer." },
        { label: "Carcinogenicity", value: "Classified by IARC as Group 1 (carcinogenic to humans) — nasopharyngeal cancer / leukaemia." },
        { label: "Safety Hazards", value: "Combustible solution; may release flammable formaldehyde/methanol vapours. Vapour may form explosive mixtures with air." },
        { label: "Environmental", value: "Toxic to aquatic organisms. Prevent release to the environment." },
      ],
    },
    {
      title: "First Aid Measures",
      rows: [
        { label: "Inhalation", value: "Move to fresh air immediately. Give oxygen if breathing is difficult. Seek immediate medical attention — pulmonary oedema may be delayed." },
        { label: "Skin Contact", value: "Immediately remove contaminated clothing. Wash skin with plenty of water for at least 15 minutes. Seek immediate medical attention." },
        { label: "Eye Contact", value: "Rinse cautiously with water for at least 15 minutes, holding the eyelids open. Remove contact lenses if present. Seek immediate medical attention." },
        { label: "Ingestion", value: "Do NOT induce vomiting. Rinse mouth and drink water. Never give anything by mouth to an unconscious person. Seek immediate medical attention." },
        { label: "Advice to Physician", value: "Risk of chemical burns, metabolic acidosis (from methanol) and delayed pulmonary oedema. Treat symptomatically." },
      ],
    },
    {
      title: "Fire-Fighting Measures",
      rows: [
        { label: "Extinguishing Media", value: "Alcohol-resistant foam, dry chemical powder, carbon dioxide or water fog." },
        { label: "Unsuitable Media", value: "Do not use a direct water jet." },
        { label: "Specific Hazards", value: "Combustible. Thermal decomposition releases carbon monoxide, carbon dioxide and irritating/toxic formaldehyde vapours." },
        { label: "Protective Equipment", value: "Self-contained breathing apparatus and full chemical-protective clothing. Cool exposed containers with water spray." },
      ],
    },
    {
      title: "Accidental Release Measures",
      rows: [
        { label: "Protective Measures", value: "Isolate the area and deny entry to unprotected personnel. Eliminate ignition sources. Wear full PPE. Ensure adequate ventilation; avoid breathing vapour." },
        { label: "Clean-Up", value: "Absorb spill with inert material; collect into sealable, labelled containers. Residues may be neutralised (e.g. with dilute ammonia/sodium sulphite) by trained personnel. Prevent entry into drains and watercourses." },
      ],
    },
    {
      title: "Handling & Storage",
      rows: [
        { label: "Handling", value: "Avoid all contact with skin, eyes and clothing. Do not breathe vapour or mist. Use only with local exhaust ventilation. Keep away from heat, sparks and open flames — no smoking. Wash thoroughly after handling." },
        { label: "Storage", value: "Store in a cool (above 15 °C to prevent polymerisation to paraformaldehyde), dry, well-ventilated place. Keep tightly closed, away from oxidisers, acids, alkalis, amines and ignition sources." },
        { label: "Suitable Materials", value: "Stainless steel, polyethylene, polypropylene, suitably lined steel." },
      ],
    },
    {
      title: "Exposure Controls / Personal Protection",
      table: {
        headers: OEL_HEADERS,
        rows: [
          ["Formaldehyde", "ACGIH", "Ceiling", "0.3", "—"],
          ["Formaldehyde", "OSHA Z", "TWA", "0.75", "—"],
          ["Formaldehyde", "OSHA Z", "STEL", "2", "—"],
        ],
      },
      rows: [
        { label: "Engineering Controls", value: "Use closed systems and local exhaust ventilation to keep airborne levels below the (very low) exposure limits. Provide eye wash and safety shower." },
        { label: "Respiratory", value: "Full-face respirator with a formaldehyde/organic-vapour cartridge; supplied-air respirator for high concentrations or spills." },
        { label: "Hand / Eye / Body", value: "Butyl or nitrile gloves, chemical splash goggles and chemical-resistant clothing/apron." },
      ],
    },
    {
      title: "Physical & Chemical Properties",
      rows: [
        { label: "Appearance", value: "Colourless liquid (aqueous solution)" },
        { label: "Odour", value: "Pungent, characteristic, irritating" },
        { label: "pH", value: "2.8 – 4.0" },
        { label: "Boiling Point", value: "≈ 96 – 99 °C" },
        { label: "Flash Point", value: "≈ 50 – 56 °C (closed cup; lower if methanol-stabilised)" },
        { label: "Auto-ignition", value: "≈ 424 °C" },
        { label: "Density", value: "≈ 1080 – 1100 kg/m³ at 20 °C" },
        { label: "Water Solubility", value: "Miscible" },
        { label: "Molecular Weight", value: "30.03 g/mol (formaldehyde)" },
      ],
    },
    {
      title: "Stability & Reactivity",
      rows: [
        { label: "Stability", value: "Stable when stored correctly. May polymerise to paraformaldehyde (white deposit) at low temperature; methanol is added as a stabiliser." },
        { label: "Conditions to Avoid", value: "Heat, freezing, ignition sources and light." },
        { label: "Materials to Avoid", value: "Strong oxidisers, strong acids and bases, amines, phenols, isocyanates, nitrogen dioxide." },
        { label: "Decomposition Products", value: "Carbon monoxide, carbon dioxide and formic acid on combustion/decomposition." },
      ],
    },
    {
      title: "Toxicological Information",
      rows: [
        { label: "Acute Oral", value: "Toxic: LD50 ≈ 100 mg/kg (Rat)." },
        { label: "Skin / Eye", value: "Corrosive — causes severe burns and serious eye damage." },
        { label: "Inhalation", value: "Toxic. Severely irritates the respiratory tract; may cause pulmonary oedema (onset may be delayed)." },
        { label: "Sensitisation", value: "May cause skin and respiratory sensitisation (allergic dermatitis, asthma)." },
        { label: "Carcinogenicity", value: "IARC Group 1 — carcinogenic to humans." },
      ],
    },
    {
      title: "Ecological Information",
      rows: [
        { label: "Aquatic Toxicity", value: "Toxic to aquatic organisms." },
        { label: "Persistence", value: "Readily biodegradable." },
        { label: "Bioaccumulation", value: "Does not bioaccumulate significantly." },
      ],
    },
    {
      title: "Disposal Considerations",
      rows: [
        { label: "Material Disposal", value: "Dispose of as hazardous waste via a licensed contractor, in accordance with local regulations. Do not discharge to drains or watercourses." },
        { label: "Container Disposal", value: "Triple-rinse (or equivalent) empty containers; do not reuse. Send to a licensed recoverer. Do not cut or weld." },
      ],
    },
    {
      title: "Transport Information",
      rows: [
        { label: "UN No.", value: "UN 2209" },
        { label: "Proper Shipping Name", value: "FORMALDEHYDE SOLUTION (with ≥ 25% formaldehyde)" },
        { label: "Class / Division", value: "8 (Corrosive)" },
        { label: "Packing Group", value: "III" },
        { label: "Note", value: "Methanol-stabilised solutions with flash point < 60 °C ship as UN 1198, Class 3." },
      ],
    },
    {
      title: "Regulatory Information",
      rows: [
        { label: "EC Classification", value: "Toxic (T). Corrosive (C). Carcinogen Cat. 1B. Skin/respiratory sensitiser." },
        { label: "EC Symbols", value: "T — Toxic" },
        { label: "Risk Phrases", value: "R23/24/25 · R34 · R40 · R43" },
        { label: "Safety Phrases", value: "S26 · S36/37/39 · S45 · S51" },
        { label: "Inventory Listings", value: "AICS, DSL, EINECS (200-001-8), TSCA, ENCS, KECI, PICCS." },
      ],
    },
    {
      title: "Other Information",
      rows: [
        { label: "R23/24/25", value: "Toxic by inhalation, in contact with skin and if swallowed" },
        { label: "R34", value: "Causes burns" },
        { label: "R40", value: "Limited evidence of a carcinogenic effect" },
        { label: "R43", value: "May cause sensitisation by skin contact" },
      ],
    },
  ],
};

/** All available MSDS sheets, keyed by the product name in products.ts. */
export const msdsData: Record<string, MsdsData> = {
  "Mixed Xylene (MX)": mixXylene,
  "Isopropyl Alcohol (IPA)": ipa,
  "Acetone (ACT)": acetone,
  "Ethyl Acetate (EA)": ethylAcetate,
  "Formaldehyde": formaldehyde,
};

export const msdsProductNames = Object.keys(msdsData);
