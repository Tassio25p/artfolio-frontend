import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { GoogleLogin } from "@react-oauth/google";

export default function Cadastro() {
  const navigate = useNavigate();
  const { login: setAuthLogin, loginGoogle } = useAuth();

  // Estados dos campos
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [documento, setDocumento] = useState(""); // CPF ou CNPJ
  const [tipoUsuario, setTipoUsuario] = useState("PF"); // 'PF' ou 'PJ'
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [aceitouTermos, setAceitouTermos] = useState(false);

  // Estados de controle da interface
  const [noticeMessage, setNoticeMessage] = useState("");
  const [noticeType, setNoticeType] = useState("error");
  const [loading, setLoading] = useState(false);

  const mostrarAviso = (mensagem, tipo = "error") => {
    setNoticeMessage(mensagem);
    setNoticeType(tipo);
    setTimeout(() => setNoticeMessage(""), 6000);
  };

  /**
   * Máscara e autoidentificação em tempo real de CPF / CNPJ
   */
  const handleDocumentoChange = (e) => {
    const rawValue = e.target.value.replace(/\D/g, ""); // Apenas dígitos

    if (rawValue.length <= 11) {
      // Formatação de CPF: 000.000.000-00
      let formatted = rawValue;
      if (rawValue.length > 9) {
        formatted = rawValue.replace(/^(\d{3})(\d{3})(\d{3})(\d{1,2})$/, "$1.$2.$3-$4");
      } else if (rawValue.length > 6) {
        formatted = rawValue.replace(/^(\d{3})(\d{3})(\d{1,3})$/, "$1.$2.$3");
      } else if (rawValue.length > 3) {
        formatted = rawValue.replace(/^(\d{3})(\d{1,3})$/, "$1.$2");
      }
      setDocumento(formatted);
      setTipoUsuario("PF");
    } else {
      // Formatação de CNPJ: 00.000.000/0000-00 (máximo 14 dígitos)
      const cnpjDigits = rawValue.slice(0, 14);
      let formatted = cnpjDigits;
      if (cnpjDigits.length > 12) {
        formatted = cnpjDigits.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{1,2})$/, "$1.$2.$3/$4-$5");
      } else if (cnpjDigits.length > 8) {
        formatted = cnpjDigits.replace(/^(\d{2})(\d{3})(\d{3})(\d{1,4})$/, "$1.$2.$3/$4");
      } else if (cnpjDigits.length > 5) {
        formatted = cnpjDigits.replace(/^(\d{2})(\d{3})(\d{1,3})$/, "$1.$2.$3");
      } else if (cnpjDigits.length > 2) {
        formatted = cnpjDigits.replace(/^(\d{2})(\d{1,3})$/, "$1.$2");
      }
      setDocumento(formatted);
      setTipoUsuario("PJ");
    }
  };

  /**
   * Máscara para Telefone / WhatsApp: (00) 00000-0000 ou (00) 0000-0000
   */
  const handleTelefoneChange = (e) => {
    const rawValue = e.target.value.replace(/\D/g, "").slice(0, 11);
    let formatted = rawValue;
    if (rawValue.length > 10) {
      formatted = rawValue.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
    } else if (rawValue.length > 6) {
      formatted = rawValue.replace(/^(\d{2})(\d{4})(\d{0,4})$/, "($1) $2-$3");
    } else if (rawValue.length > 2) {
      formatted = rawValue.replace(/^(\d{2})(\d{0,5})$/, "($1) $2");
    }
    setTelefone(formatted);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // 1. Validação estrita de aceite dos termos
    if (!aceitouTermos) {
      mostrarAviso("É necessário que haja a aceitação dos Termos e Condições para fazer uso da plataforma", "error");
      return;
    }

    // 2. Validação de senhas
    if (senha.length < 6) {
      mostrarAviso("A senha deve ter no mínimo 6 caracteres.", "error");
      return;
    }

    if (senha !== confirmarSenha) {
      mostrarAviso("As senhas não coincidem. Confira os campos antes de continuar.", "error");
      return;
    }

    // 3. Validação do documento (CPF/CNPJ)
    const docLimpo = documento.replace(/\D/g, "");
    if (docLimpo.length !== 11 && docLimpo.length !== 14) {
      mostrarAviso("Informe um CPF válido (11 dígitos) ou CNPJ (14 dígitos).", "error");
      return;
    }

    setLoading(true);
    try {
      const dados = {
        nome: nome.trim(),
        email: email.trim().toLowerCase(),
        cpf: docLimpo, // Mantido para compatibilidade com a API
        tipo_usuario: tipoUsuario, // 'PF' ou 'PJ'
        tipo_conta: "artista", // Papel unificado de Artista
        telefone: telefone ? telefone.replace(/\D/g, "") : null,
        senha,
        termoAceito: true,
        versaoTermo: "v1.0",
      };

      await authService.cadastrar(dados);

      mostrarAviso("Cadastro realizado com sucesso! Enviamos um código de verificação para o seu e-mail.", "success");
      setTimeout(() => {
        navigate("/verificar-email", {
          state: {
            email,
            mensagem: "Conta criada com sucesso! Introduza o código de 6 dígitos enviado para o seu e-mail para ativá-la.",
          },
        });
      }, 1000);
    } catch (err) {
      // Tratamento humanizado de erros (eliminando "failed to fetch")
      let mensagemAmigavel = "Erro ao realizar cadastro.";

      if (err.message && typeof err.message === "string") {
        if (
          err.message.toLowerCase().includes("failed to fetch") ||
          err.message.toLowerCase().includes("networkerror") ||
          err.message.toLowerCase().includes("não foi possível conectar")
        ) {
          mensagemAmigavel =
            "Não foi possível conectar ao servidor backend (FastAPI na porta 8000). Certifique-se de que o backend esteja em execução para concluir o cadastro.";
        } else {
          mensagemAmigavel = err.message;
        }
      }

      mostrarAviso(mensagemAmigavel, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    if (!credentialResponse?.credential) return;
    setLoading(true);
    try {
      await loginGoogle(credentialResponse.credential);
      mostrarAviso("Cadastro/Login via Google realizado com sucesso! Redirecionando...", "success");
      setTimeout(() => {
        navigate("/feed", { replace: true });
      }, 800);
    } catch (err) {
      mostrarAviso(err.message || "Erro ao realizar cadastro com o Google.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F8F6] text-artDark font-sans antialiased overflow-x-hidden">
      <div className="fixed top-0 left-0 w-full h-full bg-[url('/noise.svg')] opacity-[0.04] pointer-events-none z-[99]"></div>

      <main className="min-h-screen grid grid-cols-1 lg:grid-cols-12">
        {/* Coluna Esquerda - Apresentação Artística com Filtro Roxo */}
        <section className="lg:col-span-4 bg-artPurple text-white p-8 lg:p-12 flex flex-col justify-between relative overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=1200&auto=format&fit=crop"
            alt="Arte de fundo"
            className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-80 scale-105 pointer-events-none"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/50 pointer-events-none"></div>

          <div className="relative z-10">
            <Link
              to="/"
              className="font-editorial text-4xl font-black text-white inline-block mb-10"
            >
              Artfolio
            </Link>

            <span className="text-white/80 font-bold tracking-widest uppercase text-[10px] mb-3 block">
              Comunidade Artística
            </span>

            <h1 className="font-editorial text-5xl lg:text-6xl leading-none">
              Crie sua conta de <span className="italic text-artOrange block">Artista.</span>
            </h1>

            <p className="text-sm text-white/80 mt-5 leading-relaxed max-w-sm font-light">
              Publique suas obras, monte seu portfólio profissional, interaja com apreciadores de arte e receba solicitações de encomendas em uma plataforma feita para valorizar o seu talento.
            </p>

            <div className="mt-8 flex items-center gap-4">
              <div className="w-9 h-9 rounded-2xl bg-artOrange/20 border border-artOrange/40 text-artOrange flex items-center justify-center text-xs font-bold">
                <i className="fa-solid fa-palette"></i>
              </div>
              <div>
                <p className="text-xs uppercase font-bold tracking-wider">CONTA DE ARTISTA - Dados principais</p>
                <p className="text-[11px] text-white/70">Pessoa Física (PF) ou Pessoa Jurídica (PJ)</p>
              </div>
            </div>
          </div>

          <i className="fa-solid fa-palette absolute -right-10 -bottom-10 text-[13rem] text-white/5 rotate-12 pointer-events-none"></i>
        </section>

        {/* Coluna Direita - Formulário de Cadastro */}
        <section className="lg:col-span-8 bg-white p-6 lg:p-12 flex items-center">
          <div className="w-full max-w-3xl mx-auto">
            <div className="mb-8">
              <span className="text-artOrange font-bold tracking-widest uppercase text-[10px] mb-2 block">
                Inscrição no Artfolio
              </span>

              <h2 className="font-editorial text-4xl lg:text-5xl leading-none">
                Comece sua trajetória criativa.
              </h2>

              <p className="text-sm text-gray-500 mt-3 max-w-xl leading-relaxed font-light">
                Preencha os dados básicos abaixo para criar sua conta. A foto de perfil, biografia e portfólio poderão ser configurados logo após o cadastro.
              </p>
            </div>

            {noticeMessage && (
              <div
                className={`rounded-[1.3rem] px-5 py-3.5 mb-6 text-xs font-bold leading-relaxed border flex items-start gap-2.5 ${
                  noticeType === "success"
                    ? "bg-green-50 text-green-700 border-green-200"
                    : "bg-red-50 text-red-600 border-red-200"
                }`}
              >
                <i className={`fa-solid ${noticeType === "success" ? "fa-circle-check" : "fa-triangle-exclamation"} mt-0.5`}></i>
                <span>{noticeMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Nome / Nick */}
              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                  Nome Artístico / Completo <span className="text-artOrange">*</span>
                </label>

                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Como você deseja ser identificado no Artfolio?"
                  className="w-full bg-[#F9F8F6] rounded-2xl px-5 py-4 outline-none focus:ring-2 ring-artOrange/20 text-sm"
                  required
                />
              </div>

              {/* CPF / CNPJ com Autoidentificação */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    CPF ou CNPJ <span className="text-artOrange">*</span>
                  </label>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    tipoUsuario === "PJ" ? "bg-artPurple/10 text-artPurple" : "bg-artOrange/10 text-artOrange"
                  }`}>
                    {tipoUsuario === "PJ" ? "Pessoa Jurídica (PJ)" : "Pessoa Física (PF)"}
                  </span>
                </div>

                <input
                  type="text"
                  value={documento}
                  onChange={handleDocumentoChange}
                  placeholder="000.000.000-00 ou CNPJ"
                  className="w-full bg-[#F9F8F6] rounded-2xl px-5 py-4 outline-none focus:ring-2 ring-artOrange/20 text-sm"
                  required
                />
              </div>

              {/* E-mail */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                  E-mail de Acesso <span className="text-artOrange">*</span>
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full bg-[#F9F8F6] rounded-2xl px-5 py-4 outline-none focus:ring-2 ring-artOrange/20 text-sm"
                  required
                />
              </div>

              {/* Telefone / WhatsApp (Opcional) */}
              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                  Telefone / WhatsApp <span className="text-gray-400 font-normal lowercase">(opcional)</span>
                </label>

                <input
                  type="text"
                  value={telefone}
                  onChange={handleTelefoneChange}
                  placeholder="(00) 00000-0000"
                  className="w-full bg-[#F9F8F6] rounded-2xl px-5 py-4 outline-none focus:ring-2 ring-artOrange/20 text-sm"
                />
              </div>

              {/* Senha */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                  Senha <span className="text-artOrange">*</span>
                </label>

                <input
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="Mínimo de 6 caracteres"
                  className="w-full bg-[#F9F8F6] rounded-2xl px-5 py-4 outline-none focus:ring-2 ring-artOrange/20 text-sm"
                  required
                />
              </div>

              {/* Confirmar Senha */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                  Confirmar Senha <span className="text-artOrange">*</span>
                </label>

                <input
                  type="password"
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  placeholder="Repita a senha"
                  className="w-full bg-[#F9F8F6] rounded-2xl px-5 py-4 outline-none focus:ring-2 ring-artOrange/20 text-sm"
                  required
                />
              </div>

              {/* Aceite dos Termos (Obrigatório e abrindo em nova aba) */}
              <div className="md:col-span-2 flex items-start gap-3 text-sm text-gray-600 pt-2">
                <input
                  id="termos-checkbox"
                  type="checkbox"
                  checked={aceitouTermos}
                  onChange={(e) => setAceitouTermos(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded accent-artOrange cursor-pointer"
                  required
                />

                <label htmlFor="termos-checkbox" className="cursor-pointer leading-relaxed">
                  Declaro que li e concordo com os{" "}
                  <Link
                    to="/termos"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-artDark font-bold underline hover:text-artOrange transition-colors"
                  >
                    Termos de Uso
                  </Link>{" "}
                  e a{" "}
                  <Link
                    to="/termos"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-artDark font-bold underline hover:text-artOrange transition-colors"
                  >
                    Política de Privacidade
                  </Link>
                  . <span className="text-artOrange">*</span>
                </label>
              </div>

              {/* Botão de Envio */}
              <div className="md:col-span-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-black/5">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-artDark text-white px-8 py-4 rounded-full text-sm font-bold hover:bg-artOrange transition-all shadow-xl shadow-black/10 active:scale-95 text-center disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <i className="fa-solid fa-spinner fa-spin"></i> Criando conta...
                    </>
                  ) : (
                    <>
                      Concluir Cadastro de Artista <i className="fa-solid fa-arrow-right ml-1"></i>
                    </>
                  )}
                </button>

                <p className="text-sm text-gray-500">
                  Já possui conta?{" "}
                  <Link
                    to="/login"
                    className="font-bold text-artPurple hover:underline"
                  >
                    Fazer login
                  </Link>
                </p>
              </div>
            </form>

            {/* Divisor Visual para Cadastro Social */}
            <div className="relative flex py-3 items-center my-4">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="flex-shrink mx-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                ou continue com
              </span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            {/* Linha com Botão Oficial do Google e Voltar para início lado a lado */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
              <Link
                to="/"
                className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-artOrange transition-colors flex items-center gap-2"
              >
                <i className="fa-solid fa-arrow-left"></i>
                Voltar para início
              </Link>

              <div className="flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => mostrarAviso("Falha no cadastro/login com o Google.", "error")}
                  theme="outline"
                  shape="pill"
                  text="continue_with"
                  locale="pt-BR"
                />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}