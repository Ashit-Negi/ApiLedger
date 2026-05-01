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
