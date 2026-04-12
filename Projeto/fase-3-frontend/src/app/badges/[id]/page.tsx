'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { ArrowLeft, CheckCircle, UploadCloud, FileText } from 'lucide-react';
import Link from 'next/link';

export default function BadgeDetail() {
  const params = useParams();
  const router = useRouter();
  const [badgeData, setBadgeData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    async function loadBadge() {
      try {
        const response = await api.get(`/badges/${params.id}`);
        setBadgeData(response.data);
      } catch (error) {
        console.error('Erro a carregar badge:', error);
      } finally {
        setLoading(false);
      }
    }
    if (params.id) loadBadge();
  }, [params.id]);

  const handleIniciateApplication = async () => {
    try {
      setCreating(true);
      // FASE 3 WORKFLOW: 1. POST /applications (passando userId 1 por enquanto por falta de auth)
      const resp = await api.post('/applications', { badgeId: Number(params.id) }, { headers: { 'x-user-id': '1' } });
      const applicationId = resp.data.id;
      // 2. Redireciona para o formulário dessa candidatura recém criada
      router.push(`/candidaturas/${applicationId}`);
    } catch (err) {
      console.error("Erro ao iniciar candidatura", err);
      alert("Houve um erro ao iniciar a candidatura.");
      setCreating(false);
    }
  };

  if (loading) return <div className="p-8 text-center">A carregar detalhes do Badge...</div>;
  if (!badgeData?.badge) return <div className="p-8 text-center text-red-500">Badge não encontrado.</div>;

  const { badge, requirements } = badgeData;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Link href="/badges" className="flex items-center text-blue-600 mb-6 hover:underline font-medium">
        <ArrowLeft className="w-4 h-4 mr-2" /> Voltar ao Catálogo
      </Link>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{badge.name}</h1>
            <p className="text-gray-500 text-lg mt-2">{badge.description}</p>
            <div className="flex flex-wrap gap-2 mt-6">
               <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full font-bold text-sm">
                 Nível: {badge.level_name} ({badge.level_code})
               </span>
               <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                 Área: {badge.area_name}
               </span>
               <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm font-bold">
                 Pontos: {badge.points}
               </span>
            </div>
          </div>
          <button 
            onClick={handleIniciateApplication}
            disabled={creating}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-sm disabled:opacity-50 transition"
          >
            {creating ? 'A iniciar...' : 'Candidatar-me'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h2 className="text-xl font-bold mb-6 text-gray-800">Requisitos para Aprovação</h2>
        <div className="space-y-6">
          {(!requirements || requirements.length === 0) ? (
             <p className="text-gray-500 italic">Este badge não tem requisitos específicos documentados.</p>
          ) : (
            requirements.map((req: any, index: number) => (
              <div key={req.id} className="flex gap-4 p-4 border border-gray-100 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold shrink-0">
                  {index + 1}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{req.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{req.description}</p>
                  {req.evidence_instructions && (
                    <div className="mt-3 flex items-start text-sm text-gray-500 bg-yellow-50 p-3 rounded border border-yellow-100">
                      <FileText className="w-4 h-4 text-yellow-600 mr-2 shrink-0 mt-0.5" />
                      <span><strong>Prova necessária: </strong>{req.evidence_instructions}</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}