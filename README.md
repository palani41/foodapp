# Gourmet Haven — Full-Stack MERN Restaurant Application

Gourmet Haven is a feature-rich, high-performance, and visually stunning restaurant web application built using the **MERN Stack** (MongoDB, Express.js, React.js, Node.js). 

It features three distinct user roles with dedicated workflows:
1. **Customer**: Browse menus by category, customize dishes with cooking notes, apply coupons, select order types (Delivery, Dine-In, Takeaway), checkout using simulated credit cards, track statuses in real time via WebSockets, and submit dish reviews.
2. **Restaurant Admin**: Manage menu items and categories with local image uploads, track store sales metrics (revenue trends, popular items, order distributions) via interactive charts, update kitchen order statuses, assign delivery captains, manage dining tables, and define promotional coupons.
3. **Delivery Staff**: View assigned drop-off shipments, view customer phone and address information, and update tracking stages (Pick Up / Complete Drop-off).

---

## Technical Architecture

* **Frontend**: React (Vite), React Router, Context API (State Management), Tailwind CSS v4, Axios, Recharts, Lucide Icons, Socket.io-client.
* **Backend**: Node.js, Express.js (REST API), Socket.io (WebSocket Servers), Multer (Local File Uploads), Helmet (Security Headers), CORS, Express Rate Limiter.
* **Database**: MongoDB with Mongoose ODM.
* **Database Fallback**: In the absence of a running local MongoDB instance on port 27017, the application automatically boots up an in-memory database server (`mongodb-memory-server`) and populates it with sample menu data, tables, coupons, and test roles.

---

## Quick Start Instructions

Follow these steps to run the backend and frontend services locally.

### Prerequisites
* **Node.js**: version `v20.0.0` or higher (tested on `v25.1.0`).
* **NPM**: version `v10.0.0` or higher (tested on `v11.6.2`).
* **MongoDB**: (Optional) Standard local server on port 27017, otherwise the app boots using the in-memory fallback.

---

### Step 1: Run the Backend Server

1. Open a terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```

2. Install backend dependencies:
   ```bash
   npm install
   ```

3. Start the Express development server:
   ```bash
   npm run dev
   ```
   *The backend will boot up on `http://localhost:5001`. If it cannot connect to a local MongoDB instance, it will log:*
   `Starting In-Memory MongoDB Server fallback...`
   *and auto-populate the database with demo listings.*

---

### Step 2: Run the Frontend Server

1. Open a separate terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Start the Vite React development server:
   ```bash
   npm run dev
   ```
   *The client will boot up on `http://localhost:5173`.*

---

## Demo Test Accounts

The login interface features quick-fill buttons to quickly log in with these roles. Alternatively, you can use these email/passwords:

| Role | Email | Password | Description |
| :--- | :--- | :--- | :--- |
| **Customer** | `customer@foodapp.com` | `password123` | Can order food, add addresses, track live statuses, write reviews. |
| **Admin** | `admin@foodapp.com` | `password123` | Can edit menus, manage coupons, review charts, assign orders. |
| **Delivery Staff** | `driver@foodapp.com` | `password123` | Can pick up assigned deliveries, mark orders as delivered. |

---

## Environment Variables Configuration

The backend reads credentials from `backend/.env`. A template is provided in `backend/.env.example`:

```ini
PORT=5001
MONGODB_URI=mongodb://127.0.0.1:27017/foodapp
JWT_SECRET=supersecretkeyforfoodappjwttokenauth
JWT_EXPIRE=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Optional Payments Integration
STRIPE_SECRET_KEY=
```

*Note: If `STRIPE_SECRET_KEY` is left blank, the server runs in **Simulated/Mock Payment mode**. Checkout cards will authorize instantly on clicking 'Authorize Payment' without checking external networks.*

---

## Executing Automated Tests

The backend includes Jest integration tests to verify API endpoints (Register, Login, duplicates checking, and Menu listing).

To run backend tests:
```bash
cd backend
NODE_OPTIONS=--experimental-vm-modules npm test
```
