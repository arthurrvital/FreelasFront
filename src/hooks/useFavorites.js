'use client';

import { useState, useEffect } from 'react';

export function useFavorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await fetch('http://localhost:3000/favorites', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setFavorites(data);
      }
    } catch (error) {
      console.error('Erro ao buscar favoritos:', error);
    } finally {
      setLoading(false);
    }
  };

  const isFavorite = (providerId) => {
    return favorites.some(fav => fav.provider.id === parseInt(providerId));
  };

  const toggleFavorite = async (providerId) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        alert('Você precisa estar logado para favoritar');
        return false;
      }

      const alreadyFavorite = isFavorite(providerId);

      if (alreadyFavorite) {
        // Remover dos favoritos
        const response = await fetch(`http://localhost:3000/favorites/${providerId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          setFavorites(prev => prev.filter(fav => fav.provider.id !== parseInt(providerId)));
          return false;
        }
      } else {
        // Adicionar aos favoritos
        const response = await fetch(`http://localhost:3000/favorites/${providerId}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setFavorites(prev => [...prev, data.favorite]);
          return true;
        }
      }
    } catch (error) {
      console.error('Erro ao favoritar:', error);
      alert('Erro ao favoritar prestador');
    }
    
    return null;
  };

  return {
    favorites,
    loading,
    isFavorite,
    toggleFavorite,
    refetch: fetchFavorites,
  };
}