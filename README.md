# Campus Food Pre-Order & Canteen Management System

A full-stack, cloud-ready food pre-ordering and canteen management platform designed for campus environments. It enables students to pre-order meals, schedule pickup times, and track orders in real-time, while empowering canteen staff to manage inventory and fulfill kitchen orders.

---

## 🛠 Tech Stack

- **Backend:** Java 17, Spring Boot 3.2.x, Spring Data JPA, Lombok, MySQL Connector
- **Database:** MySQL (`canteen_db`)
- **Frontend:** React, Vite, Axios, React Router, Lucide Icons
- **Architecture:** Local-first, RESTful APIs, zero CORS barriers, cloud-ready environment variables

---

## 👥 User Roles & Features

### 1. 🎓 Student Flow
* **Browse Menu:** Filter by category (Burgers, Meals, Snacks, Beverages), search by dish name, and view live stock availability.
* **Pre-Order Cart:** Add dishes, increment/decrement quantities, and see real-time price totals.
* **Pickup Scheduling:** Pick quick presets (+15m, +30m, +45m, +1h) or custom pickup times to avoid canteen rush periods.
* **Special Instructions:** Add optional dietary/packaging notes for the kitchen.
* **Live Order Tracking:** Real-time visual 4-step progress stepper:
  $$\text{PLACED} \longrightarrow \text{PREPARING} \longrightarrow \text{READY} \longrightarrow \text{COLLECTED}$$

### 2. 👨‍🍳 Canteen Staff Flow
* **Kitchen Order Board:** Real-time incoming order queue filtered by status (`PLACED`, `PREPARING`, `READY`, `COLLECTED`).
* **One-Click Order Advancement:**
  * Accept order $\rightarrow$ Move to `PREPARING`
  * Complete cooking $\rightarrow$ Move to `READY` for pickup
  * Hand over to student $\rightarrow$ Move to `COLLECTED`
* **Menu & Stock Management:**
  * One-click instant toggle: **In Stock** $\leftrightarrow$ **Sold Out**
  * Add new menu item with pricing, category, description, and image URL
  * Edit and delete dishes

### 3. 🛡️ Admin Flow
* **Operations Dashboard:** Aggregated metrics for total revenue, orders count, dishes catalog, and registered users.
* **Kitchen Pipeline Metrics:** Live breakdown of active orders across each stage.
* **Campus Accounts:** View registered students and staff members.

---

## 🚀 Getting Started

### 1. Database Setup (MySQL)
Make sure MySQL is running locally on port `3306`:
```bash
mysql -u root -p < database/schema.sql
```
*(Sample seed data for Alex Student, Chef Mario, and Admin Sarah will be automatically created).*

### 2. Run the Spring Boot Backend
Configure `backend/src/main/resources/application.properties` with your MySQL password if needed, then run:
```bash
cd backend
mvn spring-boot:run
```
Backend API will start at: `http://localhost:8080`

### 3. Run the React Frontend
In a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
Frontend will be live at: `http://localhost:5173`

---

## 🧪 Demo Test Logins

The application includes a **1-Click Demo Role Switcher** right in the top navigation bar and login screen:

| Role | Name | Email | Password |
|---|---|---|---|
| **Student** | Alex Student | `alex@campus.edu` | `student123` |
| **Canteen Staff** | Chef Mario | `mario@canteen.com` | `staff123` |
| **Admin** | Admin Sarah | `admin@campus.edu` | `admin123` |
