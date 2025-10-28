'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Briefcase, MapPin, DollarSign, Building2, Calendar, User, LogOut, Heart } from 'lucide-react';

export default function VagasPage() {
  const router = useRouter();
  const [vagas, setVagas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCity, setFilterCity] = useState('');
  const [filterWorkType, setFilterWorkType] = useState('');
  const [user, setUser] = useState(null);
  const [mounted, setMounted] = useState(false);

  const cidades = [
    'São João del-Rei',
    'Tiradentes',
    'Conceição da Barra de Minas',
    'Coronel Xavier Chaves',
    'Dores de Campos',
    'Ibituruna',
    'Lagoa Dourada',
    'Madre de Deus de Minas',
    'Nazareno',
    'Piedade do Rio Grande',
    'Prados',
    'Resende Costa',
    'Ritápolis',
    'Santa Cruz de Minas',
    'Santana do Garambéu',
    'São Tiago',
  ];

  const tiposContrato = ['CLT', 'PJ', 'Temporário', 'Estágio', 'Freelance', 'Meio Período'];

  useEffect(() => {
    setMounted(true);
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    fetchVagas();
  }, []);

  const fetchVagas = async () => {
    setLoading(true);
    try {
      let url = 'http://localhost:3000/job-vacancies?status=aberta';

      if (filterCity) url += `&city=${encodeURIComponent(filterCity)}`;
      if (filterWorkType) url += `&workType=${encodeURIComponent(filterWorkType)}`;

      const response = await fetch(url);
      const data = await response.json();

      // Filtrar por busca (título ou categoria)
      let filtered = data;
      if (searchQuery) {
        filtered = data.filter(vaga =>
          vaga.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          vaga.category.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      setVagas(filtered);
    } catch (error) {
      console.error('Erro ao buscar vagas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (mounted) {
      fetchVagas();
    }
  }, [filterCity, filterWorkType]);

  const handleSearch = () => {
    fetchVagas();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
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
                  >
                    <User size={24} />
                  </button>
                  {user.type === 'empresa' && (
                    <button
                      onClick={() => router.push('/empresa/dashboard')}
                      className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
                    >
                      <Building2 size={24} />
                    </button>
                  )}
                  <div className="flex items-center gap-2 text-gray-700">
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
              onClick={() => router.push('/')}
              className="pb-3 px-4 border-b-2 border-transparent text-gray-600 hover:text-gray-800 font-semibold"
            >
              Prestadores de Serviço
            </button>
            <button
              className="pb-3 px-4 border-b-2 border-blue-600 text-blue-600 font-semibold flex items-center gap-2"
            >
              <Briefcase size={20} />
              Vagas de Emprego
            </button>
          </div>

          {/* Busca e Filtros */}
          <div className="space-y-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Buscar por título ou categoria..."
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <select
                  value={filterCity}
                  onChange={(e) => setFilterCity(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Todas as cidades</option>
                  {cidades.map(cidade => (
                    <option key={cidade} value={cidade}>{cidade}</option>
                  ))}
                </select>
              </div>

              <div>
                <select
                  value={filterWorkType}
                  onChange={(e) => setFilterWorkType(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Todos os tipos de contrato</option>
                  {tiposContrato.map(tipo => (
                    <option key={tipo} value={tipo}>{tipo}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Vagas Disponíveis</h2>
          <p className="text-gray-600">
            {vagas.length} {vagas.length === 1 ? 'vaga encontrada' : 'vagas encontradas'}
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Carregando vagas...</p>
          </div>
        ) : vagas.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-md">
            <Briefcase className="mx-auto text-gray-400 mb-4" size={64} />
            <p className="text-gray-600 text-lg">Nenhuma vaga encontrada.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {vagas.map((vaga) => (
              <div
                key={vaga.id}
                onClick={() => router.push(`/vagas/${vaga.id}`)}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden cursor-pointer group"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors mb-2">
                        {vaga.title}
                      </h3>
                      <div className="flex items-center gap-2 text-gray-600 mb-3">
                        <Building2 size={18} />
                        <span className="font-medium">{vaga.company?.name || 'Empresa'}</span>
                      </div>
                      <p className="text-blue-600 font-medium mb-3">{vaga.category}</p>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {vaga.description}
                  </p>

                  <div className="flex flex-wrap gap-4 text-sm">
                    {vaga.city && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin size={16} />
                        <span>{vaga.city}</span>
                      </div>
                    )}

                    {vaga.salary && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <DollarSign size={16} />
                        <span>{vaga.salary}</span>
                      </div>
                    )}

                    {vaga.workType && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Briefcase size={16} />
                        <span>{vaga.workType}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-gray-500">
                      <Calendar size={16} />
                      <span>Publicada em {formatDate(vaga.createdAt)}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/vagas/${vaga.id}`);
                      }}
                      className="text-blue-600 hover:text-blue-700 font-semibold"
                    >
                      Ver detalhes da vaga →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}