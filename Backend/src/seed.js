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
      Username: "test seller",
      Email: "jaymin89873@gmail.com",
      Password: "Jaymin@2003",
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

  // --- Insert Clothing Only Products ---
  const products = [
    // Men's Topwear
    {
      productName: "Zara Men's Casual Shirt",
      brand: "Zara",
      productType: "Clothing",
      gender: "Male",
      category: "Topwear",
      subcategory: "Shirts",
      mrp: "2999",
      sellingPrice: "1899",
      discountPercent: "37",
      sku: "SKU-ZARA-001",
      hsnCode: "6205",
      totalStock: "50",
      shortDescription: "Stylish cotton casual shirt.",
      description: "100% Cotton, Slim Fit, Full Sleeves.",
      lowStockAlert: "5",
      metaTitle: "Zara Casual Shirt",
      metaDescription: "Men's casual shirt by Zara.",
      tags: "zara, shirt, men, casual",
      imageUrl: "https://www.jockey.in/cdn/shop/files/AM38_NAVY_0103_S125_JKY_1.webp?v=1716465659&width=560",
      status: "ACTIVE",
      shippingWeight: "0.3kg",
      packageDimensions: "30x25x2 cm",
      returnPolicy: "7 days return",
      shippingClass: "Standard",
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: 1
    },
    {
      productName: "Levi's Graphic Print T-Shirt",
      brand: "Levi's",
      productType: "Clothing",
      gender: "Male",
      category: "Topwear",
      subcategory: "T-Shirts",
      mrp: "1599",
      sellingPrice: "999",
      discountPercent: "38",
      sku: "SKU-LEVIS-002",
      hsnCode: "6109",
      totalStock: "80",
      shortDescription: "Cotton graphic tee.",
      description: "Soft cotton fabric with durable print.",
      lowStockAlert: "10",
      metaTitle: "Levi's T-Shirt",
      metaDescription: "Graphic print t-shirt by Levi's.",
      tags: "levis, tshirt, men",
      imageUrl: "https://www.jockey.in/cdn/shop/files/SP17_BLACK_0103_S223_JKY_1.webp?v=1725619829&width=560",
      status: "ACTIVE",
      shippingWeight: "0.2kg",
      packageDimensions: "25x20x1 cm",
      returnPolicy: "7 days return",
      shippingClass: "Standard",
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: 1
    },
    // Men's Bottomwear
    {
      productName: "Highlander Slim Fit Chinos",
      brand: "Highlander",
      productType: "Clothing",
      gender: "Male",
      category: "Bottomwear",
      subcategory: "Trousers",
      mrp: "1999",
      sellingPrice: "1099",
      discountPercent: "45",
      sku: "SKU-High-003",
      hsnCode: "6203",
      totalStock: "40",
      shortDescription: "Comfortable slim fit chinos.",
      description: "Stretchable cotton blend fabric.",
      lowStockAlert: "5",
      metaTitle: "Highlander Chinos",
      metaDescription: "Men's slim fit chinos.",
      tags: "highlander, chinos, trousers, men",
      imageUrl: "https://th.bing.com/th/id/OPAC.i6peyChUS4MODQ474C474?w=592&h=550&o=5&pid=21.1",
      status: "ACTIVE",
      shippingWeight: "0.5kg",
      packageDimensions: "35x25x3 cm",
      returnPolicy: "7 days return",
      shippingClass: "Standard",
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: 1
    },
    // Women's Topwear/Dresses
    {
      productName: "H&M Floral Midi Dress",
      brand: "H&M",
      productType: "Clothing",
      gender: "Female",
      category: "Dresses",
      subcategory: "Midi",
      mrp: "3499",
      sellingPrice: "2499",
      discountPercent: "29",
      sku: "SKU-HM-004",
      hsnCode: "6204",
      totalStock: "35",
      shortDescription: "Elegant floral print midi dress.",
      description: "Viscose rayon fabric, perfect for summers.",
      lowStockAlert: "5",
      metaTitle: "H&M Midi Dress",
      metaDescription: "Floral dress for women.",
      tags: "hm, dress, floral, women",
      imageUrl: "https://th.bing.com/th?id=OPAC.5GQ6wywQ%2f3SwnQ474C474&w=592&h=550&o=5&pid=21.1",
      status: "ACTIVE",
      shippingWeight: "0.4kg",
      packageDimensions: "30x25x2 cm",
      returnPolicy: "7 days return",
      shippingClass: "Standard",
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: 1
    },
    {
      productName: "Forever 21 Crop Top",
      brand: "Forever 21",
      productType: "Clothing",
      gender: "Female",
      category: "Topwear",
      subcategory: "Tops",
      mrp: "1299",
      sellingPrice: "899",
      discountPercent: "31",
      sku: "SKU-F21-005",
      hsnCode: "6106",
      totalStock: "60",
      shortDescription: "Stylish knitted crop top.",
      description: "Comfortable fit with trendy design.",
      lowStockAlert: "8",
      metaTitle: "Forever 21 Top",
      metaDescription: "Trendy crop top for women.",
      tags: "forever21, top, women",
      imageUrl: "https://th.bing.com/th/id/OIP.abc12345",
      status: "ACTIVE",
      shippingWeight: "0.2kg",
      packageDimensions: "20x15x1 cm",
      returnPolicy: "7 days return",
      shippingClass: "Standard",
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: 1
    },
    // Women's Bottomwear
    {
      productName: "Levis High Rise Skinny Jeans",
      brand: "Levi's",
      productType: "Clothing",
      gender: "Female",
      category: "Bottomwear",
      subcategory: "Jeans",
      mrp: "3999",
      sellingPrice: "2499",
      discountPercent: "38",
      sku: "SKU-LEVIS-006",
      hsnCode: "6204",
      totalStock: "45",
      shortDescription: "Classic high rise skinny jeans.",
      description: "Super stretch denim for ultimate comfort.",
      lowStockAlert: "5",
      metaTitle: "Levis Skinny Jeans",
      metaDescription: "Women's skinny jeans.",
      tags: "levis, jeans, women, denim",
      imageUrl: "https://th.bing.com/th/id/OIP.def67890",
      status: "ACTIVE",
      shippingWeight: "0.6kg",
      packageDimensions: "35x25x4 cm",
      returnPolicy: "7 days return",
      shippingClass: "Standard",
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: 1
    },
    // Ethnicwear (Women)
    {
      productName: "Biba Cotton Kurta Set",
      brand: "Biba",
      productType: "Clothing",
      gender: "Female",
      category: "Ethnicwear",
      subcategory: "Kurta Sets",
      mrp: "4599",
      sellingPrice: "3299",
      discountPercent: "28",
      sku: "SKU-BIBA-007",
      hsnCode: "6204",
      totalStock: "30",
      shortDescription: "Traditional cotton kurta set with dupatta.",
      description: "High quality cotton with intricate embroidery.",
      lowStockAlert: "4",
      metaTitle: "Biba Kurta Set",
      metaDescription: "Ethnic wear for women.",
      tags: "biba, kurta, ethnic, women",
      imageUrl: "https://th.bing.com/th/id/OIP.ghi12345",
      status: "ACTIVE",
      shippingWeight: "0.8kg",
      packageDimensions: "40x30x5 cm",
      returnPolicy: "7 days return",
      shippingClass: "Standard",
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: 1
    },
    {
      productName: "Manyavar Silk Saree",
      brand: "Manyavar",
      productType: "Clothing",
      gender: "Female",
      category: "Ethnicwear",
      subcategory: "Sarees",
      mrp: "8999",
      sellingPrice: "6500",
      discountPercent: "28",
      sku: "SKU-MANY-008",
      hsnCode: "5007",
      totalStock: "15",
      shortDescription: "Elegant silk saree for occasions.",
      description: "Pure silk with gold zari border.",
      lowStockAlert: "2",
      metaTitle: "Manyavar Saree",
      metaDescription: "Silk saree for weddings.",
      tags: "saree, ethnic, women, wedding",
      imageUrl: "https://th.bing.com/th/id/OIP.jkl56789",
      status: "ACTIVE",
      shippingWeight: "1.0kg",
      packageDimensions: "40x35x5 cm",
      returnPolicy: "No return",
      shippingClass: "Standard",
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: 1
    },
    // Men's Ethnicwear
    {
      productName: "FabIndia Linen Kurta",
      brand: "FabIndia",
      productType: "Clothing",
      gender: "Male",
      category: "Ethnicwear",
      subcategory: "Kurtas",
      mrp: "2499",
      sellingPrice: "1999",
      discountPercent: "20",
      sku: "SKU-FAB-009",
      hsnCode: "6205",
      totalStock: "40",
      shortDescription: "Breathable linen kurta.",
      description: "Comfort fit, ideal for festivals.",
      lowStockAlert: "5",
      metaTitle: "FabIndia Kurta",
      metaDescription: "Men's linen kurta.",
      tags: "fabindia, kurta, men, ethnic",
      imageUrl: "https://th.bing.com/th/id/OIP.mno12345",
      status: "ACTIVE",
      shippingWeight: "0.4kg",
      packageDimensions: "30x25x3 cm",
      returnPolicy: "7 days return",
      shippingClass: "Standard",
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: 1
    },
    // Activewear
    {
      productName: "Nike Dri-FIT Running Shorts",
      brand: "Nike",
      productType: "Clothing",
      gender: "Male",
      category: "Activewear",
      subcategory: "Shorts",
      mrp: "2195",
      sellingPrice: "1599",
      discountPercent: "27",
      sku: "SKU-NIKE-010",
      hsnCode: "6203",
      totalStock: "60",
      shortDescription: "Performance running shorts.",
      description: "Sweat-wicking fabric with mesh lining.",
      lowStockAlert: "8",
      metaTitle: "Nike Running Shorts",
      metaDescription: "Men's sports shorts.",
      tags: "nike, shorts, activewear, men",
      imageUrl: "https://th.bing.com/th/id/OIP.pqr12345",
      status: "ACTIVE",
      shippingWeight: "0.2kg",
      packageDimensions: "20x15x2 cm",
      returnPolicy: "7 days return",
      shippingClass: "Standard",
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: 1
    },
    {
      productName: "Puma Women's Sports Bra",
      brand: "Puma",
      productType: "Clothing",
      gender: "Female",
      category: "Activewear",
      subcategory: "Sports Bra",
      mrp: "1999",
      sellingPrice: "1299",
      discountPercent: "35",
      sku: "SKU-PUMA-011",
      hsnCode: "6212",
      totalStock: "50",
      shortDescription: "High impact sports bra.",
      description: "Racerback design for maximum support.",
      lowStockAlert: "6",
      metaTitle: "Puma Sports Bra",
      metaDescription: "Women's gym wear.",
      tags: "puma, sports bra, activewear, women",
      imageUrl: "https://th.bing.com/th/id/OIP.stu12345",
      status: "ACTIVE",
      shippingWeight: "0.15kg",
      packageDimensions: "15x15x2 cm",
      returnPolicy: "7 days return",
      shippingClass: "Standard",
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: 1
    },
    // Kids
    {
      productName: "Gini & Jony Boys T-Shirt",
      brand: "Gini & Jony",
      productType: "Clothing",
      gender: "Kids",
      category: "Topwear",
      subcategory: "T-Shirts",
      mrp: "999",
      sellingPrice: "599",
      discountPercent: "40",
      sku: "SKU-GJ-012",
      hsnCode: "6109",
      totalStock: "40",
      shortDescription: "Cotton graphic tee for boys.",
      description: "Soft and safe fabric for kids.",
      lowStockAlert: "5",
      metaTitle: "Gini Jony T-Shirt",
      metaDescription: "Kids t-shirt.",
      tags: "kids, boys, tshirt",
      imageUrl: "https://th.bing.com/th/id/OIP.vwx67890",
      status: "ACTIVE",
      shippingWeight: "0.15kg",
      packageDimensions: "20x15x1 cm",
      returnPolicy: "7 days return",
      shippingClass: "Standard",
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: 1
    }
  ];

  for (const p of products) {
    // Check if exists to avoid duplicates if running multiple times without clean
    const exists = await prisma.product.findFirst({ where: { sku: p.sku } });
    if (!exists) {
      await prisma.product.create({ data: p });
    }
  }

  console.log(`${products.length} clothing products inserted.`);
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
