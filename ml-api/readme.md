# SMARTBITE MACHINE LEARNING API 🤖

## Installation

```bash
  pip install -r requirements.txt
```

## API URL

[Click Here](https://smartbite-ml-img-367241174085.asia-southeast2.run.app)

## Build With

![Logo](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)

![Logo](https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=Flask&logoColor=white)

![Logo](https://img.shields.io/badge/TensorFlow-FF3F06?style=for-the-badge&logo=tensorflow&logoColor=white)

## API Reference

#### Predict Nutrition

This endpoint is used to predict the nutritional content of a food image uploaded by a user.

```http
  POST /api/predict
```

| Method | Input | Description                       |
| :----- | :---- | :-------------------------------- |
| POST   | file  | **Required**. Authorization token |

#### Food Recomendation

This endpoint is used to obtain food recommendations based on calories.

```http
  GET /api/recomendation?calorie
```

| Method | Input   | Description                       |
| :----- | :------ | :-------------------------------- |
| GET    | calorie | **Required**. Authorization token |
