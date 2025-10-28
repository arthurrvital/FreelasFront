'use client';

import { useState, useEffect } from 'react';
import { Filter, X, DollarSign, MapPin, Briefcase } from 'lucide-react';

export default function FiltrosAvancados({ onFilterChange, activeFilters }) {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  const cidades = [
    'São João del-Rei',
    'Tiradentes',
  ];

  const faixasPreco = [
    { label: 'Até R$ 50', min: 0, max: 50 },
    { label: 'R$ 50 - R$ 100', min: 50, max: 100 },
    { label: 'R$ 100 - R$ 200', min: 100, max: 200 },
    { label: 'R$ 200 - R$ 500', min: 200, max: 500 },
    { label: 'Acima de R$ 500', min: 500, max: null },
  ];

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:3000/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
    }
  };

  const handleFilterChange = (filterType, value) => {
    onFilterChange({ ...activeFilters, [filterType]: value });
  };

  const handlePriceChange = (faixa) => {
    onFilterChange({
      ...activeFilters,
      minPrice: faixa.min,
      maxPrice: faixa.max,
    });
  };

  const clearFilters = () => {
    onFilterChange({});
    setIsOpen(false);
  };

  const countActiveFilters = () => {
    return Object.keys(activeFilters).filter(key => 
      activeFilters[key] !== null && activeFilters[key] !== undefined && activeFilters[key] !== ''
    ).length;
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed bottom-6 right-6 z-50 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all"
      >
        <Filter size={24} />
        {countActiveFilters() > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold">
            {countActiveFilters()}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={`
          fixed md:sticky top-0 left-0 h-screen md:h-auto
          w-80 md:w-full bg-white rounded-xl shadow-lg p-6
          transition-transform duration-300 z-50
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          overflow-y-auto
        `}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Filter className="text-blue-600" size={24} />
            <h3 className="text-xl font-bold text-gray-800">Filtros</h3>
            {countActiveFilters() > 0 && (
              <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full font-semibold">
                {countActiveFilters()}
              </span>
            )}
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <div className="mb-6">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
            <MapPin size={18} className="text-blue-600" />
            Cidade
          </label>
          <select
            value={activeFilters.city || ''}
            onChange={(e) => handleFilterChange('city', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todas as cidades</option>
            {cidades.map((cidade) => (
              <option key={cidade} value={cidade}>
                {cidade}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
            <Briefcase size={18} className="text-blue-600" />
            Categoria
          </label>
          <select
            value={activeFilters.category || ''}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todas as categorias</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
            <DollarSign size={18} className="text-blue-600" />
            Faixa de Preço
          </label>
          <div className="space-y-2">
            {faixasPreco.map((faixa, index) => (
              <button
                key={index}
                onClick={() => handlePriceChange(faixa)}
                className={`
                  w-full text-left px-4 py-2 rounded-lg border transition-colors
                  ${
                    activeFilters.minPrice === faixa.min && activeFilters.maxPrice === faixa.max
                      ? 'bg-blue-50 border-blue-500 text-blue-700'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }
                `}
              >
                {faixa.label}
              </button>
            ))}
          </div>
        </div>

        {countActiveFilters() > 0 && (
          <button
            onClick={clearFilters}
            className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <X size={20} />
            Limpar Filtros
          </button>
        )}
      </div>
    </div>
  );
}