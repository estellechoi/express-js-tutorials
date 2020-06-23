const connection = require("./db");

module.exports = function initPassport(app) {
	// passport.js code should be after session code.
	const passport = require("passport"),
		LocalStrategy = require("passport-local").Strategy;

	app.use(passport.initialize());
	app.use(passport.session());

	// storing session when a user signs in successfully.
	passport.serializeUser((user, done) => {
		// 'user' object, the first arg, is the object from database when authentication success.
		done(null, user.id);
		// then, the seconde arg of done() becomes the value for 'user' property of the 'passport' object  in req.session so it is saved in session store.
	});

	// called whenever user accesses after signin
	passport.deserializeUser((id, done) => {
		console.log(id);
		connection.query(`SELECT * FROM user WHERE id = ?`, [id], (err, result) => {
			console.log(result[0]);
			done(err, result[0]);
			// the second arg object of done() becomes the value for 'user' property of request object in routers' callback.
		});
	});

	// passport configuration
	passport.use(
		new LocalStrategy(
			{
				usernameField: "email",
				passwordField: "password",
			},
			(email, password, done) => {
				connection.query(
					`SELECT * FROM user WHERE email = ?`,
					[email],
					(err1, emailResult) => {
						// console.log(err1, emailResult);
						if (err1) return done(err1);
						if (!emailResult.length)
							return done(null, false, { message: "Incorrect email." });

						connection.query(
							`SELECT * FROM user WHERE email = ? and password = ?`,
							[email, password],
							(err2, result) => {
								if (err2) return done(err2);
								if (!result.length)
									return done(null, false, { message: "Incorrect password." });
								return done(null, result[0]);
							}
						);
					}
				);
			}
		)
	);

	return passport;
};
