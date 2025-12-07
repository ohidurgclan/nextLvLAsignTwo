# Vehicle Rental System
**Live URL:**  https://vehicle-service-taupe.vercel.app

**Repository URL:**  https://github.com/ohidurgclan/nextLvLAsignTwo.git

---

## Project Description
The **Vehicle Rental System** is a modular backend application built with **Node.js**, **TypeScript**, and **Express.js**. It provides a secure, structured, and scalable **Vehicle Rental Management** solution. It uses **PostgreSQL** with relational tables for users, vehicles, and bookings, ensuring that each booking links to both users and vehicles for clear data relationships. The system employs **bcrypt** for encrypted password storage and **JWT** for secure user authentication. It follows a modular structure that organizes business logic, routes, controllers, and services clearly. This setup ensures easy maintenance, flexibility, and efficient backend operations for vehicle rental workflows.

---

## Features for Admin (Auth By Middleware)
- Add new vehicle with name, type, registration, daily rent price and availability status.
- View all vehicles in the system and specific vehicle details
- Update and Delete(If not active Rent) vehicle details, daily rent price or availability status

---
## Features for Users (Auth By Middleware)
- View all users in the system
- Be a Customer: Update own profile only
- Return Status and Cancel Booking


## Technology Stack
- **Language:**  Node.js + TypeScript
- **Framework:**  Express.js
- **Database:**  PostgreSQL
- **Authentication:**  bcrypt (password hashing) & JsonWebToken
- **Other Tools/Tech:**  Custom Middleware

---

## Getting Started

### Prerequisites
Install NodeJs, Visual Studio Code and Setup **dotenv**(Mandatory)

---

## Then Installation
```bash
# Clone the repository
git clone https://github.com/ohidurgclan/nextLvLAsignTwo.git

# Navigate to the project directory
cd <Your Folder>

# Install dependencies
npm install

#Run Project
npm run dev
