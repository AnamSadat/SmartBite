import os
from .routes import main
from flask import Flask, jsonify
# Inisialisasi aplikasi Flask
app = Flask(__name__)
app.json.sort_keys = False
app.config['DEBUG'] = True
app.config['UPLOAD_FOLDER'] = 'uploads'
# Mengimpor blueprint atau routing dari file lain
app.register_blueprint(main)
