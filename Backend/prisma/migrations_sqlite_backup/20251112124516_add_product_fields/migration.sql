-- AlterTable
ALTER TABLE "Product" ADD COLUMN "accessoryType" TEXT;
ALTER TABLE "Product" ADD COLUMN "careInstructions" TEXT;
ALTER TABLE "Product" ADD COLUMN "closure" TEXT;
ALTER TABLE "Product" ADD COLUMN "collarType" TEXT;
ALTER TABLE "Product" ADD COLUMN "dimensions" TEXT;
ALTER TABLE "Product" ADD COLUMN "fabric" TEXT;
ALTER TABLE "Product" ADD COLUMN "fit" TEXT;
ALTER TABLE "Product" ADD COLUMN "footwearType" TEXT;
ALTER TABLE "Product" ADD COLUMN "heelHeight" TEXT;
ALTER TABLE "Product" ADD COLUMN "material" TEXT;
ALTER TABLE "Product" ADD COLUMN "occasion" TEXT;
ALTER TABLE "Product" ADD COLUMN "packageDimensions" TEXT;
ALTER TABLE "Product" ADD COLUMN "pattern" TEXT;
ALTER TABLE "Product" ADD COLUMN "returnPolicy" TEXT;
ALTER TABLE "Product" ADD COLUMN "season" TEXT;
ALTER TABLE "Product" ADD COLUMN "shippingClass" TEXT;
ALTER TABLE "Product" ADD COLUMN "shippingWeight" TEXT;
ALTER TABLE "Product" ADD COLUMN "sleeveType" TEXT;
ALTER TABLE "Product" ADD COLUMN "soleMaterial" TEXT;
ALTER TABLE "Product" ADD COLUMN "status" TEXT;
ALTER TABLE "Product" ADD COLUMN "upperMaterial" TEXT;
ALTER TABLE "Product" ADD COLUMN "weight" TEXT;

-- CreateTable
CREATE TABLE "ProductImage" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "url" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "productId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ProductImage_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Variant" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "size" TEXT,
    "color" TEXT,
    "stock" INTEGER NOT NULL,
    "price" TEXT NOT NULL,
    "sku" TEXT,
    "productId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Variant_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
