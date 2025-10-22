# Etapa 1: build de Angular
FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --prod

# Etapa 2: servir con Nginx
FROM nginx:alpine

# Eliminar el contenido default de Nginx
RUN rm -rf /usr/share/nginx/html/*

# copy build
COPY --from=build /app/dist/practica-mapa/browser /usr/share/nginx/html

# copy configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
