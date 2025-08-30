type RangeProps = {
  label: string;
  name: string;
  type: string;
  min: number;
  max: number;
  value: number;
  step?: number;
  required?: boolean;
  onChange: (v: number) => void;
};

export const Range: React.FC<RangeProps> = ({
  label,
  name,
  type = "range",
  min,
  max,
  value,
  step = 1,
  required = false,
  onChange,
}) => {
  const id = `range-${name}`;
  const thumb = 16;
  const p = (value - min) / (max - min);
  const offsetPx = thumb / 2 - p * thumb;

  return (
    <div className="flex flex-col w-form mb-6">
      <label htmlFor={id} className="mb-4">
        {label}
      </label>
      <div className="flex justify-between text-sm mx-1">
        <span>{min}</span>
        <span>{max}</span>
      </div>

      <div className="relative range-wrap">
        <input
          id={id}
          name={name}
          type={type}
          min={min}
          max={max}
          step={step}
          value={value}
          required={required}
          onChange={(e) => onChange(Number(e.currentTarget.value))}
          className="range"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
        />
        <div
          className="absolute"
          style={{
            left: `calc(${p * 100}% + ${offsetPx}px)`,
            transform: "translateX(-50%)",
          }}
          aria-hidden
        >
          <div className="bubble-value">{value}</div>
        </div>
      </div>
    </div>
  );
};
