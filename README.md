# Web District

Web District is a full-stack agency website and client/admin platform for a
premium website development agency.

- Production frontend: https://www.web-district.com
- Production API: https://web-district.onrender.com
- API health: https://web-district.onrender.com/api/health

## Platform Overview

### Public Website

- Home, Services, Work, Process, Start, and Contact pages
- Project case studies and fallback portfolio content
- Website Care inside the Services page
- Direct WhatsApp, phone, email, and Instagram contact options
- English and Arabic content with RTL support
- SEO metadata, canonical URLs, social sharing tags, robots, and sitemap
- Installable PWA with offline fallback and deployment-safe cache handling
- Vercel Analytics and Speed Insights
- Keyboard, focus, dialog, form, and reduced-motion accessibility support

### Client Portal

- Client dashboard and profile
- Website requests
- Appointment and call-slot booking
- Contracts and proposals
- Project status tracking
- Review submission
- English and Arabic support with LTR handling for emails and phone numbers

### Admin Dashboard

- English/LTR-only administration
- Dashboard statistics
- Client account management
- Website request management
- Appointment and call-slot management
- Contract and proposal management
- Project and portfolio management
- Review and testimonial moderation
- Package and service management
- FAQ and public settings management
- Admin-only Cloudinary image uploads
- Admin-only email diagnostics

## Technology

### Frontend

- React 19 and Vite
- Tailwind CSS
- React Router
- Axios
- Lucide React and React Icons
- React Hot Toast
- Vercel Analytics and Speed Insights

### Backend

- Node.js and Express
- MongoDB Atlas with Mongoose
- JWT authentication with client/admin roles
- Helmet, strict CORS, and rate limiting
- Nodemailer with Gmail SMTP
- Cloudinary image uploads
- Validation, duplicate-key handling, and production-safe error responses

## Hosting

- Frontend: Vercel
- Backend: Render Starter
- Database: MongoDB Atlas
- Email: Gmail SMTP through Nodemailer
- Uploaded project media: Cloudinary

See [DEPLOYMENT.md](DEPLOYMENT.md) for complete deployment instructions.

## Repository Structure

```text
client/                 React + Vite frontend
server/                 Express API
server/scripts/qa/      Dependency-free API smoke tests
README.md               Project overview and local setup
DEPLOYMENT.md           Production deployment guide
QA.md                   QA command reference
LAUNCH_CHECKLIST.md     Pre-launch and post-launch checklist
MAINTENANCE.md          Ongoing operations guide
SECURITY.md             Security and disclosure notes
```

## Requirements

- Node.js 20 LTS or newer
- npm
- MongoDB connection for backend development

Node package `engines` are intentionally not enforced. The project is currently
verified on a newer Node runtime while remaining compatible with Node 20+.

## Local Development

### Backend

```powershell
cd server
npm install
Copy-Item .env.example .env
npm.cmd run dev
```

The local API defaults to `http://localhost:5000/api`.

### Frontend

```powershell
cd client
npm install
Copy-Item .env.example .env
npm.cmd run dev
```

The Vite development server normally opens at `http://localhost:5173`.
For local full-stack development, set `VITE_API_URL=http://localhost:5000/api`
in `client/.env`.

## Environment

### Frontend

```env
VITE_API_URL=https://web-district.onrender.com/api
VITE_META_PIXEL_ID=
```

`VITE_API_URL` must include `/api`.
`VITE_META_PIXEL_ID` is the Meta Dataset/Pixel ID used for public conversion
tracking. Vite embeds both variables at build time, so redeploy after changing
either value. Do not commit the real Pixel ID to documentation.

### Backend

```env
NODE_ENV=production
PORT=5000
MONGO_URI=
JWT_SECRET=
JWT_EXPIRES_IN=30d
CLIENT_URL=https://www.web-district.com
ALLOWED_ORIGINS=https://www.web-district.com,https://web-district.com
EMAIL_USER=
EMAIL_PASS=
OWNER_EMAIL=web.district22@gmail.com
EMAIL_FROM_NAME=Web District
EMAIL_ALLOW_SELF_SIGNED=false
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Use a long, random `JWT_SECRET`. `EMAIL_PASS` must be a Gmail App Password, not
the normal Gmail account password. Keep `EMAIL_ALLOW_SELF_SIGNED=false` in
production.

The admin seed command also supports seed-only variables documented in
`server/.env.example`. Do not leave seed credentials enabled unnecessarily.

Never commit `.env` files or real credentials.

## Quality Checks

### Frontend

```powershell
cd client
npm.cmd run lint
npm.cmd run build
```

### Backend API

```powershell
cd server
npm.cmd run qa:public
npm.cmd run qa:protected
npm.cmd run qa
```

Admin QA skips when credentials are absent. Write QA is disabled by default and
must not be run against production without deliberate approval.

See [QA.md](QA.md) and [LAUNCH_CHECKLIST.md](LAUNCH_CHECKLIST.md).

## Operations

- [Deployment guide](DEPLOYMENT.md)
- [QA guide](QA.md)
- [Launch checklist](LAUNCH_CHECKLIST.md)
- [Maintenance guide](MAINTENANCE.md)
- [Security notes](SECURITY.md)
