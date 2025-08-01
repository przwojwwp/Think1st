import React from "react";
import { ymd } from "@/utlis/date";

type Props = {
  date: Date;
  blocked: boolean;
  selected: boolean;
  onSelect: (d: Date) => void;
};

export const DayCell = React.memo(
  function DayCell({ date, blocked, selected, onSelect }: Props) {
    const key = ymd(date);

    const base =
      "mx-auto flex h-8 w-8 items-center justify-center rounded-full hover:bg-border-default focus:outline-none focus:bg-border-focus focus:text-white cursor-pointer";
    const state = blocked ? "text-[#898DA9]" : "text-text ";

    return (
      <button
        key={key}
        type="button"
        onClick={() => {
          onSelect(date);
        }}
        className={[base, state].join(" ")}
        aria-disabled={blocked}
        aria-pressed={selected}
        aria-label={date.toDateString()}
      >
        {date.getDate()}
      </button>
    );
  },
  (prev, next) =>
    prev.blocked === next.blocked &&
    prev.selected === next.selected &&
    prev.date.getTime() === next.date.getTime()
);
