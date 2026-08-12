<div align="center">

# 🛡️ Fortis AuthSDK

**A production-ready Authentication & Authorization SDK suite for modern applications**

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![GitHub](https://img.shields.io/badge/GitHub-Fortis_SDK-181717.svg?logo=github)](https://github.com/mashrafimahin/Fortis_SDK)

---

[Overview](#-overview) •
[Packages](#-packages) •
[Getting Started](#-getting-started) •
[Documentation](#-documentation) •
[Contributing](#-contributing) •
[License](#-license)

</div>

---

## 📋 Overview

**Fortis AuthSDK** is a collection of lightweight, secure, and developer-friendly authentication and authorization SDKs. Each package is designed to integrate seamlessly with your stack, handling the heavy lifting of user management so you can focus on building your application.

Built with **simplicity**, **security**, and **zero external dependencies** in mind, Fortis leverages modern JavaScript features like native `fetch` and private class fields to deliver a clean, promise-based API.

### ✨ Core Principles

- 🔒 **Secure by Design** — Sensitive credentials are stored in private fields, never exposed
- 🪶 **Lightweight** — Zero external dependencies, built on native `fetch`
- 🧩 **Modular** — Each package is self-contained and framework-agnostic
- ⚡ **Modern** — Promise-based async/await API for clean, readable code
- 🎯 **Simple** — Get started in just a few lines of code

---

## 📦 Packages

| Package                                | Description                                              | Status    |
| -------------------------------------- | -------------------------------------------------------- | --------- |
| [**@fortis/express**](./node@express/) | Authentication & Authorization SDK for Node.js / Express | ✅ Stable |

> 🚧 **More packages coming soon** — Stay tuned for additional framework integrations!

---

## 🚀 Getting Started

### Prerequisites

- **Node.js `>= 18.0.0`** (required for native `fetch` support)
- A running **Fortis authentication server**

### Installation

```bash
npm install @fortis/express
```

### Quick Start

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

## 📚 Documentation

Each package includes its own comprehensive documentation:

- [**@fortis/express**](./node@express/README.md) — Full API reference, configuration guide, error handling, and examples

### Available Methods

| Method             | Description                         |
| ------------------ | ----------------------------------- |
| `userSignup()`     | Register a new user account         |
| `userLogin()`      | Authenticate an existing user       |
| `userUpdate()`     | Update a user's profile information |
| `userLogout()`     | Log out a user from their session   |
| `userResetPass()`  | Reset a user's password             |
| `userForgotPass()` | Initiate a forgot password flow     |
| `userDeletion()`   | Permanently delete a user account   |

---

## 🏗️ Repository Structure

```
AuthSDK/
├── README.md            # This file — project overview
├── LICENSE              # MIT License
└── node@express/        # @fortis/express package
    ├── index.js         # Entry point — exports FortisConfig
    ├── config/
    │   └── index.js     # Core configuration class (Singleton)
    ├── utils/
    │   ├── index.js     # Method definitions for all auth operations
    │   └── request.js   # HTTP request handler (fetch-based)
    ├── package.json     # Package manifest
    └── README.md        # Package documentation
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
