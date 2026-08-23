// Catálogo centralizado de macro-setores e categorias de artes do Artfolio
export const SETORES_ARTISTICOS = [
  {
    id: "todas",
    nome: "Todas as Categorias",
    icone: "fa-solid fa-shapes",
    corBg: "bg-artDark text-white",
    corTag: "bg-artDark/10 text-artDark border-artDark/20",
    subcategorias: [],
  },
  {
    id: "visuais",
    nome: "Artes Visuais e Plásticas",
    icone: "fa-solid fa-palette",
    corBg: "bg-amber-600 text-white",
    corTag: "bg-amber-50 text-amber-800 border-amber-200",
    subcategorias: [
      "Pintura",
      "Desenho",
      "Ilustração Tradicional",
      "Ilustração Infantil",
      "Escultura",
      "Gravura",
      "Quadrinhos HQ",
    ],
  },
  {
    id: "digitais",
    nome: "Artes Digitais e Tecnológicas",
    icone: "fa-solid fa-cube",
    corBg: "bg-purple-600 text-white",
    corTag: "bg-purple-50 text-purple-800 border-purple-200",
    subcategorias: [
      "Ilustração Digital",
      "Modelagem 3D",
      "Animação 2D",
      "Animação 3D",
      "Pixel Art",
      "Escultura Digital",
      "Voxel Art",
    ],
  },
  {
    id: "texteis",
    nome: "Artes Têxteis e Manuais",
    icone: "fa-solid fa-rug",
    corBg: "bg-emerald-600 text-white",
    corTag: "bg-emerald-50 text-emerald-800 border-emerald-200",
    subcategorias: [
      "Artesanato",
      "Costura",
      "Crochê",
      "Amigurumi",
      "Tricô",
      "Tapeçaria",
      "Macramê",
      "Feltragem",
      "Tecelagem",
      "Bordado",
    ],
  },
  {
    id: "literarias",
    nome: "Artes Literárias",
    icone: "fa-solid fa-feather-pointed",
    corBg: "bg-artOrange text-white",
    corTag: "bg-orange-50 text-orange-800 border-orange-200",
    subcategorias: [
      "Escritura",
      "Poesia",
      "Romance",
      "Conto",
      "Crônica",
      "Roteirização",
      "Dramaturgia",
    ],
  },
  {
    id: "audiovisuais",
    nome: "Artes Audiovisuais",
    icone: "fa-solid fa-film",
    corBg: "bg-blue-600 text-white",
    corTag: "bg-blue-50 text-blue-800 border-blue-200",
    subcategorias: [
      "Cinema",
      "Fotografia",
      "Videoarte",
      "Edição de Vídeo",
      "Direção de Arte",
    ],
  },
  {
    id: "cenicas",
    nome: "Artes Cênicas",
    icone: "fa-solid fa-masks-theater",
    corBg: "bg-rose-600 text-white",
    corTag: "bg-rose-50 text-rose-800 border-rose-200",
    subcategorias: [
      "Teatro",
      "Dança",
      "Ópera",
      "Circo",
      "Performance",
      "Mímica",
    ],
  },
  {
    id: "musicais",
    nome: "Artes Musicais",
    icone: "fa-solid fa-music",
    corBg: "bg-indigo-600 text-white",
    corTag: "bg-indigo-50 text-indigo-800 border-indigo-200",
    subcategorias: [
      "Composição",
      "Canto",
      "Instrumentação",
      "Produção Musical",
      "Sonoplastia",
    ],
  },
  {
    id: "espaciais",
    nome: "Artes Espaciais & Arquitetura",
    icone: "fa-solid fa-compass-drafting",
    corBg: "bg-teal-600 text-white",
    corTag: "bg-teal-50 text-teal-800 border-teal-200",
    subcategorias: [
      "Arquitetura",
      "Desenho Técnico de Plantas Baixas",
      "Maquetaria",
      "Urbanismo",
      "Design de Interiores",
      "Paisagismo",
      "Jardinagem Artística",
    ],
  },
  {
    id: "corporais",
    nome: "Artes Corporais",
    icone: "fa-solid fa-spray-can-sparkles",
    corBg: "bg-fuchsia-600 text-white",
    corTag: "bg-fuchsia-50 text-fuchsia-800 border-fuchsia-200",
    subcategorias: [
      "Modificação",
      "Tatuagem",
      "Micropigmentação Artística",
      "Body Painting",
      "Pintura Corporal",
      "Maquiagem Artística FX",
    ],
  },
  {
    id: "design",
    nome: "Design & Utilidades",
    icone: "fa-solid fa-bezier-curve",
    corBg: "bg-cyan-700 text-white",
    corTag: "bg-cyan-50 text-cyan-800 border-cyan-200",
    subcategorias: [
      "Design Gráfico",
      "Web Design",
      "Design de Moda",
      "Joalheria",
      "Cerâmica",
      "Marcenaria",
    ],
  },
];

// Lista completa plana de todas as categorias para busca/pílulas rápidas
export const TODAS_AS_CATEGORIAS = [
  "Tudo",
  ...SETORES_ARTISTICOS.flatMap((setor) => setor.subcategorias),
];

// Função helper para encontrar o estilo/cor de um setor ou categoria
export const getEstiloCategoria = (nomeCat) => {
  if (!nomeCat || nomeCat === "Tudo" || nomeCat === "Todas as Categorias") {
    return {
      corBg: "bg-artDark text-white",
      corTag: "bg-artDark/10 text-artDark border-artDark/20",
      icone: "fa-solid fa-shapes",
    };
  }

  const termoLower = nomeCat.toLowerCase();
  for (const setor of SETORES_ARTISTICOS) {
    if (
      setor.nome.toLowerCase() === termoLower ||
      setor.subcategorias.some((s) => s.toLowerCase() === termoLower)
    ) {
      return {
        corBg: setor.corBg,
        corTag: setor.corTag,
        icone: setor.icone,
      };
    }
  }

  return {
    corBg: "bg-artPurple text-white",
    corTag: "bg-artPurple/10 text-artPurple border-artPurple/20",
    icone: "fa-solid fa-palette",
  };
};
