from flask import Blueprint, request, jsonify
from .libs.prediction import predict_food
from .middleware.auth import authenticate
from .libs.storage import allowed_file, upload_file, delete_file
from .libs.recomendation import recommend_by_calories
from .libs.db import get_mysql_connection
from datetime import datetime

main = Blueprint('main', __name__)
sql = get_mysql_connection()
db = sql.cursor()


@main.route('/')
def home():
    message = "Welcome to our SmartBite machine learning model endpoints. Before accessing our ML endpoints, please first register and login in application."
    return jsonify(message)


@main.route('/predict', methods=['POST'])
@authenticate
def predict():
    if 'image' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['image']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    if file and allowed_file(file.filename):
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S.%f')
        user_id = request.user_id
        upload = upload_file(file, user_id)
        imageurl = upload["data"]["url"]
        filename = upload["data"]["filename"]
        if not upload:
            result = {
                "status": "error",
                "data": "Error uploading file"
            }
            return jsonify(result), 400

        predict = predict_food(imageurl)
        if not predict:
            deleteimg = delete_file(filename)

            result = {
                "status": "error",
                "data": "No food found"
            }
            return jsonify(result), 400

        db.execute("INSERT INTO model_logs (user_id, image_input_url, predicted_food_id, confidence_score, created_at) VALUES (%s, %s, %s, %s, %s)",
                   (user_id, imageurl, float(predict["food_id"]), predict["probability"], timestamp))
        sql.commit()
        result = {
            "status": "success",
            "data": predict
        }
        return jsonify(result), 200
    else:
        return jsonify({"error": "Invalid file type"}), 400


@main.route('/recomendation', methods=['GET'])
@authenticate
def recomendation():
    calorie = request.args.get('calorie', 0)
    if not calorie:
        return jsonify({"status": "fail", "message": "Missing calorie parameter"}), 400
    calorie_input = float(request.args.get('calorie', 0))
    recomendation = recommend_by_calories(calorie_input, top_n=5)
    return jsonify({"status": "success", "data": recomendation}), 200
