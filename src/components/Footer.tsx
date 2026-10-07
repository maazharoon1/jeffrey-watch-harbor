import React from "react";

interface FooterProps {
  onNavigateSection: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateSection }) => {
  return (
    <footer className="bg-[#070709] border-t border-white/[0.07] py-16 md:py-20">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-14 border-b border-white/[0.06]">
          {/* Brand Column */}
          <div className="md:col-span-5">
            <a
              href="#top"
              onClick={(e) => {
                e.preventDefault();
                onNavigateSection("top");
              }}
              className="font-serif-display text-2xl tracking-[0.22em] text-[#F5F3EF] block mb-4"
            >
              JEFFREY WATCH HARBOR
            </a>
            <p className="text-xs text-[#A1A1AA] max-w-xs leading-relaxed font-light">
              Curated haute horlogerie for collectors who demand mechanical
              precision, provenance, and enduring design.
            </p>
          </div>

          {/* Navigation Column */}
          <div className="md:col-span-3 space-y-3">
            <p className="text-[11px] tracking-[0.2em] text-[#C9A96E] uppercase mb-4">
              Navigation
            </p>
            <ul className="space-y-2.5 text-xs tracking-[0.16em] text-[#A1A1AA]">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateSection("collection")}
                  className="hover:text-[#F5F3EF] transition-colors"
                >
                  COLLECTION
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateSection("craftsmanship")}
                  className="hover:text-[#F5F3EF] transition-colors"
                >
                  CRAFTSMANSHIP
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateSection("about")}
                  className="hover:text-[#F5F3EF] transition-colors"
                >
                  ABOUT
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateSection("contact")}
                  className="hover:text-[#F5F3EF] transition-colors"
                >
                  CONTACT
                </button>
              </li>
            </ul>
          </div>

          {/* Direct Contact Details Column */}
          <div className="md:col-span-4 space-y-3">
            <p className="text-[11px] tracking-[0.2em] text-[#C9A96E] uppercase mb-4">
              Private Salon & Concierge
            </p>
            <div className="space-y-2 text-xs text-[#A1A1AA]">
              <p>
                <a
                  href="tel:+16467014738"
                  className="font-mono-tabular hover:text-[#F5F3EF] transition-colors"
                >
                  +1 646-701-4738
                </a>
              </p>
              <p>
                <a
                  href="mailto:combjeff6@gmail.com"
                  className="font-mono-tabular hover:text-[#F5F3EF] transition-colors"
                >
                  combjeff6@gmail.com
                </a>
              </p>
              <p className="pt-1">
                <a
                  href="https://www.facebook.com/profile.php?id=61594240898367"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#C9A96E] hover:text-[#F5F3EF] tracking-[0.14em] uppercase transition-colors"
                >
                  Facebook Official Profile ↗
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] tracking-[0.14em] text-[#A1A1AA]/70">
          <p>
            © {new Date().getFullYear()} JEFFREY WATCH HARBOR. ALL RIGHTS
            RESERVED.
          </p>
          <p className="font-mono-tabular">
            GENÈVE · NEW YORK · INSURED GLOBAL COURIER
          </p>
        </div>
      </div>
    </footer>
  );
};
