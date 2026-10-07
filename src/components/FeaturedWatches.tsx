import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import { WatchProduct } from "../data/watches";
import { ProductCard } from "./ProductCard";

gsap.registerPlugin(ScrollTrigger);

interface FeaturedWatchesProps {
  products: WatchProduct[];
  onSelectProduct: (product: WatchProduct) => void;
  onAddToCart: (product: WatchProduct, e: React.MouseEvent) => void;
  onViewAllClick: () => void;
}

export const FeaturedWatches: React.FC<FeaturedWatchesProps> = ({
  products,
  onSelectProduct,
  onAddToCart,
  onViewAllClick,
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const featuredList = products.filter((p) => p.featured).slice(0, 4);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (gridRef.current) {
        const cards = gridRef.current.children;
        gsap.fromTo(
          cards,
          { opacity: 0, y: 36 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            stagger: 0.14,
            ease: "power3.out",
            scrollTrigger: {
              trigger: gridRef.current,
              start: "top 82%",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="featured-heading"
      className="py-24 md:py-32 bg-[#09090B] border-t border-white/[0.06]"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14 md:mb-16">
          <div>
            <p className="text-xs tracking-[0.26em] text-[#C9A96E] mb-3">
              01. SIGNATURE REFERENCES
            </p>
            <h2
              id="featured-heading"
              className="font-serif-display text-4xl md:text-5xl text-[#F5F3EF] tracking-tight"
            >
              Featured Timepieces
            </h2>
          </div>

          <button
            type="button"
            onClick={onViewAllClick}
            className="group inline-flex items-center gap-2.5 text-xs tracking-[0.2em] text-[#A1A1AA] hover:text-[#C9A96E] transition-colors duration-200 self-start md:self-auto whitespace-nowrap"
          >
            <span>VIEW FULL ARCHIVE</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </button>
        </div>

        {/* 2x2 Spacious Luxury Campaign Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10"
        >
          {featuredList.map((product) => (
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
  );
};
