import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";

function EditarPerfil() {
  const navigate = useNavigate();
  const [success, setSuccess] = useState("");

  // States initialized from localStorage or defaults
  const [nome, setNome] = useState(() => localStorage.getItem("artfolio_nome") || "Marina Silva");
  const [categoria, setCategoria] = useState(() => localStorage.getItem("artfolio_categoria_principal") || "pintura-digital");
  const [cidade, setCidade] = useState(() => localStorage.getItem("artfolio_cidade") || "São Paulo");
  const [estado, setEstado] = useState(() => localStorage.getItem("artfolio_estado") || "SP");
  const [biografia, setBiografia] = useState(() => localStorage.getItem("artfolio_biografia") || "Explorando a intersecção entre o artesanato têxtil e a modelagem 3D. Transformando sentimentos em formas tangíveis desde 2018.");
  const [instagram, setInstagram] = useState(() => localStorage.getItem("artfolio_instagram") || "@marinasilva.art");
  const [behance, setBehance] = useState(() => localStorage.getItem("artfolio_behance") || "behance.net/marinasilva");
  const [emailPublico, setEmailPublico] = useState(() => localStorage.getItem("artfolio_email_publico") || "contato@marinasilva.com");
  const [siteExterno, setSiteExterno] = useState(() => localStorage.getItem("artfolio_site_externo") || "marinasilva.com");

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Save to localStorage
    localStorage.setItem("artfolio_nome", nome);
    localStorage.setItem("artfolio_categoria_principal", categoria);
    localStorage.setItem("artfolio_cidade", cidade);
    localStorage.setItem("artfolio_estado", estado);
    localStorage.setItem("artfolio_biografia", biografia);
    localStorage.setItem("artfolio_instagram", instagram);
    localStorage.setItem("artfolio_behance", behance);
    localStorage.setItem("artfolio_email_publico", emailPublico);
    localStorage.setItem("artfolio_site_externo", siteExterno);

    setSuccess("Perfil atualizado com sucesso!");
    setTimeout(() => {
      setSuccess("");
      navigate("/perfil"); // Redirect to profile to see the changes
    }, 1500);
  };

  return (
    <div className="bg-[#F9F8F6] text-artDark antialiased overflow-x-hidden font-sans min-h-screen">
      <div className="fixed top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] pointer-events-none z-[99]" />

      <Sidebar />

      <main className="ml-16 min-h-screen p-5 lg:p-10">
        <div className="max-w-6xl mx-auto">
          <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 mb-8">
            <div>
              <span className="text-artPurple font-bold tracking-widest uppercase text-[10px] mb-2 block">
                Configuração do Artista
              </span>

              <h1 className="font-editorial text-5xl lg:text-6xl leading-none">
                Editar <span className="italic text-artOrange">Perfil.</span>
              </h1>

              <p className="text-sm text-gray-500 mt-3 max-w-xl">
                Atualize suas informações públicas, ajuste sua biografia e
                personalize como outros usuários veem seu portfólio.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {success && (
                <span className="text-xs bg-artGreen/10 text-artGreen px-4 py-3 rounded-full font-bold">
                  <i className="fa-solid fa-circle-check mr-1.5"></i>
                  {success}
                </span>
              )}

              <button
                type="submit"
                form="form-editar-perfil"
                className="bg-artDark text-white px-6 py-4 rounded-full text-sm font-bold hover:bg-artPurple transition-all shadow-xl shadow-black/10 active:scale-95"
              >
                <i className="fa-solid fa-floppy-disk mr-2"></i>
                Salvar Alterações
              </button>
            </div>
          </header>

          <form
            id="form-editar-perfil"
            onSubmit={handleSubmit}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            <section className="lg:col-span-4">
              <div className="bg-white rounded-[2rem] border border-black/5 p-6 sticky top-8">
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-5">
                    <div className="w-36 h-36 rounded-[2.3rem] overflow-hidden border-4 border-white shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500 bg-gray-100">
                      <img
                        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop"
                        alt="Foto de perfil"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <label className="absolute -bottom-3 -right-3 w-12 h-12 rounded-full bg-artOrange text-white flex items-center justify-center shadow-lg border-4 border-white cursor-pointer hover:bg-artPurple transition-colors">
                      <i className="fa-solid fa-camera text-sm"></i>
                      <input type="file" className="hidden" />
                    </label>
                  </div>

                  <h2 className="font-editorial text-3xl leading-none">
                    {nome.split(" ")[0]} <span className="italic">{nome.split(" ").slice(1).join(" ") || "."}</span>
                  </h2>

                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-2">
                    Artista Verificado
                  </p>

                  <div className="grid grid-cols-3 gap-3 w-full mt-6">
                    <div className="bg-[#F9F8F6] rounded-[1.3rem] p-3">
                      <p className="text-lg font-black">1.2k</p>
                      <span className="text-[8px] uppercase tracking-widest font-bold text-gray-400">
                        Seguidores
                      </span>
                    </div>

                    <div className="bg-[#F9F8F6] rounded-[1.3rem] p-3">
                      <p className="text-lg font-black">48</p>
                      <span className="text-[8px] uppercase tracking-widest font-bold text-gray-400">
                        Obras
                      </span>
                    </div>

                    <div className="bg-[#F9F8F6] rounded-[1.3rem] p-3">
                      <p className="text-lg font-black">Pro</p>
                      <span className="text-[8px] uppercase tracking-widest font-bold text-gray-400">
                        Plano
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 bg-artPurple/5 border border-artPurple/10 rounded-[1.5rem] p-4 text-left">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest mb-2">
                      Prévia pública
                    </h3>

                    <p className="text-xs text-gray-500 leading-relaxed font-light">
                      Essas informações aparecerão no seu perfil público e nas
                      obras publicadas no Feed.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="lg:col-span-8 space-y-6">
              <div className="bg-white rounded-[2rem] border border-black/5 p-6">
                <h2 className="font-editorial text-3xl italic mb-6">
                  Informações principais
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                      Nome artístico
                    </label>

                    <input
                      type="text"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      className="w-full bg-[#F9F8F6] rounded-2xl px-5 py-4 outline-none focus:ring-2 ring-artPurple/20 text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                      Categoria principal
                    </label>

                    <select
                      value={categoria}
                      onChange={(e) => setCategoria(e.target.value)}
                      className="w-full bg-[#F9F8F6] rounded-2xl px-5 py-4 outline-none focus:ring-2 ring-artPurple/20 text-sm"
                    >
                      <option value="pintura-digital">Pintura Digital</option>
                      <option value="modelagem-3d">Modelagem 3D</option>
                      <option value="textil">Têxtil</option>
                      <option value="artesanato">Artesanato</option>
                      <option value="desenho">Desenho Manual</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                      Cidade
                    </label>

                    <input
                      type="text"
                      value={cidade}
                      onChange={(e) => setCidade(e.target.value)}
                      className="w-full bg-[#F9F8F6] rounded-2xl px-5 py-4 outline-none focus:ring-2 ring-artPurple/20 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                      Estado
                    </label>

                    <input
                      type="text"
                      value={estado}
                      onChange={(e) => setEstado(e.target.value)}
                      className="w-full bg-[#F9F8F6] rounded-2xl px-5 py-4 outline-none focus:ring-2 ring-artPurple/20 text-sm"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                      Biografia
                    </label>

                    <textarea
                      rows="4"
                      value={biografia}
                      onChange={(e) => setBiografia(e.target.value)}
                      className="w-full bg-[#F9F8F6] rounded-2xl px-5 py-4 outline-none focus:ring-2 ring-artPurple/20 text-sm resize-none leading-relaxed"
                    ></textarea>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-[2rem] border border-black/5 p-6">
                <h2 className="font-editorial text-3xl italic mb-6">
                  Links e contato
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                      Instagram
                    </label>

                    <div className="relative">
                      <i className="fa-brands fa-instagram absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"></i>
                      <input
                        type="text"
                        value={instagram}
                        onChange={(e) => setInstagram(e.target.value)}
                        className="w-full bg-[#F9F8F6] rounded-2xl pl-12 pr-5 py-4 outline-none focus:ring-2 ring-artPurple/20 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                      Behance
                    </label>

                    <div className="relative">
                      <i className="fa-brands fa-behance absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"></i>
                      <input
                        type="text"
                        value={behance}
                        onChange={(e) => setBehance(e.target.value)}
                        className="w-full bg-[#F9F8F6] rounded-2xl pl-12 pr-5 py-4 outline-none focus:ring-2 ring-artPurple/20 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                      E-mail público
                    </label>

                    <div className="relative">
                      <i className="fa-solid fa-envelope absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"></i>
                      <input
                        type="email"
                        value={emailPublico}
                        onChange={(e) => setEmailPublico(e.target.value)}
                        className="w-full bg-[#F9F8F6] rounded-2xl pl-12 pr-5 py-4 outline-none focus:ring-2 ring-artPurple/20 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                      Site / Portfólio externo
                    </label>

                    <div className="relative">
                      <i className="fa-solid fa-link absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"></i>
                      <input
                        type="text"
                        value={siteExterno}
                        onChange={(e) => setSiteExterno(e.target.value)}
                        className="w-full bg-[#F9F8F6] rounded-2xl pl-12 pr-5 py-4 outline-none focus:ring-2 ring-artPurple/20 text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-artDark rounded-[2rem] p-6 text-white flex flex-col md:flex-row md:items-center justify-between gap-5 overflow-hidden relative">
                <div className="relative z-10">
                  <span className="text-artPurple font-bold tracking-widest uppercase text-[10px] block mb-2">
                    Perfil profissional
                  </span>

                  <h2 className="font-editorial text-3xl italic">
                    Destaque sua identidade artística.
                  </h2>

                  <p className="text-xs text-gray-400 mt-2 max-w-xl">
                    Um perfil completo aumenta a confiança de clientes,
                    colecionadores e outros artistas da comunidade.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => navigate("/perfil")}
                  className="relative z-10 bg-white text-artDark px-6 py-3 rounded-full text-xs font-bold hover:bg-artPurple hover:text-white transition-all whitespace-nowrap active:scale-95"
                >
                  Ver Perfil
                </button>

                <i className="fa-solid fa-wand-magic-sparkles absolute -right-8 -bottom-10 text-[8rem] text-white/5 rotate-12"></i>
              </div>
            </section>
          </form>
        </div>
      </main>
    </div>
  );
}

export default EditarPerfil;