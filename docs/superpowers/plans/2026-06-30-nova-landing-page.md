# Nova Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Substituir a home (`/`) do site Next.js `Casa97-NextJS` pelo novo design de landing page (vindo do artefato `h:/casa97-site/artifacts/casa97`), sem afetar nenhuma outra rota do site.

**Architecture:** O novo design é um único componente React self-contained (`LandingPage.tsx`, ~1450 linhas) com nav, hero, seções de ambientes/gastronomia/momentos/CTA e footer, todos com estilos inline + um bloco `<style>` para keyframes/animações. Vamos convertê-lo para `.jsx` (remover tipagem TS), colocá-lo em `src/components/landing/LandingPage.jsx`, copiar as imagens referenciadas para `public/images/`, adicionar as fontes Google que o design espera, e trocar `src/app/page.jsx` para renderizar só esse componente.

**Tech Stack:** Next.js 14 (App Router), React 18, Tailwind CSS, `lucide-react` (já é dependência do projeto atual), `next/font/google`.

## Global Constraints

- Não alterar `/booking`, `/dashboard`, `/admin`, `/itens`, `/spaces` — zero mudanças fora da home.
- Não deletar `Hero.jsx`, `Locations.jsx`, `EventsSection.jsx` — ficam no repo sem uso.
- Não migrar nada para Vite; `casa97-site/artifacts/casa97` é só fonte de cópia, não vira dependência.
- Botões de reserva continuam abrindo `https://wa.me/554732279537` (mesmo número já usado em `Hero.jsx` e `EventsSection.jsx`).
- Manter `<img>` HTML puro — não migrar para `next/image`.
- Sem suite de testes automatizada neste projeto; verificação é manual via `npm run dev` + inspeção visual no browser.

---

### Task 1: Copiar imagens da nova landing para `public/images/`

**Files:**
- Create: `public/images/*.jpg`, `public/images/*.png` (copiados de `h:/casa97-site/artifacts/casa97/public/images/`)

**Interfaces:**
- Consumes: nada.
- Produces: arquivos estáticos em `public/images/` acessíveis via `/images/<nome>` — usados pelo componente `LandingPage.jsx` criado na Task 2.

Lista exata de arquivos a copiar (todos os usados em `LandingPage.tsx`):
`bambus-1.jpg`, `bambus-2.jpg`, `bambus-3.jpg`, `bar-1.jpg`, `bar-2.jpg`, `bar-3.jpg`, `bar-4.jpg`, `espelhos-1.jpg`, `espelhos-2.jpg`, `espelhos-3.jpg`, `espelhos-4.jpg`, `hero-casa.jpg`, `hero-drinks.jpg`, `jardim-1.jpg`, `jardim-2.jpg`, `jardim-3.jpg`, `jardim-4.jpg`, `lareira-1.jpg`, `lareira-2.jpg`, `lareira-3.jpg`, `lareira-4.jpg`, `logo-casa97.png`, `momentos-confraternizacoes.jpg`, `momentos-floricultura.jpg`, `momentos-mesas.jpg`, `sacada-1.jpg`, `sacada-2.jpg`, `sacada-3.jpg`, `sacada-4.jpg`, `special-moment.png`.

(O projeto novo também tem `bambus-space.png`, `bar-space.png`, `espelhos-space.png`, `food-drinks.png`, `hero-restaurant.png`, `jardim-space.png`, `lareira-space.png`, `sacada-space.png` — esses não são referenciados em `LandingPage.tsx`, não precisam ser copiados.)

- [ ] **Step 1: Criar a pasta `public/images/` e copiar os arquivos**

```bash
mkdir -p "h:/Casa97-NextJS/public/images"
cd "h:/casa97-site/artifacts/casa97/public/images"
cp bambus-1.jpg bambus-2.jpg bambus-3.jpg \
   bar-1.jpg bar-2.jpg bar-3.jpg bar-4.jpg \
   espelhos-1.jpg espelhos-2.jpg espelhos-3.jpg espelhos-4.jpg \
   hero-casa.jpg hero-drinks.jpg \
   jardim-1.jpg jardim-2.jpg jardim-3.jpg jardim-4.jpg \
   lareira-1.jpg lareira-2.jpg lareira-3.jpg lareira-4.jpg \
   logo-casa97.png \
   momentos-confraternizacoes.jpg momentos-floricultura.jpg momentos-mesas.jpg \
   sacada-1.jpg sacada-2.jpg sacada-3.jpg sacada-4.jpg \
   special-moment.png \
   "h:/Casa97-NextJS/public/images/"
```

- [ ] **Step 2: Verificar que todos os 29 arquivos foram copiados**

Run: `ls "h:/Casa97-NextJS/public/images" | wc -l`
Expected: `29`

- [ ] **Step 3: Commit**

```bash
cd "h:/Casa97-NextJS"
git add public/images
git commit -m "feat: adiciona imagens da nova landing page"
```

---

### Task 2: Criar o componente `LandingPage.jsx`

**Files:**
- Create: `src/components/landing/LandingPage.jsx`

**Interfaces:**
- Consumes: `lucide-react` (ícones: `Menu`, `X`, `MapPin`, `Heart`, `UtensilsCrossed`, `Sparkles`, `Instagram`, `Facebook`, `Star`, `Phone`, `Mail` — já é dependência existente do projeto, ver `package.json`), imagens de `public/images/` (Task 1).
- Produces: `export default function LandingPage()` — componente sem props, usado pela Task 3 em `src/app/page.jsx`.

Este componente é a tradução direta de `h:/casa97-site/artifacts/casa97/src/pages/LandingPage.tsx` para JSX puro (remover anotações de tipo TS: `: { className?: string }`, `: React.MouseEvent`, `: KeyboardEvent`, `as React.CSSProperties`, `type AmbienteData = {...}`, tipos em props de função). A lógica, estilos inline, JSX, e estrutura de seções permanecem **idênticos** ao arquivo original. Mudar `export function LandingPage()` (named export) para `export default function LandingPage()` (default export).

- [ ] **Step 1: Criar a pasta e o arquivo**

```bash
mkdir -p "h:/Casa97-NextJS/src/components/landing"
```

- [ ] **Step 2: Escrever `src/components/landing/LandingPage.jsx`**

Conteúdo do arquivo — cópia de `h:/casa97-site/artifacts/casa97/src/pages/LandingPage.tsx` com as seguintes mudanças mecânicas:

1. Linha 1: `import React, { useEffect, useState } from "react";` — manter igual.
2. Linha 32: `const LeafSVG = ({ className }: { className?: string }) => (` → `const LeafSVG = ({ className, style }) => (` — **nota:** no original, `style` é passado via spread de props JSX no caller (`style={{...} as React.CSSProperties}`) mas a assinatura de `LeafSVG` só declara `className` explicitamente; o `style` chega via `...rest`. Para preservar o comportamento exato, declarar `LeafSVG` assim:

```jsx
const LeafSVG = ({ className, ...rest }) => (
  <svg
    viewBox="0 0 60 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...rest}
  >
    <path
      d="M30 95 C30 95 5 70 5 40 C5 15 18 5 30 5 C42 5 55 15 55 40 C55 70 30 95 30 95Z"
      fill="currentColor"
    />
    <path
      d="M30 95 L30 20"
      stroke="rgba(255,255,255,0.3)"
      strokeWidth="1"
    />
  </svg>
);
```

3. Linha 51: `const OrnamentDivider = ({ label }: { label: string }) => (` → `const OrnamentDivider = ({ label }) => (` (resto do bloco idêntico).
4. Linhas 69-74: remover o bloco `type AmbienteData = {...}` inteiro (tipo TS, sem efeito em runtime).
5. Linha 76: `function Lightbox({ imgs, startIdx, onClose }: { imgs: string[]; startIdx: number; onClose: () => void }) {` → `function Lightbox({ imgs, startIdx, onClose }) {`
6. Linha 79-80: remover `: React.MouseEvent` dos parâmetros `e`:
   ```jsx
   const prev = (e) => { e.stopPropagation(); setIdx((i) => (i - 1 + total) % total); };
   const next = (e) => { e.stopPropagation(); setIdx((i) => (i + 1) % total); };
   ```
7. Linha 83: `const onKey = (e: KeyboardEvent) => {` → `const onKey = (e) => {`
8. Linha 128: `function AmbienteEditorial({ ambiente, reversed }: { ambiente: AmbienteData; reversed?: boolean }) {` → `function AmbienteEditorial({ ambiente, reversed }) {`
9. Linha 132: `const imgBtn = (src: string, idx: number, extraStyle: React.CSSProperties) => (` → `const imgBtn = (src, idx, extraStyle) => (`
10. Linha 212: `function AmbientesGallery({ ambientes }: { ambientes: AmbienteData[] }) {` → `function AmbientesGallery({ ambientes }) {`
11. Linha 223: `export function LandingPage() {` → `export default function LandingPage() {`
12. Todas as ocorrências de `as React.CSSProperties` (linhas 473, 477, 481, 485, 489, 790, 1181, 1191) — remover esse sufixo de type assertion. Exemplo, linha 472-474:
    ```jsx
    <LeafSVG
      className="leaf-1 absolute w-10 h-16 text-green-700 opacity-40 pointer-events-none"
      style={{ top: "15%", left: "42%", zIndex: 20 }}
    />
    ```
13. Resto do arquivo (todo o JSX de nav, hero, stats bar, seções ambientes/gastronomia/momentos/por-que-casa97/CTA/footer) — copiar **exatamente igual** ao original, sem alterações de lógica, classes, estilos ou conteúdo de texto.

- [ ] **Step 3: Verificar que o arquivo não tem mais nenhuma sintaxe TypeScript**

Run: `grep -nE ": (string|number|React\.|KeyboardEvent)|as React\.CSSProperties" "h:/Casa97-NextJS/src/components/landing/LandingPage.jsx"`
Expected: nenhuma saída (sem matches).

- [ ] **Step 4: Verificar que o componente tem export default**

Run: `grep -n "export default function LandingPage" "h:/Casa97-NextJS/src/components/landing/LandingPage.jsx"`
Expected: uma linha de match.

- [ ] **Step 5: Commit**

```bash
cd "h:/Casa97-NextJS"
git add src/components/landing/LandingPage.jsx
git commit -m "feat: cria componente LandingPage convertido de TSX para JSX"
```

---

### Task 3: Adicionar fontes Google ao layout root

**Files:**
- Modify: `src/app/layout.jsx`

**Interfaces:**
- Consumes: `next/font/google` (`Montserrat` já importado; adicionar `Playfair_Display` e `Lora`).
- Produces: variáveis CSS de fonte aplicadas no `<body>`, consumidas pelos `font-family: 'Playfair Display', serif` / `'Lora', serif` / `'Montserrat', sans-serif` usados em `LandingPage.jsx` (Task 2) via `fontFamily` inline — esses já funcionam com `font-family` por nome desde que a fonte esteja carregada na página, independente de variável CSS.

O arquivo atual (`src/app/layout.jsx`) já importa e aplica `Montserrat`:

```jsx
// app/landing/layout.js
import { Montserrat } from "next/font/google";
import "@/app/globals.css";
import Footer from "@/components/Footer";

const montserrat = Montserrat({ subsets: ["latin"] });

const LandingLayout = ({ children }) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Restaurante Casa 97</title>
      </head>
      <body className={montserrat.className}>
        <main className="relative overflow-hidden">
          {children}
        </main>
      </body>
    </html>
  );
};

export default LandingLayout;
```

`LandingPage.jsx` usa `font-family: 'Playfair Display', serif` e `font-family: 'Lora', serif` via `style={{ fontFamily: ... }}` inline em dezenas de elementos. Para essas fontes carregarem, basta declará-las com `next/font/google` em qualquer ponto do layout root — não precisa aplicar a classe no body, só garantir que a fonte seja injetada na página.

- [ ] **Step 1: Editar `src/app/layout.jsx`**

Substituir o import de fontes e adicionar a injeção das fontes extras:

```jsx
// app/landing/layout.js
import { Montserrat, Playfair_Display, Lora } from "next/font/google";
import "@/app/globals.css";
import Footer from "@/components/Footer";

const montserrat = Montserrat({ subsets: ["latin"] });
const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair-display",
});
const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
});

const LandingLayout = ({ children }) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Restaurante Casa 97</title>
      </head>
      <body className={`${montserrat.className} ${playfairDisplay.variable} ${lora.variable}`}>
        <main className="relative overflow-hidden">
          {children}
        </main>
      </body>
    </html>
  );
};

export default LandingLayout;
```

**Nota:** declarar as fontes com `next/font/google` injeta `@font-face` rules com os nomes reais da família (`'Playfair Display'`, `'Lora'`) no CSS gerado, então os `fontFamily: "'Playfair Display', serif"` inline em `LandingPage.jsx` vão resolver corretamente mesmo sem usar a variável CSS — a variável (`.variable`) é adicionada por consistência com o padrão do projeto, mas o que garante o carregamento da fonte é a própria chamada `Playfair_Display({...})` no build.

- [ ] **Step 2: Rodar o dev server e checar visualmente que as fontes carregam**

Run: `cd "h:/Casa97-NextJS" && yarn dev` (ou `npm run dev`)
Abrir `http://localhost:3000` no browser, abrir DevTools → Network → Font, e confirmar que `Playfair Display` e `Lora` aparecem na lista de fontes carregadas (mesmo antes da Task 4, pois o layout já as injeta globalmente).
Parar o servidor (Ctrl+C) depois de confirmar.

- [ ] **Step 3: Commit**

```bash
cd "h:/Casa97-NextJS"
git add src/app/layout.jsx
git commit -m "feat: adiciona fontes Playfair Display e Lora ao layout root"
```

---

### Task 4: Trocar `src/app/page.jsx` para usar a nova `LandingPage`

**Files:**
- Modify: `src/app/page.jsx`

**Interfaces:**
- Consumes: `LandingPage` default export de `src/components/landing/LandingPage.jsx` (Task 2).
- Produces: rota `/` renderizando a nova landing.

Conteúdo atual de `src/app/page.jsx`:

```jsx
"use client";
import "@/app/globals.css";
import EventsSection from "@/components/EventsSection";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Locations from "@/components/Locations";

export default function Home() {
  return (
    <>
      <Hero/>
      <Locations/>
      <EventsSection/>
      <Footer />
    </>
  );
}
```

- [ ] **Step 1: Substituir o conteúdo de `src/app/page.jsx`**

```jsx
"use client";
import "@/app/globals.css";
import LandingPage from "@/components/landing/LandingPage";

export default function Home() {
  return <LandingPage />;
}
```

- [ ] **Step 2: Rodar o dev server e verificar a home no browser**

Run: `cd "h:/Casa97-NextJS" && yarn dev` (ou `npm run dev`)
Abrir `http://localhost:3000` e confirmar visualmente:
- Nav fixo no topo, com transição de fundo ao rolar a página.
- Hero com título "Uma experiência gastronômica para noites que merecem ser lembradas", imagens circulares flutuantes (desktop) ou imagem de fundo (mobile).
- Stats bar com "6 Ambientes diferentes", "5 Opções de mesas decoradas", "10 Anos de existência", "+500 Pedidos de casamento e namoro".
- Seção "Ambientes" com mosaico de imagens por ambiente (Sacada, Lareira, Bar, Espelhos, Jardim, Bambus) e lightbox funcionando ao clicar em uma imagem.
- Seção "Gastronomia" com imagem e lista de itens.
- Seção "Momentos" com 3 cards (Mesas Decoradas, Floricultura, Confraternizações).
- Seção "Por que Casa97" com 4 cards de features.
- CTA final "Reserve sua mesa e viva a experiência Casa97".
- Footer com logo, navegação, contato (endereço, telefone, e-mail) e redes sociais.
- Clicar em qualquer botão "Reservar" / "Falar no WhatsApp" abre `https://wa.me/554732279537` em nova aba.
- Nenhum erro no console do browser relacionado a imagens 404 ou imports quebrados.

Parar o servidor (Ctrl+C) depois de confirmar.

- [ ] **Step 3: Verificar que as outras rotas continuam intactas**

Com o dev server rodando, navegar manualmente para `http://localhost:3000/booking`, `http://localhost:3000/dashboard`, `http://localhost:3000/spaces`, `http://localhost:3000/itens` e confirmar que carregam sem erro (comportamento idêntico ao que tinham antes desta mudança — não é necessário revisar o conteúdo dessas páginas em detalhe, só confirmar que não quebraram).

- [ ] **Step 4: Commit**

```bash
cd "h:/Casa97-NextJS"
git add src/app/page.jsx
git commit -m "feat: substitui home pela nova landing page"
```

---

## Self-Review Notes

- **Spec coverage:** Task 1 cobre cópia de imagens (spec item 3), Task 2 cobre conversão TSX→JSX (spec item 1), Task 3 cobre fontes (spec item 4), Task 4 cobre troca de `page.jsx` (spec item 2) e verificação de não-regressão nas outras rotas (spec "fora de escopo" / critério de sucesso). CTA de WhatsApp (spec item 6) é preservado por não ser alterado no componente copiado — verificado no Step 2 da Task 4. Uso de `<img>` puro (spec item 5) é preservado por ser cópia direta do JSX original, sem substituição por `next/image`.
- **Placeholder scan:** sem TBD/TODO; todos os steps têm comandos ou código completo.
- **Type consistency:** `LandingPage` é default export em Task 2 e importado como default em Task 4 — consistente. Nome do arquivo (`src/components/landing/LandingPage.jsx`) é o mesmo em ambas as tasks.
