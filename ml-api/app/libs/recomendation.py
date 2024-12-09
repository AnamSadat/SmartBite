import pandas as pd
import numpy as np
import os
# Load data
base_dir = os.path.dirname(__file__)
csv_path = os.path.join(base_dir, '../data/nutrition.csv')
data = pd.read_csv(csv_path)

# # Preview data
# print("Data Sample:")
# print(data.head())

# Pastikan kolom 'Calories' tidak memiliki nilai kosong
data_cleaned = data.dropna(subset=['calories'])

# Fungsi untuk merekomendasikan makanan berdasarkan kalori


def recommend_by_calories(calorie_input, top_n=5):
    # Hitung selisih antara input kalori dengan kalori setiap makanan
    data_cleaned['Calorie_Difference'] = np.abs(
        data_cleaned['calories'] - calorie_input)

    # Urutkan data berdasarkan selisih kalori (nilai terdekat di atas)
    recommendations = data_cleaned.sort_values(
        by='Calorie_Difference').head(top_n)

    # Pilih kolom nama makanan dan kalorinya untuk ditampilkan
    return recommendations[['name', 'calories']].apply(
        lambda row: {'foodname': row['name'], 'calories': row['calories']}, axis=1).tolist()


# # Input kalori dari terminal
# try:
#     calorie_input = int(input("Masukkan jumlah kalori yang diinginkan: "))
#     recommendations = recommend_by_calories(calorie_input, top_n=5)

#     print(f"\nMakanan dengan kalori mendekati {calorie_input}:")
#     print(recommendations)
# except ValueError:
#     print("Harap masukkan angka yang valid!")
