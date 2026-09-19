import React from "react";

/**
 * ChameleonChatPattern — Fundo decorativo sutil com contorno de camaleões em degradê base.
 * Opacidade ultra-fina (3% a 5%) para criar atmosfera de marca d'água elegante sem atrapalhar leitura.
 * Para desativar ou remover, basta ocultar/comentar este componente no Messages.jsx.
 */
export default function ChameleonChatPattern({ className = "" }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 w-full h-full overflow-hidden select-none z-0 ${className}`}
    >
      <svg
        className="w-full h-full opacity-[0.20]"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
      >
        <defs>
          {/* Degradê base do Artfolio: Roxo -> Laranja -> Azul */}
          <linearGradient id="artfolioChameleonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6C5CE7" />
            <stop offset="50%" stopColor="#FF793F" />
            <stop offset="100%" stopColor="#0984E3" />
          </linearGradient>

          {/* Padrão repetido de camaleão em traço fino (outline) visível */}
          <pattern
            id="chameleonTile"
            width="130"
            height="130"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(10)"
          >
            <g
              fill="none"
              stroke="url(#artfolioChameleonGrad)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              transform="translate(15, 15) scale(0.72)"
            >
              {/* Corpo e Cabeça estilizada do Camaleão com cauda enrolada */}
              <path d="M 28 50 C 25 35, 40 20, 65 20 C 85 20, 105 32, 105 48 C 105 60, 95 68, 80 68 C 65 68, 55 60, 50 60 C 40 60, 35 68, 28 68 C 18 68, 8 58, 8 46 C 8 36, 16 30, 24 30 C 29 30, 32 33, 32 37 C 32 41, 28 44, 25 44 C 23 44, 21 42, 21 40" />
              
              {/* Crista / Dorso ornamental em pontilhado/arcos */}
              <path d="M 45 23 Q 48 18 52 21 Q 56 16 60 20 Q 64 15 68 20 Q 72 16 76 21" />

              {/* Olho cônico circular característico */}
              <circle cx="88" cy="38" r="7" />
              <circle cx="89" cy="38" r="2.5" fill="url(#artfolioChameleonGrad)" />

              {/* Pata dianteira segurando galho */}
              <path d="M 75 66 C 76 74, 80 78, 84 80 M 78 78 L 86 78" />

              {/* Pata traseira */}
              <path d="M 40 64 C 38 72, 34 76, 30 80 M 34 78 L 26 78" />

              {/* Ramo / Galho artístico fino */}
              <path d="M 5 82 Q 55 78 115 82" strokeDasharray="3 3" strokeWidth="0.8" />
              <path d="M 105 76 Q 112 72 118 76" strokeWidth="0.8" />
            </g>

            {/* Ponto sutil complementar */}
            <circle cx="95" cy="15" r="1.5" fill="url(#artfolioChameleonGrad)" opacity="0.6" />
            <circle cx="20" cy="105" r="1.2" fill="url(#artfolioChameleonGrad)" opacity="0.6" />
          </pattern>
        </defs>

        <rect width="100%" height="100%" fill="url(#chameleonTile)" />
      </svg>
    </div>
  );
}
