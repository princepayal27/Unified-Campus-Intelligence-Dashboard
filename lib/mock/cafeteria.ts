// lib/mock/cafeteria.ts

export type FoodItem = {
  id: string;
  name: string;
  price: number;
  availability: boolean;
};

export type CafeteriaMenu = {
  breakfast: FoodItem[];
  lunch: FoodItem[];
  snacks: FoodItem[];
  dinner: FoodItem[];
};

export const cafeteriaMenu: CafeteriaMenu = {
  breakfast: [
    { id: "BFT001", name: "Poha", price: 30, availability: true },
    { id: "BFT002", name: "Idli Sambar", price: 45, availability: true },
    { id: "BFT003", name: "Grilled Sandwich", price: 60, availability: false },
    { id: "BFT004", name: "Masala Tea", price: 20, availability: true },
    { id: "BFT005", name: "Cold Coffee", price: 50, availability: true },
  ],
  lunch: [
    { id: "LUN001", name: "Paneer Butter Masala", price: 120, availability: true },
    { id: "LUN002", name: "Dal Rice", price: 70, availability: true },
    { id: "LUN003", name: "Tandoori Roti", price: 15, availability: true },
    { id: "LUN004", name: "Veg Biryani", price: 90, availability: true },
    { id: "LUN005", name: "Rajma Chawal", price: 80, availability: false },
    { id: "LUN006", name: "Standard Thali", price: 150, availability: true },
  ],
  snacks: [
    { id: "SNK001", name: "Samosa", price: 25, availability: true },
    { id: "SNK002", name: "Veg Maggi", price: 40, availability: true },
    { id: "SNK003", name: "French Fries", price: 70, availability: true },
    { id: "SNK004", name: "Cold Coffee", price: 55, availability: false },
    { id: "SNK005", name: "Veg Burger", price: 85, availability: true },
  ],
  dinner: [
    { id: "DIN001", name: "Chapati", price: 10, availability: true },
    { id: "DIN002", name: "Mixed Veg Curry", price: 95, availability: true },
    { id: "DIN003", name: "Dal Khichdi", price: 65, availability: true },
    { id: "DIN004", name: "Tomato Soup", price: 45, availability: false },
    { id: "DIN005", name: "White Sauce Pasta", price: 110, availability: true },
  ],
};

/**
 * Helper to get all available items for a specific meal category
 */
export const getAvailableItems = (category: keyof CafeteriaMenu): FoodItem[] => {
  return cafeteriaMenu[category].filter((item) => item.availability);
};