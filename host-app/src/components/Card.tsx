import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  onClick,
  hover = false 
}) => {
  return (
    <div
      className={`bg-white rounded-lg shadow-md p-4 ${
        hover ? 'hover:shadow-lg cursor-pointer transition-shadow duration-200' : ''
      } ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};