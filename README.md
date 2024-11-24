
# API

## Installation Process

To install and run this API, follow these steps:

### Required

Make sure you have the following software installed on your system:

- [Node.js](https://nodejs.org/) (version 18 or later)
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/)

### Installation Steps

1. **Clone this repository:**
   ```bash
   git clone https://github.com/AnamSadat/SmartBite
   ```

2. **Go to the project directory:**
   ```bash
   cd SmartBite
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```
   or
   
   ```bash
   pnpm install
   ```

4. **Insert secret key on file `.env` `SECRET_KEY`**

5. **Run a migration to create database tables with Prisma Migrate:**
   ```bash
   npx prisma migrate dev --name init
   ```

6. **Generate Prisma Client**

    ```bash
    npx prisma generate
    ```
	
7. **Run the API:**
   ```bash
   npm run dev
   ```
   or

   ```bash
   pnpm dev
   ```

7. **API Access:**
   Open your browser and visit `http://localhost:3000/api`

### Documentation (coming soon)