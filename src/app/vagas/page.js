'use client';

import { useState, useEffect } from 'react';
import { Briefcase, MapPin, DollarSign, Clock, Building2, MessageCircle, User } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function VagasPage() {
  const router = useRouter();
  const [vagas, setVagas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchVagas();
  }, []);

  const fetchVagas = async () => {
    try {
      const response = await fetch('http://localhost:3000/job-vacancies');
      const data = await response.json();
      setVagas(data);
    } catch (error) {
      console.error('Erro ao buscar vagas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchVagas();
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/search/vacancies?q=${searchQuery}`);
      const data = await response.json();
      setVagas(data);
    } catch (error) {
      console.error('Erro na busca:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (e, vagaId) => {
    e.stopPropagation(); // Evita abrir a página de detalhes
    try {
      const response = await fetch(`http://localhost:3000/job-vacancies/${vagaId}/apply`);
      const data = await response.json();
      
      if (data.whatsappLink) {
        window.open(data.whatsappLink, '_blank');
      }
    } catch (error) {
      console.error('Erro ao gerar link:', error);
      alert('Erro ao gerar link do WhatsApp');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-blue-600">Freelas SJDR</h1>
          </div>

          {/* Navegação - Tabs */}
          <div className="flex gap-4 mb-4 border-b border-gray-200">
            <button
              onClick={() => router.push('/')}
              className="pb-3 px-4 border-b-2 border-transparent text-gray-600 hover:text-gray-800 font-semibold flex items-center gap-2"
            >
              <User size={20} />
              Prestadores de Serviço
            </button>
            <button
              className="pb-3 px-4 border-b-2 border-blue-600 text-blue-600 font-semibold flex items-center gap-2"
            >
              <Briefcase size={20} />
              Vagas de Emprego
            </button>
          </div>

          {/* Busca */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Buscar vagas por cargo, categoria ou cidade..."
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
          Vagas Disponíveis
        </h2>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Carregando vagas...</p>
          </div>
        ) : vagas.length === 0 ? (
          <div className="text-center py-12">
            <Briefcase size={64} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 text-lg">
              Nenhuma vaga disponível no momento.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {vagas.map((vaga) => (
              <div
                key={vaga.id}
                onClick={() => router.push(`/vagas/${vaga.id}`)}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer p-6 hover:scale-[1.01]"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  {/* Informações principais */}
                  <div className="flex-1">
                    <div className="flex items-start gap-4 mb-4">
                      {/* Logo/Avatar da empresa */}
                      <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                        {vaga.company.avatar ? (
                          <img
                            src={`http://localhost:3000${vaga.company.avatar}`}
                            alt={vaga.company.name}
                            className="w-full h-full rounded-lg object-cover"
                          />
                        ) : (
                          <Building2 size={32} className="text-white" />
                        )}
                      </div>

                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-800 mb-1 hover:text-blue-600 transition-colors">
                          {vaga.title}
                        </h3>
                        <p className="text-blue-600 font-medium mb-2">
                          {vaga.company.name}
                        </p>
                        
                        {/* Badges */}
                        <div className="flex flex-wrap gap-2">
                          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                            {vaga.category}
                          </span>
                          {vaga.workType && (
                            <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                              {vaga.workType}
                            </span>
                          )}
                          {vaga.status === 'aberta' && (
                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                              Vaga Aberta
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Descrição */}
                    <p className="text-gray-600 mb-4 leading-relaxed line-clamp-2">
                      {vaga.description}
                    </p>

                    {/* Informações */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                      {vaga.city && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin size={18} className="text-blue-600" />
                          <span className="text-sm">{vaga.city}</span>
                        </div>
                      )}
                      {vaga.salary && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <DollarSign size={18} className="text-blue-600" />
                          <span className="text-sm">{vaga.salary}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock size={18} className="text-blue-600" />
                        <span className="text-sm">
                          Publicado {new Date(vaga.createdAt).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </div>

                    {/* Preview de Requisitos */}
                    {vaga.requirements && (
                      <div className="mb-2">
                        <h4 className="font-semibold text-gray-800 text-sm mb-1">Requisitos:</h4>
                        <p className="text-gray-600 text-sm line-clamp-2">{vaga.requirements}</p>
                      </div>
                    )}
                  </div>

                  {/* Botão de Candidatura */}
                  <div className="md:w-64 flex-shrink-0 flex flex-col gap-2">
                    <button
                      onClick={(e) => handleApply(e, vaga.id)}
                      className="w-full bg-green-500 text-white px-6 py-3 rounded-xl hover:bg-green-600 font-semibold transition-colors flex items-center justify-center gap-2"
                    >
                      <MessageCircle size={20} />
                      Candidatar-se
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/vagas/${vaga.id}`);
                      }}
                      className="w-full bg-blue-100 text-blue-700 px-6 py-3 rounded-xl hover:bg-blue-200 font-semibold transition-colors"
                    >
                      Ver Detalhes
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