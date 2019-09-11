# To build the application docker image
docker build . -t orel

# To run the application docker image
docker run --rm --detach --name orel-app --env PORT=3000 --publish 3001:3000 orel

# To start a MySQL docker container
docker run --rm --detach --name=orel-mysql --env MYSQL_ROOT_PASSWORD=password --publish 3306:3306 mysql:5.7.27

# (fix to this issue https://github.com/sidorares/node-mysql2/issues/991)
# Re-setting the password will solve the issue if on MySQL 8.x and higher you are getting the following error :
# "ERROR: Client does not support authentication protocol requested by server; consider upgrading MySQL client"
docker exec -d orel-mysql mysql -uroot -ppassword -e "ALTER USER 'root'@'%' IDENTIFIED WITH mysql_native_password BY 'password'"

https://github.com/docker/for-win/issues/530