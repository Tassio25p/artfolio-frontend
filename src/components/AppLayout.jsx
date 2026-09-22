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
    <div className="min-h-screen bg-[#F9F8F6] text-artDark antialiased font-sans flex relative overflow-x-hidden">
      {/* Textura sutil global */}
      <div className="fixed top-0 left-0 w-full h-full bg-[url('/noise.svg')] opacity-[0.035] pointer-events-none z-[99]" />

      {/* Auras luminosas difusas e coloridas (mesma atmosfera estética do Início) */}
      <div className="fixed -left-10 top-1/4 w-96 h-[650px] bg-gradient-to-b from-artOrange/15 via-artPurple/10 to-artBlue/10 rounded-full blur-3xl pointer-events-none z-0"></div>
      <div className="fixed -right-10 top-1/3 w-96 h-[650px] bg-gradient-to-b from-artBlue/10 via-artPurple/10 to-artOrange/15 rounded-full blur-3xl pointer-events-none z-0"></div>
      <div className="fixed top-0 left-1/3 w-[500px] h-[350px] bg-gradient-to-tr from-artPurple/10 via-artOrange/5 to-transparent rounded-full blur-3xl pointer-events-none z-0"></div>

      {/* Barra de Navegação Lateral Fixa */}
      <Sidebar />

      {/* Conteúdo dinâmico com recuo à esquerda de 80px (w-20) para acomodar a Sidebar */}
      <main className="flex-1 min-w-0 pl-20 min-h-screen flex flex-col relative z-10">
        <Outlet />
      </main>
    </div>
  );
}
