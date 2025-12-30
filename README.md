# Stylique - Clothing Store with Agentic Automation

This repository contains the full stack application for Stylique, a premium clothing store.

## Structure
- `backend/` - Node.js + Express + Prisma (MySQL) backend.
- `project/` - Seller Dashboard (React + Vite).
- `Stylique/` - Mobile Customer App (Expo/React Native).

---

## 🚀 Setup Guide

### 1. Backend Setup (`/backend`)
Prerequisites: MySQL running locally (or remote URL).

1.  Navigate to folder: `cd backend`
2.  Install dependencies: `npm install`
3.  Configure Environment:
    - Copy `.env.example` to `.env`
    - Update `DATABASE_URL` with your MySQL credentials.
    - Update `EMAIL_USER`/`PASS` for notifications.
4.  Database Migration & Seeding:
    ```bash
    npx prisma migrate dev --name init
    npx prisma generate
    node src/seed.js          # Seeds 12 clothing products & user roles
    ```
5.  Run Server: `npm run dev` (Runs on Port 5001)

### 2. Seller Panel Setup (`/project`)
This is the admin dashboard for managing products, orders, and shipping.

1.  Navigate to folder: `cd project`
2.  Install dependencies: `npm install`
3.  Configure Environment:
    - Copy `.env.example` to `.env`
    - Ensure `VITE_API_URL` points to your backend (default: `http://localhost:5001/`)
4.  Run App: `npm run dev` (Usually runs on Port 5173)

### 3. Mobile App Setup (`/Stylique`)
The customer-facing mobile application.

1.  Navigate to folder: `cd Stylique`
2.  Install dependencies: `npm install`
3.  **Important**: Update IP Address
    - Open `Config.json`
    - Update `"IpAddress"` to your machine's local IP (e.g., `192.168.1.X`) so the physical device/emulator can connect to the backend.
4.  Run App: `npx expo start -c`
    - Press `s` to switch to Expo Go if needed.

---

## ✅ Features Implemented

- **Product Management**: Clothing-only store with categories (Topwear, Bottomwear, etc).
- **Order Management**: Full order lifecycle (Placed -> Confirmed -> Shipped -> Delivered).
- **Manual Shipping**: Manual courier & tracking entry via Seller Panel.
- **Email Notifications**: Automated emails for Confirmation, Shipping, and Delivery.
- **Mobile Tracking**: Real-time tracking timeline in the mobile app.

## 🔑 Test Credentials (Seed Data)
- **Seller Login**: `test seller` / `Jaymin@2003` (or `jaymin89873@gmail.com`)
- **User Login**: `jaymin thakkar` / `Jaymin@2003` (or `jaymin8973@gmail.com`)
