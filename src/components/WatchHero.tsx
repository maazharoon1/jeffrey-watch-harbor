import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDownRight, Eye } from "lucide-react";
import {
  FRAME_COUNT,
  preloadWatchFrames,
  drawWatchFrameToCanvas,
  initFallbackRefImage,
  getFrameUrl,
} from "../lib/watchFrames";
import { WatchProduct } from "../data/watches";

gsap.registerPlugin(ScrollTrigger);

interface WatchHeroProps {
  heroProduct: WatchProduct;
  onExploreCollection: () => void;
  onViewDetails: (product: WatchProduct) => void;
}

export const WatchHero: React.FC<WatchHeroProps> = ({
  heroProduct,
  onExploreCollection,
  onViewDetails,
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const introContentRef = useRef<HTMLDivElement>(null);
  const midCaptionRef = useRef<HTMLDivElement>(null);
  const finaleContentRef = useRef<HTMLDivElement>(null);

  const currentFrameRef = useRef<number>(1);
  const rafIdRef = useRef<number | null>(null);

  const [displayFrame, setDisplayFrame] = useState<number>(1);
  const [loadedFrames, setLoadedFrames] = useState<number>(1);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const renderCurrentFrame = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      const targetW = Math.floor(rect.width * dpr);
      const targetH = Math.floor(rect.height * dpr);

      if (canvas.width !== targetW || canvas.height !== targetH) {
        canvas.width = targetW;
        canvas.height = targetH;
      }

      drawWatchFrameToCanvas(ctx, canvas.width, canvas.height, currentFrameRef.current);
    };

    const scheduleRender = () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
      rafIdRef.current = requestAnimationFrame(() => {
        renderCurrentFrame();
        rafIdRef.current = null;
      });
    };

    // Initialize studio reference texture & preload the 100 Cloudinary WebP frames
    initFallbackRefImage(heroProduct.image, scheduleRender);

    const cancelPreload = preloadWatchFrames(
      () => {
        // Immediately render frame-001 when ready
        scheduleRender();
      },
      (loadedCount) => {
        setLoadedFrames(loadedCount);
        scheduleRender();
      }
    );

    // Initial draw for frame-001
    scheduleRender();

    const handleResize = () => {
      scheduleRender();
    };
    window.addEventListener("resize", handleResize, { passive: true });

    // GSAP ScrollTrigger scrub mapping scroll progress (0..1) -> frame (001..100)
    const gsapCtx = gsap.context(() => {
      const playhead = { frame: 1 };

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.4,
        onUpdate: (self) => {
          // Map ScrollTrigger progress (0..1) directly to frame 1..100
          const exactFrame = 1 + self.progress * (FRAME_COUNT - 1);
          const roundedFrame = Math.max(1, Math.min(FRAME_COUNT, Math.round(exactFrame)));
          playhead.frame = roundedFrame;

          if (currentFrameRef.current !== roundedFrame) {
            currentFrameRef.current = roundedFrame;
            setDisplayFrame(roundedFrame);
            scheduleRender();
          } else {
            scheduleRender();
          }

          // Editorial story choreography driven by scroll progress
          const p = self.progress;

          // 1. Initial Hero Headline fades and moves away smoothly as watch sequence begins
          if (introContentRef.current) {
            const introOpacity = p <= 0.04 ? 1 : Math.max(0, 1 - (p - 0.04) / 0.18);
            const introY = p <= 0.04 ? 0 : -(p - 0.04) * 140;
            introContentRef.current.style.opacity = String(introOpacity);
            introContentRef.current.style.transform = `translate3d(0, ${introY}px, 0)`;
            introContentRef.current.style.pointerEvents = introOpacity > 0.25 ? "auto" : "none";
          }

          // 2. Mid-sequence minimal editorial note (frames 030 - 070)
          if (midCaptionRef.current) {
            let midOpacity = 0;
            if (p >= 0.28 && p <= 0.72) {
              midOpacity =
                p < 0.38
                  ? (p - 0.28) / 0.1
                  : p > 0.62
                  ? (0.72 - p) / 0.1
                  : 1;
            }
            const midY = (0.5 - p) * 40;
            midCaptionRef.current.style.opacity = String(Math.max(0, Math.min(1, midOpacity)));
            midCaptionRef.current.style.transform = `translate3d(0, ${midY}px, 0)`;
          }

          // 3. Finale CTA reveal as sequence settles toward frame-100 (progress 0.80 -> 1.00)
          if (finaleContentRef.current) {
            const finaleOpacity = p < 0.78 ? 0 : Math.min(1, (p - 0.78) / 0.15);
            const finaleY = p < 0.78 ? 28 : Math.max(0, (1 - finaleOpacity) * 28);
            finaleContentRef.current.style.opacity = String(finaleOpacity);
            finaleContentRef.current.style.transform = `translate3d(0, ${finaleY}px, 0)`;
            finaleContentRef.current.style.pointerEvents = finaleOpacity > 0.35 ? "auto" : "none";
          }
        },
      });
    }, sectionRef);

    return () => {
      cancelPreload();
      window.removeEventListener("resize", handleResize);
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
      gsapCtx.revert();
    };
  }, [heroProduct.image]);

  const paddedFrame = String(displayFrame).padStart(3, "0");
  const progressPercent = Math.round(((displayFrame - 1) / (FRAME_COUNT - 1)) * 100);

  return (
    <section
      id="top"
      ref={sectionRef}
      aria-label="Scroll-driven luxury timepiece showcase"
      className="relative h-[420vh] w-full bg-[#09090B]"
    >
      {/* Sticky Full-Screen Viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Scroll-Driven 100-Frame Canvas */}
        <canvas
          ref={canvasRef}
          data-current-frame-url={getFrameUrl(displayFrame)}
          className="absolute inset-0 w-full h-full block"
        />

        {/* Measured Edge Vignette Scrims for WCAG AA Text Contrast without obscuring the watch center */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#09090B]/90 via-[#09090B]/20 to-[#09090B]/70"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#09090B] via-transparent to-[#09090B]/60"
        />

        {/* STAGE 1: Initial Hero Editorial Composition (Frames 001 - 022) */}
        <div
          ref={introContentRef}
          className="relative z-10 h-full max-w-[1400px] mx-auto px-6 md:px-12 flex flex-col justify-end pb-20 md:pb-24 md:justify-center pointer-events-auto will-change-transform"
        >
          <div className="max-w-lg">
            <p className="text-[11px] md:text-xs tracking-[0.28em] text-[#C9A96E] mb-4 font-medium">
              JEFFREY WATCH HARBOR
            </p>

            <h1 className="font-serif-display text-5xl sm:text-6xl md:text-7xl lg:text-[84px] leading-[0.94] tracking-[-0.01em] text-[#F5F3EF] mb-6">
              TIME,
              <br />
              <span className="italic font-normal text-[#E8D5B0]">REFINED.</span>
            </h1>

            <p className="text-sm md:text-base text-[#A1A1AA] leading-relaxed max-w-md mb-9 font-light">
              Curated timepieces for those who value precision, craftsmanship and timeless design.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={onExploreCollection}
                className="group inline-flex items-center gap-3 px-7 py-3.5 bg-[#C9A96E] hover:bg-[#D8BC84] text-[#09090B] text-xs tracking-[0.2em] font-semibold transition-all duration-200 whitespace-nowrap"
              >
                <span>EXPLORE COLLECTION</span>
                <ArrowDownRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
              </button>

              <button
                type="button"
                onClick={() => onViewDetails(heroProduct)}
                className="inline-flex items-center gap-2.5 px-7 py-3.5 border border-white/20 hover:border-[#C9A96E] bg-black/40 hover:bg-black/70 text-[#F5F3EF] text-xs tracking-[0.2em] font-medium transition-all duration-200 backdrop-blur-sm whitespace-nowrap"
              >
                <Eye className="w-3.5 h-3.5 text-[#C9A96E]" />
                <span>VIEW DETAILS</span>
              </button>
            </div>
          </div>
        </div>

        {/* STAGE 2: Mid-Scroll Poetic Horology Note (Frames 028 - 072) */}
        <div
          ref={midCaptionRef}
          style={{ opacity: 0 }}
          className="pointer-events-none absolute inset-x-0 bottom-20 md:bottom-24 z-10 max-w-[1400px] mx-auto px-6 md:px-12 flex justify-between items-end will-change-transform"
        >
          <div className="max-w-xs bg-[#09090B]/70 backdrop-blur-md border-l border-[#C9A96E]/50 pl-4 py-2">
            <p className="font-mono-tabular text-[11px] tracking-[0.2em] text-[#C9A96E] mb-1">
              CALIBRE JWH-8901 · 28,800 VPH
            </p>
            <p className="font-serif-display text-xl md:text-2xl text-[#F5F3EF] leading-snug">
              Every bevel hand-polished to capture passing light.
            </p>
          </div>
        </div>

        {/* STAGE 3: Finale Sequence Resolution on Frame 100 (Frames 078 - 100) */}
        <div
          ref={finaleContentRef}
          style={{ opacity: 0, pointerEvents: "none" }}
          className="absolute inset-x-0 bottom-20 md:bottom-24 z-10 max-w-[1400px] mx-auto px-6 md:px-12 flex flex-col md:flex-row md:items-end justify-between gap-6 will-change-transform"
        >
          <div className="max-w-md bg-[#09090B]/75 backdrop-blur-md p-6 border border-white/[0.08]">
            <p className="font-mono-tabular text-[11px] tracking-[0.22em] text-[#C9A96E] mb-2">
              {heroProduct.reference} · {heroProduct.category.toUpperCase()}
            </p>
            <h2 className="font-serif-display text-3xl md:text-4xl text-[#F5F3EF] mb-2">
              {heroProduct.name}
            </h2>
            <p className="text-xs md:text-sm text-[#A1A1AA] mb-5 leading-relaxed">
              {heroProduct.subtitle}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => onViewDetails(heroProduct)}
                className="px-6 py-3 bg-[#C9A96E] hover:bg-[#D8BC84] text-[#09090B] text-xs tracking-[0.18em] font-semibold transition-colors duration-200 whitespace-nowrap"
              >
                VIEW DETAILS
              </button>
              <button
                type="button"
                onClick={onExploreCollection}
                className="px-6 py-3 border border-white/20 hover:border-white/50 text-[#F5F3EF] text-xs tracking-[0.18em] transition-colors duration-200 whitespace-nowrap"
              >
                EXPLORE COLLECTION
              </button>
            </div>
          </div>
        </div>

        {/* Subtle Bottom Sequence Scrubber Readout */}
        <div className="pointer-events-none absolute bottom-6 left-0 right-0 z-20 max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between text-[11px] font-mono-tabular tracking-[0.18em] text-[#A1A1AA]">
          <div className="flex items-center gap-3">
            <span className="text-[#F5F3EF]">FRAME {paddedFrame}</span>
            <span aria-hidden="true" className="text-white/25">
              /
            </span>
            <span>{FRAME_COUNT}</span>
            {loadedFrames < FRAME_COUNT && (
              <span className="hidden sm:inline text-[#A1A1AA]/60">
                · BUFFERED {loadedFrames}%
              </span>
            )}
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden sm:inline text-[10px] tracking-[0.24em] text-[#A1A1AA]/80">
              SCROLL TO ADVANCE SEQUENCE
            </span>
            <div className="w-24 sm:w-36 h-[1px] bg-white/15 relative overflow-hidden">
              <div
                className="absolute top-0 left-0 bottom-0 bg-[#C9A96E] transition-all duration-75"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
