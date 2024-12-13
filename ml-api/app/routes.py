from flask import Blueprint, request, jsonify
from .libs.prediction import predict_food
from .middleware.auth import authenticate
from .libs.storage import allowed_file, upload_file, delete_file
from .libs.recomendation import recommend_by_calories
from datetime import datetime

main = Blueprint('main', __name__)


@main.route('/')
def home():
    message = "Welcome to our SmartBite machine learning model endpoints. Before accessing our ML endpoints, please first register and login in application."
    return jsonify(message)


@main.route('/predict', methods=['POST'])
# @authenticate
def predict():
    if 'image' not in request.files:
        return jsonify({"status": "error", "error": "No file part"}), 400
    file = request.files['image']
    if file.filename == '':
        return jsonify({"status": "error", "error": "No selected file"}), 400
    if file and allowed_file(file.filename):
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S.%f')
        upload = upload_file(file)
        imageurl = upload["data"]["url"]
        filename = upload["data"]["filename"]
        if not upload:
            result = {
                "error": False,
                "message": "Error uploading file"
            }
            return jsonify(result), 400

        predict = predict_food(imageurl)
        if not predict:
            deleteimg = delete_file(filename)

            result = {
                "error": True,
                "message": "Prediction failed"
            }
            return jsonify(result), 400

        result = {
            "error": False,
            "message": "Prediction successful",
            "food": predict
        }
        return jsonify(result), 200
    else:
        return jsonify({"error": True, "error": "Invalid file type"}), 400


@main.route('/recomendation', methods=['GET'])
# @authenticate
def recomendation():
    calorie = request.args.get('calorie', 0)
    if not calorie:
        return jsonify({"status": "fail", "message": "Missing calorie parameter"}), 400
    calorie_input = float(request.args.get('calorie', 0))
    recomendation = recommend_by_calories(calorie_input, top_n=5)
    print(recomendation)
    return jsonify({"error": False, "message": "Fetch Recomendation Success", "listFood": recomendation}), 200
