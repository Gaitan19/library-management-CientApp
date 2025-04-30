interface FilterOption {
    label: string;
    value: any;
    color: string;
  }
  
  interface FilterButtonsProps {
    options: FilterOption[];
    selectedValue: any;
    onSelect: (value: any) => void;
  }
  
  export default function FilterButtons({ options, selectedValue, onSelect }: FilterButtonsProps) {
    const colorClasses: Record<string, string> = {
      green: "bg-green-100 text-green-800",
      red: "bg-red-100 text-red-800",
      blue: "bg-blue-100 text-blue-800",
      yellow: "bg-yellow-100 text-yellow-800",
      gray: "bg-gray-100 text-gray-700"
    };
  
    return (
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onSelect(option.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedValue === option.value
                ? `${colorClasses[option.color]} shadow-inner`
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    );
  }