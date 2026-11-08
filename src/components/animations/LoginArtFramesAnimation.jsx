import React, { useState, useEffect } from "react";

export default function LoginArtFramesAnimation() {
  const [activeIndex, setActiveIndex] = useState(0);

  const quadros = [
    {
      id: 1,
      titulo: "Sinfonia Cromática",
      artista: "@aurora.art",
      categoria: "Ilustração Digital",
      corLed: "#FF793F", // Laranja Artfolio
      imagem: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80",
      curtidas: "1.4k",
      views: "4.8k",
    },
    {
      id: 2,
      titulo: "Metamorfose Cósmica",
      artista: "@nexus.studio",
      categoria: "Arte Conceitual",
      corLed: "#6C5CE7", // Roxo Artfolio
      imagem: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=600&q=80",
      curtidas: "2.8k",
      views: "8.2k",
    },
    {
      id: 3,
      titulo: "Luzes de Neon & Prisma",
      artista: "@cyber.painter",
      categoria: "Pintura Moderna",
      corLed: "#FF793F",
      imagem: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=600&q=80",
      curtidas: "980",
      views: "3.1k",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % quadros.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [quadros.length]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-6 select-none overflow-hidden">
      {/* Luzes de fundo ambiente */}
      <div className="absolute w-72 h-72 rounded-full bg-artOrange/20 blur-[90px] -top-10 -left-10 animate-pulse pointer-events-none"></div>
      <div className="absolute w-80 h-80 rounded-full bg-artPurple/30 blur-[100px] -bottom-10 -right-10 pointer-events-none"></div>

      {/* Container 3D em Perspectiva */}
      <div
        className="relative w-full max-w-sm h-80 sm:h-96 flex items-center justify-center"
        style={{ perspective: "1200px" }}
      >
        {quadros.map((quadro, idx) => {
          // Calcular distância circular em relação ao ativo
          const offset = (idx - activeIndex + quadros.length) % quadros.length;

          let transformClass;
          if (offset === 0) {
            // Quadro frontal em destaque
            transformClass = "translate-y-0 translate-x-0 rotate-0 scale-100 z-30 shadow-2xl";
          } else if (offset === 1) {
            // Quadro à direita/trás
            transformClass = "translate-x-12 -translate-y-4 rotate-6 scale-90 z-20 shadow-xl opacity-70 hover:opacity-90";
          } else {
            // Quadro à esquerda/trás
            transformClass = "-translate-x-12 -translate-y-6 -rotate-6 scale-80 z-10 shadow-lg opacity-50 hover:opacity-80";
          }

          const isDestaque = offset === 0;

          return (
            <div
              key={quadro.id}
              onClick={() => setActiveIndex(idx)}
              className={`absolute w-64 sm:w-72 h-80 rounded-2xl overflow-hidden cursor-pointer transition-all duration-700 ease-out border backdrop-blur-md ${transformClass}`}
              style={{
                borderColor: isDestaque ? quadro.corLed : "rgba(255, 255, 255, 0.2)",
                boxShadow: isDestaque
                  ? `0 0 25px ${quadro.corLed}70, 0 15px 35px rgba(0,0,0,0.5)`
                  : "0 10px 25px rgba(0,0,0,0.3)",
              }}
            >
              {/* Imagem da Obra */}
              <img
                src={quadro.imagem}
                alt={quadro.titulo}
                className="w-full h-full object-cover"
                loading="lazy"
              />

              {/* Degradê e Informações do Card */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-between p-4 text-white">
                {/* Topo do Card - Badge de LED */}
                <div className="flex items-center justify-between">
                  <span
                    className="text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full backdrop-blur-md border"
                    style={{
                      backgroundColor: `${quadro.corLed}25`,
                      color: "#FFFFFF",
                      borderColor: quadro.corLed,
                    }}
                  >
                    {quadro.categoria}
                  </span>

                  <span className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: quadro.corLed }}></span>
                </div>

                {/* Base do Card - Título, Autor e Engajamento */}
                <div>
                  <h4 className="font-editorial text-lg font-bold leading-tight drop-shadow-md">
                    {quadro.titulo}
                  </h4>
                  <p className="text-[11px] text-white/80 font-light mb-2">
                    {quadro.artista}
                  </p>

                  <div className="flex items-center gap-3 pt-2 border-t border-white/15 text-[10px] text-white/90">
                    <span className="flex items-center gap-1">
                      <i className="fa-solid fa-heart text-red-400"></i> {quadro.curtidas}
                    </span>
                    <span className="flex items-center gap-1">
                      <i className="fa-solid fa-eye text-white/70"></i> {quadro.views}
                    </span>
                  </div>
                </div>
              </div>

              {/* Linha de LED de Brilho Pulsante */}
              {isDestaque && (
                <div
                  className="absolute inset-0 rounded-2xl pointer-events-none border-2 animate-pulse"
                  style={{ borderColor: quadro.corLed }}
                ></div>
              )}
            </div>
          );
        })}
      </div>

      {/* Controles / Indicadores em Bolinhas */}
      <div className="flex items-center gap-2 mt-6 z-30">
        {quadros.map((q, idx) => (
          <button
            key={q.id}
            type="button"
            onClick={() => setActiveIndex(idx)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              activeIndex === idx
                ? "w-7 bg-artOrange shadow-lg shadow-artOrange/50"
                : "w-2 bg-white/40 hover:bg-white/70"
            }`}
            aria-label={`Ver quadro ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
