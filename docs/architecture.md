# System Boundaries

This document outlines the clear boundaries and responsibilities of each component in the Mailaro system.

## 1. Chrome Extension (Gmail Interceptor)
- **Responsibility**: Injects UI into the Gmail compose window, captures outgoing messages, inserts the tracking pixel/links, and communicates with the Mailaro API to register tracked sends.
- **Trust Boundary**: Cannot access database or direct backend services. Uses scoped API tokens. Does not hold provider refresh tokens.

## 2. Web Dashboard (User Interface)
- **Responsibility**: Handles user authentication, displays email activity, tracking history, and manages user preferences.
- **Trust Boundary**: Securely communicates with the API. Authenticates via NextAuth.

## 3. API & Tracking Endpoints
- **Responsibility**: Validates requests, issues tracking tokens, processes tracking events (opens/clicks via public endpoints), and records data to PostgreSQL.
- **Trust Boundary**: Exposes public endpoints for pixels and link redirects. Uses rate limiting.

## 4. Background Worker (Event Processor & Notifications)
- **Responsibility**: Listens for new events via Redis/BullMQ. Evaluates notification preferences and sends browser/email notifications without slowing down the tracking endpoints.
- **Trust Boundary**: Internal service only. No public exposure.

*(Note: The technical spike for the Gmail path will be implemented in the initial extension setup in the next stages).*
