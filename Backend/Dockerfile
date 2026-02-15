# 1. Utilise une image Node.js stable
FROM node:18-alpine

# 2. Définit le dossier de travail
WORKDIR /app

# 3. Copie les fichiers de configuration npm
COPY package*.json ./

# 4. Installe les dépendances
RUN npm install

# 5. Copie le reste du code
COPY . .

# 6. Expose le port de ton API
EXPOSE 8000

# 7. Commande de lancement
CMD ["npm", "start"]