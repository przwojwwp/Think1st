import React, { useRef, useState } from "react";

type FileDropProps = {
  label: string;
  name: string;
  accept?: string;
  multiple?: boolean;
  required?: boolean;
};

export const FileDrop: React.FC<FileDropProps> = ({
  label,
  name,
  accept,
  multiple = false,
  required = false,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const id = `field-${name}`;

  return (
    <div className="flex flex-col w-form mb-12">
      <label htmlFor={name}>{label}</label>

      <div
        className="dropzone"
        data-drag={dragActive || false}
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
            console.log(inputRef.current);
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
          console.log(inputRef.current);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setDragActive(false);
          console.log(inputRef.current);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          console.log(inputRef.current);
        }}
      >
        <p className="text-center text-base">
          <span className="underline text-border-focus">Upload a file</span>
          <span className="mx-2 text-gray-400">or drag and drop here</span>
        </p>
      </div>

      <input
        ref={inputRef}
        id={id}
        name={name}
        className="sr-only"
        type="file"
        accept={accept}
        multiple={multiple}
        required={required}
        onChange={() => {}}
      />
    </div>
  );
};
