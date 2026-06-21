'use client';

import { useState } from 'react';
import { UploadCloud, CheckCircle, ArrowLeft, Paperclip } from 'lucide-react';
import Link from 'next/link';
import { t } from '@/lib/i18n';

export default function NovaCandidatura() {
  const [submetido, setSubmetido] = useState(false);

  if (submetido) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[70vh]">
        <CheckCircle className="w-20 h-20 text-green-500 mb-6" />
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{t("page.novaCand.submittedTitle")}</h2>
        <p className="text-gray-500 text-center max-w-md mb-8">
          {t("page.novaCand.submittedText")}
        </p>
        <Link href="/" className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
          {t("page.novaCand.backDashboard")}
        </Link>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <Link href="/badges" className="flex items-center text-blue-600 mb-6 hover:underline font-medium">
        <ArrowLeft className="w-4 h-4 mr-2" />
        {t("page.novaCand.backCatalog")}
      </Link>

      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t("page.novaCand.title")}</h1>
        <p className="text-gray-500 mt-2">
          {t("page.novaCand.sub")}
        </p>
      </header>

      <form 
        onSubmit={(e) => { e.preventDefault(); setSubmetido(true); }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-8"
      >
        <div className="mb-6">
          <label className="block text-sm font-bold text-gray-700 mb-2">
            {t("page.novaCand.linksLabel")}
          </label>
          <textarea
            rows={3}
            className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-lg p-4 focus:ring-blue-500 focus:border-blue-500"
            placeholder={t("page.novaCand.linksPlaceholder")}
            required
          />
        </div>

        <div className="mb-8">
          <label className="block text-sm font-bold text-gray-700 mb-2">
            {t("page.novaCand.docsLabel")}
          </label>
          <div className="w-full flex justify-center items-center border-2 border-dashed border-gray-300 rounded-lg p-10 bg-gray-50 hover:bg-gray-100 transition cursor-pointer group">
            <div className="flex flex-col items-center">
              <UploadCloud className="w-10 h-10 text-gray-400 group-hover:text-blue-500 mb-3 transition-colors" />
              <p className="text-sm text-gray-500 text-center">
                <span className="font-bold text-blue-600">{t("page.novaCand.clickUpload")}</span> {t("page.novaCand.orDrag")}
              </p>
              <p className="text-xs text-gray-400 mt-1">{t("page.novaCand.fileTypes")}</p>
            </div>
          </div>
          
          <div className="mt-4 flex items-center justify-between bg-blue-50 border border-blue-100 p-3 rounded-lg">
            <div className="flex items-center flex-1">
              <Paperclip className="w-5 h-5 text-blue-500 mr-3" />
              <span className="text-sm font-medium text-gray-700">certificacao-outsystems.pdf</span>
            </div>
            <span className="text-xs text-gray-500">2.4 MB</span>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-100">
          <button 
            type="submit" 
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition shadow-sm"
          >
            {t("page.novaCand.submitBtn")}
          </button>
        </div>
      </form>
    </div>
  );
}
