import React, { useRef, useState } from "react";
import CloseBtn from "@/assets/icon/close-icon.svg?react";

type FileDropProps = {
  label: string;
  name: string;
  accept?: string;
  required?: boolean;
};

export const FileDrop: React.FC<FileDropProps> = ({
  label,
  name,
  accept,
  required = false,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const id = `field-${name}`;

  const applyFileToInput = (picked: File | null) => {
    if (!inputRef.current) return;
    const dt = new DataTransfer();
    if (picked) dt.items.add(picked);
    inputRef.current.files = dt.files;
    inputRef.current.dispatchEvent(new Event("change", { bubbles: true }));
  };

  const handleFiles = (list: FileList | File[]) => {
    const first = Array.from(list)[0] ?? null;
    setFile(first);
    applyFileToInput(first);
  };

  const clear = () => {
    setFile(null);
    if (inputRef.current) {
      inputRef.current.value = "";
      const dt = new DataTransfer();
      inputRef.current.files = dt.files;
      inputRef.current.dispatchEvent(new Event("change", { bubbles: true }));
    }
  };

  return (
    <div className="flex flex-col w-form mb-12">
      <label htmlFor={id}>{label}</label>

      <div
        className={`dropzone relative ${!file ? "cursor-pointer" : ""}`}
        data-drag={dragActive || undefined}
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
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
        onChange={(e) => {
          const list = e.currentTarget.files;
          if (list && list.length > 0) handleFiles(list);
          else clear();
        }}
      />
    </div>
  );
};
