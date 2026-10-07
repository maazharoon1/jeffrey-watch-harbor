import React, { useEffect, useState } from "react";
import { ShoppingBag, Menu, X } from "lucide-react";

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onNavigateHome: () => void;
  isDetailView: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  onOpenCart,
  onNavigateHome,
  isDetailView,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 48);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (sectionId: string) => {
    setMobileMenuOpen(false);
    if (isDetailView) {
      onNavigateHome();
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled || isDetailView || mobileMenuOpen
          ? "bg-[#09090B]/88 backdrop-blur-md border-b border-white/[0.07] py-4"
          : "bg-gradient-to-b from-black/70 via-black/25 to-transparent py-6"
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            onNavigateHome();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="font-serif-display text-lg md:text-xl tracking-[0.22em] text-[#F5F3EF] hover:text-[#C9A96E] transition-colors duration-200 whitespace-nowrap shrink-0"
        >
          JEFFREY WATCH HARBOR
        </a>

        {/* Zone 2: Clean text navigation links */}
        <nav className="hidden md:flex items-center gap-10 text-xs tracking-[0.18em] text-[#A1A1AA]">
          <button
            type="button"
            onClick={() => handleNavClick("collection")}
            className="hover:text-[#F5F3EF] transition-colors duration-200 py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#C9A96E] hover:after:w-full after:transition-all after:duration-300 whitespace-nowrap"
          >
            COLLECTION
          </button>
          <button
            type="button"
            onClick={() => handleNavClick("craftsmanship")}
            className="hover:text-[#F5F3EF] transition-colors duration-200 py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#C9A96E] hover:after:w-full after:transition-all after:duration-300 whitespace-nowrap"
          >
            CRAFTSMANSHIP
          </button>
          <button
            type="button"
            onClick={() => handleNavClick("about")}
            className="hover:text-[#F5F3EF] transition-colors duration-200 py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#C9A96E] hover:after:w-full after:transition-all after:duration-300 whitespace-nowrap"
          >
            ABOUT
          </button>
          <button
            type="button"
            onClick={() => handleNavClick("contact")}
            className="hover:text-[#F5F3EF] transition-colors duration-200 py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#C9A96E] hover:after:w-full after:transition-all after:duration-300 whitespace-nowrap"
          >
            CONTACT
          </button>
        </nav>

        {/* Zone 3: Primary action (Cart icon + Mobile menu toggle) */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onOpenCart}
            aria-label="Open shopping bag"
            className="group flex items-center gap-2.5 px-3.5 py-2 border border-white/[0.1] hover:border-[#C9A96E]/60 bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-200 whitespace-nowrap shrink-0"
          >
            <ShoppingBag className="w-4 h-4 text-[#C9A96E] transition-transform duration-200 group-hover:scale-105" />
            <span className="text-xs tracking-[0.14em] text-[#F5F3EF] font-mono-tabular">
              BAG ({cartCount})
            </span>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="md:hidden p-2.5 text-[#F5F3EF] hover:text-[#C9A96E] transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#09090B]/95 backdrop-blur-xl border-b border-white/[0.08] px-6 py-6 flex flex-col gap-5 text-xs tracking-[0.2em] text-[#A1A1AA]">
          <button
            type="button"
            onClick={() => handleNavClick("collection")}
            className="text-left py-2 hover:text-[#F5F3EF] transition-colors"
          >
            COLLECTION
          </button>
          <button
            type="button"
            onClick={() => handleNavClick("craftsmanship")}
            className="text-left py-2 hover:text-[#F5F3EF] transition-colors"
          >
            CRAFTSMANSHIP
          </button>
          <button
            type="button"
            onClick={() => handleNavClick("about")}
            className="text-left py-2 hover:text-[#F5F3EF] transition-colors"
          >
            ABOUT
          </button>
          <button
            type="button"
            onClick={() => handleNavClick("contact")}
            className="text-left py-2 hover:text-[#F5F3EF] transition-colors"
          >
            CONTACT
          </button>
        </div>
      )}
    </header>
  );
};
