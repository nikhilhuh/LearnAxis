import React, { useState, useEffect, useRef } from "react";

interface SelectOptionDropdownProps {
  options: { label: string; value: string }[];
  placeholder?: string;
  onSelect: (value: string) => void;
  preSelectedValue?: string;
  className?: string;
}

const SelectOptionDropdown: React.FC<SelectOptionDropdownProps> = ({
  options,
  placeholder = "Select an option",
  onSelect,
  preSelectedValue,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(
    preSelectedValue || null
  );
  useEffect(() => {
    setSelectedOption(preSelectedValue || null);
  }, [preSelectedValue]);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleOptionClick = (value: string) => {
    setSelectedOption(value);
    setIsOpen(false);
    onSelect(value);
  };

  const handleOutsideClick = (e: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(e.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <div
      ref={dropdownRef}
      className={`relative inline-block bg-transparent border-b-2 border-gray-300 px-2 py-1 text-sm tablet:text-base ${className}!`}
    >
      <button
        type="button"
        className="w-full flex justify-between gap-2 bg-transparent outline-none focus:outline-none cursor-pointer"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {selectedOption
          ? options.find((option) => option.value === selectedOption)?.label
          : placeholder}
        <span>▼</span>
      </button>
      {isOpen && (
        <ul className="absolute z-10 w-full break-words mt-2 left-0 bg-[var(--color-secondary)] border border-gray-300 rounded shadow-lg max-h-[30vh] overflow-y-auto">
          {options.map((option) => (
            <li
              key={option.value}
              className="px-4 py-2 hover:bg-[var(--color-primaryHover)] cursor-pointer"
              onClick={() => handleOptionClick(option.value)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SelectOptionDropdown;
