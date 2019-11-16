#!/usr/bin/env bash

docker build -t database .

docker run -d -p 3306:3306 --name database -e MYSQL_ROOT_PASSWORD=atlas database
