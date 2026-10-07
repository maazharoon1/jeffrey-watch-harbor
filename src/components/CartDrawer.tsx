import React, { useState } from "react";
import { X, Plus, Minus, Trash2, CheckCircle2, ShieldCheck } from "lucide-react";
import { WatchProduct, formatCurrency } from "../data/watches";

export interface CartItem {
  product: WatchProduct;
  quantity: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  items: CartItem[];
  onClose: () => void;
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  items,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) => {
  const [checkoutStep, setCheckoutStep] = useState<"bag" | "checkout" | "confirmed">("bag");
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [confirmedTotal, setConfirmedTotal] = useState(0);

  if (!isOpen) return null;

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const handleCompleteAcquisition = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !clientPhone.trim()) return;
    const generatedRef = `JWH-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderNumber(generatedRef);
    setConfirmedTotal(subtotal);
    onClearCart();
    setCheckoutStep("confirmed");
  };

  const handleCloseDrawer = () => {
    if (checkoutStep === "confirmed") {
      setCheckoutStep("bag");
    }
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Bag and Private Checkout"
      className="fixed inset-0 z-50 flex justify-end"
    >
      {/* Backdrop */}
      <div
        onClick={handleCloseDrawer}
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer Panel */}
      <div className="relative z-10 w-full max-w-lg bg-[#0D0D11] border-l border-white/[0.08] h-full flex flex-col justify-between overflow-hidden">
        {/* Drawer Header */}
        <div className="px-6 py-5 border-b border-white/[0.08] flex items-center justify-between">
          <div>
            <p className="text-[10px] tracking-[0.22em] text-[#C9A96E] uppercase">
              JEFFREY WATCH HARBOR
            </p>
            <h2 className="font-serif-display text-2xl text-[#F5F3EF]">
              {checkoutStep === "bag" && "Your Selection"}
              {checkoutStep === "checkout" && "Private Allocation & Courier"}
              {checkoutStep === "confirmed" && "Allocation Confirmed"}
            </h2>
          </div>

          <button
            type="button"
            onClick={handleCloseDrawer}
            aria-label="Close drawer"
            className="p-2 text-[#A1A1AA] hover:text-[#F5F3EF] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {checkoutStep === "confirmed" ? (
            <div className="py-10 space-y-6">
              <CheckCircle2 className="w-11 h-11 text-[#C9A96E]" />
              <div>
                <p className="font-mono-tabular text-xs tracking-[0.2em] text-[#C9A96E] mb-1">
                  ORDER #{orderNumber} CONFIRMED
                </p>
                <h3 className="font-serif-display text-3xl text-[#F5F3EF] mb-2">
                  Preparing Insured Armored Dispatch
                </h3>
                <p className="text-sm text-[#A1A1AA] leading-relaxed">
                  Thank you, {clientName}. Our New York horological concierge
                  has reserved your timepiece allocation and will contact you at{" "}
                  <span className="text-[#F5F3EF] font-mono-tabular">
                    {clientPhone}
                  </span>{" "}
                  to coordinate signature delivery.
                </p>
              </div>

              <div className="p-5 bg-[#131318] border border-white/[0.07] space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#A1A1AA]">Allocation Total</span>
                  <span className="font-mono-tabular text-[#F5F3EF]">
                    {formatCurrency(confirmedTotal)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A1A1AA]">Insured Armored Courier</span>
                  <span className="text-[#C9A96E]">Complimentary</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A1A1AA]">Direct Salon Desk</span>
                  <span className="font-mono-tabular text-[#F5F3EF]">
                    +1 646-701-4738
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCloseDrawer}
                className="w-full py-4 bg-[#C9A96E] hover:bg-[#D8BC84] text-[#09090B] text-xs tracking-[0.2em] font-semibold transition-colors whitespace-nowrap"
              >
                RETURN TO SALON
              </button>
            </div>
          ) : items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-16">
              <p className="font-serif-display text-3xl text-[#F5F3EF] mb-2">
                Your Bag is Empty
              </p>
              <p className="text-xs text-[#A1A1AA] max-w-xs mb-8 leading-relaxed">
                Explore our curated archive of chronographs, tourbillons, and
                dress timepieces.
              </p>
              <button
                type="button"
                onClick={handleCloseDrawer}
                className="px-7 py-3.5 border border-white/20 hover:border-[#C9A96E] text-xs tracking-[0.2em] text-[#F5F3EF] transition-colors whitespace-nowrap"
              >
                EXPLORE COLLECTION
              </button>
            </div>
          ) : checkoutStep === "bag" ? (
            <div className="space-y-5">
              {items.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="flex gap-4 p-4 bg-[#131318] border border-white/[0.07]"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-24 h-20 object-cover bg-[#09090B] shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-mono-tabular text-[10px] tracking-[0.16em] text-[#C9A96E]">
                          {product.reference}
                        </p>
                        <h3 className="font-serif-display text-xl text-[#F5F3EF] truncate">
                          {product.name}
                        </h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => onRemoveItem(product.id)}
                        aria-label={`Remove ${product.name}`}
                        className="text-[#A1A1AA] hover:text-[#F5F3EF] p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="inline-flex items-center border border-white/15 bg-[#09090B]">
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(product.id, -1)}
                          aria-label="Decrease quantity"
                          className="p-1.5 text-[#A1A1AA] hover:text-[#F5F3EF]"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-3 text-xs font-mono-tabular text-[#F5F3EF]">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(product.id, 1)}
                          aria-label="Increase quantity"
                          className="p-1.5 text-[#A1A1AA] hover:text-[#F5F3EF]"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="font-mono-tabular text-sm text-[#F5F3EF]">
                        {formatCurrency(product.price * quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <form
              id="private-checkout-form"
              onSubmit={handleCompleteAcquisition}
              className="space-y-5"
            >
              <button
                type="button"
                onClick={() => setCheckoutStep("bag")}
                className="text-xs tracking-[0.16em] text-[#C9A96E] hover:text-[#F5F3EF] transition-colors"
              >
                ← EDIT BAG SELECTION
              </button>

              <div>
                <label className="block text-[11px] tracking-[0.18em] text-[#A1A1AA] uppercase mb-2">
                  Client Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Jonathan Vance"
                  className="w-full px-4 py-3 bg-[#09090B] border border-white/15 focus:border-[#C9A96E] text-sm text-[#F5F3EF] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] tracking-[0.18em] text-[#A1A1AA] uppercase mb-2">
                  Direct Telephone *
                </label>
                <input
                  type="tel"
                  required
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  placeholder="+1 646-000-0000"
                  className="w-full px-4 py-3 bg-[#09090B] border border-white/15 focus:border-[#C9A96E] text-sm text-[#F5F3EF] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] tracking-[0.18em] text-[#A1A1AA] uppercase mb-2">
                  Email for Provenance Certificate *
                </label>
                <input
                  type="email"
                  required
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder="client@domain.com"
                  className="w-full px-4 py-3 bg-[#09090B] border border-white/15 focus:border-[#C9A96E] text-sm text-[#F5F3EF] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] tracking-[0.18em] text-[#A1A1AA] uppercase mb-2">
                  Insured Delivery Destination *
                </label>
                <textarea
                  rows={3}
                  required
                  value={clientAddress}
                  onChange={(e) => setClientAddress(e.target.value)}
                  placeholder="Street Address, Suite, City, Postal Code, Country"
                  className="w-full px-4 py-3 bg-[#09090B] border border-white/15 focus:border-[#C9A96E] text-sm text-[#F5F3EF] focus:outline-none resize-none"
                />
              </div>
            </form>
          )}
        </div>

        {/* Drawer Footer */}
        {items.length > 0 && checkoutStep !== "confirmed" && (
          <div className="p-6 border-t border-white/[0.08] bg-[#101014] space-y-4">
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-[#A1A1AA]">
                <span>Insured Armored Courier</span>
                <span className="text-[#C9A96E]">Complimentary</span>
              </div>
              <div className="flex justify-between text-sm text-[#F5F3EF] pt-2 border-t border-white/[0.06]">
                <span className="tracking-[0.16em] uppercase">Total</span>
                <span className="font-mono-tabular text-lg font-medium">
                  {formatCurrency(subtotal)}
                </span>
              </div>
            </div>

            {checkoutStep === "bag" ? (
              <button
                type="button"
                onClick={() => setCheckoutStep("checkout")}
                className="w-full py-4 bg-[#C9A96E] hover:bg-[#D8BC84] text-[#09090B] text-xs tracking-[0.2em] font-semibold transition-colors whitespace-nowrap"
              >
                PROCEED TO PRIVATE ALLOCATION
              </button>
            ) : (
              <button
                type="submit"
                form="private-checkout-form"
                className="w-full py-4 bg-[#C9A96E] hover:bg-[#D8BC84] text-[#09090B] text-xs tracking-[0.2em] font-semibold transition-colors whitespace-nowrap"
              >
                CONFIRM ALLOCATION ({formatCurrency(subtotal)})
              </button>
            )}

            <div className="flex items-center justify-center gap-2 text-[11px] text-[#A1A1AA]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C9A96E]" />
              <span>Full Lloyd’s of London Transit Insurance Included</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
