import React, { useState, useEffect } from "react";

export default function RecuperarSenhaEnvelopeAnimation() {
  const [aberto, setAberto] = useState(false);

  useEffect(() => {
    const loop = setInterval(() => {
      setAberto((prev) => !prev);
    }, 4000);
    return () => clearInterval(loop);
  }, []);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-6 select-none overflow-hidden">
      {/* Luzes de Fundo / Aura de Segurança */}
      <div className="absolute w-72 h-72 rounded-full bg-artOrange/25 blur-[90px] -top-10 -left-10 animate-pulse pointer-events-none"></div>
      <div className="absolute w-80 h-80 rounded-full bg-artPurple/35 blur-[100px] -bottom-10 -right-10 pointer-events-none"></div>

      {/* Chamada Superior */}
      <div className="relative z-10 text-center mb-6">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[10px] uppercase font-bold tracking-widest text-white/90 shadow-sm">
          <i className="fa-solid fa-shield-halved text-artOrange"></i>
          Segurança Artfolio • OTP
        </span>
      </div>

      {/* Estrutura do Envelope Artístico */}
      <div
        className="relative w-72 sm:w-80 h-56 cursor-pointer flex items-center justify-center"
        onClick={() => setAberto((prev) => !prev)}
      >
        {/* Token / Selo de Verificação Holográfico que emerge do envelope */}
        <div
          className={`absolute z-20 w-64 bg-gradient-to-r from-white via-white/95 to-white/90 text-artDark rounded-2xl p-3.5 shadow-2xl border border-artOrange/40 transition-all duration-700 ease-out flex flex-col items-center justify-center ${
            aberto
              ? "-translate-y-24 scale-100 opacity-100 rotate-0"
              : "-translate-y-4 scale-75 opacity-0 rotate-3 pointer-events-none"
          }`}
          style={{
            boxShadow: "0 10px 30px rgba(255, 121, 63, 0.35), 0 0 20px rgba(108, 92, 231, 0.25)",
          }}
        >
          {/* Header do Token */}
          <div className="flex items-center justify-between w-full mb-2">
            <span className="text-[9px] font-bold uppercase tracking-wider text-artPurple flex items-center gap-1">
              <i className="fa-solid fa-key text-artOrange"></i> Código Seguro
            </span>
            <span className="text-[9px] text-gray-400 font-medium">Expira em 10 min</span>
          </div>

          {/* Código de 6 Dígitos em Destaque */}
          <div className="flex items-center gap-1.5 py-1">
            {["8", "4", "2", "9", "1", "0"].map((num, i) => (
              <span
                key={i}
                className="w-7 h-8 rounded-lg bg-artPurple/10 border border-artPurple/20 flex items-center justify-center font-mono font-black text-sm text-artPurple shadow-xs"
              >
                {num}
              </span>
            ))}
          </div>

          <p className="text-[10px] text-gray-500 font-light mt-1.5 flex items-center gap-1">
            <i className="fa-solid fa-circle-check text-green-500 text-xs"></i>
            Validação criptografada
          </p>
        </div>

        {/* Corpo do Envelope */}
        <div className="relative z-10 w-full h-44 bg-gradient-to-br from-[#50409A] via-[#3B2C85] to-[#251A5A] rounded-2xl border border-white/20 shadow-2xl overflow-hidden flex flex-col justify-end p-4">
          {/* Aba Superior do Envelope (Abre / Fecha) */}
          <div
            className={`absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-[#6C5CE7] to-[#50409A] transition-all duration-700 ease-out origin-top border-b border-white/10 ${
              aberto ? "-scale-y-100 opacity-60" : "scale-y-100 opacity-100"
            }`}
            style={{
              clipPath: "polygon(0 0, 50% 100%, 100% 0)",
            }}
          ></div>

          {/* Selo Artístico de Cera com Efeito Holográfico */}
          <div
            className={`absolute top-16 left-1/2 -translate-x-1/2 z-30 w-12 h-12 rounded-full bg-gradient-to-br from-artOrange via-[#E17055] to-[#D63031] border-2 border-white/60 flex items-center justify-center shadow-lg transition-all duration-700 ${
              aberto ? "scale-90 opacity-75 -translate-y-8" : "scale-100 opacity-100 animate-bounce"
            }`}
            style={{
              boxShadow: "0 4px 15px rgba(255, 121, 63, 0.6), inset 0 2px 4px rgba(255, 255, 255, 0.4)",
              animationDuration: "3s",
            }}
          >
            <i className="fa-solid fa-palette text-white text-base drop-shadow-sm"></i>
          </div>

          {/* Abas Laterais e Inferiores com Textura */}
          <div className="relative z-10 flex items-center justify-between text-white/80 text-xs pt-3 border-t border-white/10">
            <span className="flex items-center gap-1.5 font-editorial tracking-wider">
              <i className="fa-solid fa-envelope-open-text text-artOrange"></i>
              Artfolio Transacional
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-white/60">
              {aberto ? "Código Enviado" : "Clique p/ Abrir"}
            </span>
          </div>
        </div>
      </div>

      {/* Legenda Inferior */}
      <div className="relative z-10 flex items-center justify-center gap-2 mt-6 text-[11px] text-white/80 font-light">
        <i className="fa-solid fa-lock text-artOrange"></i>
        <span>Envio rápido e seguro via e-mail transacional</span>
      </div>
    </div>
  );
}
