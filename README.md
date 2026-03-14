# Cloud Service (Experimental Project)

Cloud Service is an experimental backend architecture project focused on building a modular cloud storage system.

The project explores how different storage systems can be combined in a single architecture while keeping responsibilities clearly separated.

This project is intentionally designed as a **closed experimental system** and is not intended to be a public service.

---

# Project Goal

The goal of this project is to experiment with a scalable cloud architecture that separates responsibilities across different storage technologies.

Instead of relying on a single database, the system uses multiple services depending on their strengths.

This allows the architecture to remain flexible and easier to evolve.

---

# Relationship with Other Projects

This project is **completely independent from the Shiori project**.

Shiori focuses on content and user-facing services, while Cloud Service is used as an **internal experimental environment** to test backend architecture, storage strategies, and system design decisions.

---

# Architecture Overview

The system follows a **Client / Server separation architecture**.

### Client

The client layer is responsible only for the user interface.

Responsibilities

- UI rendering
- user interaction
- state management
- API communication

The client does not directly access databases or storage systems.

---

### Server

The server layer is responsible for application logic and data processing.

Responsibilities

- database access
- authentication validation
- permission control
- file storage management
- metadata processing

All data operations are handled by the server.

---

# Storage Architecture

The project intentionally separates different storage responsibilities.

| Service | Responsibility |
|--------|---------------|
| Firebase | Media file storage |
| MongoDB | Metadata management |
| Supabase (planned) | Document storage and authentication |

---

## Firebase

Firebase Storage is used for large media files such as:

- videos
- images
- thumbnails
- other media assets

Firebase is optimized for handling large file uploads and distribution.

---

## MongoDB

MongoDB is responsible for storing metadata.

Examples

- file metadata
- indexing data
- internal system data

Large media files themselves are not stored in MongoDB.

---

## Supabase (Planned)

Supabase will be introduced later for:

- document storage
- authentication
- user management

Supabase is based on PostgreSQL, which makes it suitable for structured relational data.

---

# Architecture Principle

The project follows the principle:

Right tool for the right responsibility

Media → Firebase  
Metadata → MongoDB  
Documents/Auth → Supabase

---

# Technology Stack

Frontend

- React
- TypeScript
- Vite

Backend

- Node.js
- Express

Storage / Database

- MongoDB
- Firebase Storage
- Supabase (planned)

---

# Development Philosophy

This project records **not only the final implementation but also the entire development process**.

Documentation includes:

- architectural decisions
- error handling processes
- problem solving approaches
- system design changes

The goal is to maintain a clear record of how the system evolves over time.

---

# Experimental Nature of the Project

This project is intentionally built as an **experimental backend environment**.

It is used to test:

- cloud storage architecture
- multi-database systems
- server architecture design
- development documentation practices

Because of this, the system may change frequently as new experiments are conducted.

---

# Future Plans

- Supabase integration
- authentication architecture experiments
- improved metadata indexing
- storage optimization
- architecture documentation expansion

---

# Author

Personal experimental backend architecture project.