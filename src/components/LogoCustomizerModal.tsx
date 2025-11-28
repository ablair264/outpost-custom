import React, { useEffect, useRef, useState } from 'react';
import '../styles/LogoCustomizer.css';

export type LogoOverlayConfig = {
  src: string;
  // center position as percent of base image container
  x: number; // 0-100
  y: number; // 0-100
  sizePct: number; // width of logo as % of base image width
  rotation: number; // degrees
  opacity: number; // 0-1
};

interface ProductColorOption {
  name: string;
  rgb?: string;
  image: string;
  code?: string;
}

interface LogoCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (config: LogoOverlayConfig, selectedColorIndex?: number) => void;
  baseImageUrl?: string;
  productColors?: ProductColorOption[];
  initialColorIndex?: number;
  initialConfig?: Partial<LogoOverlayConfig>;
}

const DEFAULT_MIN_WIDTH = 800; // px
const DEFAULT_MIN_HEIGHT = 800; // px
const MAX_FILE_SIZE_MB = 10;

const LogoCustomizerModal: React.FC<LogoCustomizerModalProps> = ({
  isOpen,
  onClose,
  onApply,
  baseImageUrl,
  productColors,
  initialColorIndex,
  initialConfig,
}) => {
  const [logoSrc, setLogoSrc] = useState<string>(initialConfig?.src || '');
  const [x, setX] = useState<number>(initialConfig?.x ?? 50);
  const [y, setY] = useState<number>(initialConfig?.y ?? 50);
  const [sizePct, setSizePct] = useState<number>(initialConfig?.sizePct ?? 35);
  const [rotation, setRotation] = useState<number>(initialConfig?.rotation ?? 0);
  const [opacity, setOpacity] = useState<number>(initialConfig?.opacity ?? 0.95);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [colorIndex, setColorIndex] = useState<number>(initialColorIndex ?? 0);

  const wrapRef = useRef<HTMLDivElement | null>(null);
  const logoRef = useRef<HTMLImageElement | null>(null);
  const draggingRef = useRef(false);
  const dragOffsetRef = useRef<{ dxPct: number; dyPct: number }>({ dxPct: 0, dyPct: 0 });
  const posPctRef = useRef<{ x: number; y: number }>({ x, y });
  const rafPendingRef = useRef(false);

  const handleFile = (file: File) => {
    setError(null);
    setInfo(null);
    if (!file) return;

    const sizeMb = file.size / (1024 * 1024);
    if (sizeMb > MAX_FILE_SIZE_MB) {
      setError(`File too large. Max ${MAX_FILE_SIZE_MB}MB.`);
      return;
    }

    const type = file.type.toLowerCase();
    const isRaster = type.includes('png') || type.includes('jpeg') || type.includes('jpg');
    const isSvg = type.includes('svg');
    if (!isRaster && !isSvg) {
      setError('Unsupported format. Use PNG, JPG or SVG.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const src = reader.result as string;
      if (isSvg) {
        setLogoSrc(src);
        setInfo('SVG detected. Best for sharp print results.');
        return;
      }
      // Raster quality check
      const img = new Image();
      img.onload = () => {
        const w = img.width;
        const h = img.height;

        if (w < DEFAULT_MIN_WIDTH || h < DEFAULT_MIN_HEIGHT) {
          setError(`Image too small. Minimum ${DEFAULT_MIN_WIDTH}x${DEFAULT_MIN_HEIGHT}px recommended.`);
          return;
        }
        if (w < 1200 || h < 1200) {
          setInfo('Image resolution is acceptable but higher is recommended for best print.');
        }
        setLogoSrc(src);
      };
      img.onerror = () => setError('Failed to load image. Please try a different file.');
      img.src = src;
    };
    reader.onerror = () => setError('Failed to read file.');
    reader.readAsDataURL(file);
  };

  const startDrag = (e: React.PointerEvent) => {
    if (!wrapRef.current) return;
    draggingRef.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);

    const rect = wrapRef.current.getBoundingClientRect();
    const centerX = rect.left + (x / 100) * rect.width;
    const centerY = rect.top + (y / 100) * rect.height;
    const dxPct = ((e.clientX - centerX) / rect.width) * 100;
    const dyPct = ((e.clientY - centerY) / rect.height) * 100;
    dragOffsetRef.current = { dxPct, dyPct };
  };

  const onDrag = (e: React.PointerEvent) => {
    if (!draggingRef.current || !wrapRef.current || !logoRef.current) return;
    if (rafPendingRef.current) return;
    rafPendingRef.current = true;
    requestAnimationFrame(() => {
      const rect = wrapRef.current!.getBoundingClientRect();
      const { dxPct, dyPct } = dragOffsetRef.current;
      const nx = ((e.clientX - rect.left) / rect.width) * 100 - dxPct;
      const ny = ((e.clientY - rect.top) / rect.height) * 100 - dyPct;
      const clampedX = Math.max(0, Math.min(100, nx));
      const clampedY = Math.max(0, Math.min(100, ny));
      posPctRef.current = { x: clampedX, y: clampedY };
      // Update DOM directly for buttery-smooth drag without React re-render per frame
      logoRef.current!.style.left = `${clampedX}%`;
      logoRef.current!.style.top = `${clampedY}%`;
      rafPendingRef.current = false;
    });
  };

  const endDrag = (e: React.PointerEvent) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
    // Commit final position to React state
    setX(posPctRef.current.x);
    setY(posPctRef.current.y);
  };

  const apply = () => {
    if (!logoSrc) {
      setError('Please upload a logo.');
      return;
    }
    onApply({ src: logoSrc, x, y, sizePct, rotation, opacity }, colorIndex);
  };

  return (
    <div className="logo-modal-overlay" role="dialog" aria-modal="true">
      <div className="logo-modal">
        <div className="logo-modal-header">
          <h2>Preview Your Logo</h2>
          <button className="close-btn" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div className="logo-modal-content">
          <div className="logo-modal-left">
            <div className="preview-stage">
              {(productColors?.[colorIndex]?.image || baseImageUrl) ? (
                <div className="preview-image-wrap" ref={wrapRef}>
                  <img className="preview-image" src={(productColors?.[colorIndex]?.image || baseImageUrl)!} alt="Product preview" />
                  {logoSrc && (
                    <img
                      ref={logoRef}
                      src={logoSrc}
                      alt="Logo preview"
                      className="preview-logo-free"
                      draggable={false}
                      style={{
                        left: `${x}%`,
                        top: `${y}%`,
                        width: `${sizePct}%`,
                        opacity,
                        transform: `translate(-50%, -50%) rotate(${rotation}deg)`
                      }}
                      onPointerDown={startDrag}
                      onPointerMove={onDrag}
                      onPointerUp={endDrag}
                      onPointerCancel={endDrag}
                    />
                  )}
                </div>
              ) : (
                <div className="preview-placeholder">No product image available</div>
              )}
            </div>
          </div>
          <div className="logo-modal-right">
            {productColors && productColors.length > 0 && (
              <div className="field">
                <label className="field-label">Product colour</label>
                <div className="modal-color-swatches">
                  {productColors.map((c, idx) => (
                    <button
                      key={c.code || c.name + idx}
                      className={`modal-color-swatch ${idx === colorIndex ? 'active' : ''}`}
                      title={c.name}
                      style={{ backgroundColor: c.rgb && c.rgb !== 'Not available' ? c.rgb : '#cccccc' }}
                      onClick={() => setColorIndex(idx)}
                    />
                  ))}
                </div>
              </div>
            )}
            <div className="uploader">
              <label className="field-label">Upload your logo</label>
              <input
                type="file"
                accept="image/png,image/jpeg,image/svg+xml"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFile(file);
                }}
              />
              <div className="hint">PNG, JPG or SVG. Max {MAX_FILE_SIZE_MB}MB. Recommended ≥ {DEFAULT_MIN_WIDTH}×{DEFAULT_MIN_HEIGHT}px for raster.</div>
              {error && <div className="error">{error}</div>}
              {info && <div className="info">{info}</div>}
            </div>

            <div className="field">
              <label className="field-label">Size ({Math.round(sizePct)}%)</label>
              <input
                type="range"
                min={5}
                max={80}
                step={1}
                value={sizePct}
                onChange={(e) => setSizePct(parseFloat(e.target.value))}
              />
            </div>

            <div className="field">
              <label className="field-label">Rotation ({Math.round(rotation)}°)</label>
              <input
                type="range"
                min={-180}
                max={180}
                step={1}
                value={rotation}
                onChange={(e) => setRotation(parseFloat(e.target.value))}
              />
            </div>

            <div className="field">
              <label className="field-label">Opacity ({Math.round(opacity * 100)}%)</label>
              <input
                type="range"
                min={0.3}
                max={1}
                step={0.01}
                value={opacity}
                onChange={(e) => setOpacity(parseFloat(e.target.value))}
              />
            </div>

            <div className="logo-modal-actions">
              <button className="clear-btn" onClick={() => { setLogoSrc(''); setError(null); setInfo(null); }}>Clear</button>
              <div style={{ flex: 1 }} />
              <button className="clear-btn" onClick={onClose}>Cancel</button>
              <button className="apply-btn" onClick={apply} disabled={!logoSrc}>Apply</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoCustomizerModal;
