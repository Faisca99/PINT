'use client';

import { useEffect, useState } from 'react';
import { Award, Lock, Search, Loader2 } from 'lucide-react';
import { getTodosBadges } from '@/lib/api';

interface Badge {
  id: string;
  name: string;
  description: string;
  level_name: string;
  area_name: string;
  service_line_name: string;
  points: number;
}

export default function BadgesCatalog() {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function fetchBadges() {
      try {
        const data = await getTodosBadges();
        // Adjust depending on the returned structure (could be data.data)
        setBadges(data || []);
      } catch (error) {
        console.error('Erro ao carregar badges:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchBadges();
  }, []);

  const filteredBadges = badges.filter(b => 
    b.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.service_line_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.area_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Catálogo de Badges</h1>
        <p className="text-gray-500">Explora os níveis e candidata-te aos que tens competências.</p>
      </header>

      <div className="flex mb-6 bg-white p-2 rounded-lg border border-gray-200 shadow-sm w-full md:w-1/2 items-center">
        <Search className="w-5 h-5 text-gray-400 mx-2" />
        <input 
          type="text" 
          placeholder="Pesquisar badges (ex: LowCode, DevOps)..." 
          className="flex-1 outline-none text-gray-700 bg-transparent"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
        </div>
      ) : filteredBadges.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
          <p className="text-gray-500">Nenhum badge encontrado na base de dados.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBadges.map((badge) => (
            <div key={badge.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:border-blue-400 transition cursor-pointer">
              <div className="absolute top-2 right-2 bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full font-bold flex items-center gap-1">
                <Lock className="w-3 h-3"/> {badge.points} pts
              </div>
              <div className="h-2 bg-gray-200"></div>
              <div className="p-6 flex flex-col items-center">
                <Award className="w-16 h-16 text-gray-400 mb-4" />
                <h3 className="font-bold text-lg text-center text-gray-900">{badge.level_name} - {badge.name}</h3>
                <p className="text-sm text-gray-500 text-center mb-4">{badge.service_line_name} / {badge.area_name}</p>
                <a href={`/badges/${badge.id}`} className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-center inline-block">
                  Ver Detalhes do Badge
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
