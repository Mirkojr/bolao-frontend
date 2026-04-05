# Sistema de Bolão - Frontend

Frontend da aplicação de bolão esportivo. O projeto concentra as telas de login, listagem de bolões, administração de jogos e interação com placares e palpites.

## Visão geral

Esta aplicação foi construída para facilitar a gestão do bolão no dia a dia. Ela consome a API do backend para autenticação, listagem de jogos, criação de partidas, atualização de placares e outras operações do sistema.

## Tecnologias utilizadas

- React 19
- Vite
- TypeScript
- Tailwind CSS
- React Router DOM

## Pré-requisitos

Antes de rodar o projeto, tenha instalado:

- Git
- Node.js 18 ou superior
- Backend da aplicação em execução

## Instalação

```bash
npm install
```

## Variáveis de ambiente

Crie um arquivo `.env` na raiz do frontend com a URL da API:

```env
VITE_API_URL=http://localhost:3000
```

O cliente HTTP usa essa variável para montar as requisições ao backend.

## Como rodar em desenvolvimento

```bash
npm run dev
```

Depois, acesse:

```text
http://localhost:5173/
```

## Scripts disponíveis

- `npm run dev`: sobe a aplicação em modo de desenvolvimento
- `npm run build`: gera o build de produção
- `npm run lint`: executa a análise estática com ESLint
- `npm run preview`: visualiza o build localmente

## Backend necessário

O frontend depende do backend para funcionar corretamente. Em geral, é preciso subir a API antes de testar login, listagens e ações de administração.

Se o backend estiver no mesmo repositório local, entre na pasta da API e suba os containers:

```bash
cd bolao-backend-api
docker compose up -d
```

## Estrutura do projeto

```text
src/
├── context/        # Contextos globais, como autenticação
├── layout/         # Layout base da aplicação
├── pages/          # Páginas da aplicação
├── routes/         # Configuração das rotas
└── shared/         # Recursos compartilhados
      ├── api/        # Cliente HTTP
      ├── components/ # Componentes reutilizáveis de UI
      ├── hooks/      # Hooks de acesso a dados e regras de negócio
      ├── interfaces/ # Tipos e contratos TypeScript
      └── services/   # Serviços de comunicação com a API
```

## Funcionalidades principais

- Autenticação de usuário
- Listagem de bolões
- Administração de jogos
- Criação de jogos e atualização de placares
- Visualização de participantes e rankings
- Fluxo de navegação com React Router

## Observações

- O token de autenticação é armazenado no navegador e enviado automaticamente nas requisições autenticadas.
- Se a interface não carregar dados, verifique primeiro se o backend está rodando e se `VITE_API_URL` está correto.