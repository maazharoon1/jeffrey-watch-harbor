import React, { useEffect, useState } from "react";
import { ArrowLeft, Check, ShieldCheck, ShoppingBag, Sparkles } from "lucide-react";
import { WatchProduct, formatCurrency } from "../data/watches";
import { ProductCard } from "./ProductCard";

interface ProductDetailViewProps {
  product: WatchProduct;
  allProducts: WatchProduct[];
  onBack: () => void;
  onSelectProduct: (product: WatchProduct) => void;
  onAddToCart: (product: WatchProduct, e?: React.MouseEvent) => void;
  onBuyNow: (product: WatchProduct) => void;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  product,
  allProducts,
  onBack,
  onSelectProduct,
  onAddToCart,
  onBuyNow,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [addedFeedback, setAddedFeedback] = useState(false);

  const galleryImages = [
    { src: product.image, label: "Dial & Case Studio View" },
    { src: product.secondaryImage, label: "Calibre & Horological Detail" },
  ];

  useEffect(() => {
    setActiveImageIndex(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [product.id]);

  const handleAdd = () => {
    onAddToCart(product);
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 1800);
  };

  const relatedWatches = allProducts
    .filter((item) => item.id !== product.id)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-[#09090B] pt-24 pb-24">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        {/* Back Breadcrumb */}
        <div className="mb-10 flex items-center justify-between border-b border-white/[0.07] pb-5">
          <button
            type="button"
            onClick={onBack}
            className="group inline-flex items-center gap-2.5 text-xs tracking-[0.2em] text-[#A1A1AA] hover:text-[#C9A96E] transition-colors duration-200 whitespace-nowrap"
          >
            <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />
            <span>BACK TO SALON</span>
          </button>

          <div className="flex items-center gap-2 text-xs tracking-[0.16em] text-[#A1A1AA]">
            <span>{product.category.toUpperCase()}</span>
            <span aria-hidden="true" className="text-[#C9A96E]">
              ·
            </span>
            <span className="font-mono-tabular text-[#F5F3EF]">
              {product.reference}
            </span>
          </div>
        </div>

        {/* Main PDP Split Layout: Large Product Imagery Left + Contiguous Purchase Module Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left: Sticky Multi-Angle Gallery */}
          <div className="lg:col-span-7 lg:sticky lg:top-28 space-y-5">
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#121216] border border-white/[0.08]">
              <img
                key={galleryImages[activeImageIndex]?.src}
                src={galleryImages[activeImageIndex]?.src}
                alt={`${product.name} - ${galleryImages[activeImageIndex]?.label}`}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center transition-all duration-500 ease-out"
              />
              <div className="absolute bottom-4 left-4 bg-[#09090B]/80 backdrop-blur-md px-3.5 py-1.5 border border-white/10">
                <span className="text-[11px] tracking-[0.16em] text-[#A1A1AA] uppercase">
                  {galleryImages[activeImageIndex]?.label}
                </span>
              </div>
            </div>

            {/* Thumbnail Switcher */}
            <div className="grid grid-cols-2 gap-4">
              {galleryImages.map((img, idx) => (
                <button
                  key={img.label}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`group relative aspect-[16/9] overflow-hidden border transition-all duration-200 text-left ${
                    activeImageIndex === idx
                      ? "border-[#C9A96E]"
                      : "border-white/[0.08] opacity-60 hover:opacity-100"
                  }`}
                >
                  <img
                    src={img.src}
                    alt={img.label}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-black/35 flex items-end p-3">
                    <span className="text-[10px] tracking-[0.16em] text-[#F5F3EF] uppercase">
                      0{idx + 1}. {img.label}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right: Contiguous Purchase & Specification Module */}
          <div className="lg:col-span-5">
            <div className="bg-[#111115] border border-white/[0.08] p-8 md:p-10">
              {/* Unboxed Metadata */}
              <div className="flex items-center gap-2 text-xs tracking-[0.18em] text-[#C9A96E] uppercase mb-3">
                <span>{product.category}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono-tabular">{product.reference}</span>
              </div>

              <h1 className="font-serif-display text-4xl md:text-5xl text-[#F5F3EF] leading-[1.05] mb-3">
                {product.name}
              </h1>

              <p className="text-xs md:text-sm text-[#A1A1AA] mb-6">
                {product.subtitle}
              </p>

              {/* Price & Availability */}
              <div className="pb-6 mb-6 border-b border-white/[0.08] flex flex-wrap items-baseline justify-between gap-4">
                <span className="font-mono-tabular text-2xl md:text-3xl text-[#F5F3EF] font-medium">
                  {formatCurrency(product.price)}
                </span>

                <span className="text-xs tracking-[0.12em] text-[#E8D5B0]">
                  {product.availability}
                </span>
              </div>

              {/* Concise Editorial Description */}
              <p className="text-sm text-[#A1A1AA] font-light leading-relaxed mb-8">
                {product.description}
              </p>

              {/* Primary CTAs: Add to Cart & Buy Now */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-8">
                <button
                  type="button"
                  onClick={handleAdd}
                  className="inline-flex items-center justify-center gap-2.5 px-6 py-4 border border-[#C9A96E] text-[#F5F3EF] hover:bg-[#C9A96E]/15 text-xs tracking-[0.2em] font-medium transition-colors duration-200 whitespace-nowrap"
                >
                  {addedFeedback ? (
                    <>
                      <Check className="w-4 h-4 text-[#C9A96E]" />
                      <span>ADDED TO BAG</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4 text-[#C9A96E]" />
                      <span>ADD TO CART</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => onBuyNow(product)}
                  className="inline-flex items-center justify-center gap-2 px-6 py-4 bg-[#C9A96E] hover:bg-[#D8BC84] text-[#09090B] text-xs tracking-[0.2em] font-semibold transition-colors duration-200 whitespace-nowrap"
                >
                  <span>BUY NOW</span>
                </button>
              </div>

              {/* Technical Specifications Table */}
              <div className="pt-6 border-t border-white/[0.08]">
                <h2 className="text-xs tracking-[0.22em] text-[#C9A96E] uppercase mb-5">
                  Horological Specifications
                </h2>

                <dl className="divide-y divide-white/[0.06] text-xs">
                  <div className="py-3.5 grid grid-cols-3 gap-4">
                    <dt className="text-[#A1A1AA] uppercase tracking-[0.14em]">
                      Movement
                    </dt>
                    <dd className="col-span-2 text-[#F5F3EF] leading-relaxed">
                      {product.specs.movement}
                    </dd>
                  </div>

                  <div className="py-3.5 grid grid-cols-3 gap-4">
                    <dt className="text-[#A1A1AA] uppercase tracking-[0.14em]">
                      Case
                    </dt>
                    <dd className="col-span-2 text-[#F5F3EF] leading-relaxed">
                      {product.specs.case}
                    </dd>
                  </div>

                  <div className="py-3.5 grid grid-cols-3 gap-4">
                    <dt className="text-[#A1A1AA] uppercase tracking-[0.14em]">
                      Dial
                    </dt>
                    <dd className="col-span-2 text-[#F5F3EF] leading-relaxed">
                      {product.specs.dial}
                    </dd>
                  </div>

                  <div className="py-3.5 grid grid-cols-3 gap-4">
                    <dt className="text-[#A1A1AA] uppercase tracking-[0.14em]">
                      Strap
                    </dt>
                    <dd className="col-span-2 text-[#F5F3EF] leading-relaxed">
                      {product.specs.strap}
                    </dd>
                  </div>

                  <div className="py-3.5 grid grid-cols-3 gap-4">
                    <dt className="text-[#A1A1AA] uppercase tracking-[0.14em]">
                      Power Reserve
                    </dt>
                    <dd className="col-span-2 font-mono-tabular text-[#F5F3EF]">
                      {product.specs.powerReserve}
                    </dd>
                  </div>

                  <div className="py-3.5 grid grid-cols-3 gap-4">
                    <dt className="text-[#A1A1AA] uppercase tracking-[0.14em]">
                      Water Resistance
                    </dt>
                    <dd className="col-span-2 font-mono-tabular text-[#F5F3EF]">
                      {product.specs.waterResistance}
                    </dd>
                  </div>
                </dl>
              </div>

              {/* Salon Provenance Guarantee */}
              <div className="mt-6 pt-6 border-t border-white/[0.08] flex items-start gap-3 text-xs text-[#A1A1AA]">
                <ShieldCheck className="w-4 h-4 text-[#C9A96E] shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  Accompanied by Jeffrey Watch Harbor 5-Year International
                  Chronometric Warranty and Insured Armored Courier Delivery.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Related Watches Section */}
        <div className="mt-24 pt-16 border-t border-white/[0.07]">
          <div className="mb-10">
            <p className="text-xs tracking-[0.24em] text-[#C9A96E] mb-2">
              COMPLEMENTARY REFERENCES
            </p>
            <h2 className="font-serif-display text-3xl md:text-4xl text-[#F5F3EF]">
              Related Timepieces
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedWatches.map((rel) => (
              <ProductCard
                key={rel.id}
                product={rel}
                onSelect={onSelectProduct}
                onAddToCart={(item, e) => onAddToCart(item, e)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
