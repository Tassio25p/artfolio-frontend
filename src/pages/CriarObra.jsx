import React from "react";
import Sidebar from "../components/Sidebar";
import ModalUploadObra from "../components/ModalUploadObra";

export default function CriarObra() {
  return (
    <div className="bg-[#F9F8F6] text-artDark min-h-screen antialiased font-sans">
      <div className="fixed top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] pointer-events-none z-[99]"></div>

      <Sidebar />

      <main className="ml-14 min-h-screen p-4 sm:p-6 lg:p-10 flex items-center justify-center">
        <ModalUploadObra isPage={true} />
      </main>
    </div>
  );
}