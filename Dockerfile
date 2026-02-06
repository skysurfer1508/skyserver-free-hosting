# --- Stage 1: Build ---
FROM node:18-alpine AS build

# Arbeitsverzeichnis im Container
WORKDIR /app

# Abhängigkeiten kopieren und installieren
COPY package.json package-lock.json* ./
RUN npm install

# Den restlichen Code kopieren
COPY . .

# Die App bauen (erstellt meistens einen 'dist' Ordner)
RUN npm run build

# --- Stage 2: Serve ---
FROM nginx:alpine

# Kopiere die gebaute App aus Stage 1 zum Nginx Server
# HINWEIS: Base44 nutzt meist Vite, daher ist der Ordner 'dist'. 
# Falls es Create-React-App ist, ändere 'dist' zu 'build'.
COPY --from=build /app/dist /usr/share/nginx/html

# Kopiere unsere eigene Nginx-Config (siehe Schritt 2)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
