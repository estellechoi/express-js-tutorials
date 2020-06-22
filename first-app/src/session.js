const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const dbConnection = require("./db");

// set session store.
const sessionStore = new MySQLStore(
	{
		host: "localhost",
		port: 3306,
		user: "temp_user",
		password: "yk0425",
		database: "express_mysql_session", // ignored if db connection already has specified database.
		schema: {
			tableName: "sessions",
			columnNames: {
				session_id: "session_id",
				expires: "expires",
				data: "data",
			},
		},
	},
	dbConnection // using existing db connection or pool
);

const sessionConfig = session({
	name: "connect.sid", // default value for name property
	secret: "keyboard cat",
	resave: false,
	saveUninitialized: true,
	store: sessionStore,
});

module.exports = sessionConfig;
