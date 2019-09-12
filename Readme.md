orel - (or)ganization (rel)ationships
=
an API to store organization strucure and retrieve relations of an organization. 

Intro
-
The following assumptions were made about the service behaviour:
-  The most natural use case for this service is passing the whole structure at once using the **[POST] /api/organizations**, and retrieving the relations of different organizations through the **[GET] /api/relations** as many times as needed.
- When **[POST] /api/organizations** is called again, the new organization structure gets loaded and the old data is erased.
- Organization structure data is *hierarchical*, i.e. an organization has multiple parents and daughters. The structure when, for example, the same organization is a sister and a daughter to any organization at the same time is considered invalid.
- Organization name must be unique by the requirments, however the service will treat "Kalev" and "kalev" as a same organization, i.e. the name uniqueness is case-insensitive. The name that has been encountered first in the input gets remembered, e.g. all the other "kalevs" will be referenced by "Kalev", its first encounter.

API endpoints
-

```
[POST] api/organization/ 
```
expects a JSON with an organization structure
### Responses
| Status Code | Description |
| :- | :- |
| 201 | Organization structure is created successfully |
| 400 | No JSON is present in body or its structure is invalid |
| 500 | Internal server error |

```
[GET] api/relations/:page?orgname=:name
```
returns a paginated list (**:page** being a page number)of relations of the organization speficied by **:name**
### Parameters
| Parameter| Type | Description |
| :- | :- | :- |
| page | Integer | Number of the page |
| orgname | String | Name of organization to look relations of |
### Responses
| Status Code | Description |
| :- | :- |
| 200 | List of relations is retrieved successfully |
| 400 | No company name are included in query or page number is invalid |
| 404 | Searching a company by a given name yielded no results |
| 500 | Internal server error |

Starting up via *Docker-compose*
-
To run the app via docker-compose start with
```
docker-compose up
```

After the both **orel-app** and **orel-mysql** containers are up, set up a database by executing
```
docker exec -it orel-app npm run db-setup-docker
```
This will create the database and migrate it to the latest migration.
> NB! MySQL docker container takes some time to start accepting http calls, up to couple of minutes, and is irresponsive during this time.

Working with app locally
-
For development, app can be also started locally. To do that, after the repository is cloned, run
```
npm install
```
App uses MySQL Server docker image for development, to start it up use
```
docker run --rm -d --name=orel-mysql -e MYSQL_ROOT_PASSWORD=password -p 3306:3306 mysql:5.7.27
```
Wait until **orel-mysql** is loaded, and execute the following command to create the database and apply migrations
```
npm run db-setup
```
To run the app, execute
```
npm start
```
Or the *nodemon* version
```
npm run dev
```
MySQL 5.7.27 is used because it has working with Sequelize with no work-arounds, caused by the following [bug](https://github.com/sidorares/node-mysql2/issues/991). When working with app locally, it will be able to access orel-mysql container by the 127.0.0.1:3306 address.
### Running tests (when running app locally)
To run tests, you firstly have to set up testing environment, by executing
```
npm run db-setup-test
```
After the test database is created, you can execute
```
npm run test
```


