# Utiliser une image de Node.js officielle comme base
FROM node:18-buster

# Définir le répertoire de travail
WORKDIR /usr/src/app

# Installer cron et les dépendances nécessaires pour Puppeteer
RUN apt-get update && apt-get install -y \
  wget \
  ca-certificates \
  fonts-liberation \
  libappindicator3-1 \
  libasound2 \
  libatk-bridge2.0-0 \
  libatk1.0-0 \
  libcups2 \
  libdbus-1-3 \
  libgdk-pixbuf2.0-0 \
  libnspr4 \
  libnss3 \
  libx11-xcb1 \
  libxcomposite1 \
  libxdamage1 \
  libxrandr2 \
  xdg-utils \
  libgbm1 \
  cron \
  && rm -rf /var/lib/apt/lists/*

# Copier le fichier package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances Node.js
RUN npm install

# Installer le navigateur
RUN npx puppeteer browsers install chrome

# Copier les fichiers de l'application
COPY . .

# Ajouter le cron job pour exécuter le script toutes les 5 minutes (par exemple)
#RUN echo "*/* * * * * root cd /usr/src/app && node script.js >> /usr/src/app/cron.log 2>&1" >> /etc/crontab

# Démarrer cron en tâche de fond
#CMD service cron start && tail -f /usr/src/app/cron.log

# Démarrer le script node
CMD node script.js