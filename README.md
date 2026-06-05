# Real Estate Enterprise API 🚀

A robust, enterprise-grade, and highly scalable **Real Estate RESTful API** built with modern web technologies. This production-ready backend handles advanced business logic, dual-layer secure authentication, property listing lifecycle management, and relational user-customer telemetry. 

Designed specifically as a real-world solution for commercial real estate agencies, keeping **Clean Code**, **DRY (Don't Repeat Yourself)**, and global security standards at its core.

---

## 🛠️ Tech Stack & Architecture

- **Runtime Environment:** Node.js v20+
- **Backend Framework:** Express.js v5 (Built-in asynchronous promise-rejection capturing)
- **Database Architecture:** MongoDB + Mongoose ODM (Advanced indexing & validation mapping)
- **API Documentation:** Swagger UI & Redoc UI Entegrasyonları
- **File Management:** Multer (Optimized Local Multipart Stream Processing)

---

## 🔐 Key Enterprise Features

- **Hybrid Dual-Layer Authentication:** Seamless authentication pipeline combining stateless short-lived **JWT (Access & Refresh Tokens)** along with a persistent stateful **SHA256-Hashed Simple Token System**. 
- **Centralized Global Error Handler:** Custom object-oriented error structures (`CustomError`) processed by a synchronized global middleware adapter converting raw database codes (e.g., MongoDB `11000 Conflict Error`) into clean, informative, user-friendly responses.
- **Strict Data Integrity Filters:** Bulletproof property input constraints ensuring that rogue data cannot bypass entity references (`ownerId` business validation, administrative context injection).
- **Soft-Delete Lifecycle:** Secure real estate status pipelines prioritizing analytical data integrity over hard loss.
- **Smart Like/Unlike Favorites Toggle:** An optimized hybrid endpoint allowing atomic `Favorite` entity modification without code redundancy or frontend performance overload.

---

## 📂 Project Structure Overview

```text
├── src/
│   ├── configs/            # Database and framework environment maps
│   ├── controllers/        # Business logic controllers (User, Property, Auth...)
│   ├── errors/             # Custom Error structures
│   ├── helpers/            # Cryptographic and JWT token signature helpers
│   ├── middlewares/        # Authentication, static routers, query & error handlers
│   ├── models/             # Mongoose schemas (User, Customer, Property, Favorite...)
│   └── routes/             # Isolated endpoint mappers & Swagger specifications
├── public/
│   └── uploads/            # Multer localized binary payload target folder
├── .env                    # Local environment secrets configuration
└── index.js                # Core Application Entry Point
```

---

## 🚀 Getting Started

### 1. Prerequisites
Ensure you have **Node.js** and **npm** installed on your localized deployment system.

### 2. Installation
Clone the repository and install the production and engineering dependencies:
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory and securely map the following variables:
```env
NODE_ENV=development
PORT=8000
HOST=127.0.0.1
MONGODB=mongodb_connection_string
SECRET_KEY=global_app_secret_key
ACCESS_KEY=jwt_access_signature_key
REFRESH_KEY=jwt_refresh_signature_key
```

### 4. Running the Server
To spin up the ecosystem with hot-reloading (Nodemon development environment):
```bash
npm start
```
The ecosystem will mount and run securely at: `http://127.0.0.1:8000`

---

## 📋 Core API Endpoint Maps

### Authentication & Profiles (`/auth` & `/users`)
- `POST /auth/signup` - Register an enterprise identity.
- `POST /auth/login` - Authenticate via username/email to capture Simple and JWT Tokens.
- `POST /auth/refresh` - Swap out a valid Refresh Token to secure a new Access Token.
- `POST /auth/logout` - Purge active simple token sessions safely.
- `PATCH /users/change-my-password` - Update current logged-in session credentials.

### Property Listings (`/properties` & `/property-images`)
- `GET /properties` - Advanced query filtering & pagination mapping.
- `POST /properties` - Admin-only property deployment pipeline.
- `PATCH /properties/:id/status` - Toggle listed visibility safely.
- `POST /property-images` - Multipart **Multer** streaming payload target file uploads.
- `PATCH /property-images/:id/set-cover` - Atomic transaction handling to map an exclusive cover item.

### Customer Management & Interaction (`/customers` & `/favorites`)
- `POST /customers` - Register real-estate asset property owners (Admin Only).
- `POST /favorites/toggle` - Microservice-style Like/Unlike toggle execution.

---

## 📝 API Documentation Access
Once the backend boots successfully, you can view the fully documented interactive schema mapping at:
- **Swagger Documentation Map:** `http://127.0.0`
- **Redoc Documentation Map:** `http://127.0.0`

---
*Developed as a commercial production solution by [Gokce Kemaloglu](https://github.com/gokcekemaloglu/).*