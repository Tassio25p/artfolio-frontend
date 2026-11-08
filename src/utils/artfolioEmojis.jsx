import React from "react";

/**
 * Definição dos Emojis Oficiais e Exclusivos do Artfolio
 * Baseados na paleta do site: Roxo (#6C5CE7), Laranja (#FF793F), Azul (#0984E3), Ciano (#00CEC9), Fogo e Diamante.
 */
export const ARTFOLIO_CUSTOM_EMOJIS = [
  // --- Expressões Roxas Artfolio ---
  {
    code: ":art_laugh:",
    name: "Risada Artfolio",
    category: "Rostos Artfolio",
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xs" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="46" fill="#6C5CE7" />
        {/* Olhos Arqueados Fechados */}
        <path d="M28 42 C33 34, 41 34, 46 42" stroke="#1E1346" strokeWidth="6" strokeLinecap="round" />
        <path d="M54 42 C59 34, 67 34, 72 42" stroke="#1E1346" strokeWidth="6" strokeLinecap="round" />
        {/* Boca Aberta Rindo */}
        <path d="M28 54 Q50 84 72 54 Z" fill="#1E1346" />
        <path d="M36 62 Q50 78 64 62 Q50 72 36 62 Z" fill="#FF793F" />
      </svg>
    ),
  },
  {
    code: ":art_cry_laugh:",
    name: "Chorando de Rir",
    category: "Rostos Artfolio",
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xs" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="46" fill="#6C5CE7" />
        <path d="M28 42 C33 34, 41 34, 46 42" stroke="#1E1346" strokeWidth="6" strokeLinecap="round" />
        <path d="M54 42 C59 34, 67 34, 72 42" stroke="#1E1346" strokeWidth="6" strokeLinecap="round" />
        <path d="M28 54 Q50 84 72 54 Z" fill="#1E1346" />
        <path d="M36 62 Q50 78 64 62 Q50 72 36 62 Z" fill="#FF793F" />
        {/* Lágrimas Azuis Ciano */}
        <path d="M16 46 Q24 46 22 56 Q16 58 16 46 Z" fill="#00CEC9" />
        <path d="M84 46 Q76 46 78 56 Q84 58 84 46 Z" fill="#00CEC9" />
      </svg>
    ),
  },
  {
    code: ":art_cool:",
    name: "Estiloso / Óculos",
    category: "Rostos Artfolio",
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xs" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="46" fill="#6C5CE7" />
        {/* Óculos de Sol */}
        <path d="M20 36 L80 36 L76 52 C74 58, 56 58, 54 52 L50 48 L46 52 C44 58, 26 58, 24 52 Z" fill="#18181B" />
        <line x1="28" y1="40" x2="44" y2="40" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
        <line x1="56" y1="40" x2="72" y2="40" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
        {/* Sorriso Confiante */}
        <path d="M35 62 Q50 78 65 62" stroke="#1E1346" strokeWidth="6" strokeLinecap="round" fill="none" />
        <path d="M38 64 Q50 76 62 64 Z" fill="#FF793F" />
      </svg>
    ),
  },
  {
    code: ":art_kiss:",
    name: "Beijo Artístico",
    category: "Rostos Artfolio",
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xs" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="46" fill="#6C5CE7" />
        {/* Olho Piscando */}
        <path d="M26 38 L36 44 L26 50" stroke="#1E1346" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="68" cy="44" r="5" fill="#1E1346" />
        {/* Boca de Beijo */}
        <path d="M44 64 Q48 58 54 64 Q48 70 44 64 Z" fill="#1E1346" />
        {/* Mini Coração Laranja Saindo */}
        <path d="M78 56 C74 50, 68 54, 72 60 L78 66 L84 60 C88 54, 82 50, 78 56 Z" fill="#FF793F" />
      </svg>
    ),
  },
  {
    code: ":art_heart_eyes:",
    name: "Olhos de Coração Ciano",
    category: "Rostos Artfolio",
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xs" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="46" fill="#6C5CE7" />
        {/* Corações nos Olhos */}
        <path d="M34 34 C26 26, 18 36, 26 44 L34 52 L42 44 C50 36, 42 26, 34 34 Z" fill="#00CEC9" />
        <path d="M66 34 C58 26, 50 36, 58 44 L66 52 L74 44 C82 36, 74 26, 66 34 Z" fill="#00CEC9" />
        {/* Boca Aberta de Encanto */}
        <path d="M32 58 Q50 86 68 58 Z" fill="#1E1346" />
        <path d="M38 66 Q50 82 62 66 Z" fill="#FF793F" />
      </svg>
    ),
  },
  {
    code: ":art_wink:",
    name: "Piscadela Artfolio",
    category: "Rostos Artfolio",
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xs" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="46" fill="#6C5CE7" />
        {/* Olho Esquerdo Aberto */}
        <circle cx="34" cy="42" r="5" fill="#1E1346" />
        {/* Olho Direito Piscando */}
        <path d="M56 42 Q66 34 76 42" stroke="#1E1346" strokeWidth="6" strokeLinecap="round" />
        {/* Sorriso Aberto */}
        <path d="M30 56 Q50 84 70 56 Z" fill="#1E1346" />
        <path d="M38 64 Q50 78 62 64 Z" fill="#FF793F" />
      </svg>
    ),
  },
  {
    code: ":art_smile:",
    name: "Sorriso Alegre",
    category: "Rostos Artfolio",
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xs" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="46" fill="#6C5CE7" />
        <path d="M28 42 C33 36, 41 36, 46 42" stroke="#1E1346" strokeWidth="5.5" strokeLinecap="round" />
        <path d="M54 42 C59 36, 67 36, 72 42" stroke="#1E1346" strokeWidth="5.5" strokeLinecap="round" />
        {/* Sorriso com Dentes */}
        <path d="M30 58 Q50 80 70 58 Z" fill="#1E1346" />
        <path d="M34 58 Q50 68 66 58" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    code: ":art_grin:",
    name: "Felicidade Pura",
    category: "Rostos Artfolio",
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xs" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="46" fill="#6C5CE7" />
        <path d="M26 40 C32 32, 40 32, 46 40" stroke="#1E1346" strokeWidth="6" strokeLinecap="round" />
        <path d="M54 40 C60 32, 68 32, 74 40" stroke="#1E1346" strokeWidth="6" strokeLinecap="round" />
        <path d="M26 56 Q50 88 74 56 Z" fill="#1E1346" />
        <path d="M34 66 Q50 82 66 66 Z" fill="#FF793F" />
      </svg>
    ),
  },

  // --- Corações Temáticos Artfolio ---
  {
    code: ":art_heart_purple:",
    name: "Coração Roxo",
    category: "Corações Artfolio",
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xs" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M50 88 C15 65, 0 40, 16 18 C32 -2, 50 14, 50 20 C50 14, 68 -2, 84 18 C100 40, 85 65, 50 88 Z" fill="#6C5CE7" />
        {/* Brilho Superior */}
        <path d="M26 22 C34 14, 44 20, 42 28 C34 26, 26 30, 24 38 C20 30, 20 26, 26 22 Z" fill="#FFFFFF" opacity="0.4" />
      </svg>
    ),
  },
  {
    code: ":art_heart_orange:",
    name: "Coração Laranja",
    category: "Corações Artfolio",
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xs" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M50 88 C15 65, 0 40, 16 18 C32 -2, 50 14, 50 20 C50 14, 68 -2, 84 18 C100 40, 85 65, 50 88 Z" fill="#FF793F" />
        <path d="M26 22 C34 14, 44 20, 42 28 C34 26, 26 30, 24 38 C20 30, 20 26, 26 22 Z" fill="#FFFFFF" opacity="0.4" />
      </svg>
    ),
  },
  {
    code: ":art_heart_blue:",
    name: "Coração Azul",
    category: "Corações Artfolio",
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xs" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M50 88 C15 65, 0 40, 16 18 C32 -2, 50 14, 50 20 C50 14, 68 -2, 84 18 C100 40, 85 65, 50 88 Z" fill="#0984E3" />
        <path d="M26 22 C34 14, 44 20, 42 28 C34 26, 26 30, 24 38 C20 30, 20 26, 26 22 Z" fill="#FFFFFF" opacity="0.4" />
      </svg>
    ),
  },
  {
    code: ":art_heart_cyan:",
    name: "Coração Ciano",
    category: "Corações Artfolio",
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xs" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M50 88 C15 65, 0 40, 16 18 C32 -2, 50 14, 50 20 C50 14, 68 -2, 84 18 C100 40, 85 65, 50 88 Z" fill="#00CEC9" />
        <path d="M26 22 C34 14, 44 20, 42 28 C34 26, 26 30, 24 38 C20 30, 20 26, 26 22 Z" fill="#FFFFFF" opacity="0.4" />
      </svg>
    ),
  },

  // --- Corações com Brilho / Estrelas ---
  {
    code: ":art_sparkle_purple:",
    name: "Coração Roxo com Brilho",
    category: "Corações Artfolio",
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xs" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M50 88 C15 65, 0 40, 16 18 C32 -2, 50 14, 50 20 C50 14, 68 -2, 84 18 C100 40, 85 65, 50 88 Z" fill="#6C5CE7" />
        {/* Estrelas de 4 Pontas */}
        <path d="M34 36 Q38 36 38 32 Q38 36 42 36 Q38 36 38 40 Q38 36 34 36 Z" fill="#FFFFFF" />
        <path d="M66 48 Q70 48 70 44 Q70 48 74 48 Q70 48 70 52 Q70 48 66 48 Z" fill="#FFFFFF" />
      </svg>
    ),
  },
  {
    code: ":art_sparkle_orange:",
    name: "Coração Laranja com Brilho",
    category: "Corações Artfolio",
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xs" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M50 88 C15 65, 0 40, 16 18 C32 -2, 50 14, 50 20 C50 14, 68 -2, 84 18 C100 40, 85 65, 50 88 Z" fill="#FF793F" />
        <path d="M34 36 Q38 36 38 32 Q38 36 42 36 Q38 36 38 40 Q38 36 34 36 Z" fill="#FFFFFF" />
        <path d="M66 48 Q70 48 70 44 Q70 48 74 48 Q70 48 70 52 Q70 48 66 48 Z" fill="#FFFFFF" />
      </svg>
    ),
  },
  {
    code: ":art_sparkle_blue:",
    name: "Coração Azul com Brilho",
    category: "Corações Artfolio",
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xs" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M50 88 C15 65, 0 40, 16 18 C32 -2, 50 14, 50 20 C50 14, 68 -2, 84 18 C100 40, 85 65, 50 88 Z" fill="#0984E3" />
        <path d="M34 36 Q38 36 38 32 Q38 36 42 36 Q38 36 38 40 Q38 36 34 36 Z" fill="#FFFFFF" />
        <path d="M66 48 Q70 48 70 44 Q70 48 74 48 Q70 48 70 52 Q70 48 66 48 Z" fill="#FFFFFF" />
      </svg>
    ),
  },
  {
    code: ":art_sparkle_cyan:",
    name: "Coração Ciano com Brilho",
    category: "Corações Artfolio",
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xs" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M50 88 C15 65, 0 40, 16 18 C32 -2, 50 14, 50 20 C50 14, 68 -2, 84 18 C100 40, 85 65, 50 88 Z" fill="#00CEC9" />
        <path d="M34 36 Q38 36 38 32 Q38 36 42 36 Q38 36 38 40 Q38 36 34 36 Z" fill="#FFFFFF" />
        <path d="M66 48 Q70 48 70 44 Q70 48 74 48 Q70 48 70 52 Q70 48 66 48 Z" fill="#FFFFFF" />
      </svg>
    ),
  },

  // --- Elementos de Fogo & Diamante ---
  {
    code: ":art_fire:",
    name: "Fogo Artfolio",
    category: "Símbolos Artfolio",
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xs" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M50 8 C52 24, 72 32, 78 52 C84 72, 72 92, 50 92 C28 92, 16 72, 22 52 C26 38, 40 28, 38 18 C48 24, 48 38, 56 38 C60 38, 64 32, 60 26 C56 20, 52 14, 50 8 Z"
          fill="#FF793F"
        />
        {/* Chama Interna Amarela */}
        <path
          d="M50 44 C52 54, 62 60, 64 70 C66 80, 60 88, 50 88 C40 88, 34 80, 36 70 C38 62, 46 56, 44 50 C48 54, 50 60, 54 60 C56 60, 58 56, 56 52 C54 48, 52 46, 50 44 Z"
          fill="#FEEAA7"
        />
      </svg>
    ),
  },
  {
    code: ":art_diamond:",
    name: "Diamante Roxo",
    category: "Símbolos Artfolio",
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xs" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Facetas do Diamante */}
        <path d="M26 34 L74 34 L90 54 L50 92 L10 54 Z" fill="#6C5CE7" />
        <path d="M26 34 L38 54 L50 92 L26 34 Z" fill="#50409A" />
        <path d="M74 34 L62 54 L50 92 L74 34 Z" fill="#50409A" />
        <path d="M38 54 L62 54 L50 92 Z" fill="#3B2C85" />
        <path d="M38 54 L50 34 L62 54 Z" fill="#8075E8" />
        <path d="M26 34 L50 34 L38 54 Z" fill="#A29BFE" />
        <path d="M74 34 L50 34 L62 54 Z" fill="#A29BFE" />
        {/* Brilho / Estrela */}
        <path d="M68 28 Q74 28 74 22 Q74 28 80 28 Q74 28 74 34 Q74 28 68 28 Z" fill="#FFFFFF" />
      </svg>
    ),
  },

  // --- Mascote & Ferramentas Artísticas Artfolio ---
  {
    code: ":art_chameleon:",
    name: "Camaleão Artfolio",
    category: "Mascote & Arte",
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xs" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="46" fill="#18181B" />
        {/* Camaleão em degradê */}
        <path
          d="M30 65 C20 60, 20 40, 35 30 C50 20, 75 25, 80 45 C85 60, 70 75, 55 75 C45 75, 42 68, 48 65 C54 62, 58 65, 56 68"
          stroke="#FF793F"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <circle cx="62" cy="38" r="7" fill="#00CEC9" />
        <circle cx="64" cy="38" r="3" fill="#1E1346" />
        <path d="M42 28 Q48 24 54 27 Q60 24 66 28" stroke="#6C5CE7" strokeWidth="4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    code: ":art_palette:",
    name: "Paleta de Cores",
    category: "Mascote & Arte",
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xs" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M50 14 C25 14, 10 32, 10 54 C10 76, 28 88, 46 88 C54 88, 60 82, 60 74 C60 70, 58 66, 62 62 C66 58, 70 60, 76 60 C86 60, 90 52, 90 44 C90 26, 72 14, 50 14 Z"
          fill="#D4A373"
        />
        {/* Tintas */}
        <circle cx="30" cy="34" r="6" fill="#FF793F" />
        <circle cx="48" cy="26" r="6" fill="#6C5CE7" />
        <circle cx="68" cy="34" r="6" fill="#00CEC9" />
        <circle cx="76" cy="48" r="6" fill="#E11D48" />
        <circle cx="34" cy="68" r="7" fill="#18181B" opacity="0.4" />
      </svg>
    ),
  },
  {
    code: ":art_brush:",
    name: "Pincel Mágico",
    category: "Mascote & Arte",
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xs" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="36" y="50" width="12" height="42" rx="3" transform="rotate(-45 36 50)" fill="#71717A" />
        <rect x="42" y="44" width="12" height="12" rx="1" transform="rotate(-45 42 44)" fill="#D4D4D8" />
        <path d="M54 32 C58 24, 70 16, 78 12 C76 22, 68 34, 60 38 Z" fill="#6C5CE7" />
        <path d="M72 16 Q84 10 82 22 Q76 28 72 16 Z" fill="#FF793F" />
      </svg>
    ),
  },
  {
    code: ":art_star:",
    name: "Estrela Dourada",
    category: "Mascote & Arte",
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xs" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M50 8 L62 36 L92 40 L70 60 L76 90 L50 74 L24 90 L30 60 L8 40 L38 36 Z"
          fill="#F39C12"
          stroke="#F1C40F"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <circle cx="50" cy="50" r="10" fill="#FFFFFF" opacity="0.4" />
      </svg>
    ),
  },
];

/**
 * Mapa de Busca Rápida de Emojis Artfolio por Código (:art_xxx:)
 */
export const ARTFOLIO_EMOJI_MAP = ARTFOLIO_CUSTOM_EMOJIS.reduce((acc, emoji) => {
  acc[emoji.code] = emoji;
  return acc;
}, {});

/**
 * Categorias dos Emojis Padrão do Computador (Unicode)
 */
export const UNICODE_EMOJIS = [
  {
    categoria: "Expressões & Carinhas",
    icone: "fa-face-smile",
    emojis: [
      "😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "🥹", "😊", "😇", "🙂", "🙃", "😉", "😌", "😍",
      "🥰", "😘", "😗", "😙", "😚", "😋", "😛", "😜", "🤪", "😝", "🤑", "🤗", "🤭", "🤫", "🤔", "🫡",
      "🤐", "🤨", "😐", "😑", "😶", "🫥", "😏", "😒", "🙄", "😬", "😮‍💨", "🤥", "🫨", "🙂‍↔️", "🙂‍↕️", "😌",
      "😔", "😪", "🤤", "😴", "😷", "🤒", "🤕", "🤢", "🤮", "🤧", "🥵", "🥶", "🥴", "😵", "😵‍💫", "🤯",
      "🤠", "🥳", "🥸", "😎", "🤓", "🧐", "😕", "🫤", "😟", "🙁", "😮", "😯", "😲", "😳", "🥺", "🥹",
      "😦", "😧", "😨", "😰", "😥", "😢", "😭", "😱", "😖", "😣", "😞", "😓", "😩", "😫", "🥱", "😤",
    ],
  },
  {
    categoria: "Gestos & Pessoas",
    icone: "fa-hand",
    emojis: [
      "👋", "🤚", "🖐️", "✋", "🖖", "🫱", "🫲", "🫳", "🫴", "👌", "🤌", "🤏", "✌️", "🤞", "🫰", "🤟",
      "🤘", "🤙", "👈", "👉", "👆", "🖕", "👇", "☝️", "👍", "👎", "✊", "👊", "🤛", "🤜", "👏", "🙌",
      "🫶", "👐", "🤲", "🤝", "🙏", "✍️", "💅", "🤳", "💪", "🦾", "🦿", "🦵", "🦶", "👂", "🦻", "👃",
      "🧠", "🫀", "🫁", "🦷", "🦴", "👀", "👁️", "👅", "👄", "🫦", "👶", "🧒", "👦", "👧", "🧑", "👨",
    ],
  },
  {
    categoria: "Arte, Criatividade & Lazer",
    icone: "fa-palette",
    emojis: [
      "🎨", "🖌️", "🖍️", "🖊️", "🖋️", "✒️", "✏️", "📝", "🎭", "🖼️", "📷", "📸", "📹", "🎬", "📽️", "🎞️",
      "🎼", "🎵", "🎶", "🎙️", "🎤", "🎧", "📻", "🎷", "🪗", "🎸", "🎹", "🎺", "🎻", "🪕", "🥁", "🪘",
      "🎪", "🎡", "🎢", "🎯", "🎮", "🕹️", "🎲", "🧩", "♟️", "🏆", "🥇", "🥈", "🥉", "🏅", "🎖️", "🎫",
    ],
  },
  {
    categoria: "Corações & Símbolos",
    icone: "fa-heart",
    emojis: [
      "❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔", "❤️‍🔥", "❤️‍🩹", "❣️", "💕", "💞", "💓",
      "💗", "💖", "💘", "💝", "💟", "✨", "⭐", "🌟", "💫", "🔥", "💥", "💯", "💢", "💬", "💭", "🗯️",
      "⚡", "💡", "🔮", "🧿", "💎", "👑", "🪄", "🚀", "🪐", "☀️", "🌙", "🌈", "☁️", "🌊", "🎉", "🎊",
    ],
  },
  {
    categoria: "Animais & Natureza",
    icone: "fa-leaf",
    emojis: [
      "🦎", "🐱", "🐶", "🦊", "🦁", "🐯", "🐨", "🐼", "🐻", "🐰", "🐭", "🐹", "🐸", "🐢", "🐍", "🐙",
      "🦋", "🐝", "🐞", "🌸", "💮", "🪷", "🌺", "🌻", "🌼", "🌷", "🌱", "🪴", "🌲", "🌳", "🌴", "🍀",
      "🍁", "🍂", "🍃", "🍄", "🌾", "💐", "🌹", "🥀", "🌞", "🌝", "⭐", "🌙", "🌎", "🌍", "🌏", "🪐",
    ],
  },
];

/**
 * Função Universal: renderTextWithEmojis
 * Converte qualquer texto contendo códigos :art_xxx: ou emojis Unicode nativos em JSX
 * garantindo o mesmo peso, alinhamento vertical e proporção visual.
 */
export function renderTextWithEmojis(text, options = {}) {
  if (!text || typeof text !== "string") return text;

  const {
    sizeClass = "w-[1.25em] h-[1.25em]",
    className = "",
  } = options;

  // Regex que busca códigos do padrão :art_nome:
  const regex = /(:art_[a-zA-Z0-9_]+:)/g;
  const parts = text.split(regex);

  return parts.map((part, index) => {
    const customEmoji = ARTFOLIO_EMOJI_MAP[part];
    if (customEmoji) {
      return (
        <span
          key={`${part}-${index}`}
          title={customEmoji.name}
          className={`inline-flex items-center justify-center align-middle mx-[1.5px] select-none ${sizeClass} ${className}`}
          style={{ verticalAlign: "-0.18em" }}
        >
          {customEmoji.svg}
        </span>
      );
    }
    return part;
  });
}
