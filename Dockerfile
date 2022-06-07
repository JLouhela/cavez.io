FROM node:17

WORKDIR /usr/src
COPY package.json package-lock.json tsconfig.json webpack.* ./
RUN ["sh", "-c", "npm ci --cache=/usr/src/.cache && npm install --global cross-env"]

COPY .env .
COPY src ./src
COPY public ./public

RUN npm run tsc
RUN npm run build

ENV NODE_ENV=production
