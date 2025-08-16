# Chirpy

Boot.dev [Learn HTTP Servers in TypeScript](https://www.boot.dev/courses/learn-http-servers-typescript) course

## Get Started

Install dependencies

```bash
npm install
```

Start the server

```bash
npm run dev
```

Run tests

```bash
npm run test
```

## Database

Chirpy uses a PostgreSQL database.

Generate migrations

```bash
npm run generate
```

Run migrations

```bash
npm run migrate
```

## Environment Variables

Chirpy uses the following environment variables:

- `DB_URL`: The URL of the PostgreSQL database
- `PORT`: The port to run the server on
- `PLATFORM`: The platform to run the server on
- `JWT_SECRET`: The secret key to sign JWT tokens
- `POLKA_KEY`: The Polka API key

## Authentication

Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## API Endpoints

### Health Check

#### GET /api/healthz

Health check endpoint to verify the service is running.

**Response:**

- **Status:** 200 OK
- **Content-Type:** text/plain
- **Body:** "OK"

---

### Authentication Endpoints

#### POST /api/login

Authenticate a user and receive access and refresh tokens.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**

- **Status:** 200 OK
- **Content-Type:** application/json

```json
{
  "id": "user-id",
  "email": "user@example.com",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z",
  "isChirpyRed": false,
  "token": "jwt-access-token",
  "refreshToken": "refresh-token"
}
```

**Errors:**

- `400 Bad Request` - Missing required fields
- `404 Not Found` - User not found
- `401 Unauthorized` - Invalid password

#### POST /api/refresh

Refresh an access token using a refresh token.

**Headers:**

```
Authorization: Bearer <refresh-token>
```

**Response:**

- **Status:** 200 OK
- **Content-Type:** application/json

```json
{
  "token": "new-jwt-access-token"
}
```

**Errors:**

- `401 Unauthorized` - Invalid refresh token

#### POST /api/revoke

Revoke a refresh token.

**Headers:**

```
Authorization: Bearer <refresh-token>
```

**Response:**

- **Status:** 204 No Content

---

### User Management

#### POST /api/users

Create a new user account.

**Request Body:**

```json
{
  "email": "newuser@example.com",
  "password": "password123"
}
```

**Response:**

- **Status:** 201 Created
- **Content-Type:** application/json

```json
{
  "id": "user-id",
  "email": "newuser@example.com",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z",
  "isChirpyRed": false
}
```

**Errors:**

- `400 Bad Request` - Missing required fields
- `500 Internal Server Error` - Could not create user

#### PUT /api/users

Update user information (requires authentication).

**Headers:**

```
Authorization: Bearer <jwt-token>
```

**Request Body:**

```json
{
  "email": "updated@example.com",
  "password": "newpassword123"
}
```

**Response:**

- **Status:** 200 OK
- **Content-Type:** application/json

```json
{
  "id": "user-id",
  "email": "updated@example.com",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z",
  "isChirpyRed": false
}
```

**Errors:**

- `400 Bad Request` - Missing required fields
- `401 Unauthorized` - Invalid or missing token
- `404 Not Found` - User not found

---

### Chirps (Posts)

#### GET /api/chirps

Retrieve all chirps or chirps by a specific author.

**Query Parameters:**

- `authorId` (optional): Filter chirps by author ID
- `sort` (optional): Sort order - "asc" (default) or "desc"

**Examples:**

```
GET /api/chirps
GET /api/chirps?authorId=user123
GET /api/chirps?sort=desc
GET /api/chirps?authorId=user123&sort=desc
```

**Response:**

- **Status:** 200 OK
- **Content-Type:** application/json

```json
[
  {
    "id": "chirp-id",
    "body": "Hello, Chirpy!",
    "userId": "user-id",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
]
```

#### GET /api/chirps/:id

Retrieve a specific chirp by ID.

**Response:**

- **Status:** 200 OK
- **Content-Type:** application/json

```json
{
  "id": "chirp-id",
  "body": "Hello, Chirpy!",
  "userId": "user-id",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

**Errors:**

- `404 Not Found` - Chirp not found

#### POST /api/chirps

Create a new chirp (requires authentication).

**Headers:**

```
Authorization: Bearer <jwt-token>
```

**Request Body:**

```json
{
  "body": "Hello, Chirpy! This is my first chirp."
}
```

**Response:**

- **Status:** 201 Created
- **Content-Type:** application/json

```json
{
  "id": "chirp-id",
  "body": "Hello, Chirpy! This is my first chirp.",
  "userId": "user-id",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

**Validation Rules:**

- Chirp body is required
- Maximum length: 140 characters
- Profanity filter: Words like "kerfuffle", "sharbert", "fornax" are automatically censored to "\*\*\*\*"

**Errors:**

- `400 Bad Request` - Missing required fields or chirp too long
- `401 Unauthorized` - Invalid or missing token

#### DELETE /api/chirps/:id

Delete a chirp (requires authentication and ownership).

**Headers:**

```
Authorization: Bearer <jwt-token>
```

**Response:**

- **Status:** 204 No Content

**Errors:**

- `401 Unauthorized` - Invalid or missing token
- `403 Forbidden` - You are not the owner of this chirp
- `404 Not Found` - Chirp not found

---

### Webhooks

#### POST /api/polka/webhooks

Webhook endpoint for Polka integration (requires API key).

**Headers:**

```
Authorization: Bearer <polka-api-key>
```

**Request Body:**

```json
{
  "event": "user.upgraded",
  "data": {
    "userId": "user-id"
  }
}
```

**Response:**

- **Status:** 204 No Content (for user.upgraded event)
- **Status:** 204 No Content (for other events, no action taken)

**Errors:**

- `400 Bad Request` - Missing required fields
- `401 Unauthorized` - Invalid API key
- `404 Not Found` - User not found

---

## Admin Endpoints

### GET /admin/metrics

Display admin metrics dashboard.

**Response:**

- **Status:** 200 OK
- **Content-Type:** text/html

```html
<html>
  <body>
    <h1>Welcome, Chirpy Admin</h1>
    <p>Chirpy has been visited 42 times!</p>
  </body>
</html>
```

### POST /admin/reset

Reset the application (development only).

**Response:**

- **Status:** 200 OK
- **Content-Type:** text/plain
- **Body:** "OK"

**Errors:**

- `403 Forbidden` - Reset is only allowed in dev environment

---

## Error Responses

All endpoints return consistent error responses in the following format:

```json
{
  "error": "Error message description"
}
```

### Common HTTP Status Codes

- `200 OK` - Request successful
- `201 Created` - Resource created successfully
- `204 No Content` - Request successful, no content to return
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Authentication required or failed
- `403 Forbidden` - Access denied
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

---

## Security Notes

- JWT tokens are used for authentication
- Passwords are hashed using bcrypt
- Profanity filtering is applied to chirp content
- Admin endpoints are restricted to development environment
- API keys are required for webhook endpoints
