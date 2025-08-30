import { DayCell } from "./components/DayCell";
import { WEEKDAYS, ymd } from "@/utlis/date";
import { useCalendar } from "./useCalendar";

export const DatePicker = () => {
  const {
    cursor,
    setCursor,
    selected,
    setSelected,
    cells,
    monthLabel,
    observances,
    loading,
    error,
    startOfToday,
  } = useCalendar("PL");

  const prevMonth = new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1);
  const disablePrev =
    prevMonth <
    new Date(startOfToday.getFullYear(), startOfToday.getMonth(), 1);

  return (
    <div className="w-form">
      <label className="mb-2 block">Date</label>

      <div className="rounded-lg border border-border-default bg-white p-4">
        <div className="mb-3 flex items-center justify-between">
          <button
            type="button"
            aria-label="Previous month"
            disabled={disablePrev}
            className="h-7 w-7 rounded-md text-purple-500 hover:bg-purple-50"
            onClick={() =>
              setCursor((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))
            }
          >
            ◄
          </button>

          <div className="text-center font-medium">{monthLabel}</div>

          <button
            type="button"
            aria-label="Next month"
            className="h-7 w-7 rounded-md text-purple-500 hover:bg-purple-50"
            onClick={() =>
              setCursor((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1))
            }
          >
            ►
          </button>
        </div>

        <div className="mb-2 grid grid-cols-7 text-center text-sm text-text">
          {WEEKDAYS.map((w, i) => (
            <div key={w} className={i === 6 ? "text-gray-400" : undefined}>
              {w}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-y-1">
          {cells.map((cell, idx) => {
            if (!cell.date) return <div key={`e-${idx}`} />;

            const key = ymd(cell.date);
            const isBlocked = !!cell.blocked;
            const isSelected = Boolean(selected && ymd(selected) === key);

            return (
              <DayCell
                key={key}
                date={cell.date}
                blocked={isBlocked}
                selected={isSelected}
                onSelect={setSelected}
              />
            );
          })}
        </div>
      </div>

      {observances.length > 0 && (
        <div
          className="mt-3 rounded-md border border-border-default bg-white px-3 py-2 text-sm"
          role="status"
        >
          <span className="font-medium">Observance:</span>{" "}
          {observances.join(" • ")}
        </div>
      )}

      {loading && (
        <p className="mt-2 text-sm text-gray-500">Loading calendar…</p>
      )}
      {error && (
        <p className="mt-2 text-sm text-red-600">Failed to load holidays.</p>
      )}
    </div>
  );
};
