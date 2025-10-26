'use client';

import { useState, useEffect } from 'react';
import { Heart, Star, MapPin, DollarSign, User, ArrowLeft, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function FavoritosPage() {
  const router = useRouter();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        router.push('/login');
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
      } else if (response.status === 401) {
        router.push('/login');
      }
    } catch (error) {
      console.error('Erro ao buscar favoritos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (providerId) => {
    if (!confirm('Deseja remover este prestador dos favoritos?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`http://localhost:3000/favorites/${providerId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setFavorites(prev => prev.filter(fav => fav.provider.id !== providerId));
      }
    } catch (error) {
      console.error('Erro ao remover favorito:', error);
      alert('Erro ao remover dos favoritos');
    }
  };

  const calculateRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Carregando favoritos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft size={20} />
              Voltar
            </button>
            <h1 className="text-2xl font-bold text-blue-600 flex items-center gap-2">
              <Heart size={28} className="text-red-500 fill-red-500" />
              Meus Favoritos
            </h1>
            <div className="w-20"></div> {/* Spacer para centralizar */}
          </div>
        </div>
      </header>

      {/* Conteúdo */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {favorites.length === 0 ? (
          <div className="text-center py-16">
            <Heart size={80} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Nenhum favorito ainda
            </h2>
            <p className="text-gray-600 mb-6">
              Adicione prestadores aos favoritos para encontrá-los facilmente depois!
            </p>
            <button
              onClick={() => router.push('/')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold"
            >
              Explorar Prestadores
            </button>
          </div>
        ) : (
          <>
            <p className="text-gray-600 mb-6">
              Você tem <span className="font-bold text-blue-600">{favorites.length}</span> prestador{favorites.length !== 1 ? 'es' : ''} favorito{favorites.length !== 1 ? 's' : ''}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((favorite) => {
                const provider = favorite.provider;
                const avgRating = calculateRating(provider.reviews);
                const hasPhoto = provider.photos && provider.photos.length > 0;

                return (
                  <div
                    key={favorite.id}
                    className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden relative group"
                  >
                    {/* Botão Remover */}
                    <button
                      onClick={() => handleRemove(provider.id)}
                      className="absolute top-3 right-3 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                      title="Remover dos favoritos"
                    >
                      <Trash2 size={20} className="text-red-500" />
                    </button>

                    {/* Foto ou Avatar */}
                    <div
                      onClick={() => router.push(`/prestador/${provider.id}`)}
                      className="h-48 bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center cursor-pointer"
                    >
                      {hasPhoto ? (
                        <img
                          src={`http://localhost:3000${provider.photos[0].url}`}
                          alt={provider.user.name}
                          className="w-full h-full object-cover"
                        />
                      ) : provider.user.avatar ? (
                        <img
                          src={`http://localhost:3000${provider.user.avatar}`}
                          alt={provider.user.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User size={80} className="text-white" />
                      )}
                    </div>

                    {/* Conteúdo */}
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-2">
                        <div
                          onClick={() => router.push(`/prestador/${provider.id}`)}
                          className="cursor-pointer flex-1"
                        >
                          <h3 className="text-xl font-bold text-gray-800 hover:text-blue-600 transition-colors">
                            {provider.user.name}
                          </h3>
                          <p className="text-blue-600 font-medium">
                            {provider.category}
                          </p>
                        </div>
                        {provider.reviews && provider.reviews.length > 0 && (
                          <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded">
                            <Star size={16} className="text-yellow-500 fill-yellow-500" />
                            <span className="font-bold text-gray-800">{avgRating}</span>
                          </div>
                        )}
                      </div>

                      {provider.bio && (
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {provider.bio}
                        </p>
                      )}

                      {/* Info */}
                      <div className="space-y-2 mb-4">
                        {provider.city && (
                          <div className="flex items-center gap-2 text-gray-600 text-sm">
                            <MapPin size={16} />
                            <span>{provider.city}</span>
                          </div>
                        )}
                        {provider.priceMin && provider.priceMax && (
                          <div className="flex items-center gap-2 text-gray-600 text-sm">
                            <DollarSign size={16} />
                            <span>
                              R$ {provider.priceMin} - R$ {provider.priceMax}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Botões */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => router.push(`/prestador/${provider.id}`)}
                          className="flex-1 bg-blue-600 text-white text-center py-3 rounded-lg hover:bg-blue-700 font-medium transition-colors"
                        >
                          Ver Perfil
                        </button>
                        {provider.user.whatsapp && (
                          <a
                            href={`https://wa.me/55${provider.user.whatsapp.replace(/\D/g, '')}?text=Olá! Vi seu perfil no Freelas SJDR.`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 bg-green-500 text-white text-center py-3 rounded-lg hover:bg-green-600 font-medium transition-colors"
                          >
                            WhatsApp
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </main>
    </div>
  );
}