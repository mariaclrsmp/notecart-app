This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).
# NoteCart

Aplicativo de listas de compras colaborativas construído com Next.js (App Router), React e Tailwind CSS v4. Permite criar, visualizar e editar listas, com uma barra lateral fixa e minimizável presente em todas as páginas.

## Stack
- Next.js 15 (App Router)
- React 19
- Tailwind CSS v4 (com @tailwindcss/postcss)
- Ícones: lucide-react
- Persistência local: localStorage

## Funcionalidades
- **Criar lista** com nome, tipo (Mercado, Saúde, Cuidados pessoais, Lista de desejos) e itens.
- **Listas Recentes** com cards, contagem e data.
- **Detalhes da lista** em modal.
- **Edição dentro do modal**: alterar nome, tipo, adicionar/remover itens.
- **Excluir lista**.
- **Sidebar fixa global** (minimizável/expandível, estado salvo no localStorage, responsivo para mobile com overlay).

## Requisitos
- Node.js >= 18
- npm (ou yarn/pnpm/bun)

## Como executar localmente
1. Instale as dependências:
```bash
npm install
```
2. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```
3. Acesse em:
```
http://localhost:3000
```

## Scripts úteis
- `npm run dev` – desenvolvimento
- `npm run build` – build de produção
- `npm start` – executar build
- `npm run lint` – checagem ESLint (se habilitado no projeto)

## Estrutura (resumo)
```
app/
  layout.js          # Layout raiz com Sidebar e MainWrapper
  page.js            # Home: criação e painel inicial
  recentLists/page.js# Listas recentes
  sharedLists/page.js# Placeholder
  settings/page.js   # Placeholder
components/
  Sidebar.js         # Barra lateral fixa/minimizável (global)
  MainWrapper.js     # Controla margem conforme sidebar
public/
  cart.png           # Ícone usado na Sidebar
```

## Persistência
- As listas são salvas em `localStorage` na chave `recentLists`.
- O estado da sidebar (expandida/minimizada) é salvo em `localStorage` na chave `sidebarCollapsed`.

## Dicas de uso
- Para criar uma lista: clique em "Criar Lista" na Home, preencha os campos e salve.
- Para editar: abra "Ver detalhes" e clique em "Editar" dentro do modal.
- Para minimizar a sidebar (desktop): clique no ícone laranja de menu. No mobile, use o botão de menu flutuante.

## Deploy
- Recomendado: Vercel. Após o push do repositório, importe o projeto e utilize os scripts padrão do Next.js.

## Solução de problemas
- **Imagem do `public/`**: referencie com caminho absoluto (ex.: "/cart.png").
- **localStorage**: pode não persistir em abas anônimas ou com bloqueadores.
- **Porta em uso**: altere a porta com `PORT=3001 npm run dev`.

---
Este projeto foi iniciado com `create-next-app` e adaptado para a experiência do NoteCart.

