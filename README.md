# team-atlas-monorepo

## Disclosure
This is a modified version of the original repository removing code relating to authenticating user at the request of the sponsor. This is only meant to show off what was done during my senior year. 

In the current state this will NOT build.

## Building
[Docker](https://www.docker.com/get-started) and [Nginx](https://www.nginx.com/) are needed in order to build.

To build everything in `/team-atlas-monorepo` from scratch run the following:

For Mac: `cp nginx.conf.system /usr/local/etc/nginx/nginx.conf`

For Windows: `cp nginx.conf.system C:\nginx\conf\nginx.conf`

`npm install`

`cd frontend/ && npm install && cd ..`

`docker-compose build && docker-compose up`

To rebuild everything do the following:

 `docker-compose down && docker-compose build && docker-compose up`

To rebuild a specific service do the following: 

`docker-compose up -d --no-deps --build <service_name>`

You should NEVER be rebuilding the frontend during development, unless what you're working on
is related to docker configuration. Simply use the `nginx.conf.system.develop` and run `npm
run dev` inside `/frontend`

## Server info

Current deployment is handled on a [DigitalOcean](https://www.digitalocean.com/) droplet.

To build, make sure nginx is running with `nginx -s reload`, and run `docker-compose up -d` in `/home/monte/team-atlas-monorepo` (move that somewhere else where jenkins has full control later).

## Database

The database is ran on a remote [DigitalOcean](https://www.digitalocean.com/) droplet. 

## Docker
To run the docker container:

 - Your directory structure must look like:
```
  |team-atlas/
    |-config.properties
    |-team-atlas-monorepo/
      |-.git/
      |-Everything else
```

You must also must be proxying all 443 traffic to https port 4443 and have local ssl setup.

Use the `nginx.conf.system.develop` file to enable hot-loading.

Then type `docker-compose up -d` (`-d` starts in daemon mode).

# [FrontEnd](./frontend/)


## Building

To DEVELOP, put the `nginx.conf.system.develop` file in your `/etc/nginx`
directory and restart your nginx service. This will allow for hot-loading (as long as you
run `npm run dev` in the frontend directory!)

## Overview
The frontend is built in [Vue](https://vuejs.org/) with the left bar as its own component. This could be expanded on by have sub components with options for the individual templates.

The canvas that renders the 3d models is done in [Threejs](https://threejs.org/) library. Each template has its own file and has a reference to the [canvas.js](./frontend/src/threejs/canvas.js) object. They render themselves in order to accomplish folding. As of now the fold line can not be moved it is stationary in the center of the page or fractioned out for more complex folds. The ability to change the folds from horizontal to vertical does exist.

# [AAA-Service](./aaa-service/)
This is the HP login service

# [DB-Connector](./db-connector/index.js)
An [Express](https://expressjs.com/) server RESTful API used to upload and fetch image groups from the database. Because this is a micro service we used [Nodemon](https://nodemon.io/) in order to enable hot-loading for easier development reducing the need to rebuild constantly.

## Routes

All routes use AAA to validate the user

### `/status`
Method: GET

Success Response: (Status: ok, Results: response)

Error Response: (Status: error, error: result)

Description: Gets status of the service

### `/upload`
Method: POST

Success Response: (Status: ok, insertID: image ID)

Error Response: (Status: error, error: result)

Description: Uploads the PDF using the body of the request.

### `/getImagesGroup`
Method: GET

Success Response: (Status: ok, Results: query results)

Error Response: (Status: error, error: result)

Description: Gets all of the image groups associated with the HP ID.

### `/getImageGroup/:groupID`
Method: GET

URL Params: groupID == Integer

Success Response: (Status: ok, Results: query result)

Error Response: (Status: error, error: result)

Description: Grabs the images associated with the groupID insuring a valid HPID

### `/deleteImageGroup/:groupID`
Method: POST

URL Params: groupID == Integer

Success Response: (Status: ok, Results: groupID)

Error Response: (Status: error, error: result)

Description: Deletes an imageGroup with the associated ID and valid HPID

### `/changeImageGroupName/:groupID`
Method: POST

URL Params: groupID == Integer

Success Response: (Status: ok, Results: groupID)

Error Response: (Status: error, error: result)

Description: Changes the name associated with the given groupID and valid HPID

# [Image-Gate](./image-gate/index.js)

An [Express](https://expressjs.com/) server RESTful API used to send images to the client. [Nodemon](https://nodemon.io/) is used in order to enable hot-loading for easier development.

## Routes
All routes use AAA to validate users

### `/status`
Method: GET

Success Response: (Status: ok, Results: response)

Error Response: (Status: error, error: result)

Description: Gets status of the service

### `/:hpid/:filename`
Method: GET

URL Params: hpid == String, filename == String

Success Response: (Status: 401, Results: file)

Error Response: (Status: 400)

Description: Returns the file in the response associated with the hpid and filename

# [PDF-Render](./pdf-render/app/main.py)

A Python micro service RESTful API using [pdfPlumber](https://github.com/jsvine/pdfplumber) to handle the metadata extraction.

## Routes

### `/`
Method: POST

Success Response: (Status: ok, Results: metadata)

Description: Converts the given pdf into sets of pngs along with extracting all of the associated metadata for both the images themselves and the imageGroup.

# [Database](./database/sql-scripts/AtlasDBCreationScriptv0.1.sql)

A SQL database used to store the imageGroup / image information

## Schema

Table `groups`

| Field       |        Type         | Description                                      |
| ----------- | :-----------------: | ------------------------------------------------ |
| id          | INT(11) PRIMARY KEY | Incremental key                                  |
| owner_hpid  |    VARCHAR(256)     | HPID of group owner                              |
| created     |      DATETIME       | Date of creation                                 |
| layoutID    | INT(11) FOREIGN KEY | The last used template. Key from `layouts` table |
| description |    VARCHAR(4000)    | Group description                                |
| metadata    |        TEXT         | Metadata pulled from the PDF                     |
| name        |    VARCHAR(256)     | Name of the group                                |

Table `images`

| Field      |        Type         | Description                                 |
| ---------- | :-----------------: | ------------------------------------------- |
| id         | INT(11) PRIMARY KEY | Incremental key                             |
| uri        |    VARCHAR(400)     | URI to the image data                       |
| groupID    | INT(11) FOREIGN KEY | Key from `groups` table                     |
| imageIndex |       INT(11)       | Index of the image in the group             |
| metadata   |        TEXT         | Metadata associated with the specific image |

# Architectural Design

![Architectural Design](https://cdn.discordapp.com/attachments/426512292096638999/573757227702288406/unknown.png "Architectural Design")

# Screenshots

![Screenshot Full UI](https://cdn.discordapp.com/attachments/426512292096638999/573757833900720138/unknown.png "Full UI")

![Screenshot Left Bar](https://cdn.discordapp.com/attachments/426512292096638999/573758128911286272/unknown.png "Left Bar")

# Next Steps

## Frontend
### Improvements:
Currently the frontend is fragile. Because this was more of a proof of concept effort was not put in to harden the code. This is true for both the Threejs and Vue components. 

Another improvement would come in the form of abstracting the templates. A lot of the values in the code are hard coded. The way we ended up solving folding was by loading a single image and using offsets, scales, and transformation to manipulate the image in order to give the illusion of folding. This could be achieved either in the current form or by splitting an image on the fly and loading a cut version of the image onto the page. Without this the renders are stuck folding based on the definition of the fold, so a half fold always folds at 50%.

### New Features:
One thing that our app does not handle like Softproof is options associated with each template. This was the next step for us but time did not allow.

## DB-Connector
### Improvements:
Some security vulnerabilities most likely exist.
### New Features:
More crud operations. We never got to the point where we could allow the user to modify the image groups they have uploaded.

## Image-gate
### Improvements:

### New Features:

## PDF-Render
### Improvements:

### New Features:

## Database
### Improvements:
The schema we have now works for what we have.
### New Features:
We had ideas around storing some more information about the image group to improve the user experience. 

By storing the last layout used for a template we could load the image group as the user had it previously so they wouldnt need to re-select the template.

This could again be improved by storing information about fold lines if modified and orientation.

# Security



## Signature
- Monte Roden [<monte.roden@wsu.edu>](mailto:monte.roden@wsu.edu)
- Nate Lewis [<nathaniel.lewis@wsu.edu>](mailto:nathaniel.lewis@wsu.edu)
- Jonathon Carothers [<jonathon.carothers@wsu.edu>](mailto:jonathon.carothers@wsu.edu)
- Camryn Questad [<camryn.questad@wsu.edu>](mailto:camryn.questad@wsu.edu)
- Lennon Hitzeman [<lennon.hitzeman@wsu.edu>](mailto:lennon.hitzeman@wsu.edu)
