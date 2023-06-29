# Establecer la imagen base
FROM node:18.16.0

#Crear y establecer el directorio de mi contenedor

WORKDIR /backend

#Agrego argumentos para el .env, por defecto desarrollo
ARG ENV_FILE = .env.development
#Comando para ejecutar: docker build --build-arg ENV_FILE=.env.production -t test:production .


#Copio todos los archivos de src al directorio de trabajo

COPY src ./src
COPY package*.json ./
COPY $ENV_FILE ./

#Instalar dependencias

RUN npm install

# Puerto de app

EXPOSE 8080

#Comando para iniciar mi aplicacion 

CMD ["node", "src/index.js"]

#Comandos para compilar y ejecutar
#docker build -t index.js .
#docker run -p 8080:8080 index.js
#docker tag "imagen" "username"/"imagen:version"
#docker push "username"/"imagen:version"