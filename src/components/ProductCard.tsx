import React, { useState } from "react";
import { ArrowUpRight, Plus } from "lucide-react";
import { WatchProduct, formatCurrency } from "../data/watches";

interface ProductCardProps {
  product: WatchProduct;
  onSelect: (product: WatchProduct) => void;
  onAddToCart: (product: WatchProduct, e: React.MouseEvent) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  onAddToCart,
}) => {
  const [imgError, setImgError] = useState(false);
  const [secondaryImgError, setSecondaryImgError] = useState(false);

  return (
    <article
      onClick={() => onSelect(product)}
      className="group cursor-pointer bg-[#111114] border border-white/[0.07] hover:border-[#C9A96E]/40 transition-all duration-300 flex flex-col justify-between"
    >
      {/* Image Container — 70% visual weight */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#16161A]">
        {!imgError ? (
          <>
            <img
              src={product.image}
              alt={product.name}
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              className="w-full h-full object-cover object-center transition-all duration-700 ease-out group-hover:scale-[1.05]"
            />
            {!secondaryImgError && product.secondaryImage && (
              <img
                src={product.secondaryImage}
                alt={`${product.name} movement detail`}
                referrerPolicy="no-referrer"
                onError={() => setSecondaryImgError(true)}
                className="absolute inset-0 w-full h-full object-cover object-center opacity-0 group-hover:opacity-35 transition-opacity duration-700 ease-out pointer-events-none"
              />
            )}
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-[#18181C] to-[#0D0D10] text-center">
            <span className="font-serif-display text-2xl text-[#C9A96E] mb-1">
              {product.name}
            </span>
            <span className="font-mono-tabular text-xs text-[#A1A1AA]">
              {product.reference}
            </span>
          </div>
        )}

        {/* Subtle bottom contrast gradient */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#111114] via-[#111114]/40 to-transparent"
        />

        {/* Quick Add button on hover */}
        <button
          type="button"
          onClick={(e) => onAddToCart(product, e)}
          aria-label={`Add ${product.name} to bag`}
          className="absolute top-4 right-4 z-10 inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#09090B]/85 hover:bg-[#C9A96E] text-[#F5F3EF] hover:text-[#09090B] border border-white/15 hover:border-[#C9A96E] text-[11px] tracking-[0.14em] transition-all duration-200 whitespace-nowrap"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>ADD</span>
        </button>
      </div>

      {/* Card Body — Clean Unboxed Metadata & Strong Typographic Hierarchy */}
      <div className="p-6 md:p-7 flex-1 flex flex-col justify-between">
        <div>
          {/* Unboxed quiet metadata with typographic separator */}
          <div className="flex items-center gap-2 text-[11px] tracking-[0.18em] text-[#A1A1AA] uppercase mb-2.5">
            <span>{product.category}</span>
            <span aria-hidden="true" className="text-[#C9A96E]">
              ·
            </span>
            <span className="font-mono-tabular">{product.reference}</span>
          </div>

          <h3 className="font-serif-display text-2xl md:text-[26px] text-[#F5F3EF] group-hover:text-[#E8D5B0] group-hover:translate-x-1 transition-all duration-300 mb-1.5">
            {product.name}
          </h3>

          <p className="text-xs text-[#A1A1AA] font-light mb-6">
            {product.subtitle}
          </p>
        </div>

        <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
          <span className="font-mono-tabular text-base text-[#F5F3EF] font-medium">
            {formatCurrency(product.price)}
          </span>

          <span className="inline-flex items-center gap-1.5 text-xs tracking-[0.18em] text-[#C9A96E] group-hover:text-[#F5F3EF] transition-colors duration-200 whitespace-nowrap">
            <span>VIEW DETAILS</span>
            <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </div>
    </article>
  );
};
