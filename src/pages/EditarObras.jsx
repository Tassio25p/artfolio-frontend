import Sidebar from "../components/Sidebar";
import { Link, useNavigate } from "react-router-dom";

export default function EditarObra() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Futuramente aqui vamos enviar as alterações para o backend
    navigate("/meu-portfolio");
  };

  const handleDelete = () => {
    const confirmar = confirm("Tem certeza que deseja excluir esta obra?");

    if (confirmar) {
      // Futuramente aqui vamos chamar a API para excluir a obra
      navigate("/meu-portfolio");
    }
  };

  return (
    <div className="bg-[#F9F8F6] text-artDark min-h-screen antialiased overflow-x-hidden font-sans">
      <div className="fixed top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] pointer-events-none z-[99]"></div>

      <Sidebar />

      <main className="ml-16 min-h-screen p-5 lg:p-10">
        <div className="max-w-6xl mx-auto">
          <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 mb-8">
            <div>
              <span className="text-artBlue font-bold tracking-widest uppercase text-[10px] mb-2 block">
                Gerenciamento de obra
              </span>

              <h1 className="font-editorial text-5xl lg:text-6xl leading-none">
                Editar <span className="italic text-artOrange">Obra.</span>
              </h1>

              <p className="text-sm text-gray-500 mt-3 max-w-xl leading-relaxed">
                Atualize imagem, categoria, descrição e status da obra dentro do
                seu portfólio.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/meu-portfolio"
                className="bg-white border border-black/5 px-5 py-3 rounded-full text-xs font-bold hover:bg-artDark hover:text-white transition-all"
              >
                <i className="fa-solid fa-arrow-left mr-2"></i>
                Voltar ao Portfólio
              </Link>

              <button
                type="submit"
                form="form-editar-obra"
                className="bg-artDark text-white px-5 py-3 rounded-full text-xs font-bold hover:bg-artPurple transition-all shadow-xl shadow-black/10"
              >
                <i className="fa-solid fa-floppy-disk mr-2"></i>
                Salvar Alterações
              </button>
            </div>
          </header>

          <form
            id="form-editar-obra"
            onSubmit={handleSubmit}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            <section className="lg:col-span-5">
              <div className="bg-white rounded-[2rem] border border-black/5 p-5 sticky top-8">
                <div className="mb-5">
                  <span className="text-artPurple font-bold tracking-widest uppercase text-[10px] block mb-1">
                    Prévia da obra
                  </span>

                  <h2 className="font-editorial text-3xl italic">
                    Imagem atual
                  </h2>
                </div>

                <div className="rounded-[1.7rem] overflow-hidden bg-[#F9F8F6] border border-black/5 mb-5">
                  <img
                    src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=1000&auto=format&fit=crop"
                    alt="Obra atual"
                    className="w-full h-[360px] object-cover"
                  />
                </div>

                <label className="group flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-[1.7rem] p-6 bg-[#F9F8F6] hover:border-artBlue hover:bg-white transition-all cursor-pointer text-center">
                  <i className="fa-solid fa-cloud-arrow-up text-4xl text-gray-300 group-hover:text-artBlue transition-colors mb-3"></i>

                  <p className="text-sm text-gray-500 font-medium">
                    Trocar imagem da obra
                  </p>

                  <span className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">
                    JPG, PNG, GIF ou MP4
                  </span>

                  <input type="file" className="hidden" />
                </label>

                <div className="grid grid-cols-3 gap-3 mt-5">
                  <div className="bg-[#F9F8F6] rounded-[1.2rem] p-3 border border-black/5">
                    <p className="text-lg font-black">42</p>
                    <span className="text-[8px] uppercase tracking-widest font-bold text-gray-400">
                      Curtidas
                    </span>
                  </div>

                  <div className="bg-[#F9F8F6] rounded-[1.2rem] p-3 border border-black/5">
                    <p className="text-lg font-black">8</p>
                    <span className="text-[8px] uppercase tracking-widest font-bold text-gray-400">
                      Coment.
                    </span>
                  </div>

                  <div className="bg-[#F9F8F6] rounded-[1.2rem] p-3 border border-black/5">
                    <p className="text-lg font-black">1.2k</p>
                    <span className="text-[8px] uppercase tracking-widest font-bold text-gray-400">
                      Views
                    </span>
                  </div>
                </div>
              </div>
            </section>

            <section className="lg:col-span-7 space-y-5">
              <div className="bg-white rounded-[2rem] border border-black/5 p-5 lg:p-6">
                <div className="mb-6">
                  <span className="text-artOrange font-bold tracking-widest uppercase text-[10px] block mb-1">
                    Informações principais
                  </span>

                  <h2 className="font-editorial text-3xl italic">
                    Dados da publicação
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                      Título da obra
                    </label>

                    <input
                      type="text"
                      defaultValue="Abstração em Tons de Púrpura"
                      className="w-full bg-[#F9F8F6] rounded-2xl px-5 py-4 outline-none focus:ring-2 ring-artPurple/20 text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                      Categoria
                    </label>

                    <select
                      defaultValue="pintura-digital"
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
                      Status
                    </label>

                    <select
                      defaultValue="publicada"
                      className="w-full bg-[#F9F8F6] rounded-2xl px-5 py-4 outline-none focus:ring-2 ring-artPurple/20 text-sm"
                    >
                      <option value="publicada">Publicada</option>
                      <option value="rascunho">Rascunho</option>
                      <option value="destaque">Destaque</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                      Tipo da obra
                    </label>

                    <select
                      defaultValue="digital"
                      className="w-full bg-[#F9F8F6] rounded-2xl px-5 py-4 outline-none focus:ring-2 ring-artPurple/20 text-sm"
                    >
                      <option value="digital">Digital</option>
                      <option value="fisica">Física</option>
                      <option value="hibrida">Híbrida</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                      Visibilidade
                    </label>

                    <select
                      defaultValue="publica"
                      className="w-full bg-[#F9F8F6] rounded-2xl px-5 py-4 outline-none focus:ring-2 ring-artPurple/20 text-sm"
                    >
                      <option value="publica">Pública</option>
                      <option value="privada">Privada</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                      Descrição / legenda
                    </label>

                    <textarea
                      rows="5"
                      defaultValue="Uma composição visual inspirada na mistura entre memória, movimento e camadas emocionais. A obra explora formas orgânicas, cores intensas e texturas digitais para representar sentimentos em transformação."
                      className="w-full bg-[#F9F8F6] rounded-2xl px-5 py-4 outline-none focus:ring-2 ring-artPurple/20 text-sm resize-none leading-relaxed"
                    ></textarea>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-[2rem] border border-black/5 p-5 lg:p-6">
                <div className="mb-6">
                  <span className="text-artBlue font-bold tracking-widest uppercase text-[10px] block mb-1">
                    Organização
                  </span>

                  <h2 className="font-editorial text-3xl italic">
                    Tags e destaque
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                      Tags
                    </label>

                    <input
                      type="text"
                      defaultValue="digital, abstrato, púrpura"
                      className="w-full bg-[#F9F8F6] rounded-2xl px-5 py-4 outline-none focus:ring-2 ring-artPurple/20 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                      Preço / valor estimado
                    </label>

                    <input
                      type="text"
                      defaultValue="R$ 350,00"
                      className="w-full bg-[#F9F8F6] rounded-2xl px-5 py-4 outline-none focus:ring-2 ring-artPurple/20 text-sm"
                    />
                  </div>
                </div>

                <div className="mt-5 bg-artPurple/5 border border-artPurple/10 rounded-[1.5rem] p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-bold">Destacar no feed</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Obras destacadas aparecem com mais prioridade para outros
                      usuários.
                    </p>
                  </div>

                  <button
                    type="button"
                    className="w-14 h-8 rounded-full p-1 bg-artPurple transition-all shrink-0"
                  >
                    <span className="w-6 h-6 rounded-full bg-white block ml-6"></span>
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-[2rem] border border-red-100 p-5 lg:p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <span className="text-red-400 font-bold tracking-widest uppercase text-[10px] block mb-1">
                      Zona de risco
                    </span>

                    <h2 className="font-editorial text-3xl italic">
                      Excluir obra
                    </h2>

                    <p className="text-sm text-gray-500 mt-2 max-w-xl">
                      Ao excluir esta obra, ela será removida do seu portfólio,
                      do feed e das listas de obras salvas.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleDelete}
                    className="bg-red-50 text-red-500 px-6 py-3.5 rounded-full text-sm font-bold hover:bg-red-500 hover:text-white transition-all"
                  >
                    Excluir Obra
                  </button>
                </div>
              </div>
            </section>
          </form>
        </div>
      </main>
    </div>
  );
}