# Campus Food Pre-Order & Canteen Management System

A full-stack food pre-ordering and canteen management platform designed for campus environments. It enables students to pre-order meals, schedule pickup times, and track orders in real-time, while empowering canteen staff to manage inventory and update order fulfillment statuses.

---

## 🛠 Tech Stack

- **Backend:** Java 17, Spring Boot 3.2.x, Spring Data JPA, Lombok, MySQL Connector
- **Database:** MySQL (`canteen_db`)
- **Frontend (Upcoming):** React, Axios, React Router
- **Architecture:** RESTful APIs, Cloud-ready environment configuration

---

## 👥 User Roles & Workflow

1. **Student:**
   - Browse canteen menu by categories.
   - Add/modify cart items.
   - Schedule pickup time & place orders.
   - Live order tracking (`PLACED` → `PREPARING` → `READY` → `COLLECTED`).

2. **Canteen Staff:**
   - Manage menu catalog & live item availability.
   - Monitor incoming orders and advance fulfillment status.

3. **Admin:**
   - System overview across users, menus, and canteen operations.

---

## 📁 Project Structure

```text
Canteen_Management/
├── database/
│   └── schema.sql                          # Database schema & sample seed data
└── backend/
    ├── pom.xml                             # Spring Boot & dependencies
    └── src/
        └── main/
            ├── java/com/canteen/
            │   ├── CanteenApplication.java # Spring Boot entrypoint
            │   ├── entity/                 # JPA Entities (User, MenuItem, Order, OrderItem)
            │   └── repository/             # Spring Data Repositories
            └── resources/
                └── application.properties  # Database connection settings
```

---

## 🚀 Getting Started

### 1. Database Setup
Ensure MySQL is running on `localhost:3306`, then run:
```bash
mysql -u root -p < database/schema.sql
```

### 2. Configure Backend
Review `backend/src/main/resources/application.properties` and adjust your MySQL password if needed:
```properties
spring.datasource.password=YOUR_PASSWORD
```

### 3. Run Backend
Using your IDE (IntelliJ, VS Code, Eclipse) or Maven:
```bash
cd backend
mvn spring-boot:run
```
Server starts on `http://localhost:8080`.
