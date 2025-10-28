'use client';

import { useState } from 'react';
import { User, Building2, Briefcase, Mail, Lock, Phone, MapPin, DollarSign, Globe } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LoginRegisterPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('login');
  const [accountType, setAccountType] = useState('cliente');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [negotiatePrice, setNegotiatePrice] = useState(false);

  // Login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Cadastro - Campos comuns
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  
  // Prestador
  const [category, setCategory] = useState('');
  const [city, setCity] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [bio, setBio] = useState('');
  const [experience, setExperience] = useState('');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  
  // Empresa
  const [companyName, setCompanyName] = useState('');
  const [areaAtuacao, setAreaAtuacao] = useState('');
  const [phoneCommercial, setPhoneCommercial] = useState('');
  const [whatsappCommercial, setWhatsappCommercial] = useState('');
  const [description, setDescription] = useState('');
  const [website, setWebsite] = useState('');

  const cidades = [
    'São João del-Rei',
    'Tiradentes',
  ];

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3000/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });

      const data = await response.json();

     if (!response.ok) {
  throw new Error(data.error || 'Erro ao fazer login');
}

localStorage.setItem('token', data.token);
localStorage.setItem('user', JSON.stringify(data.user));

if (data.user.type === 'empresa') {
  window.location.href = '/empresa/dashboard';
} else {
  window.location.href = '/';
}

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userData = {
        email,
        password,
        accountType,
        type: accountType,
      };

      if (accountType === 'cliente') {
        userData.name = name;
        userData.phone = phone || null;
      } else if (accountType === 'prestador') {
        userData.name = name;
        userData.phone = phone;
        userData.whatsapp = whatsapp;
      } else if (accountType === 'empresa') {
        userData.name = companyName;
        userData.phone = phoneCommercial;
        userData.whatsapp = whatsappCommercial;
      }

      const response = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar conta');
      }

      if (accountType === 'prestador') {
        const providerData = {
          category,
          city,
          bio: bio || null,
          experience: experience || null,
          priceMin: negotiatePrice || !priceMin ? null : parseFloat(priceMin),
          priceMax: negotiatePrice || !priceMax ? null : parseFloat(priceMax),
        };

        const providerResponse = await fetch('http://localhost:3000/providers', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${data.token}`,
          },
          body: JSON.stringify(providerData),
        });

        if (!providerResponse.ok) {
          throw new Error('Erro ao criar perfil de prestador');
        }
      }

      if (accountType === 'empresa') {
        console.log('Token sendo enviado:', data.token);

        const companyData = {
          name: companyName,
          areaAtuacao,
          city,
          phone: phoneCommercial,
          whatsapp: whatsappCommercial,
          description: description || null,
          website: website || null,
        };

        console.log('Dados da empresa:', companyData);

        const companyResponse = await fetch('http://localhost:3000/companies', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${data.token}`,
          },
          body: JSON.stringify(companyData),
        });

        console.log('Status:', companyResponse.status);

        if (!companyResponse.ok) {
          throw new Error('Erro ao criar perfil de empresa');
        }
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      if (accountType === 'empresa') {
        router.push('/empresa/dashboard');
      } else {
        router.push('/');
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden">
        
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-center py-8">
          <h1 className="text-3xl font-bold mb-2">Freelas SJDR</h1>
          <p className="text-blue-100">Conectando profissionais e oportunidades</p>
        </div>

        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-4 text-center font-semibold transition-colors ${
              activeTab === 'login'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Entrar
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-4 text-center font-semibold transition-colors ${
              activeTab === 'register'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Cadastrar
          </button>
        </div>

        <div className="p-8">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          {activeTab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                    placeholder="seu@email.com"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Senha</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <a href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700">
                  Esqueceu a senha?
                </a>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 text-lg"
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </button>
            </form>
          )}

          {activeTab === 'register' && (
            <>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <button
                  type="button"
                  onClick={() => setAccountType('cliente')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    accountType === 'cliente'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <User className={`mx-auto mb-2 ${accountType === 'cliente' ? 'text-blue-500' : 'text-gray-400'}`} size={32} />
                  <p className={`font-semibold text-sm ${accountType === 'cliente' ? 'text-blue-500' : 'text-gray-600'}`}>
                    Cliente
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setAccountType('prestador')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    accountType === 'prestador'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Briefcase className={`mx-auto mb-2 ${accountType === 'prestador' ? 'text-blue-500' : 'text-gray-400'}`} size={32} />
                  <p className={`font-semibold text-sm ${accountType === 'prestador' ? 'text-blue-500' : 'text-gray-600'}`}>
                    Prestador
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setAccountType('empresa')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    accountType === 'empresa'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Building2 className={`mx-auto mb-2 ${accountType === 'empresa' ? 'text-blue-500' : 'text-gray-400'}`} size={32} />
                  <p className={`font-semibold text-sm ${accountType === 'empresa' ? 'text-blue-500' : 'text-gray-600'}`}>
                    Empresa
                  </p>
                </button>
              </div>

              <form onSubmit={handleRegister} className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                
                {accountType === 'cliente' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nome Completo</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Senha</label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Telefone <span className="text-gray-400 text-xs">(opcional)</span>
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="(00) 00000-0000"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </>
                )}

                {accountType === 'prestador' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nome Completo</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Senha</label>
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          minLength={6}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Categoria/Profissão</label>
                      <input
                        type="text"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                        placeholder="Ex: Eletricista, Designer, Desenvolvedor..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Cidade</label>
                      <select
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Selecione uma cidade</option>
                        {cidades.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Telefone</label>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          required
                          placeholder="(00) 00000-0000"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp</label>
                        <input
                          type="tel"
                          value={whatsapp}
                          onChange={(e) => setWhatsapp(e.target.value)}
                          required
                          placeholder="(00) 00000-0000"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bio/Descrição <span className="text-gray-400 text-xs">(opcional)</span>
                      </label>
                      <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        rows={3}
                        placeholder="Conte sobre você e seus serviços..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Experiência <span className="text-gray-400 text-xs">(opcional)</span>
                      </label>
                      <input
                        type="text"
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)}
                        placeholder="Ex: 5 anos, 10+ anos..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={negotiatePrice}
                          onChange={(e) => setNegotiatePrice(e.target.checked)}
                          className="w-5 h-5 text-blue-600 rounded"
                        />
                        <span className="font-medium text-gray-700">
                          Prefiro negociar valores individualmente
                        </span>
                      </label>
                    </div>

                    {!negotiatePrice && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Preço Mínimo <span className="text-gray-400 text-xs">(opcional)</span>
                          </label>
                          <input
                            type="number"
                            value={priceMin}
                            onChange={(e) => setPriceMin(e.target.value)}
                            placeholder="0.00"
                            step="0.01"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Preço Máximo <span className="text-gray-400 text-xs">(opcional)</span>
                          </label>
                          <input
                            type="number"
                            value={priceMax}
                            onChange={(e) => setPriceMax(e.target.value)}
                            placeholder="0.00"
                            step="0.01"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    )}
                  </>
                )}

                {accountType === 'empresa' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nome da Empresa</label>
                      <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Senha</label>
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          minLength={6}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Área de Atuação</label>
                      <input
                        type="text"
                        value={areaAtuacao}
                        onChange={(e) => setAreaAtuacao(e.target.value)}
                        required
                        placeholder="Ex: Construção Civil, Tecnologia..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Cidade</label>
                      <select
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Selecione uma cidade</option>
                        {cidades.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Telefone Comercial</label>
                        <input
                          type="tel"
                          value={phoneCommercial}
                          onChange={(e) => setPhoneCommercial(e.target.value)}
                          required
                          placeholder="(00) 0000-0000"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp Comercial</label>
                        <input
                          type="tel"
                          value={whatsappCommercial}
                          onChange={(e) => setWhatsappCommercial(e.target.value)}
                          required
                          placeholder="(00) 00000-0000"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Descrição da Empresa <span className="text-gray-400 text-xs">(opcional)</span>
                      </label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                        placeholder="Conte sobre sua empresa..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Site <span className="text-gray-400 text-xs">(opcional)</span>
                      </label>
                      <input
                        type="url"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        placeholder="https://www.exemplo.com.br"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 text-lg mt-4"
                >
                  {loading ? 'Criando conta...' : 'Criar Conta'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}