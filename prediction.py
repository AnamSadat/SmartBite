import numpy as np
import tensorflow as tf
from csv_path import load_nutrition_data, get_nutrition_info

def predict_food(image_path, model_path, csv_path, class_indices):
    model = tf.keras.models.load_model(model_path)
    image = tf.keras.preprocessing.image.load_img(image_path, target_size=(224, 224))
    image = tf.keras.preprocessing.image.img_to_array(image) / 255.0
    image = np.expand_dims(image, axis=0)

    prediction = model.predict(image)
    predicted_class = np.argmax(prediction, axis=1)[0]

    class_names = {v: k for k, v in class_indices.items()}
    food_name = class_names[predicted_class]

    nutrition_data = load_nutrition_data(csv_path)
    nutrition_info = get_nutrition_info(food_name, nutrition_data)

    if nutrition_info:
        return f"Food: {food_name}\nNutrition per 100g:\n" + "\n".join(
            [f"{key}: {value}" for key, value in nutrition_info.items()]
        )
    return f"Food: {food_name}\nNutrition data not found."