import React from 'react';
// import SelectIcon from 'src/assets/SelectIcon';

type Item<T extends string> = { label: string; value: T };

type Props<T extends string> = {
    className?: string;
    name: string;
    options: Item<T>[];
    onSelect: (value: string) => void;
    selectedValue: string | string[];
};

const Select = <T extends string = string>({
    className,
    name,
    options,
    onSelect,
    selectedValue,
}: Props<T>) => {
    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        onSelect(event.target.value as T);
    };
    return (
        <div className="relative">
            <select
                className={
                    className ||
                    'border w-32 border-gray-300 outline-none h-11 bg-transparent rounded-full appearance-none pl-6 pr-8'
                }
                name={name}
                value={selectedValue}
                onChange={handleChange}
            >
                {options.map((option) => {
                    return (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    );
                })}
            </select>
            <span className="absolute top-5 right-4">
                {/* <SelectIcon height={6} width={11} fill="black" /> */}
            </span>
        </div>
    );
};

export default Select;
