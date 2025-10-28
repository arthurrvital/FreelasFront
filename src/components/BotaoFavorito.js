'use client';

import { Heart } from 'lucide-react';
import { useState } from 'react';

export default function BotaoFavorito({ providerId, isFavorited, onToggle, size = 24 }) {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = async (e) => {
    e.stopPropagation();
    
    setIsAnimating(true);
    await onToggle(providerId);
    
    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <button
      onClick={handleClick}
      className={`transition-all ${isAnimating ? 'scale-125' : 'scale-100'} hover:scale-110`}
      title={isFavorited ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
    >
      <Heart
        size={size}
        className={
          isFavorited
            ? 'text-red-500 fill-red-500'
            : 'text-gray-400 hover:text-red-500'
        }
      />
    </button>
  );
}