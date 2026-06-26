import { MapPin, Phone, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/laxmi-chemicals-logo.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src={logo} alt="Laxmi Chemicals" className="h-12 w-28 rounded-lg" />
              <div>
                <h3 className="text-xl font-bold">Laxmi Chemicals</h3>
                <p className="text-sm text-primary-foreground/80">Since 2006</p>
              </div>
            </div>
            <p className="text-sm text-primary-foreground/80 leading-relaxed">
              Karnataka's trusted distributor of high-quality industrial chemicals. 
              Committed to excellence and customer satisfaction.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#products" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Products
                </a>
              </li>
              <li>
                <a href="#about" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#contact" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <Link to="/msds" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Safety Data Sheets (MSDS)
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold mb-4">Contact Info</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="h-5 w-5 flex-shrink-0 mt-0.5 text-secondary" />
                <span className="text-primary-foreground/80">
                  #B-4, Hebbal Industrial Area, Mysore-570016
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-5 w-5 flex-shrink-0 text-secondary" />
                <a 
                  href="https://wa.me/919886174335" 
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  +91 9886174335
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-5 w-5 flex-shrink-0 text-secondary" />
                <a 
                  href="mailto:laxmichem7@gmail.com" 
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  laxmichem7@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-primary-foreground/70">
            <p>© {currentYear} Laxmi Chemicals. All rights reserved.</p>
            <p className="text-center">
              Quality Chemicals | Reliable Service | Trusted Partner
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
