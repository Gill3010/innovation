'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface ButtonProps {
  text: string;
  onClick?: () => void;
}

const Button = ({ text, onClick }: ButtonProps) => {
  const router = useRouter();
  const { user } = useAuth();

  const handleClick = () => {
    if (onClick) {
      onClick();
      return;
    }

    // Si el usuario está autenticado, redirigir al dashboard
    if (user) {
      router.push('/dashboard');
    } else {
      // Si no está autenticado, redirigir al login
      router.push('/login');
    }
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