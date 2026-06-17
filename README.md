# 🚀 Employee Leave Management System (ELMS) - Frontend

## 📖 Overview

The **Employee Leave Management System (ELMS)** frontend is a full-stack enterprise-oriented web application built using Angular for managing employee leave workflows within an organization.

The system provides role-based interfaces for:
- Super Administrators
- Administrators
- Managers
- Employees

This is the **single shared website** for `Polus_project`.

**Run it:**
```powershell
cd D:\Polus_project\elms
.\run.ps1
```
Then open http://localhost:4200 (start a backend first — see `elms-backend-java/run.ps1` or `sristhi_project/README.md`).

Users can:
- Submit leave requests
- Track leave history
- Approve or reject requests
- Manage leave operations through structured workflows

The frontend communicates with a Spring Boot backend through REST APIs and is designed with focus on:
- Scalable component architecture
- Structured state management
- Maintainable frontend workflows
- Enterprise application design principles

---

# ✨ Features

- 📝 Employee leave request submission
- 📊 Leave history and status tracking
- 🔐 Role-based access workflows
- ✅ Manager approval/rejection handling
- 🛠️ Admin leave management operations
- 🔄 REST API integration
- ⚡ Reactive frontend workflows using Angular services
- 🧩 Modular and scalable component structure
- 🔒 Authentication and authorization integration

---

# 🛠️ Tech Stack

## Frontend
- Angular
- TypeScript
- HTML5
- CSS3

## Backend Integration
- Spring Boot REST APIs
- JSON-based API communication

## Database
- MySQL (via backend services)

---

# 🏗️ Architecture Focus

The application follows a modular Angular architecture with separation of concerns between:

- Components
- Services
- Routing
- Models / Interfaces
- Shared utilities
- Authentication workflows

This structure improves:
- Scalability
- Maintainability
- Readability
- Reusability

---

# ⚙️ Development Server

Start the local development server:

```bash
ng serve