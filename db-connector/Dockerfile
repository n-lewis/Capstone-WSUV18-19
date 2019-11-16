FROM node:8

WORKDIR /usr/src/app
COPY ./package* ./

RUN npm install && npm install -g nodemon

EXPOSE 8080
# CMD nodemon -x 'node /usr/src/app/index.js || touch /usr/src/app/index.js'
CMD node /usr/src/app/index.js

