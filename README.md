# Como Rodar o Projeto NoteCart

## Sobre o Projeto

**NoteCart** é uma aplicação web de gerenciamento de listas desenvolvida com Next.js 15, React 19 e Firebase. O projeto permite criar e gerenciar diferentes tipos de listas (compras, desejos, farmácia, outros) com persistência de dados no Firebase Firestore.

## Tecnologias Utilizadas

- **Framework**: Next.js 15.4.6
- **Frontend**: React 19.1.0
- **Estilização**: Tailwind CSS 4
- **Backend/Banco de Dados**: Firebase (Firestore)
- **Ícones**: Lucide React
- **Linguagem**: JavaScript

## Estrutura do Projeto

```
shop-list-app/
├── app/                    # Páginas e rotas do Next.js (App Router)
│   ├── api/               # API routes
│   ├── login/             # Página de login
│   ├── recentLists/       # Listas recentes
│   ├── settings/          # Configurações
│   ├── sharedLists/       # Listas compartilhadas
│   ├── layout.js          # Layout raiz da aplicação
│   ├── page.js            # Página principal (Home)
│   └── globals.css        # Estilos globais
├── components/            # Componentes React reutilizáveis
│   ├── MainWrapper.js     # Wrapper principal do conteúdo
│   └── Sidebar.js         # Barra lateral de navegação
├── contexts/              # Contextos React (vazio atualmente)
├── lib/                   # Bibliotecas e utilitários
│   ├── server/           # Código server-side
│   │   └── firebase/     # Configuração e serviços Firebase
│   │       ├── admin.js
│   │       └── listsService.js
│   └── services/         # Serviços client-side
│       └── listsService.js
├── data/                  # Dados locais (fallback quando Firebase não configurado)
├── public/               # Arquivos estáticos
├── .env.local            # Variáveis de ambiente (credenciais Firebase)
├── package.json          # Dependências do projeto
└── FIREBASE_SETUP.md     # Guia de configuração do Firebase
```

## Pré-requisitos

- **Node.js** (versão 18 ou superior recomendada)
- **npm** ou **yarn**
- **Conta Firebase** (opcional, mas recomendado para persistência)

## Instalação

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd shop-list-app
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure o Firebase (Opcional)

O projeto funciona em modo híbrido:
- **Com Firebase**: Dados persistem no Firestore
- **Sem Firebase**: Dados são salvos localmente em `data/lists.json`

Para configurar o Firebase, siga o guia detalhado em [FIREBASE_SETUP.md](file:///c:/Users/maria/Documents/Projetos/Projetos%20Pessoais/shop-list-app/FIREBASE_SETUP.md).

**Resumo rápido:**

1. Crie um projeto no [Firebase Console](https://console.firebase.google.com/)
2. Ative o Firestore Database
3. Gere uma chave privada (Service Account)
4. Configure as variáveis de ambiente no arquivo `.env.local`:

```env
FIREBASE_PROJECT_ID=seu-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@seu-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

⚠️ **Importante**: Nunca commite o arquivo `.env.local` com suas credenciais!

## Como Rodar

### Modo Desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em: **http://localhost:3000**

### Build de Produção

```bash
npm run build
npm start
```

### Outros Comandos

```bash
# Verificar problemas de lint
npm run lint

# Migrar dados para Firebase (se necessário)
npm run migrate
```

## Funcionalidades Principais

### Tipos de Listas Suportados

- 🛒 **Compras** (grocery)
- ❤️ **Desejos** (wishlist)
- 💊 **Farmácia** (pharmacy)
- ✨ **Outros** (other)

### Recursos

- ✅ Criar novas listas com nome e tipo
- ✅ Adicionar/remover itens das listas
- ✅ Editar listas existentes
- ✅ Excluir listas
- ✅ Visualizar detalhes de cada lista
- ✅ Persistência de dados (Firebase ou local)
- ✅ Interface responsiva com Tailwind CSS
- ✅ Navegação com sidebar

## Estrutura de Dados

Cada lista no Firestore tem a seguinte estrutura:

```json
{
  "id": "1234567890",
  "name": "Compras do mês",
  "type": "grocery",
  "createdAt": "2025-01-22T14:30:00.000Z",
  "items": [
    {
      "id": 1234567891,
      "name": "Arroz",
      "checked": false
    }
  ]
}
```

## Troubleshooting

### Erro ao carregar listas

- Verifique se o servidor está rodando (`npm run dev`)
- Se usando Firebase, confirme que as credenciais no `.env.local` estão corretas
- Verifique se o Firestore Database está criado no Firebase Console

### Dados não aparecem após configurar Firebase

- Reinicie o servidor Next.js
- Os dados do `data/lists.json` não são migrados automaticamente
- Crie novas listas após configurar o Firebase

### Problemas com dependências

```bash
# Limpe o cache e reinstale
rm -rf node_modules package-lock.json
npm install
```

## Próximos Passos

- [ ] Implementar autenticação de usuários
- [ ] Adicionar funcionalidade de compartilhamento de listas
- [ ] Implementar listas recentes
- [ ] Adicionar configurações de usuário
- [ ] Melhorar responsividade mobile

## Licença

Este projeto é privado e de uso pessoal.
