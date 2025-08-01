import React, { useRef, useState } from "react";
import ExclamationMarkIcon from "@assets/icon/exclamation-mark-icon.svg?react";
import type { LeavedKey } from "@/types/leavedKey";

type Props = {
  label: string;
  name: "firstName" | "lastName" | "email";
  type: string;

  leave: LeavedKey;
  setLeave: (v: LeavedKey | ((prev: LeavedKey) => LeavedKey)) => void;

  autoComplete?: string;
  required?: boolean;
  invalidText?: string;
  pattern?: string;
  minLength?: number;
  maxLength?: number;
  onChangeValue?: (v: string) => void;
};

export const TextField: React.FC<Props> = ({
  label,
  name,
  type = "text",
  leave,
  setLeave,
  autoComplete,
  required = true,
  invalidText,
  pattern,
  minLength,
  maxLength,
  onChangeValue,
}) => {
  const id = `field-${name}`;
  const ref = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);

  const computeError = (el: HTMLInputElement): string | null => {
    const v = el.validity;
    if (v.valid) return null;
    if (v.valueMissing) return invalidText ?? "This field is required.";
    if (v.patternMismatch) return invalidText ?? "Invalid format.";
    if (v.typeMismatch)
      return (
        invalidText ??
        "Please use correct formatting.\nExample: address@email.com"
      );
    if (v.tooShort)
      return invalidText ?? `Must be at least ${el.minLength} characters.`;
    if (v.tooLong)
      return invalidText ?? `Must be at most ${el.maxLength} characters.`;
    return invalidText ?? "Please fix this field.";
  };

  const removeFromLeave = () =>
    setLeave((prev) =>
      prev ? prev.filter((k) => k !== name && k !== "all") : prev
    );

  const addToLeaveIfError = (hasError: boolean) =>
    setLeave((prev) => {
      if (!hasError) {
        return prev ? prev.filter((k) => k !== name && k !== "all") : prev;
      }
      const base = (prev ?? []).filter((k) => k !== "all");
      return base.includes(name) ? base : [...base, name];
    });

  const showError =
    touched && !!error && (leave?.includes(name) || leave?.includes("all"));

  return (
    <div className="inline-flex flex-col w-form text-left mb-6">
      <label htmlFor={id}>{label}</label>

      <input
        ref={ref}
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        required={required}
        pattern={pattern}
        minLength={minLength}
        maxLength={maxLength}
        className={[
          "input",
          showError ? "border-red-500 border-thick bg-red-50" : "",
        ].join(" ")}
        onInvalid={(e) => {
          e.preventDefault();
          const el = e.currentTarget;
          setTouched(true);
          const err = computeError(el);
          setError(err);
          addToLeaveIfError(!!err);
        }}
        onInput={(e) => {
          const el = e.currentTarget;
          setTouched(true);
          const err = computeError(el);
          setError(err);
          removeFromLeave();
          onChangeValue?.(el.value);
        }}
        onFocus={() => {
          removeFromLeave();
        }}
        onBlur={(e) => {
          const el = e.currentTarget;
          setTouched(true);
          const err = computeError(el);
          setError(err);
          addToLeaveIfError(!!err);
        }}
      />

      {showError && (
        <div className="h-7 mt-2 text-sm">
          <div className="flex items-start h-7 gap-2">
            <span aria-hidden>
              <ExclamationMarkIcon />
            </span>
            <div className="whitespace-pre-line h-6.75 leading-3.25">
              {error}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
