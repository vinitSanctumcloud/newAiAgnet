import React, { useState, forwardRef } from 'react';
import { ChevronDown, Check, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { Input } from './input';


// Define interface for select options
interface SelectOption {
  value: string | number;
  label: string;
  description?: string;
  disabled?: boolean;
}

// Define props interface for the Select component
interface SelectProps extends Omit<React.HTMLAttributes<HTMLButtonElement>, 'onChange' | 'value' | 'defaultValue'> {
  className?: string;
  options?: SelectOption[];
  value?: string | number | string[] | number[];
  defaultValue?: string | number | string[] | number[];
  placeholder?: string;
  multiple?: boolean;
  disabled?: boolean;
  required?: boolean;
  label?: string;
  description?: string;
  error?: string;
  searchable?: boolean;
  clearable?: boolean;
  loading?: boolean;
  id?: string;
  name?: string;
  onChange?: (value: string | number | string[] | number[]) => void;
  onOpenChange?: (open: boolean) => void;
}

// Define the Select component with forwardRef and TypeScript
const Select = forwardRef<HTMLButtonElement, SelectProps>(
  (
    {
      className,
      options = [],
      value,
      defaultValue,
      placeholder = 'Select an option',
      multiple = false,
      disabled = false,
      required = false,
      label,
      description,
      error,
      searchable = false,
      clearable = false,
      loading = false,
      id,
      name,
      onChange,
      onOpenChange,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>('');

    // Generate unique ID if not provided
    const selectId = id || `select-${Math.random().toString(36).substring(2, 11)}`;

    // Filter options based on search
    const filteredOptions = searchable && searchTerm
      ? options.filter(
          (option) =>
            option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (option.value &&
              option.value.toString().toLowerCase().includes(searchTerm.toLowerCase()))
        )
      : options;

    // Get selected option(s) for display
    const getSelectedDisplay = (): string => {
      if (!value) return placeholder;

      if (multiple) {
        const selectedOptions = options.filter((opt) =>
          (value as (string | number)[])?.includes(opt.value)
        );
        if (selectedOptions.length === 0) return placeholder;
        if (selectedOptions.length === 1) return selectedOptions[0].label;
        return `${selectedOptions.length} items selected`;
      }

      const selectedOption = options.find((opt) => opt.value === value);
      return selectedOption ? selectedOption.label : placeholder;
    };

    const handleToggle = () => {
      if (!disabled) {
        const newIsOpen = !isOpen;
        setIsOpen(newIsOpen);
        onOpenChange?.(newIsOpen);
        if (!newIsOpen) {
          setSearchTerm('');
        }
      }
    };

    const handleOptionSelect = (option: SelectOption) => {
      if (multiple) {
        const newValue = (value as (string | number)[]) || [];
        const updatedValue = newValue.includes(option.value)
          ? newValue.filter((v) => v !== option.value)
          : [...newValue, option.value];

        // Determine if all values are strings or numbers
        const allStrings = updatedValue.every((v) => typeof v === 'string');
        const allNumbers = updatedValue.every((v) => typeof v === 'number');

        if (allStrings) {
          onChange?.(updatedValue as string[]);
        } else if (allNumbers) {
          onChange?.(updatedValue as number[]);
        } else {
          // fallback: send as string[]
          onChange?.(updatedValue.map(String) as string[]);
        }
      } else {
        onChange?.(option.value);
        setIsOpen(false);
        onOpenChange?.(false);
      }
    };

    const handleClear = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      onChange?.(multiple ? [] : '');
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
    };

    const isSelected = (optionValue: string | number): boolean => {
      if (multiple) {
        return (value as (string | number)[])?.includes(optionValue) || false;
      }
      return value === optionValue;
    };

    const hasValue = multiple
      ? (value as (string | number)[])?.length > 0
      : value !== undefined && value !== '';

    return (
      <div className={cn('relative', className)}>
        {label && (
          <label
            htmlFor={selectId}
            className={cn(
              'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2 block',
              error ? 'text-destructive' : 'text-foreground'
            )}
          >
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          <button
            ref={ref}
            id={selectId}
            type="button"
            className={cn(
              'flex h-10 w-full items-center justify-between rounded-md border border-input bg-white text-black px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
              error && 'border-destructive focus:ring-destructive',
              !hasValue && 'text-muted-foreground'
            )}
            onClick={handleToggle}
            disabled={disabled}
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            {...props}
          >
            <span className="truncate">{getSelectedDisplay()}</span>

            <div className="flex items-center gap-1">
              {loading && (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              )}

              {clearable && hasValue && !loading && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4"
                  onClick={handleClear}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}

              <ChevronDown
                className={cn('h-4 w-4 transition-transform', isOpen && 'rotate-180')}
              />
            </div>
          </button>

          {/* Hidden native select for form submission */}
          <select
            name={name}
            value={
              multiple
                ? Array.isArray(value)
                  ? (value as (string | number)[]).map(String)
                  : []
                : value !== undefined
                ? String(value)
                : ''
            }
            onChange={() => {}}
            className="sr-only"
            tabIndex={-1}
            multiple={multiple}
            required={required}
          >
            <option value="">Select...</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* Dropdown */}
          {isOpen && (
            <div className="absolute z-50 w-full mt-1 bg-white text-black border border-border rounded-md shadow-md">
              {searchable && (
                <div className="p-2 border-b">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search options..."
                      value={searchTerm}
                      onChange={handleSearchChange}
                      className="pl-8"
                    />
                  </div>
                </div>
              )}

              <div className="py-1 max-h-60 overflow-auto">
                {filteredOptions.length === 0 ? (
                  <div className="px-3 py-2 text-sm text-muted-foreground">
                    {searchTerm ? 'No options found' : 'No options available'}
                  </div>
                ) : (
                  filteredOptions.map((option) => (
                    <div
                      key={option.value}
                      className={cn(
                        'relative flex cursor-pointer select-none items-center rounded-sm px-3 py-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground',
                        isSelected(option.value) && 'bg-primary text-primary-foreground',
                        option.disabled && 'pointer-events-none opacity-50'
                      )}
                      onClick={() => !option.disabled && handleOptionSelect(option)}
                    >
                      <span className="flex-1">{option.label}</span>
                      {multiple && isSelected(option.value) && (
                        <Check className="h-4 w-4" />
                      )}
                      {option.description && (
                        <span className="text-xs text-muted-foreground ml-2">
                          {option.description}
                        </span>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
        {description && !error && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
        {error && <p className="text-sm text-destructive mt-1">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;