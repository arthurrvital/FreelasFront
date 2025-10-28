'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Building2, MapPin, DollarSign, Briefcase, Calendar, Award, Gift, MessageCircle } from 'lucide-react';

export default function VagaDetalhes() {
  const router = useRouter();
  const params = useParams();
  const [vaga, setVaga] = useState(null);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchVaga();
    }
  }, [params.id]);

  const fetchVaga = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/job-vacancies/${params.id}`);
      
      if (!response.ok) {
        throw new Error('Vaga não encontrada');
      }

      const data = await response.json();
      setVaga(data);
      setCompany(data.company);
    } catch (error) {
      console.error('Erro ao buscar vaga:', error);
      alert('Vaga não encontrada');
      router.push('/vagas');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const handleContact = () => {
    if (company?.whatsapp) {
      const message = `Olá! Vi a vaga de ${vaga.title} no Freelas SJDR e gostaria de me candidatar.`;
      const whatsappUrl = `https://wa.me/55${company.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    } else {
      alert('WhatsApp não disponível');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Carregando vaga...</p>
        </div>
      </div>
    );
  }

  if (!vaga) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button
            onClick={() => router.push('/vagas')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
          >
            <ArrowLeft size={20} />
            Voltar para vagas
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Header da Vaga */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">{vaga.title}</h1>
                <div className="flex items-center gap-2 text-blue-100 mb-2">
                  <Building2 size={20} />
                  <span className="text-lg">{company?.name || 'Empresa'}</span>
                </div>
                <p className="text-blue-100">{vaga.category}</p>
              </div>
              <span className="bg-white/20 px-4 py-2 rounded-lg text-sm font-semibold">
                Vaga Aberta
              </span>
            </div>
          </div>

          {/* Informações Rápidas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-gray-50 border-b">
            {vaga.city && (
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <MapPin className="text-blue-600" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Localização</p>
                  <p className="font-semibold text-gray-800">{vaga.city}</p>
                </div>
              </div>
            )}

            {vaga.salary && (
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-3 rounded-lg">
                  <DollarSign className="text-green-600" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Salário</p>
                  <p className="font-semibold text-gray-800">{vaga.salary}</p>
                </div>
              </div>
            )}

            {vaga.workType && (
              <div className="flex items-center gap-3">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <Briefcase className="text-purple-600" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tipo de Contrato</p>
                  <p className="font-semibold text-gray-800">{vaga.workType}</p>
                </div>
              </div>
            )}
          </div>

          {/* Descrição */}
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Sobre a Vaga</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line mb-8">
              {vaga.description}
            </p>

            {/* Requisitos */}
            {vaga.requirements && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Award className="text-blue-600" size={24} />
                  <h3 className="text-xl font-bold text-gray-800">Requisitos</h3>
                </div>
                <div className="bg-gray-50 rounded-lg p-6">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {vaga.requirements}
                  </p>
                </div>
              </div>
            )}

            {/* Benefícios */}
            {vaga.benefits && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Gift className="text-green-600" size={24} />
                  <h3 className="text-xl font-bold text-gray-800">Benefícios</h3>
                </div>
                <div className="bg-green-50 rounded-lg p-6">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {vaga.benefits}
                  </p>
                </div>
              </div>
            )}

            {/* Informações da Empresa */}
            <div className="bg-blue-50 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Sobre a Empresa</h3>
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Building2 className="text-blue-600" size={32} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-800 text-lg mb-1">
                    {company?.name}
                  </h4>
                  {company?.areaAtuacao && (
                    <p className="text-blue-600 mb-2">{company.areaAtuacao}</p>
                  )}
                  {company?.description && (
                    <p className="text-gray-700 leading-relaxed">
                      {company.description}
                    </p>
                  )}
                  {company?.website && (
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 text-sm mt-2 inline-block"
                    >
                      Visitar site da empresa →
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Data de Publicação */}
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-8">
              <Calendar size={16} />
              <span>Publicada em {formatDate(vaga.createdAt)}</span>
            </div>

            {/* Botão de Contato */}
            {company?.whatsapp && (
              <button
                onClick={handleContact}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all flex items-center justify-center gap-2 text-lg"
              >
                <MessageCircle size={24} />
                Candidatar-se via WhatsApp
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}