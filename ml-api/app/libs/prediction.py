import numpy as np
import os
import requests
from io import BytesIO
import json
import mysql.connector
import tensorflow as tf
from .nutrition import load_nutrition_data, get_nutrition_info

base_dir = os.path.dirname(__file__)

csv_path = os.path.join(base_dir, '../data/nutrition.csv')
model_path = os.path.join(base_dir, '../model/best_model_cnn.keras')
class_path = os.path.join(base_dir, '../data/class_indices.json')

with open(class_path, 'r') as f:
    class_indices = json.load(f)
model = tf.keras.models.load_model(model_path)
nutrition_data = load_nutrition_data(csv_path)


def predict_food(image_url):
    getImage = requests.get(image_url)
    image = tf.keras.preprocessing.image.load_img(
        BytesIO(getImage.content), target_size=(224, 224))
    image = tf.keras.preprocessing.image.img_to_array(image) / 255.0
    image = np.expand_dims(image, axis=0)

    prediction = model.predict(image)
    predicted_class = np.argmax(prediction, axis=1)[0]
    class_names = {v: k for k, v in class_indices.items()}
    food_id = predicted_class + 1
    food_name = class_names[predicted_class]
    nutrition_info = get_nutrition_info(food_name, nutrition_data)
    if nutrition_info:
        key_mapping = {
            'Calories (per 100g)': 'calories',
            'Protein (per 100g)': 'protein',
            'Fat (per 100g)': 'fat',
            'Carbohydrate (per 100g)': 'carbohydrate'
        }
        cleaned_nutrition_info = {
            key_mapping[key]: (value.item() if isinstance(
                value, (np.int64, np.float64)) else value)
            for key, value in nutrition_info.items()
        }
        probability = prediction[0][predicted_class]
        if (probability < 0.99999):
            return None
        data = {
            "food_id": f"{food_id}",
            "food_name": food_name,
            "nutrition_info": cleaned_nutrition_info,
            "probability": f"{prediction[0][predicted_class]:.2f}"
        }
        return data
    return None
