'use client';

interface ButtonProps {
  text: string;
  onClick?: () => void;
}

const Button = ({ text, onClick }: ButtonProps) => {
  const handleClick = () => {
    alert('¡Hola desde Next.js!');
    if (onClick) onClick();
  };

  return (
    <button 
      onClick={handleClick}
      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
    >
      {text}
    </button>
  );
};

export default Button;