FROM php:7.2-apache

# Update and install `composer`
RUN apt-get update && \
    apt-get install -y --no-install-recommends git zip && \
    curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Tools for installing mupdf
RUN apt-get install -y software-properties-common
RUN add-apt-repository ppa:ubuntuhandbook1/apps
RUN apt-get install -y mupdf mupdf-tools

EXPOSE 80
COPY ./src /var/www/html/

# Not a best practice, but better than keeping dependencies in the repo.
RUN cd /var/www/html && composer install

