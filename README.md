# ApiLedger - Usage-Based API Billing Platform

It is a developer-focused SaaS platform that allows users to create APIs, generate API keys, track usage, and implement usage-based billing.

Inspired by platforms like Stripe, RapidAPI, AWS API Gateway, and OpenAI.

# - Project Overview

This project simulates a real-world API monetization system where:

Developers create APIs
API keys are generated for access
All requests go through a central gateway
Each request is logged and tracked
Usage is calculated for billing purposes

# - Tech Stack

# Backend:

Node.js
Express.js
MongoDB (Mongoose)
JWT Authentication
Redis (Rate Limiting)

# Frontend:

React (Vite)
Tailwind CSS
Axios

# - Features Implemented

Backend
Authentication

User registration
User login with JWT

# API Management

Create API
Fetch user APIs
Generate API keys

# API Key System

Unique API key generation
API key validation middleware

# API Gateway

API key validation
Proxy request forwarding
Centralized routing system

# Usage Tracking

Logs request details:

API key
endpoint
timestamp
status
latency

# Rate Limiting

Redis-based rate limiting per API key

# Billing System

Tracks API usage
Calculates usage-based billing

# Frontend

Authentication UI
Login page
Register page
Form validation and error handling

# Landing Page

Hero section
Navigation to login/register

# Dashboard

Sidebar and Navbar layout
Protected routes

# API Management UI

Create API form
API listing
Generate API key
API key display with:-
Masked view
Show/Hide toggle
Copy functionality

API Gateway UI

View all API endpoints
Test API endpoints via gateway
Display request logs (basic)

Usage Dashboard

View total API requests
Usage summary per API
Billing estimation display

- Features Planned (Next Steps)

Stripe Integration (MeterFlow style billing)

Real payment system using Stripe
Webhook handling for successful payments
Subscription / pay-as-you-go model

Advanced Analytics

Graph-based usage visualization
Daily / monthly usage breakdown
Top APIs and endpoints tracking

API Testing Playground

Built-in interface to test APIs using API key
Request builder (GET, POST, headers, body)

Team / Multi-user Support

Organization-based API management
Multiple users under one account

Notifications System

Usage alerts
Billing alerts
Rate limit warnings

- Project Architecture
  Client (React Frontend)
  Backend API (Node.js + Express)
  Middleware Layer (Auth + API Key Validation + Rate Limiting)
  API Gateway
  Target API (User-defined APIs)

- How It Works

User registers and logs in

User creates an API by providing a base URL

System generates a unique API key

All requests are made through ApiLedger Gateway

Gateway validates API key and rate limits

Request is forwarded to actual API

Response is returned to client

Usage is logged for billing

- Folder Structure (Backend)

controllers/
models/
routes/
middleware/
utils/
config/

- Folder Structure (Frontend)

components/
pages/
context/
services/
utils/

- API Endpoints (Sample)

POST /api/auth/register
POST /api/auth/login

POST /api/apis/create
GET /api/apis

POST /api/keys/generate

POST /gateway/:apiId/\*
