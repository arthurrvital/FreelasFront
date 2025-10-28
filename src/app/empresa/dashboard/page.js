'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, Plus, Briefcase, MapPin, DollarSign, Calendar, Eye, Edit, Trash2, LogOut } from 'lucide-react';

export default function EmpresaDashboard() {
  const router = useRouter();
  const [company, setCompany] = useState(null);
  const [vagas, setVagas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);

    if (parsedUser.type !== 'empresa') {
      alert('Acesso restrito para empresas');
      router.push('/');
      return;
    }

    fetchCompanyData();
    fetchVagas();
  }, []);

  const fetchCompanyData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/companies', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Pegar a empresa do usuário logado
        const myCompany = data.find(c => c.user.id === user?.id);
        setCompany(myCompany);
      }
    } catch (error) {
      console.error('Erro ao buscar dados da empresa:', error);
    }
  };

  const fetchVagas = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/my-job-vacancies', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setVagas(data);
      }
    } catch (error) {
      console.error('Erro ao buscar vagas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVaga = async (id) => {
    if (!confirm('Tem certeza que deseja deletar esta vaga?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/job-vacancies/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert('Vaga deletada com sucesso!');
        fetchVagas();
      } else {
        alert('Erro ao deletar vaga');
      }
    } catch (error) {
      console.error('Erro ao deletar vaga:', error);
      alert('Erro ao deletar vaga');
    }
  };

  const handleToggleStatus = async (vaga) => {
    const novoStatus = vaga.status === 'aberta' ? 'fechada' : 'aberta';

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/job-vacancies/${vaga.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...vaga,
          status: novoStatus,
        }),
      });

      if (response.ok) {
        fetchVagas();
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Building2 className="text-blue-600" size={32} />
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  {company?.name || 'Painel da Empresa'}
                </h1>
                <p className="text-gray-600">{company?.areaAtuacao}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/')}
                className="text-gray-600 hover:text-gray-800"
              >
                Ver Site
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-red-600 hover:text-red-700"
              >
                <LogOut size={20} />
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Briefcase className="text-blue-600" size={24} />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Total de Vagas</p>
                <p className="text-2xl font-bold text-gray-800">{vagas.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <Briefcase className="text-green-600" size={24} />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Vagas Abertas</p>
                <p className="text-2xl font-bold text-gray-800">
                  {vagas.filter(v => v.status === 'aberta').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-4">
              <div className="bg-gray-100 p-3 rounded-lg">
                <Briefcase className="text-gray-600" size={24} />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Vagas Fechadas</p>
                <p className="text-2xl font-bold text-gray-800">
                  {vagas.filter(v => v.status === 'fechada').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Ações */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Minhas Vagas</h2>
          <button
            onClick={() => router.push('/empresa/criar-vaga')}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold transition-colors"
          >
            <Plus size={20} />
            Criar Nova Vaga
          </button>
        </div>

        {/* Lista de Vagas */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Carregando vagas...</p>
          </div>
        ) : vagas.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <Briefcase className="mx-auto text-gray-400 mb-4" size={64} />
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Nenhuma vaga cadastrada
            </h3>
            <p className="text-gray-600 mb-6">
              Comece criando sua primeira vaga de emprego!
            </p>
            <button
              onClick={() => router.push('/empresa/criar-vaga')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold"
            >
              Criar Primeira Vaga
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {vagas.map((vaga) => (
              <div
                key={vaga.id}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-800">
                        {vaga.title}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          vaga.status === 'aberta'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {vaga.status === 'aberta' ? 'Aberta' : 'Fechada'}
                      </span>
                    </div>

                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {vaga.description}
                    </p>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Briefcase size={16} />
                        <span>{vaga.category}</span>
                      </div>

                      {vaga.city && (
                        <div className="flex items-center gap-2">
                          <MapPin size={16} />
                          <span>{vaga.city}</span>
                        </div>
                      )}

                      {vaga.salary && (
                        <div className="flex items-center gap-2">
                          <DollarSign size={16} />
                          <span>{vaga.salary}</span>
                        </div>
                      )}

                      {vaga.workType && (
                        <div className="flex items-center gap-2">
                          <Briefcase size={16} />
                          <span>{vaga.workType}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    <button
                      onClick={() => router.push(`/vagas/${vaga.id}`)}
                      className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Ver detalhes"
                    >
                      <Eye size={18} />
                      Ver
                    </button>

                    <button
                      onClick={() => router.push(`/empresa/editar-vaga/${vaga.id}`)}
                      className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                      title="Editar vaga"
                    >
                      <Edit size={18} />
                      Editar
                    </button>

                    <button
                      onClick={() => handleToggleStatus(vaga)}
                      className={`px-4 py-2 rounded-lg transition-colors font-semibold ${
                        vaga.status === 'aberta'
                          ? 'text-orange-600 hover:bg-orange-50'
                          : 'text-green-600 hover:bg-green-50'
                      }`}
                    >
                      {vaga.status === 'aberta' ? 'Fechar' : 'Abrir'}
                    </button>

                    <button
                      onClick={() => handleDeleteVaga(vaga.id)}
                      className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Deletar vaga"
                    >
                      <Trash2 size={18} />
                      Deletar
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