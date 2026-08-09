<p align="center">
  <h1 align="center">🎨 Artfolio — Front-End Application</h1>
  <p align="center">
    Interface web moderna, responsiva e dinâmica para a plataforma <strong>Artfolio</strong>.<br/>
    Desenvolvida com React, Vite, TailwindCSS, FontAwesome e Context API.
  </p>
</p>

---

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Stack Tecnológica](#-stack-tecnológica)
- [Funcionalidades Principais](#-funcionalidades-principais)
- [Arquitetura de Pastas](#-arquitetura-de-pastas)
- [Instalação e Execução](#-instalação-e-execução)
- [Variáveis de Ambiente](#-variáveis-de-ambiente)
- [Gerenciamento de Estado & Contextos](#-gerenciamento-de-estado--contextos)

---

## 👁 Visão Geral

O **Artfolio Frontend** é uma aplicação web interativa projetada para conectar artistas e apreciadores de arte digital. A interface conta com um design moderno (estilo editorial e dark mode accents), animações suaves, notificações em tempo real, assistente inteligente de IA e áreas dedicadas para gerenciamento de perfil, feed social e moderação.

---

## 🛠 Stack Tecnológica

| Tecnologia | Versão | Papel na Aplicação |
|---|---|---|
| **React** | 18.x | Biblioteca para construção da interface de usuário |
| **Vite** | 5.x | Build tool e servidor de desenvolvimento ultra-rápido |
| **TailwindCSS** | 3.x | Framework utilitário para estilização e design system |
| **React Router DOM** | 6.x | Roteamento dinâmico e proteção de rotas |
| **FontAwesome** | 6.x | Conjunto de ícones vetoriais |
| **Context API** | Native | Gerenciamento de estado global (Autenticação e Notificações) |
| **Web Audio API** | Native | Síntese de som e efeitos sonoros para notificações |

---

## ✨ Funcionalidades Principais

### 🔒 1. Autenticação & Gerenciamento de Sessão
- Tela de **Login** e **Cadastro** com validações em tempo real.
- Opção **"Lembrar acesso"** (alterna entre `localStorage` e `sessionStorage`).
- Persistência automática do usuário logado via **AuthContext**.
- Botão de **"Sair da conta"** com encerramento de sessão e limpeza de estado.
- Redirecionamento automático e proteção de rotas autenticadas.

### 🖼 2. Feed Social & Interação em Tempo Real
- Exibição de postagens em layout masonry elegante.
- Botões de **Curtir** / **Descurtir** com contagem atualizada instantaneamente.
- Sistema de **Seguir** / **Seguir de Volta** integrado ao card dos artistas.
- Navegação direta para os perfis dos artistas ao clicar nos nomes ou avatares dos comentários e postagens.

### 🔖 3. Obras Salvas ("Salvar Obra")
- Salvamento e remoção de obras na coleção pessoal com um clique.
- Sincronização do status `salvo_por_mim` com o backend.
- Página dedicada **Salvos** ([Salvos.jsx](file:///e:/TCC/artfolio-frontend-main/src/pages/Salvos.jsx)) para visualizar, buscar, filtrar e organizar referências.

### 🚩 4. Denúncia de Obras & Central de Moderação
- Modal interativo **ModalDenuncia** ([ModalDenuncia.jsx](file:///e:/TCC/artfolio-frontend-main/src/components/ModalDenuncia.jsx)) com seleção de motivos e descrição opcional.
- Prevenção no frontend e backend contra auto-denúncia e denúncias duplicadas.
- Painel **Admin / Moderação** ([Admin.jsx](file:///e:/TCC/artfolio-frontend-main/src/pages/Admin.jsx)) para administradores e moderadores revisarem e marcarem denúncias como **Resolvidas** ou **Rejeitadas**.

### 🔔 5. Notificações em Tempo Real
- Badge dinâmico no menu lateral (Sidebar) com contador de notificações não lidas.
- Polling otimizado (8 segundos) via **NotificationContext**.
- Efeito sonoro suave via **Web Audio API** sintetizado nativamente (sem dependência de arquivos MP3 externos).
- Pop-ups flutuantes (Toasts) com navegação rápida ao receber novas interações.
- Limpeza isolada do contador ao alternar contas ou realizar logout.

### 🤖 6. Chat com Assistente de IA
- Chatbot inteligente integrado ao n8n exclusivo no **Feed** para usuários autenticados.
- Oculto na Landing Page e para visitantes não autenticados.

---

## 📁 Arquitetura de Pastas

```text
artfolio-frontend-main/
├── public/                       # Arquivos estáticos e favicons
├── src/
│   ├── assets/                   # Imagens e vetores
│   ├── components/               # Componentes reutilizáveis de UI
│   │   ├── Sidebar.jsx           # Navegação principal e badge de notificações
│   │   ├── Header.jsx            # Cabeçalho da aplicação
│   │   ├── MenuOpcoes.jsx        # Menu de opções da obra (Salvar, Copiar Link, Denunciar)
│   │   ├── ModalDenuncia.jsx     # Dialog modal de denúncia de conteúdo
│   │   ├── ChatIA.jsx            # Assistente interativo de IA
│   │   ├── CardObra.jsx          # Card de exibição de mídias
│   │   └── ProtectedRoute.jsx    # Guard de rotas privadas
│   ├── contexts/                 # Contextos globais do React
│   │   ├── AuthContext.jsx       # Gerenciamento de sessão, token JWT e usuário
│   │   └── NotificationContext.jsx # Polling, badge, efeito sonoro e toasts
│   ├── pages/                    # Páginas principais da aplicação
│   │   ├── LandingPage.jsx       # Página inicial pública
│   │   ├── Home.jsx              # Feed principal de obras
│   │   ├── Login.jsx             # Tela de login
│   │   ├── Cadastro.jsx          # Tela de cadastro
│   │   ├── Perfil.jsx            # Perfil do usuário logado
│   │   ├── PerfilArtista.jsx     # Perfil público de outros artistas
│   │   ├── DetalhesObra.jsx      # Detalhes da obra e comentários
│   │   ├── CriarObra.jsx         # Formulário de publicação de nova arte
│   │   ├── Salvos.jsx            # Galeria de obras salvas
│   │   ├── Notificacoes.jsx      # Central de notificações
│   │   └── Admin.jsx             # Painel administrativo e moderação
│   ├── services/
│   │   └── api.js                # Cliente HTTP para comunicação com o FastAPI
│   ├── App.jsx                   # Rotas e estrutura geral
│   ├── main.jsx                  # Ponto de entrada do React
│   └── index.css                 # Design system e utilitários Tailwind
├── index.html                    # Template HTML principal
├── tailwind.config.js            # Configuração do TailwindCSS
├── vite.config.js                # Configuração do Vite
└── package.json                  # Dependências do projeto
```

---

## 🚀 Instalação e Execução

### 1. Pré-requisitos
- **Node.js** (versão 18.x ou superior)
- **npm** ou **yarn**

### 2. Passo a Passo

```bash
# 1. Clonar o repositório
git clone <url-do-repositorio>
cd artfolio-frontend-main

# 2. Instalar as dependências
npm install

# 3. Executar o servidor de desenvolvimento
npm run dev
```

A aplicação estará acessível em `http://localhost:5173`.

---

## 🔑 Variáveis de Ambiente

Por padrão, a aplicação comunica-se com o backend rodando em `http://localhost:8000`.  
Caso precise alterar o endereço da API, configure no arquivo `.env`:

```env
VITE_API_BASE_URL=http://localhost:8000
```

---

## 🧠 Gerenciamento de Estado & Contextos

### `AuthContext`
Centraliza a autenticação do usuário na aplicação.
- Fornece `user`, `token`, `isAuthenticated`, `login()`, `logout()`, `updateUser()`.
- Gerencia a persistência no `localStorage` (opção "Lembrar acesso") ou `sessionStorage`.

### `NotificationContext`
Gerencia os eventos em tempo real do sistema de notificações.
- Fornece `unreadCount`, `refreshUnreadCount()`, `markAsRead()`, `markAllAsRead()`.
- Executa polling discreto a cada 8 segundos.
- Toca o aviso sonoro via Web Audio API e exibe o Toast flutuante apenas em novas notificações recebidas durante a sessão ativa.

---

<p align="center">
  <sub>Artfolio © 2026 — Trabalho de Conclusão de Curso</sub>
</p>
