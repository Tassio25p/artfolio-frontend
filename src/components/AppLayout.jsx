import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

/**
 * AppLayout — Layout compartilhado da aplicação.
 * Mantém a Sidebar fixa à esquerda montada uma única vez,
 * evitando destruição, remontagem e repaints a cada troca de página.
 */
export default function AppLayout() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] text-artDark antialiased font-sans flex relative">
      {/* Textura sutil global */}
      <div className="fixed top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] pointer-events-none z-[99]" />

      {/* Barra de Navegação Lateral Fixa */}
      <Sidebar />

      {/* Conteúdo dinâmico com recuo à esquerda de 56px (w-14) para acomodar a Sidebar */}
      <main className="flex-1 min-w-0 pl-14 min-h-screen flex flex-col">
        <Outlet />
      </main>
    </div>
  );
}
