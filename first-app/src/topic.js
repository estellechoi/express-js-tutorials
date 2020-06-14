var path = require("path");
var connection = require("./db");
var template = require("./template");
var sanitizeHtml = require("sanitize-html"); // remove dangerous scripting part user created.

exports.home = function (req, res) {
	connection.query(`SELECT * FROM topic`, (err, results) => {
		if (err) throw err; // if error occurs, console prints the error and this app stops.

		const title = "Welcome";
		const data = "Hello node.js";
		const list = template.getList(results); // results is an array of objects.
		const html = template.getHTML(
			title,
			list,
			`<h2>${title}</h2>
			<div><img src="/img/hello.jpg" style="width:300px;display:block;margin:5px auto;"/></div>
			<p>${data}</p>`,
			`<a href="/create">create</a>`
		);
		// res.writeHead(200);
		// res.end(html);
		return html;
	});
};

exports.page = function (req, res) {
	connection.query(`SELECT * FROM topic`, (err, topics) => {
		if (err) throw err;
		// using ? in sql query blocks possible hacking attempts.
		connection.query(
			`SELECT * FROM topic LEFT JOIN author ON topic.author_id = author.id WHERE topic.id = ?`,
			[queryData.id],
			(err, results) => {
				if (err) throw err;
				if (!results.length) return res.writeHead(200);

				const title = results[0].title;
				const data = results[0].description;
				const author = results[0].name ? results[0].name : "Anonymous user";

				const list = template.getList(topics);
				const html = template.getHTML(
					title,
					list,
					`<h2>${sanitizeHtml(title)}</h2>
                    <p class="sub_info">Author: ${sanitizeHtml(author)}</p>
                    <p class="para">${sanitizeHtml(data)}</p>`,
					`<a href="/create">create</a>
                        <a href="/update?id=${queryData.id}">update</a>
                        <form action="/delete_process" method="post">
                            <input type="hidden" name="id" value="${queryData.id}">
                            <input type="submit" value="delete">
                        </form>`
				);
				// res.writeHead(200);
				// res.end(html);
				return html;
			}
		);
	});
};

exports.create = function (req, res) {
	connection.query(`SELECT * FROM topic`, (err, topics) => {
		if (err) throw err;

		const title = "<div>Create</div>";
		console.log(title);
		const list = template.getList(topics);
		const html = template.getHTML(
			title,
			list,
			`
            <form action="/create_process" method="post">
                <input type="text" name="name" placeholder="User name"><br>
                <input type="text" name="profile" placeholder="Introduce yourself."><br>
                <input type="text" name="title" placeholder="Title"><br>
                <textarea name="description" placeholder="Description"></textarea><br>
                <input type="submit" value="ok"><br>
            </form>
            `,
			title
		);
		// res.writeHead(200); // 응답코드
		// res.end(html); // template 을 응답
		return html;
	});
};

exports.createProcess = function (req, res) {
	const postData = req.body; // body property was added by body-parser middle ware.
	const title = postData.title;
	const titleFiltered = path.parse(title).base;
	const description = postData.description;

	const name = postData.name;
	const profile = postData.profile;
	if (name && name.length) {
		connection.query(
			`INSERT INTO author (name, profile) VALUES (?, ?)`,
			[name, profile],
			(err) => {
				if (err) throw err;

				connection.query(
					`SELECT id FROM author WHERE name = ? and profile = ?`,
					[name, profile],
					(err, results) => {
						if (err) throw err;
						if (!results.length)
							// return res.writeHead(302, {
							// 	Location: `/create`,
							// });
							return "/create";

						const userId = results[0].id;

						connection.query(
							`INSERT INTO topic (title, description, created, author_id) VALUES (?, ?, NOW(), ?)`,
							[titleFiltered, description, userId],
							(err, results) => {
								if (err) throw err;

								// res.writeHead(302, {
								// 	Location: `/?id=${results.insertId}`,
								// });
								// res.end();
								return `/${results.insertId}`;
							}
						);
					}
				);
			}
		);
	}
};

exports.update = function (req, res) {
	connection.query(`SELECT * FROM topic`, (err, topics) => {
		if (err) throw err;

		const idFiltered = path.parse(queryData.id).base;
		connection.query(
			`SELECT * FROM topic WHERE id = ?`,
			[idFiltered],
			(error, results) => {
				if (error) throw error;

				if (results.length) {
					const res = results[0];
					const title = res.title;
					const data = res.description;
					const list = template.getList(topics);
					const html = template.getHTML(
						title,
						list,
						`
                        <form action="/update_process" method="post">
                            <input type="hidden" name="id" value="${res.id}">
                            <input type="text" name="title" placeholder="title" value="${title}"><br>
                            <textarea name="description" placeholder="description">${data}</textarea><br>
                            <input type="submit" value="ok"><br>
                        </form>
                        `,
						"Update"
					);
					// res.writeHead(200); // 응답코드
					// res.end(html); // template 을 응답
					// return;
					return html;
				}
				return "";
				// res.writeHead(200); // 응답코드
			}
		);
	});
};

exports.updateProcess = function (req, res) {
	const postData = req.body;
	const id = postData.id;
	const title = postData.title;
	const description = postData.description;
	const idFiltered = path.parse(id).base;
	const titleFiltered = path.parse(title).base;

	connection.query(
		`UPDATE topic SET title = ?, description = ? WHERE id = ?`,
		[titleFiltered, description, idFiltered],
		(err) => {
			if (err) throw err;

			// res.writeHead(302, {
			// 	Location: `/?id=${idFiltered}`,
			// });
			// res.end();
			return `/${idFiltered}`;
		}
	);
};

exports.deleteProcess = function (req, res) {
	const postData = req.body;
	const id = postData.id;
	const idFiltered = path.parse(id).base; // 요청 id 필터링 (보안처리)

	connection.query(`DELETE FROM topic WHERE id = ?`, [idFiltered], (err) => {
		if (err) throw err;
		// res.writeHead(302, { Location: `/` });
		// res.end();
		return "/";
	});
};
