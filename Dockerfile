# Usa una imagen oficial de Node.js.
FROM node:20-alpine

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos de definición de paquetes e instala las dependencias
COPY package*.json ./
RUN npm install

# Copia el resto de los archivos de tu proyecto
COPY . .

# Comando para iniciar la aplicación en modo desarrollo
CMD [ "npm", "run", "dev" ]