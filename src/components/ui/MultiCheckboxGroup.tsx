import React from 'react';
import { AlertCircle, Check } from 'lucide-react';

export interface CheckboxOption {
  value: string;
  label: string;
  description?: string;
}

export interface MultiCheckboxGroupProps {
  id: string;
  label: string;
  options: CheckboxOption[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  error?: string;
  hint?: string;
  required?: boolean;
}

export const MultiCheckboxGroup: React.FC<MultiCheckboxGroupProps> = ({
  id,
  label,
  options,
  selectedValues = [],
  onChange,
  error,
  hint,
  required,
}) => {
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;

  const handleToggle = (val: string) => {
    if (selectedValues.includes(val)) {
      onChange(selectedValues.filter((v) => v !== val));
    } else {
      onChange([...selectedValues, val]);
    }
  };

  return (
    <fieldset
      className="w-full flex flex-col gap-2"
      aria-invalid={Boolean(error)}
      aria-describedby={error ? errorId : hint ? hintId : undefined}
    >
      <legend className="text-xs font-semibold text-[#223B28] flex items-center justify-between w-full">
        <span>
          {label}
          {required && <span className="text-[#DC2626] ml-1">*</span>}
        </span>
      </legend>

      {hint && (
        <p id={hintId} className="text-[11px] text-[#637365] -mt-0.5">
          {hint}
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
        {options.map((opt) => {
          const isChecked = selectedValues.includes(opt.value);
          const inputId = `${id}-opt-${opt.value}`;

          return (
            <label
              key={opt.value}
              htmlFor={inputId}
              className={`flex items-start gap-2.5 p-3 rounded-xl border text-xs cursor-pointer select-none transition-all duration-150 ${
                isChecked
                  ? 'border-[#2E4D34] bg-[#EAF1EA]/60 shadow-xs ring-1 ring-[#2E4D34]/20'
                  : 'border-[#EAE5DB] bg-white hover:border-[#C4D3C2] hover:bg-[#FAF7F2]'
              }`}
            >
              <div className="relative flex items-center mt-0.5">
                <input
                  type="checkbox"
                  id={inputId}
                  checked={isChecked}
                  onChange={() => handleToggle(opt.value)}
                  className="sr-only"
                />
                <div
                  className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                    isChecked
                      ? 'bg-[#2E4D34] border-[#2E4D34] text-white'
                      : 'border-[#C4D3C2] bg-white'
                  }`}
                >
                  {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </div>

              <div className="flex flex-col">
                <span className={`font-medium ${isChecked ? 'text-[#2E4D34]' : 'text-[#223B28]'}`}>
                  {opt.label}
                </span>
                {opt.description && (
                  <span className="text-[10px] text-[#637365] mt-0.5">{opt.description}</span>
                )}
              </div>
            </label>
          );
        })}
      </div>

      {error && (
        <div
          id={errorId}
          role="alert"
          className="flex items-center gap-1.5 text-[11px] text-[#DC2626] font-medium animate-in fade-in duration-150 pt-0.5"
        >
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </fieldset>
  );
};
export default MultiCheckboxGroup;
