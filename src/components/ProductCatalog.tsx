import { useState } from "react";
import { Search, ChevronDown, ChevronUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const CircuitBoardIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8">
    <rect
      x="3"
      y="3"
      width="18"
      height="18"
      rx="2"
      fill="#4ade80"
      stroke="#166534"
      strokeWidth="1.5"
    />
    <rect
      x="8"
      y="8"
      width="4"
      height="4"
      rx="0.5"
      fill="#fbbf24"
      stroke="#78350f"
      strokeWidth="1"
    />
    <line x1="10" y1="8" x2="10" y2="6" stroke="#166534" strokeWidth="1" />
    <line x1="10" y1="12" x2="10" y2="14" stroke="#166534" strokeWidth="1" />
    <line x1="8" y1="10" x2="6" y2="10" stroke="#166534" strokeWidth="1" />
    <line x1="12" y1="10" x2="14" y2="10" stroke="#166534" strokeWidth="1" />
    <circle
      cx="17"
      cy="7"
      r="1.5"
      fill="#1e3a8a"
      stroke="#166534"
      strokeWidth="1"
    />
    <circle
      cx="17"
      cy="17"
      r="1.5"
      fill="#1e3a8a"
      stroke="#166534"
      strokeWidth="1"
    />
    <line x1="14" y1="10" x2="17" y2="7" stroke="#166534" strokeWidth="1" />
    <rect
      x="15"
      y="14"
      width="3"
      height="2"
      rx="0.5"
      fill="#fbbf24"
      stroke="#78350f"
      strokeWidth="0.8"
    />
    <line
      x1="7"
      y1="15"
      x2="12"
      y2="15"
      stroke="#166534"
      strokeWidth="1"
      strokeDasharray="1 1"
    />
  </svg>
);

const productCategories = [
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
    icon: "💊",
  },
  {
    title: "Electronics & PCB Board Cleaning Chemicals",
    products: [
      "Isopropyl Alcohol (IPA)",
      "Trichloroethylene (TCE)",
      "No Clean Flux",
    ],
    icon: <CircuitBoardIcon />,
  },
  {
    title: "Cosmetics Products",
    products: [
      "Isopropyl Alcohol",
      "M-E-G",
      "Di Propylene Glycol",
      "Polyethylene Glycol",
    ],
    icon: "✨",
  },
  {
    title: "Solvents",
    products: ["Lead", "ISO Propyl Alcohol Orderless"],
    icon: "⚗️",
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
    icon: "🔬",
  },
  {
    title: "Agro Chemicals",
    products: [
      "Mono Chloro Benzene",
      "N Butanol"
    ],
    icon: "🌾",
  },
  {
    title: "Plasticizer and Food Chemicals",
    products: ["Butyl Carbitol", "EDTA Tetra Sodium", "Sorbitol"],
    icon: "🧪",
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
    icon: "🎨",
  },
];

const ProductCatalog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  const toggleCategory = (title: string) => {
    setExpandedCategories((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };

  const filteredCategories = productCategories
    .map((category) => ({
      ...category,
      products: category.products.filter((product) =>
        product.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    }))
    .filter((category) => category.products.length > 0);

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
                    <div className="flex items-center justify-center">
                      {typeof category.icon === "string" ? (
                        <span className="text-3xl">{category.icon}</span>
                      ) : (
                        category.icon
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        {category.title}
                      </CardTitle>
                      <CardDescription>
                        {category.products.length} products
                      </CardDescription>
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
            <p className="text-muted-foreground">
              No products found matching "{searchTerm}"
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductCatalog;
