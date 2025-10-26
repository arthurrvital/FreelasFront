'use client';

import { useState, useEffect } from 'react';
import { 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Clock, 
  Building2, 
  ArrowLeft, 
  MessageCircle,
  CheckCircle,
  Calendar,
  Users,
  Award
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

export default function VagaDetalhes() {
  const params = useParams();
  const router = useRouter();
  const [vaga, setVaga] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVaga();
  }, [params.id]);

  const fetchVaga = async () => {
    try {
      const response = await fetch(`http://localhost:3000/job-vacancies/${params.id}`);
      const data = await response.json();
      setVaga(data);
    } catch (error) {
      console.error('Erro ao buscar vaga:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    try {
      const response = await fetch(`http://localhost:3000/job-vacancies/${params.id}/apply`);
      const data = await response.json();
      
      if (data.whatsappLink) {
        window.open(data.whatsappLink, '_blank');
      }
    } catch (error) {
      console.error('Erro ao gerar link:', error);
      alert('Erro ao gerar link do WhatsApp');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Carregando vaga...</p>
        </div>
      </div>
    );
  }

  if (!vaga) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Briefcase size={64} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 text-lg mb-4">Vaga não encontrada</p>
          <button
            onClick={() => router.push('/vagas')}
            className="text-blue-600 hover:text-blue-700"
          >
            Voltar para vagas
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <button
            onClick={() => router.push('/vagas')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft size={20} />
            Voltar para vagas
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Card Principal */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          {/* Banner */}
          <div className="h-48 bg-gradient-to-r from-blue-500 to-indigo-600"></div>

          {/* Informações Principais */}
          <div className="px-8 pb-8">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between -mt-16 mb-6">
              {/* Logo da Empresa */}
              <div className="flex items-end gap-4">
                <div className="w-32 h-32 rounded-2xl bg-white p-2 shadow-lg">
                  {vaga.company.avatar ? (
                    <img
                      src={`http://localhost:3000${vaga.company.avatar}`}
                      alt={vaga.company.name}
                      className="w-full h-full rounded-xl object-cover"
                    />
                  ) : (
                    <div className="w-full h-full rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
                      <Building2 size={64} className="text-white" />
                    </div>
                  )}
                </div>
                <div className="pb-2">
                  <h1 className="text-3xl font-bold text-gray-800">
                    {vaga.title}
                  </h1>
                  <p className="text-xl text-blue-600 font-medium">
                    {vaga.company.name}
                  </p>
                </div>
              </div>

              {/* Status da Vaga */}
              {vaga.status === 'aberta' && (
                <div className="mt-4 md:mt-0 bg-green-50 px-6 py-3 rounded-xl">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={24} className="text-green-500" />
                    <span className="text-lg font-bold text-green-700">Vaga Aberta</span>
                  </div>
                </div>
              )}
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-3 mb-6">
              <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                <Briefcase size={16} />
                {vaga.category}
              </span>
              {vaga.workType && (
                <span className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium">
                  {vaga.workType}
                </span>
              )}
              {vaga.experienceLevel && (
                <span className="bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                  <Award size={16} />
                  {vaga.experienceLevel}
                </span>
              )}
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {vaga.city && (
                <div className="flex items-center gap-3 text-gray-700">
                  <MapPin size={20} className="text-blue-600" />
                  <span>{vaga.city}</span>
                </div>
              )}
              {vaga.salary && (
                <div className="flex items-center gap-3 text-gray-700">
                  <DollarSign size={20} className="text-blue-600" />
                  <span>{vaga.salary}</span>
                </div>
              )}
              <div className="flex items-center gap-3 text-gray-700">
                <Calendar size={20} className="text-blue-600" />
                <span>Publicado {new Date(vaga.createdAt).toLocaleDateString('pt-BR')}</span>
              </div>
            </div>

            {/* Descrição */}
            {vaga.description && (
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <Briefcase size={24} />
                  Sobre a Vaga
                </h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {vaga.description}
                </p>
              </div>
            )}

            {/* Requisitos */}
            {vaga.requirements && (
              <div className="mb-6 bg-blue-50 p-6 rounded-xl">
                <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <CheckCircle size={24} className="text-blue-600" />
                  Requisitos
                </h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {vaga.requirements}
                </p>
              </div>
            )}

            {/* Benefícios */}
            {vaga.benefits && (
              <div className="mb-6 bg-green-50 p-6 rounded-xl">
                <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <Award size={24} className="text-green-600" />
                  Benefícios
                </h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {vaga.benefits}
                </p>
              </div>
            )}

            {/* Informações da Empresa */}
            <div className="mb-6 bg-gray-50 p-6 rounded-xl">
              <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                <Building2 size={24} />
                Sobre a Empresa
              </h2>
              <p className="text-lg font-semibold text-gray-700 mb-2">{vaga.company.name}</p>
              {vaga.company.email && (
                <p className="text-gray-600">Email: {vaga.company.email}</p>
              )}
              {vaga.company.phone && (
                <p className="text-gray-600">Telefone: {vaga.company.phone}</p>
              )}
            </div>

            {/* Botão de Candidatura */}
            <div className="flex flex-col md:flex-row gap-4">
              <button
                onClick={handleApply}
                className="flex-1 bg-green-500 text-white px-8 py-4 rounded-xl hover:bg-green-600 font-semibold transition-colors flex items-center justify-center gap-3 text-lg"
              >
                <MessageCircle size={24} />
                Candidatar-se via WhatsApp
              </button>
              <button
                onClick={() => router.push('/vagas')}
                className="md:w-auto bg-gray-200 text-gray-700 px-8 py-4 rounded-xl hover:bg-gray-300 font-semibold transition-colors"
              >
                Ver Outras Vagas
              </button>
            </div>

            <p className="text-sm text-gray-500 text-center mt-4">
              Ao se candidatar, você será direcionado para o WhatsApp da empresa
            </p>
          </div>
        </div>

        {/* Informações Adicionais */}
        <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
          <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
            <Users size={20} className="text-blue-600" />
            Dica de Candidatura
          </h3>
          <p className="text-gray-600 text-sm">
            Antes de se candidatar, certifique-se de que atende aos requisitos da vaga. 
            Prepare um currículo atualizado e esteja pronto para falar sobre sua experiência 
            e como você pode contribuir para a empresa.
          </p>
        </div>
      </main>
    </div>
  );
}