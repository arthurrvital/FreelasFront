'use client';

import { useState, useEffect } from 'react';
import { Search, Star, MapPin, DollarSign, LogOut, User, Briefcase, Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Marca que o componente montou no cliente
    setMounted(true);
    
    // Verificar se está logado
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    }

    // Buscar prestadores
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      const response = await fetch('http://localhost:3000/providers');
      const data = await response.json();
      setProviders(data);
    } catch (error) {
      console.error('Erro ao buscar prestadores:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchProviders();
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/search/providers?q=${searchQuery}`);
      const data = await response.json();
      setProviders(data);
    } catch (error) {
      console.error('Erro na busca:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
  };

  const calculateRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-blue-600">Freelas SJDR</h1>
            <div className="flex items-center gap-4">
              {mounted && user ? (
                <>
                  <button
                    onClick={() => router.push('/dashboard')}
                    className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
                    title="Meu Dashboard"
                  >
                    <User size={24} />
                  </button>
                  <button
                    onClick={() => router.push('/favoritos')}
                    className="flex items-center gap-2 text-gray-700 hover:text-red-500 transition-colors"
                    title="Meus Favoritos"
                  >
                    <Heart size={24} />
                  </button>
                  <div className="flex items-center gap-2 text-gray-700">
                    <User size={20} />
                    <span className="font-medium">{user.name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-red-600 hover:text-red-700"
                  >
                    <LogOut size={20} />
                    Sair
                  </button>
                </>
              ) : mounted ? (
                <a
                  href="/login"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Entrar
                </a>
              ) : null}
            </div>
          </div>

          {/* Navegação - Tabs */}
          <div className="flex gap-4 mb-4 border-b border-gray-200">
            <button
              className="pb-3 px-4 border-b-2 border-blue-600 text-blue-600 font-semibold"
            >
              Prestadores de Serviço
            </button>
            <button
              onClick={() => router.push('/vagas')}
              className="pb-3 px-4 border-b-2 border-transparent text-gray-600 hover:text-gray-800 font-semibold flex items-center gap-2"
            >
              <Briefcase size={20} />
              Vagas de Emprego
            </button>
          </div>

          {/* Busca */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Buscar por profissional, categoria ou cidade..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={handleSearch}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
            >
              Buscar
            </button>
          </div>
        </div>
      </header>

      {/* Conteúdo */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Profissionais Disponíveis
        </h2>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Carregando profissionais...</p>
          </div>
        ) : providers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              Nenhum profissional encontrado.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {providers.map((provider) => {
              const avgRating = calculateRating(provider.reviews);
              const hasPhoto = provider.photos && provider.photos.length > 0;

              return (
                <div
                  key={provider.id}
                  onClick={() => router.push(`/prestador/${provider.id}`)}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden cursor-pointer"
                >
                  {/* Foto ou Avatar */}
                  <div className="h-48 bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
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
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">
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

                    {/* Botão WhatsApp */}
                    {provider.user.whatsapp && (
                      <a
                        href={`https://wa.me/55${provider.user.whatsapp.replace(/\D/g, '')}?text=Olá! Vi seu perfil no Freelas SJDR e gostaria de contratar seus serviços.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="block w-full bg-green-500 text-white text-center py-3 rounded-lg hover:bg-green-600 font-medium transition-colors"
                      >
                        Contatar no WhatsApp
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}