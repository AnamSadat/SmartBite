-- AlterTable
ALTER TABLE `food_items` MODIFY `calories` VARCHAR(45) NULL,
    MODIFY `protein` VARCHAR(45) NULL,
    MODIFY `carbohydrate` VARCHAR(45) NULL,
    MODIFY `fat` VARCHAR(45) NULL,
    MODIFY `serving_size` VARCHAR(45) NULL,
    MODIFY `image_url` VARCHAR(45) NULL;

-- AlterTable
ALTER TABLE `model_logs` MODIFY `image_input_url` VARCHAR(45) NULL,
    MODIFY `confidence_score` VARCHAR(45) NULL,
    MODIFY `created_at` DATETIME(0) NULL;

-- AlterTable
ALTER TABLE `recommendations` MODIFY `create_at` DATETIME(0) NULL;

-- AlterTable
ALTER TABLE `user_meals_history` MODIFY `consumed_at` DATETIME(0) NULL,
    MODIFY `quantity` VARCHAR(45) NULL,
    MODIFY `total_calories` VARCHAR(45) NULL;
