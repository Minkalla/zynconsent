Minkalla ZynConsent
Consent Management Microservice (TypeScript/Node.js)

Project Status
This project is currently under active development as part of the Minkalla MVP.

Overview
ZynConsent is a foundational component of the Minkalla ecosystem, focused on robust and verifiable consent management. This MVP version provides core API endpoints for recording and retrieving user consent events, designed with GDPR principles in mind and built for future extensibility.

Features (MVP)
Consent Recording: POST /consent to record explicit user consent (granted/revoked) for various types (e.g., marketing, analytics).

Consent Retrieval: GET /consent/{userId} to retrieve a historical list of all consent events for a given user, supporting the "right to access".

Health Check: GET /health to verify service operational status.

In-Memory Storage: For MVP purposes, consent data is stored in-memory. This will be replaced with a persistent database in future iterations.

API Documentation: Built-in Swagger UI for easy API exploration.

Getting Started
Prerequisites
Node.js (LTS version recommended) and npm installed.

(Optional but Recommended for Development): GitHub Codespaces for a cloud-based development environment.

Local Development Setup
Clone the Repository:

git clone [https://github.com/minkalla/zynconsent.git](https://github.com/minkalla/zynconsent.git)
cd zynconsent

If you're using GitHub Codespaces, you launched directly into this environment.

Install Dependencies:

npm install

Run the Application in Development Mode:

npm run dev

This will start the server using nodemon, which automatically restarts the server on file changes. You should see output similar to:

ZynConsent MVP API running on http://localhost:3000
Swagger UI available at http://localhost:3000/api-docs

Access API Documentation:
Open your web browser and navigate to http://localhost:3000/api-docs (or the Codespaces forwarded URL ending in /api-docs). You will see the interactive Swagger UI.

API Endpoints
All API endpoints are documented in the Swagger UI. Here's a quick overview:

POST /consent
Records a new consent event for a user.

Method: POST

URL: /consent

Request Body (JSON):

{
  "userId": "string",
  "consentType": "string",
  "status": "granted" | "revoked",
  "timestamp": "string" // ISO 8601 format (e.g., "2023-10-27T10:00:00Z")
}

Example Request (using curl):

curl -X POST http://localhost:3000/consent \
-H "Content-Type: application/json" \
-d '{
  "userId": "user-abc-123",
  "consentType": "marketing_emails",
  "status": "granted",
  "timestamp": "2023-10-27T10:00:00Z"
}'

GET /consent/{userId}
Retrieves all consent events for a specific user.

Method: GET

URL: /consent/{userId} (replace {userId} with the actual user ID)

Example Request (using curl):

curl http://localhost:3000/consent/user-abc-123

GET /health
Checks the health of the service.

Method: GET

URL: /health

Example Request (using curl):

curl http://localhost:3000/health

Running Tests
To run the unit tests for ZynConsent:

npm test

Contribution
We welcome contributions! Please see our central CONTRIBUTING.md guidelines to get started.

License
This project is licensed under the Apache 2.0 License. See the LICENSE file for details.

Security
For information on reporting security vulnerabilities, please refer to our SECURITY.md policy.

Part of the Minkalla open-source ecosystem. 