import React, { useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { WATCH_PRODUCTS, WatchProduct } from "./data/watches";
import { Navbar } from "./components/Navbar";
import { WatchHero } from "./components/WatchHero";
import { FeaturedWatches } from "./components/FeaturedWatches";
import { EditorialSection } from "./components/EditorialSection";
import { CraftsmanshipSection } from "./components/CraftsmanshipSection";
import { ProductDetailView } from "./components/ProductDetailView";
import { CartDrawer, CartItem } from "./components/CartDrawer";
import { Footer } from "./components/Footer";

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [selectedProduct, setSelectedProduct] = useState<WatchProduct | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  const heroProduct = WATCH_PRODUCTS[0];

  const handleAddToCart = (product: WatchProduct, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const handleBuyNow = (product: WatchProduct) => {
    handleAddToCart(product);
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleSelectProduct = (product: WatchProduct) => {
    setSelectedProduct(product);
  };

  const handleNavigateHome = () => {
    setSelectedProduct(null);
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);
  };

  const handleNavigateSection = (sectionId: string) => {
    if (selectedProduct) {
      setSelectedProduct(null);
      setTimeout(() => {
        ScrollTrigger.refresh();
        if (sectionId === "top") {
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
          const el = document.getElementById(sectionId);
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }
      }, 120);
    } else {
      if (sectionId === "top") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#09090B] text-[#F5F3EF] flex flex-col">
      <Navbar
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onNavigateHome={handleNavigateHome}
        isDetailView={Boolean(selectedProduct)}
      />

      <main className="flex-1">
        {selectedProduct ? (
          <ProductDetailView
            product={selectedProduct}
            allProducts={WATCH_PRODUCTS}
            onBack={handleNavigateHome}
            onSelectProduct={handleSelectProduct}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
          />
        ) : (
          <>
            {/* 1. Cinematic Scroll-Driven 100-Frame Watch Hero */}
            <WatchHero
              heroProduct={heroProduct}
              onExploreCollection={() => handleNavigateSection("collection")}
              onViewDetails={handleSelectProduct}
            />

            {/* 2. Featured Timepieces */}
            <FeaturedWatches
              products={WATCH_PRODUCTS}
              onSelectProduct={handleSelectProduct}
              onAddToCart={handleAddToCart}
              onViewAllClick={() => handleNavigateSection("collection")}
            />

            {/* 3. Editorial Brand Statement & 4. Curated Collection */}
            <EditorialSection
              products={WATCH_PRODUCTS}
              onSelectProduct={handleSelectProduct}
              onAddToCart={handleAddToCart}
            />

            {/* 5. Craftsmanship / Detail, 6. Editorial About, 7. Private Concierge Contact */}
            <CraftsmanshipSection
              onExploreClick={() => handleNavigateSection("collection")}
            />
          </>
        )}
      </main>

      {/* 8. Minimal Luxury Footer */}
      <Footer onNavigateSection={handleNavigateSection} />

      {/* Slide-Over Shopping Bag & Private Allocation Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        items={cartItems}
        onClose={() => setIsCartOpen(false)}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />
    </div>
  );
}

