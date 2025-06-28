import pandas as pd
csv_path = 'Data/nutrition.csv'
def load_nutrition_data(csv_path: str) -> pd.DataFrame:

    return pd.read_csv(csv_path)

def get_nutrition_info(food_name: str, nutrition_data: pd.DataFrame) -> dict:

    match = nutrition_data[nutrition_data['name'].str.lower() == food_name.lower()]
    if not match.empty:
        return {
            'Calories (per 100g)': match['calories'].values[0],
            'Protein (per 100g)': match['proteins'].values[0],
            'Fat (per 100g)': match['fat'].values[0],
            'Carbohydrate (per 100g)': match['carbohydrate'].values[0]
        }
    return None