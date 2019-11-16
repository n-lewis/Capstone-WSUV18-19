FROM node:8

WORKDIR /usr/src/app
COPY ./package* ./

RUN npm install && npm install -g nodemon

EXPOSE 8080
CMD [ "nodemon", "/usr/src/app/index.js" ]
