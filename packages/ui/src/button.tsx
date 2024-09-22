"use client";

import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  className?: string;
  appName?: string;
  onClick?: () => void; // Optional custom onClick handler
}

export const Button = ({ children, className, appName = "default", onClick }: ButtonProps) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      alert(`Hello from your ${appName} app!`);
    }
  };

  return (
    <button className={className} onClick={handleClick}>
      {children}
    </button>
  );
};
