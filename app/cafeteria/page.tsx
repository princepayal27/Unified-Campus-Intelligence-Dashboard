import { ModuleCard } from "@/components/ModuleCard";
import { cafeteriaMenu } from "@/lib/mock/cafeteria";

export default function CafeteriaPage() {
  const mealSections = [
    { id: "breakfast", title: "Breakfast", items: cafeteriaMenu.breakfast },
    { id: "lunch", title: "Lunch", items: cafeteriaMenu.lunch },
    { id: "snacks", title: "Snacks", items: cafeteriaMenu.snacks },
    { id: "dinner", title: "Dinner", items: cafeteriaMenu.dinner },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-white">Cafeteria Insights</h1>
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

      {/* Meal Categories */}
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
                No items available for {section.title.toLowerCase()} at the moment.
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}