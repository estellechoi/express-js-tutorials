# Security

> This markdown page is Korean/English mixed entirely depending on my personal need, not readers' possible expectation. Just the reorderd, added, and removed from reference documents, or some parts are the English-Korean translated version. But, maybe helpful for some people.

<br>

## Security best practices for Express applications

> Node.js vulnerabilities directly affect Express. Therefore keep a watch on Node.js vulnerabilities.

- [Don’t use deprecated or vulnerable versions of Express](https://expressjs.com/en/advanced/best-practice-security.html#dont-use-deprecated-or-vulnerable-versions-of-express)
- [Use TLS](https://expressjs.com/en/advanced/best-practice-security.html#use-tls)
- [Use Helmet](https://expressjs.com/en/advanced/best-practice-security.html#use-helmet)
- [Use cookies securely](https://expressjs.com/en/advanced/best-practice-security.html#use-cookies-securely)
- [Prevent brute-force attacks against authorization](https://expressjs.com/en/advanced/best-practice-security.html#prevent-brute-force-attacks-against-authorization)
- [Ensure your dependencies are secure](https://expressjs.com/en/advanced/best-practice-security.html#ensure-your-dependencies-are-secure)
- [Avoid other known vulnerabilities](https://expressjs.com/en/advanced/best-practice-security.html#avoid-other-known-vulnerabilities)

And see also [additional considerations](https://expressjs.com/en/advanced/best-practice-security.html#additional-considerations).

<br>

## Don’t use deprecated or vulnerable versions of Express

Express 2.x and 3.x are no longer maintained. Do not use them! If you haven’t moved to version 4, follow the [migration guide](https://expressjs.com/en/guide/migrating-4.html).

Check [updates](https://expressjs.com/en/advanced/security-updates.html).

<br>

## Use TLS

Use [TLS(Transport Layer Security)](https://developer.mozilla.org/en-US/docs/Web/Security/Transport_Layer_Security) to secure the connection and the data.

쉽게 말해, `HTTP` 대신 `HTTPS`를 사용해야 한다. TLS는 클라이언트에서 서버로 데이터를 전송할 때 전송되는 데이터를 암호화함으로써 흔한 해킹 공격들을 막을 수 있다. TLS 사용이 중요한 이유는 서버로 데이터를 담은 요청을 전송할 때 사용하는 `Ajax` 요청, `POST` 메소드 요청의 경우 [`Packet sniffing`](https://developer.mozilla.org/ko/docs/Security/CSP/Introducing_Content_Security_Policy#Mitigating_packet_sniffing_attacks), [`Man-in-the-middle`](https://en.wikipedia.org/wiki/Man-in-the-middle_attack)과 같은 해킹 공격에 취약하기 때문이다.

TLS는 [SSL(Secure Socket Layer)](https://developer.mozilla.org/en-US/docs/Glossary/SSL)의 업그레이드 버전이다. TLS 구현을 위해 [Nginx](https://www.nginx.com/)가 추천된다. 자세한 내용은 [Mozilla Wiki의 서버 보안 설정](https://wiki.mozilla.org/Security/Server_Side_TLS#Recommended_Server_Configurations)을 참고.

<br>

## Use Helmet

Helmet is actually just a collection of smaller middleware functions that set security-related HTTP response headers.

#### Install

```
npm install helmet --save
```

#### Use

```javascript
const helmet = require("helmet");
app.use(helmet());
```

#### 주의

Express로 구현한 애플리케이션에서 `Helmet` 라이브러리를 사용하지 않는다면, 최소한 `X-Powered-By` 헤더를 비활성화해야 한다. 이 헤더를 사용하면 Express로 구현된 애플리케이션인지 확인하고 Express 애플리케이션 전용 해킹 공격이 가능하기 때문이다. 따로 설정하지 않는다면 `X-Powered-By` 헤더는 기본적으로 활성화 상태이다.

```javascript
app.disable("x-powered-by");
```

<br>

## Use cookies securely

Don’t use the default session cookie name and set cookie security options appropriately.

### Don’t use the default session cookie name

Use generic cookie names; for example using `express-session` middleware:

```javascript
const session = require("express-session");

app.set("trust proxy", 1); // trust first proxy

app.use(
	session({
		secret: "s3Cur3",
		name: "sessionId",
	})
);
```

### Set cookie security options

Here is an example using `cookie-session` middleware:

```javascript
const express = require("express");
const app = express();
const session = require("cookie-session");

const expiryDate = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

app.use(
	session({
		name: "session",
		keys: ["key1", "key2"],
		cookie: {
			secure: true, // only sends the cookie over HTTPS
			httpOnly: true, // the cookie is sent only over HTTP(S), not client JavaScript
			domain: "example.com", // the domain of the cookie; check if it matches the domain of server.
			path: "foo/bar", // the path of the cookie; check if it matches the request path.
			expires: expiryDate, // set expiration date for persistent cookies.
		},
	})
);
```

<br>

### Two main middleware cookie session modules

- `express-session` : replaces express.session middleware built-in to Express 3.x.
- `cookie-session` : replaces express.cookieSession middleware built-in to Express 3.x.

The `express-session` middleware stores session data on the server; it only saves the session ID in the cookie itself, not session data. By default, it uses in-memory storage and is not designed for a production. In production, you’ll need to set up a scalable session-store; see the list of [compatible session stores](https://github.com/expressjs/session#compatible-session-stores).

`cookie-session` implements cookie-backed storage; it serializes the entire session to the cookie, rather than just a session key. Be aware that the cookie data will be visible to the client, so if there is any reason to keep it secure or obscure, then express-session may be a better choice. Also, don’t exceed a size of 4093 bytes per domain. (Browsers support at least 4096 bytes per cookie.)

<br>

## Prevent brute-force attacks against authorization

Block authorization attempts using two metrics:

- 동일한 IP 주소에서 동일한 사용자 이름으로 몇 회 연속 로그인 실패시 해당 IP 주소의 사용자 접근을 막는다.
- 정해진 시간 내에 동일한 IP 주소에서 몇 회 이상 로그인 실패시 해당 IP 주소의 접근을 막는다.

`rate-limiter-flexible` 미들웨어를 사용한 예시를 보려면 [여기](https://github.com/animir/node-rate-limiter-flexible/wiki/Overall-example#login-endpoint-protection).

<br>

## Ensure your dependencies are secure

NPM 으로 다운로드한 라이브러리가 안전한지 확인해야 한다.

Since npm@6, npm automatically reviews every install request. Also you can use `npm audit` to analyze your dependency tree.

```
npm audit
```

If you want to stay more secure, consider [Snyk](https://snyk.io/).

Install Snyk.

```
npm install snyk -g
```

Authenticate the CLI.

```
snyk auth
```

And test your application for vulnerabilities.

```
snyk test
```

<br>

## Avoid other known vulnerabilities

Familiarize yourself with known [web vulnerabilities](https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/).

Also [Node.js Security Checklist](https://blog.risingstack.com/node-js-security-checklist/) is useful.

<br>

---

### References

- [Production Best Practices: Security](https://expressjs.com/en/advanced/best-practice-security.html)
