# Gunakan Node.js versi tertentu
FROM node:18.20.4

# Set direktori kerja di dalam container
WORKDIR /app

# Salin file package.json dan pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Install pnpm
RUN npm install -g pnpm

# Instal dependencies menggunakan pnpm
RUN pnpm install

# Salin seluruh kode aplikasi ke dalam container
COPY . .

# Generate prisma
RUN npx prisma generate
# Tentukan environment variable untuk port
ENV PORT 8080

# Buka port yang akan digunakan aplikasi
EXPOSE 8080

# Jalankan perintah untuk memulai aplikasi
CMD [ "pnpm", "run", "dev" ]
