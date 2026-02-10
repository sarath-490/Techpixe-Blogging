# AI Blog Platform (MERN Stack)

A production-ready blogging platform focused on Artificial Intelligence and Autonomous Agents, built with the MERN stack (MongoDB, Express, React, Node.js).

## Features

- **Public Frontend**: SEO-optimized, Investopedia-style design, responsive layout.
- **Admin Dashboard**: Secure JWT authentication, rich text editor (Quill), image uploads.
- **Content**: Markdown rendering, syntax highlighting, comments system.
- **Tech**: React + Vite + Tailwind CSS (Client), Node + Express + Mongoose (Server).

## Prerequisites

- Node.js (v18+)
- MongoDB (Running locally or Atlas URI)

## Quick Start

1.  **Install Dependencies**
    ```bash
    npm run install-all
    ```

2.  **Seed Database** (Optional, adds sample AI articles)
    ```bash
    npm run seed
    ```

3.  **Run Development Server**
    ```bash
    npm run dev
    ```
    - Client: http://localhost:5173
    - Server: http://localhost:5000

## Environment Variables

The `server/.env` file is pre-configured for local development:
```env
MONGO_URI=mongodb://127.0.0.1:27017/ai-blog
JWT_SECRET=thisisasercretkey123456
```

## Folder Structure

- `client/`: React frontend (Vite).
- `server/`: Express backend API.
- `server/uploads`: Directory for uploaded images.

## Admin Access

- **Login URL**: `/login` (Or use the User icon in header)
- **Default Credentials** (after seeding):
    - Email: `admin@aiinsights.com`
    - Password: `password123`

## SEO & Performance

- Uses `react-helmet-async` for dynamic meta tags.
- Semantic HTML structure.
- Optimized images.
