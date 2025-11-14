-- CreateTable
CREATE TABLE `FootwearDetail` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `footwearType` VARCHAR(191) NULL,
    `heelHeight` VARCHAR(191) NULL,
    `soleMaterial` VARCHAR(191) NULL,
    `upperMaterial` VARCHAR(191) NULL,
    `closure` VARCHAR(191) NULL,
    `productId` INTEGER NOT NULL,

    UNIQUE INDEX `FootwearDetail_productId_key`(`productId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AccessoryDetail` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `accessoryType` VARCHAR(191) NULL,
    `dimensions` VARCHAR(191) NULL,
    `weight` VARCHAR(191) NULL,
    `productId` INTEGER NOT NULL,

    UNIQUE INDEX `AccessoryDetail_productId_key`(`productId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Product` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `productName` VARCHAR(191) NOT NULL,
    `brand` VARCHAR(191) NOT NULL,
    `productType` VARCHAR(191) NOT NULL,
    `gender` VARCHAR(191) NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `subcategory` VARCHAR(191) NOT NULL,
    `mrp` VARCHAR(191) NOT NULL,
    `sellingPrice` VARCHAR(191) NOT NULL,
    `discountPercent` VARCHAR(191) NULL,
    `sku` VARCHAR(191) NOT NULL,
    `hsnCode` VARCHAR(191) NULL,
    `totalStock` VARCHAR(191) NOT NULL,
    `shortDescription` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `lowStockAlert` VARCHAR(191) NULL,
    `metaTitle` VARCHAR(191) NULL,
    `metaDescription` VARCHAR(191) NULL,
    `tags` VARCHAR(191) NULL,
    `imageUrl` VARCHAR(191) NULL,
    `status` VARCHAR(191) NULL,
    `shippingWeight` VARCHAR(191) NULL,
    `packageDimensions` VARCHAR(191) NULL,
    `returnPolicy` VARCHAR(191) NULL,
    `shippingClass` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ClothingDetail` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `material` VARCHAR(191) NULL,
    `fabric` VARCHAR(191) NULL,
    `pattern` VARCHAR(191) NULL,
    `collarType` VARCHAR(191) NULL,
    `sleeveType` VARCHAR(191) NULL,
    `fit` VARCHAR(191) NULL,
    `occasion` VARCHAR(191) NULL,
    `season` VARCHAR(191) NULL,
    `careInstructions` VARCHAR(191) NULL,
    `productId` INTEGER NOT NULL,

    UNIQUE INDEX `ClothingDetail_productId_key`(`productId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProductImage` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `url` VARCHAR(191) NOT NULL,
    `isPrimary` BOOLEAN NOT NULL DEFAULT false,
    `productId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Variant` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `size` VARCHAR(191) NULL,
    `color` VARCHAR(191) NULL,
    `stock` INTEGER NOT NULL,
    `price` VARCHAR(191) NOT NULL,
    `sku` VARCHAR(191) NULL,
    `productId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `FootwearDetail` ADD CONSTRAINT `FootwearDetail_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AccessoryDetail` ADD CONSTRAINT `AccessoryDetail_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ClothingDetail` ADD CONSTRAINT `ClothingDetail_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductImage` ADD CONSTRAINT `ProductImage_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Variant` ADD CONSTRAINT `Variant_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
