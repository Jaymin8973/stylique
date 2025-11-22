-- CreateTable
CREATE TABLE `ordertracking` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `orderId` INTEGER NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `eventAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `idx_ordertracking_orderId`(`orderId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `accessorydetail` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `accessoryType` VARCHAR(191) NULL,
    `dimensions` VARCHAR(191) NULL,
    `weight` VARCHAR(191) NULL,
    `productId` INTEGER NOT NULL,

    UNIQUE INDEX `AccessoryDetail_productId_key`(`productId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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
CREATE TABLE `clothingdetail` (
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
CREATE TABLE `footweardetail` (
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
CREATE TABLE `product` (
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
    `userId` INTEGER NULL,

    INDEX `idx_product_userId`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `productimage` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `url` VARCHAR(191) NOT NULL,
    `isPrimary` BOOLEAN NOT NULL DEFAULT false,
    `productId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `ProductImage_productId_fkey`(`productId`),
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
    `PushToken` VARCHAR(255) NULL,
    `CreatedAt` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `UpdatedAt` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `Username`(`Username`),
    UNIQUE INDEX `Email`(`Email`),
    INDEX `FK_Users_Roles`(`RoleID`),
    PRIMARY KEY (`UserID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `variant` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `size` VARCHAR(191) NULL,
    `color` VARCHAR(191) NULL,
    `stock` INTEGER NOT NULL,
    `price` VARCHAR(191) NOT NULL,
    `sku` VARCHAR(191) NULL,
    `productId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Variant_productId_fkey`(`productId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cart` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `cart_userId_key`(`userId`),
    INDEX `idx_cart_userId`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cartitem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cartId` INTEGER NOT NULL,
    `productId` INTEGER NOT NULL,
    `variantId` INTEGER NULL,
    `quantity` INTEGER NOT NULL DEFAULT 1,
    `unitPrice` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `idx_cartitem_cartId`(`cartId`),
    INDEX `idx_cartitem_productId`(`productId`),
    INDEX `idx_cartitem_variantId`(`variantId`),
    UNIQUE INDEX `uniq_cart_product_variant`(`cartId`, `productId`, `variantId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `wishlist` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `productId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `idx_wishlist_userId`(`userId`),
    INDEX `idx_wishlist_productId`(`productId`),
    UNIQUE INDEX `uniq_user_product`(`userId`, `productId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `collection` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `imageUrl` VARCHAR(191) NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'draft',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `userId` INTEGER NOT NULL,

    INDEX `idx_collection_userId`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `collectionitem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `collectionId` INTEGER NOT NULL,
    `productId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `idx_collectionitem_collectionId`(`collectionId`),
    INDEX `idx_collectionitem_productId`(`productId`),
    UNIQUE INDEX `uniq_collection_product`(`collectionId`, `productId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sale` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `bannerUrl` VARCHAR(191) NULL,
    `discountType` VARCHAR(191) NOT NULL,
    `discountValue` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'draft',
    `startAt` DATETIME(3) NULL,
    `endAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `userId` INTEGER NOT NULL,

    INDEX `idx_sale_userId`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `saleproduct` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `saleId` INTEGER NOT NULL,
    `productId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `idx_saleproduct_saleId`(`saleId`),
    INDEX `idx_saleproduct_productId`(`productId`),
    UNIQUE INDEX `uniq_sale_product`(`saleId`, `productId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `address` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NULL,
    `mobileNumber` VARCHAR(191) NOT NULL,
    `pincode` VARCHAR(191) NOT NULL,
    `houseNo` VARCHAR(191) NOT NULL,
    `street` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `state` VARCHAR(191) NOT NULL,
    `isDefault` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `idx_address_userId`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `orders` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `orderNumber` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `trackingNumber` VARCHAR(191) NULL,
    `subtotal` VARCHAR(191) NOT NULL,
    `shipping` VARCHAR(191) NOT NULL,
    `total` VARCHAR(191) NOT NULL,
    `addressText` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `orders_orderNumber_key`(`orderNumber`),
    INDEX `idx_orders_userId`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `orderitem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `orderId` INTEGER NOT NULL,
    `productId` INTEGER NOT NULL,
    `productName` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `unitPrice` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `idx_orderitem_orderId`(`orderId`),
    INDEX `idx_orderitem_productId`(`productId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `review` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `productId` INTEGER NOT NULL,
    `rating` INTEGER NOT NULL,
    `comment` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `idx_review_productId`(`productId`),
    UNIQUE INDEX `uniq_review_user_product`(`userId`, `productId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ordertracking` ADD CONSTRAINT `fk_ordertracking_order` FOREIGN KEY (`orderId`) REFERENCES `orders`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `accessorydetail` ADD CONSTRAINT `AccessoryDetail_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `brand` ADD CONSTRAINT `brand_ibfk_1` FOREIGN KEY (`seller_id`) REFERENCES `seller`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `brand_category` ADD CONSTRAINT `fk_brand_category` FOREIGN KEY (`brand_id`) REFERENCES `brands`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `brands` ADD CONSTRAINT `fk_brand_seller` FOREIGN KEY (`seller_id`) REFERENCES `sellers`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `clothingdetail` ADD CONSTRAINT `ClothingDetail_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `footweardetail` ADD CONSTRAINT `FootwearDetail_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product` ADD CONSTRAINT `fk_product_user` FOREIGN KEY (`userId`) REFERENCES `users`(`UserID`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `productimage` ADD CONSTRAINT `ProductImage_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sellers` ADD CONSTRAINT `fk_seller_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`UserID`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `FK_Users_Roles` FOREIGN KEY (`RoleID`) REFERENCES `roles`(`RoleID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `variant` ADD CONSTRAINT `Variant_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cart` ADD CONSTRAINT `fk_cart_user` FOREIGN KEY (`userId`) REFERENCES `users`(`UserID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cartitem` ADD CONSTRAINT `fk_cartitem_cart` FOREIGN KEY (`cartId`) REFERENCES `cart`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cartitem` ADD CONSTRAINT `fk_cartitem_product` FOREIGN KEY (`productId`) REFERENCES `product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cartitem` ADD CONSTRAINT `fk_cartitem_variant` FOREIGN KEY (`variantId`) REFERENCES `variant`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `wishlist` ADD CONSTRAINT `fk_wishlist_user` FOREIGN KEY (`userId`) REFERENCES `users`(`UserID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `wishlist` ADD CONSTRAINT `fk_wishlist_product` FOREIGN KEY (`productId`) REFERENCES `product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `collection` ADD CONSTRAINT `fk_collection_user` FOREIGN KEY (`userId`) REFERENCES `users`(`UserID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `collectionitem` ADD CONSTRAINT `fk_collectionitem_collection` FOREIGN KEY (`collectionId`) REFERENCES `collection`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `collectionitem` ADD CONSTRAINT `fk_collectionitem_product` FOREIGN KEY (`productId`) REFERENCES `product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sale` ADD CONSTRAINT `fk_sale_user` FOREIGN KEY (`userId`) REFERENCES `users`(`UserID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `saleproduct` ADD CONSTRAINT `fk_saleproduct_sale` FOREIGN KEY (`saleId`) REFERENCES `sale`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `saleproduct` ADD CONSTRAINT `fk_saleproduct_product` FOREIGN KEY (`productId`) REFERENCES `product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `address` ADD CONSTRAINT `fk_address_user` FOREIGN KEY (`userId`) REFERENCES `users`(`UserID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `fk_orders_user` FOREIGN KEY (`userId`) REFERENCES `users`(`UserID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orderitem` ADD CONSTRAINT `fk_orderitem_order` FOREIGN KEY (`orderId`) REFERENCES `orders`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orderitem` ADD CONSTRAINT `fk_orderitem_product` FOREIGN KEY (`productId`) REFERENCES `product`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `review` ADD CONSTRAINT `fk_review_user` FOREIGN KEY (`userId`) REFERENCES `users`(`UserID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `review` ADD CONSTRAINT `fk_review_product` FOREIGN KEY (`productId`) REFERENCES `product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
