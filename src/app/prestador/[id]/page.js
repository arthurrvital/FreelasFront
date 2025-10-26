'use client';

import { useState, useEffect } from 'react';
import { Star, MapPin, DollarSign, Clock, Award, Phone, MessageCircle, ArrowLeft, Heart, StarOff } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import ModalAvaliacao from '@/components/ModalAvaliacao';
import { useFavorites } from '@/hooks/useFavorites';

export default function ProviderProfile() {
  const params = useParams();
  const router = useRouter();
  const [provider, setProvider] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [showModalAvaliacao, setShowModalAvaliacao] = useState(false);
  
  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    }

    fetchProvider();
    fetchReviews();
  }, [params.id]);

  const fetchProvider = async () => {
    try {
      const response = await fetch(`http://localhost:3000/providers/${params.id}`);
      const data = await response.json();
      setProvider(data);
    } catch (error) {
      console.error('Erro ao buscar prestador:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await fetch(`http://localhost:3000/providers/${params.id}/reviews`);
      const data = await response.json();
      setReviews(data.reviews || []);
    } catch (error) {
      console.error('Erro ao buscar avaliações:', error);
    }
  };

  const calculateRating = () => {
    if (!reviews || reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        size={16}
        className={index < rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}
      />
    ));
  };

  const handleAvaliacaoSuccess = () => {
    fetchReviews();
    alert('Avaliação enviada com sucesso! ⭐');
  };

  const handleToggleFavorite = async () => {
    await toggleFavorite(params.id);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg">Prestador não encontrado</p>
          <button
            onClick={() => router.push('/')}
            className="mt-4 text-blue-600 hover:text-blue-700"
          >
            Voltar para home
          </button>
        </div>
      </div>
    );
  }

  const avgRating = calculateRating();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft size={20} />
            Voltar
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Card Principal */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8 relative">
          {/* Botão Favoritar - Canto Superior Direito */}
          {user && (
            <button
              onClick={handleToggleFavorite}
              className="absolute top-6 right-6 z-10 bg-white rounded-full p-3 shadow-lg hover:scale-110 transition-transform"
              title={isFavorite(params.id) ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
            >
              <Heart
                size={32}
                className={
                  isFavorite(params.id)
                    ? 'text-red-500 fill-red-500'
                    : 'text-gray-400 hover:text-red-500'
                }
              />
            </button>
          )}

          {/* Banner/Hero */}
          <div className="h-48 bg-gradient-to-r from-blue-500 to-indigo-600"></div>

          {/* Informações Principais */}
          <div className="px-8 pb-8">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between -mt-16 mb-6">
              {/* Avatar */}
              <div className="flex items-end gap-4">
                <div className="w-32 h-32 rounded-2xl bg-white p-2 shadow-lg">
                  {provider.user.avatar ? (
                    <img
                      src={`http://localhost:3000${provider.user.avatar}`}
                      alt={provider.user.name}
                      className="w-full h-full rounded-xl object-cover"
                    />
                  ) : (
                    <div className="w-full h-full rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-4xl font-bold">
                      {provider.user.name[0]}
                    </div>
                  )}
                </div>
                <div className="pb-2">
                  <h1 className="text-3xl font-bold text-gray-800">
                    {provider.user.name}
                  </h1>
                  <p className="text-xl text-blue-600 font-medium">
                    {provider.category}
                  </p>
                </div>
              </div>

              {/* Avaliação */}
              {reviews.length > 0 && (
                <div className="mt-4 md:mt-0 bg-yellow-50 px-6 py-3 rounded-xl">
                  <div className="flex items-center gap-2 mb-1">
                    <Star size={24} className="text-yellow-500 fill-yellow-500" />
                    <span className="text-3xl font-bold text-gray-800">{avgRating}</span>
                  </div>
                  <p className="text-sm text-gray-600">{reviews.length} avaliações</p>
                </div>
              )}
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-3 mb-6">
              {provider.available && (
                <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
                  Disponível
                </span>
              )}
              {provider.experience && (
                <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                  <Award size={16} />
                  {provider.experience} de experiência
                </span>
              )}
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {provider.city && (
                <div className="flex items-center gap-3 text-gray-700">
                  <MapPin size={20} className="text-blue-600" />
                  <span>{provider.city}</span>
                </div>
              )}
              {provider.priceMin && provider.priceMax && (
                <div className="flex items-center gap-3 text-gray-700">
                  <DollarSign size={20} className="text-blue-600" />
                  <span>R$ {provider.priceMin} - R$ {provider.priceMax}</span>
                </div>
              )}
              {provider.user.phone && (
                <div className="flex items-center gap-3 text-gray-700">
                  <Phone size={20} className="text-blue-600" />
                  <span>{provider.user.phone}</span>
                </div>
              )}
            </div>

            {/* Sobre */}
            {provider.bio && (
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-3">Sobre</h2>
                <p className="text-gray-600 leading-relaxed">{provider.bio}</p>
              </div>
            )}

            {/* Botões de Ação */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              {/* Botão WhatsApp */}
              {provider.user.whatsapp && (
                <a
                  href={`https://wa.me/55${provider.user.whatsapp.replace(/\D/g, '')}?text=Olá ${provider.user.name}! Vi seu perfil no Freelas SJDR e gostaria de contratar seus serviços.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-green-500 text-white text-center px-8 py-4 rounded-xl hover:bg-green-600 font-semibold transition-colors flex items-center justify-center gap-3"
                >
                  <MessageCircle size={24} />
                  Entrar em Contato pelo WhatsApp
                </a>
              )}

              {/* Botão Avaliar */}
              {user && (
                <button
                  onClick={() => setShowModalAvaliacao(true)}
                  className="md:w-auto bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-700 font-semibold transition-colors flex items-center justify-center gap-3"
                >
                  <Star size={24} />
                  Avaliar Prestador
                </button>
              )}
            </div>

            {!user && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                <p className="text-blue-800 text-sm text-center">
                  <a href="/login" className="font-semibold hover:underline">Faça login</a> para avaliar este prestador
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Galeria de Fotos */}
        {provider.photos && provider.photos.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Portfólio</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {provider.photos.map((photo) => (
                <div
                  key={photo.id}
                  className="aspect-square rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                >
                  <img
                    src={`http://localhost:3000${photo.url}`}
                    alt={photo.caption || 'Trabalho realizado'}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Avaliações */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Avaliações ({reviews.length})
            </h2>
            {user && (
              <button
                onClick={() => setShowModalAvaliacao(true)}
                className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2"
              >
                <Star size={20} />
                Adicionar Avaliação
              </button>
            )}
          </div>

          {reviews.length > 0 ? (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="border-b border-gray-200 last:border-0 pb-6 last:pb-0">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {review.user.avatar ? (
                        <img
                          src={`http://localhost:3000${review.user.avatar}`}
                          alt={review.user.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold">
                          {review.user.name[0]}
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-gray-800">{review.user.name}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                  {review.comment && (
                    <p className="text-gray-600">{review.comment}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <StarOff size={48} className="mx-auto text-gray-400 mb-3" />
              <p className="text-gray-600">Ainda não há avaliações para este prestador.</p>
              {user && (
                <button
                  onClick={() => setShowModalAvaliacao(true)}
                  className="mt-4 text-blue-600 hover:text-blue-700 font-semibold"
                >
                  Seja o primeiro a avaliar!
                </button>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Modal de Avaliação */}
      <ModalAvaliacao
        isOpen={showModalAvaliacao}
        onClose={() => setShowModalAvaliacao(false)}
        providerId={params.id}
        providerName={provider?.user.name}
        onSuccess={handleAvaliacaoSuccess}
      />
    </div>
  );
}