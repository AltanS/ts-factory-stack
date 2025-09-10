# TS Factory Stack

An opinionated Typescript, Vite and React Router powered starter template.

## Requirements

- Docker
- Node.js >= 22

## Installation

Install the dependencies:

```bash
pnpm install
```

### Development

Start the development server with HMR:

- requires a postgres DB to exist with the credentials configured via .env

```bash
docker compose up #start postgres
pnpm dev #run the dev server
```

Your application will be available at `http://localhost:5173`.

## Building for Production

Create a production build:

```bash
pnpm build
```

## Deployment
