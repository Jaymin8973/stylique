import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // --- Insert Roles ---
  const roles = [
    { RoleName: "user" },
    { RoleName: "seller" },

  ];

  for (let r of roles) {
    await prisma.roles.upsert({
      where: { RoleName: r.RoleName },
      update: {},
      create: r,
    });
  }

  console.log("Roles inserted.");

  // --- Insert Users ---
  const users = [
    {
      Username: "jaymin thakkar",
      Email: "jaymin8973@gmail.com",
      Password: "Jaymin@2003",
      RoleName: "user",
    },
    {
      Username: "test user",
      Email: "test@gmail.com",
      Password: "123456",
      RoleName: "seller",
    },
  ];

  for (let u of users) {
    const hash = await bcrypt.hash(u.Password, 10);

    const role = await prisma.roles.findUnique({
      where: { RoleName: u.RoleName },
    });

    if (!role) {
      console.log(`Role not found: ${u.RoleName}`);
      continue;
    }

    await prisma.users.upsert({
      where: { Email: u.Email },
      update: {},
      create: {
        Username: u.Username,
        Email: u.Email,
        PasswordHash: hash,
        RoleID: role.RoleID,
      },
    });
  }

  console.log("Users inserted.");

  const product = await prisma.product.create({
    data: {
      productName: "Test Product",
      brand: "Nike",
      productType: "Shoes",
      gender: "Male",
      category: "Footwear",
      subcategory: "Sports Shoes",
      mrp: "5000",
      sellingPrice: "3500",
      discountPercent: "30",
      sku: "SKU-TEST-001",
      hsnCode: "6404",
      totalStock: "50",
      shortDescription: "Premium running shoes",
      description: "High-quality sports shoes with maximum comfort.",
      lowStockAlert: "5",
      metaTitle: "Nike Running Shoes",
      metaDescription: "Best men running shoes from Nike",
      tags: "sports, running, nike",
      imageUrl: "https://cdn.realry.com/tjYRZ3GWrsCTCZ7fkWccgwGsGDk=/500x0/products/o/1d28ffe12ce1e6994ead661e36e8bdf7eb43a456.jpeg",
      status: "ACTIVE",
      shippingWeight: "0.8kg",
      packageDimensions: "30x20x12 cm",
      returnPolicy: "7 days return",
      shippingClass: "Standard",
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: 1 // admin user ka ID
    }
  });

  console.log("Product inserted:", product);

}

main()
  .then(() => {
    console.log("Seeding complete.");
    prisma.$disconnect();
  })
  .catch((err) => {
    console.error("Error seeding:", err);
    prisma.$disconnect();
  });
