import { useState } from "react";
import { Search, ChevronDown, ChevronUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const productCategories = [
  {
    title: "Plywood and Laminate",
    products: ["Formaldehyde", "Phenol Crystal"],
    icon: "🏗️"
  },
  {
    title: "Coating Paints",
    products: ["Ethyl Acetate", "Emulsifier", "Pure Solvents"],
    icon: "🎨"
  },
  {
    title: "New Products",
    products: ["Tri Chloro Ethylene", "Ortho Xylene"],
    icon: "✨"
  },
  {
    title: "Pharma Chemicals",
    products: [
      "Trimethyl Silyl Iodide",
      "2-Phenoxy Ethanol",
      "Tetra Hydro-2-Methyl-3-Thioxo124-Tetraz-30",
      "Mica Ester",
      "Erythromycin",
      "Sodium Benzene Sulphinate-250",
      "Trimethyl Ortho Acetate (TMOA)",
      "Disodium Hydrogen Phosphate Dihydrate",
      "1,4 Dioxane",
      "Phosphorous Pentachloride",
      "N-Hexane",
      "N-Pentane (99%)",
      "Pivaloyl Chloride",
      "2-Mercaptobenzothiazole",
      "Choline Chloride",
      "Di Ethyl Ether",
      "Acetonitrile",
      "Hydrogen Peroxide (50%)",
      "Iron Powder",
      "Pyridine",
      "Tetra Butyl Ammonium Hydrate Sulphate (TBAMS)",
      "Acetone",
      "Hydrazine Hydrate",
      "Heptane",
      "Tertiary Butanol",
      "N-Heptane",
      "Disopropyl Ether",
      "Isobutanol",
      "THF",
      "N-Propanol"
    ],
    icon: "💊"
  },
  {
    title: "Cosmetics Products",
    products: [
      "Isopropyl Alcohol",
      "M-E-G",
      "Di Propylene Glycol",
      "Methanol",
      "Polyethylene Glycol",
      "Triethanolamine"
    ],
    icon: "💄"
  },
  {
    title: "Solvents",
    products: ["Lead", "ISO Propyl Alcohol Orderless"],
    icon: "⚗️"
  },
  {
    title: "Rubber Chemicals",
    products: [
      "Activated Carbon",
      "Aerosil-200",
      "Calcium Stearate",
      "Carbon Black",
      "Caustic Potash",
      "Methyl Ethyl Ketone",
      "Methylene Dichloride",
      "Paraffin Wax",
      "Zinc Oxide",
      "Zinc Stearate",
      "Stearic Acid",
      "Silicon Defoamer",
      "Silica Gel",
      "Toluene",
      "Silicon Emulsion",
      "MIBK",
      "DOP",
      "CPW"
    ],
    icon: "🔬"
  },
  {
    title: "Agro Chemicals",
    products: [
      "Mono Chloro Benzene",
      "N Butanol",
      "Sodium Chlorate",
      "Sodium Fluoborate"
    ],
    icon: "🌾"
  },
  {
    title: "Plasticizer and Food Chemicals",
    products: [
      "Butyl Carbitol",
      "EDTA Tetra Sodium",
      "Sorbitol"
    ],
    icon: "🧪"
  }
];

const ProductCatalog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  const toggleCategory = (title: string) => {
    setExpandedCategories(prev =>
      prev.includes(title)
        ? prev.filter(t => t !== title)
        : [...prev, title]
    );
  };

  const filteredCategories = productCategories.map(category => ({
    ...category,
    products: category.products.filter(product =>
      product.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.products.length > 0);

  return (
    <section id="products" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            Product Catalog
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Our Extensive Product Range
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            High-quality chemicals for diverse industrial applications
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 text-base shadow-md"
            />
          </div>
        </div>

        {/* Product Categories */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category) => (
            <Card
              key={category.title}
              className="hover:shadow-lg transition-all duration-300 border-border/50 overflow-hidden"
            >
              <CardHeader
                className="cursor-pointer bg-card hover:bg-muted/50 transition-colors"
                onClick={() => toggleCategory(category.title)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{category.icon}</span>
                    <div>
                      <CardTitle className="text-lg">{category.title}</CardTitle>
                      <CardDescription>{category.products.length} products</CardDescription>
                    </div>
                  </div>
                  {expandedCategories.includes(category.title) ? (
                    <ChevronUp className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
              </CardHeader>

              {expandedCategories.includes(category.title) && (
                <CardContent className="pt-4 animate-in slide-in-from-top-2">
                  <ul className="space-y-2">
                    {category.products.map((product) => (
                      <li
                        key={product}
                        className="flex items-start gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <span className="text-primary mt-1">•</span>
                        <span>{product}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No products found matching "{searchTerm}"</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductCatalog;
