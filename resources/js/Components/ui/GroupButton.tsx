import React from "react";

type ButtonGroupProps = {
    options: string[];
    onClick: (selected: string) => void;
};

const ButtonGroup: React.FC<ButtonGroupProps> = ({ options, onClick }) => {
    return (
        <span className="isolate inline-flex rounded-md shadow-sm">
      {options.map((option, index) => (
          <button
              key={option}
              type="button"
              className={`relative inline-flex items-center px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10
            ${index === 0 ? "rounded-l-md" : "-ml-px"}
            ${index === options.length - 1 ? "rounded-r-md" : ""}
            bg-white`}
              onClick={() => onClick(option)}
          >
              {option}
          </button>
      ))}
    </span>
    );
};

export default ButtonGroup;
