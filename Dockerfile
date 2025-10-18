# Usa a imagem base do Playwright já com o Chromium
FROM mcr.microsoft.com/playwright:v1.46.0-jammy

WORKDIR /app

# Instala dependências do projeto Node
COPY package*.json ./
RUN npm ci --silent

# Caso precise garantir instalação dos navegadores (geralmente já vem)
RUN npx playwright install --with-deps chromium

# Copia o restante do código (extensão, scripts, testes, etc)
COPY . .

# Gera build da extensão para dist/ e extension.zip
RUN node scripts/build-extension.mjs

# Comando padrão: roda testes E2E
CMD ["npm", "run", "test:e2e"]
