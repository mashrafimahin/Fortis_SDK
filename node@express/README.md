<div align="center">

# 🔐 Fortis Auth SDK

**A lightweight, secure, and easy-to-use Authentication & Authorization SDK for Node.js / Express**

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![npm version](https://img.shields.io/badge/npm-v1.0.0-blue.svg)](https://www.npmjs.com/package/@fortis/express)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

---

[Installation](#installation) •
[Quick Start](#quick-start) •
[Configuration](#configuration) •
[API Reference](#api-reference) •
[Error Handling](#error-handling) •
[Examples](#examples) •
[Contributing](#contributing) •
[License](#license)

</div>

---

## 📋 Overview

**Fortis Auth SDK** is a powerful, production-ready authentication and authorization client library for Node.js applications. It provides a seamless interface for integrating secure user management features into any Node.js or Express backend. Built with simplicity and security in mind, Fortis handles all the heavy lifting of authentication so you can focus on building your application.

The SDK communicates with your Fortis authentication server over HTTP, sending all requests as `POST` calls to a configurable base URL.

### ✨ Features

- ✅ **Complete Auth Flow** — Signup, Login, Logout, and Session Management
- ✅ **Account Management** — Update profiles, Delete accounts
- ✅ **Password Management** — Reset and Forgot Password workflows
- ✅ **Singleton Pattern** — Single configuration instance across your entire application
- ✅ **Secure by Design** — Private fields for sensitive credentials
- ✅ **Lightweight** — Zero external dependencies, built on native `fetch`
- ✅ **Promise-based** — Modern async/await API
- ✅ **MIT Licensed** — Free for personal and commercial use

---

## ⚙️ Requirements

- **Node.js `>= 18.0.0`** — required for native `fetch` support
- A running **Fortis authentication server** (the SDK sends requests to `http://localhost:3000` by default)

---

## 📦 Installation

Install the package via **npm**:

```bash
npm install @fortis/express
```

Or via **yarn**:

```bash
yarn add @fortis/express
```

---

## 🚀 Quick Start

Get up and running in just a few lines of code:

```javascript
const FortisConfig = require("@fortis/express");

// Initialize with your project credentials
const auth = new FortisConfig({
  projectId: "your-project-id",
  secret: "your-secret-key",
  dbURI: "your-database-uri", // optional
});

// Sign up a new user
const signupResponse = await auth.userSignup({
  email: "user@example.com",
  password: "securePassword123",
  name: "John Doe",
});

// Log in an existing user
const loginResponse = await auth.userLogin({
  email: "user@example.com",
  password: "securePassword123",
});
```

---

## 🔧 Configuration

### Initialization Options

When creating a new `FortisConfig` instance, you must provide a configuration object with the following properties:

| Property    | Type      | Required | Default | Description                             |
| ----------- | --------- | -------- | ------- | --------------------------------------- |
| `projectId` | `string`  | ✅ Yes   | —       | Your unique project identifier          |
| `secret`    | `string`  | ✅ Yes   | —       | Your secret API key                     |
| `dbURI`     | `string`  | ❌ No    | —       | Database connection URI (if applicable) |
| `test`      | `boolean` | ❌ No    | `false` | Enable test mode                        |

> ⚠️ **Note:** If `projectId` or `secret` is missing, the constructor throws:
> `"FortisConfig requires projectId and secret"`

### Singleton Behavior

Fortis follows the **Singleton design pattern**. Once initialized, any subsequent instantiation with `new FortisConfig()` will return the **same instance**, ensuring consistent configuration across your entire application.

```javascript
const auth1 = new FortisConfig({ projectId: "abc", secret: "xyz" });
const auth2 = new FortisConfig({ projectId: "abc", secret: "xyz" });

console.log(auth1 === auth2); // true
```

> ⚠️ **Important:** Because of the singleton pattern, any configuration passed to subsequent instantiations is **ignored**. Only the first instance's configuration is used. To change configuration, restart your application.

### Server Base URL

The SDK sends all requests to a base URL defined in `utils/request.js`:

```javascript
const baseUrl = "http://localhost:3000";
```

All authentication endpoints are appended to this base URL (e.g. `POST http://localhost:3000/auth/signup`). Ensure your Fortis server is running and reachable at this address.

---

## 📚 API Reference

All methods return a `Promise` that resolves to the server's JSON response. See [Error Handling](#error-handling) for details on how errors are surfaced.

### `userSignup(signupInfo)`

Register a new user account.

- **Endpoint:** `POST /auth/signup`

```javascript
const result = await auth.userSignup({
  email: "user@example.com",
  password: "your-password",
  name: "John Doe",
  // ... any additional user fields
});
```

### `userLogin(loginInfo)`

Authenticate an existing user.

- **Endpoint:** `POST /auth/login`

```javascript
const result = await auth.userLogin({
  email: "user@example.com",
  password: "your-password",
});
```

### `userUpdate(updateInfo)`

Update an existing user's profile information.

- **Endpoint:** `POST /auth/update`

```javascript
const result = await auth.userUpdate({
  email: "user@example.com",
  name: "Jane Doe", // updated name
  // ... other fields to update
});
```

### `userLogout(logoutInfo)`

Log out a user from their current session.

- **Endpoint:** `POST /auth/logout`

```javascript
const result = await auth.userLogout({
  email: "user@example.com",
  // session token if required
});
```

### `userResetPass(resetInfo)`

Reset a user's password (requires current password verification).

- **Endpoint:** `POST /auth/resetPass`

```javascript
const result = await auth.userResetPass({
  email: "user@example.com",
  currentPassword: "old-password",
  newPassword: "new-password",
});
```

### `userForgotPass(forgotInfo)`

Initiate a forgot password flow (sends reset instructions).

- **Endpoint:** `POST /auth/forgotPass`

```javascript
const result = await auth.userForgotPass({
  email: "user@example.com",
});
```

### `userDeletion(info)`

Permanently delete a user account.

- **Endpoint:** `POST /auth/deleteAcc`

```javascript
const result = await auth.userDeletion({
  email: "user@example.com",
  password: "your-password", // confirmation required
});
```

---

## ⚠️ Error Handling

> **Important:** The SDK does **not** throw errors. Instead, it **returns** the error object as the resolved value of the promise. This means you should check the response for errors rather than relying on `try/catch`.

```javascript
const result = await auth.userLogin({
  email: "user@example.com",
  password: "wrong-password",
});

if (result instanceof Error) {
  console.error("Login failed:", result.message);
} else {
  console.log("Login successful:", result);
}
```

The SDK returns an `Error` object in two cases:

1. **HTTP errors** — when the server responds with a non-`2xx` status code:
   ```
   HTTP error! Status: 401
   ```
2. **Network / fetch failures** — when the server is unreachable or the request fails.

---

## 💡 Examples

### Complete Express.js Integration

```javascript
const express = require("express");
const FortisConfig = require("@fortis/express");

const app = express();
app.use(express.json());

// Initialize Fortis
const auth = new FortisConfig({
  projectId: process.env.FORTIS_PROJECT_ID,
  secret: process.env.FORTIS_SECRET_KEY,
});

// Signup Route
app.post("/api/signup", async (req, res) => {
  const result = await auth.userSignup(req.body);

  if (result instanceof Error) {
    return res.status(400).json({ success: false, error: result.message });
  }

  res.status(201).json({ success: true, data: result });
});

// Login Route
app.post("/api/login", async (req, res) => {
  const result = await auth.userLogin(req.body);

  if (result instanceof Error) {
    return res.status(401).json({ success: false, error: result.message });
  }

  res.status(200).json({ success: true, data: result });
});

// Protected Route Example
app.get("/api/profile", async (req, res) => {
  // Your authentication middleware logic here
  res.json({ message: "Protected data" });
});

app.listen(3000, () => console.log("Server running on port 3000"));
```

### Using Environment Variables

```javascript
const FortisConfig = require("@fortis/express");

const auth = new FortisConfig({
  projectId: process.env.FORTIS_PROJECT_ID,
  secret: process.env.FORTIS_SECRET_KEY,
  dbURI: process.env.FORTIS_DB_URI,
  test: process.env.NODE_ENV === "test",
});
```

### Handling All Auth Operations

```javascript
const FortisConfig = require("@fortis/express");

const auth = new FortisConfig({
  projectId: "your-project-id",
  secret: "your-secret-key",
});

async function main() {
  // Signup
  const signup = await auth.userSignup({
    email: "user@example.com",
    password: "securePassword123",
    name: "John Doe",
  });

  // Login
  const login = await auth.userLogin({
    email: "user@example.com",
    password: "securePassword123",
  });

  // Update profile
  const update = await auth.userUpdate({
    email: "user@example.com",
    name: "Jane Doe",
  });

  // Reset password
  const reset = await auth.userResetPass({
    email: "user@example.com",
    currentPassword: "securePassword123",
    newPassword: "newSecurePassword456",
  });

  // Forgot password
  const forgot = await auth.userForgotPass({
    email: "user@example.com",
  });

  // Logout
  const logout = await auth.userLogout({
    email: "user@example.com",
  });

  // Delete account
  const deletion = await auth.userDeletion({
    email: "user@example.com",
    password: "newSecurePassword456",
  });
}

main();
```

---

## 🏗️ Project Structure

```
@fortis/express/
├── index.js          # Entry point — exports FortisConfig
├── config/
│   └── index.js      # Core configuration class (Singleton)
├── utils/
│   ├── index.js      # Method definitions for all auth operations
│   └── request.js    # HTTP request handler (fetch-based)
├── package.json      # Package manifest
└── README.md         # Documentation (you are here)
```

---

## 🧪 Running Tests

```bash
npm test
```

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. **Fork** the repository
2. **Create** your feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add some amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines

- Follow existing code style and conventions
- Write clear, descriptive commit messages
- Update documentation as needed
- Ensure all tests pass before submitting

---

## 📄 License

This project is **free and open-source** software licensed under the [MIT License](LICENSE).

```
MIT License

Copyright (c) 2026 Mashrafi Mahin

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

<div align="center">

**Made with ❤️ by [Mashrafi Mahin](https://github.com/mashrafimahin)**

</div>
