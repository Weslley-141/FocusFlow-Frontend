# 🎯 FocusFlow — Frontend

Interface web do **FocusFlow**, uma aplicação de organização e acompanhamento de estudos construída com **React, TypeScript e Vite**.

O frontend reúne em uma única interface ferramentas para planejamento, foco e revisão, consumindo a API REST do projeto `focusflow-backend`.

> **Contexto do repositório:** este projeto faz parte da reconstrução do FocusFlow após a perda do repositório original. O serviço online original foi preservado e utilizado como referência durante a recuperação do frontend.

---

## ✨ Funcionalidades

### 🔐 Autenticação

- Login
- Cadastro de usuários
- Verificação de e-mail
- Persistência da sessão no navegador
- Atualização de perfil
- Proteção de rotas autenticadas
- Conta de demonstração opcional

### 📊 Dashboard

O dashboard apresenta um resumo dos estudos, incluindo:

- Tempo total estudado
- Sessões Pomodoro
- Flashcards pendentes, novos e dominados
- Metas ativas e taxa de conclusão
- Quantidade de matérias
- Ações rápidas para acessar os principais recursos

### 📚 Matérias e tópicos

- Criação e gerenciamento de matérias
- Organização por tópicos
- Ativação/desativação de matérias
- Detalhes de cada matéria
- Contagem de tópicos

### 🧠 Flashcards

- Criação, edição e exclusão
- Associação com matérias e tópicos
- Filtro por matéria
- Estatísticas de revisão
- Sessão dedicada de revisão
- Repetição espaçada baseada em **SM-2**
- Histórico das revisões

### ⏱️ Pomodoro

- Temporizador configurável
- Duração de foco e pausa
- Pausar e continuar sessões
- Registro das sessões na API
- Associação opcional a tópicos
- Estatísticas de tempo estudado
- Acompanhamento do Pomodoro enquanto o usuário navega pela aplicação

### 🎯 Metas

- Criação de metas
- Metas diárias, semanais, mensais e personalizadas
- Acompanhamento em minutos
- Barra de progresso
- Conclusão e falha de metas
- Estatísticas de desempenho

### 🗺️ Mapas mentais

- Criação de mapas mentais
- Associação opcional com tópicos
- Criação e edição de nós
- Hierarquia entre nós
- Posicionamento livre no canvas
- Cores de fundo e texto
- Conexões utilizando **React Flow**

### 🌙 Tema

A interface possui suporte a **modo claro e escuro**, com preferência salva no `localStorage`.

---

## 🛠️ Tecnologias

- **React 18**
- **TypeScript**
- **Vite**
- **Tailwind CSS**
- **React Router**
- **Zustand**
- **Axios**
- **Lucide React**
- **React Flow**

---

## 🏗️ Estrutura

A aplicação é organizada por páginas, componentes, serviços, stores, hooks e utilitários:

```text
src/
├── components/
│   ├── dashboard/
│   ├── flashcards/
│   ├── goals/
│   ├── layout/
│   ├── mindmaps/
│   ├── pomodoro/
│   ├── subjects/
│   ├── topics/
│   └── ui/
│
├── hooks/          # Hooks reutilizáveis
├── pages/          # Páginas da aplicação
├── services/       # Comunicação com a API
├── stores/         # Estado global com Zustand
├── types/          # Tipos TypeScript
└── utils/          # Funções auxiliares
```

---

## 🧭 Rotas da aplicação

| Rota | Página |
|---|---|
| `/login` | Login |
| `/register` | Cadastro |
| `/verify-email` | Verificação de e-mail |
| `/dashboard` | Dashboard |
| `/subjects` | Matérias |
| `/subjects/:id` | Detalhes da matéria |
| `/pomodoro` | Pomodoro |
| `/flashcards` | Flashcards |
| `/flashcards/review` | Revisão de flashcards |
| `/goals` | Metas |
| `/mindmaps` | Mapas mentais |

As rotas internas são gerenciadas pelo **React Router** e o `vercel.json` redireciona as requisições para `index.html`, permitindo que a aplicação funcione corretamente como SPA na Vercel.

---

## 🔌 Comunicação com a API

A aplicação utiliza **Axios** para se comunicar com o backend.

A URL da API é definida pela variável:

```env
VITE_API_URL=http://localhost:3000/api
```

O Axios possui interceptors responsáveis por:

- Adicionar automaticamente o JWT no cabeçalho `Authorization`.
- Remover a sessão e redirecionar para `/login` quando a API retorna `401`.

---

## 🚀 Executando localmente

### Pré-requisitos

- Node.js 18 ou superior
- npm
- Uma instância do backend FocusFlow em execução

### 1. Instale as dependências

```bash
npm install
```

### 2. Configure o ambiente

Copie o arquivo de exemplo:

```bash
cp .env.example .env
```

Configure a URL da API:

```env
VITE_API_URL=http://localhost:3000/api
```

Opcionalmente, é possível configurar uma conta de demonstração:

```env
VITE_DEMO_EMAIL=
VITE_DEMO_PASSWORD=
```

Quando essas duas variáveis estiverem preenchidas, o botão **"Teste sem conta"** aparece na tela de login.

> Variáveis `VITE_*` são incorporadas ao bundle do frontend. Portanto, **nunca coloque segredos reais nelas**. A conta demo deve ser uma conta descartável.

### 3. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

O Vite disponibiliza a aplicação localmente, normalmente em:

```text
http://localhost:5173
```

### 4. Build de produção

```bash
npm run build
```

O build final é gerado em `dist/`.

Para verificar o build localmente:

```bash
npm run preview
```

Também existe o comando:

```bash
npm run typecheck
```

para verificar os tipos TypeScript sem gerar o build.

---

## 🌐 Configuração de produção

O projeto possui um `.env.production` com a URL pública da API atualmente utilizada pelo FocusFlow.

Esse arquivo contém somente a URL do backend, que não é um segredo:

```env
VITE_API_URL=https://focusflow-backend-zcel.onrender.com/api
```

Se a API mudar, a variável pode ser alterada diretamente na configuração da Vercel. Uma variável configurada na Vercel tem prioridade sobre o valor do arquivo.

---

## ☁️ Deploy

O frontend foi estruturado para deploy na **Vercel**.

O arquivo `vercel.json` contém a regra necessária para aplicações SPA:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

A infraestrutura online existente foi preservada durante a reconstrução do projeto. O objetivo é conectar este novo repositório ao projeto Vercel existente, evitando recriar a aplicação publicada do zero.

---

## 🔄 Relação com o backend

Este repositório é a camada de interface do FocusFlow e trabalha em conjunto com:

**FocusFlow — Backend**

A API fornece autenticação, persistência de dados e regras de negócio, enquanto o frontend concentra a experiência de uso e a apresentação dos dados.

---

## 🧩 Estado e organização

O projeto utiliza **Zustand** para estados compartilhados, incluindo:

- Autenticação
- Sessão do Pomodoro
- Matérias
- Tema claro/escuro

A comunicação com a API fica concentrada em serviços específicos, como:

```text
services/
├── authService.ts
├── subjectService.ts
├── topicService.ts
├── pomodoroService.ts
├── flashcardService.ts
├── goalService.ts
└── mindmapService.ts
```

Essa separação mantém as páginas e componentes independentes dos detalhes das requisições HTTP.

---

## 📌 Sobre a reconstrução

O frontend original não estava mais disponível no repositório anterior. A versão atual foi reconstruída a partir do material de produção preservado, mantendo como referência o comportamento, as rotas, os textos, os fluxos e a comunicação necessária com a API.

Durante a reconstrução, alguns nomes internos e detalhes de organização foram naturalmente reorganizados, mas o objetivo foi preservar a experiência e o contrato funcional da aplicação original.

---

## 👨‍💻 Autor

**Weslley Eugênio**

GitHub: [@Weslley-141](https://github.com/Weslley-141)

