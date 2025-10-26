'use client';

import { useState, useEffect } from 'react';
import { 
  User, 
  Star, 
  Heart, 
  ArrowLeft, 
  Edit2, 
  Save, 
  X,
  Camera,
  Phone,
  Mail,
  MessageCircle,
  Calendar,
  Award,
  TrendingUp
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalReviews: 0,
    totalFavorites: 0,
    avgRatingGiven: 0,
  });
  const [reviews, setReviews] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({
    name: '',
    phone: '',
    whatsapp: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        router.push('/login');
        return;
      }

      // Buscar dados do usuário
      const userResponse = await fetch('http://localhost:3000/users/me', {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!userResponse.ok) throw new Error('Erro ao buscar usuário');
      const userData = await userResponse.json();
      setUser(userData);
      setEditData({
        name: userData.name,
        phone: userData.phone || '',
        whatsapp: userData.whatsapp || '',
      });

      // Buscar minhas avaliações
      const reviewsResponse = await fetch('http://localhost:3000/my-reviews', {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      let reviewsData = [];
      if (reviewsResponse.ok) {
        reviewsData = await reviewsResponse.json();
        setReviews(reviewsData);
        
        // Calcular média das avaliações dadas
        if (reviewsData.length > 0) {
          const total = reviewsData.reduce((sum, r) => sum + r.rating, 0);
          const avg = (total / reviewsData.length).toFixed(1);
          setStats(prev => ({ ...prev, avgRatingGiven: parseFloat(avg) }));
        }
      }

      // Buscar favoritos
      const favoritesResponse = await fetch('http://localhost:3000/favorites', {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      let favoritesData = [];
      if (favoritesResponse.ok) {
        favoritesData = await favoritesResponse.json();
        setFavorites(favoritesData);
      }

      // Atualizar estatísticas
      setStats(prev => ({
        ...prev,
        totalReviews: reviewsData.length,
        totalFavorites: favoritesData.length,
      }));

    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:3000/users/me', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editData),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
        setEditMode(false);
        
        // Atualizar localStorage
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        alert('Perfil atualizado com sucesso! ✅');
      }
    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert('Erro ao atualizar perfil');
    } finally {
      setSaving(false);
    }
  };

 const handleDeleteReview = async (reviewId) => {
    if (!confirm('Deseja realmente deletar esta avaliação?')) return;

    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`http://localhost:3000/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        setReviews(prev => prev.filter(r => r.id !== reviewId));
        alert('Avaliação deletada com sucesso!');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao deletar avaliação');
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione uma imagem!');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('A imagem deve ter no máximo 5MB!');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await fetch('http://localhost:3000/users/avatar', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setUser(prev => ({ ...prev, avatar: data.avatar }));
        
        const storedUser = JSON.parse(localStorage.getItem('user'));
        storedUser.avatar = data.avatar;
        localStorage.setItem('user', JSON.stringify(storedUser));
        
        alert('Foto atualizada com sucesso! ✅');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao atualizar foto de perfil');
    }
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Carregando dashboard...</p>
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
            <h1 className="text-2xl font-bold text-blue-600">Meu Dashboard</h1>
            <div className="w-20"></div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Perfil do Usuário */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Meu Perfil</h2>
            {!editMode ? (
              <button
                onClick={() => setEditMode(true)}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
              >
                <Edit2 size={20} />
                Editar
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => setEditMode(false)}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-700"
                >
                  <X size={20} />
                  Cancelar
                </button>
                <button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="flex items-center gap-2 text-green-600 hover:text-green-700 disabled:opacity-50"
                >
                  <Save size={20} />
                  {saving ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Avatar */}
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
                  {user?.avatar ? (
                    <img
                      src={`http://localhost:3000${user.avatar}`}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-white text-4xl font-bold">
                      {user?.name[0]}
                    </span>
                  )}
                </div>
                <input
                  type="file"
                  id="avatar-upload"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
                <label
                  htmlFor="avatar-upload"
                  className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 cursor-pointer"
                  title="Alterar foto"
                >
                  <Camera size={20} />
                </label>
              </div>
              <div className="mt-4 text-center">
                <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                  {user?.type === 'prestador' ? 'Prestador' : user?.type === 'contratante' ? 'Contratante' : 'Empresa'}
                </span>
              </div>
            </div>

            {/* Informações */}
            <div className="flex-1 space-y-4">
              {/* Nome */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nome</label>
                {editMode ? (
                  <input
                    type="text"
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-800 text-lg font-semibold">{user?.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail size={18} />
                  <span>{user?.email}</span>
                </div>
              </div>

              {/* Telefone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Telefone</label>
                {editMode ? (
                  <input
                    type="tel"
                    value={editData.phone}
                    onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                    placeholder="(32) 99999-9999"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone size={18} />
                    <span>{user?.phone || 'Não informado'}</span>
                  </div>
                )}
              </div>

              {/* WhatsApp */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp</label>
                {editMode ? (
                  <input
                    type="tel"
                    value={editData.whatsapp}
                    onChange={(e) => setEditData({ ...editData, whatsapp: e.target.value })}
                    placeholder="32999999999"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <div className="flex items-center gap-2 text-gray-600">
                    <MessageCircle size={18} />
                    <span>{user?.whatsapp || 'Não informado'}</span>
                  </div>
                )}
              </div>

              {/* Data de Cadastro */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Membro desde</label>
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar size={18} />
                  <span>{new Date(user?.createdAt).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total de Avaliações */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Star size={24} className="text-blue-600" />
              </div>
              <TrendingUp size={20} className="text-green-500" />
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Avaliações Feitas</h3>
            <p className="text-3xl font-bold text-gray-800">{reviews.length}</p>
          </div>

          {/* Total de Favoritos */}
          <div className="bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow"
               onClick={() => router.push('/favoritos')}>
            <div className="flex items-center justify-between mb-4">
              <div className="bg-red-100 p-3 rounded-lg">
                <Heart size={24} className="text-red-600" />
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Favoritos</h3>
            <p className="text-3xl font-bold text-gray-800">{favorites.length}</p>
          </div>

          {/* Média de Avaliações */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Award size={24} className="text-yellow-600" />
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Média das Minhas Notas</h3>
            <p className="text-3xl font-bold text-gray-800">
              {stats.avgRatingGiven > 0 ? stats.avgRatingGiven : '—'}
            </p>
          </div>
        </div>

        {/* Minhas Avaliações */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Minhas Avaliações</h2>
          
          {reviews.length === 0 ? (
            <div className="text-center py-8">
              <Star size={48} className="mx-auto text-gray-400 mb-3" />
              <p className="text-gray-600">Você ainda não fez nenhuma avaliação.</p>
              <button
                onClick={() => router.push('/')}
                className="mt-4 text-blue-600 hover:text-blue-700 font-semibold"
              >
                Explorar Prestadores
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="border border-gray-200 rounded-xl p-6 hover:border-blue-300 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
                        {review.provider.user.avatar ? (
                          <img
                            src={`http://localhost:3000${review.provider.user.avatar}`}
                            alt={review.provider.user.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-white text-xl font-bold">
                            {review.provider.user.name[0]}
                          </span>
                        )}
                      </div>
                      <div>
                        <h3 
                          className="font-bold text-gray-800 hover:text-blue-600 cursor-pointer"
                          onClick={() => router.push(`/prestador/${review.provider.id}`)}
                        >
                          {review.provider.user.name}
                        </h3>
                        <p className="text-sm text-blue-600">{review.provider.category}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        {renderStars(review.rating)}
                      </div>
                      <button
                        onClick={() => handleDeleteReview(review.id)}
                        className="text-red-500 hover:text-red-700"
                        title="Deletar avaliação"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  </div>
                  {review.comment && (
                    <p className="text-gray-600 italic">"{review.comment}"</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}