import React from "react";

export default function FlowerDrawingHeroAnimation() {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center select-none overflow-hidden bg-[#18181B]">
      {/* Textura de Papel de Desenho Artístico / Granulado Fino */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

      {/* Luz ambiente suave de ateliê */}
      <div className="absolute w-72 h-72 rounded-full bg-white/5 blur-[90px] pointer-events-none"></div>

      {/* Canvas SVG com Esboço de Girassol / Margarida Artística a Lápis Preto e Branco */}
      <div className="relative z-10 w-full max-w-[340px] sm:max-w-[380px] h-[300px] sm:h-[360px] flex items-center justify-center">
        <svg
          viewBox="0 0 400 400"
          className="w-full h-full drop-shadow-md overflow-visible"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <style>{`
            @keyframes sketchStroke {
              0% {
                stroke-dashoffset: 700;
                opacity: 0.1;
              }
              50% {
                stroke-dashoffset: 0;
                opacity: 0.95;
              }
              80% {
                stroke-dashoffset: 0;
                opacity: 1;
              }
              100% {
                stroke-dashoffset: 700;
                opacity: 0.2;
              }
            }

            @keyframes pencilTrack {
              0% {
                transform: translate(200px, 180px) rotate(-20deg);
                opacity: 0;
              }
              10% {
                transform: translate(200px, 180px) rotate(-20deg);
                opacity: 1;
              }
              30% {
                transform: translate(210px, 150px) rotate(-10deg);
                opacity: 1;
              }
              50% {
                transform: translate(260px, 90px) rotate(5deg);
                opacity: 1;
              }
              70% {
                transform: translate(110px, 160px) rotate(-25deg);
                opacity: 1;
              }
              85% {
                transform: translate(200px, 350px) rotate(-15deg);
                opacity: 0.8;
              }
              100% {
                transform: translate(200px, 180px) rotate(-20deg);
                opacity: 0;
              }
            }

            .sketch-center {
              stroke-dasharray: 400;
              animation: sketchStroke 9s ease-in-out infinite;
            }

            .sketch-petals {
              stroke-dasharray: 650;
              animation: sketchStroke 9s ease-in-out infinite 0.4s;
            }

            .sketch-stem {
              stroke-dasharray: 350;
              animation: sketchStroke 9s ease-in-out infinite 0.8s;
            }

            .sketch-hatch {
              stroke-dasharray: 180;
              animation: sketchStroke 9s ease-in-out infinite 1.2s;
            }

            .pencil-anim {
              animation: pencilTrack 9s ease-in-out infinite;
            }
          `}</style>

          {/* ================= LINHAS DE GUIA DO ESBOÇO (Círculos e Eixos Radiais) ================= */}
          <g stroke="#52525B" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.35">
            <circle cx="200" cy="180" r="42" />
            <circle cx="200" cy="180" r="115" />
            <line x1="200" y1="40" x2="200" y2="320" />
            <line x1="60" y1="180" x2="340" y2="180" />
            <line x1="100" y1="80" x2="300" y2="280" />
            <line x1="300" y1="80" x2="100" y2="280" />
          </g>

          {/* ================= HASTE E FOLHAS BOTÂNICAS ================= */}
          <g stroke="#F4F4F5" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            {/* Haste Principal Curva */}
            <path d="M200 220 C200 270, 190 320, 205 385" className="sketch-stem" />

            {/* Folha Esquerda */}
            <path
              d="M195 280 C140 285, 95 315, 80 345 C115 360, 165 330, 195 295"
              className="sketch-stem"
            />
            {/* Folha Direita */}
            <path
              d="M200 305 C255 310, 295 335, 315 365 C285 375, 235 350, 202 320"
              className="sketch-stem"
            />
          </g>

          {/* Nervuras das Folhas */}
          <g stroke="#A1A1AA" strokeWidth="1.2" strokeLinecap="round" opacity="0.75">
            <path d="M195 285 C145 305, 105 335, 85 345" className="sketch-hatch" />
            <path d="M125 320 L135 305 M145 330 L160 315 M165 340 L180 325" className="sketch-hatch" />
            <path d="M200 310 C250 325, 285 350, 310 365" className="sketch-hatch" />
            <path d="M245 330 L235 315 M265 340 L255 325 M285 350 L275 335" className="sketch-hatch" />
          </g>

          {/* ================= PÉTALAS RADIAIS (CAMADA TRASEIRA) ================= */}
          <g stroke="#D4D4D8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" opacity="0.65">
            <path d="M175 145 C160 100, 150 70, 165 50 C180 65, 185 105, 188 140" className="sketch-petals" />
            <path d="M212 140 C215 105, 220 65, 235 50 C250 70, 240 100, 225 145" className="sketch-petals" />
            <path d="M235 155 C265 130, 305 110, 325 125 C315 145, 280 165, 242 168" className="sketch-petals" />
            <path d="M242 192 C280 195, 315 215, 325 235 C305 250, 265 230, 235 205" className="sketch-petals" />
            <path d="M225 215 C240 260, 250 290, 235 310 C220 295, 215 255, 212 220" className="sketch-petals" />
            <path d="M188 220 C185 255, 180 295, 165 310 C150 290, 160 260, 175 215" className="sketch-petals" />
            <path d="M165 205 C135 230, 95 250, 75 235 C85 215, 120 195, 158 192" className="sketch-petals" />
            <path d="M158 168 C120 165, 85 145, 75 125 C95 110, 135 130, 165 155" className="sketch-petals" />
          </g>

          {/* ================= PÉTALAS RADIAIS (CAMADA PRINCIPAL EM DESTAQUE) ================= */}
          <g stroke="#FFFFFF" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
            {/* Topo (12 horas) */}
            <path d="M190 138 C185 90, 190 50, 200 35 C210 50, 215 90, 210 138" className="sketch-petals" />
            {/* 1h30 */}
            <path d="M225 148 C255 105, 285 75, 300 85 C295 105, 265 140, 238 160" className="sketch-petals" />
            {/* 3 horas (Direita) */}
            <path d="M242 172 C290 168, 330 172, 345 180 C330 190, 290 192, 242 188" className="sketch-petals" />
            {/* 4h30 */}
            <path d="M238 200 C265 220, 295 255, 300 275 C285 285, 255 255, 225 212" className="sketch-petals" />
            {/* 6 horas (Base) */}
            <path d="M210 222 C215 270, 210 310, 200 325 C190 310, 185 270, 190 222" className="sketch-petals" />
            {/* 7h30 */}
            <path d="M175 212 C145 255, 115 285, 100 275 C105 255, 135 220, 162 200" className="sketch-petals" />
            {/* 9 horas (Esquerda) */}
            <path d="M158 188 C110 192, 70 190, 55 180 C70 172, 110 168, 158 172" className="sketch-petals" />
            {/* 10h30 */}
            <path d="M162 160 C135 140, 105 105, 100 85 C115 75, 145 105, 175 148" className="sketch-petals" />
          </g>

          {/* ================= NERVURAS LONGITUDINAIS & HACHURAS DE PROFUNDIDADE ================= */}
          <g stroke="#A1A1AA" strokeWidth="1.1" strokeLinecap="round" opacity="0.8">
            {/* Nervuras Centrais de Cada Pétala */}
            <path d="M200 138 L200 50 M195 130 L193 80 M205 130 L207 80" className="sketch-hatch" />
            <path d="M232 154 L285 92 M228 160 L265 110" className="sketch-hatch" />
            <path d="M242 180 L325 180 M238 176 L290 174 M238 184 L290 186" className="sketch-hatch" />
            <path d="M232 206 L285 268 M228 200 L265 250" className="sketch-hatch" />
            <path d="M200 222 L200 310 M195 230 L193 280 M205 230 L207 280" className="sketch-hatch" />
            <path d="M168 206 L115 268 M172 200 L135 250" className="sketch-hatch" />
            <path d="M158 180 L75 180 M162 176 L110 174 M162 184 L110 186" className="sketch-hatch" />
            <path d="M168 154 L115 92 M172 160 L135 110" className="sketch-hatch" />
          </g>

          {/* ================= DISCO CENTRAL (GEOMETRIA EM ESPIRAL DE FIBONACCI) ================= */}
          <g className="sketch-center">
            {/* Anéis Concêntricos de Grafite */}
            <circle cx="200" cy="180" r="42" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="6 3" />
            <circle cx="200" cy="180" r="34" stroke="#E4E4E7" strokeWidth="1.6" strokeDasharray="4 2" />
            <circle cx="200" cy="180" r="26" stroke="#D4D4D8" strokeWidth="1.4" strokeDasharray="3 2" />
            <circle cx="200" cy="180" r="18" stroke="#A1A1AA" strokeWidth="1.2" />
            <circle cx="200" cy="180" r="10" stroke="#71717A" strokeWidth="1.2" />
            <circle cx="200" cy="180" r="4" fill="#FFFFFF" />

            {/* Pontilhado e Textura de Sementes de Girassol */}
            <circle cx="188" cy="172" r="1.5" fill="#E4E4E7" />
            <circle cx="212" cy="172" r="1.5" fill="#E4E4E7" />
            <circle cx="188" cy="188" r="1.5" fill="#E4E4E7" />
            <circle cx="212" cy="188" r="1.5" fill="#E4E4E7" />
            <circle cx="200" cy="165" r="1.5" fill="#E4E4E7" />
            <circle cx="200" cy="195" r="1.5" fill="#E4E4E7" />
            <circle cx="175" cy="180" r="1.8" fill="#E4E4E7" />
            <circle cx="225" cy="180" r="1.8" fill="#E4E4E7" />
            <circle cx="180" cy="160" r="1.5" fill="#A1A1AA" />
            <circle cx="220" cy="160" r="1.5" fill="#A1A1AA" />
            <circle cx="180" cy="200" r="1.5" fill="#A1A1AA" />
            <circle cx="220" cy="200" r="1.5" fill="#A1A1AA" />
          </g>

          {/* ================= O LÁPIS DESENHANDO EM TEMPO REAL ================= */}
          <g className="pencil-anim" style={{ pointerEvents: "none" }}>
            {/* Ponta de Grafite */}
            <polygon points="0,0 -4,-12 4,-12" fill="#27272A" />
            <polygon points="0,0 -2,-6 2,-6" fill="#09090B" />
            {/* Madeira Apontada */}
            <polygon points="-4,-12 4,-12 6,-28 -6,-28" fill="#D4A373" />
            {/* Corpo Sextavado do Lápis Grafite */}
            <rect x="-6" y="-120" width="12" height="92" rx="1" fill="#3F3F46" />
            <rect x="-2" y="-120" width="4" height="92" fill="#71717A" />
            {/* Detalhe Metálico / Virola */}
            <rect x="-6" y="-130" width="12" height="10" fill="#A1A1AA" />
            {/* Borracha Superior */}
            <rect x="-5" y="-140" width="10" height="10" rx="2" fill="#E11D48" opacity="0.9" />

            {/* Ponto de Contato Luminoso */}
            <circle cx="0" cy="0" r="3" fill="#FFFFFF" opacity="0.85" />
          </g>
        </svg>
      </div>

      {/* Assinatura Discreta de Esboço no Rodapé */}
      <div className="relative z-10 flex items-center justify-between w-full px-6 py-2 text-zinc-500 text-[10px] font-mono border-t border-zinc-800/60">
        <span className="flex items-center gap-1.5">
          <i className="fa-solid fa-pencil text-zinc-400"></i> Esboço • Girassol Artístico
        </span>
        <span className="opacity-75">Grafite & Geometria Fibonacci</span>
      </div>
    </div>
  );
}
