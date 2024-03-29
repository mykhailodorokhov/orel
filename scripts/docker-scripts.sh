# To build the application docker image
docker build . -t orel

# To start a MySQL docker container
docker run --rm -d --name=orel-mysql -e MYSQL_ROOT_PASSWORD=password -p 3306:3306 mysql:5.7.27

# To look for the actual DB_HOSTNAME address (just to be sure, but it's usually 172.*.0.1)
docker inspect orel-mysql

# To run the application docker image (replace DB_HOSTNAME with the orel-mysql address)
docker run --rm -d --name=orel-app -e PORT=3000 -e DB_USERNAME=root -e DB_PASSWORD=password -e DB_NAME=orel-docker -e DB_HOSTNAME=127.0.0.1 -p 3000:3000 orel

# To set up and migrate database
docker exec -it orel-app npm run db-setup-docker

# NB! Only applyable if you want to work with MySQL 8.x or higher.
# (fix to this issue https://github.com/sidorares/node-mysql2/issues/991)
# Re-setting the password will solve the issue if on MySQL 8.x and higher you are getting the following error :
# "ERROR: Client does not support authentication protocol requested by server; consider upgrading MySQL client"
docker exec -d orel-mysql mysql -uroot -ppassword -e "ALTER USER 'root'@'%' IDENTIFIED WITH mysql_native_password BY 'password'"