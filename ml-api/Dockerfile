# Gunakan base image Python
FROM python:3.11-slim

# Set environment variables
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1

# Tentukan working directory di dalam container
WORKDIR /app

# Salin file requirements.txt ke dalam container
COPY requirements.txt /app/

# Install dependensi aplikasi
RUN pip install --no-cache-dir -r requirements.txt

# Salin seluruh kode aplikasi ke dalam container
COPY . /app/

# Tentukan port yang digunakan oleh aplikasi
EXPOSE 8080

# Tentukan command untuk menjalankan aplikasi
CMD ["flask", "run", "--host=0.0.0.0", "--port=8080"]