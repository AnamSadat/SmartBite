import numpy as np
from sklearn.utils.class_weight import compute_class_weight

def calculate_class_weights(generator):
    class_counts = np.bincount(generator.classes)
    class_weights = compute_class_weight(
        class_weight='balanced',
        classes=np.unique(generator.classes),
        y=generator.classes
    )
    return {i: weight for i, weight in enumerate(class_weights)}