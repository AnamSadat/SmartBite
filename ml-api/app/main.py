from app import app
import os
# Muat variabel dari file .env
print(os.environ)
if __name__ == '__main__':
    print("Starting app...")
    app.run(host='0.0.0.0', port=8080, debug=True)
