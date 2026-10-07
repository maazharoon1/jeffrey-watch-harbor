import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  WatchProduct,
  WatchCategory,
  WATCH_CATEGORIES,
} from "../data/watches";
import { ProductCard } from "./ProductCard";

gsap.registerPlugin(ScrollTrigger);

interface EditorialSectionProps {
  products: WatchProduct[];
  onSelectProduct: (product: WatchProduct) => void;
  onAddToCart: (product: WatchProduct, e: React.MouseEvent) => void;
}

export const EditorialSection: React.FC<EditorialSectionProps> = ({
  products,
  onSelectProduct,
  onAddToCart,
}) => {
  const statementRef = useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] = useState<WatchCategory>("All");

  const filteredProducts =
    activeCategory === "All"
      ? products
      : products.filter((p) => p.category === activeCategory);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (statementRef.current) {
        gsap.fromTo(
          statementRef.current.querySelectorAll(".editorial-reveal"),
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            stagger: 0.16,
            ease: "power3.out",
            scrollTrigger: {
              trigger: statementRef.current,
              start: "top 80%",
            },
          }
        );
      }
    }, statementRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* SECTION 3: Editorial Brand Statement & Attributable Collector Proof */}
      <section
        ref={statementRef}
        aria-label="Brand Philosophy"
        className="py-24 md:py-36 bg-[#0C0C0F] border-t border-white/[0.06]"
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            <div className="lg:col-span-8">
              <p className="editorial-reveal text-xs tracking-[0.26em] text-[#C9A96E] mb-6">
                02. HOROLOGICAL PHILOSOPHY
              </p>
              <blockquote className="editorial-reveal font-serif-display text-3xl sm:text-4xl md:text-5xl lg:text-[54px] leading-[1.12] text-[#F5F3EF] mb-8">
                “We do not measure time by seconds elapsed, but by the permanence
                of the instrument that records them.”
              </blockquote>
              <p className="editorial-reveal text-sm md:text-base text-[#A1A1AA] max-w-2xl font-light leading-relaxed">
                Every timepiece at Jeffrey Watch Harbor undergoes a 140-hour
                chronometric and acoustic inspection in our New York salon before
                private allocation.
              </p>
            </div>

            {/* Adjacent Collector Proof */}
            <div className="lg:col-span-4 lg:border-l lg:border-white/[0.08] lg:pl-10 flex flex-col justify-between gap-8">
              <div className="editorial-reveal">
                <p className="font-mono-tabular text-3xl md:text-4xl text-[#C9A96E] mb-1">
                  -1 / +2 sec
                </p>
                <p className="text-xs tracking-[0.16em] text-[#A1A1AA] uppercase">
                  Daily Chronometric Tolerance Across All Calibres
                </p>
              </div>

              <div className="editorial-reveal pt-6 border-t border-white/[0.07]">
                <p className="font-serif-display italic text-lg text-[#F5F3EF] mb-3 leading-relaxed">
                  “Acquiring the Sovereign Chronograph 41 through Jeffrey Watch
                  Harbor transformed how I view independent haute horlogerie—from
                  private dossier inspection to insured New York courier delivery
                  in 24 hours.”
                </p>
                <p className="text-xs text-[#A1A1AA] tracking-[0.12em]">
                  MARCUS VANCE · MANAGING PARTNER, VANCE CAPITAL NEW YORK
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: Curated Collection Grid with Minimal Category Filtering */}
      <section
        id="collection"
        aria-labelledby="collection-heading"
        className="py-24 md:py-32 bg-[#09090B] border-t border-white/[0.06]"
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-14">
            <div>
              <p className="text-xs tracking-[0.26em] text-[#C9A96E] mb-3">
                03. THE SALON ARCHIVE
              </p>
              <h2
                id="collection-heading"
                className="font-serif-display text-4xl md:text-5xl text-[#F5F3EF]"
              >
                Curated Collection
              </h2>
            </div>

            {/* Interactive Segmented Category Filter Controls */}
            <div
              role="tablist"
              aria-label="Filter watches by category"
              className="flex flex-wrap items-center gap-1.5 p-1.5 bg-[#121216] border border-white/[0.07]"
            >
              {WATCH_CATEGORIES.map((category) => {
                const isActive = activeCategory === category;
                return (
                  <button
                    key={category}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActiveCategory(category)}
                    className={`px-4 py-2 text-xs tracking-[0.16em] transition-all duration-200 whitespace-nowrap shrink-0 ${
                      isActive
                        ? "bg-[#C9A96E] text-[#09090B] font-semibold"
                        : "text-[#A1A1AA] hover:text-[#F5F3EF] hover:bg-white/[0.03]"
                    }`}
                  >
                    {category.toUpperCase()}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3-Column Desktop Product Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={onSelectProduct}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
