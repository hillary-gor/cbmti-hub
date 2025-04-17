'use client';

import { cn } from '@/lib/utils';

export type NativeSelectOption = {
  label: string;
  value: string;
};

type NativeSelectProps = {
  items: NativeSelectOption[];
  placeholder?: string;
  value?: string;
  onChange: React.ChangeEventHandler<HTMLSelectElement>;
  className?: string;
  disabled?: boolean;
  name?: string;
};

export function NativeSelect({
  items,
  placeholder = 'Select an option',
  value,
  onChange,
  className,
  disabled = false,
  name,
}: NativeSelectProps) {
  return (
    <select
      name={name}
      value={value}
      disabled={disabled}
      onChange={onChange}
      className={cn(
        'w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
    >
      <option value="" disabled>
        {placeholder}
      </option>
      {items.map((item) => (
        <option key={item.value} value={item.value}>
          {item.label}
        </option>
      ))}
    </select>
  );
}
