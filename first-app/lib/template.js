// 객체 리터럴 패턴으로 연관된 변수와 함수를 하나의 객체에 담아보자.
const template = {
	getHTML: function (title, list, body, crud, isOnine) {
		// Template Literals
		return `
				<!doctype html>
				<html>
				<head>
					<title>WEB2 - ${title}</title>
					<meta charset="utf-8">
					<style>
					a {
						text-decoration: none;
						font-style: italic;
						font-weight: bold;
						color: black;
						padding: 5px;
						border: 1px solid black;
						border-radius: 10px;
					}
					
					li {
						list-style-type: none;
					}

					li a {
						border: none;
						color: #828282;
					}

					form {
						display: inline-block;
					}
					
					input[type="submit"] {
						background: #4c4c4c;
						font-weight: bold;
						font-style: italic;
						font-size: 1rem;
						padding: 5px;
						border: 1px solid #4c4c4c;
						border-radius: 10px;
						color: white;
					}
					
					table {
						border-collapse: collapse;
						margin-top: 10px;
					}
					td {
						border: 1px solid black;
						padding: 5px 10px;
					}

					.para {
						border: 1px solid #4c4c4c;
						padding: 10px;
						width: 30%;
					}
					.sub_info {
						display: inline-block;
						font-style: italic;
						color: brown;
						margin-top: 0;
						padding-top: 0;
					}
					
					</style>
				</head>
				<body>
					${
						isOnine
							? '<a href="/auth/signout_process">Sign Out</a>'
							: '<a href="/auth/signin">Sign In</a>'
					}
					<h1><a href="/">Welcome to CEPO</a></h1>
					<a href="/author">author</a>
					${list}
					${crud ? crud : ""}
					${body}
				</body>
				</html>
		`;
	},
	getList: function (data) {
		var list = "<ul>";
		data.forEach(function (item) {
			// var li = `<li><a href="/${item}">${item}</a></li>`;
			var li = `<li><a href="/topic/${item.id}">${item.title}</a></li>`;
			list += li;
		});
		list = list + "</ul>";
		return list;
	},
	getTable: function (data) {
		var table = "<table>";
		var style = ``;
		data.forEach((item) => {
			var tr = `<tr>
						<td>${item.id}</td>
						<td>${item.name}</td>
						<td>${item.profile}</td>
					</tr>`;
			table += tr;
		});

		table += "</table>";
		return table + style;
	},
	getUpdateTable: function (data) {
		var table = "<table>";
		var style = `
					<style>
						table {
							border-collapse: collapse;
							margin-top: 10px;
						}
						td {
							border: 1px solid black;
							padding: 0 10px;
						}
					</style>
					`;
		data.forEach((item) => {
			var tr = `<tr>
						<form action="/author/update_process" method="post">
							<input type="hidden" name="id" value="${item.id}"/>
							<td>${item.id}</td>
							<td><input type="text" name="name" placeholder="Name" value="${item.name}"/></td>
							<td><input type="text" name="profile" placeholder="Profile" value="${item.profile}"/></td>
							<td><input type="submit" value="Update" /></td>
							<td><a href="/author/delete_process/${item.id}">X</a></td>
						</form>
					</tr>`;
			table += tr;
		});

		table += "</table>";
		return table + style;
	},
};

// 객체 모듈화
module.exports = template;
