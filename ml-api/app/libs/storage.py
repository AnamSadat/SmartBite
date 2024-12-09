from google.cloud import storage
import os
from datetime import datetime

base_dir = os.path.dirname(__file__)
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

gclient = storage.Client.from_service_account_json(
    os.path.join(base_dir, '../service_account.json'))
bucket = gclient.bucket('smartbite_bucket')


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def upload_file(file, user_id):
    try:
        timestamp = datetime.now().strftime('%Y-%m-%d_%H%M%S')
        filename = f"image_{timestamp}_{user_id}.jpg"
        blob = bucket.blob(filename)
        file.seek(0)
        blob.upload_from_file(file)
        return {
            "status": "success",
            "data": {
                "filename": filename,
                "url": blob.public_url
            }}
    except Exception as e:
        print(e)
        return None


def delete_file(file):
    try:
        blob = bucket.blob(file)
        blob.delete()
        return True
    except Exception as e:
        print(e)
        return False
