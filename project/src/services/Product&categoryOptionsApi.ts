const delay = <T,>(value: T, ms = 120) =>
  new Promise<T>((resolve) => setTimeout(() => resolve(value), ms));

const MOCK_PRODUCT_TYPES = ["Default", "Clothing", "Footwear", "Accessory"];
const MOCK_GENDERS = ["Unisex", "Men", "Women", "Kids"];
const MOCK_CATEGORIES = [
  { id: 1, name: "General" },
  { id: 2, name: "Apparel" },
  { id: 3, name: "Shoes" },
];
const MOCK_SUBCATEGORIES: Record<number, { id: number; name: string }[]> = {
  1: [
    { id: 11, name: "Misc" },
  ],
  2: [
    { id: 21, name: "T-Shirts" },
    { id: 22, name: "Jeans" },
  ],
  3: [
    { id: 31, name: "Sneakers" },
    { id: 32, name: "Boots" },
  ],
};

const categoryApi = {
  getProductTypes: async () => {
    return delay(MOCK_PRODUCT_TYPES.slice());
  },

  getGenders: async () => {
    return delay(MOCK_GENDERS.slice());
  },

  getCategories: async (_data: object) => {
    return delay(MOCK_CATEGORIES.map((c) => ({ ...c })));
  },

  getSubCategories: async (categoryId: Number) => {
    const id = Number(categoryId);
    return delay((MOCK_SUBCATEGORIES[id] || []).map((s) => ({ ...s })));
  },
};

export default categoryApi;
