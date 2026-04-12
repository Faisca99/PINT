'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { UploadCloud, CheckCircle, ArrowLeft, Paperclip } from 'lucide-react';
import Link from 'next/link';
import { api } from '@/lib/api';

export default function ApplicationForm() {
  const params = useParams();
  const router = useRouter();
  
  const [application, setApplication] = useState<any>(null);
  const [badgeInfo, setBadgeInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submetido, setSubmetido] = useState(false);
  const [evidences, setEvidences] = useState<{ reqId: number, url: string }[]>([]);

  // 1. Carregar Dados do Draft
  useEffect(() => {
    async function loadData() {
      try {
        const appRes = await api.get(`/applications/${params.id}`);
        setApplication(appRes.data);

        if (appRes.data?.badge_id) {
          const badgeRes = await api.get(`/badges/${appRes.data.badge_id}`);
          setBadgeInfo(badgeRes.data);
        }
      } catch (err) {
        console.error("Erro ao carregar a candidatura", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [params.id]);

  // Handle do upload fictício (Na real enviaria para o S3 e depois POST evidences)
  const handleUploadFake = async (reqId: number, fileInput: string) => {
      try {
          await api.post(`/applications/${params.id}/evidences`, {
              requirementId: reqId,
              fileName: "prova.pdf",
              storageKey: `aplicacoes/${params.id}/${reqId}/prova.pdf`,
              fileUrl: fileInput,
              description: "Link/Ficheiro submetido pelo utilizador frontend"
          }, { headers: { 'x-user-id': '1' } }); // Auth User = 1 mock
          
          setEvidences(prev => [...prev, { reqId, url: fileInput }]);
          alert("Prova associada ao requisito com sucesso!");
      } catch (err) {
          alert("Erro a enviar prova.");
      }
  }

  const handleSubmitFinal = async (e: any) => {
      e.preventDefault();
      try {
          // Fase 3 Workflow: 3. Finalizar Candidatura para a fila
          await api.post(`/applications/${params.id}/submit`, {}, { headers: { 'x-user-id': '1'} });
          setSubmetido(true);
      } catch (err) {
          alert('Erro a submeter para avaliação final.');
      }
  };

  if (loading) return <div className="p-8 text-center">A carregar formulário...</div>;
  if (!application) return <div className="p-8 text-center text-red-500">Candidatura não encontrada.</div>;
  if (application.status !== 'open') return <div className="p-8 text-center text-orange-500">Esta candidatura já está submetida ou fechada. Status: {application.status}</div>;

  if (submetido) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[70vh]">
        <CheckCircle className="w-20 h-20 text-green-500 mb-6" />
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Candidatura Submetida!</h2>
        <p className="text-gray-500 text-center max-w-md mb-8">
          A tua candidatura para o badge <strong>{application.badge_name}</strong> foi transferida para "Em Validação" e será revista por um Talent Manager.
        </p>
        <Link href="/" className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
          Voltar ao Dashboard
        </Link>
      </div>
    );
  }

  const requirements = badgeInfo?.requirements || [];

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <Link href={`/badges/${application.badge_id}`} className="flex items-center text-blue-600 mb-6 hover:underline font-medium">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Voltar à Informação do Badge
      </Link>

      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Submeter Evidências</h1>
        <p className="text-gray-500 mt-2">
          Estás neste momento a anexar as tuas qualificações ao pedido de obtenção do badge <strong className="text-gray-800">{application.badge_name}</strong>.
        </p>
      </header>

      <form 
        onSubmit={handleSubmitFinal}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-8"
      >
          {requirements.map((req: any, index: number) => {
            const hasEvidence = evidences.find(e => e.reqId === req.id);
            return (
              <div key={req.id} className="mb-8 border-b pb-6 border-gray-100 last:border-0 last:pb-0">
                <label className="block text-sm font-bold text-gray-700 mb-1">
                   REQUISITO {index + 1}: {req.title}
                </label>
                <p className="text-xs text-gray-500 mb-4 block">{req.description} ({req.evidence_instructions})</p>
                
                {hasEvidence ? (
                  <div className="mt-4 flex items-center justify-between bg-green-50 border border-green-100 p-3 rounded-lg">
                    <div className="flex items-center flex-1">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                      <span className="text-sm font-medium text-gray-700">Evidência Carregada e Associada</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <input 
                      id={`req-input-${req.id}`}
                      type="url" 
                      placeholder="Insira Link (GitHub, Certificado Público, etc)"
                      className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-lg p-3 text-sm"
                    />
                    <button 
                      type="button" 
                      onClick={(e) => {
                          const input = document.getElementById(`req-input-${req.id}`) as HTMLInputElement;
                          if(input.value) handleUploadFake(req.id, input.value);
                      }}
                      className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-4 py-2 mt-2 rounded-lg font-semibold text-sm transition"
                    >
                      Gravar URL como Evidência
                    </button>
                  </div>
                )}
              </div>
            );
          })}

        <div className="flex justify-end pt-4 border-t border-gray-100 mt-6">
          <button 
            type="submit" 
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition shadow-sm disabled:opacity-50"
            disabled={evidences.length !== requirements.length && requirements.length > 0}
            title={evidences.length !== requirements.length ? "Carregue todas as provas antes de submeter" : ""}
          >
            Submeter Pedido para Avaliação
          </button>
        </div>
      </form>
    </div>
  );
}