require('dotenv').config();

module.exports = {
    app: {
        port: process.env.PORT, 
    },
    db:{
        port: process.env.PORT,
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQLUSER,
        pass: process.env.MYSQL_PASSWORD,
        dbid: process.env.MYSQL_DB
    }

}