FROM node:latest AS build

WORKDIR /nuxtapp
COPY . .
RUN npm install && npm run build

FROM node:latest AS server
WORKDIR /nuxtapp
COPY --from=build /nuxtapp/.output .output
ENTRYPOINT ["node", ".output/server/index.mjs"]
