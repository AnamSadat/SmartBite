-- CreateTable
CREATE TABLE `users` (
    `id_user` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(45) NOT NULL,
    `password` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id_user`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `food_items` (
    `id_food_items` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(45) NOT NULL,
    `calories` DOUBLE NOT NULL,
    `protein` DOUBLE NOT NULL,
    `carbohydrate` DOUBLE NOT NULL,
    `fat` DOUBLE NOT NULL,
    `serving_size` DOUBLE NOT NULL DEFAULT 100,

    PRIMARY KEY (`id_food_items`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `model_logs` (
    `id_log` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `image_input_url` TEXT NOT NULL,
    `predicted_food_id` INTEGER NOT NULL,
    `confidence_score` DOUBLE NOT NULL,
    `created_at` DATETIME(0) NOT NULL,

    PRIMARY KEY (`id_log`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `profile` (
    `id_profile` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `age` INTEGER NOT NULL,
    `gender` VARCHAR(255) NOT NULL,
    `weight` INTEGER NOT NULL,
    `height` INTEGER NOT NULL,

    UNIQUE INDEX `profile_user_id_key`(`user_id`),
    INDEX `profile_user_id_idx`(`user_id`),
    PRIMARY KEY (`id_profile`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `recommendations` (
    `id_recommendations` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `food_id` INTEGER NOT NULL,
    `create_at` DATETIME(0) NOT NULL,

    INDEX `recommendations_food_id_idx`(`food_id`),
    PRIMARY KEY (`id_recommendations`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `active_tokens` (
    `id_token` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `token` TEXT NOT NULL,

    UNIQUE INDEX `active_tokens_user_id_key`(`user_id`),
    INDEX `active_tokens_user_id_idx`(`user_id`),
    PRIMARY KEY (`id_token`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_meals_history` (
    `iduser_meals_history` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `food_id` INTEGER NOT NULL,
    `consumed_at` DATETIME(0) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `total_calories` DOUBLE NOT NULL,

    PRIMARY KEY (`iduser_meals_history`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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
ALTER TABLE `active_tokens` ADD CONSTRAINT `active_tokens_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id_user`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `user_meals_history` ADD CONSTRAINT `user_meals_history_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id_user`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `user_meals_history` ADD CONSTRAINT `user_meals_history_food_id_fkey` FOREIGN KEY (`food_id`) REFERENCES `food_items`(`id_food_items`) ON DELETE CASCADE ON UPDATE NO ACTION;
