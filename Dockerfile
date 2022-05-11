FROM node:17

WORKDIR /usr/src
COPY package.json package-lock.json tsconfig.json webpack.* ./
COPY src ./src
COPY public ./public

RUN ["sh", "-c", "npm ci --cache=/usr/src/.cache && npm install --global cross-env && npm run tsc && npm run build"]
ENV NODE_ENV=production
