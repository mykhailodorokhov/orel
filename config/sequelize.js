module.exports = {
    development: {
        username: 'root',
        password: 'password',
        database: 'orel-development',
        host: '127.0.0.1',
        dialect: 'mysql'
    },
    test: {
        username: 'root',
        password: 'password',
        database: 'orel-test',
        host: '127.0.0.1',
        dialect: 'mysql',
        logging: false
    },
    docker: {
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOSTNAME,
        dialect: 'mysql'
    }
};