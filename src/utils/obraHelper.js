/**
 * Utilitário para manipulação e estruturação consistente de Obras no Artfolio.
 * Garante separação estrita de título, legenda/descrição, preço base,
 * marca d'água e flags de proteção (download e printscreen).
 */

const DELIMITADOR_META = "\n---ARTFOLIO_META---\n";

/**
 * Codifica metadados adicionais na legenda caso o backend não tenha colunas dedicadas.
 */
export function empacotarDadosObra({
  titulo = "",
  descricao = "",
  precoBase = null,
  marcaDagua = false,
  bloquearDownload = false,
  bloquearPrint = false,
  reduzirQualidade = false,
  exibirPaleta = true,
  modoPaleta = "auto",
  coresCustomizadas = null,
}) {
  const meta = {
    titulo: (titulo || "").trim(),
    descricao: (descricao || "").trim(),
    precoBase: precoBase ? String(precoBase).trim() : null,
    marcaDagua: Boolean(marcaDagua),
    bloquearDownload: Boolean(bloquearDownload),
    bloquearPrint: Boolean(bloquearPrint),
    reduzirQualidade: Boolean(reduzirQualidade),
    exibirPaleta: Boolean(exibirPaleta !== false),
    modoPaleta: modoPaleta || "auto",
    coresCustomizadas: Array.isArray(coresCustomizadas) ? coresCustomizadas : null,
  };

  // Monta uma legenda legível para compatibilidade com versões antigas
  let textoLegivel = (titulo || "").trim();
  if ((descricao || "").trim()) {
    textoLegivel = textoLegivel ? `${textoLegivel}\n\n${descricao.trim()}` : descricao.trim();
  }

  // Anexa metadados em JSON de forma estruturada
  const legendaFinal = `${textoLegivel}${DELIMITADOR_META}${JSON.stringify(meta)}`;

  return {
    legenda: legendaFinal,
    meta,
  };
}

/**
 * Desempacota os dados de uma obra a partir do objeto retornado pela API ou cache.
 */
export function desempacotarDadosObra(obra) {
  if (!obra) {
    return {
      titulo: "",
      descricao: "",
      precoBase: null,
      marcaDagua: false,
      bloquearDownload: false,
      bloquearPrint: false,
      reduzirQualidade: false,
      exibirPaleta: true,
      modoPaleta: "auto",
      coresCustomizadas: null,
    };
  }

  // Se uma string foi passada diretamente
  const obj = typeof obra === "string" ? { legenda: obra } : obra;

  let textoLegenda = obj.legenda || obj.descricao || "";
  let parteMeta = null;

  // 1. Tentar extrair do bloco de metadados se existir
  if (typeof textoLegenda === "string" && textoLegenda.includes(DELIMITADOR_META)) {
    const partes = textoLegenda.split(DELIMITADOR_META);
    textoLegenda = partes[0].trim();
    parteMeta = partes[1]?.trim();
    if (parteMeta) {
      try {
        const metaParsed = JSON.parse(parteMeta);
        return {
          titulo: metaParsed.titulo || obj.titulo || textoLegenda.split("\n\n")[0]?.trim() || `Obra #${obj.id || ""}`,
          descricao: metaParsed.descricao !== undefined ? metaParsed.descricao : textoLegenda.split("\n\n").slice(1).join("\n\n").trim(),
          precoBase: metaParsed.precoBase || obj.preco_base || obj.precoBase || null,
          marcaDagua: Boolean(metaParsed.marcaDagua ?? obj.marca_dagua ?? obj.marcaDagua),
          bloquearDownload: Boolean(metaParsed.bloquearDownload ?? obj.bloquear_download ?? obj.bloquearDownload),
          bloquearPrint: Boolean(metaParsed.bloquearPrint ?? obj.bloquear_print ?? obj.bloquearPrint),
          reduzirQualidade: Boolean(metaParsed.reduzirQualidade ?? obj.reduzir_qualidade ?? obj.reduzirQualidade),
          exibirPaleta: metaParsed.exibirPaleta !== undefined ? Boolean(metaParsed.exibirPaleta) : true,
          modoPaleta: metaParsed.modoPaleta || "auto",
          coresCustomizadas: Array.isArray(metaParsed.coresCustomizadas) ? metaParsed.coresCustomizadas : null,
        };
      } catch {
        // Fallback para extração manual
      }
    }
  }

  // 2. Se a obra já tiver campos separados ou legenda simples
  let tituloExtraido = obj.titulo || "";
  let descricaoExtraida = obj.descricao || "";

  if (typeof tituloExtraido === "string" && tituloExtraido.includes(DELIMITADOR_META)) {
    tituloExtraido = tituloExtraido.split(DELIMITADOR_META)[0].trim();
  }

  if (!tituloExtraido && textoLegenda) {
    if (textoLegenda.includes("\n\n")) {
      const partes = textoLegenda.split(/\n\n+/);
      tituloExtraido = partes[0].trim();
      descricaoExtraida = partes.slice(1).join("\n\n").trim();
    } else {
      tituloExtraido = textoLegenda.trim();
      descricaoExtraida = "";
    }
  }

  return {
    titulo: tituloExtraido || `Obra #${obj.id || ""}`,
    descricao: descricaoExtraida,
    precoBase: obj.preco_base || obj.precoBase || null,
    marcaDagua: Boolean(obj.marca_dagua ?? obj.marcaDagua),
    bloquearDownload: Boolean(obj.bloquear_download ?? obj.bloquearDownload),
    bloquearPrint: Boolean(obj.bloquear_print ?? obj.bloquearPrint),
    reduzirQualidade: Boolean(obj.reduzir_qualidade ?? obj.reduzirQualidade),
    exibirPaleta: true,
    modoPaleta: "auto",
    coresCustomizadas: null,
  };
}

/**
 * Formata valor de preço em Real brasileiro (R$).
 */
export function formatarPrecoBR(valor) {
  if (!valor) return null;
  const numLimpo = String(valor).replace(/[^\d.,]/g, "").replace(",", ".");
  const num = parseFloat(numLimpo);
  if (isNaN(num) || num <= 0) return null;
  return num.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

/**
 * Gera estilo dinâmico de iluminação LED neon para o avatar.
 */
export function getAvatarLedStyle(usuario, isProprioPerfil = false) {
  if (!usuario) return { className: "", style: {}, ativo: false, cor: "" };

  const mostrarLed =
    usuario.mostrar_moldura_led !== false &&
    usuario.mostrarMolduraLed !== false &&
    (isProprioPerfil ? localStorage.getItem("artfolio_mostrar_moldura_led") !== "false" : true);

  if (!mostrarLed) return { className: "", style: {}, ativo: false, cor: "" };

  const plano = (
    (typeof usuario.plano === "string" ? usuario.plano : usuario.plano?.tipo) ||
    usuario.tipo_plano ||
    usuario.plano_ativo?.tipo ||
    usuario.plano_nome ||
    "free"
  ).toLowerCase();

  // Cor HEX personalizada para Boost
  const localSavedColor = localStorage.getItem("artfolio_boost_led_color");
  const corHexCustom =
    usuario.cor_led_hex ||
    usuario.corLed ||
    usuario.cor_led ||
    usuario.corLedHex ||
    usuario.led_color ||
    (isProprioPerfil ? localSavedColor : null) ||
    localSavedColor;

  if (plano === "boost") {
    const cor = (corHexCustom && /^#([0-9A-F]{3}){1,2}$/i.test(corHexCustom)) ? corHexCustom : "#FF793F";
    return {
      ativo: true,
      cor: cor,
      className: "ring-4",
      style: {
        borderColor: cor,
        boxShadow: `0 0 20px ${cor}, 0 0 45px ${cor}BB, 0 0 65px ${cor}55`,
        "--tw-ring-color": cor,
      },
    };
  }

  if (plano === "pro") {
    return {
      ativo: true,
      cor: "#6C5CE7",
      className: "ring-4 ring-[#6C5CE7] shadow-[0_0_20px_#6C5CE7,0_0_40px_rgba(108,92,231,0.7),0_0_60px_rgba(108,92,231,0.35)]",
      style: {},
    };
  }

  return {
    ativo: true,
    cor: "#00B894",
    className: "ring-4 ring-[#00B894] shadow-[0_0_18px_#00B894,0_0_36px_rgba(0,184,148,0.7),0_0_55px_rgba(0,184,148,0.35)]",
    style: {},
  };
}
