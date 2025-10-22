# 💳 Sistema de Pagamentos - API RESTful

API RESTful para gerenciamento de pagamentos desenvolvida como solução do desafio backend. O sistema permite cadastro de usuários, criação de cobranças e suporte a múltiplos métodos de pagamento (PIX, Cartão de Crédito e Boleto Bancário).

---

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Arquitetura](#-arquitetura)
- [Tecnologias e Bibliotecas](#-tecnologias-e-bibliotecas)
- [Funcionalidades Implementadas](#-funcionalidades-implementadas)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação e Execução](#-instalação-e-execução)
- [Documentação da API (Swagger)](#-documentação-da-api-swagger)
- [Estrutura de Diretórios](#-estrutura-de-diretórios)
- [Controle de Idempotência](#-controle-de-idempotência)
- [Autenticação e Autorização](#-autenticação-e-autorização)
- [Testes](#-testes)

---

## 🎯 Visão Geral

O sistema foi desenvolvido seguindo os princípios de **Domain-Driven Design (DDD)** e **Clean Architecture**, garantindo separação clara entre regras de negócio, casos de uso e infraestrutura. A API oferece endpoints para gerenciamento completo de usuários e cobranças, com foco em segurança, idempotência e validação rigorosa de dados.

### Principais Características

- **Arquitetura Limpa (Clean Architecture)**: Separação em camadas bem definidas
- **DDD (Domain-Driven Design)**: Entidades ricas com lógica de negócio encapsulada
- **Idempotência**: Controle de requisições duplicadas através de chave UUID
- **Validação Robusta**: Uso de DTOs com `class-validator` para validação automática
- **Autenticação JWT**: Sistema de autenticação stateless com controle de roles (ADMIN/USER)
- **Documentação Interativa**: Swagger UI completo em português
- **Performance**: Uso do Fastify para alta performance e baixa latência

---

## 🏗️ Arquitetura

O projeto segue uma arquitetura em camadas inspirada em **Clean Architecture** e **DDD**, organizando o código em três camadas principais:

### 1. **Core (Domínio + Application)**

#### **Domain (`src/core/domain/`)**
Contém as **entidades de domínio** e **enums** — regras de negócio puras, independentes de frameworks.

- **Entidades**: `Charge`, `User`
  - Encapsulam estado e comportamento do domínio
  - Métodos como `markAsPaid()`, `markAsCancelled()`, `validatePaymentData()`
  - Factories estáticas para criação de tipos específicos (PIX, Cartão, Boleto)
  
- **Enums**: `ChargeStatus`, `PaymentMethod`, `UserRole`

#### **Application (`src/core/application/`)**
Contém **casos de uso** (use cases), **DTOs** e **interfaces de repositórios** — orquestra a lógica de negócio sem depender de detalhes de infraestrutura.

- **Use Cases**: 
  - `CreateChargeUseCase`, `ChangeStatusOfChargeUseCase`, `DeleteChargeByIdUseCase`
  - `CreateUserUseCase`, `LoginUseCase`, `GetUsersUseCase`
  - Cada caso de uso executa uma operação específica e completa do sistema
  
- **DTOs**: Objetos de transferência de dados com validações (`class-validator`)
- **Repositories (interfaces)**: Contratos abstratos para persistência de dados

### 2. **Infra (Infraestrutura)**

Implementações concretas de serviços externos, persistência, autenticação e módulos do NestJS.

#### **Database (`src/infra/database/`)**
- **Prisma ORM**: Gerenciamento de migrations e queries
- **Repositórios concretos**: Implementam as interfaces definidas no core
  - `PrismaChargeRepository`, `PrismaUserRepository`, `PrismaIdempotencyKeyRepository`

#### **Auth (`src/infra/auth/`)**
- **JWT Strategy**: Validação de tokens com Passport
- **Guards**: `JwtAuthGuard` (verifica token), `RolesGuard` (verifica permissões)
- **Decorators**: `@Roles()`, `@CurrentUser()` para facilitar uso nos controllers

#### **Modules (`src/infra/modules/`)**
- **Charges Module**: Agrupa controllers e providers relacionados a cobranças
- **User Module**: Agrupa controllers e providers relacionados a usuários
- **Auth Module**: Agrupa lógica de autenticação e geração de tokens

#### **Filters (`src/infra/filters/`)**
- `UnauthorizedExceptionFilter`: Tratamento centralizado de erros de autenticação

### 3. **Presentation (Controllers)**

Controllers HTTP que recebem requisições, validam DTOs e delegam para os casos de uso.

- Todos os controllers usam decorators Swagger para documentação automática
- Validação automática via `ValidationPipe`
- Guards para proteger rotas que exigem autenticação/autorização

### Diagrama Simplificado

```
┌─────────────────────────────────────────────────────────┐
│                    Presentation Layer                    │
│              (Controllers + Swagger Docs)                │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│              Infrastructure Layer                        │
│     (Prisma Repos + Auth + Guards + External Services)   │
└────────────────────┬─────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│                  Application Layer                       │
│        (Use Cases + DTOs + Repository Interfaces)        │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│                    Domain Layer                          │
│           (Entities + Enums + Business Rules)            │
└──────────────────────────────────────────────────────────┘

```

### Princípios Aplicados

- **Dependency Inversion**: Camadas superiores dependem de abstrações, não de implementações concretas
- **Single Responsibility**: Cada classe/módulo tem uma única responsabilidade
- **Open/Closed**: Entidades abertas para extensão, fechadas para modificação
- **Separation of Concerns**: Lógica de negócio isolada de detalhes técnicos

---

## 🛠️ Tecnologias e Bibliotecas

### **Core Framework**
- **[NestJS](https://nestjs.com/)** `v11.0.1` - Framework Node.js progressivo para construção de aplicações server-side escaláveis
- **[Fastify](https://www.fastify.io/)** `v5.6.1` - Web framework de alta performance (substituindo Express)

### **Banco de Dados e ORM**
- **[PostgreSQL](https://www.postgresql.org/)** - Banco de dados relacional
- **[Prisma](https://www.prisma.io/)** `v6.17.1` - ORM moderno com type-safety e migrations declarativas

### **Validação e Transformação**
- **[class-validator](https://github.com/typestack/class-validator)** `v0.14.2` - Validação declarativa de DTOs via decorators
- **[class-transformer](https://github.com/typestack/class-transformer)** `v0.5.1` - Transformação de objetos plain em classes tipadas

### **Autenticação e Segurança**
- **[Passport](https://www.passportjs.org/)** `v0.7.0` - Middleware de autenticação
- **[passport-jwt](http://www.passportjs.org/packages/passport-jwt/)** `v4.0.1` - Estratégia JWT para Passport
- **[@nestjs/jwt](https://docs.nestjs.com/security/authentication#jwt-token)** `v11.0.1` - Módulo JWT do NestJS
- **[bcryptjs](https://github.com/dcodeIO/bcrypt.js)** `v3.0.2` - Hash de senhas

### **Documentação**
- **[@nestjs/swagger](https://docs.nestjs.com/openapi/introduction)** `v11.2.1` - Geração automática de documentação OpenAPI 3.0


### **Docker**
- **[Docker Compose](https://docs.docker.com/compose/)** - Orquestração de containers (PostgreSQL)

---

## ✨ Funcionalidades Implementadas

### ✅ Gestão de Usuários (Customers)
- [x] Cadastro de usuários com validações (nome, email, documento único)
- [x] Login com geração de token JWT
- [x] Listagem de usuários com paginação
- [x] Busca de usuário por ID
- [x] Atualização de dados do usuário
- [x] Exclusão de usuário
- [x] Controle de roles (ADMIN / USER)

### ✅ Gestão de Cobranças (Charges)
- [x] Criação de cobranças vinculadas a usuários existentes
- [x] Suporte a três métodos de pagamento:
  - **PIX**: Requer `pixKey`
  - **Cartão de Crédito**: Requer `cardNumber`, `cardHolderName`, `installments` (1-12)
  - **Boleto Bancário**: Requer `dueDate` (data futura), geração automática de código de barras
- [x] Validação de dados específicos por método de pagamento
- [x] Alteração de status de cobranças (PENDING → PAID / FAILED / EXPIRED / CANCELLED)
- [x] Busca de cobrança por ID
- [x] Exclusão de cobrança
- [x] Controle de idempotência na criação (evita duplicatas)

### ✅ Funcionalidades Extras
- [x] Documentação Swagger completa em português
- [x] Mascaramento de dados sensíveis (cartão de crédito) nas respostas
- [x] Normalização de chaves PIX e números de cartão
- [x] Validação automática de DTOs com mensagens customizadas
- [x] Tratamento centralizado de erros
- [x] Guards para proteção de rotas sensíveis (apenas ADMIN)

---

## 📦 Pré-requisitos

Antes de iniciar, certifique-se de ter instalado:

- **Node.js** >= 18.x ([Download](https://nodejs.org/))
- **npm** (incluído com Node.js) ou **pnpm** (opcional)
- **Docker** e **Docker Compose** ([Download](https://www.docker.com/))
- **Git** ([Download](https://git-scm.com/))

---

## 🚀 Instalação e Execução

### 1. Clone o repositório

```bash
git clone https://github.com/borsatogiordano/payment-system-challenge.git
cd payment-system-challenge
```

### 2. Instale as dependências

Com **npm**:
```bash
npm install
```

Ou com **pnpm** (opcional):
```bash
npm install -g pnpm
pnpm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/payment_system?schema=public"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="7d"
```

### 4. Suba o banco de dados PostgreSQL

```bash
docker-compose up -d
```

Isso irá iniciar um container PostgreSQL na porta `5432`.

### 5. Execute as migrations do Prisma

```bash
npx prisma migrate dev
```

Isso criará as tabelas no banco de dados.

### 6. (Opcional) Popule o banco com dados de exemplo

Você pode criar um usuário ADMIN manualmente via Prisma Studio:

```bash
npx prisma studio
```

Ou via endpoint `/auth/register` (após iniciar a aplicação).

### 7. Inicie a aplicação

#### Modo desenvolvimento (com hot-reload)
```bash
npm run start:dev
pnpm start:dev
```

#### Modo produção
```bash
npm run build
npm run start:prod
```

A API estará disponível em: **http://localhost:3000**

---

## 📖 Documentação da API (Swagger)

Toda a documentação interativa da API está disponível via **Swagger UI**.

### 🔗 Acesse a documentação em:

```
http://localhost:3000/api
```

### O que você encontrará no Swagger:

- **Lista completa de endpoints** organizados por módulos (Cobranças, Usuários, Autenticação)
- **Schemas de request/response** com exemplos em português
- **Testes interativos**: Execute requisições diretamente da interface
- **Autenticação**: Botão "Authorize" para adicionar o token JWT
- **Exemplos de payload** para cada método de pagamento (PIX, Cartão, Boleto)
- **Descrições detalhadas** de cada campo e possíveis erros

### Como testar via Swagger:

1. Acesse `http://localhost:3000/api`
2. Crie um usuário via `POST /auth/register`
3. Faça login via `POST /auth/login` e copie o `access_token`
4. Clique no botão **"Authorize"** (canto superior direito)
5. Cole o token no formato: `Bearer {seu_token_aqui}`
6. Agora você pode testar todos os endpoints protegidos!

---

## 📂 Estrutura de Diretórios

```
src/
├── core/                          # Camada de domínio e aplicação
│   ├── application/               # Casos de uso e lógica de aplicação
│   │   ├── dtos/                  # Data Transfer Objects (validação)
│   │   │   ├── auth-response.dto.ts
│   │   │   ├── change-charge-status.dto.ts
│   │   │   ├── create-charge.dto.ts
│   │   │   ├── create-user.dto.ts
│   │   │   └── ...
│   │   ├── repositories/          # Interfaces de repositórios
│   │   │   ├── charges.repository.ts
│   │   │   ├── user.repository.ts
│   │   │   └── idempotencyKey.repository.ts
│   │   ├── types/                 # Tipos compartilhados
│   │   │   └── pagination.types.ts
│   │   └── use-cases/             # Casos de uso (lógica de negócio)
│   │       ├── create-charge.usecase.ts
│   │       ├── change-status-charge.usecase.ts
│   │       ├── create-user.usecase.ts
│   │       └── ...
│   │
│   └── domain/                    # Entidades de domínio puras
│       ├── entities/
│       │   ├── charge.entity.ts   # Entidade Charge com regras de negócio
│       │   └── user.entity.ts     # Entidade User
│       └── enums/
│           ├── charge-status.enum.ts
│           ├── payment-method-enum.ts
│           └── user-role-enum.ts
│
├── infra/                         # Camada de infraestrutura
│   ├── auth/                      # Autenticação e autorização
│   │   ├── decorators/            # Decorators customizados (@Roles, @CurrentUser)
│   │   ├── guards/                # Guards (JwtAuthGuard, RolesGuard)
│   │   └── strategies/            # Estratégias Passport (JWT)
│   │
│   ├── database/                  # Persistência de dados
│   │   ├── repositories/          # Implementações concretas dos repositórios
│   │   │   ├── prisma-charge.repository.ts
│   │   │   ├── prisma-user.repository.ts
│   │   │   └── prisma-idempotency-key.repository.ts
│   │   ├── prisma.module.ts
│   │   └── prisma.service.ts
│   │
│   ├── filters/                   # Exception filters globais
│   │   └── unauthorized-exception.filter.ts
│   │
│   └── modules/                   # Módulos NestJS
│       ├── auth/
│       │   ├── auth.module.ts
│       │   └── controllers/
│       │       └── auth.controller.ts
│       ├── charges/
│       │   ├── charges.module.ts
│       │   └── controllers/
│       │       ├── create-charge.controller.ts
│       │       ├── change-status-of-charge.controller.ts
│       │       ├── delete-charge-by-id.controller.ts
│       │       └── get-charge-by-id.controller.ts
│       └── user/
│           ├── user.module.ts
│           └── controllers/
│               ├── create-user.controller.ts
│               ├── get-users.controller.ts
│               └── ...
│
├── app.module.ts                  # Módulo raiz da aplicação
└── main.ts                        # Bootstrap da aplicação (Fastify, Swagger, Pipes)

prisma/
├── schema.prisma                  # Schema principal (importa models)
├── models/                        # Models divididos por domínio
│   ├── charge.prisma
│   ├── idempotencyKey.prisma
│   └── user.prisma
└── migrations/                    # Histórico de migrations
```

---

## 🔐 Controle de Idempotência

A API implementa controle de idempotência na criação de cobranças para evitar cobranças duplicadas em caso de requisições repetidas (ex.: timeout, retry automático).

### Como funciona:

1. **Header obrigatório**: Toda criação de cobrança requer o header `Idempotency-Key` com um UUID v4 único.
   
   ```http
   POST /charges
   Idempotency-Key: 550e8400-e29b-41d4-a716-446655440000
   Authorization: Bearer {token}
   ```

2. **Armazenamento**: A chave é armazenada na tabela `idempotency_keys` vinculada à cobrança criada.

3. **Validade**: As chaves têm validade de **2 horas** (definida no momento da criação).

4. **Comportamento**:
   - **Requisição duplicada com mesmos dados**: Retorna a cobrança existente (idempotente ✅)
   - **Requisição duplicada com dados diferentes**: Retorna erro 400 indicando conflito
   - **Chave expirada**: Retorna erro 400 solicitando nova chave

### Exemplo de erro de conflito:

```json
{
  "statusCode": 400,
  "message": "Conflito de idempotência: campos diferentes detectados - amount, method, por favor, utilize uma chave de idempotência diferente para criar uma nova cobrança.",
  "error": "Bad Request"
}
```

---

## 🔒 Autenticação e Autorização

### Sistema de Autenticação

A API utiliza **JWT (JSON Web Tokens)** para autenticação stateless.

#### Fluxo de autenticação:

1. **Registro**: `POST /auth/register` - Cria um novo usuário
2. **Login**: `POST /auth/login` - Retorna `access_token` JWT
3. **Uso**: Inclua o token no header de requisições protegidas:
   ```
   Authorization: Bearer {seu_token_jwt}
   ```

### Roles (Permissões)

O sistema possui dois níveis de acesso:

- **USER**: Acesso básico (leitura)
- **ADMIN**: Acesso completo (criar, editar, deletar cobranças e usuários)

### Rotas Protegidas

Algumas rotas exigem autenticação e role específica:

| Rota | Autenticação | Role Requerida |
|------|--------------|----------------|
| `POST /charges` | ✅ | ADMIN |
| `PATCH /charges/status/:id` | ✅ | ADMIN |
| `DELETE /charges/:id` | ✅ | ADMIN |
| `GET /charges/:id` | ❌ | - |
| `POST /users` | ❌ | - |
| `DELETE /users/:id` | ✅ | ADMIN |

---

## 📝 Notas Técnicas

### Por que Fastify?

O projeto utiliza **Fastify** ao invés de Express por:
- **Performance**: ~65% mais rápido que Express em benchmarks
- **TypeScript-friendly**: Melhor suporte a tipos
- **Low overhead**: Menor consumo de memória

### Mascaramento de Dados Sensíveis

Dados sensíveis são automaticamente mascarados nas respostas:

- **Cartão de Crédito**: Apenas últimos 4 dígitos são expostos
  ```json
  {
    "cardNumber": "**** **** **** 1111"
  }
  ```

### Normalização de Dados

- **Chaves PIX**: Convertidas para lowercase e trim
- **Números de Cartão**: Remove caracteres não-numéricos antes de armazenar

---

## 📄 Licença

Este projeto foi desenvolvido como parte de um desafio técnico e é de uso educacional.

---

**Desenvolvido com ❤️ usando NestJS**