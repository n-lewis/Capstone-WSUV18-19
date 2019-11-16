FROM ubuntu:latest
RUN apt-get -y update
RUN apt-get install -y apt-utils nginx nodejs npm dos2unix
COPY nginx.conf /etc/nginx/nginx.conf
COPY ./start.sh /usr/local/bin/start.sh
RUN dos2unix /usr/local/bin/start.sh

RUN npm i -g parcel
RUN mkdir -p /app
COPY . /app
RUN cd /app && npm install && npm run build
RUN mkdir -p /var/www && mv /app/dist /var/www && \
   chmod -R 644 /var/www/dist && chmod 775 /var/www/dist

EXPOSE 80

ENTRYPOINT ["sh", "/usr/local/bin/start.sh"]
