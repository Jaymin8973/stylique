-- AlterTable
ALTER TABLE `product` ADD COLUMN `userId` INTEGER NULL;

-- CreateTable
CREATE TABLE `brand` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `brand_name` VARCHAR(255) NULL,
    `brand_website` VARCHAR(255) NOT NULL,
    `catalog_details` VARCHAR(255) NULL,
    `brand_logo` VARCHAR(255) NULL,
    `document_proof` VARCHAR(255) NULL,
    `average_mrp` VARCHAR(50) NULL,
    `average_selling_price` VARCHAR(50) NULL,
    `brand_catalog_width` VARCHAR(50) NULL,
    `average_monthly_turnover` VARCHAR(50) NULL,
    `percentage_online_business` VARCHAR(50) NULL,
    `years_of_operation` VARCHAR(50) NULL,
    `usp` VARCHAR(255) NULL,
    `myntra_for_earth` VARCHAR(50) NULL,
    `primary_category` VARCHAR(255) NULL,
    `secondary_category` VARCHAR(255) NULL,
    `created_at` DATETIME(0) NOT NULL,
    `updated_at` DATETIME(0) NOT NULL,
    `seller_id` INTEGER NULL,

    INDEX `seller_id`(`seller_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `brand_category` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `brand_id` INTEGER NOT NULL,
    `primary_category` VARCHAR(255) NULL,
    `secondary_category` VARCHAR(255) NULL,
    `third_category` VARCHAR(255) NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `fk_brand_category`(`brand_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `brands` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `seller_id` INTEGER NOT NULL,
    `brand_name` VARCHAR(255) NULL,
    `brand_website` VARCHAR(255) NOT NULL,
    `catalog_details` VARCHAR(255) NULL,
    `brand_logo` VARCHAR(255) NULL,
    `document_proof` VARCHAR(255) NULL,
    `average_mrp` VARCHAR(50) NULL,
    `average_selling_price` VARCHAR(50) NULL,
    `brand_catalog_width` VARCHAR(50) NULL,
    `average_monthly_turnover` VARCHAR(50) NULL,
    `percentage_online_business` VARCHAR(50) NULL,
    `years_of_operation` VARCHAR(50) NULL,
    `usp` VARCHAR(255) NULL,
    `myntra_for_earth` VARCHAR(50) NULL,
    `primary_category` VARCHAR(255) NULL,
    `secondary_category` VARCHAR(255) NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `fk_brand_seller`(`seller_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `roles` (
    `RoleID` INTEGER NOT NULL AUTO_INCREMENT,
    `RoleName` VARCHAR(100) NOT NULL,

    UNIQUE INDEX `RoleName`(`RoleName`),
    PRIMARY KEY (`RoleID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `seller` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `gst` VARCHAR(20) NOT NULL,
    `organization_email` VARCHAR(255) NULL,
    `primary_contact_name` VARCHAR(120) NULL,
    `primary_contact_phone` VARCHAR(20) NULL,
    `primary_contact_email` VARCHAR(255) NULL,
    `business_owner_name` VARCHAR(120) NULL,
    `owner_contact_number` VARCHAR(20) NULL,
    `owner_email` VARCHAR(255) NULL,
    `signature` VARCHAR(255) NULL,
    `warehouse_address` TEXT NULL,
    `warehouse_city` VARCHAR(120) NULL,
    `warehouse_state` VARCHAR(120) NULL,
    `warehouse_pincode` VARCHAR(10) NULL,
    `account_holder_name` VARCHAR(120) NULL,
    `account_number` VARCHAR(40) NULL,
    `ifsc` VARCHAR(20) NULL,
    `bank_name` VARCHAR(120) NULL,
    `account_type` VARCHAR(20) NULL,
    `cancelled_cheque` VARCHAR(255) NULL,
    `brand_name` VARCHAR(255) NULL,
    `brand_description` TEXT NULL,
    `number_of_brands` INTEGER NULL,
    `declaration_accepted` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(0) NOT NULL,
    `updated_at` DATETIME(0) NOT NULL,

    UNIQUE INDEX `gst`(`gst`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sellers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `gst` VARCHAR(20) NOT NULL,
    `organization_email` VARCHAR(255) NULL,
    `primary_contact_name` VARCHAR(120) NULL,
    `primary_contact_phone` VARCHAR(20) NULL,
    `primary_contact_email` VARCHAR(255) NULL,
    `business_owner_name` VARCHAR(120) NULL,
    `owner_contact_number` VARCHAR(20) NULL,
    `owner_email` VARCHAR(255) NULL,
    `signature` VARCHAR(255) NULL,
    `warehouse_address` TEXT NULL,
    `warehouse_city` VARCHAR(120) NULL,
    `warehouse_state` VARCHAR(120) NULL,
    `warehouse_pincode` VARCHAR(10) NULL,
    `account_holder_name` VARCHAR(120) NULL,
    `account_number` VARCHAR(40) NULL,
    `ifsc` VARCHAR(20) NULL,
    `bank_name` VARCHAR(120) NULL,
    `account_type` VARCHAR(20) NULL,
    `cancelled_cheque` VARCHAR(255) NULL,
    `brand_name` VARCHAR(255) NULL,
    `brand_description` TEXT NULL,
    `number_of_brands` INTEGER NULL,
    `declaration_accepted` BOOLEAN NOT NULL DEFAULT false,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `gst`(`gst`),
    INDEX `fk_seller_user`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `UserID` INTEGER NOT NULL AUTO_INCREMENT,
    `Username` VARCHAR(100) NOT NULL,
    `Email` VARCHAR(150) NOT NULL,
    `PasswordHash` VARCHAR(255) NOT NULL,
    `RoleID` INTEGER NOT NULL,
    `IsActive` BOOLEAN NULL DEFAULT true,
    `CreatedAt` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `UpdatedAt` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `Username`(`Username`),
    UNIQUE INDEX `Email`(`Email`),
    INDEX `FK_Users_Roles`(`RoleID`),
    PRIMARY KEY (`UserID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `idx_product_userId` ON `product`(`userId`);

-- AddForeignKey
ALTER TABLE `brand` ADD CONSTRAINT `brand_ibfk_1` FOREIGN KEY (`seller_id`) REFERENCES `seller`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `brand_category` ADD CONSTRAINT `fk_brand_category` FOREIGN KEY (`brand_id`) REFERENCES `brands`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `brands` ADD CONSTRAINT `fk_brand_seller` FOREIGN KEY (`seller_id`) REFERENCES `sellers`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `product` ADD CONSTRAINT `fk_product_user` FOREIGN KEY (`userId`) REFERENCES `users`(`UserID`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sellers` ADD CONSTRAINT `fk_seller_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`UserID`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `FK_Users_Roles` FOREIGN KEY (`RoleID`) REFERENCES `roles`(`RoleID`) ON DELETE CASCADE ON UPDATE CASCADE;
