import React, { useMemo } from "react";

type Props = {
  selectedDate: Date | null;
  value: string | null;
  onChange: (time: string | null) => void;
  slots?: string[];
};

export const TimeSlots: React.FC<Props> = ({
  selectedDate,
  value,
  onChange,
  slots = ["12:00", "14:00", "16:30", "18:30", "20:00"],
}) => {
  const now = new Date();

  const startOfToday = useMemo(
    () => new Date(now.getFullYear(), now.getMonth(), now.getDate()),
    [now]
  );

  const isToday =
    selectedDate &&
    selectedDate.getFullYear() === now.getFullYear() &&
    selectedDate.getMonth() === now.getMonth() &&
    selectedDate.getDate() === now.getDate();

  const isPastTime = (t: string) => {
    if (!selectedDate) return true;
    if (!isToday) return false;

    const [hh, mm] = t.split(":").map(Number);
    const dt = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
      hh,
      mm,
      0,
      0
    );
    return dt < now;
  };

  const allDisabled = !selectedDate || selectedDate < startOfToday;

  return (
    <div className="absolute top-5 right-0 ml-4">
      <div className="flex flex-col gap-2">
        {slots.map((t) => {
          const disabled = allDisabled || isPastTime(t);
          const selected = value === t;

          return (
            <button
              key={t}
              type="button"
              disabled={disabled}
              onClick={() => onChange(disabled ? null : t)}
              className={[
                "h-11 w-19 rounded-md border border border-border-default bg-bg-light text-s text-400",
                disabled
                  ? "cursor-not-allowed opacity-50 text-gray"
                  : "hover:bg-border-default cursor-pointer",
                selected ? "border-border-focus border-thick" : "",
              ].join(" ")}
            >
              {t}
            </button>
          );
        })}
      </div>
    </div>
  );
};
