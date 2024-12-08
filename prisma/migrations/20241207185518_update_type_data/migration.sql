/*
  Warnings:

  - Made the column `calories` on table `food_items` required. This step will fail if there are existing NULL values in that column.
  - Made the column `protein` on table `food_items` required. This step will fail if there are existing NULL values in that column.
  - Made the column `carbohydrate` on table `food_items` required. This step will fail if there are existing NULL values in that column.
  - Made the column `fat` on table `food_items` required. This step will fail if there are existing NULL values in that column.
  - Made the column `serving_size` on table `food_items` required. This step will fail if there are existing NULL values in that column.
  - Made the column `image_url` on table `food_items` required. This step will fail if there are existing NULL values in that column.
  - Made the column `image_input_url` on table `model_logs` required. This step will fail if there are existing NULL values in that column.
  - Made the column `confidence_score` on table `model_logs` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `model_logs` required. This step will fail if there are existing NULL values in that column.
  - Made the column `create_at` on table `recommendations` required. This step will fail if there are existing NULL values in that column.
  - Made the column `consumed_at` on table `user_meals_history` required. This step will fail if there are existing NULL values in that column.
  - Made the column `quantity` on table `user_meals_history` required. This step will fail if there are existing NULL values in that column.
  - Made the column `total_calories` on table `user_meals_history` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `model_logs` DROP FOREIGN KEY `model_logs_ibfk_1`;

-- DropForeignKey
ALTER TABLE `model_logs` DROP FOREIGN KEY `model_logs_ibfk_2`;

-- DropForeignKey
ALTER TABLE `profile` DROP FOREIGN KEY `profile_ibfk_1`;

-- DropForeignKey
ALTER TABLE `recommendations` DROP FOREIGN KEY `recommendations_ibfk_1`;

-- DropForeignKey
ALTER TABLE `recommendations` DROP FOREIGN KEY `recommendations_ibfk_2`;

-- DropForeignKey
ALTER TABLE `user_meals_history` DROP FOREIGN KEY `user_meals_history_ibfk_1`;

-- DropForeignKey
ALTER TABLE `user_meals_history` DROP FOREIGN KEY `user_meals_history_ibfk_2`;

-- DropIndex
DROP INDEX `predicted_food_id_UNIQUE` ON `model_logs`;

-- DropIndex
DROP INDEX `user_id_UNIQUE` ON `model_logs`;

-- DropIndex
DROP INDEX `user_id_UNIQUE` ON `profile`;

-- DropIndex
DROP INDEX `recommendations_food_id_key` ON `recommendations`;

-- DropIndex
DROP INDEX `user_id_UNIQUE` ON `recommendations`;

-- DropIndex
DROP INDEX `food_id_UNIQUE` ON `user_meals_history`;

-- DropIndex
DROP INDEX `user_id_UNIQUE` ON `user_meals_history`;

-- AlterTable
ALTER TABLE `food_items` MODIFY `calories` DOUBLE NOT NULL,
    MODIFY `protein` DOUBLE NOT NULL,
    MODIFY `carbohydrate` DOUBLE NOT NULL,
    MODIFY `fat` DOUBLE NOT NULL,
    MODIFY `serving_size` DOUBLE NOT NULL,
    MODIFY `image_url` VARCHAR(45) NOT NULL;

-- AlterTable
ALTER TABLE `model_logs` MODIFY `image_input_url` VARCHAR(45) NOT NULL,
    MODIFY `confidence_score` DOUBLE NOT NULL,
    MODIFY `created_at` DATETIME(0) NOT NULL;

-- AlterTable
ALTER TABLE `profile` MODIFY `name` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `recommendations` MODIFY `create_at` DATETIME(0) NOT NULL;

-- AlterTable
ALTER TABLE `user_meals_history` MODIFY `consumed_at` DATETIME(0) NOT NULL,
    MODIFY `quantity` INTEGER NOT NULL,
    MODIFY `total_calories` DOUBLE NOT NULL;

-- AddForeignKey
ALTER TABLE `model_logs` ADD CONSTRAINT `model_logs_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id_user`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `model_logs` ADD CONSTRAINT `model_logs_predicted_food_id_fkey` FOREIGN KEY (`predicted_food_id`) REFERENCES `food_items`(`id_food_items`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `profile` ADD CONSTRAINT `profile_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id_user`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `recommendations` ADD CONSTRAINT `recommendations_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id_user`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `recommendations` ADD CONSTRAINT `recommendations_food_id_fkey` FOREIGN KEY (`food_id`) REFERENCES `food_items`(`id_food_items`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `user_meals_history` ADD CONSTRAINT `user_meals_history_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id_user`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `user_meals_history` ADD CONSTRAINT `user_meals_history_food_id_fkey` FOREIGN KEY (`food_id`) REFERENCES `food_items`(`id_food_items`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- RenameIndex
ALTER TABLE `profile` RENAME INDEX `user_id` TO `profile_user_id_idx`;

-- RenameIndex
ALTER TABLE `recommendations` RENAME INDEX `food_id` TO `recommendations_food_id_idx`;
