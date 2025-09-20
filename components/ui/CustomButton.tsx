import React from "react";

interface CustomButtonProps {
  width: number;
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  [key: string]: unknown; // For rest props
}

const CustomButton: React.FC<CustomButtonProps> = ({
  width,
  children,
  onClick,
  ...rest
}) => {
  return (
    <button
      className="flex justify-center items-center h-12 rounded-[30px] opacity-80 border border-opacity-40 border-white bg-transparent text-white text-opacity-60 cursor-pointer font-inter font-normal text-sm leading-[150%] transition-all duration-300 ease-in-out hover:border-[#FBDE98] hover:text-gray-200"
      style={{ width: `${width}px` }}
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  );
};

export default CustomButton;
