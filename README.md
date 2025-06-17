# Minkalla ZynConsent

Consent Management Microservice (TypeScript/Node.js)

## Project Status

[![Under Active Development](https://img.shields.io/badge/status-under%20active%20development-orange)](https://github.com/minkalla/zynconsent)

This project is currently under active development as part of the Minkalla MVP.

## Overview

ZynConsent is a foundational component of the Minkalla ecosystem, focused on robust and verifiable consent management. This MVP version provides core API endpoints for recording and retrieving user consent events, designed with GDPR principles in mind and built for future extensibility.

## Features (MVP)

* **Consent Recording:** `POST /consent` to record explicit user consent (granted/revoked) for various types (e.g., marketing, analytics).
* **Consent Retrieval:** `GET /consent/{userId}` to retrieve a historical list of all consent events for a given user, supporting the "right to access".
* **Health Check:** `GET /health` to verify service operational status.
* **In-Memory Storage:** For MVP purposes, consent data is stored in-memory. This will be replaced with a persistent database in future iterations.
* **API Documentation:** Built-in Swagger UI for easy API exploration, automatically redirecting from the root URL.
* **Unit Tested:** Core API endpoints and consent logic are covered by comprehensive unit tests.

## Getting Started

### Prerequisites

* Node.js (LTS version recommended) and npm installed.
* **Recommended for Development:** GitHub Codespaces for a consistent, pre-configured cloud development environment. A `.devcontainer` configuration is included for easy setup.

### Local Development Setup (Using Codespaces)

This project is optimized for development within **GitHub Codespaces**. Your Codespace environment (including Node.js and npm) will be automatically set up for you based on the `.devcontainer` configuration, and `npm install` will run automatically.

**Recommended Codespace Machine Type:**
For optimal performance and to avoid potential resource issues during setup, we recommend using a **4-core (or higher)** Codespace machine type (e.g., "4-core, 16GB RAM + 32GB Storage") when creating your Codespace.

1.  **Launch Codespace:**
    Go to your [Valyze GitHub repository](https://github.com/minkalla/zynconsent), click the green `< > Code` button, select the `Codespaces` tab, and launch your Codespace.

2.  **Verify Setup (Optional):**
    Once the Codespace loads and `npm install` has completed automatically, you can verify installations in the terminal:

    ```bash
    node --version
    npm --version
    ```
    You should see their respective versions.

### Running the ZynConsent API Locally

Once your development environment is ready, you can start the Node.js application:

1.  **Run the Application in Development Mode:**
    From the repository root in your terminal, run:
    ```bash
    npm run dev
    ```
    This will start the server using `nodemon`, which automatically restarts the server on file changes. You should see output similar to:

    ```
    ZynConsent MVP API running on http://localhost:3000
    Swagger UI available at http://localhost:3000/api-docs
    ```

2.  **Access API Documentation:**
    Open your web browser (via Codespaces Port Forwarding) and navigate to:
    `http://localhost:3000/`

    The API will now automatically redirect you to the interactive Swagger UI at `http://localhost:3000/api-docs`.

### API Endpoints

All API endpoints are documented in the Swagger UI. Here's a quick overview:

#### `POST /consent`

Records a new consent event for a user.

* **Method:** `POST`
* **URL:** `/consent`
* **Request Body (JSON):**

    ```json
    {
      "userId": "string",
      "consentType": "string",
      "status": "granted" | "revoked",
      "timestamp": "string" // ISO 8601 format (e.g., "2023-10-27T10:00:00Z")
    }
    ```

* **Example Request (using `curl`):**

    ```bash
    curl -X POST http://localhost:3000/consent \
    -H "Content-Type: application/json" \
    -d '{
      "userId": "user-abc-123",
      "consentType": "marketing_emails",
      "status": "granted",
      "timestamp": "2023-10-27T10:00:00Z"
    }'
    ```

#### `GET /consent/{userId}`

Retrieves all consent events for a specific user.

* **Method:** `GET`
* **URL:** `/consent/{userId}` (replace `{userId}` with the actual user ID)
* **Example Request (using `curl`):**

    ```bash
    curl http://localhost:3000/consent/user-abc-123
    ```

#### `GET /health`

Checks the health of the service.

* **Method:** `GET`
* **URL:** `/health`
* **Example Request (using `curl`):**

    ```bash
    curl http://localhost:3000/health
    ```

## Running Tests

To run the unit tests for ZynConsent:

```bash
npm test
