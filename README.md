# Sistema de Bolão - Frontend

Aplicação frontend para o gerenciamento e participação em bolões esportivos do meu pai. 

## Tecnologias Utilizadas

- **[React](https://reactjs.org/)** 
- **[Vite](https://vitejs.dev/)** 
- **[TypeScript](https://www.typescriptlang.org/)** 
- **[Tailwind CSS](https://tailwindcss.com/)** 
- **[React Router DOM](https://reactrouter.com/)**

## Pré-requisitos

Antes de começar, você vai precisar ter as seguintes ferramentas instaladas na sua máquina:
- [Git](https://git-scm.com)
- [Node.js](https://nodejs.org/en/) (versão 18 ou superior)
- Backend da aplicação rodando via [Docker](https://www.docker.com/)

## Como rodar o projeto localmente

**1. Instale as dependências:**
\`\`\`bash
npm install
\`\`\`

**2. Configure as Variáveis de Ambiente:**
Crie um arquivo \`.env\` na raiz do projeto e adicione a URL do backend:
\`\`\`env
VITE_API_URL=http://localhost:3000 
\`\`\`

**3. Execute a aplicação em modo de desenvolvimento:**
\`\`\`bash
npm run dev
\`\`\`
O servidor iniciará localmente. Acesse \`http://localhost:5173/\` no seu navegador.

---

## Arquitetura do Projeto

O projeto segue uma arquitetura baseada em divisão por responsabilidades 

\`\`\`text
src/
 ├── layout/         # Layouts base da aplicação (NavBar, Footer, Sidebars)
 ├── pages/          # Páginas roteáveis do sistema
 ├── routes/         # Configuração do React Router
 └── shared/         # Recursos globais da aplicação
      ├── components/# Componentes de UI genéricos (Button, Input, Modal)
      ├── hooks/     # Custom Hooks (useBoloes, useJogos)
      ├── interfaces/# Tipagens TypeScript e Contratos
      └── services/  # Camada de comunicação com a API (HTTP Client e endpoints)
\`\`\`

## Rodando o Backend

Para que o login e as listagens funcionem, lembre-se de subir os containers do backend em um terminal separado:
\`\`\`bash
cd bolao-backend-api
docker compose up -d
\`\`\`