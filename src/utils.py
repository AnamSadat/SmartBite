import pandas as pd

def load_nutrition_data(csv_path):
    return pd.read_csv(csv_path)

def get_nutrition_info(food_name, nutrition_data):
    match = nutrition_data[nutrition_data['Food Name'].str.lower() == food_name.lower()]
    if not match.empty:
        return {
            'Calories (per 100g)': match['calories'].values[0],
            'Protein (per 100g)': match['protein'].values[0],
            'Fat (per 100g)': match['fat'].values[0],
            'Carbohydrate (per 100g)': match['carbohydrate'].values[0]
        }
    return None