import { useHolidays } from "@/hooks/useHolidays";

export const DatePicker = () => {
  const { data: holidaysByDate, loading, error } = useHolidays("PL");

  if (holidaysByDate) console.log("[Holidays PL → by date]", holidaysByDate);

  return (
    <div>
      {loading && <p className="text-sm text-gray-500">Loading calendar</p>}
      {error && <p className="text-sm text-red-600">Failed to load calendar</p>}
      {!loading && !error && <p className="text-sm">DatePicker</p>}
    </div>
  );
};
