# Sistema de Transferências Financeiras - Tech Test

Sistema completo de transferências financeiras desenvolvido com NestJS, incluindo autenticação JWT, gestão de usuários, transações, sistema de logging avançado e monitoramento com ELK Stack.


## Índice

- [Descrição](#descrição)
- [Requisitos](#requisitos)
- [Instalação e Inicialização](#instalação-e-inicialização)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Documentação da API](#documentação-da-api)
- [Sistema de Monitoramento e Logging](#sistema-de-monitoramento-e-logging)


## Descrição

Este projeto é um teste técnico que implementa um sistema completo de transferências financeiras. O sistema permite:

- Registro e autenticação de usuários
- Gestão completa de usuários (CRUD)
- Transferências entre contas
- Reversão de transações (apenas administradores)
- Sistema de logging estruturado
- Monitoramento em tempo real com ELK Stack


## Requisitos

### Requisitos do Sistema
- **Node.js** >= 18.x
- **NPM** >= 8.x
- **Docker** e **Docker Compose**

### Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
NODE_ENV=development
API_PORT=3025
SERVICE_HOST=0.0.0.0
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=tech-test
DATABASE_PASSWORD=password
DATABASE_NAME=tech-test
JWT_ACCESS_EXPIRES_IN=5m
JWT_REFRESH_EXPIRES_IN=7d
JWT_SECRET=secret
```

## Instalação e Inicialização

### 1. Clone o repositório
```bash
git clone https://github.com/marcuuscardoso/adriano-cobuccio-tech-test
cd adriano-cobuccio-tech-test
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure as variáveis de ambiente
Crie o arquivo `.env` na raiz do projeto com as configurações mostradas na seção [Requisitos](#requisitos).

### 4. Inicie os serviços de infraestrutura
```bash
docker compose up -d
```

### 5. Execute a aplicação
```bash
npm run start:dev
```

A aplicação estará disponível em `http://localhost:3025`



## Estrutura do Projeto

O projeto segue uma arquitetura modular baseada em Clean Architecture e Domain-Driven Design:

```
src/
├── apps/                    # Configuração principal da aplicação
│   ├── default/            # Módulo principal e health check
│   └── main.ts             # Ponto de entrada da aplicação
│
├── modules/                # Módulos de domínio
│   ├── auth/              # Autenticação e autorização
│   ├── users/             # Gestão de usuários
│   └── transactions/      # Sistema de transações
│
├── commons/               # Utilitários compartilhados
│   ├── general/          # Filtros, interceptors, loggers
│   └── validators/       # Validadores customizados
│
└── infra/                # Infraestrutura
    └── persistence/      # Configuração do banco de dados
        ├── config/       # Configuração do TypeORM
        ├── database/     # Entidades, migrations, repositórios
        └── entities/     # Definição das entidades
```

## Documentação da API

A API utiliza versionamento através da URL (`/api/v1/`) e implementa autenticação JWT para proteger as rotas. Todas as rotas retornam dados no formato JSON.

**Base URL:** `http://localhost:3025/api`

**Autenticação:** Bearer Token (JWT) no header `Authorization`

---

### Módulo de Autenticação

**POST** `/v1/auth/register`

Cria uma nova conta de usuário no sistema

**Payload:**
```json
{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "minhasenha123",
  "phone": "11987654321",
  "cpf": "12345678901",
  "type": "both",
  "balance": 1000.00
}
```
---

**POST** `/v1/auth/signin`

Autentica um usuário e retorna tokens de acesso via cookie httpOnly

**Payload:**
```json
{
  "email": "joao@email.com",
  "password": "minhasenha123"
}
```

---

**POST** `/v1/auth/signout`

Desloga o usuário e invalida os tokens

**Resposta de Sucesso (200):**
```json
{
  "message": "Logout realizado com sucesso"
}
```

---

**POST** `/v1/auth/refresh`

Renova o token de acesso usando o refresh token


**Resposta de Sucesso (200):**
```json
{
  "accessToken": "novo-jwt-token-aqui"
}
```

---

**GET** `/v1/auth/me`

Retorna as informações do usuário autenticado

**Resposta de Sucesso (200):**
```json
{
  "id": "uuid-do-usuario",
  "name": "João Silva",
  "email": "joao@email.com",
  "phone": "11987654321",
  "cpf": "12345678901",
  "balance": 1000.00,
  "type": "both",
  "role": "user",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

---

### Módulo de Usuários


**POST** `/v1/users`

**Descrição:** Cria um novo usuário (apenas administradores)

**Permissões:** ADMIN

**Corpo da Requisição:** Mesmo formato do registro

**Resposta:** Mesmo formato do registro

---

**GET** `/v1/users`

Lista todos os usuários cadastrados no sistema

**Resposta de Sucesso (200):**
```json
[
  {
    "id": "uuid-usuario-1",
    "name": "João Silva",
    "email": "joao@email.com",
    "phone": "11987654321",
    "cpf": "12345678901",
    "balance": 1000.00,
    "type": "both",
    "role": "user",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
]
```

---

**GET** `/v1/users/:id`

Retorna os dados de um usuário específico

**Parâmetros da URL:**
- `id`: UUID do usuário

**Resposta de Sucesso (200):** Objeto do usuário (mesmo formato da listagem)

---

**PATCH** `/v1/users/:id`

Atualiza os dados de um usuário existente

**Parâmetros da URL:**
- `id`: UUID do usuário

**Corpo da Requisição:**
```json
{
  "name": "João Silva Santos",
  "phone": "11999888777",
  "balance": 1500.00
}
```

**Observações:**
- Todos os campos são opcionais
- Email e CPF não podem ser alterados
- Senha deve ser enviada como `password` se for alterada

---

**DELETE** `/v1/users/:id`

Remove um usuário do sistema

**Parâmetros da URL:**
- `id`: UUID do usuário

**Resposta de Sucesso (204):** Sem conteúdo

---

### Módulo de Transações

**POST** `/v1/transactions/transfer`

**Corpo da Requisição:**
```json
{
  "receiverId": "uuid-do-destinatario",
  "amount": 250.50,
  "description": "Pagamento de serviços"
}
```

**Regras de Negócio:**
- O remetente deve ter saldo suficiente
- Remetente e destinatário devem ser diferentes
- Destinatário deve aceitar recebimentos (type: "receiver" ou "both")
- Remetente deve poder enviar (type: "sender" ou "both")

---

**POST** `/v1/transactions/reverse`

Reverte uma transação existente (apenas administradores)

**Corpo da Requisição:**
```json
{
  "transactionId": "uuid-da-transacao-original",
  "reason": "Transação fraudulenta"
}
```
**Regras de Negócio:**
- Apenas transações "completed" podem ser revertidas
- Uma transação só pode ser revertida uma vez
- A reversão transfere o valor de volta ao remetente original

---

**GET** `/v1/transactions/:id`

Retorna os detalhes de uma transação específica

**Parâmetros da URL:**
- `id`: UUID da transação

**Resposta de Sucesso (200):** Objeto da transação (mesmo formato da criação)

**Regras de Acesso:**
- Usuários comuns só podem ver transações onde são remetente ou destinatário
- Administradores podem ver qualquer transação

---

**GET** `/v1/transactions/user/:userId`

Lista todas as transações de um usuário específico

**Parâmetros da URL:**
- `userId`: UUID do usuário

**Resposta de Sucesso (200):** Array de transações

---

**GET** `/v1/transactions/my/transactions`

Lista todas as transações do usuário autenticado

**Resposta de Sucesso (200):**
```json
[
  {
    "id": "uuid-transacao-1",
    "amount": 250.50,
    "description": "Pagamento de serviços",
    "type": "transfer",
    "status": "completed",
    "senderId": "uuid-do-usuario-logado",
    "receiverId": "uuid-do-destinatario",
    "senderName": "João Silva",
    "receiverName": "Maria Santos",
    "createdAt": "2024-01-15T15:30:00.000Z",
    "updatedAt": "2024-01-15T15:30:00.000Z"
  }
]
```

---

### Health Check

**GET** `/health/status`

Verifica se a aplicação está funcionando corretamente

**Resposta de Sucesso (200):**
```json
{
  "status": true
}
```


## Sistema de Monitoramento e Logging

O projeto implementa um sistema completo de observabilidade usando ELK Stack para monitoramento e análise de logs em tempo real.

### Componentes do Sistema

#### Winston Logger
- Sistema de logging estruturado com formato JSON
- Logs rotativos diários na pasta `logs/app-YYYY-MM-DD.log`
- Níveis de log: error, warn, info, http, debug
- Retenção automática de 30 dias
- Logs tanto no console quanto em arquivos

#### Elasticsearch
- Armazenamento e indexação centralizada dos logs
- Configuração single-node para desenvolvimento
- Permite buscas complexas e agregações nos logs

#### Filebeat
- Coleta automática dos logs da pasta `/logs`
- Envia dados estruturados para o Elasticsearch
- Processamento em tempo real dos logs

#### Kibana
- Interface web para visualização e análise
- Disponível na porta 5601
- Dashboards para monitoramento
- Filtros e buscas nos logs

### Acesso ao Sistema de Monitoramento

- **Kibana Dashboard**: http://localhost:5601
- **Elasticsearch API**: http://localhost:9200
- **Logs locais**: Pasta `./logs/` no projeto