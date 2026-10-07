import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Phone, Mail, ArrowUpRight, CheckCircle2 } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

interface CraftsmanshipSectionProps {
  onExploreClick: () => void;
}

export const CraftsmanshipSection: React.FC<CraftsmanshipSectionProps> = ({
  onExploreClick,
}) => {
  const craftSectionRef = useRef<HTMLElement>(null);
  const imageWrapRef = useRef<HTMLDivElement>(null);
  const imageInnerRef = useRef<HTMLImageElement>(null);
  const [macroImgError, setMacroImgError] = useState(false);

  // Contact form state
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [inquirySubmitted, setInquirySubmitted] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (imageWrapRef.current && imageInnerRef.current) {
        gsap.fromTo(
          imageWrapRef.current,
          { clipPath: "inset(12% 8% 12% 8%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            ease: "none",
            scrollTrigger: {
              trigger: craftSectionRef.current,
              start: "top 75%",
              end: "center center",
              scrub: 0.6,
            },
          }
        );

        gsap.fromTo(
          imageInnerRef.current,
          { scale: 1.15 },
          {
            scale: 1.0,
            ease: "none",
            scrollTrigger: {
              trigger: craftSectionRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.6,
            },
          }
        );
      }
    }, craftSectionRef);

    return () => ctx.revert();
  }, []);

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactEmail.trim()) return;
    setInquirySubmitted(true);
  };

  return (
    <>
      {/* SECTION 5: Craftsmanship / Macro Detail Section */}
      <section
        id="craftsmanship"
        ref={craftSectionRef}
        aria-labelledby="craftsmanship-heading"
        className="py-24 md:py-36 bg-[#0C0C0F] border-t border-white/[0.06]"
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="max-w-2xl mb-14">
            <p className="text-xs tracking-[0.26em] text-[#C9A96E] mb-4">
              04. HAUTE HORLOGERIE
            </p>
            <h2
              id="craftsmanship-heading"
              className="font-serif-display text-5xl md:text-6xl lg:text-7xl leading-[0.96] text-[#F5F3EF] mb-6"
            >
              THE ART
              <br />
              <span className="italic font-normal text-[#E8D5B0]">
                OF PRECISION
              </span>
            </h2>
            <p className="text-sm md:text-base text-[#A1A1AA] font-light leading-relaxed">
              Beneath every dial lies hundreds of hours of hand-chamfered
              bridges, black-polished steel screws, and microscopic tolerances.
            </p>
          </div>

          {/* Masked Scroll-Revealed Macro Movement Showcase */}
          <div
            ref={imageWrapRef}
            className="relative aspect-[16/9] w-full overflow-hidden border border-white/[0.08] bg-[#141418] mb-14 will-change-transform"
          >
            {!macroImgError ? (
              <img
                ref={imageInnerRef}
                src="/src/assets/images/craftsmanship_macro_movement_1791334761037.jpg"
                alt="Extreme macro view of Swiss mechanical watch calibre with gold balance wheel and ruby jewels"
                referrerPolicy="no-referrer"
                onError={() => setMacroImgError(true)}
                className="w-full h-full object-cover object-center will-change-transform"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-[#141418] p-12">
                <p className="font-serif-display text-3xl text-[#C9A96E]">
                  Calibre JWH-8901 Manufacture Movement
                </p>
              </div>
            )}

            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0C0C0F] via-transparent to-black/30"
            />

            <div className="absolute bottom-6 left-6 right-6 md:bottom-10 md:left-10 md:right-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <p className="font-mono-tabular text-xs tracking-[0.2em] text-[#C9A96E] mb-1">
                  CALIBRE JWH-8901 · 312 COMPONENTS
                </p>
                <p className="font-serif-display text-2xl md:text-3xl text-[#F5F3EF]">
                  Geneva Seal Hand-Beveled Architecture
                </p>
              </div>
              <span className="font-mono-tabular text-xs tracking-[0.18em] text-[#A1A1AA]">
                4 HZ · 34 RUBY JEWELS
              </span>
            </div>
          </div>

          {/* 3 Concise Craftsmanship Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6 border-t border-white/[0.07]">
            <div>
              <p className="font-mono-tabular text-xs tracking-[0.2em] text-[#C9A96E] mb-2">
                01 · ANGLAGE & POLISHING
              </p>
              <h3 className="font-serif-display text-2xl text-[#F5F3EF] mb-2">
                Hand-Chamfered Bridges
              </h3>
              <p className="text-xs md:text-sm text-[#A1A1AA] font-light leading-relaxed">
                Every interior angle is beveled with boxwood and diamond paste to
                catch warm light beneath the sapphire exhibition back.
              </p>
            </div>

            <div>
              <p className="font-mono-tabular text-xs tracking-[0.2em] text-[#C9A96E] mb-2">
                02 · ESCAPEMENT GEOMETRY
              </p>
              <h3 className="font-serif-display text-2xl text-[#F5F3EF] mb-2">
                Free-Sprung Balance
              </h3>
              <p className="text-xs md:text-sm text-[#A1A1AA] font-light leading-relaxed">
                Variable-inertia gold mass screws and a Breguet overcoil hairspring
                maintain isochronism in six spatial positions.
              </p>
            </div>

            <div>
              <p className="font-mono-tabular text-xs tracking-[0.2em] text-[#C9A96E] mb-2">
                03 · PRECIOUS METALLURGY
              </p>
              <h3 className="font-serif-display text-2xl text-[#F5F3EF] mb-2">
                950 Platinum & 18k Gold
              </h3>
              <p className="text-xs md:text-sm text-[#A1A1AA] font-light leading-relaxed">
                Cases are cold-forged and hand-brushed with alternating satin flanks
                and mirror-polished lugs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: Editorial About Section */}
      <section
        id="about"
        aria-labelledby="about-heading"
        className="py-24 md:py-32 bg-[#09090B] border-t border-white/[0.06]"
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5">
              <p className="text-xs tracking-[0.26em] text-[#C9A96E] mb-4">
                05. THE HOUSE OF JEFFREY WATCH HARBOR
              </p>
              <h2
                id="about-heading"
                className="font-serif-display text-4xl md:text-5xl text-[#F5F3EF] leading-tight mb-6"
              >
                Sanctuary for the Discerning Collector.
              </h2>
              <p className="text-sm md:text-base text-[#A1A1AA] font-light leading-relaxed mb-8">
                Jeffrey Watch Harbor curates rare mechanical timepieces defined by
                four uncompromising tenets: chronometric precision, artisan
                craftsmanship, architectural restraint, and provenance curation.
              </p>

              <div className="grid grid-cols-2 gap-6 pt-6 border-t border-white/[0.07]">
                <div>
                  <p className="font-serif-display text-2xl text-[#F5F3EF] mb-1">
                    Precision
                  </p>
                  <p className="text-xs text-[#A1A1AA]">
                    Six-position chronometric verification prior to allocation.
                  </p>
                </div>
                <div>
                  <p className="font-serif-display text-2xl text-[#F5F3EF] mb-1">
                    Curation
                  </p>
                  <p className="text-xs text-[#A1A1AA]">
                    Limited references chosen for enduring collector value.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="aspect-[4/3] overflow-hidden border border-white/[0.07] bg-[#121215]">
                <img
                  src="/src/assets/images/watch_tourbillon_platinum_1791334716912.jpg"
                  alt="Platinum Flying Tourbillon timepiece on dark suede"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-[4/3] overflow-hidden border border-white/[0.07] bg-[#121215] sm:translate-y-8">
                <img
                  src="/src/assets/images/watch_perpetual_moonphase_1791334746360.jpg"
                  alt="18k Champagne Gold Perpetual Moonphase timepiece"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: Final CTA & Minimal Private Concierge Contact Section */}
      <section
        id="contact"
        aria-labelledby="contact-heading"
        className="py-24 md:py-32 bg-[#0C0C0F] border-t border-white/[0.06]"
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-14">
            {/* Left: Direct Salon Contact Details & CTAs */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div>
                <p className="text-xs tracking-[0.26em] text-[#C9A96E] mb-4">
                  06. PRIVATE SALON & CONCIERGE
                </p>
                <h2
                  id="contact-heading"
                  className="font-serif-display text-4xl md:text-5xl text-[#F5F3EF] leading-tight mb-5"
                >
                  Begin a Private Consultation.
                </h2>
                <p className="text-sm text-[#A1A1AA] font-light leading-relaxed mb-10">
                  Speak directly with our horological specialists for private
                  viewings, provenance dossiers, or insured global delivery.
                </p>

                <div className="space-y-5">
                  <a
                    href="tel:+16467014738"
                    className="group flex items-center justify-between p-5 bg-[#121216] border border-white/[0.07] hover:border-[#C9A96E]/50 transition-all duration-200"
                  >
                    <div className="flex items-center gap-4">
                      <Phone className="w-4 h-4 text-[#C9A96E]" />
                      <div>
                        <p className="text-[11px] tracking-[0.18em] text-[#A1A1AA] uppercase">
                          DIRECT TELEPHONE
                        </p>
                        <p className="font-mono-tabular text-base text-[#F5F3EF]">
                          +1 646-701-4738
                        </p>
                      </div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-[#A1A1AA] group-hover:text-[#C9A96E] transition-colors" />
                  </a>

                  <a
                    href="mailto:combjeff6@gmail.com"
                    className="group flex items-center justify-between p-5 bg-[#121216] border border-white/[0.07] hover:border-[#C9A96E]/50 transition-all duration-200"
                  >
                    <div className="flex items-center gap-4">
                      <Mail className="w-4 h-4 text-[#C9A96E]" />
                      <div>
                        <p className="text-[11px] tracking-[0.18em] text-[#A1A1AA] uppercase">
                          CONCIERGE EMAIL
                        </p>
                        <p className="font-mono-tabular text-base text-[#F5F3EF]">
                          combjeff6@gmail.com
                        </p>
                      </div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-[#A1A1AA] group-hover:text-[#C9A96E] transition-colors" />
                  </a>

                  <a
                    href="https://www.facebook.com/profile.php?id=61594240898367"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between p-5 bg-[#121216] border border-white/[0.07] hover:border-[#C9A96E]/50 transition-all duration-200"
                  >
                    <div>
                      <p className="text-[11px] tracking-[0.18em] text-[#A1A1AA] uppercase">
                        OFFICIAL SOCIAL CHANNEL
                      </p>
                      <p className="text-sm text-[#F5F3EF] mt-0.5">
                        Jeffrey Watch Harbor on Facebook
                      </p>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-[#A1A1AA] group-hover:text-[#C9A96E] transition-colors" />
                  </a>
                </div>
              </div>

              <div className="mt-10 pt-6 border-t border-white/[0.07]">
                <button
                  type="button"
                  onClick={onExploreClick}
                  className="text-xs tracking-[0.2em] text-[#C9A96E] hover:text-[#F5F3EF] transition-colors whitespace-nowrap"
                >
                  RETURN TO CURATED COLLECTION ↑
                </button>
              </div>
            </div>

            {/* Right: Minimal Private Inquiry Form */}
            <div className="lg:col-span-7 bg-[#111115] border border-white/[0.08] p-8 md:p-12">
              {inquirySubmitted ? (
                <div className="h-full flex flex-col items-start justify-center py-12">
                  <CheckCircle2 className="w-10 h-10 text-[#C9A96E] mb-4" />
                  <h3 className="font-serif-display text-3xl text-[#F5F3EF] mb-2">
                    Private Inquiry Received
                  </h3>
                  <p className="text-sm text-[#A1A1AA] leading-relaxed mb-6 max-w-md">
                    Thank you, {contactName}. Our senior horologist will respond
                    to <span className="text-[#F5F3EF]">{contactEmail}</span>{" "}
                    shortly regarding your timepiece inquiry.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setInquirySubmitted(false);
                      setContactName("");
                      setContactEmail("");
                      setContactMessage("");
                    }}
                    className="px-6 py-3 border border-white/20 hover:border-[#C9A96E] text-xs tracking-[0.18em] text-[#F5F3EF] transition-colors whitespace-nowrap"
                  >
                    SEND ANOTHER INQUIRY
                  </button>
                </div>
              ) : (
                <form onSubmit={handleInquirySubmit} className="space-y-6">
                  <div>
                    <h3 className="font-serif-display text-3xl text-[#F5F3EF] mb-2">
                      Request a Private Dossier
                    </h3>
                    <p className="text-xs text-[#A1A1AA] tracking-[0.06em]">
                      Inquire about availability, bespoke strap fittings, or
                      private appointments.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="inquiry-name"
                        className="block text-[11px] tracking-[0.18em] text-[#A1A1AA] uppercase mb-2"
                      >
                        Full Name
                      </label>
                      <input
                        id="inquiry-name"
                        type="text"
                        required
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="Alexander Sterling"
                        className="w-full px-4 py-3.5 bg-[#09090B] border border-white/15 focus:border-[#C9A96E] text-sm text-[#F5F3EF] placeholder:text-white/25 focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="inquiry-email"
                        className="block text-[11px] tracking-[0.18em] text-[#A1A1AA] uppercase mb-2"
                      >
                        Email Address
                      </label>
                      <input
                        id="inquiry-email"
                        type="email"
                        required
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="sterling@private.com"
                        className="w-full px-4 py-3.5 bg-[#09090B] border border-white/15 focus:border-[#C9A96E] text-sm text-[#F5F3EF] placeholder:text-white/25 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="inquiry-message"
                      className="block text-[11px] tracking-[0.18em] text-[#A1A1AA] uppercase mb-2"
                    >
                      Reference or Message
                    </label>
                    <textarea
                      id="inquiry-message"
                      rows={4}
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      placeholder="Specify the reference of interest or preferred consultation time..."
                      className="w-full px-4 py-3.5 bg-[#09090B] border border-white/15 focus:border-[#C9A96E] text-sm text-[#F5F3EF] placeholder:text-white/25 focus:outline-none transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto px-8 py-4 bg-[#C9A96E] hover:bg-[#D8BC84] text-[#09090B] text-xs tracking-[0.2em] font-semibold transition-colors duration-200 whitespace-nowrap"
                  >
                    SUBMIT PRIVATE INQUIRY
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
