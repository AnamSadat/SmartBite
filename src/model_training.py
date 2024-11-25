import tensorflow as tf
from tensorflow.keras import layers, models
from tensorflow.keras.callbacks import EarlyStopping, ReduceLROnPlateau
from sklearn.utils.class_weight import compute_class_weight
import numpy as np
from data_preprocess import create_generators

def build_model(num_classes):
    base_model = tf.keras.applications.EfficientNetV2B0(
        weights='imagenet', include_top=False, input_shape=(224, 224, 3)
    )
    base_model.trainable = False  # Freeze base model

    model = models.Sequential([
        base_model,
        layers.GlobalAveragePooling2D(),
        layers.Dropout(0.3),
        layers.Dense(num_classes, activation='softmax')
    ])
    return model

def fine_tune_model(model, base_model, learning_rate=1e-5):
    base_model.trainable = True
    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate),
        loss='categorical_crossentropy',
        metrics=['accuracy']
    )
    return model

def train_model(train_generator, val_generator, num_classes, epochs=200):
    # Compute class weights
    class_weights = compute_class_weight(
        class_weight='balanced',
        classes=np.unique(train_generator.classes),
        y=train_generator.classes
    )
    class_weights = {i: weight for i, weight in enumerate(class_weights)}

    # Build and compile the model
    model = build_model(num_classes)
    
    # Callbacks
    early_stopping = EarlyStopping(monitor='val_loss', patience=10, restore_best_weights=True)
    reduce_lr = ReduceLROnPlateau(monitor='val_loss', factor=0.2, patience=5, min_lr=1e-7)

    # Train the model
    history = model.fit(
        train_generator,
        epochs=epochs,
        validation_data=val_generator,
        class_weight=class_weights,
        callbacks=[early_stopping, reduce_lr]
    )

    # Fine-tune the model
    model = fine_tune_model(model, model.layers[0])

    # Continue training the fine-tuned model
    history_fine = model.fit(
        train_generator,
        epochs=epochs,
        validation_data=val_generator,
        class_weight=class_weights,
        callbacks=[early_stopping, reduce_lr]
    )

    return model, history, history_fine