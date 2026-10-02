# Fortis Auth Service

> **A simple, secure authentication service for Node.js and Express applications.**

Fortis is an authentication SDK designed to make user authentication easier to integrate into Node.js and Express applications.

It provides a complete authentication workflow including **signup, login, logout, access-token validation, refresh-token generation, OTP verification, user updates, and usage controls**—while keeping your authentication logic simple and consistent.

Instead of rebuilding authentication logic for every project, initialize Fortis once and use its methods wherever authentication is required.

---

## ✨ Features

- 🔐 Email & password authentication
- 👤 User signup and login
- 🚪 User logout
- 🎫 Access & refresh token management
- ✅ Token validation
- 🔄 Refresh-token based authentication
- 📧 OTP generation and verification
- 🗄️ Optional Mongoose integration
- 🛡️ Project ID + secret authentication
- 🌐 Origin-based request protection
- 📊 Request limits and package controls
- ⚡ Simple Express integration
- 🧩 Consistent `{ success, message }` responses
- 🚫 SDK methods don't throw errors for normal authentication failures

---

## 📦 Installation

Install Fortis using npm:

```bash
npm install @fortis/express
```

Or:

```bash
npm i @fortis/express
```

---

# 🚀 Quick Start

A basic Fortis setup looks like this:

```js
const express = require("express");
const mongoose = require("mongoose");
const FortisConfig = require("@fortis/express");

mongoose.connect(process.env.MONGO_URI);

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    email: {
      type: String,
      unique: true,
    },
    password: String,
    accessToken: String,
    refreshToken: String,
    name: String,
  }),
);

const auth = new FortisConfig({
  projectId: process.env.FORTIS_PROJECT_ID,
  secret: process.env.FORTIS_SECRET_KEY,
  origin: process.env.FORTIS_ORIGIN,
  provider: "emailPass",
});

const app = express();

app.use(express.json());

app.post("/api/signup", async (req, res) => {
  const result = await auth.userSignup(req.body, User);

  if (!result.success) {
    return res.status(400).json(result);
  }

  res.status(201).json(result);
});

app.post("/api/login", async (req, res) => {
  const result = await auth.userLogin(req.body, User);

  if (!result.success) {
    return res.status(401).json(result);
  }

  res.json(result);
});

app.post("/api/logout", async (req, res) => {
  const result = await auth.userLogout(req.body, User);

  res.json(result);
});

async function requireAuth(req, res, next) {
  const token = (req.headers.authorization || "").replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Token required",
    });
  }

  const result = await auth.checkToken({
    configs: {
      projectId: process.env.FORTIS_PROJECT_ID,
    },
    info: {
      token,
    },
  });

  if (!result.success || !result.result?.valid) {
    return res.status(401).json(result);
  }

  req.user = result.result;

  next();
}

app.get("/api/me", requireAuth, (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});

app.listen(5000, () => {
  console.log("API running on :5000");
});
```

That's enough to get a basic authentication flow running.

---

# 🔑 1. Create Your Fortis Project

Before using the SDK, create a Fortis project.

### Step 1 — Create your Fortis account

Create an account through the Fortis dashboard.

### Step 2 — Verify your account

Complete the OTP verification process.

### Step 3 — Create a project

Create a new project and configure:

- Project ID
- Origin
- Authentication provider

For the current email/password provider:

```text
emailPass
```

### Step 4 — Generate your secret

Rotate your project secret and copy the generated hexadecimal secret.

> ⚠️ The raw secret is shown only once. Store it securely.

### Step 5 — Keep the secret server-side

**Never expose your Fortis secret in frontend code.**

Do not put it in:

```text
VITE_*
NEXT_PUBLIC_*
REACT_APP_*
```

or any other browser-exposed environment variable.

---

# ⚙️ 2. Environment Variables

A typical `.env` file:

```env
PORT=5000

FORTIS_PROJECT_ID=your_project_id
FORTIS_SECRET_KEY=your_secret_key
FORTIS_ORIGIN=http://localhost:5000

FORTIS_URL=http://localhost:6030

MONGO_URI=mongodb://localhost:27017/your_database
```

### Environment variables

| Variable            | Purpose                               |
| ------------------- | ------------------------------------- |
| `FORTIS_PROJECT_ID` | Identifies your Fortis project        |
| `FORTIS_SECRET_KEY` | Authenticates your server with Fortis |
| `FORTIS_ORIGIN`     | Origin associated with your project   |
| `FORTIS_URL`        | Fortis service URL                    |
| `MONGO_URI`         | Your MongoDB connection string        |
| `PORT`              | Your Express server port              |

---

# 🧩 3. Initialize Fortis

Initialize Fortis once in your server:

```js
const FortisConfig = require("@fortis/express");

const auth = new FortisConfig({
  projectId: process.env.FORTIS_PROJECT_ID,
  secret: process.env.FORTIS_SECRET_KEY,
  origin: process.env.FORTIS_ORIGIN,
  provider: "emailPass",
  test: false,
});
```

### Configuration

```js
{
  (projectId, secret, origin, provider, test);
}
```

| Option      | Description                    |
| ----------- | ------------------------------ |
| `projectId` | Your Fortis project ID         |
| `secret`    | Your server-side Fortis secret |
| `origin`    | Your configured project origin |
| `provider`  | Authentication provider        |
| `test`      | Development/test bypass mode   |

For the current provider:

```js
provider: "emailPass";
```

---

# 👤 4. User Model

Fortis can work with your existing user model.

A recommended Mongoose model contains:

```js
const User = mongoose.model(
  "User",
  new mongoose.Schema({
    email: {
      type: String,
      unique: true,
    },
    password: String,
    accessToken: String,
    refreshToken: String,
    name: String,
  }),
);
```

You can pass the model directly to Fortis:

```js
await auth.userSignup(data, User);
```

When a model is supplied, Fortis can handle operations such as:

- Duplicate-user checking
- User saving
- Password-related storage
- Salt/password handling
- Token storage
- Token clearing

Your user model can contain additional application-specific fields as needed.

---

# 📝 5. User Signup

Use:

```js
auth.userSignup();
```

Example:

```js
const result = await auth.userSignup(
  {
    email: "user@example.com",
    password: "strong-password",
    name: "John Doe",
  },
  User,
);
```

### Request

```js
{
  (email, password, name);
}
```

### Successful result

Fortis returns authentication information including:

```js
{
  success: (true, email, password, accessToken, refreshToken);
}
```

The password returned by the service is the hashed password representation described by the service.

### Possible failures

```text
User already exists
Invalid project or secret
Request blocked origin
Request limit exceeded
```

---

# 🔐 6. User Login

Use:

```js
auth.userLogin();
```

Example:

```js
const result = await auth.userLogin(
  {
    email: "user@example.com",
    password: "strong-password",
  },
  User,
);
```

Fortis uses the stored password information from the supplied user model.

A successful login generates a fresh access/refresh token pair.

### Wrong password

The service returns:

```text
Password does not match
```

If you don't provide a user model, the login flow can instead use the required stored password/salt information directly.

---

# 🎫 7. Access Token Validation

Protected routes can use:

```js
auth.checkToken();
```

Example:

```js
const result = await auth.checkToken({
  configs: {
    projectId: process.env.FORTIS_PROJECT_ID,
  },
  info: {
    token,
  },
});
```

The result contains information such as:

```js
{
  (valid, type, email, issuedAt, expiresAt);
}
```

A typical Express authentication middleware:

```js
async function requireAuth(req, res, next) {
  const token = (req.headers.authorization || "").replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Token required",
    });
  }

  const result = await auth.checkToken({
    configs: {
      projectId: process.env.FORTIS_PROJECT_ID,
    },
    info: {
      token,
    },
  });

  if (!result.success || !result.result?.valid) {
    return res.status(401).json(result);
  }

  req.user = result.result;

  next();
}
```

Then protect any route:

```js
app.get("/api/me", requireAuth, (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});
```

---

# 🔄 8. Generate a New Token

Fortis supports generating a new token through:

```js
auth.newToken();
```

Example:

```js
const result = await auth.newToken({
  configs: {
    projectId: process.env.FORTIS_PROJECT_ID,
  },
  info: {
    email: "user@example.com",
    type: "refresh",
  },
});
```

### Result

```js
{
  (email, token);
}
```

The token type determines the token being generated.

For refresh-token based authentication:

```js
type: "refresh";
```

The refresh flow uses the stored user authentication information.

---

# 🚪 9. Logout

Use:

```js
auth.userLogout();
```

Example:

```js
const result = await auth.userLogout(
  {
    email: "user@example.com",
  },
  User,
);
```

The logout process can:

- Remove the active session
- Clear stored authentication tokens
- Return information about access removal

Example result information:

```js
{
  (removeAccess, removeCookies);
}
```

---

# 📧 10. OTP

Fortis also provides OTP generation and verification.

## Create OTP

```js
const result = await auth.createOTP({
  email: "user@example.com",
});
```

The generated OTP is mailed by the service, while the returned value contains the hashed OTP.

Example:

```js
{
  otp: "hashed-otp";
}
```

---

## Verify OTP

```js
const result = await auth.checkOTP({
  otp: "123456",
  stored: hashedOtp,
});
```

If the OTP matches, the operation succeeds.

If it doesn't:

```text
OTP not matching
```

---

# ✏️ 11. Update User

Use:

```js
auth.userUpdate();
```

Example:

```js
const result = await auth.userUpdate(
  {
    email: "user@example.com",
    name: "Updated Name",
  },
  User,
);
```

The response includes:

```js
{
  updateAccess;
}
```

The update behavior depends on the current Fortis package/plan configuration.

---

# 🛡️ 12. Security

Fortis uses several project-level controls when processing requests.

### Project authentication

Requests are associated with:

```text
projectId
secret
```

### Origin protection

The configured origin must match the project's expected origin.

If it doesn't:

```text
Request blocked origin
```

### Server-side secret

Your secret should exist **only on your backend**.

Correct:

```text
Frontend
   ↓
Your API
   ↓
Fortis
```

Incorrect:

```text
Browser
   ↓
Fortis Secret
```

Never expose your Fortis secret to users.

---

# 📊 13. Plans & Request Limits

The current free configuration supports:

```text
Provider: emailPass
Requests: 100
```

When the request limit is exceeded, Fortis returns a message similar to:

```text
Request limit exceeded (x/y)
```

The service documentation indicates that additional usage requires purchasing the appropriate package.

---

# ❌ 14. Error Handling

Fortis follows a simple response pattern.

Successful operations generally contain:

```js
{
  success: true,
  ...
}
```

Failed operations generally contain:

```js
{
  success: false,
  message: "..."
}
```

### Common errors

| Error                        | Meaning                                             |
| ---------------------------- | --------------------------------------------------- |
| `Invalid project or secret`  | Project credentials are invalid                     |
| `Request blocked origin`     | Request origin doesn't match                        |
| `Request limit exceeded`     | Project has exceeded its allowed request count      |
| `User already exists`        | User is already registered                          |
| `Password does not match`    | Login password is incorrect                         |
| `Token expired-invalid-type` | Token is expired or not the expected type           |
| `OTP not matching`           | OTP verification failed                             |
| `No stored password`         | Required stored password information is unavailable |
| Provider errors              | Authentication provider returned an error           |

Fortis methods return authentication failures instead of throwing normal operational errors.

> **Constructor exception:** missing required project credentials such as project ID or secret can cause the constructor to throw.

---

# 📚 API Reference

## `userSignup()`

```js
auth.userSignup(data, UserModel);
```

Used to register a new user.

---

## `userLogin()`

```js
auth.userLogin(data, UserModel);
```

Used to authenticate an existing user.

---

## `userUpdate()`

```js
auth.userUpdate(data, UserModel);
```

Used to update user authentication-related information.

---

## `userLogout()`

```js
auth.userLogout(data, UserModel);
```

Used to terminate the user's authentication session.

---

## `checkToken()`

```js
auth.checkToken({
  configs: {
    projectId,
  },
  info: {
    token,
  },
});
```

Used to validate an authentication token.

Returns information including:

```js
{
  (valid, type, email, issuedAt, expiresAt);
}
```

---

## `newToken()`

```js
auth.newToken({
  configs: {
    projectId,
  },
  info: {
    email,
    type,
  },
});
```

Used to generate a new token.

---

## `createOTP()`

```js
auth.createOTP({
  email,
});
```

Creates an OTP and returns its hashed representation.

---

## `checkOTP()`

```js
auth.checkOTP({
  otp,
  stored,
});
```

Checks a supplied OTP against the stored hashed OTP.

---

# 🧠 Request Cheat Sheet

| Operation      | Method         |
| -------------- | -------------- |
| Register       | `userSignup()` |
| Login          | `userLogin()`  |
| Update         | `userUpdate()` |
| Logout         | `userLogout()` |
| Verify token   | `checkToken()` |
| Generate token | `newToken()`   |
| Create OTP     | `createOTP()`  |
| Verify OTP     | `checkOTP()`   |

### Authentication flow

```text
                 ┌──────────────┐
                 │    Client    │
                 └──────┬───────┘
                        │
                        ▼
                ┌───────────────┐
                │ Your Express  │
                │     API       │
                └───────┬───────┘
                        │
                        ▼
                ┌───────────────┐
                │     Fortis    │
                │ Auth Service  │
                └───────┬───────┘
                        │
             ┌──────────┴──────────┐
             ▼                     ▼
        Authentication         Token System
             │                     │
             ▼                     ▼
          MongoDB            Access / Refresh
```

---

# 🏗️ Typical Application Structure

A project using Fortis might look like:

```text
my-app/
│
├── src/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── server.js
│
├── .env
├── package.json
└── ...
```

Fortis handles the authentication-specific operations while your application remains responsible for your application's routes, business logic, and user experience.

---

# 🌐 Express Integration Pattern

A common architecture is:

```text
POST /api/signup
        │
        ▼
auth.userSignup()
        │
        ▼
     User DB
```

```text
POST /api/login
        │
        ▼
auth.userLogin()
        │
        ▼
Access + Refresh Token
```

```text
GET /api/protected
        │
        ▼
Authorization: Bearer <token>
        │
        ▼
auth.checkToken()
        │
        ▼
Protected Resource
```

---

# 🔒 Important Security Rules

### Never expose your secret

```js
secret: process.env.FORTIS_SECRET_KEY;
```

Keep this value on your server.

### Don't hardcode credentials

Avoid:

```js
const auth = new FortisConfig({
  projectId: "my-project-id",
  secret: "my-secret",
});
```

Prefer:

```js
const auth = new FortisConfig({
  projectId: process.env.FORTIS_PROJECT_ID,
  secret: process.env.FORTIS_SECRET_KEY,
  origin: process.env.FORTIS_ORIGIN,
});
```

### Keep your origin synchronized

Your configured:

```text
FORTIS_ORIGIN
```

must correspond to the origin configured for the Fortis project.

---

# 🧪 Test Mode

Fortis supports:

```js
test: true;
```

for development/test scenarios.

The service documentation specifies that test mode is intended as a development bypass and should not be treated as the normal production configuration.

For production:

```js
test: false;
```

---

# ⚡ Complete Minimal Example

If you want the smallest practical Fortis application:

```js
const express = require("express");
const mongoose = require("mongoose");
const FortisConfig = require("@fortis/express");

const app = express();

app.use(express.json());

mongoose.connect(process.env.MONGO_URI);

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    email: {
      type: String,
      unique: true,
    },
    password: String,
    accessToken: String,
    refreshToken: String,
    name: String,
  }),
);

const auth = new FortisConfig({
  projectId: process.env.FORTIS_PROJECT_ID,
  secret: process.env.FORTIS_SECRET_KEY,
  origin: process.env.FORTIS_ORIGIN,
  provider: "emailPass",
  test: false,
});

app.post("/signup", async (req, res) => {
  const result = await auth.userSignup(req.body, User);

  if (!result.success) {
    return res.status(400).json(result);
  }

  res.status(201).json(result);
});

app.post("/login", async (req, res) => {
  const result = await auth.userLogin(req.body, User);

  if (!result.success) {
    return res.status(401).json(result);
  }

  res.json(result);
});

app.post("/logout", async (req, res) => {
  const result = await auth.userLogout(req.body, User);

  res.json(result);
});

app.listen(5000, () => {
  console.log("Fortis application running on port 5000");
});
```

---

# 💡 Why Fortis?

Authentication is one of those pieces of backend infrastructure that repeatedly appears in almost every application.

Fortis provides a reusable authentication layer so developers can focus on their application's actual features instead of rebuilding the same authentication functionality from scratch.

```text
Your Application
       │
       ├── Business Logic
       ├── Database
       ├── API
       │
       └── Fortis
             │
             ├── Signup
             ├── Login
             ├── Logout
             ├── Tokens
             ├── OTP
             └── Authentication
```

---

# 📌 Current Provider

The documented authentication provider is:

```text
emailPass
```

The Fortis configuration currently uses:

```js
provider: "emailPass";
```

Additional providers can be introduced as the service evolves.

---

# 🗺️ Quick Reference

```text
INSTALL
   │
   ▼
npm i @fortis/express
   │
   ▼
CREATE FORTIS PROJECT
   │
   ▼
GET PROJECT ID + SECRET
   │
   ▼
CONFIGURE ENVIRONMENT
   │
   ▼
INITIALIZE FORTIS
   │
   ▼
CONNECT YOUR USER MODEL
   │
   ▼
┌─────────────────────────┐
│ userSignup()            │
│ userLogin()             │
│ userLogout()            │
│ userUpdate()            │
│ checkToken()            │
│ newToken()              │
│ createOTP()             │
│ checkOTP()              │
└─────────────────────────┘
```

---

# 📖 Documentation

For the complete service architecture, request/response structures, limits, and implementation details, refer to the Fortis service documentation.

---

# 👨‍💻 Author

**Mashrafi Mahin**

---

> **Fortis — Authentication, simplified.**
>
> Build your application. Let Fortis handle the authentication layer.
