-- CreateTable
CREATE TABLE `users` (
    `id_user` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(45) NOT NULL,
    `password` VARCHAR(45) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id_user`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `food_items` (
    `id_food_items` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(45) NOT NULL,
    `calories` VARCHAR(45) NOT NULL,
    `protein` VARCHAR(45) NOT NULL,
    `carbohydrate` VARCHAR(45) NOT NULL,
    `fat` VARCHAR(45) NOT NULL,
    `serving_size` VARCHAR(45) NOT NULL,
    `image_url` VARCHAR(45) NOT NULL,

    PRIMARY KEY (`id_food_items`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `model_logs` (
    `id_log` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `image_input_url` VARCHAR(45) NOT NULL,
    `predicted_food_id` INTEGER NOT NULL,
    `confidence_score` VARCHAR(45) NOT NULL,
    `created_at` DATETIME(0) NOT NULL,

    UNIQUE INDEX `user_id_UNIQUE`(`user_id`),
    UNIQUE INDEX `predicted_food_id_UNIQUE`(`predicted_food_id`),
    PRIMARY KEY (`id_log`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `profile` (
    `id_profile` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `name` INTEGER NOT NULL,
    `age` INTEGER NOT NULL,
    `gender` VARCHAR(255) NOT NULL,
    `weight` INTEGER NOT NULL,
    `height` INTEGER NOT NULL,

    UNIQUE INDEX `user_id_UNIQUE`(`user_id`),
    INDEX `user_id`(`user_id`),
    PRIMARY KEY (`id_profile`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `recommendations` (
    `id_recommendations` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `food_id` INTEGER NOT NULL,
    `create_at` DATETIME(0) NOT NULL,

    UNIQUE INDEX `user_id_UNIQUE`(`user_id`),
    UNIQUE INDEX `recommendations_food_id_key`(`food_id`),
    INDEX `food_id`(`food_id`),
    PRIMARY KEY (`id_recommendations`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_meals_history` (
    `iduser_meals_history` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `food_id` INTEGER NOT NULL,
    `consumed_at` DATETIME(0) NOT NULL,
    `quantity` VARCHAR(45) NOT NULL,
    `total_calories` VARCHAR(45) NOT NULL,

    UNIQUE INDEX `user_id_UNIQUE`(`user_id`),
    UNIQUE INDEX `food_id_UNIQUE`(`food_id`),
    PRIMARY KEY (`iduser_meals_history`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `model_logs` ADD CONSTRAINT `model_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users`(`id_user`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `model_logs` ADD CONSTRAINT `model_logs_ibfk_2` FOREIGN KEY (`predicted_food_id`) REFERENCES `food_items`(`id_food_items`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `profile` ADD CONSTRAINT `profile_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users`(`id_user`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `recommendations` ADD CONSTRAINT `recommendations_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users`(`id_user`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `recommendations` ADD CONSTRAINT `recommendations_ibfk_2` FOREIGN KEY (`food_id`) REFERENCES `food_items`(`id_food_items`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `user_meals_history` ADD CONSTRAINT `user_meals_history_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users`(`id_user`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `user_meals_history` ADD CONSTRAINT `user_meals_history_ibfk_2` FOREIGN KEY (`food_id`) REFERENCES `food_items`(`id_food_items`) ON DELETE CASCADE ON UPDATE NO ACTION;
