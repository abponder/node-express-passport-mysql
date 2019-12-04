/**
 * Created by barrett on 8/28/14.
 */

var mysql = require('mysql');
var dbconfig = require('../config/database');
require('dotenv').config();

//var connection = mysql.createConnection(dbconfig.connection);
var connection = mysql.createConnection(process.env.connection);

//connection.query('CREATE DATABASE ' + dbconfig.database);
connection.query('CREATE DATABASE ' + process.env.database);

connection.query('\
CREATE TABLE `' + process.env.database + '`.`' + process.env.users_table + '` ( \
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT, \
    `username` VARCHAR(20) NOT NULL, \
    `password` CHAR(60) NOT NULL, \
        PRIMARY KEY (`id`), \
    UNIQUE INDEX `id_UNIQUE` (`id` ASC), \
    UNIQUE INDEX `username_UNIQUE` (`username` ASC) \
)');

console.log('Success: Database Created!')

connection.end();
