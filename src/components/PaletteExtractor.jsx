import { useState, useEffect, useRef } from "react";
import { getMediaUrl } from "../services/api";

/**
 * PaletteExtractor (Fase 2 - Engenharia Gráfica Client-Side)
 * Extrai automaticamente as 5 cores dominantes de uma imagem usando
 * a HTML5 Canvas 2D API em um canvas offscreen de 64x64 pixels (< 5ms).
 */
export default function PaletteExtractor({ imageUrl, onColorsExtracted, customColors = null }) {
  const [colors, setColors] = useState([]);
  const [copiedHex, setCopiedHex] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    // Se o autor definiu cores customizadas manualmente, usa diretamente
    if (Array.isArray(customColors) && customColors.length > 0) {
      setColors(customColors);
      if (onColorsExtracted) {
        onColorsExtracted(customColors);
      }
      return;
    }

    if (!imageUrl) {
      return;
    }

    // Não processar arquivos que não sejam imagens (ex: PDF ou vídeos)
    const cleanUrl = (imageUrl || "").split("?")[0].toLowerCase();
    const isUnsupported = [".mp4", ".webm", ".ogg", ".mov", ".pdf", ".doc", ".docx"].some((ext) =>
      cleanUrl.endsWith(ext)
    );
    if (isUnsupported) {
      return;
    }

    const timer = setTimeout(() => {
      if (!isMounted) return;
      setIsProcessing(true);

      const resolvedSrc = getMediaUrl(imageUrl);
      const img = new Image();
      img.crossOrigin = "Anonymous";

      img.onload = () => {
        if (!isMounted) return;

        try {
          const canvas = canvasRef.current || document.createElement("canvas");
          canvas.width = 96;
          canvas.height = 96;

          const ctx = canvas.getContext("2d", { willReadFrequently: true });
          if (!ctx) {
            setIsProcessing(false);
            return;
          }

          ctx.clearRect(0, 0, 96, 96);
          ctx.drawImage(img, 0, 0, 96, 96);

          const imageData = ctx.getImageData(0, 0, 96, 96);
          const data = imageData.data;
          const colorBuckets = new Map();

          for (let i = 0; i < data.length; i += 16) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const a = data[i + 3];

            if (a < 128) continue;

            const max = Math.max(r, g, b);
            const min = Math.min(r, g, b);
            const delta = max - min;
            const sat = max === 0 ? 0 : delta / max;
            const lum = 0.299 * r + 0.587 * g + 0.114 * b;

            // Ponderação cromática: Cores ricas e vivas (ex: vermelho, azul, laranja) ganham peso alto
            // Darks absolutos ou brancos estourados ganham peso reduzido
            const isExtreme = lum < 20 || lum > 245;
            const weight = isExtreme ? 0.2 : (1 + Math.pow(sat, 1.3) * 5.0);

            // Quantização por blocos de 20 níveis
            const step = 20;
            const qR = Math.min(255, Math.round(r / step) * step);
            const qG = Math.min(255, Math.round(g / step) * step);
            const qB = Math.min(255, Math.round(b / step) * step);

            const key = `${qR},${qG},${qB}`;
            const existing = colorBuckets.get(key);
            if (existing) {
              existing.count += 1;
              existing.score += weight;
              existing.sumR += r;
              existing.sumG += g;
              existing.sumB += b;
            } else {
              colorBuckets.set(key, {
                count: 1,
                score: weight,
                sumR: r,
                sumG: g,
                sumB: b,
                r: qR,
                g: qG,
                b: qB,
                sat: sat,
              });
            }
          }

          // Ordena buckets pela pontuação ponderada de vivacidade cromática
          const sortedBuckets = Array.from(colorBuckets.values()).sort(
            (a, b) => b.score - a.score
          );

          const selectedColors = [];
          const minColorDist = 42;

          for (const bucket of sortedBuckets) {
            if (selectedColors.length >= 5) break;

            const avgR = Math.round(bucket.sumR / bucket.count);
            const avgG = Math.round(bucket.sumG / bucket.count);
            const avgB = Math.round(bucket.sumB / bucket.count);

            const isTooSimilar = selectedColors.some((sc) => {
              const dr = sc.r - avgR;
              const dg = sc.g - avgG;
              const db = sc.b - avgB;
              return Math.sqrt(dr * dr + dg * dg + db * db) < minColorDist;
            });

            if (!isTooSimilar) {
              const hex = `#${((1 << 24) + (avgR << 16) + (avgG << 8) + avgB)
                .toString(16)
                .slice(1)
                .toUpperCase()}`;
              selectedColors.push({ hex, r: avgR, g: avgG, b: avgB });
            }
          }

          // Preenche caso ainda haja menos de 5 cores
          if (selectedColors.length < 5) {
            for (const bucket of sortedBuckets) {
              if (selectedColors.length >= 5) break;
              const avgR = Math.round(bucket.sumR / bucket.count);
              const avgG = Math.round(bucket.sumG / bucket.count);
              const avgB = Math.round(bucket.sumB / bucket.count);
              const hex = `#${((1 << 24) + (avgR << 16) + (avgG << 8) + avgB)
                .toString(16)
                .slice(1)
                .toUpperCase()}`;
              if (!selectedColors.some((c) => c.hex === hex)) {
                selectedColors.push({ hex, r: avgR, g: avgG, b: avgB });
              }
            }
          }

          const finalHexes =
            selectedColors.length > 0
              ? selectedColors.map((c) => c.hex)
              : ["#E74C3C", "#FF793F", "#0984E3", "#00B894", "#2D3436"];

          setColors(finalHexes);
          if (onColorsExtracted) {
            onColorsExtracted(finalHexes);
          }
        } catch (err) {
          console.warn("PaletteExtractor: Erro ao ler buffer do canvas:", err);
          const fallbackHexes = ["#FF793F", "#E74C3C", "#0984E3", "#00B894", "#2D3436"];
          setColors(fallbackHexes);
          if (onColorsExtracted) {
            onColorsExtracted(fallbackHexes);
          }
        } finally {
          if (isMounted) setIsProcessing(false);
        }
      };

      img.onerror = () => {
        if (isMounted) {
          setIsProcessing(false);
          setColors([]);
        }
      };

      img.src = resolvedSrc;
    }, 10);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [imageUrl]);

  const handleCopyHex = (hex) => {
    if (!navigator.clipboard) return;
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => {
      setCopiedHex((prev) => (prev === hex ? null : prev));
    }, 1800);
  };

  if (!imageUrl || (colors.length === 0 && !isProcessing)) {
    return (
      <canvas
        ref={canvasRef}
        width={64}
        height={64}
        className="hidden"
        aria-hidden="true"
      />
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm border border-neutral-200 rounded-2xl p-4 shadow-sm transition-all">
      {/* Canvas offscreen oculto para amostragem nativa */}
      <canvas
        ref={canvasRef}
        width={64}
        height={64}
        className="hidden"
        aria-hidden="true"
      />

      {/* Cabeçalho informativo */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-artPurple/10 text-artPurple flex items-center justify-center text-xs">
            <i className="fa-solid fa-palette"></i>
          </div>
          <span className="text-xs font-bold text-gray-800 tracking-wide uppercase">
            Paleta Cromática da Obra
          </span>
          {isProcessing && (
            <span className="text-[10px] text-artPurple font-semibold animate-pulse">
              (analisando...)
            </span>
          )}
        </div>

        <span className="text-[11px] text-gray-400 font-medium hidden sm:inline-flex items-center gap-1">
          <i className="fa-regular fa-copy text-[10px]"></i>
          Clique para copiar o código HEX
        </span>
      </div>

      {/* Grade com as 5 amostras cromáticas interativas */}
      <div className="grid grid-cols-5 gap-2 sm:gap-3">
        {colors.length > 0
          ? colors.map((hex, index) => {
            const isCopied = copiedHex === hex;

            return (
              <button
                key={`${hex}-${index}`}
                type="button"
                onClick={() => handleCopyHex(hex)}
                className="group relative flex flex-col items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-artPurple rounded-xl transition-transform hover:-translate-y-0.5 active:translate-y-0"
                title={`Copiar ${hex}`}
              >
                {/* Bloco de Cor com Efeito Hover */}
                <div
                  className="w-full h-11 sm:h-12 rounded-xl shadow-xs border border-black/10 transition-all duration-200 group-hover:shadow-md group-hover:scale-102 flex items-center justify-center relative overflow-hidden"
                  style={{ backgroundColor: hex }}
                >
                  {/* Overlay dinâmico ao passar o mouse ou copiar */}
                  <div
                    className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${isCopied
                        ? "bg-black/60 opacity-100"
                        : "bg-black/20 opacity-0 group-hover:opacity-100"
                      }`}
                  >
                    {isCopied ? (
                      <span className="text-[10px] font-bold text-white uppercase tracking-wider flex items-center gap-1">
                        <i className="fa-solid fa-check text-emerald-400"></i>
                        <span className="hidden md:inline">Copiado!</span>
                      </span>
                    ) : (
                      <i className="fa-regular fa-copy text-white text-xs drop-shadow"></i>
                    )}
                  </div>
                </div>

                {/* Código HEX e Tooltip */}
                <span className="text-[11px] font-mono font-semibold text-gray-600 tracking-tight group-hover:text-artDark transition-colors">
                  {isCopied ? (
                    <span className="text-emerald-600 font-bold">Copiado!</span>
                  ) : (
                    hex
                  )}
                </span>
              </button>
            );
          })
          : [0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-col items-center gap-1.5 animate-pulse">
              <div className="w-full h-11 sm:h-12 rounded-xl bg-gray-200" />
              <div className="w-12 h-3 bg-gray-200 rounded" />
            </div>
          ))}
      </div>
    </div>
  );
}
