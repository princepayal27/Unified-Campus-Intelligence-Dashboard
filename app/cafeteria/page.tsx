"use client";

import { useState, useEffect } from "react";
import { ModuleCard } from "@/components/ModuleCard";

type MealItem = {
  id: string;
  name: string;
  price: number;
  availability: boolean;
};

type CafeteriaMenu = {
  breakfast: MealItem[];
  lunch: MealItem[];
  snacks: MealItem[];
  dinner: MealItem[];
};

export default function CafeteriaPage() {
  const [menu, setMenu] = useState<CafeteriaMenu>({
    breakfast: [],
    lunch: [],
    snacks: [],
    dinner: [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchMenu = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch("http://127.0.0.1:8003/cafeteria/menu");

      if (!res.ok) {
        throw new Error("Failed to fetch cafeteria menu");
      }

      const data = await res.json();

      // Supports { menu: {...} } or direct object
      setMenu({
  breakfast: (data.breakfast || []).map((item: string, index: number) => ({
    id: `breakfast-${index}`,
    name: item,
    price: 50,
    availability: true,
  })),
  lunch: (data.lunch || []).map((item: string, index: number) => ({
    id: `lunch-${index}`,
    name: item,
    price: 100,
    availability: true,
  })),
  snacks: (data.snacks || []).map((item: string, index: number) => ({
    id: `snacks-${index}`,
    name: item,
    price: 40,
    availability: true,
  })),
  dinner: (data.dinner || []).map((item: string, index: number) => ({
    id: `dinner-${index}`,
    name: item,
    price: 80,
    availability: true,
  })),
});
    } catch (err) {
      console.error(err);
      setError("Unable to connect to Cafeteria MCP server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const mealSections = [
    { id: "breakfast", title: "Breakfast", items: menu.breakfast },
    { id: "lunch", title: "Lunch", items: menu.lunch },
    { id: "snacks", title: "Snacks", items: menu.snacks },
    { id: "dinner", title: "Dinner", items: menu.dinner },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-white">
            Cafeteria Insights
          </h1>
          <p className="text-gray-400">
            Explore today's meals, prices, and live availability
          </p>
        </div>

        <div className="flex items-center self-start md:self-center">
          <span className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#c9a86a]/10 text-[#c9a86a] border border-[#c9a86a]/20">
            Today's Specials
          </span>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center text-gray-400 py-10">
          Loading menu...
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="text-center text-red-400 py-10">
          {error}
        </div>
      )}

      {/* Meal Categories */}
      {!loading && !error && (
        <div className="space-y-10">
          {mealSections.map((section) => (
            <div key={section.id} className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold text-white capitalize">
                  {section.title}
                </h2>
                <div className="w-12 h-0.5 bg-[#c9a86a] mt-2 rounded-full" />
              </div>

              {section.items.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {section.items.map((item) => (
                    <ModuleCard
                      key={item.id}
                      title={item.name}
                      subtitle={section.title}
                      status={item.availability ? "Available" : "Unavailable"}
                      extraInfo={`₹${item.price}`}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic py-4">
                  No items available for {section.title.toLowerCase()} at the
                  moment.
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}