type Props = {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
};

export const TextField: React.FC<Props> = ({
  label,
  name,
  type,
  placeholder,
  autoComplete,
  required = true,
}) => {
  const id = `field-${name}`;

  return (
    <div className="inline-flex flex-col w-form text-left mb-6">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        className="input"
      />
    </div>
  );
};
