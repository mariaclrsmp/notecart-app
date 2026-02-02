# Deploy no Vercel - Guia Completo

## Problema Resolvido

O erro de build no Vercel ocorria porque o **firebase-admin** não é compatível com o Edge Runtime padrão do Vercel. A solução foi configurar as rotas de API para usar o **Node.js Runtime**.

## Correções Aplicadas

### 1. Runtime Configuration nas API Routes

Adicionado `export const runtime = 'nodejs';` em:
- `app/api/lists/route.js`
- `app/api/lists/[id]/route.js`

Isso força o Vercel a usar Node.js Runtime ao invés do Edge Runtime.

### 2. Arquivo vercel.json

Criado arquivo de configuração do Vercel com:
- Runtime Node.js 20.x para todas as funções de API
- Referências para variáveis de ambiente

## Passo a Passo do Deploy

### 1. Preparar o Projeto

Certifique-se de que o projeto está commitado no Git:

```bash
git add .
git commit -m "Configure Vercel deployment with Node.js runtime"
git push
```

### 2. Criar Projeto no Vercel

1. Acesse https://vercel.com
2. Faça login com sua conta
3. Clique em **"Add New Project"**
4. Importe seu repositório do GitHub/GitLab/Bitbucket
5. Configure o projeto:
   - **Framework Preset:** Next.js
   - **Root Directory:** ./
   - **Build Command:** `npm run build`
   - **Output Directory:** .next

### 3. Configurar Variáveis de Ambiente

No painel do Vercel, vá em **Settings > Environment Variables** e adicione:

#### Firebase Client SDK (OBRIGATÓRIO)
```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDd-cNULWMBhklWvz6Mtv1grMc7_PGadp8
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=shop-list-app-1a746.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=shop-list-app-1a746
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=shop-list-app-1a746.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=368902793663
NEXT_PUBLIC_FIREBASE_APP_ID=1:368902793663:web:fa3cfeec0ac04fad66990a
```

#### Firebase Admin SDK (OBRIGATÓRIO)
```
FIREBASE_PROJECT_ID=shop-list-app-1a746
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@shop-list-app-1a746.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

**IMPORTANTE:** Para `FIREBASE_PRIVATE_KEY`:
- Copie a chave completa do arquivo `.env.local`
- Mantenha as aspas duplas
- Mantenha os `\n` (não substitua por quebras de linha reais)

### 4. Configurar Domínio no Firebase

Após o deploy, você receberá um domínio do Vercel (ex: `seu-app.vercel.app`).

1. Acesse o [Firebase Console](https://console.firebase.google.com/)
2. Vá em **Authentication > Settings > Authorized domains**
3. Clique em **Add domain**
4. Adicione: `seu-app.vercel.app`
5. Clique em **Add**

### 5. Deploy

Clique em **Deploy** no Vercel. O build deve completar com sucesso.

## Verificação Pós-Deploy

### 1. Testar Autenticação

1. Acesse `https://seu-app.vercel.app/login`
2. Tente fazer login com email/senha
3. Tente fazer login com Google
4. Verifique se não há erros no console do navegador

### 2. Testar API

1. Faça login
2. Crie uma nova lista
3. Edite a lista
4. Delete a lista
5. Verifique se as operações são persistidas no Firestore

### 3. Verificar Logs

No painel do Vercel:
1. Vá em **Deployments**
2. Clique no deployment atual
3. Vá na aba **Functions**
4. Verifique se não há erros nas funções de API

## Troubleshooting

### Build Falha com "Module not found"

**Causa:** Dependências não instaladas corretamente  
**Solução:** Verifique se `firebase-admin` está em `dependencies` (não em `devDependencies`)

```bash
npm install firebase-admin --save
```

### "Unauthorized" ao fazer requisições

**Causa:** Variáveis de ambiente não configuradas  
**Solução:** Verifique se todas as variáveis de ambiente estão corretas no Vercel

### Google Login não funciona

**Causa:** Domínio não autorizado no Firebase  
**Solução:** Adicione o domínio do Vercel nos domínios autorizados do Firebase

### "Internal Server Error" nas API Routes

**Causa:** Firebase Admin SDK não inicializado corretamente  
**Solução:** 
1. Verifique `FIREBASE_PRIVATE_KEY` no Vercel
2. Certifique-se de que manteve os `\n` na chave
3. Verifique os logs da função no Vercel

### Edge Runtime Error

**Causa:** Rota de API tentando usar Edge Runtime  
**Solução:** Verifique se `export const runtime = 'nodejs';` está presente em todas as rotas de API

## Redeploy

Para fazer redeploy após alterações:

```bash
git add .
git commit -m "Sua mensagem"
git push
```

O Vercel fará deploy automaticamente.

## Deploy Manual

Se preferir fazer deploy manual:

```bash
npm install -g vercel
vercel login
vercel --prod
```

## Domínio Customizado

Para usar domínio próprio:

1. No Vercel, vá em **Settings > Domains**
2. Adicione seu domínio
3. Configure os DNS conforme instruções do Vercel
4. Adicione o domínio nos domínios autorizados do Firebase

## Monitoramento

### Vercel Analytics

Habilite Analytics no Vercel para monitorar:
- Performance
- Erros
- Uso de funções

### Firebase Console

Monitore no Firebase:
- Autenticações
- Operações no Firestore
- Erros de autenticação

## Custos

### Vercel
- **Hobby Plan (Grátis):**
  - 100GB bandwidth/mês
  - Funções serverless ilimitadas
  - Suficiente para projetos pessoais

### Firebase
- **Spark Plan (Grátis):**
  - 50K leituras/dia
  - 20K escritas/dia
  - 1GB armazenamento
  - Suficiente para começar

## Próximos Passos

1. Configure CI/CD com testes automatizados
2. Adicione monitoramento de erros (Sentry)
3. Configure backup do Firestore
4. Implemente rate limiting nas API routes
5. Configure domínio customizado
