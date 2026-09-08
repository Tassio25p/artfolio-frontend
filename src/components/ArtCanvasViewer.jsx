import { useState, useEffect, useRef, useCallback } from "react";
import { getMediaUrl } from "../services/api";

/**
 * ArtCanvasViewer (Fase 2 - Engenharia Gráfica Client-Side)
 * Visualizador de alta precisão para obras com:
 * 1. Lupa de Inspeção de Alta Resolução (Zoom Lens 2.5x via Canvas 2D)
 * 2. Camada de Proteção e Direitos Autorais (desativação de clique direito e arrasto)
 * 3. Marca d'Água Dinâmica Não Destrutiva
 */
export default function ArtCanvasViewer({
  imageUrl,
  titulo = "Obra",
  nomeArtista = "Artista",
  onClick,
}) {
  const [isHovering, setIsHovering] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, normX: 0.5, normY: 0.5 });
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const containerRef = useRef(null);
  const imgElementRef = useRef(null);
  const lensCanvasRef = useRef(null);
  const loadedImageObjRef = useRef(null);

  // Carregamento da imagem em memória para manipulação no Canvas nativo
  useEffect(() => {
    let isMounted = true;

    if (!imageUrl) {
      return;
    }

    const timer = setTimeout(() => {
      if (!isMounted) return;

      const resolvedUrl = getMediaUrl(imageUrl);
      const img = new Image();
      img.crossOrigin = "Anonymous";

      img.onload = () => {
        if (!isMounted) return;
        loadedImageObjRef.current = img;
        setImageLoaded(true);
        setImageError(false);
      };

      img.onerror = () => {
        if (!isMounted) return;
        setImageError(true);
        setImageLoaded(false);
      };

      img.src = resolvedUrl;
    }, 10);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [imageUrl]);

  // Atualização em tempo real do Canvas da Lupa de Inspeção
  const updateLensCanvas = useCallback(
    (clientX, clientY) => {
      const lensCanvas = lensCanvasRef.current;
      const loadedImg = loadedImageObjRef.current;
      const imgEl = imgElementRef.current;

      if (!lensCanvas || !loadedImg || !imgEl) return;

      const imgRect = imgEl.getBoundingClientRect();
      if (imgRect.width === 0 || imgRect.height === 0) return;

      // Coordenadas relativas aos limites da imagem renderizada
      const imgX = clientX - imgRect.left;
      const imgY = clientY - imgRect.top;

      const normX = Math.max(0, Math.min(1, imgX / imgRect.width));
      const normY = Math.max(0, Math.min(1, imgY / imgRect.height));

      const naturalW = loadedImg.naturalWidth || imgRect.width;
      const naturalH = loadedImg.naturalHeight || imgRect.height;

      // Dimensões internas da lupa (alta definição)
      const lensSize = lensCanvas.width; // 160px
      const zoomFactor = 2.5; // Ampliação de 2.5x

      // Escala entre a imagem natural e a exibida
      const scaleX = naturalW / imgRect.width;
      const scaleY = naturalH / imgRect.height;

      // Área de corte (slice) proporcional na imagem de alta resolução
      const sWidth = (lensSize * scaleX) / zoomFactor;
      const sHeight = (lensSize * scaleY) / zoomFactor;

      const centerX = normX * naturalW;
      const centerY = normY * naturalH;

      const sx = Math.max(0, Math.min(naturalW - sWidth, centerX - sWidth / 2));
      const sy = Math.max(0, Math.min(naturalH - sHeight, centerY - sHeight / 2));

      const ctx = lensCanvas.getContext("2d");
      if (!ctx) return;

      ctx.clearRect(0, 0, lensSize, lensSize);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      // Renderiza a fatia ampliada proporcional com alta nitidez
      ctx.drawImage(loadedImg, sx, sy, sWidth, sHeight, 0, 0, lensSize, lensSize);
    },
    []
  );

  const handleMouseMove = (e) => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const cursorX = e.clientX - rect.left;
    const cursorY = e.clientY - rect.top;

    const normX = Math.max(0, Math.min(1, cursorX / rect.width));
    const normY = Math.max(0, Math.min(1, cursorY / rect.height));

    setMousePos({
      x: cursorX,
      y: cursorY,
      normX,
      normY,
    });

    updateLensCanvas(e.clientX, e.clientY);
  };

  const handleMouseEnter = (e) => {
    setIsHovering(true);
    handleMouseMove(e);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  const resolvedSrc = getMediaUrl(imageUrl);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onContextMenu={(e) => e.preventDefault()}
      onClick={onClick}
      className="relative w-full h-full min-h-[340px] max-h-[540px] flex items-center justify-center bg-neutral-950 rounded-2xl overflow-hidden select-none cursor-crosshair group border border-black/10"
      style={{ WebkitUserSelect: "none", userSelect: "none" }}
    >
      {/* Imagem Principal da Obra com Proteção Nativa contra Extração */}
      <img
        ref={imgElementRef}
        src={resolvedSrc}
        alt={titulo}
        draggable={false}
        onContextMenu={(e) => e.preventDefault()}
        onDragStart={(e) => e.preventDefault()}
        onError={(e) => {
          setImageError(true);
          e.currentTarget.src =
            "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=1200";
        }}
        className="w-full h-full max-h-[540px] object-contain transition-transform duration-300 pointer-events-none mx-auto"
      />

      {/* Camada Invisível de Proteção contra Arraste / Extração Direta */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        onContextMenu={(e) => e.preventDefault()}
      />

      {/* Lupa de Inspeção de Alta Resolução (Zoom Lens 2.5x) */}
      {isHovering && imageLoaded && !imageError && (
        <div
          className="absolute z-30 pointer-events-none -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-2xl border-2 border-white shadow-2xl overflow-hidden bg-neutral-900/90 ring-4 ring-black/30 backdrop-blur-xs transition-opacity duration-150"
          style={{
            left: `${mousePos.x}px`,
            top: `${mousePos.y}px`,
          }}
        >
          {/* Canvas interno da lente ampliada */}
          <canvas
            ref={lensCanvasRef}
            width={160}
            height={160}
            className="w-full h-full object-cover block"
          />

          {/* Retículo Central da Lupa de Precisão */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
            <div className="w-5 h-5 border border-white/80 rounded-full flex items-center justify-center">
              <div className="w-1 h-1 bg-white rounded-full"></div>
            </div>
          </div>

          {/* Badge Indicador de Escala de Ampliação */}
          <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-md text-white text-[9px] font-mono font-bold px-1.5 py-0.5 rounded shadow-sm border border-white/10">
            2.5x
          </div>
        </div>
      )}

      {/* Marca d'Água Dinâmica Não Destrutiva no Canto Inferior */}
      <div
        className="absolute bottom-3 right-3 z-20 pointer-events-none select-none px-3.5 py-1.5 rounded-xl bg-black/50 backdrop-blur-md border border-white/15 text-white/90 text-xs font-semibold flex items-center gap-2 shadow-lg tracking-wide transition-opacity group-hover:opacity-90"
        onContextMenu={(e) => e.preventDefault()}
      >
        <div className="w-2 h-2 rounded-full bg-artOrange shadow-[0_0_8px_#FF793F]" />
        <span>Artfolio • © {nomeArtista || "Artista"}</span>
      </div>

      {/* Dica de Inspeção de Alta Resolução no Canto Superior */}
      <div className="absolute top-3 right-3 z-20 pointer-events-none bg-black/60 backdrop-blur-md text-white/90 text-[10px] font-semibold px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 shadow-md">
        <i className="fa-solid fa-magnifying-glass-plus text-artOrange text-[10px]"></i>
        <span>Lupa de Alta Resolução</span>
      </div>
    </div>
  );
}
