FROM ubuntu:latest

RUN apt-get -y update
RUN apt-get install -y apt-utils nginx libssl-dev autoconf \
    g++ make openssl libssl-dev libcurl4-openssl-dev \
    libcurl4-openssl-dev pkg-config libsasl2-dev dos2unix

COPY nginx.conf /etc/nginx/nginx.conf

# Breaks without these?
RUN mkdir -p /nginx/tmp
RUN touch /nginx/tmp/error.log && touch /nginx/tmp/access.log

RUN mkdir -p /usr/local/bin
COPY start.sh /usr/local/bin/start.sh
RUN chmod +x /usr/local/bin/start.sh && dos2unix /usr/local/bin/start.sh

COPY csr.config /opt/csr.config
RUN chmod 700 /opt/csr.config

RUN mkdir -p /etc/nginx/ssl
RUN chown -R root:root /etc/nginx/ssl
RUN chmod -R 700  /etc/nginx/ssl
RUN cd /etc/nginx/ssl && \
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout server.key -out server.crt -batch -config /opt/csr.config && \
    chmod 700 server.crt && \
    chmod 700 server.key

EXPOSE 4443

ENTRYPOINT ["sh", "/usr/local/bin/start.sh"]
