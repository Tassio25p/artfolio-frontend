import React, { useState, useEffect } from "react";

export default function CadastroMosaicoAnimation() {
  const [etapaMontagem, setEtapaMontagem] = useState(0);

  const categorias = [
    {
      id: "ilustracao",
      nome: "Ilustração Digital",
      icone: "fa-pen-nib",
      cor: "#FF793F", // Laranja
      imagem: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=400&q=80",
      delay: "0ms",
      gridArea: "col-span-2 row-span-1",
    },
    {
      id: "pintura",
      nome: "Pintura Tradicional",
      icone: "fa-palette",
      cor: "#6C5CE7", // Roxo
      imagem: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=400&q=80",
      delay: "150ms",
      gridArea: "col-span-1 row-span-2",
    },
    {
      id: "3d",
      nome: "Modelagem 3D",
      icone: "fa-cube",
      cor: "#00CEC9", // Ciano/Azul
      imagem: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80",
      delay: "300ms",
      gridArea: "col-span-1 row-span-1",
    },
    {
      id: "conceitual",
      nome: "Arte Conceitual",
      icone: "fa-wand-magic-sparkles",
      cor: "#FD79A8", // Rosa vibrante
      imagem: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=400&q=80",
      delay: "450ms",
      gridArea: "col-span-1 row-span-1",
    },
  ];

  useEffect(() => {
    const loop = setInterval(() => {
      setEtapaMontagem((prev) => (prev === 0 ? 1 : 0));
    }, 4500);
    return () => clearInterval(loop);
  }, []);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-6 select-none overflow-hidden">
      {/* Luz ambiente de fundo */}
      <div className="absolute w-64 h-64 rounded-full bg-artOrange/20 blur-[80px] -top-10 left-10 pointer-events-none"></div>
      <div className="absolute w-72 h-72 rounded-full bg-artPurple/30 blur-[90px] -bottom-10 right-10 pointer-events-none"></div>

      {/* Título de chamada da animação */}
      <div className="relative z-10 text-center mb-6">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[10px] uppercase font-bold tracking-widest text-white/90 shadow-sm">
          <i className="fa-solid fa-shapes text-artOrange animate-spin" style={{ animationDuration: "10s" }}></i>
          Construa seu espaço
        </span>
      </div>

      {/* Grid Mosaico Dinâmico */}
      <div className="relative z-10 w-full max-w-xs sm:max-w-sm grid grid-cols-2 gap-3 p-3 bg-black/20 backdrop-blur-md rounded-3xl border border-white/15 shadow-2xl">
        {categorias.map((cat, idx) => {
          const isMontado = etapaMontagem === 1;

          return (
            <div
              key={cat.id}
              className={`relative rounded-2xl overflow-hidden group transition-all duration-700 ease-out border shadow-md ${
                idx === 0
                  ? "col-span-2 h-28"
                  : idx === 1
                  ? "col-span-1 h-36"
                  : idx === 2
                  ? "col-span-1 h-16"
                  : "col-span-1 h-16"
              }`}
              style={{
                borderColor: `${cat.cor}70`,
                transform: isMontado
                  ? "scale(1) translate(0, 0)"
                  : idx % 2 === 0
                  ? "scale(0.96) translateY(-4px)"
                  : "scale(0.96) translateY(4px)",
                boxShadow: `0 8px 20px -4px ${cat.cor}40`,
              }}
            >
              {/* Imagem de Fundo da Categoria */}
              <img
                src={cat.imagem}
                alt={cat.nome}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                loading="lazy"
              />

              {/* Camada de Gradiente */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex flex-col justify-between p-2.5 text-white">
                <div className="flex items-center justify-between">
                  <span
                    className="w-6 h-6 rounded-lg flex items-center justify-center text-[10px] backdrop-blur-md border"
                    style={{
                      backgroundColor: `${cat.cor}30`,
                      borderColor: cat.cor,
                      color: "#FFFFFF",
                    }}
                  >
                    <i className={`fa-solid ${cat.icone}`}></i>
                  </span>

                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: cat.cor }}
                  ></span>
                </div>

                <div>
                  <h4 className="font-editorial text-xs sm:text-sm font-bold leading-tight drop-shadow-sm">
                    {cat.nome}
                  </h4>
                  <p className="text-[9px] text-white/70 font-light flex items-center gap-1 mt-0.5">
                    <span className="w-1 h-1 rounded-full bg-green-400"></span> Disponível no Artfolio
                  </p>
                </div>
              </div>

              {/* Borda LED sutil com glow */}
              <div
                className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity border-2"
                style={{ borderColor: cat.cor }}
              ></div>
            </div>
          );
        })}
      </div>

      {/* Rodapé da Animação */}
      <div className="relative z-10 flex items-center justify-center gap-2 mt-5 text-[11px] text-white/80 font-light">
        <i className="fa-solid fa-layer-group text-artOrange"></i>
        <span>Organize suas obras em um portfólio único</span>
      </div>
    </div>
  );
}
