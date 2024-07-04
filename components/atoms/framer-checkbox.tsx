import { ReactNode, createContext, useContext, useMemo, useState } from 'react';

import { motion } from 'framer-motion';

interface CheckboxContextProps {
  isChecked: boolean;
  setIsChecked: (isChecked: boolean) => void;

  disabled: boolean;
  onClick: () => void;

  id: string;
}

const CheckboxContext = createContext<CheckboxContextProps>({
  isChecked: false,
  setIsChecked: () => {},
  disabled: false,
  onClick: () => {},
  id: '',
});

const tickVariants = {
  checked: {
    pathLength: 1,
    opacity: 1,
    transition: {
      duration: 0.2,
      delay: 0.2,
    },
  },
  unchecked: {
    pathLength: 0,
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
};

interface CheckboxProps {
  children: ReactNode;
  checked: boolean;
  onClick: () => void;
  disabled: boolean;
  id: string;
}

export default function FramerCheckbox({
  children,
  checked,
  disabled,
  onClick,
  id,
}: Readonly<CheckboxProps>) {
  const [isChecked, setIsChecked] = useState(checked);

  return (
    <div className="flex items-center">
      <CheckboxContext.Provider
        value={useMemo(
          () => ({
            disabled,
            onClick,
            isChecked,
            setIsChecked,
            id,
          }),
          [disabled, id, isChecked, onClick],
        )}
      >
        {children}
      </CheckboxContext.Provider>
    </div>
  );
}

function CheckboxIndicator() {
  const { isChecked, setIsChecked, disabled, onClick, id } =
    useContext(CheckboxContext);

  const handleClick = () => {
    if (disabled) return;
    setIsChecked(!isChecked);
    onClick();
  };
  return (
    <button className={`relative flex items-center`}>
      <input
        id={id}
        type="checkbox"
        checked={isChecked}
        className="border-blue-gray-200 relative h-5 w-5 cursor-pointer appearance-none rounded-md border-2 transition-all duration-500 checked:border-blue-500 checked:bg-blue-500"
        onChange={handleClick}
        disabled={disabled}
      />
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white">
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="3.5"
          stroke="currentColor"
          className="h-3.5 w-3.5"
          initial={false}
          animate={isChecked ? 'checked' : 'unchecked'}
        >
          <motion.path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.5 12.75l6 6 9-13.5"
            variants={tickVariants}
          />
        </motion.svg>
      </div>
    </button>
  );
}

FramerCheckbox.Indicator = CheckboxIndicator;

interface CheckboxLabelProps {
  children: ReactNode;
}

function CheckboxLabel({ children }: Readonly<CheckboxLabelProps>) {
  const { id, isChecked } = useContext(CheckboxContext);

  return (
    <motion.label
      className="relative ml-2 overflow-hidden text-sm line-through"
      htmlFor={id}
      animate={{
        x: isChecked ? [0, -4, 0] : [0, 4, 0],
        color: isChecked ? '#a1a1aa' : '#27272a',
        textDecorationLine: isChecked ? 'line-through' : 'none',
      }}
      initial={false}
      transition={{
        duration: 0.3,
        ease: 'easeOut',
      }}
    >
      {children}
    </motion.label>
  );
}

FramerCheckbox.Label = CheckboxLabel;
