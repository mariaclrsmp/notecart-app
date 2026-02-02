# Configuração do Firebase

Este guia explica como configurar o Firebase para o projeto NoteCart.

## Pré-requisitos

1. Conta no Firebase (https://firebase.google.com/)
2. Projeto Firebase criado

## Passos para configuração

### 1. Instalar Firebase Admin SDK

```bash
npm install firebase-admin firebase
```

### 2. Criar Service Account no Firebase Console (Backend)

1. Acesse o [Firebase Console](https://console.firebase.google.com/)
2. Selecione seu projeto
3. Vá em **Configurações do Projeto** (ícone de engrenagem) → **Contas de serviço**
4. Clique em **Gerar nova chave privada**
5. Baixe o arquivo JSON

### 3. Configurar Firebase Authentication

1. No Firebase Console, vá em **Authentication**
2. Clique em **Começar**
3. Ative os seguintes provedores:
   - **Email/Senha**: Clique em Email/Senha → Ative → Salvar
   - **Google**: Clique em Google → Ative → Configure o email de suporte → Salvar

### 4. Obter credenciais do Firebase Client SDK

1. No Firebase Console, vá em **Configurações do Projeto** (ícone de engrenagem)
2. Em **Seus apps**, clique em **Adicionar app** → **Web** (ícone `</>`)
3. Dê um nome ao app e clique em **Registrar app**
4. Copie as configurações do `firebaseConfig`

### 5. Configurar variáveis de ambiente

Copie o arquivo `.env.example` para `.env.local`:

```bash
cp .env.example .env.local
```

Preencha o `.env.local` com os valores:

```env
# Firebase Admin SDK (backend)
FIREBASE_PROJECT_ID=seu-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@seu-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Firebase Client SDK (frontend - autenticação)
NEXT_PUBLIC_FIREBASE_API_KEY=sua-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=seu-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=seu-app-id
```

**Importante**: 
- A `FIREBASE_PRIVATE_KEY` deve estar entre aspas duplas
- Mantenha os `\n` na chave privada (eles representam quebras de linha)
- Adicione `.env.local` ao `.gitignore` para não commitar credenciais

### 6. Configurar Firestore

1. No Firebase Console, vá em **Firestore Database**
2. Clique em **Criar banco de dados**
3. Escolha o modo de produção ou teste
4. Selecione a localização do servidor

### 7. Configurar regras do Firestore

Para desenvolvimento, você pode usar regras mais permissivas. Para produção, use regras mais restritivas:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /lists/{listId} {
      // Permite ler/escrever apenas se o usuário estiver autenticado e for o dono da lista
      allow read, update, delete: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
    }
  }
}
```

## Estrutura de dados no Firestore

A coleção `lists` terá documentos com a seguinte estrutura:

```json
{
  "id": "1234567890",
  "name": "Compras do mês",
  "type": "grocery",
  "userId": "uid-do-usuario",
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

## Modo Fallback

O sistema funciona em modo híbrido:
- **Com Firebase configurado**: Usa Firestore para persistência
- **Sem Firebase**: Usa arquivo JSON local (`data/lists.json`)

## Troubleshooting

### Erro: "Error getting lists"

Verifique se:
- As credenciais no `.env.local` estão corretas
- O Firestore Database está criado
- As regras do Firestore permitem leitura/escrita

### Erro de autenticação

Verifique se:
- O provedor Email/Senha está ativado no Firebase Console
- O provedor Google está ativado e configurado
- As variáveis `NEXT_PUBLIC_*` estão corretas no `.env.local`

### Dados não aparecem após configurar Firebase

- Reinicie o servidor Next.js (`npm run dev`)
- Os dados do `data/lists.json` não são migrados automaticamente para o Firebase
- Crie novas listas após configurar o Firebase

## Segurança

⚠️ **Nunca commite o arquivo `.env.local` ou as credenciais do Firebase**

Adicione ao `.gitignore`:
```
.env.local
.env
```
