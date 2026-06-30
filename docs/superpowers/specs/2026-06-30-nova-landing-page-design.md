# Substituir landing page atual pela nova landing (casa97 artifact)

## Contexto

O projeto atual (`Casa97-NextJS`) é um app Next.js (App Router) com várias rotas:
`/` (home/landing), `/booking`, `/dashboard`, `/admin`, `/itens`, `/spaces`.

Foi criado um novo design de landing page em `h:/casa97-site/artifacts/casa97`,
um artefato standalone gerado no Replit (Vite + React + TS), contendo apenas
uma página: `src/pages/LandingPage.tsx`. Esse componente é totalmente
self-contained — nav, hero, seções (ambientes, gastronomia, momentos, CTA) e
footer — com estilos majoritariamente inline e um bloco `<style>` para
animações/keyframes. Não depende de nenhuma lib de UI do projeto (não usa
`src/components/ui/*`), só de `lucide-react` para ícones.

## Objetivo

Substituir a home (`/`) do site Next.js atual pelo visual da nova landing,
sem afetar nenhuma outra rota.

## Escopo

1. Converter `LandingPage.tsx` para JSX (remover tipagem TS) e criar como
   `src/components/landing/LandingPage.jsx` no projeto Next.js.
2. Atualizar `src/app/page.jsx` para renderizar apenas o novo componente,
   removendo os imports de `Hero`, `Locations`, `EventsSection`, `Footer`.
3. Copiar as imagens referenciadas (`/images/*.jpg`, `/images/*.png`) de
   `h:/casa97-site/artifacts/casa97/public/images/` para
   `h:/Casa97-NextJS/public/images/`, preservando os mesmos nomes/paths
   usados no componente (`/images/hero-casa.jpg`, etc).
4. Adicionar as fontes Google usadas pelo design (Playfair Display, Lora,
   Montserrat) via `next/font/google` no `src/app/layout.jsx`, já que hoje só
   Montserrat está carregada.
5. Manter `<img>` HTML puro (não migrar para `next/image`) para preservar
   fielmente o estilo inline original sem necessidade de refatorar
   width/height em cada imagem.
6. Botões de reserva continuam abrindo WhatsApp
   (`https://wa.me/554732279537`) — mesmo comportamento já usado em outras
   partes do site atual (mesmo número).

## Fora de escopo

- Não alterar `/booking`, `/dashboard`, `/admin`, `/itens`, `/spaces`.
- Não deletar `Hero.jsx`, `Locations.jsx`, `EventsSection.jsx` — ficam no
  repositório sem uso, podem ser removidos depois se desejado.
- Não migrar nada para Vite; o projeto `casa97-site/artifacts/casa97` é só
  fonte de referência/copy-paste, não vira dependência nem se mantém em sync.
- Não trocar CTA de WhatsApp por redirecionamento para `/booking`.

## Critério de sucesso

- `npm run dev` (ou `yarn dev`) sobe normalmente.
- `/` exibe a nova landing com todas as seções, imagens carregando, nav fixo
  com scroll behavior, lightbox de imagens nos ambientes, e botões de
  WhatsApp funcionais.
- `/booking`, `/dashboard`, `/admin`, `/itens`, `/spaces` continuam
  funcionando sem mudanças.
