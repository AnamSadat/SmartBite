# Import necessary functions
from data_preprocess import create_generators
from model_training import training_model

# Paths to dataset and CSV
dataset_path = 'Smartbite\Images'
nutrition_csv = 'Smartbite\Data\nutrition.csv'

# Create data generators
train_generator, val_generator, num_classes = create_generators(dataset_path, nutrition_csv)

# Train and fine-tune the model
model, history, history_fine = training_model(train_generator, val_generator, num_classes, epochs=200)
