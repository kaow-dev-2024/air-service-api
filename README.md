# PAI FIDS Backend

## Development

### 1) Setup environment
Create or update `.env.dev` (and `.env` if needed) with your local values:

```env
NODE_ENV=development
PORT=5001
DB_HOST=127.0.0.1
DB_PORT=5433
DB_NAME=pai_fids_db
DB_USERNAME=paiadmin
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
BASE_URL=localhost
URL_ORIGIN=http://localhost:3000,http://127.0.0.1:3000
TIME_ZONE=Asia/Bangkok
```

### 2) Install dependencies
```bash
npm install
```

### 3) Run database migrations
```bash
npm run migrate
```

### 4) Seed initial data (optional but recommended)
```bash
npm run seed
```

### 5) Start in development mode
```bash
npm run dev
```

### 6) Run integration test
```bash
npm run test
```

## Deploy Production

### 1) Prepare production environment
Set production-ready values in environment variables (or `.env` in server):
- `NODE_ENV=production`
- `PORT`
- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USERNAME`, `DB_PASSWORD`
- `JWT_SECRET`, `JWT_REFRESH_SECRET`
- `BASE_URL`, `URL_ORIGIN`, `TIME_ZONE`

### 2) Install dependencies on server
```bash
npm install
```

### 3) Deploy with one command
This command runs test, migration, then starts production server:
```bash
npm run deploy:prod
```

Equivalent flow:
```bash
npm run test
npm run start:prod
```

## Useful Scripts

- `npm run dev` : run local development server (nodemon)
- `npm run start` : run server with node
- `npm run migrate` : run Sequelize migrations
- `npm run seed` : run Sequelize seeders
- `npm run test` : run integration tests
- `npm run test:integration` : run integration test script directly
- `npm run start:prod` : migrate then start server
- `npm run deploy:prod` : test + migrate + start production
# air-service-api
