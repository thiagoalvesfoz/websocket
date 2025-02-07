# Etapa 1: Construção
FROM node:22-alpine AS builder

# Instala dependências do SO e o PNPM globalmente
RUN apk add --no-cache curl \
    && npm install -g pnpm

# Define o diretório de trabalho
WORKDIR /app

# Copia apenas os arquivos essenciais para instalar as dependências
COPY package.json pnpm-lock.yaml ./

# Instala apenas as dependências de produção
RUN pnpm install --frozen-lockfile --prod

# Copia o restante do código para dentro da imagem
COPY . .

# Compila o código TypeScript para JavaScript
RUN pnpm run build

# Etapa 2: Execução
FROM node:22-alpine AS runner

# Instala dependências do SO e o PNPM globalmente
RUN apk add --no-cache curl \
    && npm install -g pnpm

# Define o diretório de trabalho
WORKDIR /app

# Copia apenas os arquivos necessários da etapa anterior
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Define a variável de ambiente para produção
ENV NODE_ENV=production

# Expõe a porta do servidor NestJS
EXPOSE 3000

# Comando de inicialização
CMD ["node", "dist/main"]
