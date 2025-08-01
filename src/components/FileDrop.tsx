import React, { useRef, useState } from "react";
import CloseBtn from "@/assets/icon/close-icon.svg?react";
import ExclamationMarkIcon from "@assets/icon/exclamation-mark-icon.svg?react";

type FileDropProps = {
  label: string;
  name: string;
  accept?: string;
  required?: boolean;
  invalidText?: string;
  onFileChange?: (file: File | null) => void;
};

export const FileDrop: React.FC<FileDropProps> = ({
  onFileChange,
  label,
  name,
  accept,
  required = true,
  invalidText = "Please upload a file.",
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const id = `field-${name}`;
  const errId = `${id}-error`;

  const applyFileToInput = (picked: File | null) => {
    if (!inputRef.current) return;
    const dt = new DataTransfer();
    if (picked) dt.items.add(picked);
    inputRef.current.files = dt.files;
    inputRef.current.setCustomValidity(picked || !required ? "" : invalidText);
    inputRef.current.dispatchEvent(new Event("change", { bubbles: true }));
  };

  const handleFiles = (list: FileList | File[]) => {
    setTouched(true);
    const first = Array.from(list)[0] ?? null;
    setFile(first);
    applyFileToInput(first);
    setError(first || !required ? null : invalidText);
    onFileChange?.(first);
  };

  const clear = () => {
    setTouched(true);
    setFile(null);
    if (inputRef.current) {
      inputRef.current.value = "";
      const dt = new DataTransfer();
      inputRef.current.files = dt.files;
      inputRef.current.setCustomValidity(required ? invalidText : "");
      inputRef.current.dispatchEvent(new Event("change", { bubbles: true }));
      onFileChange?.(null);
    }
    setError(required ? invalidText : null);
  };

  const showError = required && !file && touched && !!error;

  return (
    <div className="flex flex-col w-form mb-12">
      <label htmlFor={id}>{label}</label>

      <div
        className={[
          "dropzone relative",
          !file ? "cursor-pointer" : "",
          showError ? "ring-2 ring-red-500" : "",
        ].join(" ")}
        data-drag={dragActive || undefined}
        role="button"
        tabIndex={0}
        aria-invalid={showError || undefined}
        aria-describedby={showError ? errId : undefined}
        onClick={() => {
          setTouched(true);
          inputRef.current?.click();
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setTouched(true);
            inputRef.current?.click();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setDragActive(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          if (e.dataTransfer?.files?.length) handleFiles(e.dataTransfer.files);
        }}
      >
        {!file ? (
          <p className="text-center text-base">
            <span className="underline text-border-focus">Upload a file</span>
            <span className="mx-2 text-gray-400">or drag and drop here</span>
          </p>
        ) : (
          <div className="flex items-center justify-center h-full w-full px-4">
            <div
              className="max-w-full text-base leading-3"
              aria-live="polite"
              title={file.name}
            >
              {file.name}
            </div>
            <button
              type="button"
              aria-label="Clear file"
              className="flex items-center justify-center w-6 h-6 ml-1.25 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                clear();
              }}
            >
              <CloseBtn className="text-text hover:text-[#ED4545]" />
            </button>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        id={id}
        name={name}
        className="sr-only"
        type="file"
        accept={accept}
        required={required}
        onInvalid={(e) => {
          e.preventDefault();
          setTouched(true);
          setError(invalidText);
        }}
        onChange={(e) => {
          const list = e.currentTarget.files;
          if (list && list.length > 0) handleFiles(list);
          else clear();
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
