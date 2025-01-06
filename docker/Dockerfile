FROM node:lts AS build

WORKDIR /app

COPY web/package.json web/yarn.lock ./
RUN yarn install
COPY web .
RUN yarn build

FROM nginx:alpine AS server

COPY --from=build /app/dist /usr/share/nginx/html
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

