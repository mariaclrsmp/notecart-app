# Configuração do Firebase

Este guia explica como configurar o Firebase para o projeto NoteCart.

## Pré-requisitos

1. Conta no Firebase (https://firebase.google.com/)
2. Projeto Firebase criado

## Passos para configuração

### 1. Instalar Firebase Admin SDK

```bash
npm install firebase-admin
```

### 2. Criar Service Account no Firebase Console

1. Acesse o [Firebase Console](https://console.firebase.google.com/)
2. Selecione seu projeto
3. Vá em **Configurações do Projeto** (ícone de engrenagem) → **Contas de serviço**
4. Clique em **Gerar nova chave privada**
5. Baixe o arquivo JSON

### 3. Configurar variáveis de ambiente

Copie o arquivo `.env.example` para `.env.local`:

```bash
cp .env.example .env.local
```

Abra o arquivo JSON baixado e preencha o `.env.local` com os valores:

```env
FIREBASE_PROJECT_ID=seu-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@seu-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nSua chave privada aqui (com \\n preservados)\n-----END PRIVATE KEY-----\n"
```

**Importante**: 
- A `FIREBASE_PRIVATE_KEY` deve estar entre aspas duplas
- Mantenha os `\n` na chave privada (eles representam quebras de linha)
- Adicione `.env.local` ao `.gitignore` para não commitar credenciais

### 4. Configurar Firestore

1. No Firebase Console, vá em **Firestore Database**
2. Clique em **Criar banco de dados**
3. Escolha o modo de produção ou teste
4. Selecione a localização do servidor

### 5. Configurar regras do Firestore (opcional)

Para desenvolvimento, você pode usar regras permissivas (não recomendado para produção):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /lists/{listId} {
      allow read, write: if true;
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

Para verificar qual modo está ativo, verifique se as variáveis de ambiente estão configuradas.

## Troubleshooting

### Erro: "Error getting lists"

Verifique se:
- As credenciais no `.env.local` estão corretas
- O Firestore Database está criado
- As regras do Firestore permitem leitura/escrita

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
