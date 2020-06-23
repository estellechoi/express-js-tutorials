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
	name: "connect.sid", // default cookie name for session. Check inside 'Set-Cookie' response header.
	secret: "keyboard cat",
	resave: false,
	saveUninitialized: true,
	store: sessionStore,
	secure: true, // only https
	HttpOnly: true, // cannot access to session cookie using script language.
});

module.exports = sessionConfig;
