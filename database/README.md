# Database Documentation


## Getting Started

To manually build the docker instance for the mySQL database run the following command in the database folder.
```
./database-me-captain.sh
```
This will create and run a mysql docker container with the following attributes

* Docker instance name = database
* Instance port number = 3306
* Default password for root = atlas
* Schema to connect to = atlas

The IP for connecting to the instance can be found by running
```
docker-machine ip default
```



### Connecting to database instance via bash

To connect to the docker instance's bash terminal input

```
docker exec -it database bash
```
Then to connect to the mysql db run
```
mysql -uroot -p
```
And finally enter the password to connect.



## Author

* **Jonathon Carothers**
