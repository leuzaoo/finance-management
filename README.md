# FinSafe - Aplicativo web de Gestão Financeira Pessoal

O **FinSafe** é uma aplicação web para controle e visualização de finanças pessoais. Permite o gerenciamento de contas bancárias, receitas, despesas, assinaturas recorrentes e geração de gráficos financeiros com base em categorias e períodos.  

Desenvolvido com foco em organização, produtividade e visão clara dos gastos.

---

## Funcionalidades

- ✅ Autenticação com JWT (via cookies HttpOnly)
- ✅ Cadastro de contas bancárias (wallets)
- ✅ Registro de receitas e despesas
- ✅ Assinaturas recorrentes
- ✅ Filtragem por data, tipo e categoria
- ✅ Gráficos interativos com Recharts
- ✅ Interface responsiva com Tailwind CSS

---

## Tecnologias utilizadas

| Camada | Stack |
|--------|-------|
| Frontend | Next.js (App Router), TypeScript, Tailwind CSS, Zustand, Recharts |
| Backend | Node.js, Express, TypeScript, MongoDB, JWT |
| Hospedagem | Vercel (frontend) + Render (backend) |
| Outros | Axios, React Toastify, Cookies, ESLint, Prettier |

---

## Instalação e execução local

- Node.js 18+
- MongoDB local ou MongoDB Atlas
- Yarn ou NPM

```bash
git clone https://github.com/leuzaoo/finance-management.git
cd backend
cp .env.example .env
# configure as variáveis como MONGO_URI e JWT_SECRET
npm install
npm run dev
```

```bash
cd ../frontend
cp .env.local.example .env.local
# configure o ambiente, ex: NODE_ENV=development
npm install
npm run dev
```
## 📁 Estrutura do projeto (resumo)

```
/backend
  ├── src/
  │   ├── controllers/
  │   ├── routes/
  │   ├── services/
  │   ├── middlewares/
  │   └── models/
  └── index.ts

/frontend
  ├── app/
  │   ├── (auth)/
  │   ├── (dashboard)/
  ├── components/
  ├── store/
  ├── utils/
  └── styles/
  ```

## 🔐Autenticação

- Autenticação via JWT, armazenado em cookies HttpOnly.
- Rotas protegidas no backend via middleware.
- No frontend, controle de sessão via Zustand.

## 👨‍💻 Autor
Leonardo Costa de Oliveira
Desenvolvedor full-stack
