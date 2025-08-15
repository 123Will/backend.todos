# 🚕 Taxi Backend API

> **Node.js + TypeScript + Express + SQLite** - Backend API para sistema de táxis

## 🛠️ Tecnologias Utilizadas

### **Runtime & Linguagem**
- **Node.js** - Runtime JavaScript
- **TypeScript** - Linguagem de programação tipada

### **Framework & Bibliotecas**
- **Express.js** - Framework web para Node.js
- **SQLite** - Banco de dados local
- **Axios** - Cliente HTTP
- **Dotenv** - Gerenciamento de variáveis de ambiente

### **Ferramentas de Desenvolvimento**
- **ts-node-dev** - Desenvolvimento com hot reload
- **TypeScript Compiler** - Compilação TypeScript

### **Containerização**
- **Docker** - Containerização da aplicação
- **Docker Compose** - Orquestração de containers

## 📁 Estrutura do Projeto

```
backend.todos/
├── src/
│   ├── controllers/     # Controladores da API
│   ├── models/         # Modelos de dados
│   ├── repositories/   # Camada de acesso a dados
│   ├── routes/         # Rotas da API
│   ├── services/       # Lógica de negócio
│   ├── utils/          # Utilitários
│   ├── database.ts     # Configuração do banco
│   ├── database-init.ts # Inicialização do banco
│   └── index.ts        # Ponto de entrada
├── data/               # Dados do SQLite
├── dist/               # Código compilado
├── package.json        # Dependências Node.js
├── tsconfig.json       # Configuração TypeScript
├── Dockerfile          # Container Docker
└── docker-compose.yml  # Orquestração Docker
```

## 🚀 Como Executar

### Pré-requisitos
- **Node.js** (versão 16 ou superior)
- **npm** ou **yarn**
- **Docker** (opcional)

### Instalação Local

1. **Instalar dependências:**
```bash
npm install
```

2. **Configurar variáveis de ambiente:**
```bash
cp .env.example .env
# Editar o arquivo .env com suas configurações
```

3. **Inicializar banco de dados:**
```bash
npm run db:init
```

4. **Executar em desenvolvimento:**
```bash
npm run dev
```

5. **Build para produção:**
```bash
npm run build
npm start
```

### Execução com Docker

```bash
# Construir e executar com Docker Compose
docker-compose up --build

# Ou apenas com Docker
docker build -t taxi-backend .
docker run -p 3000:3000 taxi-backend
```

## 📋 Scripts Disponíveis

- `npm run dev` - Executa em modo desenvolvimento com hot reload
- `npm run build` - Compila o TypeScript para JavaScript
- `npm run start` - Executa a aplicação em produção
- `npm run db:init` - Inicializa o banco de dados SQLite

## 🔧 Configuração

### Variáveis de Ambiente (.env)
```env
PORT=3000
NODE_ENV=development
DATABASE_URL=./data/taxi.db
```

## 📊 Banco de Dados

Este projeto utiliza **SQLite** como banco de dados local, armazenado em `./data/taxi.db`.

## 🐳 Docker

O projeto inclui configuração completa para Docker:

- **Dockerfile** - Imagem da aplicação
- **docker-compose.yml** - Orquestração de serviços
- **.dockerignore** - Arquivos ignorados no build

## 📝 API Endpoints

A API REST está disponível em `http://localhost:3000` com os seguintes endpoints:

- `GET /` - Health check
- `GET /todos` - Listar todos
- `POST /todos` - Criar novo todo
- `PUT /todos/:id` - Atualizar todo
- `DELETE /todos/:id` - Deletar todo

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

**Desenvolvido com ❤️ usando Node.js + TypeScript**
