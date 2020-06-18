# Routing

> This markdown page is Korean/English mixed entirely depending on my personal need, not readers' possible expectation. Just the reorderd, added, and removed from reference documents, or some parts are the English-Korean translated version. But, maybe helpful for some people.

<br>

## What is Routing ?

`라우팅`이란 클라이언트의 요청에 대해 애플리케이션 서버에서 어떤 응답을 줄지 지정하는 것이다. 클라이언트가 요청을 보내면 요청 경로와 메소드에 맞게 라우팅된 결과를 응답한다.

### Route definition

```javascript
app.METHOD(PATH, HANDLER);
```

- `app` is an instance of express.
- `METHOD` is an HTTP request method, in lowercase.
- `PATH` is a path on the server.
- `HANDLER` is the function executed when the route is matched. (Callback)

For example,

```javascript
// GET method
app.get("/", (req, res) => {
	res.send("Hello World.");
});

// DELETE method
app.delete("/user", (req, res) => {
	res.send("Deleting requested.");
});
```

<br>

## `app.METHOD`

- You define routing using methods of the Express `app` object that correspond to HTTP methods.
- Also use `app.all()` to handle all HTTP methods.
- Or `app.use()` to specify middleware as the callback function.

  > See [Using middleware](https://expressjs.com/en/guide/using-middleware.html).

<br>

### `app.route()`

Can create chainable route handlers for a route path by using `app.route()` for modular routes.

하나의 동일한 요청 경로에 대해 메소드에 따라 서로 다른 응답을 라우팅 할 수 있다.

```javascript
app
	.route("/path")
	.get((req, res) => {
		res.send("GET");
	})
	.post((req, res) => {
		res.send("POST");
	})
	.put((req, res) => {
		res.send("PUT");
	});
```

<br>

## Callback

- Can have more than one callback function as arguments.
- With multiple callback functions, it is important to provide `next` as an argument to the callback function and then call `next()` within the function to hand off control to the next callback.

```javascript
app.all(
	"/secret",
	(req, res, next) => {
		next(); // pass control to the next handler
	},
	(req, res) => {
		res.send("Hello.");
	}
);
```

<br>

## Route parameters

Route parameters are named URL segments that are used to capture the values specified at their position in the URL. The captured values are populated in the `req.params` object.

For example, with route path `/users/:userId/books/:bookId`, the output of `req.params` can be like the object `{ "userId": "34", "bookId": "8989" }`.

Since the hyphen `-` and the dot `.` are interpreted literally, they can be used along with route parameters for useful purposes.

```
Route path: /flights/:from-:to
req.params: { "from": "LAX", "to": "SFO" }
```

<br>

## express.Router

Can create modular, mountable route handlers using Router instance.

```javascript
// sample.js
const express = require("express");
const router = express.Router();

// specify a middleware to this router instance.
router.use(timeLog: (req, res, next) => {
	console.log("Time: ", Date.now());
	next();
});

// define a route for this router instance.
router.get("/", (req, res) => {
	res.send("Home");
});

// define another.
router.get("/about", (req, res) => {
	res.send("About");
});

module.exports = router;
```

```javascript
var sample = require("./sample");

// ...

app.use("/path", sample);
// 이 경로에 대해 항상 timeLog 미들웨어가 호출된다.
```

<br>

## Response methods

If none of these methods are called from a route handler, the client request will be left hanging.

- `res.download()` : Prompt a file to be downloaded.
- `res.end()` : End the response process.
- `res.json()` : Send a JSON response.
- `res.jsonp()` : Send a JSON response with JSONP support.
- `res.redirect()` : Redirect a request.
- `res.render()` : Render a view template.
- `res.send()` : Send a response of various types.
- `res.sendFile()` : Send a file as an octet stream.
- `res.sendStatus()` : Set the response status code and send its string representation as the response body.

<br>

---

### Reference

- [Basic routing | Express](https://expressjs.com/en/starter/basic-routing.html)
- [Routing | Express](https://expressjs.com/en/guide/routing.html)
