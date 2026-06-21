'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Award, FileText, Settings, BarChart, LogOut } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  // Não mostramos a Sidebar na página de Login
  if (pathname === '/login') {
    return null;
  }

  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col min-h-screen">
      <div className="p-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Award className="w-8 h-8 text-blue-400" />
          Softinsa Badges
        </h1>
      </div>
      <nav className="flex-1 px-4 space-y-2">
        <Link href="/" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors">
          <Home className="w-5 h-5" />
          Dashboard (Consultor)
        </Link>
        <Link href="/badges" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors">
          <Award className="w-5 h-5" />
          Catálogo de Badges
        </Link>
        <Link href="/candidaturas" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors">
          <FileText className="w-5 h-5" />
          Aprovações (TM / SLL)
        </Link>
        <Link href="/ranking" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors">
          <BarChart className="w-5 h-5" />
          Ranking de Pontos
        </Link>
        <div className="pt-8 mb-4 border-b border-gray-700"></div>
        <Link href="/admin" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors text-gray-400">
          <Settings className="w-5 h-5" />
          Administração
        </Link>
      </nav>
      <div className="p-4 border-t border-gray-800 flex justify-between items-center text-sm text-gray-300">
        <div>
          <p className="font-bold text-white">João Consultor</p>
          <p className="text-xs">Consultor</p>
        </div>
        <Link href="/login" className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-red-400 transition" title="Terminar Sessão">
          <LogOut className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}
