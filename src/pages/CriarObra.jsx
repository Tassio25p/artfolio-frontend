import React from "react";
import ModalUploadObra from "../components/ModalUploadObra";

export default function CriarObra() {
  return (
    <div className="w-full min-h-screen p-4 sm:p-6 lg:p-10 flex items-center justify-center relative">
      {/* Painéis de Luz Difusa Arquitetural (Inspirado em Galerias de Arte Contemporânea) */}
      <div className="fixed top-12 right-24 w-96 h-96 bg-artPurple/10 rounded-full blur-3xl pointer-events-none -z-10"></div>
      <div className="fixed bottom-12 left-32 w-96 h-96 bg-artOrange/10 rounded-full blur-3xl pointer-events-none -z-10"></div>
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[36rem] h-[36rem] bg-artBlue/5 rounded-full blur-3xl pointer-events-none -z-10"></div>

      <ModalUploadObra isPage={true} />
    </div>
  );
}