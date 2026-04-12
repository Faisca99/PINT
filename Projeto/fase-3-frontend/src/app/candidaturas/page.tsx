import { Check, X, Search, MoreVertical } from 'lucide-react';

export default function AprovarCandidaturas() {
  return (
    <div className="p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Gestão de Aprovações</h1>
        <p className="text-gray-500">Caixa de entrada de candidaturas para validação (Perfil: Talent Manager / SLL).</p>
      </header>

      {/* Caixa de Entrada de Aprovações */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-10">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h2 className="font-bold border-l-4 border-l-yellow-500 pl-3">A Aguardar Ação (3)</h2>
          <div className="flex bg-white px-3 py-1 rounded-full border border-gray-200 shadow-sm text-sm">
            <Search className="w-4 h-4 text-gray-400 mr-2" />
            <input type="text" placeholder="Procurar consultor..." className="outline-none w-48 text-gray-700 bg-transparent" />
          </div>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-sm uppercase">
              <th className="px-6 py-4 font-semibold border-b border-gray-100">Consultor</th>
              <th className="px-6 py-4 font-semibold border-b border-gray-100">Badge Requerido</th>
              <th className="px-6 py-4 font-semibold border-b border-gray-100">Data</th>
              <th className="px-6 py-4 font-semibold border-b border-gray-100">Estado Atual</th>
              <th className="px-6 py-4 font-semibold border-b border-gray-100">Ações</th>
            </tr>
          </thead>
          <tbody className="text-gray-800 text-sm">
            {/* Linha 1 */}
            <tr className="hover:bg-gray-50 transition border-b border-gray-50">
              <td className="px-6 py-4 font-medium flex items-center">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold mr-3">JC</div>
                João Consultor
              </td>
              <td className="px-6 py-4 font-medium">B1 (Intermédio) <br/><span className="text-xs text-gray-500 font-normal">LowCode</span></td>
              <td className="px-6 py-4 text-gray-500">Hoje, 10:45</td>
              <td className="px-6 py-4">
                <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-bold leading-none">
                  A Validação (TM)
                </span>
              </td>
              <td className="px-6 py-4 flex items-center gap-2">
                <button className="text-white bg-green-500 hover:bg-green-600 p-2 rounded shadow-sm transition" title="Aprovar e passar a SLL">
                  <Check className="w-4 h-4" />
                </button>
                <button className="text-white bg-red-500 hover:bg-red-600 p-2 rounded shadow-sm transition" title="Rejeitar Candidatura">
                  <X className="w-4 h-4" />
                </button>
                <button className="text-gray-400 hover:text-blue-500 ml-2 transition">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </td>
            </tr>

            {/* Linha 2 */}
            <tr className="hover:bg-gray-50 transition border-b border-gray-50">
              <td className="px-6 py-4 font-medium flex items-center">
                <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold mr-3">MS</div>
                Maria Sousa
              </td>
              <td className="px-6 py-4 font-medium">C2 (Especialista) <br/><span className="text-xs text-gray-500 font-normal">DevSecOps</span></td>
              <td className="px-6 py-4 text-gray-500">Ontem, 16:30</td>
              <td className="px-6 py-4">
                <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold leading-none">
                  A Validação (SLL)
                </span>
              </td>
              <td className="px-6 py-4 flex items-center gap-2 text-gray-400 text-xs italic">
                (A aguardar SLL)
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
