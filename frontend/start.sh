#!/bin/sh
service nginx start
while [ 1 ]
do
    sleep 2
done
# Short-ish sleep to not waste cycles AND be killable
