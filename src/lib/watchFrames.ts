export const FRAME_COUNT = 100;

export const getFrameUrl = (index: number): string => {
  const safeIndex = Math.max(1, Math.min(FRAME_COUNT, Math.round(index)));
  const frame = String(safeIndex).padStart(3, "0");
  return `https://res.cloudinary.com/z08v8we6/image/upload/v1791334500/frame-${frame}.webp`;
};

type FrameStatus = "idle" | "loading" | "loaded" | "error";

interface FrameEntry {
  index: number;
  url: string;
  image: HTMLImageElement;
  status: FrameStatus;
}

// Persistent module-level cache so Image objects are created once and reused
const frameStore: Map<number, FrameEntry> = new Map();
let fallbackRefImage: HTMLImageElement | null = null;
let fallbackRefLoaded = false;

export const initFallbackRefImage = (src: string, onReady?: () => void) => {
  if (typeof window === "undefined") return;
  if (fallbackRefImage) {
    if (fallbackRefLoaded && onReady) onReady();
    return;
  }
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.referrerPolicy = "no-referrer";
  img.onload = () => {
    fallbackRefLoaded = true;
    if (onReady) onReady();
  };
  img.src = src;
  fallbackRefImage = img;
};

/**
 * Progressive frame preloader.
 * Prioritizes frame-001 first so the hero appears immediately,
 * then loads keyframe steps, followed by all remaining sequential frames.
 */
export const preloadWatchFrames = (
  onFirstFrameLoaded?: () => void,
  onProgress?: (loadedCount: number, total: number) => void
): (() => void) => {
  if (typeof window === "undefined") return () => {};

  let isCancelled = false;
  let completedCount = 0;

  // Initialize entries once
  for (let i = 1; i <= FRAME_COUNT; i++) {
    if (!frameStore.has(i)) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.referrerPolicy = "no-referrer";
      frameStore.set(i, {
        index: i,
        url: getFrameUrl(i),
        image: img,
        status: "idle",
      });
    }
  }

  // Build priority queue: frame 1 first, then every 5th frame for instant scrub responsiveness, then all remaining frames
  const priorityOrder: number[] = [1];
  for (let i = 5; i <= FRAME_COUNT; i += 5) {
    if (!priorityOrder.includes(i)) priorityOrder.push(i);
  }
  for (let i = 2; i <= FRAME_COUNT; i++) {
    if (!priorityOrder.includes(i)) priorityOrder.push(i);
  }

  let queueIndex = 0;
  const MAX_CONCURRENT = 6;
  let activeRequests = 0;

  const notifyProgress = () => {
    if (isCancelled) return;
    if (onProgress) {
      onProgress(completedCount, FRAME_COUNT);
    }
  };

  const pumpQueue = () => {
    if (isCancelled) return;

    while (activeRequests < MAX_CONCURRENT && queueIndex < priorityOrder.length) {
      const frameIdx = priorityOrder[queueIndex++];
      const entry = frameStore.get(frameIdx);
      if (!entry) continue;

      if (entry.status === "loaded" || entry.status === "error") {
        completedCount++;
        if (frameIdx === 1 && onFirstFrameLoaded) onFirstFrameLoaded();
        notifyProgress();
        continue;
      }

      if (entry.status === "loading") continue;

      entry.status = "loading";
      activeRequests++;

      entry.image.onload = () => {
        activeRequests--;
        entry.status = "loaded";
        completedCount++;
        if (frameIdx === 1 && onFirstFrameLoaded) {
          onFirstFrameLoaded();
        }
        notifyProgress();
        pumpQueue();
      };

      entry.image.onerror = () => {
        activeRequests--;
        entry.status = "error";
        completedCount++;
        if (frameIdx === 1 && onFirstFrameLoaded) {
          onFirstFrameLoaded();
        }
        notifyProgress();
        pumpQueue();
      };

      entry.image.src = entry.url;
    }
  };

  // Start loading frame 1 immediately
  pumpQueue();

  return () => {
    isCancelled = true;
  };
};

/**
 * Returns the requested frame's HTMLImageElement if loaded,
 * or the closest already-loaded Cloudinary frame so the canvas never flickers.
 */
export const getLoadedFrameImage = (targetIndex: number): HTMLImageElement | null => {
  const clamped = Math.max(1, Math.min(FRAME_COUNT, Math.round(targetIndex)));
  const exact = frameStore.get(clamped);
  if (exact && exact.status === "loaded" && exact.image.complete && exact.image.naturalWidth > 0) {
    return exact.image;
  }

  // Search outward for nearest loaded frame
  for (let offset = 1; offset < FRAME_COUNT; offset++) {
    const prevIdx = clamped - offset;
    if (prevIdx >= 1) {
      const prev = frameStore.get(prevIdx);
      if (prev && prev.status === "loaded" && prev.image.complete && prev.image.naturalWidth > 0) {
        return prev.image;
      }
    }
    const nextIdx = clamped + offset;
    if (nextIdx <= FRAME_COUNT) {
      const next = frameStore.get(nextIdx);
      if (next && next.status === "loaded" && next.image.complete && next.image.naturalWidth > 0) {
        return next.image;
      }
    }
  }

  return null;
};

/**
 * Draws the current frame (1..100) onto the provided 2D canvas context.
 * Uses the exact Cloudinary WebP frame sequence when loaded.
 * If the remote Cloudinary frames are still loading or unreachable in a sandboxed network,
 * renders a high-precision 100-frame kinematic studio watch sequence so scroll scrubbing
 * remains smooth, responsive, and never displays a broken image icon.
 */
export const drawWatchFrameToCanvas = (
  ctx: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number,
  frameIndex: number
) => {
  const clampedFrame = Math.max(1, Math.min(FRAME_COUNT, Math.round(frameIndex)));
  const progress = (clampedFrame - 1) / (FRAME_COUNT - 1); // 0.0 -> 1.0

  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  // Deep obsidian luxury studio backdrop
  const bgGrad = ctx.createRadialGradient(
    canvasWidth * 0.5,
    canvasHeight * 0.5,
    canvasWidth * 0.05,
    canvasWidth * 0.5,
    canvasHeight * 0.5,
    Math.max(canvasWidth, canvasHeight) * 0.75
  );
  bgGrad.addColorStop(0, "#161518");
  bgGrad.addColorStop(0.55, "#0C0C0E");
  bgGrad.addColorStop(1, "#070708");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  const cloudinaryImage = getLoadedFrameImage(clampedFrame);

  if (cloudinaryImage) {
    // Draw the exact Cloudinary frame with responsive aspect-ratio preservation
    const imgW = cloudinaryImage.naturalWidth;
    const imgH = cloudinaryImage.naturalHeight;
    const scale = Math.max(
      Math.min(canvasWidth / imgW, canvasHeight / imgH) * 0.92,
      Math.max(canvasWidth / imgW, canvasHeight / imgH) * 0.78
    );
    const drawW = imgW * scale;
    const drawH = imgH * scale;
    const drawX = (canvasWidth - drawW) / 2;
    const drawY = (canvasHeight - drawH) / 2;

    ctx.save();
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(cloudinaryImage, drawX, drawY, drawW, drawH);
    ctx.restore();
    return;
  }

  // Graceful 100-frame kinematic studio watch sequence when Cloudinary frames are loading or offline
  renderKinematicWatchSequence(ctx, canvasWidth, canvasHeight, clampedFrame, progress);
};

function renderKinematicWatchSequence(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  frameIndex: number,
  progress: number
) {
  const cx = w * 0.5;
  const cy = h * 0.5;
  const minDim = Math.min(w, h);

  // Cinematic camera zoom & orbital perspective curve across frames 001 -> 100
  // Starts poised at 0.88 scale, swells to 1.14 mid-sequence for macro inspection, settles at 1.02 on frame-100
  const zoomCurve = 0.88 + Math.sin(progress * Math.PI) * 0.24 + progress * 0.12;
  const tiltX = Math.sin(progress * Math.PI * 2) * 0.085; // Subtle horizontal perspective shift
  const tiltY = (0.5 - progress) * 0.14; // Vertical camera elevation arc
  const lightAngle = -Math.PI * 0.65 + progress * Math.PI * 1.45;

  ctx.save();
  ctx.translate(cx, cy);

  // Ambient champagne halo behind the watch case that breathes with scroll progress
  const haloRadius = minDim * 0.42 * zoomCurve;
  const haloGrad = ctx.createRadialGradient(
    Math.cos(lightAngle) * haloRadius * 0.2,
    Math.sin(lightAngle) * haloRadius * 0.2,
    haloRadius * 0.05,
    0,
    0,
    haloRadius * 1.25
  );
  haloGrad.addColorStop(0, "rgba(201, 169, 110, 0.16)");
  haloGrad.addColorStop(0.45, "rgba(201, 169, 110, 0.05)");
  haloGrad.addColorStop(1, "rgba(9, 9, 11, 0)");
  ctx.fillStyle = haloGrad;
  ctx.beginPath();
  ctx.arc(0, 0, haloRadius * 1.25, 0, Math.PI * 2);
  ctx.fill();

  // If our studio watch reference image is loaded, blend it inside a 3D kinematic transform
  // enhanced with real-time dynamic rim lighting, crystal sweep, and live mechanical hands
  const baseRadius = minDim * 0.27 * zoomCurve;

  // Apply subtle 3D perspective matrix
  ctx.transform(1 - Math.abs(tiltX) * 0.18, tiltY * 0.22, -tiltX * 0.22, 1 - Math.abs(tiltY) * 0.12, 0, 0);

  // 1. Alligator Leather Strap (Top & Bottom lugs)
  const strapW = baseRadius * 0.96;
  const strapH = baseRadius * 2.55;
  const strapGrad = ctx.createLinearGradient(-strapW / 2, -strapH, strapW / 2, strapH);
  strapGrad.addColorStop(0, "#0A0A0C");
  strapGrad.addColorStop(0.25, "#19181B");
  strapGrad.addColorStop(0.5, "#232126");
  strapGrad.addColorStop(0.75, "#151417");
  strapGrad.addColorStop(1, "#09090B");

  ctx.fillStyle = strapGrad;
  ctx.beginPath();
  ctx.roundRect(-strapW / 2, -strapH * 0.72, strapW, strapH * 1.44, 14);
  ctx.fill();

  // Subtle alligator texture ridges & champagne stitching on strap
  ctx.strokeStyle = "rgba(201, 169, 110, 0.28)";
  ctx.lineWidth = 1.2;
  ctx.setLineDash([4, 5]);
  ctx.strokeRect(-strapW * 0.41, -strapH * 0.68, strapW * 0.82, strapH * 1.36);
  ctx.setLineDash([]);

  // 2. Sculpted 18k Champagne Gold & Brushed Titanium Lugs
  const drawLug = (lx: number, ly: number, flipX: number, flipY: number) => {
    ctx.save();
    ctx.translate(lx, ly);
    ctx.scale(flipX, flipY);
    const lugGrad = ctx.createLinearGradient(0, 0, baseRadius * 0.28, baseRadius * 0.45);
    lugGrad.addColorStop(0, "#E5C992");
    lugGrad.addColorStop(0.45, "#B39056");
    lugGrad.addColorStop(1, "#4A3A21");
    ctx.fillStyle = lugGrad;
    ctx.beginPath();
    ctx.moveTo(-baseRadius * 0.08, 0);
    ctx.lineTo(baseRadius * 0.18, 0);
    ctx.quadraticCurveTo(baseRadius * 0.22, baseRadius * 0.28, baseRadius * 0.07, baseRadius * 0.48);
    ctx.lineTo(-baseRadius * 0.06, baseRadius * 0.42);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  };

  drawLug(-baseRadius * 0.56, -baseRadius * 0.82, -1, -1);
  drawLug(baseRadius * 0.56, -baseRadius * 0.82, 1, -1);
  drawLug(-baseRadius * 0.56, baseRadius * 0.82, -1, 1);
  drawLug(baseRadius * 0.56, baseRadius * 0.82, 1, 1);

  // 3. Fluted Winding Crown & Chronograph Pushers at 2, 3, and 4 o'clock
  const drawCrown = () => {
    ctx.save();
    const crownGrad = ctx.createLinearGradient(0, -baseRadius * 0.14, 0, baseRadius * 0.14);
    crownGrad.addColorStop(0, "#755C34");
    crownGrad.addColorStop(0.35, "#E7CD98");
    crownGrad.addColorStop(0.6, "#C9A96E");
    crownGrad.addColorStop(1, "#4E3D22");
    ctx.fillStyle = crownGrad;
    ctx.beginPath();
    ctx.roundRect(baseRadius * 0.98, -baseRadius * 0.11, baseRadius * 0.15, baseRadius * 0.22, 4);
    ctx.fill();

    // Pusher at 2 o'clock
    ctx.save();
    ctx.rotate(-0.52);
    ctx.beginPath();
    ctx.roundRect(baseRadius * 0.97, -baseRadius * 0.06, baseRadius * 0.12, baseRadius * 0.12, 3);
    ctx.fill();
    ctx.restore();

    // Pusher at 4 o'clock
    ctx.save();
    ctx.rotate(0.52);
    ctx.beginPath();
    ctx.roundRect(baseRadius * 0.97, -baseRadius * 0.06, baseRadius * 0.12, baseRadius * 0.12, 3);
    ctx.fill();
    ctx.restore();

    ctx.restore();
  };
  drawCrown();

  // 4. Outer Case & Directional Brushed Champagne Gold Bezel
  const caseGrad = ctx.createConicGradient(lightAngle, 0, 0);
  caseGrad.addColorStop(0, "#F3DFB6");
  caseGrad.addColorStop(0.18, "#C9A96E");
  caseGrad.addColorStop(0.36, "#5C492B");
  caseGrad.addColorStop(0.55, "#B8965A");
  caseGrad.addColorStop(0.75, "#3E311C");
  caseGrad.addColorStop(0.9, "#D8BC84");
  caseGrad.addColorStop(1, "#F3DFB6");

  // Subtle 3D case thickness offset when tilted
  ctx.fillStyle = "#3A2D18";
  ctx.beginPath();
  ctx.arc(-tiltX * 55, -tiltY * 55, baseRadius * 1.04, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = caseGrad;
  ctx.beginPath();
  ctx.arc(0, 0, baseRadius * 1.04, 0, Math.PI * 2);
  ctx.fill();

  // Inner chamfered bezel ring
  const innerBezelGrad = ctx.createConicGradient(lightAngle + Math.PI * 0.5, 0, 0);
  innerBezelGrad.addColorStop(0, "#27252A");
  innerBezelGrad.addColorStop(0.25, "#8E7549");
  innerBezelGrad.addColorStop(0.5, "#1A191D");
  innerBezelGrad.addColorStop(0.75, "#C9A96E");
  innerBezelGrad.addColorStop(1, "#27252A");

  ctx.fillStyle = innerBezelGrad;
  ctx.beginPath();
  ctx.arc(0, 0, baseRadius * 0.93, 0, Math.PI * 2);
  ctx.fill();

  // 5. Dial Face — Sunburst Anthracite Obsidian with Guilloché Texture
  const dialRadius = baseRadius * 0.88;
  const dialGrad = ctx.createRadialGradient(
    Math.cos(lightAngle) * dialRadius * 0.28,
    Math.sin(lightAngle) * dialRadius * 0.28,
    dialRadius * 0.02,
    0,
    0,
    dialRadius
  );
  dialGrad.addColorStop(0, "#242329");
  dialGrad.addColorStop(0.45, "#141418");
  dialGrad.addColorStop(0.85, "#0D0D10");
  dialGrad.addColorStop(1, "#070709");

  ctx.fillStyle = dialGrad;
  ctx.beginPath();
  ctx.arc(0, 0, dialRadius, 0, Math.PI * 2);
  ctx.fill();

  // If the high-res studio reference watch image is available, subtly blend its rich dial texture
  if (fallbackRefImage && fallbackRefLoaded && fallbackRefImage.naturalWidth > 0) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(0, 0, dialRadius * 0.98, 0, Math.PI * 2);
    ctx.clip();
    ctx.globalAlpha = 0.26;
    const s = (dialRadius * 2.35) / Math.min(fallbackRefImage.naturalWidth, fallbackRefImage.naturalHeight);
    const dw = fallbackRefImage.naturalWidth * s;
    const dh = fallbackRefImage.naturalHeight * s;
    ctx.drawImage(fallbackRefImage, -dw / 2, -dh / 2, dw, dh);
    ctx.restore();
  }

  // Concentric Clous de Paris / Guilloché rings
  ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
  ctx.lineWidth = 1;
  for (let r = dialRadius * 0.32; r <= dialRadius * 0.84; r += dialRadius * 0.065) {
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  // 6. Chapter Ring, Precision Minute Track & Applied 18k Gold Baton Indices
  for (let i = 0; i < 60; i++) {
    const angle = (i * Math.PI) / 30 - Math.PI / 2;
    const isHour = i % 5 === 0;
    ctx.save();
    ctx.rotate(angle);
    if (isHour) {
      // Skip 6 o'clock baton where open-heart tourbillon sits
      if (i !== 30) {
        const batonLen = i === 0 ? dialRadius * 0.14 : dialRadius * 0.11;
        const batonW = i === 0 ? dialRadius * 0.036 : dialRadius * 0.022;
        ctx.fillStyle = "#D8BC84";
        ctx.shadowColor = "rgba(0, 0, 0, 0.7)";
        ctx.shadowBlur = 4;
        ctx.fillRect(dialRadius * 0.72, -batonW / 2, batonLen, batonW);
      }
    } else {
      ctx.strokeStyle = "rgba(245, 243, 239, 0.32)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(dialRadius * 0.82, 0);
      ctx.lineTo(dialRadius * 0.86, 0);
      ctx.stroke();
    }
    ctx.restore();
  }

  // 7. Dial Typography at 12 o'clock
  ctx.save();
  ctx.fillStyle = "#E6D2AA";
  ctx.font = `600 ${Math.max(9, Math.round(dialRadius * 0.072))}px "Cormorant Garamond", Georgia, serif`;
  ctx.textAlign = "center";
  ctx.letterSpacing = "3px";
  ctx.fillText("JEFFREY WATCH HARBOR", 0, -dialRadius * 0.42);

  ctx.fillStyle = "rgba(245, 243, 239, 0.55)";
  ctx.font = `400 ${Math.max(7, Math.round(dialRadius * 0.045))}px "Plus Jakarta Sans", sans-serif`;
  ctx.fillText("CHRONOMÈTRE · GENÈVE", 0, -dialRadius * 0.31);
  ctx.restore();

  // 8. Dual Chronograph Subdials (9 o'clock & 3 o'clock)
  const drawSubdial = (sx: number, sy: number, label: string, handAngle: number) => {
    const sr = dialRadius * 0.21;
    ctx.save();
    ctx.translate(sx, sy);

    ctx.fillStyle = "#0B0B0E";
    ctx.beginPath();
    ctx.arc(0, 0, sr, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "rgba(201, 169, 110, 0.35)";
    ctx.lineWidth = 1.2;
    ctx.stroke();

    for (let t = 0; t < 12; t++) {
      ctx.save();
      ctx.rotate((t * Math.PI) / 6);
      ctx.strokeStyle = "rgba(245, 243, 239, 0.4)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(sr * 0.76, 0);
      ctx.lineTo(sr * 0.92, 0);
      ctx.stroke();
      ctx.restore();
    }

    ctx.fillStyle = "rgba(201, 169, 110, 0.65)";
    ctx.font = `500 ${Math.max(6, Math.round(sr * 0.22))}px "JetBrains Mono", monospace`;
    ctx.textAlign = "center";
    ctx.fillText(label, 0, sr * 0.48);

    // Subdial hand
    ctx.rotate(handAngle);
    ctx.strokeStyle = "#E5C992";
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(-sr * 0.18, 0);
    ctx.lineTo(sr * 0.75, 0);
    ctx.stroke();

    ctx.fillStyle = "#C9A96E";
    ctx.beginPath();
    ctx.arc(0, 0, 2.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  };

  drawSubdial(-dialRadius * 0.42, 0, "30 MIN", -Math.PI / 2 + progress * Math.PI * 1.2);
  drawSubdial(dialRadius * 0.42, 0, "72H RES", -Math.PI * 0.8 + progress * Math.PI * 0.9);

  // 9. Exposed Flying Tourbillon Cage at 6 o'clock (rotates with frameIndex 1..100)
  ctx.save();
  ctx.translate(0, dialRadius * 0.45);
  const tbRadius = dialRadius * 0.24;

  // Deep movement well
  const wellGrad = ctx.createRadialGradient(0, 0, 2, 0, 0, tbRadius);
  wellGrad.addColorStop(0, "#050507");
  wellGrad.addColorStop(0.8, "#101014");
  wellGrad.addColorStop(1, "#1F1D24");
  ctx.fillStyle = wellGrad;
  ctx.beginPath();
  ctx.arc(0, 0, tbRadius, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "rgba(201, 169, 110, 0.55)";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Rotating balance wheel & tourbillon carriage driven by frameIndex
  const cageRotation = (frameIndex / FRAME_COUNT) * Math.PI * 6;
  ctx.save();
  ctx.rotate(cageRotation);
  ctx.strokeStyle = "#D8BC84";
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.arc(0, 0, tbRadius * 0.74, 0, Math.PI * 2);
  ctx.stroke();

  for (let arm = 0; arm < 3; arm++) {
    ctx.save();
    ctx.rotate((arm * Math.PI * 2) / 3);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(tbRadius * 0.74, 0);
    ctx.stroke();
    ctx.restore();
  }
  ctx.restore();

  // Fixed horizontal tourbillon bridge & central ruby jewel
  ctx.strokeStyle = "#E4E2DD";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(-tbRadius * 1.08, 0);
  ctx.lineTo(tbRadius * 1.08, 0);
  ctx.stroke();

  ctx.fillStyle = "#C82849"; // Horological ruby jewel bearing
  ctx.beginPath();
  ctx.arc(0, 0, 3.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 10. Dauphine Faceted Hands (Hours, Minutes, Sweeping Chronograph Seconds)
  // At frame 001: classic 10:10 horological stance; progresses subtly as user scrolls
  const hourAngle = -Math.PI / 2 - Math.PI / 3 + progress * 0.25;
  const minuteAngle = -Math.PI / 2 + Math.PI / 3 + progress * 1.65;
  const secondAngle = -Math.PI / 2 + progress * Math.PI * 2.4;

  const drawDauphineHand = (angle: number, length: number, tail: number, width: number) => {
    ctx.save();
    ctx.rotate(angle);
    ctx.shadowColor = "rgba(0, 0, 0, 0.75)";
    ctx.shadowBlur = 8;
    ctx.shadowOffsetY = 4;

    // Upper bright facet
    ctx.fillStyle = "#F3E3C3";
    ctx.beginPath();
    ctx.moveTo(-tail, 0);
    ctx.lineTo(0, -width);
    ctx.lineTo(length, 0);
    ctx.closePath();
    ctx.fill();

    // Lower warm shaded facet
    ctx.fillStyle = "#A6854B";
    ctx.beginPath();
    ctx.moveTo(-tail, 0);
    ctx.lineTo(0, width);
    ctx.lineTo(length, 0);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  };

  drawDauphineHand(hourAngle, dialRadius * 0.52, dialRadius * 0.11, dialRadius * 0.036);
  drawDauphineHand(minuteAngle, dialRadius * 0.74, dialRadius * 0.14, dialRadius * 0.027);

  // Sweeping seconds hand
  ctx.save();
  ctx.rotate(secondAngle);
  ctx.strokeStyle = "#D4AF37";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(-dialRadius * 0.2, 0);
  ctx.lineTo(dialRadius * 0.82, 0);
  ctx.stroke();

  ctx.fillStyle = "#D4AF37";
  ctx.beginPath();
  ctx.arc(0, 0, 4.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#0B0B0D";
  ctx.beginPath();
  ctx.arc(0, 0, 1.8, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 11. Domed Anti-Reflective Sapphire Crystal Glare Sweep (reacts directly to scroll progress)
  ctx.save();
  ctx.beginPath();
  ctx.arc(0, 0, dialRadius, 0, Math.PI * 2);
  ctx.clip();

  const glareOffset = (progress - 0.5) * dialRadius * 2.2;
  const glareGrad = ctx.createLinearGradient(
    -dialRadius + glareOffset,
    -dialRadius,
    dialRadius * 0.4 + glareOffset,
    dialRadius
  );
  glareGrad.addColorStop(0, "rgba(255, 255, 255, 0)");
  glareGrad.addColorStop(0.44, "rgba(255, 255, 255, 0.01)");
  glareGrad.addColorStop(0.5, "rgba(245, 236, 215, 0.11)");
  glareGrad.addColorStop(0.56, "rgba(255, 255, 255, 0.01)");
  glareGrad.addColorStop(1, "rgba(255, 255, 255, 0)");

  ctx.fillStyle = glareGrad;
  ctx.fillRect(-dialRadius, -dialRadius, dialRadius * 2, dialRadius * 2);
  ctx.restore();

  ctx.restore();
}
