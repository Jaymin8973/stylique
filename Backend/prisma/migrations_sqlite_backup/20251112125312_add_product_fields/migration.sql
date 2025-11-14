/*
  Warnings:

  - You are about to drop the column `accessoryType` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `careInstructions` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `closure` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `collarType` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `dimensions` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `fabric` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `fit` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `footwearType` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `heelHeight` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `material` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `occasion` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `pattern` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `season` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `sleeveType` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `soleMaterial` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `upperMaterial` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `weight` on the `Product` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "FootwearDetail" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "footwearType" TEXT,
    "heelHeight" TEXT,
    "soleMaterial" TEXT,
    "upperMaterial" TEXT,
    "closure" TEXT,
    "productId" INTEGER NOT NULL,
    CONSTRAINT "FootwearDetail_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AccessoryDetail" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "accessoryType" TEXT,
    "dimensions" TEXT,
    "weight" TEXT,
    "productId" INTEGER NOT NULL,
    CONSTRAINT "AccessoryDetail_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ClothingDetail" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "material" TEXT,
    "fabric" TEXT,
    "pattern" TEXT,
    "collarType" TEXT,
    "sleeveType" TEXT,
    "fit" TEXT,
    "occasion" TEXT,
    "season" TEXT,
    "careInstructions" TEXT,
    "productId" INTEGER NOT NULL,
    CONSTRAINT "ClothingDetail_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Product" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "productName" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "productType" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "subcategory" TEXT NOT NULL,
    "mrp" TEXT NOT NULL,
    "sellingPrice" TEXT NOT NULL,
    "discountPercent" TEXT,
    "sku" TEXT NOT NULL,
    "hsnCode" TEXT,
    "totalStock" TEXT NOT NULL,
    "shortDescription" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "lowStockAlert" TEXT,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "tags" TEXT,
    "imageUrl" TEXT,
    "status" TEXT,
    "shippingWeight" TEXT,
    "packageDimensions" TEXT,
    "returnPolicy" TEXT,
    "shippingClass" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Product" ("brand", "category", "createdAt", "description", "discountPercent", "gender", "hsnCode", "id", "imageUrl", "lowStockAlert", "metaDescription", "metaTitle", "mrp", "packageDimensions", "productName", "productType", "returnPolicy", "sellingPrice", "shippingClass", "shippingWeight", "shortDescription", "sku", "status", "subcategory", "tags", "totalStock", "updatedAt") SELECT "brand", "category", "createdAt", "description", "discountPercent", "gender", "hsnCode", "id", "imageUrl", "lowStockAlert", "metaDescription", "metaTitle", "mrp", "packageDimensions", "productName", "productType", "returnPolicy", "sellingPrice", "shippingClass", "shippingWeight", "shortDescription", "sku", "status", "subcategory", "tags", "totalStock", "updatedAt" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "FootwearDetail_productId_key" ON "FootwearDetail"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "AccessoryDetail_productId_key" ON "AccessoryDetail"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "ClothingDetail_productId_key" ON "ClothingDetail"("productId");
