'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Briefcase, MapPin, DollarSign, FileText, Award, Gift } from 'lucide-react';

export default function CriarVaga() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [salary, setSalary] = useState('');
  const [workType, setWorkType] = useState('');
  const [requirements, setRequirements] = useState('');
  const [benefits, setBenefits] = useState('');
  const [city, setCity] = useState('');

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

  const tiposContrato = [
    'CLT',
    'PJ',
    'Temporário',
    'Estágio',
    'Freelance',
    'Meio Período',
  ];

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/login');
      return;
    }

    const user = JSON.parse(userData);
    if (user.type !== 'empresa') {
      alert('Acesso restrito para empresas');
      router.push('/');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');

      const vagaData = {
        title,
        description,
        category,
        salary: salary || 'A combinar',
        workType: workType || null,
        requirements: requirements || null,
        benefits: benefits || null,
        city: city || null,
      };

      const response = await fetch('http://localhost:3000/job-vacancies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(vagaData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erro ao criar vaga');
      }

      alert('Vaga criada com sucesso!');
      router.push('/empresa/dashboard');

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
          >
            <ArrowLeft size={20} />
            Voltar
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Criar Nova Vaga</h1>
          <p className="text-gray-600 mt-2">
            Preencha as informações da vaga para encontrar os melhores candidatos
          </p>
        </div>
      </header>

      {/* Form */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-md p-8">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Título */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Título da Vaga *
              </label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="Ex: Desenvolvedor Full Stack"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Categoria */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Categoria/Função *
              </label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                  placeholder="Ex: Tecnologia, Construção, Saúde..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Descrição */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Descrição da Vaga *
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 text-gray-400" size={20} />
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={5}
                  placeholder="Descreva as responsabilidades e atividades do cargo..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Grid de 2 colunas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Salário */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Salário <span className="text-gray-400 font-normal">(opcional)</span>
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                    placeholder="Ex: R$ 3.000 - R$ 5.000 ou A combinar"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Tipo de Contrato */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tipo de Contrato <span className="text-gray-400 font-normal">(opcional)</span>
                </label>
                <select
                  value={workType}
                  onChange={(e) => setWorkType(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Selecione</option>
                  {tiposContrato.map(tipo => (
                    <option key={tipo} value={tipo}>{tipo}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Cidade */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Cidade <span className="text-gray-400 font-normal">(opcional)</span>
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                >
                  <option value="">Selecione uma cidade</option>
                  {cidades.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Requisitos */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Requisitos <span className="text-gray-400 font-normal">(opcional)</span>
              </label>
              <div className="relative">
                <Award className="absolute left-3 top-3 text-gray-400" size={20} />
                <textarea
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  rows={4}
                  placeholder="Ex: Ensino superior completo, experiência com React, conhecimento em SQL..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Benefícios */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Benefícios <span className="text-gray-400 font-normal">(opcional)</span>
              </label>
              <div className="relative">
                <Gift className="absolute left-3 top-3 text-gray-400" size={20} />
                <textarea
                  value={benefits}
                  onChange={(e) => setBenefits(e.target.value)}
                  rows={4}
                  placeholder="Ex: Vale transporte, Vale refeição, Plano de saúde..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Botões */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 bg-gray-100 text-gray-700 py-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Criando vaga...' : 'Criar Vaga'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}