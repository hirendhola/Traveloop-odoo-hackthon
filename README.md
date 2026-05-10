# Traveloop

A travel planning web app built for the Odoo Hackathon. Plan trips, organize itineraries, and manage travel activities.

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Prisma with PostgreSQL
- better-auth for authentication
- Cloudflare R2 for file storage
- Resend for emails
- shadcn/ui + Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 20.9+
- Bun
- PostgreSQL database

### Setup

1. Clone the repository

2. Install dependencies:
   ```bash
   bun install
   ```

3. Copy the environment file and fill in your values:
   ```bash
   cp .env.example .env
   ```

4. Run database migrations:
   ```bash
   bun db:migrate
   ```

5. Start the development server:
   ```bash
   bun dev
   ```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

See `.env.example` for all required variables. You will need:

- `DATABASE_URL` - PostgreSQL connection string
- `BETTER_AUTH_SECRET` - Random secret for auth
- `RESEND_API_KEY` - For sending emails
- Cloudflare R2 credentials for file uploads

## Scripts

| Command | Description |
|---------|-------------|
| `bun dev` | Start development server |
| `bun build` | Build for production |
| `bun start` | Start production server |
| `bun db:migrate` | Run database migrations |
| `bun db:seed` | Seed the database |
| `bun db:studio` | Open Prisma Studio |

## Deployment

Deploy on Vercel. Set all environment variables from `.env.example` in the Vercel dashboard before deploying.
