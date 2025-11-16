import { useState } from "react";
import { Menu, X, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/laxmi-chemicals-logo.png";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMenuOpen(false);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Laxmi Chemicals" className="h-12 w-28 rounded-lg shadow-md" />
            <div>
              <h1 className="text-xl font-bold text-primary">Laxmi Chemicals</h1>
              <p className="text-xs text-muted-foreground">Since 2006</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <button
              onClick={() => scrollToSection("products")}
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Products
            </button>
            <button
              onClick={() => scrollToSection("about")}
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              About Us
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Contact
            </button>
            <a href="https://wa.me/919886174335?text=Hello%2C%20I%20would%20like%20to%20inquire%20about%20your%20chemical%20products." target="_blank" rel="noopener noreferrer">
              <Button variant="default" size="sm" className="gap-2">
                <Phone className="h-4 w-4" />
                WhatsApp Us
              </Button>
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-foreground hover:text-primary"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-border animate-in slide-in-from-top-2">
            <div className="flex flex-col gap-4">
              <button
                onClick={() => scrollToSection("products")}
                className="text-foreground hover:text-primary transition-colors font-medium text-left"
              >
                Products
              </button>
              <button
                onClick={() => scrollToSection("about")}
                className="text-foreground hover:text-primary transition-colors font-medium text-left"
              >
                About Us
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="text-foreground hover:text-primary transition-colors font-medium text-left"
              >
                Contact
              </button>
              <a href="https://wa.me/9886174335?text=Hello%2C%20I%20would%20like%20to%20inquire%20about%20your%20chemical%20products." target="_blank" rel="noopener noreferrer">
                <Button variant="default" size="sm" className="w-full gap-2">
                  <Phone className="h-4 w-4" />
                  WhatsApp Us
                </Button>
              </a>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
